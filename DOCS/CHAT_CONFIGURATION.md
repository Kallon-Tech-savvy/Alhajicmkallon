# Chat deployment configuration

Builds do not require production secrets. Configure the following on the deployment
platform before releasing this refactor:

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Enables moderated AI answers; without it, FAQ answers remain available when quota storage is healthy |
| `UPSTASH_REDIS_REST_URL` | HTTPS Redis REST endpoint supporting `EVAL` |
| `UPSTASH_REDIS_REST_TOKEN` | Server-only REST token with permission to run the quota script |
| `CHAT_CLIENT_IP_HEADER` | Client-IP header overwritten by your trusted ingress proxy |
| `CHAT_QUOTA_NAMESPACE` | Shared prefix for this deployment group; defaults to `alhajikallon:chat:v1` |
| `NEXT_PUBLIC_SITE_URL` | Optional additional allowed site origin |

Redis credentials are required for **all production chat**, including FAQ requests.
Missing or unhealthy storage returns 503 and prevents provider calls. There is no
production fallback to per-process memory. The rest of the website works normally.
Local development and tests can use the bounded in-memory adapter without Redis.
Do not set `NODE_ENV=development` on a production server to bypass configuration.

Configure the IP header to match the actual ingress contract. Cloudflare commonly
sets `cf-connecting-ip`; Vercel commonly sets `x-forwarded-for`. Verify that the
platform overwrites the chosen header and that the origin cannot be reached through
a path allowing visitors to supply it. No header is trusted by default. A missing
header puts requests in a single conservative shared bucket. IPs are HMAC-hashed
with the Redis token before being used in keys; raw IPs are not stored in Redis.

Every visitor may reserve five requests per 60-second fixed window. Non-FAQ AI
attempts also reserve from one shared pool of 300 attempts per 24-hour fixed window.
Each window starts at its first reservation; the AI window is not a UTC calendar
day. Both counters use one atomic Redis Lua operation per reservation. Denied
requests do not extend the window. Retry-After is the remaining key TTL.

Failed and flagged AI attempts consume a reservation because external work may
already have happened. Reservations are not refunded after timeout or disconnect.
Each attempt can call moderation once and completion once. SDK retries are disabled.
This limits attempts, not currency; keep provider-level spending controls configured.

Use the same namespace and Redis database for all replicas sharing one budget.
Use a different namespace for preview/staging so tests cannot consume production
quota. Never expose Redis tokens or OpenAI keys as `NEXT_PUBLIC_*` variables.

Before deployment, verify a configured non-production environment with a separate
namespace: FAQ answer, non-FAQ answer, sixth-request 429, storage-outage 503, and
provider-timeout behavior. Unit tests use provider/REST fakes; no live Redis service
or paid OpenAI account is required to run them.

## Cloudflare Workers runtime

These settings must be runtime variables/secrets on the Worker serving the custom
domain, in the active environment; build-only variables are insufficient. After
changing configuration, deploy a new Worker version and confirm the custom domain
routes to it.

The app reads server secrets through `process.env`. Cloudflare requires
`nodejs_compat` and `nodejs_compat_populate_process_env`. The latter is enabled by
default for compatibility dates on or after `2025-04-01`; on older dates add it
explicitly to the existing deployment configuration. Do not replace your adapter's
other compatibility flags. See [Cloudflare's process.env documentation](https://developers.cloudflare.com/workers/runtime-apis/nodejs/process/).

Set `CHAT_CLIENT_IP_HEADER=cf-connecting-ip` when Cloudflare is the trusted ingress.
This identifies quota buckets; it does not connect Redis or enable secret access.
Use the Upstash **REST** HTTPS URL and REST token, with write/script permissions,
not a `redis://` connection string or a read-only token.

To verify without an AI call, send `Show me his case studies` from the chat. This
built-in FAQ still checks Redis. A 503 here points to quota storage; a successful
FAQ does not yet verify the OpenAI key. Worker logs emit `chat_unavailable` with
safe codes: `quota_configuration` (missing/invalid REST settings), `quota_network`
(connection failure), `quota_http` (includes status, such as 401/403), or
`quota_response` (invalid Redis reply). Check those logs before rotating keys.
Logs intentionally exclude upstream bodies, URLs, visitor text, and credentials.


Once FAQ requests succeed, a non-FAQ 503 can still mean the provider is missing.
Logs now report `provider_configuration` when `OPENAI_API_KEY` is absent. Other
service errors include a fixed `stage` (`visitor_quota`, `ai_quota`, `moderation`,
`completion`) and, for recognized provider HTTP errors, a numeric status only.
Never log full provider errors: they may contain sensitive request data.
