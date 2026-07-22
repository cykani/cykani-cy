import { pgTable, text, timestamp, jsonb, integer, index, uniqueIndex } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";
function gid() { return nanoid(); }

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey().$defaultFn(gid), name: text("name").notNull(), plan: text("plan").notNull().default("free"),
  ownerId: text("owner_id").notNull(), stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("idx_org_owner").on(t.ownerId)]);

export const memberships = pgTable("memberships", {
  id: text("id").primaryKey().$defaultFn(gid), orgId: text("org_id").notNull().references(() => organizations.id),
  userId: text("user_id").notNull(), role: text("role").notNull().default("member"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("idx_mem_org").on(t.orgId), index("idx_mem_user").on(t.userId), uniqueIndex("idx_mem_org_user").on(t.orgId, t.userId)]);

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey().$defaultFn(gid), orgId: text("org_id").notNull().references(() => organizations.id),
  name: text("name").notNull(), fingerprintSeed: integer("fingerprint_seed").notNull(),
  platform: text("platform").notNull().default("windows"), proxyUrl: text("proxy_url"),
  viewportWidth: integer("viewport_width").notNull().default(1280), viewportHeight: integer("viewport_height").notNull().default(800),
  locale: text("locale").notNull().default("en-US"), timezone: text("timezone").notNull().default("America/New_York"),
  userAgent: text("user_agent"), cookies: jsonb("cookies"), localStorage: jsonb("local_storage"),
  extensions: jsonb("extensions").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("idx_prof_org").on(t.orgId)]);

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey().$defaultFn(gid), orgId: text("org_id").notNull().references(() => organizations.id),
  profileId: text("profile_id").notNull().references(() => profiles.id), status: text("status").notNull().default("idle"),
  containerId: text("container_id"), vncPort: integer("vnc_port"), cdpPort: integer("cdp_port"),
  vncPassword: text("vnc_password"), startedAt: timestamp("started_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("idx_sess_org").on(t.orgId), index("idx_sess_status").on(t.status), index("idx_sess_container").on(t.containerId)]);

export const agents = pgTable("agents", {
  id: text("id").primaryKey().$defaultFn(gid), orgId: text("org_id").notNull().references(() => organizations.id),
  sessionId: text("session_id").notNull().references(() => sessions.id),
  profileId: text("profile_id").notNull().references(() => profiles.id), status: text("status").notNull().default("idle"),
  task: jsonb("task").notNull(), steps: jsonb("steps").notNull().default([]),
  result: jsonb("result"), error: text("error"),
  startedAt: timestamp("started_at", { withTimezone: true }), completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("idx_agent_org").on(t.orgId), index("idx_agent_status").on(t.status)]);

export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey().$defaultFn(gid), orgId: text("org_id").notNull().references(() => organizations.id),
  keyHash: text("key_hash").notNull(), name: text("name").notNull(),
  scopes: jsonb("scopes").$type<string[]>().default([]),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("idx_key_org").on(t.orgId), uniqueIndex("idx_key_hash").on(t.keyHash)]);

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(gid), orgId: text("org_id").notNull().references(() => organizations.id),
  plan: text("plan").notNull().default("free"), stripeSubscriptionId: text("stripe_subscription_id"),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("idx_sub_org").on(t.orgId)]);

export const usageRecords = pgTable("usage_records", {
  id: text("id").primaryKey().$defaultFn(gid), orgId: text("org_id").notNull().references(() => organizations.id),
  sessionMinutes: integer("session_minutes").notNull().default(0), agentSteps: integer("agent_steps").notNull().default(0),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("idx_usage_org").on(t.orgId)]);

export const licenseKeys = pgTable("license_keys", {
  id: text("id").primaryKey().$defaultFn(gid), orgId: text("org_id").notNull().references(() => organizations.id),
  keyHash: text("key_hash").notNull(), plan: text("plan").notNull().default("pro"),
  stripeCustomerId: text("stripe_customer_id"), stripeSubscriptionId: text("stripe_subscription_id"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("idx_lic_org").on(t.orgId), uniqueIndex("idx_lic_hash").on(t.keyHash)]);

export const proxies = pgTable("proxies", {
  id: text("id").primaryKey().$defaultFn(gid), orgId: text("org_id").notNull().references(() => organizations.id),
  name: text("name").notNull(), url: text("url").notNull(),
  username: text("username"), password: text("password"),
  country: text("country"), protocol: text("protocol").notNull().default("http"),
  status: text("status").notNull().default("active"),
  lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
  responseTimeMs: integer("response_time_ms"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("idx_proxy_org").on(t.orgId)]);

export const authUsers = pgTable("auth_users", {
  id: text("id").primaryKey().$defaultFn(gid),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  passwordHash: text("password_hash"),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const authAccounts = pgTable("auth_accounts", {
  id: text("id").primaryKey().$defaultFn(gid),
  userId: text("user_id").notNull().references(() => authUsers.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("oauth"),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (t) => [uniqueIndex("idx_auth_account_provider").on(t.provider, t.providerAccountId)]);

export const authSessions = pgTable("auth_sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => authUsers.id, { onDelete: "cascade" }),
  expires: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const authVerificationTokens = pgTable("auth_verification_tokens", {
  identifier: text("email").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires_at", { withTimezone: true }).notNull(),
});
