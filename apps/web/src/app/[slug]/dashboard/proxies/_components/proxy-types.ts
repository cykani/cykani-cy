export interface Proxy {
  id: string;
  name: string;
  protocol: "http" | "https" | "socks4" | "socks5";
  host: string;
  port: number;
  username?: string;
  password?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  isp?: string;
  status: "untested" | "active" | "error" | "slow";
  responseTimeMs?: number;
  lastTestedAt?: string;
  createdAt: string;
  tags: string[];
  note?: string;
}

export function proxyToUrl(proxy: Proxy): string {
  const auth = proxy.username ? `${proxy.username}:${proxy.password ?? ""}@` : "";
  return `${proxy.protocol}://${auth}${proxy.host}:${proxy.port}`;
}

export function parseProxyString(raw: string): Partial<Proxy> | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Format: protocol://user:pass@host:port
  try {
    const url = new URL(trimmed.includes("://") ? trimmed : `http://${trimmed}`);
    const protocol = (trimmed.split("://")[0] ?? "http") as Proxy["protocol"];
    const host = url.hostname;
    const port = url.port ? Number.parseInt(url.port, 10) : 80;
    const username = url.username || undefined;
    const password = url.password || undefined;
    if (host && port) return { protocol, host, port, username, password };
  } catch { /* ignore */ }

  // Format: host:port:user:pass
  const parts = trimmed.split(":");
  if (parts.length >= 2) {
    const host = parts[0];
    const port = Number.parseInt(parts[1] ?? "80", 10);
    const username = parts[2] || undefined;
    const password = parts[3] || undefined;
    if (host && !Number.isNaN(port)) {
      return { protocol: "http", host, port, username, password };
    }
  }

  return null;
}

const STORAGE_KEY = "cykani_proxies";

export function loadProxies(): Proxy[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Proxy[]) : [];
  } catch { return []; }
}

export function saveProxies(proxies: Proxy[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proxies));
}

export function addProxy(data: Omit<Proxy, "id" | "createdAt" | "status" | "tags">): Proxy {
  const proxy: Proxy = {
    ...data,
    id: `prx_${Date.now().toString(36)}`,
    status: "untested",
    createdAt: new Date().toISOString(),
    tags: [],
  };
  const existing = loadProxies();
  saveProxies([proxy, ...existing]);
  return proxy;
}

export function removeProxy(id: string): void {
  saveProxies(loadProxies().filter((p) => p.id !== id));
}

export function updateProxy(id: string, updates: Partial<Proxy>): void {
  saveProxies(loadProxies().map((p) => (p.id === id ? { ...p, ...updates } : p)));
}
