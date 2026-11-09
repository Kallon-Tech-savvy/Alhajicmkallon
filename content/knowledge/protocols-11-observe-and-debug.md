---
slug: "protocols-11-observe-and-debug"
title: "Debug across boundaries without exposing people"
category: "Protocol course · Lesson 11"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "15–20 min reading · practice at your own pace"
excerpt: "Use request IDs and trace concepts to investigate a failure, preserve useful evidence and write a calm incident explanation."
status: "published"
kind: "knowledge"
level: "junior"
prerequisites: ["Complete the previous course lesson or its readiness check", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Separate observations from hypotheses", "Collect safe operational evidence"]
sources: ["https://www.w3.org/TR/trace-context/", "https://opentelemetry.io/docs/specs/otlp/"]
---

## Problem and scope

Mohamed reports “It did not save.” That is valuable information about his experience, even though it is not a diagnosis. A good investigation makes room for both: what he experienced and what the system can establish.

## Core concepts

A request id correlates one request’s observations. Distributed trace context connects related work across services; OTLP transports telemetry. Logs describe events, traces show related operations and metrics summarize patterns. No single dashboard explains every failure.

Never log an entire request merely because it is convenient. Tokens, cookies, private photographs and raw messages can leak through debugging output. Choose safe fields, retention and access deliberately. A trace id is not proof that the caller is authorized.

## Run the lab

Request /failure, then compare the X-Request-ID response header with the JSON log in the server terminal. The lab logs method, path and status, not the Authorization header or request body. This is a simple local correlation exercise, not full distributed tracing.

Repeat the delayed creation from lesson 9. Compare what the client observed with what the server stored. Your notes should not turn “no response” into “no write.”

## Build an investigation note

Use these headings: person’s report, confirmed observations, hypotheses, next experiment and result. Collect one failing request’s time, route category, status and request id. Keep confidential data out of screenshots and shared notes. Reproduce locally with synthetic data before increasing production logging.

As an optional extension, use OpenTelemetry instrumentation to create a server span and a child operation. Propagate trace context with supported instrumentation instead of inventing a traceparent value. Record sampling and retention choices, and check that failed operations are represented without placing secrets in attributes.

## Failure analysis

Simulate an upstream timeout, invalid JSON and a denied resource. For each, ask which layer has evidence and which is still unknown. A 503 from your application could mean a missing configuration value or an unavailable dependency; the status alone does not choose between those explanations.

## Assessment

Ready when another developer can follow your incident note, reproduce the failure and see what remains uncertain. Write a short visitor-facing update: acknowledge the affected action, state what is known and offer a next step. Avoid blaming the person’s network when you have not tested that hypothesis.

## An investigation needs competing explanations

A useful hypothesis predicts an observation that could distinguish it from alternatives. A 503 response alone does not distinguish missing configuration, upstream rejection, capacity limits or an internal dependency failure. Collect evidence at the boundary responsible for the response. Avoid collecting more private information merely because the diagnosis is uncertain.

### Worked reasoning

Suppose a request fails before any dependency span appears. That supports investigating local validation, configuration or instrumentation gaps before blaming the upstream service. Suppose a dependency span records an authentication rejection. That supports checking credential configuration, not changing retry delays. Missing telemetry is not proof that work did not happen; instrumentation coverage must also be considered.

### Apply the distinction

For each incident, list two plausible explanations and one discriminating check. Record which evidence changed your confidence. Preserve correlation identifiers while excluding credential values and user content.

## Sources

- [W3C Trace Context](https://www.w3.org/TR/trace-context/)
- [OpenTelemetry Protocol](https://opentelemetry.io/docs/specs/otlp/)
