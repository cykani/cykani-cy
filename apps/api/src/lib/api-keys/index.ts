import { errorResponse } from "../../shared/http";
import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import type { Container } from "../../container";

export function apiKeyRouter(container: Container): Hono<ApiEnv> {
  const r = new Hono<ApiEnv>();

  r.get("/", async (c) => {
    const orgId = c.get("orgId");
    const keys = await container.apiKeyService.listByOrg(orgId as string);
    return c.json({ keys: keys.map((k) => k.toJSON()) });
  });

  r.post("/", async (c) => {
    const orgId = c.get("orgId");
    const body = await c.req.json<{ name?: string; scopes?: string[] }>();
    if (!body.name?.trim()) return c.json({ error: { code: "VALIDATION_ERROR", message: "Name is required" } }, 400);
    const result = await container.apiKeyService.create(orgId as string, body.name, body.scopes ?? []);
    if (!result.ok) return errorResponse(c, result, 400);
    return c.json({ key: result.value.key.toJSON(), raw: result.value.raw }, 201);
  });

  r.delete("/:id", async (c) => {
    const orgId = c.get("orgId");
    const id = c.req.param("id");
    const result = await container.apiKeyService.revoke(orgId as string, id);
    if (!result.ok) return errorResponse(c, result, 400);
    return c.json({ deleted: true });
  });

  return r;
}
