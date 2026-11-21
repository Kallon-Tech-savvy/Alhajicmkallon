# Alhaji C. M. Kallon

I’m a Sierra Leonean design engineer based in Freetown. I help founders, businesses and organisations clarify ideas, decide what to build, and turn those decisions into useful digital products.

My work connects product discovery, experience design and frontend development. I care about clear reasoning, accessible interfaces and solutions that fit the people using them.

I share selected projects, practical lessons and reflections on design, technology and building in Sierra Leone. I’m also interested in youth opportunity and making useful knowledge more accessible.

- **Website:** [alhajikallon.com](https://alhajikallon.com)
- **General enquiries:** [info@alhajikallon.com](mailto:info@alhajikallon.com)
- **Development enquiries:** [dev@alhajikallon.com](mailto:dev@alhajikallon.com)

## Development

Use a current Node.js LTS release (22.22.2+ or 24.15.0+) and npm:

```sh
npm ci
npm run dev
```

`dev` and `build` regenerate the published content index and offline course.
Author content under `content/`; do not edit generated files.

```sh
npm test
npm run typecheck
npm run lint
npm run lint:boundaries
npm run test:boundaries
npm run format:check
npm run build
npm run test:browser-bundle
```

Production integration tests require `npm start` in another terminal:

```sh
node --test scripts/discovery-endpoints.test.mjs
```

See [Cloudflare Workers deployment](DOCS/CLOUDFLARE_WORKERS.md),
[Resend contact delivery and Cloudflare setup](DOCS/CONTACT_EMAIL.md),
[architecture and module ownership](DOCS/ARCHITECTURE.md),
[chat deployment configuration](DOCS/CHAT_CONFIGURATION.md), and
[content authoring](DOCS/CONTENT_AUTHORING.md).

Browser behavior checks use Chromium and the production build:

```sh
npx playwright install chromium
npm run test:interactions
```

The runner starts the built site if needed. Chat responses and external contact
submission are intercepted; the tests do not send enquiries or call paid AI APIs.

## Checking both runtimes

`typecheck` and the Next.js prebuild regenerate Next route types because vinext
writes a different helper into `.next/types`. Run the two builds sequentially;
never run Next.js and vinext builds against the same checkout concurrently.

The browser suite can also target the Worker preview, with external chat/email
calls mocked just as in the Next.js suite:

```sh
npm run build:vinext
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3002 \
PLAYWRIGHT_SERVER_COMMAND='npm run start:vinext -- --host 127.0.0.1 --port 3002' \
npm run test:interactions
npm run build
npm run test:interactions
```

The preview may warn about absent production secrets; mocked browser tests do
not verify those secrets. Use the manually triggered production smoke workflow
for live checks. It sends one local FAQ request and a deliberately invalid
Turnstile token, never a real enquiry or paid AI completion.

`npm audit --audit-level=high` is enforced in CI. The scoped `satori` → `fflate`
override selects the fixed `0.7.5` patch release rather than downgrading vinext.
Revisit it when Satori updates its pinned dependency. This is a private website
package, not an npm library.


Use `npm run format:write` to format application source. CI checks all of `src/`,
including route JSX and JavaScript helpers; the generated content index remains
excluded because its format is owned by the generator.
