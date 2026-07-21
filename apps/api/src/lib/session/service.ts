import { eq, and, sql, desc } from "drizzle-orm";
import { sessions, profiles } from "../db/schema";
import type { DB } from "../db/client";
import { Session } from "./entity";
import { SessionStatus } from "./state-machine";
import type { EventBus } from "../../shared/events";
import { AppError } from "../../shared/errors";
import type { Result } from "../../shared/result";
import { Ok, Err } from "../../shared/result";

export class SessionService {
  constructor(
    private readonly db: DB,
    private readonly eventBus: EventBus,
    private readonly maxPerOrg: number,
  ) {}

  async create(orgId: string, profileId: string, ttlMinutes?: number): Promise<Result<Session>> {
    const count = await this.countActive(orgId);
    if (count >= this.maxPerOrg) return Err(AppError.sessionLimit(this.maxPerOrg));

    const [profile] = await this.db.select({ id: profiles.id }).from(profiles).where(eq(profiles.id, profileId));
    if (!profile) return Err(AppError.notFound("Profile", profileId));

    const session = Session.create(orgId, profileId, ttlMinutes);
    await this.save(session);
    return Ok(session);
  }

  async getById(id: string): Promise<Result<Session>> {
    const [row] = await this.db.select().from(sessions).where(eq(sessions.id, id));
    if (!row) return Err(AppError.notFound("Session", id));
    return Ok(this.toDomain(row));
  }

  async listByOrg(orgId: string, limit = 20, offset = 0): Promise<Session[]> {
    const rows = await this.db.select().from(sessions)
      .where(eq(sessions.orgId, orgId))
      .orderBy(desc(sessions.createdAt))
      .limit(limit).offset(offset);
    return rows.map((r) => this.toDomain(r));
  }

  async countActive(orgId: string): Promise<number> {
    const [r] = await this.db.select({ count: sql<number>`count(*)::int` }).from(sessions)
      .where(and(eq(sessions.orgId, orgId), sql`${sessions.status} IN ('launching','running')`));
    return r?.count ?? 0;
  }

  async launch(sessionId: string, containerId: string, vncPort: number, cdpPort: number, vncPassword: string) {
    const r = await this.getById(sessionId);
    if (!r.ok) return r;
    r.value.launch(containerId, vncPort, cdpPort, vncPassword);
    await this.save(r.value);
    return Ok(r.value);
  }

  async markRunning(id: string) {
    const r = await this.getById(id);
    if (!r.ok) return r;
    r.value.markRunning();
    await this.save(r.value);
    return Ok(r.value);
  }

  async terminate(id: string): Promise<Result<Session>> {
    const r = await this.getById(id);
    if (!r.ok) return r;
    if (r.value.status !== SessionStatus.RUNNING) return Err(AppError.notFound("Running session", id));
    r.value.terminate();
    await this.save(r.value);
    await this.flushEvents(r.value);
    return Ok(r.value);
  }

  async markStopped(id: string) {
    const r = await this.getById(id);
    if (!r.ok) return r;
    r.value.markStopped();
    await this.save(r.value);
    return Ok(r.value);
  }

  async markError(id: string, error: string) {
    const r = await this.getById(id);
    if (!r.ok) return r;
    r.value.markError(error);
    await this.save(r.value);
    await this.flushEvents(r.value);
    return Ok(r.value);
  }

  async save(session: Session) {
    const j = session.toJSON();
    const [exists] = await this.db.select({ id: sessions.id }).from(sessions).where(eq(sessions.id, j.id));
    if (exists) {
      await this.db.update(sessions).set({
        status: j.status, containerId: j.containerId, vncPort: j.vncPort,
        cdpPort: j.cdpPort, vncPassword: j.vncPassword, startedAt: j.startedAt,
        expiresAt: j.expiresAt, metadata: j.metadata as any, updatedAt: j.updatedAt,
      }).where(eq(sessions.id, j.id));
    } else {
      await this.db.insert(sessions).values({
        id: j.id, orgId: j.orgId, profileId: j.profileId, status: j.status,
        containerId: j.containerId, vncPort: j.vncPort, cdpPort: j.cdpPort,
        vncPassword: j.vncPassword, startedAt: j.startedAt, expiresAt: j.expiresAt,
        metadata: j.metadata as any, createdAt: j.createdAt, updatedAt: j.updatedAt,
      });
    }
  }

  private async flushEvents(session: Session) {
    for (const e of session.events) await this.eventBus.publish(e);
    session.clearEvents();
  }

  private toDomain(row: typeof sessions.$inferSelect): Session {
    return Session.reconstitute({
      id: row.id, orgId: row.orgId, profileId: row.profileId,
      status: row.status as any, containerId: row.containerId,
      vncPort: row.vncPort, cdpPort: row.cdpPort, vncPassword: row.vncPassword,
      startedAt: row.startedAt, expiresAt: row.expiresAt,
      metadata: (row.metadata as Record<string, unknown>) ?? {},
      createdAt: row.createdAt, updatedAt: row.updatedAt,
    });
  }
}
