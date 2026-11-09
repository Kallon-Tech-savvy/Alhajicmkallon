---
slug: "protocols-08-identity-and-access"
title: "Separate identity, permission and trust"
category: "Protocol course · Lesson 08"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "15–20 min reading · practice at your own pace"
excerpt: "Trace sessions, OAuth and OIDC, then test that one studio cannot read another studio’s gallery."
status: "published"
kind: "knowledge"
level: "junior"
prerequisites: ["Complete the previous course lesson or its readiness check", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Explain authentication and resource authorization separately", "Build a negative permission test matrix"]
sources: ["https://www.rfc-editor.org/rfc/rfc9700.html", "https://openid.net/specs/openid-connect-core-1_0.html", "https://www.rfc-editor.org/rfc/rfc8725.html", "https://www.w3.org/TR/webauthn-3/"]
---

## Problem and scope

Mohamed trusts Augusta with photographs that may never be public. “He is signed in” does not answer “May he read this gallery?” Permissions are part of that relationship of trust.

## Core concepts

Authentication establishes an identity or credential. Authorization decides whether that identity may perform a particular action on a particular resource. OAuth supports delegated access; OIDC adds identity assertions for sign-in. An ID token is not a general-purpose replacement for an API access token. JWT is a token format: decoding its claims does not verify its signature or grant access.

Use established identity libraries and providers rather than writing a production login protocol in a tutorial. Validate the applicable issuer, audience, expiry and signature rules. For OAuth integrations, study authorization code with PKCE, exact redirect handling and current security guidance. Keep scopes narrow. Never place a server secret in browser code.

## Run the permission lab

The fixture uses public strings studio-a and studio-b as pretend bearer credentials. They demonstrate authorization, not secure authentication.

```sh
curl -i http://127.0.0.1:4310/galleries/gallery-a -H "Authorization: Bearer studio-a"
curl -i http://127.0.0.1:4310/galleries/gallery-a -H "Authorization: Bearer studio-b"
```

Expect 200 for the owning studio and 404 for the other studio. The resource lookup includes studio ownership. Hiding a link in the interface would not enforce this boundary.

## Build a trust map

Draw the browser, application server, identity provider and database. For each arrow, record what credential crosses it and which component validates it. Compare an HttpOnly cookie session with a bearer-token approach. Consider CSRF protection for cookie-authenticated mutations, token exposure, expiry and revocation. CORS is a separate browser concern.

Study a passkey registration and authentication ceremony. WebAuthn uses public-key credentials and origin-bound challenges; recovery and lost-device handling still require design. For mTLS, explain why authenticating a client service does not itself authorize every business action.

## Failure analysis

Test no credentials, expired credentials in a real test identity provider, wrong studio, a changed resource id and a viewer attempting an owner action. Never use actual client records. Record the expected status and whether any private data was returned.

## Assessment

Ready when your test matrix contains both allowed and denied cases and names the server-side check for every sensitive operation. An authorization failure should not erase Mohamed’s form input or casually reveal another person’s private information.

## Permission is a relationship between caller, action and resource

A role label is not a complete permission decision. An editor in studio A should not automatically edit studio B. The effective rule usually combines authenticated identity, membership, allowed action and resource ownership. The server must evaluate that relationship for every sensitive operation, including downloads and subscriptions that are easy to overlook.

### Worked reasoning

A gallery lookup constrained by both gallery id and authorized studio prevents a caller from obtaining another studio’s record merely by changing the URL. For updates, the same constraint belongs in the mutation or transaction; checking ownership earlier and later updating by id alone can introduce a race or an inconsistent boundary. Test access at the operation that reads or changes the data.

### Apply the distinction

Write an authorization predicate in plain language, then translate it into a server query and negative tests. Include membership removal during an active session and a viewer attempting an owner-only mutation.

## Sources

- [OAuth security best practice](https://www.rfc-editor.org/rfc/rfc9700.html)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html)
- [JWT security guidance](https://www.rfc-editor.org/rfc/rfc8725.html)
- [Web Authentication](https://www.w3.org/TR/webauthn-3/)
