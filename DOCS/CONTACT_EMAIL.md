# Resend contact email — production setup

The website contact form now submits to the same-origin POST /api/contact route,
not Formspree. The route checks inputs, an origin header, a hidden spam trap and a
server-verified Cloudflare Turnstile token before calling Resend's REST API.
It sends an HTML and plain-text enquiry from contact@alhajikallon.com and sets
Reply-To to the visitor's address. The sending identity is not controlled by visitors.

The original mailto draft fallback remains available. **No production email is
sent until runtime secrets and a verified receiving inbox are configured.**

## 1. Configure the Cloudflare Worker and build

Set these on the Worker serving alhajikallon.com. Do not put secrets in source
code, GitHub, or NEXT_PUBLIC_* variables.

| Variable | Required | What it means |
| --- | --- | --- |
| RESEND_API_KEY | Yes, runtime secret | Resend API key with sending permission |
| CONTACT_TO_EMAIL | Yes, runtime secret | A real inbox that receives general enquiries (not necessarily an @alhajikallon.com alias) |
| CONTACT_DEV_TO_EMAIL | No, optional runtime secret | Separate real inbox for "Design and build" and "Improve a product"; defaults to CONTACT_TO_EMAIL |
| TURNSTILE_SECRET | Yes, runtime secret | Secret belonging to the already-created Turnstile widget; server only. `TURNSTILE_SECRET_KEY` is also supported as an alias. |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | No | Optional public site-key override for staging; production's provided public site key is committed in the form component |
| NEXT_PUBLIC_SITE_URL | Already defined in Worker config | Canonical origin; staging changes require explicitly separate configuration |
| CONTACT_CONFIRMATION_ENABLED | No, defaults to off | Set to 1 to send a generic acknowledgement from noreply@ to the visitor, **after** the main enquiry is accepted |

The public site key is already embedded in the component, so no build-time setting
is required for production. The matching **private** widget secret must be present at
runtime. The current vinext adapter uses a recent compatibility date to provide
Node.js-compatible `process.env` access. Configure **runtime** secrets in the
Worker, not merely build secrets. See [Cloudflare deployment](CLOUDFLARE_WORKERS.md)
for the exact deployment and preview commands.

## Existing Turnstile widget (do not create a new one)

- Public site key: `0x4AAAAAAGF6eqlDlOmcJvuf`
- Protected form: `/contact` (`POST /api/contact`)
- Required Turnstile action: `contact`
- Expected Siteverify hostname: exactly the hostname of the accepted page
  origin (`alhajikallon.com` or `www.alhajikallon.com`).
- Ensure those hosts are enabled on the **existing** widget in the Cloudflare
  dashboard; if using local Turnstile testing, permit `localhost` and
  `127.0.0.1` on the widget. Production server origin checks do not accept
  local hosts. A different staging site key may be supplied via the public
  override above.

To finish the private secret connection without exposing credentials: in
Cloudflare, open **Workers & Pages > your deployed Worker > Settings >
Variables and Secrets**, and add the existing widget's secret as
`TURNSTILE_SECRET` (secret/encrypted, NOT text/public). Deploy a new Worker
version and confirm the domain points at it.

If programmatic recovery of a pre-existing widget's secret is needed, follow
Cloudflare Turnstile Spin's existing-widget flow: a separately approved,
external Wrangler 4.109+ executable, an explicit account/Worker/config target,
and user confirmation are required **before retrieval**. Never paste the secret
into chat, commit it, expose it in browser requests, or create a replacement
widget. API-only retrieval cannot proceed without the approved Cloudflare
access and a confirmed secret destination.

The Resend verified sending domain is alhajikallon.com, region eu-west-1.
No new per-sender DNS record is needed for addresses on this domain.

## 2. Make sure the inbox actually receives messages

Resend **sends** emails but does not automatically create mailboxes for
info@, dev@, cm@, contact@, or noreply@. CONTACT_TO_EMAIL must be a mailbox
you can check. Optionally enable Cloudflare Email Routing:

1. In Cloudflare, go to Compute > Email Service > Email Routing.
2. Add a destination mailbox you control and verify the confirmation email.
3. If appropriate, onboard alhajikallon.com for inbound routing; first check
   existing MX records so you do not disrupt another mail provider.
4. Create forwarding rules for contact@, info@ and dev@ (and cm@ if needed)
   to the verified destination. Test each rule by sending it an external email.
5. Set CONTACT_TO_EMAIL / CONTACT_DEV_TO_EMAIL to the actual mailboxes or
   correctly configured aliases.

