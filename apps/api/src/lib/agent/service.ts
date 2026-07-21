import { eq, sql, desc } from "drizzle-orm";
import { agents } from "../db/schema";
import type { DB } from "../db/client";
import { Agent, type AgentStep, type TaskDefinition, AgentStatus } from "./entity";
import { AppError } from "../../shared/errors";
import type { Result } from "../../shared/result";
import { Ok, Err } from "../../shared/result";

export class AgentService {
  constructor(private readonly db: DB) {}

  async create(input: { orgId: string; sessionId: string; profileId: string; task: TaskDefinition }): Promise<Result<Agent>> {
    if (!input.task.goal?.trim()) return Err(AppError.validation("Goal is required"));
    if (input.task.steps.length === 0) return Err(AppError.validation("At least one step required"));
    const agent = Agent.create(input);
    await this.save(agent);
    return Ok(agent);
  }

  async getById(id: string): Promise<Result<Agent>> {
    const [row] = await this.db.select().from(agents).where(eq(agents.id, id));
    if (!row) return Err(AppError.notFound("Agent", id));
    return Ok(this.toDomain(row));
  }

  async listByOrg(orgId: string, limit = 20, offset = 0): Promise<Agent[]> {
    const rows = await this.db.select().from(agents).where(eq(agents.orgId, orgId)).orderBy(desc(agents.createdAt)).limit(limit).offset(offset);
    return rows.map((r) => this.toDomain(r));
  }

  async start(id: string) { const r = await this.getById(id); if (!r.ok) return r; r.value.start(); await this.save(r.value); return Ok(r.value); }
  async completeStep(id: string, i: number, result: unknown) { const r = await this.getById(id); if (!r.ok) return r; r.value.completeStep(i, result); await this.save(r.value); return Ok(r.value); }
  async failStep(id: string, i: number, error: string) { const r = await this.getById(id); if (!r.ok) return r; r.value.failStep(i, error); await this.save(r.value); return Ok(r.value); }
  async complete(id: string, result: unknown) { const r = await this.getById(id); if (!r.ok) return r; r.value.complete(result); await this.save(r.value); return Ok(r.value); }
  async fail(id: string, error: string) { const r = await this.getById(id); if (!r.ok) return r; r.value.fail(error); await this.save(r.value); return Ok(r.value); }
  async cancel(id: string) { const r = await this.getById(id); if (!r.ok) return r; r.value.cancel(); await this.save(r.value); return Ok(r.value); }

  async save(agent: Agent) {
    const j = agent.toJSON();
    const [exists] = await this.db.select({ id: agents.id }).from(agents).where(eq(agents.id, j.id));
    if (exists) {
      await this.db.update(agents).set({ status: j.status, steps: j.steps as any, result: j.result as any, error: j.error, startedAt: j.startedAt, completedAt: j.completedAt, updatedAt: j.updatedAt }).where(eq(agents.id, j.id));
    } else {
      await this.db.insert(agents).values({ id: j.id, orgId: j.orgId, sessionId: j.sessionId, profileId: j.profileId, status: j.status, task: j.task as any, steps: j.steps as any, result: j.result as any, error: j.error, startedAt: j.startedAt, completedAt: j.completedAt, createdAt: j.createdAt, updatedAt: j.updatedAt });
    }
  }

  private toDomain(row: typeof agents.$inferSelect): Agent {
    return Agent.reconstitute({ id: row.id, orgId: row.orgId, sessionId: row.sessionId, profileId: row.profileId, status: row.status as AgentStatus, task: row.task as TaskDefinition, steps: row.steps as AgentStep[], result: row.result, error: row.error, startedAt: row.startedAt, completedAt: row.completedAt, createdAt: row.createdAt, updatedAt: row.updatedAt });
  }
}
