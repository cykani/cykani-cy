import { errorResponse } from "../../shared/http";
import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import { createProfileSchema, listProfilesSchema } from "./schema";
import type { Container } from "../../container";

export function profileRouter(container: Container): Hono<ApiEnv> {
  const r = new Hono<ApiEnv>();

  r.post("/", async (c) => {
    const orgId = c.get("orgId");
    const body = createProfileSchema.parse(await c.req.json());
    const result = await container.profileService.create({ ...body, orgId });
    if (!result.ok) return errorResponse(c, result, 400);
    return c.json({ profile: result.value.toJSON() }, 201);
  });

  r.get("/", async (c) => {
    const orgId = c.get("orgId");
    const { limit, offset } = listProfilesSchema.parse({ limit: c.req.query("limit"), offset: c.req.query("offset") });
    const profiles = await container.profileService.listByOrg(orgId, limit, offset);
    return c.json({ profiles: profiles.map((p) => p.toJSON()), limit, offset });
  });

  r.get("/:id", async (c) => {
    const result = await container.profileService.getById(String(c.req.param("id")));
    if (!result.ok) return errorResponse(c, result, 404);
    return c.json({ profile: result.value.toJSON() });
  });

  r.put("/:id", async (c) => {
    const body = createProfileSchema.partial().parse(await c.req.json());
    const result = await container.profileService.update(String(c.req.param("id")), body);
    if (!result.ok) return errorResponse(c, result, 400);
    return c.json({ profile: result.value.toJSON() });
  });

  r.delete("/:id", async (c) => {
    const result = await container.profileService.delete(String(c.req.param("id")));
    if (!result.ok) return errorResponse(c, result, 404);
    return c.json({ deleted: true });
  });

  r.post("/:id/clone", async (c) => {
    const orgId = c.get("orgId");
    const body = await c.req.json();
    const result = await container.profileService.clone(String(c.req.param("id")), orgId, body.name ?? "Clone");
    if (!result.ok) return errorResponse(c, result, 400);
    return c.json({ profile: result.value.toJSON() }, 201);
  });

  return r;
}
