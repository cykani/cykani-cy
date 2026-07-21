import { eq, sql, desc } from "drizzle-orm";
import { proxies } from "../db/schema";
import type { DB } from "../db/client";
import { Proxy } from "./entity";
import { AppError } from "../../shared/errors";
import type { Result } from "../../shared/result";
import { Ok, Err } from "../../shared/result";

export class ProxyService {
  constructor(private readonly db: DB) {}

  async create(input: { orgId: string; name: string; url: string; username?: string; password?: string; country?: string; protocol?: any }): Promise<Result<Proxy>> {
    if (!input.name?.trim()) return Err(AppError.validation("Name required"));
    const proxy = Proxy.create(input);
    await this.save(proxy);
    return Ok(proxy);
  }

  async getById(id: string): Promise<Result<Proxy>> {
    const [row] = await this.db.select().from(proxies).where(eq(proxies.id, id));
    if (!row) return Err(AppError.notFound("Proxy", id));
    return Ok(this.toDomain(row));
  }

  async listByOrg(orgId: string, limit = 20, offset = 0): Promise<Proxy[]> {
    const rows = await this.db.select().from(proxies).where(eq(proxies.orgId, orgId)).orderBy(desc(proxies.createdAt)).limit(limit).offset(offset);
    return rows.map((r) => this.toDomain(r));
  }

  async countByOrg(orgId: string): Promise<number> {
    const [r] = await this.db.select({ count: sql<number>`count(*)::int` }).from(proxies).where(eq(proxies.orgId, orgId));
    return r?.count ?? 0;
  }

  async update(id: string, input: Partial<Parameters<typeof Proxy.create>[0]>): Promise<Result<Proxy>> {
    const r = await this.getById(id);
    if (!r.ok) return r;
    r.value.update(input);
    await this.save(r.value);
    return Ok(r.value);
  }

  async delete(id: string): Promise<Result<void>> {
    const [exists] = await this.db.select({ id: proxies.id }).from(proxies).where(eq(proxies.id, id));
    if (!exists) return Err(AppError.notFound("Proxy", id));
    await this.db.delete(proxies).where(eq(proxies.id, id));
    return Ok(undefined);
  }

  async save(proxy: Proxy) {
    const j = proxy.toJSON();
    const [exists] = await this.db.select({ id: proxies.id }).from(proxies).where(eq(proxies.id, j.id));
    if (exists) {
      await this.db.update(proxies).set({
        name: j.name, url: j.url, username: j.username, password: j.password,
        country: j.country, protocol: j.protocol, status: j.status,
        lastCheckedAt: j.lastCheckedAt, responseTimeMs: j.responseTimeMs,
        updatedAt: j.updatedAt,
      }).where(eq(proxies.id, j.id));
    } else {
      await this.db.insert(proxies).values({
        id: j.id, orgId: j.orgId, name: j.name, url: j.url,
        username: j.username, password: j.password, country: j.country,
        protocol: j.protocol, status: j.status,
        lastCheckedAt: j.lastCheckedAt, responseTimeMs: j.responseTimeMs,
        createdAt: j.createdAt, updatedAt: j.updatedAt,
      });
    }
  }

  private toDomain(row: typeof proxies.$inferSelect): Proxy {
    return Proxy.reconstitute({
      id: row.id, orgId: row.orgId, name: row.name, url: row.url,
      username: row.username, password: row.password, country: row.country,
      protocol: row.protocol as any, status: row.status as any,
      lastCheckedAt: row.lastCheckedAt, responseTimeMs: row.responseTimeMs,
      createdAt: row.createdAt, updatedAt: row.updatedAt,
    });
  }
}
