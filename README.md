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
