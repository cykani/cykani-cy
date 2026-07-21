import { eq, desc } from "drizzle-orm";
import { apiKeys } from "../db/schema";
import type { DB } from "../db/client";
import { AppError } from "../../shared/errors";
import type { Result } from "../../shared/result";
import { Ok, Err } from "../../shared/result";
import { nanoid } from "nanoid";
import { createHmac, randomBytes } from "crypto";

export interface ApiKeyProps {
  id: string;
  orgId: string;
  name: string;
  scopes: string[];
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
}

export class ApiKey {
  readonly id: string;
  readonly orgId: string;
  readonly name: string;
  readonly scopes: string[];
  readonly lastUsedAt: Date | null;
  readonly expiresAt: Date | null;
  readonly createdAt: Date;

  private constructor(p: ApiKeyProps) {
    this.id = p.id;
    this.orgId = p.orgId;
    this.name = p.name;
    this.scopes = p.scopes;
    this.lastUsedAt = p.lastUsedAt;
    this.expiresAt = p.expiresAt;
    this.createdAt = p.createdAt;
  }

  static reconstitute(p: ApiKeyProps) {
    return new ApiKey(p);
  }

  toJSON(): ApiKeyProps {
    return {
      id: this.id,
      orgId: this.orgId,
      name: this.name,
      scopes: this.scopes,
      lastUsedAt: this.lastUsedAt,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
    };
  }
}

export class ApiKeyService {
  constructor(private readonly db: DB, private readonly apiSecret: string) {}

  async listByOrg(orgId: string): Promise<ApiKey[]> {
    const rows = await this.db.select().from(apiKeys).where(eq(apiKeys.orgId, orgId)).orderBy(desc(apiKeys.createdAt));
    return rows.map((r) => ApiKey.reconstitute({
      id: r.id,
      orgId: r.orgId,
      name: r.name,
      scopes: (r.scopes as string[]) ?? [],
      lastUsedAt: r.lastUsedAt ?? null,
      expiresAt: r.expiresAt ?? null,
      createdAt: r.createdAt,
    }));
  }

  async create(orgId: string, name: string, scopes: string[] = []): Promise<Result<{ key: ApiKey; raw: string }>> {
    if (!name?.trim()) return Err(AppError.validation("Key name is required"));

    const raw = `ck_${orgId}_${randomBytes(32).toString("hex")}`;
    const keyHash = createHmac("sha256", this.apiSecret).update(orgId).digest("hex");

    const id = nanoid();
    const now = new Date();

    await this.db.insert(apiKeys).values({
      id,
      orgId,
      keyHash,
      name: name.trim(),
      scopes: scopes as any,
      createdAt: now,
    });

    const key = ApiKey.reconstitute({
      id,
      orgId,
      name: name.trim(),
      scopes,
      lastUsedAt: null,
      expiresAt: null,
      createdAt: now,
    });

    return Ok({ key, raw });
  }

  async revoke(orgId: string, id: string): Promise<Result<void>> {
    const [existing] = await this.db.select().from(apiKeys).where(eq(apiKeys.id, id));
    if (!existing) return Err(AppError.notFound("API key", id));
    if (existing.orgId !== orgId) return Err(AppError.forbidden("Not your key"));
    await this.db.delete(apiKeys).where(eq(apiKeys.id, id));
    return Ok(undefined);
  }
}
