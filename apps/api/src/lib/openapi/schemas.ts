import { z } from "zod";

export const SessionSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  profileId: z.string(),
  status: z.enum(["idle", "launching", "running", "stopping", "stopped", "error"]),
  containerId: z.string().nullable(),
  vncPort: z.number().nullable(),
  cdpPort: z.number().nullable(),
  vncPassword: z.string().nullable(),
  startedAt: z.string().nullable(),
  expiresAt: z.string().nullable(),
  metadata: z.record(z.unknown()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ProfileSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  name: z.string(),
  fingerprintSeed: z.number(),
  platform: z.enum(["windows", "macos", "linux", "android"]),
  proxyUrl: z.string().nullable(),
  viewportWidth: z.number(),
  viewportHeight: z.number(),
  locale: z.string(),
  timezone: z.string(),
  extensions: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AgentSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  sessionId: z.string(),
  profileId: z.string(),
  status: z.enum(["idle", "running", "completed", "failed", "cancelled"]),
  task: z.object({
    goal: z.string(),
    steps: z.array(z.object({
      action: z.string(),
      target: z.string().optional(),
      value: z.string().optional(),
    })),
  }),
  steps: z.array(z.any()),
  result: z.any().nullable(),
  error: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ProxySchema = z.object({
  id: z.string(),
  orgId: z.string(),
  name: z.string(),
  url: z.string(),
  username: z.string().nullable(),
  password: z.string().nullable(),
  country: z.string().nullable(),
  protocol: z.enum(["http", "https", "socks5"]),
  status: z.enum(["active", "inactive", "error"]),
  lastCheckedAt: z.string().nullable(),
  responseTimeMs: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export const PaginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export const CreateSessionSchema = z.object({
  profileId: z.string().min(1),
  ttlMinutes: z.number().min(1).max(1440).optional(),
});

export const CreateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  fingerprintSeed: z.number().int().min(0).max(99999).optional(),
  platform: z.enum(["windows", "macos", "linux", "android"]).optional(),
  proxyUrl: z.string().url().optional(),
  viewportWidth: z.number().int().min(320).max(7680).optional(),
  viewportHeight: z.number().int().min(240).max(4320).optional(),
  locale: z.string().optional(),
  timezone: z.string().optional(),
  extensions: z.array(z.string()).optional(),
});

export const CreateAgentSchema = z.object({
  sessionId: z.string().min(1),
  profileId: z.string().min(1),
  task: z.object({
    goal: z.string().min(1),
    steps: z.array(z.object({
      action: z.string().min(1),
      target: z.string().optional(),
      value: z.string().optional(),
    })).min(1),
    maxSteps: z.number().int().min(1).max(100).optional(),
    llmModel: z.string().optional(),
  }),
});

export const CreateProxySchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url(),
  username: z.string().optional(),
  password: z.string().optional(),
  country: z.string().optional(),
  protocol: z.enum(["http", "https", "socks5"]).optional(),
});
