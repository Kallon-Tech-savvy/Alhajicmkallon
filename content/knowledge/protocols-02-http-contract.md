---
slug: "protocols-02-http-contract"
title: "Make HTTP responses mean something"
category: "Protocol course · Lesson 02"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "15–20 min reading · practice at your own pace"
excerpt: "Practise methods, status codes, headers and validation using a runnable local API, then translate technical outcomes into honest interface messages."
status: "published"
kind: "knowledge"
level: "beginner"
prerequisites: ["Complete the previous course lesson or its readiness check", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Inspect a real HTTP exchange", "Separate HTTP failure from a network failure"]
sources: ["https://www.rfc-editor.org/rfc/rfc9110.html", "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"]
---

## Problem and scope

Mohamed presses Save and sees “Done.” But the server rejected the request. A cheerful message has made the product less trustworthy. We need to distinguish the button press, the request and the confirmed outcome.

## Lab scope and pass criteria

Practice mode: Run the supplied lab; build the client separately.

### Expected result

GET /galleries without a token returns 401. With studio-a it returns 200 and one gallery on a fresh start. GET /failure returns 503 with simulated_outage.

### Evidence and limits

Save status and response headers. The loading, empty, success and error interface is your implementation; the lab does not render it. Studio-b has an empty gallery list on a fresh start.

## Core concepts

A request includes a method, target and headers, sometimes a body. A response includes a status, headers and sometimes a body. GET should retrieve without requesting a state change. POST can create a resource; it is not automatically safe to repeat. A successful fetch promise can still contain an HTTP error response.

Common outcomes include 200 for success, 201 for creation, 400 for invalid input, 401 for missing or invalid authentication, 403 for refusal and 503 for temporary service unavailability. These labels do not replace reading the API contract. A product may deliberately return 404 rather than reveal a private resource exists.

## Run the experiment

Start the lab from lesson 1. These are fictional demo tokens, not a real sign-in system.

```sh
curl -i http://127.0.0.1:4310/galleries
curl -i http://127.0.0.1:4310/galleries -H "Authorization: Bearer studio-a"
curl -i http://127.0.0.1:4310/failure
```

Expect 401, then 200 with one gallery, then a simulated 503. Record status, Content-Type, Cache-Control and X-Request-ID. Keep the terminal output as evidence.

In a browser console opened on the lab origin, use:

```js
const response = await fetch('/failure');
console.log(response.status, response.ok);
```

Expect 503 and false, rather than assuming the promise will reject. Do not run relative examples on an unrelated website: they address the current origin.

## Read a response before writing the interface

The following is a shortened example of the lab's GET /failure exchange. Header order, casing and generated identifiers can differ. Date and transfer headers are omitted. REQUEST_ID stands for the generated value; it is not a literal value to send.

```http
GET /failure HTTP/1.1
Host: 127.0.0.1:4310

HTTP/1.1 503 Service Unavailable
Content-Type: application/json
Cache-Control: no-store
X-Request-ID: REQUEST_ID

{"error":"simulated_outage","requestId":"REQUEST_ID"}
```

Read it in order:

- The GET target identifies the operation you requested. It does not tell you which internal component produced the answer.
- 503 is an HTTP response, so this exchange reached an HTTP-speaking server. In this lab it is a deliberate simulation; it does not diagnose a real dependency outage.
- Content-Type declares JSON. Parsing can still fail or produce an unexpected shape, so inspect the bytes and validate the parsed value.
- Cache-Control: no-store tells caches not to store this response. It is not encryption or an access check.
- X-Request-ID and the matching body field let you correlate this reply with the local server log. They are not credentials or proof of identity.

Use the curl command above to capture your own exchange. Then stop the lab and repeat it. A connection error has no received HTTP status or JSON error body; do not invent a 503 for it in your client code.

### Translate evidence into a useful state

For this known simulated failure, the interface can say the service could not complete the request. For a timed-out mutation, it must instead say the result is unconfirmed until the stored state is checked. The same generic red banner cannot communicate both conditions accurately.

Before continuing, answer: which line tells you the server answered, and which line proves an email was delivered? The status line supports the first claim. Nothing in this exchange supports the second.

## Build the next piece

Write a small TypeScript function that fetches /galleries with the fictional Authorization header, accepts an AbortSignal, checks response.ok and parses JSON as unknown. Validate that the result is an array and that each item has a string id and title before displaying it. Types describe your expectations; they do not validate network bytes.

Keep four interface states: loading, success with items, success without items and failure. State which error information belongs in a developer log and which helps a visitor.

## Failure analysis

Remove the header, stop the server, and replace a saved JSON fixture with malformed data. These represent different failures. Do not expose raw stack traces to Mohamed. Keep useful context and a next action: “Your changes were not confirmed. Check your connection and try again.” Only say changes were not saved when you know that.

## Assessment

Ready when your function rejects HTTP errors, malformed JSON and wrong data shapes, and handles a successful empty list without an error banner. Explain why receiving a response is different from completing the person’s goal.

## HTTP outcomes and application outcomes

Transport success, HTTP success and business success are separate conditions. A response can arrive intact with status 400. A 200 response can contain a malformed representation. A valid representation can describe an operation that is accepted but incomplete. Client code must check the relevant conditions in order rather than treating a resolved promise as a completed task.

### Worked reasoning

For gallery creation, a 201 response identifies a created resource. A 202 response would instead indicate acceptance for processing; the contract would need a way to inspect completion. If an email notification is a later step, gallery creation success does not prove the email was delivered. Represent those states separately in the interface and in tests.

### Apply the distinction

Build an outcome matrix with columns for connection, status, representation and business state. Include malformed JSON on 200, a valid error on 400, a connection timeout and an accepted background job.

## Sources

- [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Existing guide: loading, errors and empty states](/knowledge/fetch-loading-error-empty-states)
