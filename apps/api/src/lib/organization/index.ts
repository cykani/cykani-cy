import { errorResponse } from "../../shared/http";
import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import { createOrgSchema, addMemberSchema } from "./schema";
import { PLAN_LIMITS } from "./entity";
import type { Container } from "../../container";

export function orgRouter(container: Container): Hono<ApiEnv> {
  const r = new Hono<ApiEnv>();

  r.post("/", async (c) => {
    const body = createOrgSchema.parse(await c.req.json());
    const result = await container.orgService.create(body.name, body.ownerId ?? c.get("userId"));
    if (!result.ok) return errorResponse(c, result, 400);
    return c.json({ org: result.value.toJSON() }, 201);
  });

  r.get("/:id", async (c) => {
    const result = await container.orgService.getById(String(c.req.param("id")));
    if (!result.ok) return errorResponse(c, result, 404);
    return c.json({ org: { ...result.value.toJSON(), limits: PLAN_LIMITS[result.value.plan] } });
  });

  r.get("/:id/members", async (c) => {
    const result = await container.orgService.getById(String(c.req.param("id")));
    if (!result.ok) return errorResponse(c, result, 404);
    return c.json({ members: result.value.members });
  });

  r.post("/:id/members", async (c) => {
    const body = addMemberSchema.parse(await c.req.json());
    const result = await container.orgService.addMember(String(c.req.param("id")), body.userId, body.role);
    if (!result.ok) return errorResponse(c, result, 400);
    return c.json({ members: result.value.members }, 201);
  });

  r.get("/:id/usage", async (c) => {
    const id = String(c.req.param("id"));
    const sessionCount = await container.sessionService.countActive(id);
    const profileCount = await container.profileService.countByOrg(id);
    const org = await container.orgService.getById(id);
    const limits = org.ok ? PLAN_LIMITS[org.value.plan] : PLAN_LIMITS.free;
    return c.json({ usage: { sessions: { active: sessionCount, limit: limits.maxSessions }, profiles: { count: profileCount, limit: limits.maxProfiles } } });
  });

  r.get("/me", async (c) => {
    const orgId = c.get("orgId");
    if (!orgId) return c.json({ error: { code: "UNAUTHORIZED", message: "No org context" } }, 401);
    let result = await container.orgService.getById(orgId);
    if (!result.ok) {
      const created = await container.orgService.create(`Org ${orgId}`, orgId);
      if (!created.ok) return c.json({ error: { code: "INTERNAL", message: "Failed to create org" } }, 500);
      result = created;
    }
    return c.json({ org: { ...result.value.toJSON(), limits: PLAN_LIMITS[result.value.plan] } });
  });

  return r;
}
