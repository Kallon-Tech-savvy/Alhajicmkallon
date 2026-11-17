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
| CONTACT_TO_EMAIL | Yes, runtime variable | A real inbox that receives general enquiries (not necessarily an @alhajikallon.com alias) |
| CONTACT_DEV_TO_EMAIL | No, runtime variable | Separate real inbox for "Design and build" and "Improve a product"; defaults to CONTACT_TO_EMAIL |
| TURNSTILE_SECRET_KEY | Yes, runtime secret | Turnstile server-side validation key |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Yes, build-time public value | Turnstile site key, configured to allow alhajikallon.com and www if used |
| NEXT_PUBLIC_SITE_URL | Only for other trusted hosts | Exact HTTPS site origin to accept, such as a staging custom domain |
| CONTACT_CONFIRMATION_ENABLED | No, defaults to off | Set to 1 to send a generic acknowledgement from noreply@ to the visitor, **after** the main enquiry is accepted |

The site key must be available at build time; the secret must be present at
runtime. For Cloudflare Workers, confirm runtime process.env support in your
existing deployment configuration (nodejs_compat and appropriate compatibility
date, as described in DOCS/CHAT_CONFIGURATION.md). Do not replace the existing
Cloudflare/Next adapter configuration as part of this email change.

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

Create a Turnstile widget in Cloudflare, allowing the live domain and any
explicit staging hostname. Add its site key and secret key to the environment.
The page renders the widget only when the site key is present. If missing,
visitors can still open a mailto draft; the server itself fails closed.

The server verifies Turnstile with Siteverify and checks that its verified
hostname is an allowed site hostname. A token is single-use; failed submissions
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
    npm run test:interactions

Use a staging Resend API key and inbox for a live end-to-end test:
- Submit general and development enquiries; verify routing and Reply-To.
- Check the content in an actual inbox, including HTML and plaintext.
- Test spam rejection, malformed content and delivery failure.
- Confirm sensitive keys do not appear in browser requests or JS bundles.
- If enabling receipts, verify they contain **no copy of the visitor's message**.
- Review the Resend event log for delivered/bounced events; API acceptance
  alone does not prove the mailbox received the email.

No tests contact the real Resend API. Provider calls and browser routes are
mocked. After deployment, verify the Cloudflare Worker on the custom domain
has the required **runtime** secrets, not only build variables.

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
