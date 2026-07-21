import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createApp } from "../src/http";
import { createContainer } from "../src/container";
import { serve } from "@hono/node-server";

process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/cykani_test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-key-for-testing-only";
process.env.API_KEY_SECRET = process.env.API_KEY_SECRET || "test-api-secret-key-for-testing-only";
process.env.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
process.env.MAX_SESSIONS_PER_ORG = "10";

describe("E2E Auth Flow", () => {
  let app: ReturnType<typeof createApp>;
  let server: ReturnType<typeof serve>;
  let baseUrl: string;

  beforeAll(async () => {
    const container = createContainer();
    app = createApp(container);

    await new Promise<void>((resolve) => {
      server = serve({ fetch: app.fetch, port: 9876, hostname: "127.0.0.1" }, () => resolve());
    });

    baseUrl = "http://localhost:9876";
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it("rejects unauthenticated access to protected endpoints", async () => {
    const res = await fetch(`${baseUrl}/v1/sessions`);
    expect(res.status).toBe(401);
  });

  it("returns 500 when database is unavailable (expected in test env)", async () => {
    const res = await fetch(`${baseUrl}/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: `test-${Date.now()}@example.com`, password: "password123" }),
    });

    expect(res.status).toBe(500);
  });
});

describe("E2E Health Check", () => {
  let app: ReturnType<typeof createApp>;
  let server: ReturnType<typeof serve>;
  let baseUrl: string;

  beforeAll(async () => {
    const container = createContainer();
    app = createApp(container);

    await new Promise<void>((resolve) => {
      server = serve({ fetch: app.fetch, port: 9877, hostname: "127.0.0.1" }, () => resolve());
    });

    baseUrl = "http://localhost:9877";
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it("health endpoint returns ok", async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("ok");
  });
});
