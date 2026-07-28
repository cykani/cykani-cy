import { errorResponse } from "../../shared/http";
import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import { createAgentSchema, listAgentsSchema } from "./schema";
import type { Container } from "../../container";

export function agentRouter(container: Container): Hono<ApiEnv> {
  const r = new Hono<ApiEnv>();

  r.post("/", async (c) => {
    const orgId = c.get("orgId");
    const body = createAgentSchema.parse(await c.req.json());
    const result = await container.agentService.create({ orgId, sessionId: body.sessionId, profileId: body.profileId, task: body.task });
    if (!result.ok) return errorResponse(c, result, 400);

    const agent = result.value;

    const sessionResult = await container.sessionService.getById(agent.sessionId);
    const profileResult = await container.profileService.getById(agent.profileId);

    if (sessionResult.ok && profileResult.ok) {
      const session = sessionResult.value;
      const profile = profileResult.value;

      const cdpEndpoint = session.cdpPort ? `ws://localhost:${session.cdpPort}` : undefined;

      if (cdpEndpoint && body.task.steps.length > 0) {
        // Dynamic import to avoid TypeScript issues
        const { agentStepTask } = await import("@cykani/trigger");
        agentStepTask.trigger({
          agentId: agent.id,
          stepIndex: 0,
          action: body.task.steps[0].action,
          target: body.task.steps[0].target,
          value: body.task.steps[0].value,
          sessionId: agent.sessionId,
          cdpEndpoint,
          profile: {
            fingerprintSeed: profile.fingerprintSeed,
            platform: profile.platform,
            locale: profile.locale,
            timezone: profile.timezone,
            viewportWidth: profile.viewportWidth,
            viewportHeight: profile.viewportHeight,
            proxyUrl: profile.proxyUrl ?? undefined,
          },
        });
      }
    }

    return c.json({ agent: agent.toJSON() }, 201);
  });

  r.get("/", async (c) => {
    const orgId = c.get("orgId");
    const { limit, offset } = listAgentsSchema.parse({ limit: c.req.query("limit"), offset: c.req.query("offset") });
    const agents = await container.agentService.listByOrg(orgId, limit, offset);
    return c.json({ agents: agents.map((a) => a.toJSON()), limit, offset });
  });

  r.get("/:id", async (c) => {
    const result = await container.agentService.getById(String(c.req.param("id")));
    if (!result.ok) return errorResponse(c, result, 404);
    return c.json({ agent: result.value.toJSON() });
  });

  r.get("/:id/steps", async (c) => {
    const result = await container.agentService.getById(String(c.req.param("id")));
    if (!result.ok) return errorResponse(c, result, 404);
    return c.json({ steps: result.value.steps, progress: result.value.progress });
  });

  r.post("/:id/stop", async (c) => {
    const result = await container.agentService.cancel(String(c.req.param("id")));
    if (!result.ok) return errorResponse(c, result, 400);
    return c.json({ agent: result.value.toJSON() });
  });

  // ---------------------------------------------------------------------------
  // POST /:id/run  — trigger the agent execution loop
  // This is what the UI calls when the user hits "Run" on an agent.
  // The runner uses Hermes (or configured LLM) + cykani-stealth.
  // ---------------------------------------------------------------------------
  r.post("/:id/run", async (c) => {
    const agentId = String(c.req.param("id"));
    const body = await c.req.json().catch(() => ({})) as {
      cdpEndpoint?: string;
      llmProvider?: string;
      llmModel?: string;
    };

    const agentResult = await container.agentService.getById(agentId);
    if (!agentResult.ok) return errorResponse(c, agentResult, 404);

    const agent = agentResult.value;
    if (agent.status === "running") {
      return c.json({ error: { code: "ALREADY_RUNNING", message: "Agent is already running" } }, 400);
    }

    // Get CDP endpoint from the session
    let cdpEndpoint = body.cdpEndpoint;
    if (!cdpEndpoint) {
      const sessionResult = await container.sessionService.getById(agent.sessionId);
      if (sessionResult.ok && sessionResult.value.cdpPort) {
        cdpEndpoint = `ws://localhost:${sessionResult.value.cdpPort}`;
      }
    }

    if (!cdpEndpoint) {
      return c.json({ error: { code: "NO_CDP_ENDPOINT", message: "No CDP endpoint available — session must be running" } }, 400);
    }

    // Fire-and-forget: run the agent in background so HTTP responds immediately
    void container.agentRunner.run({
      agentId,
      orgId: c.get("orgId"),
      goal: agent.task.goal,
      cdpEndpoint,
      maxSteps: agent.task.maxSteps ?? 25,
      llmConfig: {
        provider: (body.llmProvider as "hermes" | "groq" | "openai" | undefined) ?? undefined,
        model: body.llmModel,
      },
    });

    return c.json({ agentId, status: "running", message: "Agent execution started" });
  });

  return r;
}