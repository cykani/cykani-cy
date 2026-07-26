import { eq, desc } from "drizzle-orm";
import { licenseKeys } from "../db/schema";
import type { DB } from "../db/client";
import { AppError } from "../../shared/errors";
import type { Result } from "../../shared/result";
import { Ok, Err } from "../../shared/result";
import { nanoid } from "nanoid";
import { createHmac, randomBytes } from "crypto";

export interface LicenseKeyProps {
  id: string;
  orgId: string;
  keyHash: string;
  plan: string;
  lemonSqueezyCustomerId: string | null;
  lemonSqueezySubscriptionId: string | null;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
}

export class LicenseKey {
  readonly id: string;
  readonly orgId: string;
  readonly keyHash: string;
  readonly plan: string;
  readonly lemonSqueezyCustomerId: string | null;
  readonly lemonSqueezySubscriptionId: string | null;
  readonly expiresAt: Date | null;
  readonly lastUsedAt: Date | null;
  readonly createdAt: Date;

  private constructor(p: LicenseKeyProps) {
    this.id = p.id;
    this.orgId = p.orgId;
    this.keyHash = p.keyHash;
    this.plan = p.plan;
    this.lemonSqueezyCustomerId = p.lemonSqueezyCustomerId;
    this.lemonSqueezySubscriptionId = p.lemonSqueezySubscriptionId;
    this.expiresAt = p.expiresAt;
    this.lastUsedAt = p.lastUsedAt;
    this.createdAt = p.createdAt;
  }

  static reconstitute(p: LicenseKeyProps) {
    return new LicenseKey(p);
  }

  toJSON(): LicenseKeyProps {
    return {
      id: this.id,
      orgId: this.orgId,
      keyHash: this.keyHash,
      plan: this.plan,
      lemonSqueezyCustomerId: this.lemonSqueezyCustomerId,
      lemonSqueezySubscriptionId: this.lemonSqueezySubscriptionId,
      expiresAt: this.expiresAt,
      lastUsedAt: this.lastUsedAt,
      createdAt: this.createdAt,
    };
  }
}

export class LicenseKeyService {
  constructor(private readonly db: DB, private readonly apiSecret: string) {}

  async listByOrg(orgId: string): Promise<LicenseKey[]> {
    const rows = await this.db.select().from(licenseKeys).where(eq(licenseKeys.orgId, orgId)).orderBy(desc(licenseKeys.createdAt));
    return rows.map((r) => LicenseKey.reconstitute({
      id: r.id,
      orgId: r.orgId,
      keyHash: r.keyHash,
      plan: r.plan,
      lemonSqueezyCustomerId: r.lemonSqueezyCustomerId ?? null,
      lemonSqueezySubscriptionId: r.lemonSqueezySubscriptionId ?? null,
      expiresAt: r.expiresAt ?? null,
      lastUsedAt: r.lastUsedAt ?? null,
      createdAt: r.createdAt,
    }));
  }

  async createForOrg(orgId: string, plan: string, lemonSqueezyCustomerId?: string, lemonSqueezySubscriptionId?: string): Promise<{ key: LicenseKey; raw: string }> {
    const raw = `ck_${orgId}_${randomBytes(32).toString("hex")}`;
    const keyHash = createHmac("sha256", this.apiSecret).update(orgId).digest("hex");

    const id = nanoid();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 365 * 86400_000);

    await this.db.insert(licenseKeys).values({
      id,
      orgId,
      keyHash,
      plan,
      lemonSqueezyCustomerId: lemonSqueezyCustomerId ?? null,
      lemonSqueezySubscriptionId: lemonSqueezySubscriptionId ?? null,
      expiresAt,
      createdAt: now,
    });

    const key = LicenseKey.reconstitute({
      id,
      orgId,
      keyHash,
      plan,
      lemonSqueezyCustomerId: lemonSqueezyCustomerId ?? null,
      lemonSqueezySubscriptionId: lemonSqueezySubscriptionId ?? null,
      expiresAt,
      lastUsedAt: null,
      createdAt: now,
    });

    return { key, raw };
  }

  async findByHash(keyHash: string): Promise<LicenseKey | null> {
    const [row] = await this.db.select().from(licenseKeys).where(eq(licenseKeys.keyHash, keyHash)).limit(1);
    if (!row) return null;
    return LicenseKey.reconstitute({
      id: row.id,
      orgId: row.orgId,
      keyHash: row.keyHash,
      plan: row.plan,
      lemonSqueezyCustomerId: row.lemonSqueezyCustomerId ?? null,
      lemonSqueezySubscriptionId: row.lemonSqueezySubscriptionId ?? null,
      expiresAt: row.expiresAt ?? null,
      lastUsedAt: row.lastUsedAt ?? null,
      createdAt: row.createdAt,
    });
  }

  async validate(keyHash: string): Promise<LicenseKey | null> {
    const key = await this.findByHash(keyHash);
    if (!key) return null;
    if (key.expiresAt && new Date() > key.expiresAt) return null;
    return key;
  }
}
