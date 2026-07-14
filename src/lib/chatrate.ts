/**
 * Two independent guards:
 * 1. Per-IP rate limit — applies to EVERY request that reaches the route.
 * 2. Global daily OpenAI budget — applies ONLY to requests that call OpenAI.
 */

interface Bucket {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // ~5 messages/minute per IP

const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_OPENAI_REQUESTS_PER_DAY_GLOBAL = 300;

const perIpBuckets = new Map<string, Bucket>();
let globalDailyBucket: Bucket = { count: 0, windowStart: Date.now() };

/**
 * Sweeps the internal Map to remove stale buckets. 
 * Executed inline to ensure memory safety in serverless environments.
 */
function lazyEvictStaleBuckets(now: number) {
  // To avoid performance hits on every single request, we only sweep 
  // with a 10% random probability per request.
  if (Math.random() > 0.1) return;

  for (const [ip, bucket] of perIpBuckets.entries()) {
    if (now - bucket.windowStart > WINDOW_MS * 2) {
      perIpBuckets.delete(ip);
    }
  }
}

export function checkIpRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  
  // Clean up old records reliably without relying on background intervals
  lazyEvictStaleBuckets(now);

  const bucket = perIpBuckets.get(ip);

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    perIpBuckets.set(ip, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - bucket.windowStart)) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function checkOpenAiBudget(): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  if (now - globalDailyBucket.windowStart > DAILY_WINDOW_MS) {
    globalDailyBucket = { count: 0, windowStart: now };
  }
  if (globalDailyBucket.count >= MAX_OPENAI_REQUESTS_PER_DAY_GLOBAL) {
    return { allowed: false, retryAfterSeconds: 3600 };
  }

  globalDailyBucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}