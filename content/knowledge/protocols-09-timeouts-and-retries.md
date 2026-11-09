---
slug: "protocols-09-timeouts-and-retries"
title: "Handle the request that may already have succeeded"
category: "Protocol course · Lesson 09"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "10–15 min reading · 60–90 min practice"
excerpt: "Reproduce a timeout after a write, then use idempotency and bounded retries to avoid duplicate work."
status: "published"
kind: "knowledge"
level: "junior"
prerequisites: ["Complete the previous course lesson or its readiness check", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Distinguish a missing response from a failed write", "Test retry behavior after an ambiguous outcome"]
sources: ["https://www.rfc-editor.org/rfc/rfc9110.html"]
---

## Start with a person

Augusta taps Create gallery. The request times out. She taps again because the interface offers no other explanation. Two galleries appear. The system has turned uncertainty into extra work for her.

## The idea

A client timeout means the client stopped waiting; the server may already have committed. Aborting fetch does not roll back remote work. Idempotent method semantics concern intended effects; a POST operation needs an explicitly designed deduplication contract if retries must not create duplicates.

An idempotency key should identify one intended operation, be scoped to the caller and be checked with the request’s meaning. Reusing a key with different input must not silently return an unrelated result. Production storage needs atomicity, concurrency handling, expiry and durable results. The lab’s in-memory map is only a demonstration.

## Reproduce the uncertainty

Use gallery.json from lesson 4. Start the lab, then run:

```sh
curl --max-time 0.2 -i 'http://127.0.0.1:4310/galleries?delay=1500' -H "Authorization: Bearer studio-a" -H "Content-Type: application/json" -H "Idempotency-Key: timeout-001" --data-binary @gallery.json
```

The lab creates the record before delaying its response by 1.5 seconds. Your client should time out. Retry without the delay using the same key and body. Expect 200 with the existing record, not a second creation. GET /galleries and count the records. Change the title while keeping the key and expect 409.

Restarting the lab clears both records and deduplication state. Do not present this fixture as a durable production guarantee.

## Build a retry policy

List retryable situations for your operation, a total time budget, maximum attempts and delays with jitter. Respect relevant Retry-After guidance. Do not retry invalid credentials or invalid input endlessly. Cap concurrent work and queued messages; when producers exceed capacity, backpressure must limit or reject work rather than growing memory without bound.

For a multi-step workflow, assign time budgets to the caller, API and downstream dependencies. A retry loop that outlives the person’s action creates hidden work and confusion.

## Break it deliberately

Send two identical creation requests concurrently. Lose the response after the write. Restart the process before retrying. Document which guarantees the lab satisfies and which it cannot. Next, design a database uniqueness constraint and transaction that closes those gaps.

## Check your reasoning

Ready when you can demonstrate one operation producing one intended result under a retry and explain the storage assumptions. Write the uncertain state honestly: “The result is not confirmed yet. Check the gallery list before creating another.”

## Sources

- [HTTP semantics and idempotent methods](https://www.rfc-editor.org/rfc/rfc9110.html)
