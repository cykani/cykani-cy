import Redis from "ioredis";

let _redis: Redis | null = null;
export function getRedis(url = process.env.VALKEY_URL ?? process.env.REDIS_URL ?? "redis://localhost:6379"): Redis {
  if (!_redis) _redis = new Redis(url, { maxRetriesPerRequest: 3, retryStrategy: (t) => Math.min(t * 200, 5000) });
  return _redis;
}
export async function closeRedis() { if (_redis) { await _redis.quit(); _redis = null; } }
