import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  VALKEY_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32),
  API_KEY_SECRET: z.string().min(32),
  CORS_ORIGINS: z.string().optional(),
  DOCKER_SOCKET: z.string().default("/var/run/docker.sock"),
  BROWSER_IMAGE: z.string().default("cykani-browser:latest"),
  MAX_SESSIONS_PER_ORG: z.coerce.number().default(10),
  SESSION_TIMEOUT_MINUTES: z.coerce.number().default(30),
  VNC_BASE_PORT: z.coerce.number().default(5900),
  VNC_WS_PORT: z.coerce.number().default(6080),
  VNC_PROXY_URL: z.string().url().optional(),
  EMAIL_API_URL: z.string().url().optional(),
  EMAIL_API_KEY: z.string().optional(),
  LEMON_SQUEEZY_API_KEY: z.string().optional(),
  LEMON_SQUEEZY_WEBHOOK_SECRET: z.string().optional(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;
export function getEnv(): Env {
  if (!_env) _env = envSchema.parse(process.env);
  return _env;
}