Cloudflare Email Routing supports forwarding and is not itself a full
outgoing mailbox for manually replying as the custom address.

Official guide: https://developers.cloudflare.com/email-service/get-started/route-emails/

## 3. Configure Turnstile and rate limits

Use the **existing** Turnstile widget already created for the live domain.
Its public site key is embedded in the form, while its private matching secret
must be added to the Cloudflare Worker as `TURNSTILE_SECRET`. A local/staging
override can be configured explicitly; the server fails closed without a secret.

The server verifies Turnstile with Siteverify and requires `success === true`,
`action === "contact"`, and an exact match of the returned hostname to the
accepted requesting origin's hostname. A missing secret fails closed. A token is single-use; failed submissions
require a fresh token. This is spam protection, not an absolute spam guarantee.

Add a Cloudflare WAF/rate-limiting rule for POST /api/contact on your domain
(e.g. 5 requests per minute per source IP; tune after observing legitimate use).
Place the rule before the application and avoid exposing a bypass origin.
Origin checks and the hidden field are defence in depth, not authentication.

Official guide:
https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

## 4. Test before releasing

Run:

    npm run test:contact
    npm run typecheck
    npm run lint
    npm run build
    npm run build:vinext
    npm run test:interactions

Use a staging Resend API key and inbox for a live end-to-end test:
- Submit general and development enquiries; verify routing and Reply-To.
- Check the content in an actual inbox, including HTML and plaintext.
- Test spam rejection, wrong action, mismatched hostname, malformed content and delivery failure.
- Confirm sensitive keys do not appear in browser requests or JS bundles.
- If enabling receipts, verify they contain **no copy of the visitor's message**.
- Review the Resend event log for delivered/bounced events; API acceptance
  alone does not prove the mailbox received the email.
- With a **fresh real** Turnstile token, verify one accepted request; replay it
  after the token redemption has propagated and verify it is rejected. Local
  mocks cannot prove real-token behavior.

No tests contact the real Resend API. Provider calls and the existing
Turnstile browser script are mocked. After deployment, verify the Cloudflare Worker on the custom domain
has the required **runtime** secrets, not only build variables.

### Diagnose a live 503 without exposing secrets

If a well-formed submission returns **503** and the public error says
`The contact service is unavailable.`, the server fails **before** Turnstile
Siteverify. With the contact runtime diagnostic deployed, a matching
`contact_configuration_unavailable` warning lists **only setting names** under
`fields`; no secret values, recipient email addresses, or submitted form data
are logged by that diagnostic.

1. Open Cloudflare Dashboard > Workers & Pages > `alhajicmkallon` >
   **Observability > Logs** (or enable real-time logs if unavailable).
2. Open the existing GitHub **Public production route smoke** workflow and
   manually run it against the latest production deployment. It sends only one
   deliberately invalid Turnstile token; it **cannot send an email**.
3. Filter Worker logs for `contact_configuration_unavailable`, and read only
   the array of setting names in `fields`.
4. In the Worker's **Settings > Variables and Secrets**, correct those settings.
   Use **Secret** type for `RESEND_API_KEY` and `TURNSTILE_SECRET`; keep the
   receiving inbox configuration private. Cloudflare requires **Deploy** after
   changes for them to take effect. Do not paste the secret values into chat,
   issues, screenshots or logs.
5. Repeat the negative test: an invalid token should now return **422**
   (`Verification expired or failed`). Then submit one genuine enquiry from
   the browser and verify a delivered message in a working mailbox.

A 422 response only establishes token rejection and readiness to attempt
delivery; it does **not** prove Resend acceptance or inbox receipt. If the
setting names are present and the test still returns 503, verify that the
Worker version and secret bindings being edited are the ones serving
`alhajikallon.com`.

See [Cloudflare Workers real-time logs](https://developers.cloudflare.com/workers/observability/logs/real-time-logs/)
and [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/).

## 5. Source structure and responsibilities

- src/components/ContactForm.tsx: browser form, Turnstile widget, success/error
  states, preserved input, and email-draft fallback.
- src/app/api/contact/route.ts: POST endpoint.
- src/lib/contact-email.mjs: input rules, HTML/text template, all five sender
  profiles, verification and Resend submission.
- scripts/contact-api.test.mjs: security and provider-mock unit tests.

For now the other sender profiles (dev@, cm@ and info@) are available to
reuse for future correspondence. The contact form only sends as contact@
and optionally noreply@ for the generic receipt. No marketing mail,
newsletter sending or third-party mailbox access is enabled.
