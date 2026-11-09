---
slug: "protocols-04-design-an-api"
title: "Design an API another developer can trust"
category: "Protocol course · Lesson 04"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "10–15 min reading · 60–90 min practice"
excerpt: "Turn a gallery-creation journey into a documented contract with validation, clear errors and compatibility tests."
status: "published"
kind: "knowledge"
level: "intermediate"
prerequisites: ["Complete the previous course lesson or its readiness check", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Write a small OpenAPI contract", "Test an older client against a changed response"]
sources: ["https://spec.openapis.org/oas/v3.2.1.html"]
---

## Start with a person

A teammate should not need to ask you what every field means. A contract reduces that dependence. It also helps the person using the product: consistent rules make errors easier to explain and recover from.

## The idea

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

## Break it deliberately

Create a fixture representing an older client that reads id and title. Add an optional description field to the response. Then rename title to name. Which change can the old client tolerate? Check with a parser rather than relying on “it should work.” Some strict consumers reject unknown fields too; compatibility depends on your actual contract.

## Check your reasoning

Save the contract, example requests and tests for success, empty title, missing token and unknown field policy. Ready when another developer can implement the client without asking you what a successful creation looks like.

## Human checkpoint

A first contract is allowed to be small. Two clearly defined operations teach more than twenty endpoints with unexplained errors. Ask a peer which sentence made them pause, then improve that sentence.

## Sources

- [OpenAPI specification 3.2.1](https://spec.openapis.org/oas/v3.2.1.html)
- [Runtime validation guide](/knowledge/typescript-runtime-validation)
