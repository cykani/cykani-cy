import { eq, and } from "drizzle-orm";
import { organizations, memberships } from "../db/schema";
import type { DB } from "../db/client";
import { Organization, type OrgPlan } from "./entity";
import { AppError } from "../../shared/errors";
import type { Result } from "../../shared/result";
import { Ok, Err } from "../../shared/result";

export class OrgService {
  constructor(private readonly db: DB) {}

  async create(name: string, ownerId: string): Promise<Result<Organization>> {
    if (!name?.trim()) return Err(AppError.validation("Name required"));
    const org = Organization.create(name, ownerId);
    await this.save(org);
    return Ok(org);
  }

  async getById(id: string): Promise<Result<Organization>> {
    const [row] = await this.db.select().from(organizations).where(eq(organizations.id, id));
    if (!row) return Err(AppError.notFound("Organization", id));
    const members = await this.db.select().from(memberships).where(eq(memberships.orgId, id));
    return Ok(Organization.reconstitute({ id: row.id, name: row.name, plan: row.plan as OrgPlan, ownerId: row.ownerId, members: members.map((m) => ({ userId: m.userId, role: m.role, joinedAt: m.joinedAt })), createdAt: row.createdAt, updatedAt: row.updatedAt }));
  }

  async getByStripeCustomerId(stripeCustomerId: string): Promise<Result<Organization>> {
    const [row] = await this.db.select().from(organizations).where(eq(organizations.stripeCustomerId, stripeCustomerId));
    if (!row) return Err(AppError.notFound("Organization", stripeCustomerId));
    const members = await this.db.select().from(memberships).where(eq(memberships.orgId, row.id));
    return Ok(Organization.reconstitute({ id: row.id, name: row.name, plan: row.plan as OrgPlan, ownerId: row.ownerId, members: members.map((m) => ({ userId: m.userId, role: m.role, joinedAt: m.joinedAt })), createdAt: row.createdAt, updatedAt: row.updatedAt }));
  }

  async addMember(orgId: string, userId: string, role = "member") {
    const r = await this.getById(orgId);
    if (!r.ok) return r;
    r.value.addMember(userId, role);
    await this.save(r.value);
    return Ok(r.value);
  }

  async removeMember(orgId: string, userId: string, requesterId: string) {
    const r = await this.getById(orgId);
    if (!r.ok) return r;
    if (!r.value.canAdmin(requesterId)) return Err(AppError.forbidden());
    r.value.removeMember(userId);
    await this.save(r.value);
    return Ok(r.value);
  }

  async updatePlan(orgId: string, plan: OrgPlan) {
    const r = await this.getById(orgId);
    if (!r.ok) return r;
    r.value.changePlan(plan);
    await this.save(r.value);
    return Ok(r.value);
  }

  async save(org: Organization) {
    const j = org.toJSON();
    const [exists] = await this.db.select({ id: organizations.id }).from(organizations).where(eq(organizations.id, j.id));
    if (exists) {
      await this.db.update(organizations).set({ name: j.name, plan: j.plan, updatedAt: j.updatedAt }).where(eq(organizations.id, j.id));
    } else {
      await this.db.insert(organizations).values({ id: j.id, name: j.name, plan: j.plan, ownerId: j.ownerId, createdAt: j.createdAt, updatedAt: j.updatedAt });
    }
    for (const m of j.members) {
      const [ex] = await this.db.select().from(memberships).where(and(eq(memberships.orgId, j.id), eq(memberships.userId, m.userId)));
      if (ex) { await this.db.update(memberships).set({ role: m.role }).where(and(eq(memberships.orgId, j.id), eq(memberships.userId, m.userId))); }
      else { await this.db.insert(memberships).values({ orgId: j.id, userId: m.userId, role: m.role, joinedAt: m.joinedAt }); }
    }
  }
}
