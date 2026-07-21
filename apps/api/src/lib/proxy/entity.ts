import { nanoid } from "nanoid";

export interface ProxyProps {
  id: string;
  orgId: string;
  name: string;
  url: string;
  username: string | null;
  password: string | null;
  country: string | null;
  protocol: "http" | "https" | "socks5";
  status: "active" | "inactive" | "error";
  lastCheckedAt: Date | null;
  responseTimeMs: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Proxy {
  readonly id: string;
  readonly orgId: string;
  private _name: string;
  private _url: string;
  private _username: string | null;
  private _password: string | null;
  private _country: string | null;
  private _protocol: ProxyProps["protocol"];
  private _status: ProxyProps["status"];
  private _lastCheckedAt: Date | null;
  private _responseTimeMs: number | null;
  readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(p: ProxyProps) {
    this.id = p.id; this.orgId = p.orgId; this._name = p.name;
    this._url = p.url; this._username = p.username; this._password = p.password;
    this._country = p.country; this._protocol = p.protocol; this._status = p.status;
    this._lastCheckedAt = p.lastCheckedAt; this._responseTimeMs = p.responseTimeMs;
    this.createdAt = p.createdAt; this._updatedAt = p.updatedAt;
  }

  get name() { return this._name; }
  get url() { return this._url; }
  get username() { return this._username; }
  get password() { return this._password; }
  get country() { return this._country; }
  get protocol() { return this._protocol; }
  get status() { return this._status; }
  get lastCheckedAt() { return this._lastCheckedAt; }
  get responseTimeMs() { return this._responseTimeMs; }
  get updatedAt() { return this._updatedAt; }

  get proxyUrl(): string {
    if (this._username && this._password) {
      const url = new URL(this._url);
      url.username = this._username;
      url.password = this._password;
      return url.toString();
    }
    return this._url;
  }

  static create(input: { orgId: string; name: string; url: string; username?: string; password?: string; country?: string; protocol?: ProxyProps["protocol"] }): Proxy {
    const now = new Date();
    return new Proxy({
      id: nanoid(), orgId: input.orgId, name: input.name, url: input.url,
      username: input.username ?? null, password: input.password ?? null,
      country: input.country ?? null, protocol: input.protocol ?? "http",
      status: "active", lastCheckedAt: null, responseTimeMs: null,
      createdAt: now, updatedAt: now,
    });
  }

  static reconstitute(p: ProxyProps) { return new Proxy(p); }

  update(input: Partial<Pick<ProxyProps, "name" | "url" | "username" | "password" | "country" | "protocol">>) {
    if (input.name !== undefined) this._name = input.name;
    if (input.url !== undefined) this._url = input.url;
    if (input.username !== undefined) this._username = input.username;
    if (input.password !== undefined) this._password = input.password;
    if (input.country !== undefined) this._country = input.country;
    if (input.protocol !== undefined) this._protocol = input.protocol;
    this._updatedAt = new Date();
  }

  markChecked(responseTimeMs: number, status: ProxyProps["status"] = "active") {
    this._lastCheckedAt = new Date();
    this._responseTimeMs = responseTimeMs;
    this._status = status;
    this._updatedAt = new Date();
  }

  toJSON(): ProxyProps {
    return {
      id: this.id, orgId: this.orgId, name: this._name, url: this._url,
      username: this._username, password: this._password, country: this._country,
      protocol: this._protocol, status: this._status,
      lastCheckedAt: this._lastCheckedAt, responseTimeMs: this._responseTimeMs,
      createdAt: this.createdAt, updatedAt: this._updatedAt,
    };
  }
}
