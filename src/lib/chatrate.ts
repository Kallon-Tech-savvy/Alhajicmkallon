/**
 * In-memory rate limiter — good enough for a single Node server or a
 * low-traffic serverless deployment where the function instance stays warm.
 *
 * IMPORTANT: this resets whenever the server process restarts or a new
 * serverless instance spins up, and does NOT share state across multiple
 * concurrent instances. Treat it as a courtesy limit for normal visitors,
 * not a hard security boundary. The only real protection for your OpenAI
 * spend is the hard usage limit you set in the OpenAI dashboard
 * (platform.openai.com -> Settings -> Limits). Set that regardless of
 * whether this code is deployed.
 *
 * For a production deployment on Vercel/serverless with meaningful traffic,
 * swap this for a stateless store like Upstash Redis (`@upstash/ratelimit`),
 * which works correctly across many concurrent instances.
 */

interface Bucket {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // ~5 messages/minute per IP

const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_REQUESTS_PER_DAY_GLOBAL = 300; // rough safety net across ALL visitors combined

const perIpBuckets = new Map<string, Bucket>();
let globalDailyBucket: Bucket = { count: 0, windowStart: Date.now() };

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  // Global daily guard — protects the overall budget even if many different
  // IPs are hitting the widget (traffic spike, or a bot rotating IPs).
  if (now - globalDailyBucket.windowStart > DAILY_WINDOW_MS) {
    globalDailyBucket = { count: 0, windowStart: now };
  }
  if (globalDailyBucket.count >= MAX_REQUESTS_PER_DAY_GLOBAL) {
    return { allowed: false, retryAfterSeconds: 3600 };
  }

  // Per-IP guard — stops a single visitor or script from hammering the endpoint.
  const bucket = perIpBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    perIpBuckets.set(ip, { count: 1, windowStart: now });
    globalDailyBucket.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - bucket.windowStart)) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  bucket.count += 1;
  globalDailyBucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

// Periodic cleanup so the Map doesn't grow unbounded on a long-running server.
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of perIpBuckets.entries()) {
    if (now - bucket.windowStart > WINDOW_MS * 2) {
      perIpBuckets.delete(ip);
    }
  }
}, WINDOW_MS * 2);
// Don't let this timer keep a serverless function instance alive unnecessarily.
if (typeof cleanupTimer.unref === 'function') cleanupTimer.unref();