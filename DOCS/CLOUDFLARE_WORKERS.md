# Deploying alhajikallon.com on Cloudflare Workers

This project uses Next.js 16 for local development and tests, with a separate
**vinext** adapter to package dynamic pages and API routes for Cloudflare Workers.
Do not use `npx wrangler preview` on this repository. This project uses the
programmatic `cloudflare.config.ts` format, **not** Wrangler JSONC.

The latest Cloudflare error log reported:

```
Executing user deploy command: npx wrangler preview
[ERROR] Your Wrangler configuration is missing a "previews" block.
```

That is a misconfigured Workers Builds **preview command**, not an error from
Resend, Turnstile or the website's request handlers. Adding only
`"previews": {}` would hide this error without converting Next.js into a
working Worker.

## 1. Workers Builds settings

In Cloudflare Dashboard > Workers & Pages > **alhajicmkallon** > Settings >
Build, configure:

| Setting | Value |
| --- | --- |
| Connected repository | `Kallon-Tech-savvy/Alhajicmkallon` |
| Worker name | `alhajicmkallon` |
| Root directory | Repository root |
| Build command | **Leave blank** |
| Deploy command | `npm run deploy:vinext` |
| Preview command | `npm run preview:vinext` |

The deploy and preview scripts build their own required Vite/Workers outputs.
Do not run `npm run build` as the separate Workers Builds build command.
The Next.js build is used for the repository's existing tests, not Workers
deployment. Do not use `wrangler preview` with `cloudflare.config.ts`.

**Important:** Save these settings only after merging or pointing a test
Worker at the branch that contains `cloudflare.config.ts`, `vite.config.ts`,
the vinext scripts and the regenerated `package-lock.json`. Using these
commands with the original `main` branch will fail because it lacks the adapter.

Cloudflare references:
- https://vinext.dev/docs/deploying/cloudflare
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/

## 2. Runtime configuration

In Workers & Pages > alhajicmkallon > Settings > Variables and Secrets, set
the following **production Worker runtime secrets** (not build-only variables):

| Name | Required? | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Resend's server-only sending API key |
| `TURNSTILE_SECRET` | Yes | Secret for the existing Turnstile widget |
| `CONTACT_TO_EMAIL` | Yes | A verified working receiving inbox |
| `CONTACT_DEV_TO_EMAIL` | Optional | Optional alternate development inbox |
| `OPENAI_API_KEY` | Existing chat integration | Server-only chat provider key |
| `UPSTASH_REDIS_REST_URL` | Existing chat integration | Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Existing chat integration | Redis REST authentication |

The three contact secrets and three production chat secrets are declared
by name in `cloudflare.config.ts`, with **no values in Git**.

**Before merging this binding patch:** confirm all six named secrets already
exist on the `alhajicmkallon` **production Worker**. If any are missing, add
the values through Cloudflare Workers & Pages > Settings > Variables and
Secrets first, using the existing production OpenAI and Upstash credentials.
A `bindings.secret()` declaration is **required at deploy time**: deploying
without one of these six secrets can fail, even if only the other feature is
being changed. Do not paste any values into GitHub or this guide.

Existing Worker secrets persist across deployments, but **plain-text variables
that are not declared in `cloudflare.config.ts` can be removed by the vinext
deploy command**. Review existing dashboard variables before each runtime
binding change. The optional `CONTACT_DEV_TO_EMAIL` and
`CONTACT_CONFIRMATION_ENABLED` settings are **not yet declared** by this
Worker config: do not assume setting them as plaintext dashboard variables
makes them survive a future deployment. The default contact inbox remains
`CONTACT_TO_EMAIL`, and acknowledgement emails remain off. Configure optional
features separately after confirming their desired production binding model.

The config declares `CHAT_CLIENT_IP_HEADER=cf-connecting-ip` and the canonical
`NEXT_PUBLIC_SITE_URL=https://alhajikallon.com`. The public Turnstile site key
is already embedded in the form:

```
0x4AAAAAAGF6eqlDlOmcJvuf
```

Do not place the matching **private** widget key in source, browser code, or
GitHub Actions. Ensure the existing widget permits `alhajikallon.com`.
Email sending and inbound mail delivery remain separate; verification of the
sending domain does not create inboxes.

## 3. Preview safety

Cloudflare preview branches need their own Previews Base secrets. Use safe
staging credentials and a staging destination, **not** real visitor messages
or production mail routing.

The contact endpoint only accepts configured first-party Origins and checks
the Turnstile action and exact hostname. A preview URL is intentionally
**not** trusted by the default production origin allowlist. To test a preview
form, configure an explicit preview hostname and compatible Turnstile widget,
isolated recipient, quota namespace and secrets. Do not broaden the
production origin policy to arbitrary `*.workers.dev` domains.

## 4. Verification

With a clean checkout and Node.js 24:

```sh
npm ci
npm run test:contact
npm run typecheck
npm run lint
npm run build:vinext
npm run build
```

The vinext compatibility report on November 17, 2026 found **97% compatible,
0 issues**; `next/image` optimization is the partial-support feature.
The adapter is initially configured with image optimization disabled to avoid
unexpected paid-image bindings. This makes images serve without the previous
Next image resizing and should be checked visually and for network byte size
before a production rollout; use a Cloudflare Images binding if the site needs
transformations and its account supports the cost.

The cloud Worker-specific build succeeded in a secretless GitHub runner. That
does **not** prove the Worker has received secrets or can successfully deliver
emails. On a staging Worker or the configured custom domain:

1. Confirm `/`, `/contact`, `/knowledge` and `/api/chat` load as intended.
2. Test Turnstile with a fresh token; reject a replayed or wrong-action token.
3. Submit a general and development enquiry to a real inbox with correct
   `Reply-To`; inspect Resend delivery events and a real mailbox receipt.
   Without `CONTACT_DEV_TO_EMAIL`, both enquiries go to the configured
   `CONTACT_TO_EMAIL` address.
4. Send the built-in FAQ prompt `Show me his case studies` through the
   chat widget. This should use Upstash quota even if the answer is local.
   Then test one non-FAQ AI prompt to validate `OPENAI_API_KEY`. A 503
   on either requires checking Worker logs for `chat_unavailable` and
   verifying the deployed Upstash/OpenAI secrets without exposing values.
5. Test a missing-key failure (503), downstream provider rejection and the
   user's preserved draft fallback.
6. Re-run mobile-width browser checks and Lighthouse; inspect images as
   described above. Do not merge solely because the build succeeds.

Cloudflare's `process.env` support comes from the generated recent
compatibility date (2026-11-17), which enables Node.js compatibility without
an explicit `nodejs_compat` flag.

## 5. Dependency security

The end-to-end review found 22 npm advisory entries, including a critical Next.js
advisory. Compatible updates to Next.js, its lint config, Vite and transitive
dependencies reduced the audit to zero reported vulnerabilities. A scoped Satori
`fflate` override uses the fixed patch release without downgrading vinext.
CI rejects high and critical advisories; rerun `npm audit` because advisory data
changes over time. Do not run `npm audit fix --force` blindly.

CI also runs the browser interaction suite against the built Worker preview,
then builds and checks Next.js separately. The preview tests mock AI and email
calls, so they do not prove production keys, inbox delivery or OpenAI completion.
The live review confirmed the FAQ chat worked, but the contact negative probe
returned `503` with `The contact service is unavailable.` instead of the expected
verification rejection. The production contact runtime configuration remains a
release blocker; inspect `contact_configuration_unavailable` for setting names.

For the contact-form feature and initial email setup, see
[CONTACT_EMAIL.md](CONTACT_EMAIL.md).
