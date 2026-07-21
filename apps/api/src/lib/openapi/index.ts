import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import type { ApiEnv } from "../../shared/hono";
import {
  SessionSchema, ProfileSchema, AgentSchema, ProxySchema,
  ErrorSchema, CreateSessionSchema, CreateProfileSchema,
  CreateAgentSchema, CreateProxySchema, PaginationSchema,
} from "./schemas";

export const AppOpenAPI = new OpenAPIHono<ApiEnv>();

AppOpenAPI.doc("/openapi.json", {
  openapi: "3.1.0",
  info: {
    title: "Cykani API",
    version: "1.0.0",
    description: "Cloud browser automation API with stealth fingerprinting",
  },
  servers: [{ url: "http://localhost:3000" }],
  tags: [
    { name: "Sessions", description: "Browser session management" },
    { name: "Profiles", description: "Browser fingerprint profiles" },
    { name: "Agents", description: "AI-powered browser agents" },
    { name: "Proxies", description: "Proxy management" },
    { name: "Analytics", description: "Usage analytics" },
  ],
});

const listSessionsRoute = createRoute({
  method: "get",
  path: "/v1/sessions",
  tags: ["Sessions"],
  summary: "List sessions",
  responses: {
    200: {
      content: { "application/json": { schema: z.object({ sessions: z.array(SessionSchema), limit: z.number(), offset: z.number() }) } },
      description: "List of sessions",
    },
  },
});

const createSessionRoute = createRoute({
  method: "post",
  path: "/v1/sessions",
  tags: ["Sessions"],
  summary: "Create a session",
  request: { body: { content: { "application/json": { schema: CreateSessionSchema } } } },
  responses: {
    201: {
      content: { "application/json": { schema: z.object({ session: SessionSchema }) } },
      description: "Session created",
    },
    400: { content: { "application/json": { schema: ErrorSchema } }, description: "Error" },
  },
});

const listProfilesRoute = createRoute({
  method: "get",
  path: "/v1/profiles",
  tags: ["Profiles"],
  summary: "List profiles",
  responses: {
    200: {
      content: { "application/json": { schema: z.object({ profiles: z.array(ProfileSchema), limit: z.number(), offset: z.number() }) } },
      description: "List of profiles",
    },
  },
});

const createProfileRoute = createRoute({
  method: "post",
  path: "/v1/profiles",
  tags: ["Profiles"],
  summary: "Create a profile",
  request: { body: { content: { "application/json": { schema: CreateProfileSchema } } } },
  responses: {
    201: {
      content: { "application/json": { schema: z.object({ profile: ProfileSchema }) } },
      description: "Profile created",
    },
  },
});

const listAgentsRoute = createRoute({
  method: "get",
  path: "/v1/agents",
  tags: ["Agents"],
  summary: "List agents",
  responses: {
    200: {
      content: { "application/json": { schema: z.object({ agents: z.array(AgentSchema), limit: z.number(), offset: z.number() }) } },
      description: "List of agents",
    },
  },
});

const createAgentRoute = createRoute({
  method: "post",
  path: "/v1/agents",
  tags: ["Agents"],
  summary: "Create an agent",
  request: { body: { content: { "application/json": { schema: CreateAgentSchema } } } },
  responses: {
    201: {
      content: { "application/json": { schema: z.object({ agent: AgentSchema }) } },
      description: "Agent created",
    },
  },
});

const listProxiesRoute = createRoute({
  method: "get",
  path: "/v1/proxies",
  tags: ["Proxies"],
  summary: "List proxies",
  responses: {
    200: {
      content: { "application/json": { schema: z.object({ proxies: z.array(ProxySchema), limit: z.number(), offset: z.number() }) } },
      description: "List of proxies",
    },
  },
});

const createProxyRoute = createRoute({
  method: "post",
  path: "/v1/proxies",
  tags: ["Proxies"],
  summary: "Create a proxy",
  request: { body: { content: { "application/json": { schema: CreateProxySchema } } } },
  responses: {
    201: {
      content: { "application/json": { schema: z.object({ proxy: ProxySchema }) } },
      description: "Proxy created",
    },
  },
});

AppOpenAPI.openapi(listSessionsRoute, (c) => c.json({ sessions: [], limit: 20, offset: 0 }));
AppOpenAPI.openapi(createSessionRoute, (c) => c.json({ session: {} as any }, 201));
AppOpenAPI.openapi(listProfilesRoute, (c) => c.json({ profiles: [], limit: 20, offset: 0 }));
AppOpenAPI.openapi(createProfileRoute, (c) => c.json({ profile: {} as any }, 201));
AppOpenAPI.openapi(listAgentsRoute, (c) => c.json({ agents: [], limit: 20, offset: 0 }));
AppOpenAPI.openapi(createAgentRoute, (c) => c.json({ agent: {} as any }, 201));
AppOpenAPI.openapi(listProxiesRoute, (c) => c.json({ proxies: [], limit: 20, offset: 0 }));
AppOpenAPI.openapi(createProxyRoute, (c) => c.json({ proxy: {} as any }, 201));
