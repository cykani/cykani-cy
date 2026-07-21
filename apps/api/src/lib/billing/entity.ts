import { nanoid } from "nanoid";
import type { OrgPlan } from "../organization/entity";

export interface SubscriptionProps { id: string; orgId: string; plan: OrgPlan; stripeSubscriptionId: string | null; currentPeriodStart: Date; currentPeriodEnd: Date; createdAt: Date; updatedAt: Date; }

export class Subscription {
  readonly id: string; readonly orgId: string; private _plan: OrgPlan; private _stripeSubscriptionId: string | null;
  private _currentPeriodStart: Date; private _currentPeriodEnd: Date; readonly createdAt: Date; private _updatedAt: Date;

  private constructor(p: SubscriptionProps) { this.id = p.id; this.orgId = p.orgId; this._plan = p.plan; this._stripeSubscriptionId = p.stripeSubscriptionId; this._currentPeriodStart = p.currentPeriodStart; this._currentPeriodEnd = p.currentPeriodEnd; this.createdAt = p.createdAt; this._updatedAt = p.updatedAt; }

  get plan() { return this._plan; }
  get stripeSubscriptionId() { return this._stripeSubscriptionId; }
  get currentPeriodStart() { return this._currentPeriodStart; }
  get currentPeriodEnd() { return this._currentPeriodEnd; }
  get updatedAt() { return this._updatedAt; }
  get isActive() { return new Date() <= this._currentPeriodEnd; }

  static create(orgId: string, plan: OrgPlan) { const now = new Date(); return new Subscription({ id: nanoid(), orgId, plan, stripeSubscriptionId: null, currentPeriodStart: now, currentPeriodEnd: new Date(now.getTime() + 30 * 86400_000), createdAt: now, updatedAt: now }); }
  static reconstitute(p: SubscriptionProps) { return new Subscription(p); }

  toJSON(): SubscriptionProps { return { id: this.id, orgId: this.orgId, plan: this._plan, stripeSubscriptionId: this._stripeSubscriptionId, currentPeriodStart: this._currentPeriodStart, currentPeriodEnd: this._currentPeriodEnd, createdAt: this.createdAt, updatedAt: this._updatedAt }; }
}
