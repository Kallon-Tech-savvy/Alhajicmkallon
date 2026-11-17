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
