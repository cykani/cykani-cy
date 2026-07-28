import { Hono } from "hono";
import type { ApiEnv } from "../../shared/hono";
import { createProxySchema, listProxiesSchema } from "./schema";
import { errorResponse } from "../../shared/http";
import type { Container } from "../../container";
import { AnyIPProxy } from "./anyip";

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

  // ---------------------------------------------------------------------------
  // POST /proxies/test — test any proxy URL (or the AnyIP default pool)
  // Body: { url?: string; country?: string }
  // If url is omitted, tests the AnyIP configured pool.
  // ---------------------------------------------------------------------------
  r.post("/test", async (c) => {
    const body = await c.req.json().catch(() => ({})) as { url?: string; country?: string };

    let result;
    if (body.url) {
      result = await AnyIPProxy.test(body.url);
    } else {
      // Test the AnyIP default pool (uses env vars ANYIP_USERNAME / ANYIP_PASSWORD)
      result = await AnyIPProxy.testDefault(body.country);
    }

    return c.json(result, result.success ? 200 : 400);
  });

  // ---------------------------------------------------------------------------
  // GET /proxies/anyip — returns the AnyIP pool URL (masked password) for UI display
  // ---------------------------------------------------------------------------
  r.get("/anyip", async (c) => {
    const url = AnyIPProxy.getUrl();
    if (!url) {
      return c.json({ configured: false, message: "Set ANYIP_USERNAME and ANYIP_PASSWORD in environment" });
    }
    // Mask the password for safe display
    const masked = url.replace(/:([^@]+)@/, ":****@");
    return c.json({ configured: true, url: masked });
  });

  return r;
}
