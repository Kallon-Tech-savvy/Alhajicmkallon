---
slug: "protocols-02-http-contract"
title: "Make HTTP responses mean something"
category: "Protocol course · Lesson 02"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "10–15 min reading · 60–90 min practice"
excerpt: "Practise methods, status codes, headers and validation using a runnable local API, then translate technical outcomes into honest interface messages."
status: "published"
kind: "knowledge"
level: "beginner"
prerequisites: ["Complete the previous course lesson or its readiness check", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Inspect a real HTTP exchange", "Separate HTTP failure from a network failure"]
sources: ["https://www.rfc-editor.org/rfc/rfc9110.html", "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"]
---

## Start with a person

Mohamed presses Save and sees “Done.” But the server rejected the request. A cheerful message has made the product less trustworthy. We need to distinguish the button press, the request and the confirmed outcome.

## The idea

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

## Build the next piece

Write a small TypeScript function that fetches /galleries with the fictional Authorization header, accepts an AbortSignal, checks response.ok and parses JSON as unknown. Validate that the result is an array and that each item has a string id and title before displaying it. Types describe your expectations; they do not validate network bytes.

Keep four interface states: loading, success with items, success without items and failure. State which error information belongs in a developer log and which helps a visitor.

## Break it deliberately

Remove the header, stop the server, and replace a saved JSON fixture with malformed data. These represent different failures. Do not expose raw stack traces to Mohamed. Keep useful context and a next action: “Your changes were not confirmed. Check your connection and try again.” Only say changes were not saved when you know that.

## Check your reasoning

Ready when your function rejects HTTP errors, malformed JSON and wrong data shapes, and handles a successful empty list without an error banner. Explain why receiving a response is different from completing the person’s goal.

## Sources

- [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Existing guide: loading, errors and empty states](/knowledge/fetch-loading-error-empty-states)
