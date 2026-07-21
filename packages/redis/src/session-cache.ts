import type Redis from "ioredis";

export class SessionCache {
  private readonly prefix = "session:";
  private readonly ttlSeconds = 300;

  constructor(private readonly redis: Redis) {}

  async set(sessionId: string, data: Record<string, unknown>): Promise<void> {
    await this.redis.setex(
      `${this.prefix}${sessionId}`,
      this.ttlSeconds,
      JSON.stringify(data)
    );
  }

  async get(sessionId: string): Promise<Record<string, unknown> | null> {
    const raw = await this.redis.get(`${this.prefix}${sessionId}`);
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, unknown>;
  }

  async delete(sessionId: string): Promise<void> {
    await this.redis.del(`${this.prefix}${sessionId}`);
  }

  async exists(sessionId: string): Promise<boolean> {
    const result = await this.redis.exists(`${this.prefix}${sessionId}`);
    return result === 1;
  }
}
