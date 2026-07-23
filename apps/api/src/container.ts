import { getEnv } from "./env";
import { db } from "./lib/db/client";
import { getRedis } from "./lib/redis/client";
import { RedisPubSub } from "./lib/redis/pubsub";
import { DockerEngine } from "./lib/docker/engine";
import { NoVncProxy } from "./lib/vnc/proxy";
import { SessionService } from "./lib/session/service";
import { ProfileService } from "./lib/profile/service";
import { AgentService } from "./lib/agent/service";
import { OrgService } from "./lib/organization/service";
import { BillingService } from "./lib/billing/service";
import { ProxyService } from "./lib/proxy/service";
import { RateLimiter } from "./lib/rate-limit";
import { WebhookService } from "./lib/webhooks";
import { UsageTracker } from "./lib/usage";
import { StealthService } from "./lib/stealth/service";
import { RecordingService } from "./lib/recording";
import { ScreenshotService } from "./lib/screenshots";
import { EventBus as SSEBus } from "./lib/events";
import { ListmonkEmailService } from "./lib/email/listmonk";
import type { EmailService } from "./lib/email/types";
import { ApiKeyService } from "./lib/api-keys/service";
import { LicenseKeyService } from "./lib/license/service";

export interface Container {
  env: ReturnType<typeof getEnv>;
  db: typeof db;
  redis: ReturnType<typeof getRedis>;
  eventBus: RedisPubSub;
  docker: DockerEngine;
  vnc: NoVncProxy;
  stealth: StealthService;
  sessionService: SessionService;
  profileService: ProfileService;
  agentService: AgentService;
  orgService: OrgService;
  billingService: BillingService;
  proxyService: ProxyService;
  rateLimiter: RateLimiter;
  webhooks: WebhookService;
  usage: UsageTracker;
  recording: RecordingService;
  screenshots: ScreenshotService;
  sseBus: SSEBus;
  email: EmailService;
  apiKeyService: ApiKeyService;
  licenseKeyService: LicenseKeyService;
}

let _c: Container | null = null;

export function createContainer(): Container {
  if (_c) return _c;
  const env = getEnv();
  const redis = getRedis(env.REDIS_URL);
  const eventBus = new RedisPubSub(redis);
  const docker = new DockerEngine(env.DOCKER_SOCKET, env.BROWSER_IMAGE);
  const vnc = new NoVncProxy();
  const stealth = new StealthService();
  const webhooks = new WebhookService();
  const usage = new UsageTracker();
  const recording = new RecordingService();
  const screenshots = new ScreenshotService();
  const sseBus = new SSEBus();

  const email: EmailService = env.EMAIL_API_URL && env.EMAIL_API_KEY
    ? new ListmonkEmailService({ baseUrl: env.EMAIL_API_URL, apiKey: env.EMAIL_API_KEY })
    : { send: async () => { throw new Error("Email service not configured"); } };

  const sessionService = new SessionService(db, eventBus, env.MAX_SESSIONS_PER_ORG);
  const profileService = new ProfileService(db);
  const agentService = new AgentService(db);
  const orgService = new OrgService(db);
  const billingService = new BillingService(db, env.LEMON_SQUEEZY_API_KEY);
  const proxyService = new ProxyService(db);
  const apiKeyService = new ApiKeyService(db, env.API_KEY_SECRET);
  const licenseKeyService = new LicenseKeyService(db, env.API_KEY_SECRET);

  eventBus.subscribe("*", async (event) => {
    sseBus.publish(event.payload.orgId as string ?? "", event.eventType, event.payload);
    await webhooks.dispatch(event.eventType, event.payload);
  });

  eventBus.subscribe("session.launched", async (event) => {
    usage.record(event.payload.orgId as string, "session_minutes", 0);
    const summary = usage.getSummary(event.payload.orgId as string);
    sseBus.publish(event.payload.orgId as string, "usage.updated", { type: "session_minutes", summary });
  });

  eventBus.subscribe("session.terminated", async (event) => {
    usage.record(event.payload.orgId as string, "session_minutes", 1);
    const summary = usage.getSummary(event.payload.orgId as string);
    sseBus.publish(event.payload.orgId as string, "usage.updated", { type: "session_minutes", summary });
  });

  _c = {
    env, db, redis, eventBus, docker, vnc,
    sessionService, profileService, agentService,
    orgService, billingService, proxyService, stealth,
    rateLimiter: new RateLimiter(60000, 100),
    webhooks, usage, recording, screenshots, sseBus, email,
    apiKeyService, licenseKeyService,
  };
  return _c;
}
