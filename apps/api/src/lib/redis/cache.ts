import type Redis from "ioredis";

export class SessionCache {
  private readonly prefix = "session:";
  constructor(private readonly redis: Redis, private readonly ttl = 300) {}
  async set(id: string, data: Record<string, unknown>) { await this.redis.setex(this.prefix + id, this.ttl, JSON.stringify(data)); }
  async get(id: string): Promise<Record<string, unknown> | null> { const r = await this.redis.get(this.prefix + id); return r ? JSON.parse(r) : null; }
  async del(id: string) { await this.redis.del(this.prefix + id); }
}
