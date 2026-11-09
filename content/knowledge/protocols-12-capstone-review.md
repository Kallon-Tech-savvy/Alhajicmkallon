---
slug: "protocols-12-capstone-review"
title: "Prove a small integration works for a person"
category: "Protocol course · Lesson 12"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "10–15 min reading · 60–90 min practice"
excerpt: "Bring the course together in a gallery workflow with a contract, negative tests, recovery behavior and an honest review of remaining risks."
status: "published"
kind: "knowledge"
level: "junior"
prerequisites: ["Complete the previous course lesson or its readiness check", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Demonstrate a complete integration with failure evidence", "Explain trade-offs and limits in a reviewable handoff"]
sources: ["https://spec.openapis.org/oas/v3.2.1.html", "https://www.rfc-editor.org/rfc/rfc9700.html", "https://www.w3.org/TR/trace-context/"]
---

## Start with a person

Augusta needs to create a private gallery and let Mohamed know when his photographs are ready. The goal is not to display every protocol you learned. It is to complete that small journey without losing work, leaking access or misleading either person.

## Choose your scope

Build a local gallery-creation client against your own extension of the lab. Keep one studio owner, one viewer, one resource and one asynchronous status. Use fictional records. If you need more time, stop at a documented HTTP workflow before adding events. A useful, well-tested slice is a valid capstone.

The lab’s pretend tokens, memory storage, short event stream and local-only origin are teaching shortcuts. A deployable product needs real identity, durable state, operational controls and a separate security review. Passing this course is not a claim of production readiness or professional certification.

## Build the evidence pack

- A request map and a small OpenAPI contract with examples and documented errors.
- A runnable setup guide with versions, commands, reset instructions and no real secrets.
- A permission matrix covering owner, viewer, wrong studio and missing credentials.
- A retry transcript showing timeout after commit and duplicate-key handling.
- A live-update decision that compares polling, SSE and WebSocket for the chosen task.
- A webhook or event-inbox design with signature, duplicate and crash-recovery tests.
- A safe incident note with observations separated from hypotheses.
- Optional: a read-only tool contract with server-enforced access and hostile-input tests.

## Walk through the difficult moments

Ask a peer to create a gallery while you observe without coaching. If no peer is available, record your own walkthrough and mark its limits. Slow the connection, disconnect after submitting, expire a test session and attempt a cross-studio read. Record what the person sees, what the system knows and which action is safe next.

Do not measure success only by a green HTTP status. Can Augusta tell whether her work was confirmed? Does Mohamed understand why access is denied? Can someone using a keyboard reach the retry action? Does a duplicate event repeat a notification?

## Review with a rubric

For each area, write “demonstrated,” “partly demonstrated” or “not yet demonstrated,” with evidence: contract clarity, access boundary, duplicate handling, cancellation/recovery, observability and interface honesty. Do not average away a failed permission boundary with a polished interface.

Ready to complete when your happy path works, denied paths return no private data, retry evidence matches your stated guarantees, and another developer can reproduce the setup. Name remaining gaps explicitly. If a guarantee depends on an unbuilt database constraint, it is not demonstrated yet.

## Reflect before adding more

Write one page: what confused you at the start, the experiment that changed your understanding, a decision you would make differently and the next smallest test. Keep your failed attempts: they show how your reasoning improved.

Return to the [course overview](/knowledge/protocols) whenever you need a map. Choose the lesson that addresses the uncertainty in front of you; rereading is part of engineering, not a setback.

## Sources

- [OpenAPI](https://spec.openapis.org/oas/v3.2.1.html)
- [OAuth security guidance](https://www.rfc-editor.org/rfc/rfc9700.html)
- [Trace Context](https://www.w3.org/TR/trace-context/)
