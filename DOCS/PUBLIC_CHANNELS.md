# Public writing and enquiries

The Writing page fetches `https://alhajicmkallon.substack.com/feed` on the server and revalidates every 30 minutes. It displays at most six recent public post summaries with links to the original Substack articles and subscription page. It does not import posts into the site's authored catalogue or global search, mirror full articles, access paid content or collect subscriber emails.

The RSS parser rejects DTD/entity declarations, caps downloaded responses at 2 MiB, limits text lengths, accepts only HTTPS article URLs on the configured publication and renders text through React escaping. Requests time out after five seconds and reject redirects. An unavailable/invalid feed leaves a working publication link and subscription CTA; authored entries remain visible. After changing the publication URL, update both `src/lib/public-channels.ts` and `src/lib/substack-feed.mjs` and run the feed tests.

WhatsApp number-based enquiry links are disabled at the owner's request. Use the existing contact form and email until the owner approves a replacement destination. WhatsApp Business usernames do not hide the number on the business profile. Do not restore a personal phone number to public source or documentation.

Validation: `node --test scripts/substack-feed.test.mjs`, `npm run typecheck`, `npm run lint`, `npm run build` and `npm run test:browser-bundle`. The feed tests run in CI. No Substack or WhatsApp API credentials are needed.
