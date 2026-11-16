import type { QuotaStore } from './contracts';

// One atomic operation. Denied requests do not extend the window or spend quota.
const CONSUME_SCRIPT = `
local count = tonumber(redis.call('GET', KEYS[1]) or '0')
if count >= tonumber(ARGV[1]) then
  return {0, math.max(1, redis.call('TTL', KEYS[1]))}
end
count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[2]) end
return {1, 0}
`;

export function createRedisQuotaStore({
  url,
  token,
  fetcher = fetch,
}: {
  url: string;
  token: string;
  fetcher?: typeof fetch;
}): QuotaStore {
  const endpoint = new URL(url);
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password) {
    throw new Error('Chat Redis must use an HTTPS REST endpoint.');
  }
  return {
    async consume(key, limit, windowSeconds, signal) {
      const response = await fetcher(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify([
          'EVAL',
          CONSUME_SCRIPT,
          '1',
          key,
          String(limit),
          String(windowSeconds),
        ]),
        cache: 'no-store',
        signal,
      });
      if (!response.ok) throw new Error('Chat quota storage is unavailable.');
      const payload: unknown = await response.json();
      const result =
        typeof payload === 'object' && payload !== null && 'result' in payload
          ? payload.result
          : null;
      if (
        !Array.isArray(result) ||
        result.length !== 2 ||
        ![0, 1].includes(result[0]) ||
        !Number.isInteger(result[1]) ||
        result[1] < 0
      ) {
        throw new Error('Chat quota storage returned an invalid result.');
      }
      return { allowed: result[0] === 1, retryAfterSeconds: result[1] };
    },
  };
}

/** Development/test adapter. Never used as a production fallback. */
export function createMemoryQuotaStore(now = Date.now): QuotaStore {
  const buckets = new Map<string, { count: number; expiresAt: number }>();
  return {
    async consume(key, limit, windowSeconds, signal) {
      signal.throwIfAborted();
      const time = now();
      for (const [id, bucket] of buckets) {
        if (bucket.expiresAt <= time) buckets.delete(id);
      }
      let bucket = buckets.get(key);
      if (!bucket) {
        if (buckets.size >= 10_000) throw new Error('Development quota storage is full.');
        bucket = { count: 0, expiresAt: time + windowSeconds * 1000 };
        buckets.set(key, bucket);
      }
      if (bucket.count >= limit) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil((bucket.expiresAt - time) / 1000)),
        };
      }
      bucket.count += 1;
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}
