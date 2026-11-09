---
slug: "protocols-03-cache-and-cors"
title: "Cache carefully and understand browser boundaries"
category: "Protocol course · Lesson 03"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "10–15 min reading · 60–90 min practice"
excerpt: "Observe conditional requests and preflights, then separate performance decisions from identity and permission checks."
status: "published"
kind: "knowledge"
level: "intermediate"
prerequisites: ["Complete the previous course lesson or its readiness check", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Explain no-cache versus no-store", "Diagnose a CORS error without weakening authorization"]
sources: ["https://www.rfc-editor.org/rfc/rfc9111.html", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS"]
---

## Start with a person

Mohamed pays for mobile data. Downloading an unchanged public page repeatedly wastes it. Augusta also has private galleries that must not be reused across clients. “Make it faster” is incomplete without “for whom, and with what privacy boundary?”

## The idea

A cache can reuse a response. Freshness says how long reuse is allowed; validation asks whether an older response still represents the resource. An ETag is a validator. If-None-Match can produce a 304 response with no representation body. Your existing cached body is still needed.

No-cache permits storage but requires validation before reuse. No-store instructs caches not to store the response. Private controls shared-cache storage; it does not encrypt content. Do not add public caching to a personalised response just because it looks like ordinary JSON.

CORS is a browser response-sharing mechanism. A preflight asks whether a cross-origin request is permitted. It does not establish studio ownership or replace server-side authentication. Command-line clients do not enforce browser CORS policy.

## Run the experiment

```sh
curl -i http://127.0.0.1:4310/catalog
curl -i http://127.0.0.1:4310/catalog -H 'If-None-Match: "catalog-v1"'
```

Use quoting appropriate to your terminal; the header value includes double quotes. Expect 200 and then 304. Compare with /galleries using the lesson-2 demo token: the lab marks that response no-store.

Inspect a preflight:

```sh
curl -i -X OPTIONS http://127.0.0.1:4310/galleries -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: content-type,authorization"
```

The lab returns an explicit allowed origin and permitted methods/headers. Change the origin to https://example.invalid and expect 403. This demonstrates the server’s responses; it is not proof that a browser has enforced them. To inspect actual browser enforcement, use a local frontend served at http://localhost:3000 and its Network panel.

## Break it deliberately

Request a gallery without authentication using curl, even with the allowed Origin header. It should still fail. Write why adding Access-Control-Allow-Origin cannot repair a missing token, and why allowing every origin is a poor debugging shortcut for private data.

## Check your reasoning

Make a caching decision for a public report, a private gallery and a sign-in response. State who can reuse each, for how long, and what invalidates it. Ready when you can explain why 304 is useful and why it is not a fresh JSON body.

## Human checkpoint

When a browser says “CORS,” do not blame yourself for not understanding the entire network. Read the failing request first. Look for the actual status, preflight and origin before changing configuration.

## Sources

- [HTTP caching](https://www.rfc-editor.org/rfc/rfc9111.html)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
