---
slug: "protocols-03-cache-and-cors"
title: "Cache carefully and understand browser boundaries"
category: "Protocol course · Lesson 03"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "15–20 min reading · practice at your own pace"
excerpt: "Observe conditional requests and preflights, then separate performance decisions from identity and permission checks."
status: "published"
kind: "knowledge"
level: "intermediate"
prerequisites: ["Complete the previous course lesson or its readiness check", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Explain no-cache versus no-store", "Diagnose a CORS error without weakening authorization"]
sources: ["https://www.rfc-editor.org/rfc/rfc9111.html", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS"]
---

## Problem and scope

Mohamed pays for mobile data. Downloading an unchanged public page repeatedly wastes it. Augusta also has private galleries that must not be reused across clients. “Make it faster” is incomplete without “for whom, and with what privacy boundary?”

## Lab scope and pass criteria

Practice mode: Run the supplied lab; use a frontend for browser enforcement.

### Expected result

GET /catalog returns ETag "catalog-v1". Sending that value as If-None-Match returns 304 with no response body. OPTIONS with Origin http://localhost:3000 returns 204; the disallowed origin returns 403.

### Evidence and limits

Save the headers and body length. curl shows server behavior but does not enforce CORS. A frontend at http://127.0.0.1:3000 is a different origin from the allowed http://localhost:3000. Browser JavaScript cannot read X-Request-ID unless the server also exposes that header; inspect it in Network or curl for this fixture.

## Core concepts

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

## Read the conditional exchange

These are shortened lab exchanges with incidental headers omitted. Keep the quotes around the validator; they are part of the header value.

```http
GET /catalog HTTP/1.1
Host: 127.0.0.1:4310

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: public, max-age=30
ETag: "catalog-v1"

[{"id":"public-demo","title":"Public sample gallery"}]
```

The body is the representation you can store when permitted. The ETag is an opaque validator associated with that representation, not a timestamp you should interpret. The freshness directive permits reuse under the applicable cache rules; it does not require a client to keep a copy.

Now the client asks whether its stored representation is still current:

```http
GET /catalog HTTP/1.1
Host: 127.0.0.1:4310
If-None-Match: "catalog-v1"

HTTP/1.1 304 Not Modified
Cache-Control: public, max-age=30
ETag: "catalog-v1"
```

There is no representation body after the 304 headers. A client managing this conditional exchange itself must retain the earlier body and handle 304 before attempting JSON parsing. A browser-managed cache may perform validation internally and give fetch the resulting stored response instead; use Network to see what crossed the wire. Do not assume every fetch call exposes the raw 304 to your code.

### Prove the body is absent

In a Node.js 22 terminal, run this script while the lab is running. Node fetch does not provide the browser's persistent HTTP cache for this exercise; you supply the validator explicitly.

```js
const first = await fetch('http://127.0.0.1:4310/catalog');
const saved = await first.json();
const etag = first.headers.get('etag');
const checked = await fetch('http://127.0.0.1:4310/catalog', {
  headers: { 'If-None-Match': etag }
});
console.log(first.status, checked.status, (await checked.text()).length);
console.log(saved);
```

Expect 200, 304 and 0, followed by the saved catalogue. Calling checked.json() instead would try to parse an empty body. That failure would be in your response handling, not evidence that the server returned malformed JSON.

### Read the preflight separately

The OPTIONS command above returns 204 plus Access-Control-Allow-Origin, Access-Control-Allow-Methods and Access-Control-Allow-Headers. These describe browser permission for the subsequent cross-origin exchange. They neither create a gallery nor authenticate studio-a. Send GET /galleries with the allowed Origin but no Authorization header: it still returns 401. Save both responses so the preflight and resource request do not get confused in your notes.

## Failure analysis

Request a gallery without authentication using curl, even with the allowed Origin header. It should still fail. Write why adding Access-Control-Allow-Origin cannot repair a missing token, and why allowing every origin is a poor debugging shortcut for private data.

## Assessment

Make a caching decision for a public report, a private gallery and a sign-in response. State who can reuse each, for how long, and what invalidates it. Ready when you can explain why 304 is useful and why it is not a fresh JSON body.

## Freshness, validation and response selection

Caching has two distinct decisions: which stored response matches this request, and whether that response can be reused now. A cache key that ignores a relevant request dimension can return the wrong representation even when its freshness rules are correct. This is why response variation, identity and shared-cache policy must be considered together.

### Worked reasoning

The lab returns a fixed ETag for an unchanged public catalogue. A matching conditional request yields 304, allowing the client to reuse its stored representation. A client with no stored body cannot treat 304 as a new JSON document. For a private gallery, first establish whether storage is allowed and who may reuse it; adding a validator does not make shared caching appropriate.

### Apply the distinction

Write two traces: an unchanged public catalogue and a private gallery accessed by two different callers. Identify the stored object, its reuse conditions and the event that requires a new representation.

## Sources

- [HTTP caching](https://www.rfc-editor.org/rfc/rfc9111.html)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
