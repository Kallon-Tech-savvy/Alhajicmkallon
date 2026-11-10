---
slug: "protocols-04-design-an-api"
title: "Design an API another developer can trust"
category: "Protocol course · Lesson 04"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "15–20 min reading · practice at your own pace"
excerpt: "Turn a gallery-creation journey into a documented contract with validation, clear errors and compatibility tests."
status: "published"
kind: "knowledge"
level: "intermediate"
prerequisites: ["Complete the previous course lesson or its readiness check", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Write a small OpenAPI contract", "Test an older client against a changed response"]
sources: ["https://spec.openapis.org/oas/v3.2.1.html"]
---

## Problem and scope

A teammate should not need to ask you what every field means. A contract reduces that dependence. It also helps the person using the product: consistent rules make errors easier to explain and recover from.

## Lab scope and pass criteria

Practice mode: Run the creation request; write the contract and compatibility checks.

### Expected result

On a fresh start, the documented POST with a new key returns 201, Location and a gallery id. Repeating the same key and normalized title returns 200 with that id. An empty title returns 400.

### Evidence and limits

Save both replies and compare ids. The fixture ignores unknown body fields, including studio; ownership still comes from the demo token. It does not validate an OpenAPI document or supply an older-client compatibility test.

## Core concepts

An HTTP API can use resource-oriented conventions without satisfying every REST constraint. Be precise about what you have built. OpenAPI describes an HTTP interface; documentation alone does not enforce runtime validation or authorization.

Start with the job: Augusta wants a named, private gallery in her own studio. Define the accepted input, the created resource, the permission boundary and failure outcomes before choosing a large framework.

## Build a contract

Write an OpenAPI document for GET /galleries and POST /galleries. Choose a tooling-supported OpenAPI version and record it; the source below documents version 3.2.1, while some tools may support an earlier version. Include security requirements, request headers, examples, responses and schemas.

A creation input might be:

```json
{"title":"Augusta portraits"}
```

Require a non-empty title of at most 100 characters. Document that studio identity comes from the authenticated caller rather than a caller-supplied body field. Include the idempotency key required by the lab. Explain 201, invalid input, missing credentials, duplicate-key conflict and unexpected failure.

Use the lab to observe POST behavior. Save a file named gallery.json containing the example above:

```sh
curl -i http://127.0.0.1:4310/galleries -H "Authorization: Bearer studio-a" -H "Content-Type: application/json" -H "Idempotency-Key: create-001" --data-binary @gallery.json
```

Expect 201, Location and a generated id. Omit title or send an empty title and expect 400. The server is a learning fixture, not a complete OpenAPI reference implementation.

## Failure analysis

Create a fixture representing an older client that reads id and title. Add an optional description field to the response. Then rename title to name. Which change can the old client tolerate? Check with a parser rather than relying on “it should work.” Some strict consumers reject unknown fields too; compatibility depends on your actual contract.

## Assessment

Save the contract, example requests and tests for success, empty title, missing token and unknown field policy. Ready when another developer can implement the client without asking you what a successful creation looks like.

## A contract includes behavior, not only fields

A schema defines admissible structure. A usable contract also defines ownership, operation semantics, error handling, concurrency and compatibility. A title field can pass structural validation while the caller is forbidden to create a gallery in the requested studio. Keep those checks distinct so an error tells the client which category of failure occurred.

### Worked reasoning

Treat studio identity as trusted server context derived from validated credentials. The request body supplies a title, not an authoritative owner. If a caller adds a studio field, define whether the server rejects unknown fields or ignores them. Either choice must be documented and tested; silently using that field would let the caller influence the permission boundary.

### Apply the distinction

Describe one operation using six headings: caller, input, invariants, state change, response and retry behavior. Then implement a client using only that description. Every unanswered question is a contract gap.

## Sources

- [OpenAPI specification 3.2.1](https://spec.openapis.org/oas/v3.2.1.html)
- [Runtime validation guide](/knowledge/typescript-runtime-validation)
