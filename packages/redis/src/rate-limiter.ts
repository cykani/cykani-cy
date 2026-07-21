import type Redis from "ioredis";

export class RateLimiter {
  constructor(
    private readonly redis: Redis,
    private readonly windowMs: number = 60_000,
    private readonly maxRequests: number = 100
  ) {}

  async check(key: string): Promise<{ allowed: boolean; remaining: number; retryAfterMs: number }> {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const redisKey = `ratelimit:${key}`;

    const pipe = this.redis.pipeline();
    pipe.zremrangebyscore(redisKey, 0, windowStart);
    pipe.zadd(redisKey, now.toString(), `${now}-${Math.random()}`);
    pipe.zcard(redisKey);
    pipe.pexpire(redisKey, this.windowMs);

    const results = await pipe.exec();
    if (!results) return { allowed: false, remaining: 0, retryAfterMs: this.windowMs };

    const count = (results[2]?.[1] as number) ?? 0;
    const allowed = count <= this.maxRequests;

    return {
      allowed,
      remaining: Math.max(0, this.maxRequests - count),
      retryAfterMs: allowed ? 0 : this.windowMs,
    };
  }
}
