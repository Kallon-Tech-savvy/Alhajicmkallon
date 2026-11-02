# Alhaji C. M. Kallon — Portfolio

Personal website built with Next.js 16, React 19, TypeScript and Tailwind CSS.

## Start here

Requires Node.js 22 and npm. Install locked dependencies with `npm ci`, then run `npm run dev`. The predev script generates the content index from Markdown in `content/`.

- `src/app/`: routes, page metadata and global styles.
- `src/components/`: reusable UI and site navigation.
- `src/lib/`: content, retrieval, contact and chat policies.
- `content/`: authored project, journal and knowledge Markdown.
- `scripts/`: tests, content indexing, deployment checks.
- `DOCS/CONTENT_AUTHORING.md`: content editing guidance.

## Quality gates

Run `npm run lint`, `npm run typecheck`, `npm run test:content`, `npm run test:contact`, `npm run test:security`, `npm run test:homepage-performance`, `npm run test:boundaries`, and `npm run build`. These also run in GitHub Actions before a change is merged. The production deploy is manual and should only follow a passing PR.

## Security model

The `/api/chat` endpoint requires an exact allowed Origin and JSON content type, caps streamed request size, filters conversation history, checks moderation before completion and limits requests locally. **Origin is not authentication** and local in-memory limits reset across deployments or serverless instances. For effective public abuse protection, configure rate limiting / bot rules at Cloudflare or another trusted edge and cap the OpenAI project budget. Set `OPENAI_API_KEY` only in server-side deployment secrets; never use `NEXT_PUBLIC_` for secrets. The general contact mailbox is `info@alhajikallon.com`.

Response headers include clickjacking, MIME-sniffing and referrer protections. A strict Content Security Policy is a separate follow-up requiring testing of Next's inline scripts and external integrations.

## Contribution workflow

Create a feature branch; keep changes small and scoped; include regression tests; open a PR; wait for all checks, including Lighthouse (performance >=80 and SEO =100), before review and merge. Do not commit logs, environment files, build outputs or TypeScript caches.

## Global search performance boundary

Global Search fetches bounded, published-only JSON summaries from `/api/search?q=...`. The route alone imports `src/lib/content.ts`, which is marked `server-only` so future client imports fail during builds. Never import catalogue values from a client component: client interfaces should receive lightweight serializable props or fetch results when requested. The search endpoint searches full published text on the server but never returns it; requests are debounced and cancelled as visitors type. Search queries are not stored by the application, and responses use `Cache-Control: no-store`.

### Browser-bundle regression check

After `npm run build`, run `npm run test:browser-bundle`. CI inspects the generated `.next/static` JavaScript for long snippets from published case-study and article bodies. This is a defense-in-depth heuristic; the `server-only` import remains the principal build-time boundary. Search result links use `prefetch={false}` so merely opening the dialog does not request every matching page's full route payload.

### Prevent speculative route-data fetching

Homepage links use `prefetch={false}` on Next.js Link. This prevents initial page visits from transferring other route payloads before navigation; the trade-off is that an initial click may wait for the target page rather than using a preloaded response. The CI Lighthouse job counts `_rsc` fetches on untouched homepage loads and fails if any remain. Revisit the trade-off after measuring real-user navigation latency.

### Lighthouse main-thread diagnosis

The CI job now runs `npm run test:performance-report` and prints a bounded diagnostic from the Lighthouse JSON report (`node scripts/report-main-thread.mjs lighthouse-report.json`). It reports script evaluation, layout work, top script CPU costs and longest tasks. This is evidence for choosing subsequent work—not a stable per-commit measurement of JavaScript speed. Identical commits have returned widely varying synthetic Total Blocking Time scores; compare multiple runs and real-user metrics before claiming a performance gain.

### Multi-run performance baseline

CI now runs **three independent mobile Lighthouse audits** against one production build and writes individual JSON reports plus `lighthouse-reports/summary.json` to the Lighthouse baseline artifact. The acceptance gate uses **median performance >=80/100** instead of a single noisy result; **every** run must score SEO 100/100 and show zero unsolicited `_rsc` route fetches. It reports per-run LCP, TBT and performance and their min/median/max spread. This is a more robust synthetic baseline, not real-user performance monitoring. The previous single-run budget was susceptible to large variance even on identical commits.
