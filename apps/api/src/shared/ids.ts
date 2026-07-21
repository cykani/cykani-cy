export type Brand<K, T> = T & { __brand: K };

export type SessionId = Brand<"SessionId", string>;
export type ProfileId = Brand<"ProfileId", string>;
export type AgentId = Brand<"AgentId", string>;
export type OrgId = Brand<"OrgId", string>;
export type UserId = Brand<"UserId", string>;

export function newSessionId(): SessionId {
  return crypto.randomUUID() as SessionId;
}
export function newProfileId(): ProfileId {
  return crypto.randomUUID() as ProfileId;
}
export function newAgentId(): AgentId {
  return crypto.randomUUID() as AgentId;
}
export function newOrgId(): OrgId {
  return crypto.randomUUID() as OrgId;
}
export function newUserId(): UserId {
  return crypto.randomUUID() as UserId;
}
