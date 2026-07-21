import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { createRouter } from "./routes";
import { AppOpenAPI } from "./lib/openapi";
import type { Container } from "./container";
import type { ApiEnv } from "./shared/hono";

export function createApp(container: Container): Hono<ApiEnv> {
  const app = new Hono<ApiEnv>();

  const allowedOrigins = container.env.CORS_ORIGINS
    ? container.env.CORS_ORIGINS.split(",").map((o) => o.trim())
    : container.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://localhost:3001"]
      : [];

  app.use("*", requestId());
  app.use("*", logger());
  app.use("*", cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : [],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Api-Key"],
  }));

  app.onError((err, c) => {
    const status = (err as any).code === "NOT_FOUND" ? 404
      : (err as any).code === "UNAUTHORIZED" ? 401
      : (err as any).code === "FORBIDDEN" ? 403
      : (err as any).code === "SESSION_LIMIT_EXCEEDED" ? 429
      : 500;
    return c.json({ error: { code: (err as any).code ?? "INTERNAL_ERROR", message: err.message } }, status as any);
  });

  app.use("*", async (c, next) => {
    c.set("container", container);
    return next();
  });

  app.route("/", createRouter(container));

  app.get("/health", (c) => c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  }));

  app.get("/docs", (c) => c.html(`<!DOCTYPE html>
<html>
<head>
  <title>Cykani API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/openapi.json',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: "StandaloneLayout"
    });
  </script>
</body>
</html>`));

  app.route("/", AppOpenAPI);

  return app;
}
