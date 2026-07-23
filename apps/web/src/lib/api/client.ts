const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const token = getCookie("cykani_token");

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-API-Key": process.env.NEXT_PUBLIC_API_KEY ?? "ck_dev_test",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: "Request failed" } }));
    throw new Error(error.error?.message ?? `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  sessions: {
    list: (params?: { limit?: number; offset?: number }) =>
      request<{ sessions: any[]; limit: number; offset: number }>(
        `/v1/sessions?${new URLSearchParams(params as any)}`
      ),
    get: (id: string) => request<{ session: any }>(`/v1/sessions/${id}`),
    create: (data: { profileId: string; ttlMinutes?: number }) =>
      request<{ session: any }>("/v1/sessions", { method: "POST", body: data }),
    stop: (id: string) =>
      request<{ session: any }>(`/v1/sessions/${id}/stop`, { method: "POST" }),
  },

  profiles: {
    list: (params?: { limit?: number; offset?: number }) =>
      request<{ profiles: any[]; limit: number; offset: number }>(
        `/v1/profiles?${new URLSearchParams(params as any)}`
      ),
    get: (id: string) => request<{ profile: any }>(`/v1/profiles/${id}`),
    create: (data: any) =>
      request<{ profile: any }>("/v1/profiles", { method: "POST", body: data }),
    update: (id: string, data: any) =>
      request<{ profile: any }>(`/v1/profiles/${id}`, { method: "PUT", body: data }),
    delete: (id: string) =>
      request<{ deleted: boolean }>(`/v1/profiles/${id}`, { method: "DELETE" }),
    clone: (id: string, data: { name: string }) =>
      request<{ profile: any }>(`/v1/profiles/${id}/clone`, { method: "POST", body: data }),
  },

  agents: {
    list: (params?: { limit?: number; offset?: number }) =>
      request<{ agents: any[]; limit: number; offset: number }>(
        `/v1/agents?${new URLSearchParams(params as any)}`
      ),
    get: (id: string) => request<{ agent: any }>(`/v1/agents/${id}`),
    create: (data: any) =>
      request<{ agent: any }>("/v1/agents", { method: "POST", body: data }),
    stop: (id: string) =>
      request<{ agent: any }>(`/v1/agents/${id}/stop`, { method: "POST" }),
    steps: (id: string) =>
      request<{ steps: any[]; progress: any }>(`/v1/agents/${id}/steps`),
  },

  proxies: {
    list: (params?: { limit?: number; offset?: number }) =>
      request<{ proxies: any[]; limit: number; offset: number }>(
        `/v1/proxies?${new URLSearchParams(params as any)}`
      ),
    get: (id: string) => request<{ proxy: any }>(`/v1/proxies/${id}`),
    create: (data: any) =>
      request<{ proxy: any }>("/v1/proxies", { method: "POST", body: data }),
    update: (id: string, data: any) =>
      request<{ proxy: any }>(`/v1/proxies/${id}`, { method: "PUT", body: data }),
    delete: (id: string) =>
      request<{ deleted: boolean }>(`/v1/proxies/${id}`, { method: "DELETE" }),
  },

  orgs: {
    get: (id: string) => request<{ org: any }>(`/v1/orgs/${id}`),
    me: () => request<{ org: any }>("/v1/orgs/me"),
    members: (id: string) => request<{ members: any[] }>(`/v1/orgs/${id}/members`),
    usage: (id: string) =>
      request<{ usage: any }>(`/v1/orgs/${id}/usage`),
  },

  billing: {
    plans: () => request<{ plans: any[] }>("/v1/billing/plans"),
    checkout: (data: { plan: string; provider?: "stripe" | "kofi" | "lemonsqueezy" }) =>
      request<{ checkoutUrl: string | null; sessionId?: string; subscription?: any; provider?: string }>("/v1/billing/checkout", {
        method: "POST",
        body: data,
      }),
  },

  apiKeys: {
    list: () => request<{ keys: any[] }>("/v1/api-keys"),
    create: (data: { name: string; scopes?: string[] }) =>
      request<{ key: any; raw: string }>("/v1/api-keys", { method: "POST", body: data }),
    revoke: (id: string) =>
      request<{ deleted: boolean }>(`/v1/api-keys/${id}`, { method: "DELETE" }),
  },

  auth: {
    login: (data: { email: string; password: string }) =>
      request<{ user: any; orgId: string; token: string }>("/v1/auth/login", {
        method: "POST",
        body: data,
      }),
    register: (data: { email: string; password: string; name?: string }) =>
      request<{ user: any; orgId: string; token: string }>("/v1/auth/register", {
        method: "POST",
        body: data,
      }),
    me: () => request<{ user: any; orgId: string; role: string }>("/v1/auth/me"),
    logout: () => request<{ success: boolean }>("/v1/auth/logout", { method: "POST" }),
  },

  health: () => request<{ status: string; timestamp: string; version: string }>("/health"),
};
