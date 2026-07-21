import { nanoid } from "nanoid";

export const OrgPlan = { FREE: "free", PRO: "pro", ENTERPRISE: "enterprise" } as const;
export type OrgPlan = (typeof OrgPlan)[keyof typeof OrgPlan];
export const PLAN_LIMITS: Record<OrgPlan, { maxSessions: number; maxProfiles: number }> = { free: { maxSessions: 2, maxProfiles: 5 }, pro: { maxSessions: 10, maxProfiles: 50 }, enterprise: { maxSessions: 100, maxProfiles: 500 } };

export interface OrgProps { id: string; name: string; plan: OrgPlan; ownerId: string; members: Array<{ userId: string; role: string; joinedAt: Date }>; createdAt: Date; updatedAt: Date; }

export class Organization {
  readonly id: string; private _name: string; private _plan: OrgPlan; readonly ownerId: string;
  private _members: OrgProps["members"]; readonly createdAt: Date; private _updatedAt: Date;

  private constructor(p: OrgProps) { this.id = p.id; this._name = p.name; this._plan = p.plan; this.ownerId = p.ownerId; this._members = p.members; this.createdAt = p.createdAt; this._updatedAt = p.updatedAt; }

  get name() { return this._name; }
  get plan() { return this._plan; }
  get members() { return this._members; }
  get updatedAt() { return this._updatedAt; }
  get limits() { return PLAN_LIMITS[this._plan]; }

  canAdmin(userId: string) { return this.ownerId === userId || this._members.some((m) => m.userId === userId && (m.role === "owner" || m.role === "admin")); }

  static create(name: string, ownerId: string) { const now = new Date(); return new Organization({ id: nanoid(), name, plan: OrgPlan.FREE, ownerId, members: [{ userId: ownerId, role: "owner", joinedAt: now }], createdAt: now, updatedAt: now }); }
  static reconstitute(p: OrgProps) { return new Organization(p); }

  addMember(userId: string, role = "member") { if (!this._members.some((m) => m.userId === userId)) { this._members.push({ userId, role, joinedAt: new Date() }); this._updatedAt = new Date(); } }
  removeMember(userId: string) { if (userId !== this.ownerId) { this._members = this._members.filter((m) => m.userId !== userId); this._updatedAt = new Date(); } }
  changePlan(plan: OrgPlan) { this._plan = plan; this._updatedAt = new Date(); }

  toJSON(): OrgProps { return { id: this.id, name: this._name, plan: this._plan, ownerId: this.ownerId, members: this._members, createdAt: this.createdAt, updatedAt: this._updatedAt }; }
}
