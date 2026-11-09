---
slug: "protocols-07-events-and-webhooks"
title: "Receive events without duplicating their effects"
category: "Protocol course · Lesson 07"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "10–15 min reading · 60–90 min practice"
excerpt: "Design a signed webhook receiver, durable processing boundary and duplicate-delivery tests before adding a message broker."
status: "published"
kind: "knowledge"
level: "junior"
prerequisites: ["Complete the previous course lesson or its readiness check", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Verify raw-body webhook signatures", "Distinguish delivery acknowledgement from business completion"]
sources: ["https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries", "https://cloudevents.io/", "https://www.asyncapi.com/docs"]
---

## Start with a person

A payment provider sends the same notification twice. Augusta should not send two receipts or unlock the wrong client gallery. A retry is a normal integration condition; your receiver should be designed for it.

## The idea

A webhook is usually an HTTP notification sent to a receiving endpoint. Verify authenticity according to that provider’s exact contract. GitHub’s example uses an HMAC-SHA256 signature header and the original payload bytes. Other providers use different headers, timestamp rules and verification schemes. Do not invent a universal webhook verifier.

After verification and validation, durably record the event before acknowledging acceptance. Slow business work can follow in a worker. A successful acknowledgement says what your contract defines; it does not automatically mean an email was delivered or a job completed.

## Build a local extension

The supplied lab does not include a webhook receiver. Add one in a copy of the file, or in a separate local service. Use synthetic events and an explicit local-only demo signing secret. Never use a production webhook secret in a lesson.

Define event id, type, studio reference and payload schema. Verify the raw body before JSON parsing, compare valid-length signatures with a timing-safe comparison, reject malformed input and enforce body limits. For a real integration, use the provider’s maintained verifier where available.

Create a durable inbox with a unique provider/event-id key and processing status. A duplicate should not repeat the effect. Design how a failed worker retries an accepted event, and how the operator identifies an exhausted retry. An in-memory Set is useful for a demonstration but loses its history on restart.

## Break it deliberately

- Change one body byte after signing: verification must fail.
- Send the same event twice and concurrently: one effect should result.
- Crash after storing the event but before the effect: processing must resume.
- Crash after the effect but before marking completion: explain how the effect itself is deduplicated.
- Deliver events out of order: define whether to fetch current source state or enforce a version.

## Beyond webhooks

CloudEvents standardizes event metadata; AsyncAPI describes message-driven contracts. Neither guarantees delivery. AMQP and MQTT are messaging protocols with different broker/client use cases. Explore them when background work or device communication requires it, then inspect acknowledgements, retention and redelivery. A broker does not remove your application’s responsibility for duplicate effects.

## Check your reasoning

Save a receiver design and a test transcript with valid, tampered, duplicate and crash-recovery cases. Ready when you can point to the durable boundary and explain what remains unproven. The person waiting for confirmation needs an accurate state, not a promise made before the work is safe.

## Sources

- [GitHub: validating webhook deliveries](https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries)
- [CloudEvents](https://cloudevents.io/)
- [AsyncAPI](https://www.asyncapi.com/docs)
