import { errorResponse } from "../../shared/http";
import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import { createSessionSchema, listSessionsSchema } from "./schema";
import type { SessionService } from "./service";
import type { Container } from "../../container";

export function sessionRouter(container: Container): Hono<ApiEnv> {
  const r = new Hono<ApiEnv>();

  r.post("/", async (c) => {
    const orgId = c.get("orgId");
    const body = createSessionSchema.parse(await c.req.json());
    const result = await container.sessionService.create(orgId, body.profileId, body.ttlMinutes);
    if (!result.ok) return errorResponse(c, result, 400);

    const session = result.value;
    const profile = await container.profileService.getById(body.profileId);

    // Trigger async session launch via trigger.dev
    if (profile.ok) {
      const { sessionLaunchTask } = await import("@cykani/trigger");
      sessionLaunchTask.trigger({
        sessionId: session.id,
        profileId: profile.value.id,
        orgId,
        fingerprintSeed: profile.value.fingerprintSeed,
        platform: profile.value.platform,
      });
    }

    return c.json({ session: session.toJSON() }, 201);
  });

  r.get("/", async (c) => {
    const orgId = c.get("orgId");
    const { limit, offset } = listSessionsSchema.parse({ limit: c.req.query("limit"), offset: c.req.query("offset") });
    const sessions = await container.sessionService.listByOrg(orgId, limit, offset);
    return c.json({ sessions: sessions.map((s) => s.toJSON()), limit, offset });
  });

  r.get("/:id", async (c) => {
    const result = await container.sessionService.getById(String(c.req.param("id")));
    if (!result.ok) return errorResponse(c, result, 404);
    return c.json({ session: result.value.toJSON() });
  });

  r.post("/:id/stop", async (c) => {
    const result = await container.sessionService.terminate(String(c.req.param("id")));
    if (!result.ok) return errorResponse(c, result, 400);
    if (result.value.containerId) {
      try { await container.docker.destroy(result.value.containerId); } catch {}
    }
    await container.sessionService.markStopped(result.value.id);
    return c.json({ session: result.value.toJSON() });
  });

  r.post("/:id/reconnect", async (c) => {
    const result = await container.sessionService.getById(String(c.req.param("id")));
    if (!result.ok) return errorResponse(c, result, 404);
    const s = result.value;
    if (!s.containerId) return c.json({ error: { code: "NO_CONTAINER", message: "No container" } }, 400);
    const status = await container.docker.getStatus(s.containerId);
    return c.json({ session: s.toJSON(), containerStatus: status, wsEndpoint: s.wsUrl, vncEndpoint: s.vncWsUrl });
  });

  return r;
}
