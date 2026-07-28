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
  // ---------------------------------------------------------------------------
  // AnyIP proxy provider (free 5GB trial)
  // Set ANYIP_USERNAME and ANYIP_PASSWORD — never commit real values.
  // ---------------------------------------------------------------------------
  ANYIP_USERNAME: z.string().optional(),
  ANYIP_PASSWORD: z.string().optional(),
  ANYIP_HOST: z.string().default("portal.anyip.io"),
  ANYIP_PORT: z.coerce.number().default(1080),
  // ---------------------------------------------------------------------------
  // LLM Provider config
  // Default: Hermes 3 via OpenRouter (MIT model, free tier available).
  // Switch to groq/openai/anthropic/custom via LLM_PROVIDER env var.
  // Users never configure this — it's backend infrastructure.
  // ---------------------------------------------------------------------------
  LLM_PROVIDER: z.enum(["hermes", "groq", "openai", "anthropic", "custom"]).default("hermes"),
  LLM_MODEL: z.string().optional(),                         // overrides provider default model
  LLM_BASE_URL: z.string().url().optional(),               // for custom/self-hosted endpoints
  OPENROUTER_API_KEY: z.string().optional(),               // for hermes via OpenRouter
  GROQ_API_KEY: z.string().optional(),                     // for groq provider
  OPENAI_API_KEY: z.string().optional(),                   // for openai provider
  ANTHROPIC_API_KEY: z.string().optional(),                // for anthropic provider
  LLM_API_KEY: z.string().optional(),                      // generic fallback key
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;
export function getEnv(): Env {
  if (!_env) _env = envSchema.parse(process.env);
  return _env;
}
