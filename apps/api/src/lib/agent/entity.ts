import { nanoid } from "nanoid";

export const AgentStatus = { IDLE: "idle", RUNNING: "running", COMPLETED: "completed", FAILED: "failed", CANCELLED: "cancelled" } as const;
export type AgentStatus = (typeof AgentStatus)[keyof typeof AgentStatus];

export interface AgentStep { index: number; action: string; target: string | null; value: string | null; status: "pending" | "running" | "completed" | "failed"; result: unknown; error: string | null; startedAt: Date | null; completedAt: Date | null; }
export interface TaskDefinition { goal: string; steps: Array<{ action: string; target?: string; value?: string }>; maxSteps?: number; llmModel?: string; }

export interface AgentProps { id: string; orgId: string; sessionId: string; profileId: string; status: AgentStatus; task: TaskDefinition; steps: AgentStep[]; result: unknown; error: string | null; startedAt: Date | null; completedAt: Date | null; createdAt: Date; updatedAt: Date; }

export class Agent {
  readonly id: string; readonly orgId: string; readonly sessionId: string; readonly profileId: string;
  private _status: AgentStatus; private _task: TaskDefinition; private _steps: AgentStep[];
  private _result: unknown; private _error: string | null;
  private _startedAt: Date | null; private _completedAt: Date | null;
  readonly createdAt: Date; private _updatedAt: Date;
  private _events: any[] = [];

  private constructor(p: AgentProps) { this.id = p.id; this.orgId = p.orgId; this.sessionId = p.sessionId; this.profileId = p.profileId; this._status = p.status; this._task = p.task; this._steps = p.steps; this._result = p.result; this._error = p.error; this._startedAt = p.startedAt; this._completedAt = p.completedAt; this.createdAt = p.createdAt; this._updatedAt = p.updatedAt; }

  get status() { return this._status; }
  get task() { return this._task; }
  get steps() { return this._steps; }
  get result() { return this._result; }
  get error() { return this._error; }
  get events() { return this._events; }
  get startedAt() { return this._startedAt; }
  get completedAt() { return this._completedAt; }
  get progress() { const t = this._task.steps.length; const c = this._steps.filter((s) => s.status === "completed" || s.status === "failed").length; return { completed: c, total: t, percentage: t > 0 ? Math.round((c / t) * 100) : 0 }; }

  static create(input: { orgId: string; sessionId: string; profileId: string; task: TaskDefinition }): Agent {
    const now = new Date();
    const steps: AgentStep[] = input.task.steps.map((s, i) => ({ index: i, action: s.action, target: s.target ?? null, value: s.value ?? null, status: "pending" as const, result: null, error: null, startedAt: null, completedAt: null }));
    return new Agent({ id: nanoid(), orgId: input.orgId, sessionId: input.sessionId, profileId: input.profileId, status: AgentStatus.IDLE, task: input.task, steps, result: null, error: null, startedAt: null, completedAt: null, createdAt: now, updatedAt: now });
  }

  static reconstitute(p: AgentProps) { return new Agent(p); }

  start() { this._status = AgentStatus.RUNNING; this._startedAt = new Date(); this._updatedAt = new Date(); }
  completeStep(i: number, result: unknown) { const s = this._steps[i]; if (s) { s.status = "completed"; s.result = result; s.completedAt = new Date(); this._updatedAt = new Date(); } }
  failStep(i: number, error: string) { const s = this._steps[i]; if (s) { s.status = "failed"; s.error = error; s.completedAt = new Date(); this._updatedAt = new Date(); } }
  complete(result: unknown) { this._status = AgentStatus.COMPLETED; this._result = result; this._completedAt = new Date(); this._updatedAt = new Date(); }
  fail(error: string) { this._status = AgentStatus.FAILED; this._error = error; this._completedAt = new Date(); this._updatedAt = new Date(); }
  cancel() { this._status = AgentStatus.CANCELLED; this._completedAt = new Date(); this._updatedAt = new Date(); }

  toJSON(): AgentProps { return { id: this.id, orgId: this.orgId, sessionId: this.sessionId, profileId: this.profileId, status: this._status, task: this._task, steps: this._steps, result: this._result, error: this._error, startedAt: this._startedAt, completedAt: this._completedAt, createdAt: this.createdAt, updatedAt: this._updatedAt }; }
}
