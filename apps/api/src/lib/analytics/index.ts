import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";

export function analyticsRouter(): Hono<ApiEnv> {
  const r = new Hono<ApiEnv>();

  r.get("/usage", async (c) => {
    const orgId = c.get("orgId");
    // Will wire to UsageTracker in container
    return c.json({
      usage: {
        sessions: { active: 0, limit: 10 },
        profiles: { count: 0, limit: 50 },
        agentSteps: { count: 0, limit: 1000 },
        storage: { used: 0, limit: 1024 },
      },
    });
  });

  r.get("/sessions/:id/recording", async (c) => {
    const id = c.req.param("id");
    // Will wire to RecordingService
    return c.json({ recording: null });
  });

  r.get("/sessions/:id/screenshots", async (c) => {
    const id = c.req.param("id");
    return c.json({ screenshots: [] });
  });

  return r;
}
