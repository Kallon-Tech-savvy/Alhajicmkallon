---
slug: "protocols-05-interface-choices"
title: "Choose HTTP, GraphQL, gRPC or JSON-RPC deliberately"
category: "Protocol course · Lesson 05"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "10–15 min reading · 60–90 min practice"
excerpt: "Compare contracts using the same gallery task and learn when extra infrastructure earns its place."
status: "published"
kind: "knowledge"
level: "intermediate"
prerequisites: ["Complete the previous course lesson or its readiness check", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Separate API style from transport and serialization", "Write a justified protocol decision"]
sources: ["https://graphql.org/learn/", "https://grpc.io/docs/what-is-grpc/introduction/", "https://www.jsonrpc.org/specification"]
---

## Start with a person

A developer you admire uses gRPC. You feel behind because your application uses HTTP and JSON. Pause there. A protocol choice is a response to constraints, not a measure of your seniority.

## The idea

An HTTP resource API exposes operations through HTTP semantics. GraphQL lets clients select fields against a schema; query flexibility adds authorization and execution-cost questions. gRPC defines service methods and message contracts, commonly using Protocol Buffers and HTTP/2; browser access needs an appropriate integration such as gRPC-Web. JSON-RPC describes method-call envelopes, independently of the transport.

None of these makes an untrusted user trustworthy. A schema does not remove input, ownership, cost or compatibility concerns.

## Run a paper experiment

Describe the same read-only task in three forms: “Fetch gallery-a and the first ten photo captions.” Sketch an HTTP request, a GraphQL query and a JSON-RPC message. For JSON-RPC, give the call an id and distinguish result from error. A notification omits the id and does not expect a response.

```json
{"jsonrpc":"2.0","id":1,"method":"gallery.get","params":{"id":"gallery-a"}}
```

This envelope is a design exercise; the supplied HTTP lab does not implement JSON-RPC or GraphQL. Do not paste it into a gallery POST endpoint and expect the same contract.

For gRPC, sketch a GalleryService with GetGallery and explicit request/response messages. Identify which generator, client runtime and browser bridge you would need before committing to implementation.

## Build the decision record

Write five headings: user task, constraints, candidate options, chosen option and evidence that would change your mind. Compare browser support, deployment skills, payload needs, caching, operational visibility and who owns each client. Choose one contract for a small gallery product and one for a service-to-service media pipeline.

## Break it deliberately

Imagine a GraphQL client requests deeply nested relationships, an RPC response arrives with an unexpected id, and an old client sees an unknown enum value. Describe the boundary that catches each failure. These are prompts for implementation tests, not claims that one option is inherently unsafe.

## Check your reasoning

Ready when you can defend your choice without saying “modern,” “enterprise” or “fast” as the entire explanation. Name one cost you accepted and one requirement that would make you reconsider.

## Sources

- [GraphQL learning guide](https://graphql.org/learn/)
- [gRPC introduction](https://grpc.io/docs/what-is-grpc/introduction/)
- [JSON-RPC 2.0](https://www.jsonrpc.org/specification)
