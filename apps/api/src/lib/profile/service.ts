import { eq, sql, desc } from "drizzle-orm";
import { profiles } from "../db/schema";
import type { DB } from "../db/client";
import { Profile } from "./entity";
import { AppError } from "../../shared/errors";
import type { Result } from "../../shared/result";
import { Ok, Err } from "../../shared/result";

export class ProfileService {
  constructor(private readonly db: DB) {}

  async create(input: { orgId: string; name: string; fingerprintSeed?: number; platform?: any; proxyUrl?: string; viewportWidth?: number; viewportHeight?: number; locale?: string; timezone?: string; extensions?: string[] }): Promise<Result<Profile>> {
    if (!input.name?.trim()) return Err(AppError.validation("Profile name is required"));
    const profile = Profile.create(input);
    await this.save(profile);
    return Ok(profile);
  }

  async getById(id: string): Promise<Result<Profile>> {
    const [row] = await this.db.select().from(profiles).where(eq(profiles.id, id));
    if (!row) return Err(AppError.notFound("Profile", id));
    return Ok(this.toDomain(row));
  }

  async listByOrg(orgId: string, limit = 20, offset = 0): Promise<Profile[]> {
    const rows = await this.db.select().from(profiles).where(eq(profiles.orgId, orgId)).orderBy(desc(profiles.createdAt)).limit(limit).offset(offset);
    return rows.map((r) => this.toDomain(r));
  }

  async countByOrg(orgId: string): Promise<number> {
    const [r] = await this.db.select({ count: sql<number>`count(*)::int` }).from(profiles).where(eq(profiles.orgId, orgId));
    return r?.count ?? 0;
  }

  async update(id: string, input: Partial<Parameters<typeof Profile.create>[0]>): Promise<Result<Profile>> {
    const r = await this.getById(id);
    if (!r.ok) return r;
    r.value.update(input);
    await this.save(r.value);
    return Ok(r.value);
  }

  async clone(id: string, newOrgId: string, newName: string): Promise<Result<Profile>> {
    const r = await this.getById(id);
    if (!r.ok) return r;
    const c = r.value.clone(newOrgId, newName);
    await this.save(c);
    return Ok(c);
  }

  async delete(id: string): Promise<Result<void>> {
    const [exists] = await this.db.select({ id: profiles.id }).from(profiles).where(eq(profiles.id, id));
    if (!exists) return Err(AppError.notFound("Profile", id));
    await this.db.delete(profiles).where(eq(profiles.id, id));
    return Ok(undefined);
  }

  async save(profile: Profile) {
    const j = profile.toJSON();
    const [exists] = await this.db.select({ id: profiles.id }).from(profiles).where(eq(profiles.id, j.id));
    if (exists) {
      await this.db.update(profiles).set({ name: j.name, proxyUrl: j.proxyUrl, viewportWidth: j.viewportWidth, viewportHeight: j.viewportHeight, locale: j.locale, timezone: j.timezone, userAgent: j.userAgent, cookies: j.cookies as any, localStorage: j.localStorage as any, extensions: j.extensions, updatedAt: j.updatedAt }).where(eq(profiles.id, j.id));
    } else {
      await this.db.insert(profiles).values({ id: j.id, orgId: j.orgId, name: j.name, fingerprintSeed: j.fingerprintSeed, platform: j.platform, proxyUrl: j.proxyUrl, viewportWidth: j.viewportWidth, viewportHeight: j.viewportHeight, locale: j.locale, timezone: j.timezone, userAgent: j.userAgent, cookies: j.cookies as any, localStorage: j.localStorage as any, extensions: j.extensions, createdAt: j.createdAt, updatedAt: j.updatedAt });
    }
  }

  private toDomain(row: typeof profiles.$inferSelect): Profile {
    return Profile.reconstitute({ id: row.id, orgId: row.orgId, name: row.name, fingerprintSeed: row.fingerprintSeed, platform: row.platform as any, proxyUrl: row.proxyUrl, viewportWidth: row.viewportWidth, viewportHeight: row.viewportHeight, locale: row.locale, timezone: row.timezone, userAgent: row.userAgent, cookies: row.cookies as any, localStorage: row.localStorage as any, extensions: (row.extensions as string[]) ?? [], createdAt: row.createdAt, updatedAt: row.updatedAt });
  }
}
