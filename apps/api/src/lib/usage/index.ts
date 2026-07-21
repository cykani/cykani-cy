import { nanoid } from "nanoid";

export interface UsageMetric {
  id: string;
  orgId: string;
  type: "session_minutes" | "agent_steps" | "api_calls" | "screenshots" | "storage_mb";
  amount: number;
  metadata: Record<string, unknown>;
  recordedAt: Date;
}

export interface UsageSummary {
  orgId: string;
  period: string;
  sessionMinutes: number;
  agentSteps: number;
  apiCalls: number;
  screenshots: number;
  storageMb: number;
}

export class UsageTracker {
  private readonly metrics: UsageMetric[] = [];

  record(orgId: string, type: UsageMetric["type"], amount: number, metadata: Record<string, unknown> = {}) {
    this.metrics.push({
      id: nanoid(),
      orgId,
      type,
      amount,
      metadata,
      recordedAt: new Date(),
    });
  }

  getSummary(orgId: string, period = "current"): UsageSummary {
    const now = new Date();
    const periodStart = period === "current"
      ? new Date(now.getFullYear(), now.getMonth(), 1)
      : new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const periodEnd = period === "current" ? now : new Date(now.getFullYear(), now.getMonth(), 0);

    const filtered = this.metrics.filter(
      (m) => m.orgId === orgId && m.recordedAt >= periodStart && m.recordedAt <= periodEnd
    );

    return {
      orgId,
      period: `${periodStart.toISOString().slice(0, 7)}`,
      sessionMinutes: filtered.filter((m) => m.type === "session_minutes").reduce((s, m) => s + m.amount, 0),
      agentSteps: filtered.filter((m) => m.type === "agent_steps").reduce((s, m) => s + m.amount, 0),
      apiCalls: filtered.filter((m) => m.type === "api_calls").reduce((s, m) => s + m.amount, 0),
      screenshots: filtered.filter((m) => m.type === "screenshots").reduce((s, m) => s + m.amount, 0),
      storageMb: filtered.filter((m) => m.type === "storage_mb").reduce((s, m) => s + m.amount, 0),
    };
  }

  getMetrics(orgId: string, limit = 100): UsageMetric[] {
    return this.metrics
      .filter((m) => m.orgId === orgId)
      .sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())
      .slice(0, limit);
  }
}
