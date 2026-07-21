import { z } from "zod";

export const rateLimitSchema = z.object({
  windowMs: z.number().default(60000),
  maxRequests: z.number().default(100),
});

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export class RateLimiter {
  constructor(
    private readonly windowMs = 60000,
    private readonly maxRequests = 100,
  ) {}

  async check(key: string, redis: any): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const redisKey = `rl:${key}`;

    const pipe = redis.pipeline();
    pipe.zremrangebyscore(redisKey, 0, windowStart);
    pipe.zadd(redisKey, now.toString(), `${now}-${Math.random()}`);
    pipe.zcard(redisKey);
    pipe.pexpire(redisKey, this.windowMs);

    const results = await pipe.exec();
    if (!results) return { allowed: false, remaining: 0, resetMs: this.windowMs };

    const count = (results[2]?.[1] as number) ?? 0;
    return {
      allowed: count <= this.maxRequests,
      remaining: Math.max(0, this.maxRequests - count),
      resetMs: this.windowMs,
    };
  }
}
