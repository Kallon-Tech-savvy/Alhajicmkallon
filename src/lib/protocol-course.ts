export const PROTOCOL_LESSONS = [
  {
    "slug": "protocols-01-follow-a-request",
    "title": "Follow a request without getting lost",
    "summary": "Understand what a protocol promises, trace DNS, transport, TLS and HTTP, and build a debugging map before writing more code."
  },
  {
    "slug": "protocols-02-http-contract",
    "title": "Make HTTP responses mean something",
    "summary": "Practise methods, status codes, headers and validation using a runnable local API, then translate technical outcomes into honest interface messages."
  },
  {
    "slug": "protocols-03-cache-and-cors",
    "title": "Cache carefully and understand browser boundaries",
    "summary": "Observe conditional requests and preflights, then separate performance decisions from identity and permission checks."
  },
  {
    "slug": "protocols-04-design-an-api",
    "title": "Design an API another developer can trust",
    "summary": "Turn a gallery-creation journey into a documented contract with validation, clear errors and compatibility tests."
  },
  {
    "slug": "protocols-05-interface-choices",
    "title": "Choose HTTP, GraphQL, gRPC or JSON-RPC deliberately",
    "summary": "Compare contracts using the same gallery task and learn when extra infrastructure earns its place."
  },
  {
    "slug": "protocols-06-live-updates",
    "title": "Make live updates survive a disconnect",
    "summary": "Compare polling, SSE and WebSocket through the experience of waiting for photographs to finish processing."
  },
  {
    "slug": "protocols-07-events-and-webhooks",
    "title": "Receive events without duplicating their effects",
    "summary": "Design a signed webhook receiver, durable processing boundary and duplicate-delivery tests before adding a message broker."
  },
  {
    "slug": "protocols-08-identity-and-access",
    "title": "Separate identity, permission and trust",
    "summary": "Trace sessions, OAuth and OIDC, then test that one studio cannot read another studio’s gallery."
  },
  {
    "slug": "protocols-09-timeouts-and-retries",
    "title": "Handle the request that may already have succeeded",
    "summary": "Reproduce a timeout after a write, then use idempotency and bounded retries to avoid duplicate work."
  },
  {
    "slug": "protocols-10-safe-ai-tools",
    "title": "Give an AI tool useful boundaries",
    "summary": "Design a read-only MCP capability and a bounded agent handoff while keeping authorization outside the model’s control."
  },
  {
    "slug": "protocols-11-observe-and-debug",
    "title": "Debug across boundaries without exposing people",
    "summary": "Use request IDs and trace concepts to investigate a failure, preserve useful evidence and write a calm incident explanation."
  },
  {
    "slug": "protocols-12-capstone-review",
    "title": "Prove a small integration works for a person",
    "summary": "Bring the course together in a gallery workflow with a contract, negative tests, recovery behavior and an honest review of remaining risks."
  }
] as const;
export const PROTOCOL_SLUGS = new Set<string>(PROTOCOL_LESSONS.map(lesson => lesson.slug));
