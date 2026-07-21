import { pgTable, text, timestamp, jsonb, integer, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

function generateId(): string {
  return nanoid();
}

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey().$defaultFn(generateId),
  name: text("name").notNull(),
  plan: text("plan").notNull().default("free"),
  ownerId: text("owner_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_organizations_owner_id").on(table.ownerId),
]);

export const memberships = pgTable("memberships", {
  id: text("id").primaryKey().$defaultFn(generateId),
  orgId: text("org_id").notNull().references(() => organizations.id),
  userId: text("user_id").notNull(),
  role: text("role").notNull().default("member"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_memberships_org_id").on(table.orgId),
  index("idx_memberships_user_id").on(table.userId),
  uniqueIndex("idx_memberships_org_user").on(table.orgId, table.userId),
]);

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey().$defaultFn(generateId),
  orgId: text("org_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  fingerprintSeed: integer("fingerprint_seed").notNull(),
  platform: text("platform").notNull().default("windows"),
  proxyUrl: text("proxy_url"),
  viewportWidth: integer("viewport_width").notNull().default(1280),
  viewportHeight: integer("viewport_height").notNull().default(800),
  locale: text("locale").notNull().default("en-US"),
  timezone: text("timezone").notNull().default("America/New_York"),
  userAgent: text("user_agent"),
  cookies: jsonb("cookies"),
  localStorage: jsonb("local_storage"),
  extensions: jsonb("extensions").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_profiles_org_id").on(table.orgId),
]);

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey().$defaultFn(generateId),
  orgId: text("org_id").notNull().references(() => organizations.id),
  profileId: text("profile_id").notNull().references(() => profiles.id),
  status: text("status").notNull().default("idle"),
  containerId: text("container_id"),
  vncPort: integer("vnc_port"),
  cdpPort: integer("cdp_port"),
  vncPassword: text("vnc_password"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_sessions_org_id").on(table.orgId),
  index("idx_sessions_profile_id").on(table.profileId),
  index("idx_sessions_status").on(table.status),
  index("idx_sessions_container_id").on(table.containerId),
  index("idx_sessions_expires_at").on(table.expiresAt),
]);

export const agents = pgTable("agents", {
  id: text("id").primaryKey().$defaultFn(generateId),
  orgId: text("org_id").notNull().references(() => organizations.id),
  sessionId: text("session_id").notNull().references(() => sessions.id),
  profileId: text("profile_id").notNull().references(() => profiles.id),
  status: text("status").notNull().default("idle"),
  task: jsonb("task").notNull(),
  steps: jsonb("steps").notNull().default([]),
  result: jsonb("result"),
  error: text("error"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_agents_org_id").on(table.orgId),
  index("idx_agents_session_id").on(table.sessionId),
  index("idx_agents_status").on(table.status),
]);

export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey().$defaultFn(generateId),
  orgId: text("org_id").notNull().references(() => organizations.id),
  keyHash: text("key_hash").notNull(),
  name: text("name").notNull(),
  scopes: jsonb("scopes").$type<string[]>().default([]),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_api_keys_org_id").on(table.orgId),
  uniqueIndex("idx_api_keys_key_hash").on(table.keyHash),
]);

export const usageRecords = pgTable("usage_records", {
  id: text("id").primaryKey().$defaultFn(generateId),
  orgId: text("org_id").notNull().references(() => organizations.id),
  sessionMinutes: integer("session_minutes").notNull().default(0),
  agentSteps: integer("agent_steps").notNull().default(0),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_usage_records_org_id").on(table.orgId),
  index("idx_usage_records_recorded_at").on(table.recordedAt),
]);

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(generateId),
  orgId: text("org_id").notNull().references(() => organizations.id),
  plan: text("plan").notNull().default("free"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_subscriptions_org_id").on(table.orgId),
  uniqueIndex("idx_subscriptions_stripe_id").on(table.stripeSubscriptionId),
]);

export type OrganizationRow = typeof organizations.$inferSelect;
export type ProfileRow = typeof profiles.$inferSelect;
export type SessionRow = typeof sessions.$inferSelect;
export type AgentRow = typeof agents.$inferSelect;
export type ApiKeyRow = typeof apiKeys.$inferSelect;
export type UsageRecordRow = typeof usageRecords.$inferSelect;
export type SubscriptionRow = typeof subscriptions.$inferSelect;
export type MembershipRow = typeof memberships.$inferSelect;
