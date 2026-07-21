import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import { createProxySchema, listProxiesSchema } from "./schema";
import { errorResponse } from "../../shared/http";
import type { Container } from "../../container";

export function proxyRouter(container: Container): Hono<ApiEnv> {
  const r = new Hono<ApiEnv>();

  r.post("/", async (c) => {
    const orgId = c.get("orgId");
    const body = createProxySchema.parse(await c.req.json());
    const result = await container.proxyService.create({ ...body, orgId });
    if (!result.ok) return errorResponse(c, result, 400);
    return c.json({ proxy: result.value.toJSON() }, 201);
  });

  r.get("/", async (c) => {
    const orgId = c.get("orgId");
    const { limit, offset } = listProxiesSchema.parse({ limit: c.req.query("limit"), offset: c.req.query("offset") });
    const proxies = await container.proxyService.listByOrg(orgId, limit, offset);
    return c.json({ proxies: proxies.map((p) => p.toJSON()), limit, offset });
  });

  r.get("/:id", async (c) => {
    const result = await container.proxyService.getById(String(c.req.param("id")));
    if (!result.ok) return errorResponse(c, result, 404);
    return c.json({ proxy: result.value.toJSON() });
  });

  r.put("/:id", async (c) => {
    const body = createProxySchema.partial().parse(await c.req.json());
    const result = await container.proxyService.update(String(c.req.param("id")), body);
    if (!result.ok) return errorResponse(c, result, 400);
    return c.json({ proxy: result.value.toJSON() });
  });

  r.delete("/:id", async (c) => {
    const result = await container.proxyService.delete(String(c.req.param("id")));
    if (!result.ok) return errorResponse(c, result, 404);
    return c.json({ deleted: true });
  });

  return r;
}
