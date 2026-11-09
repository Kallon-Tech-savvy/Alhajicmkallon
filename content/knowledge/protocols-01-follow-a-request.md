---
slug: "protocols-01-follow-a-request"
title: "Follow a request without getting lost"
category: "Protocol course · Lesson 01"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "10–15 min reading · 60–90 min practice"
excerpt: "Understand what a protocol promises, trace DNS, transport, TLS and HTTP, and build a debugging map before writing more code."
status: "published"
kind: "knowledge"
level: "beginner"
prerequisites: ["No protocol knowledge required; basic JavaScript is helpful", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Distinguish a protocol from an API and data format", "Find the layer where a request failed"]
sources: ["https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview", "https://www.rfc-editor.org/rfc/rfc9293.html", "https://www.rfc-editor.org/rfc/rfc8446.html"]
---

## Start with a person

Augusta is a fictional photographer. Mohamed is her client. He opens a gallery link on a patchy connection and sees a spinner. He does not know whether the gallery is missing, his connection is failing or his photographs are private. Our job is to investigate before telling him to try again.

If the vocabulary feels crowded, that is understandable. You are learning several layers at once. Keep one question in view: what happened between asking for something and receiving it?

## The idea

A protocol is an agreed set of rules for communication: message shapes, meaning and what participants do next. An API exposes capabilities. JSON is a data format. REST is an architectural style. They solve related but different problems.

DNS resolves a name to records. IP carries packets. TCP gives an ordered byte stream, not separate application messages; UDP carries datagrams without built-in reliable delivery. TLS protects a channel and authenticates the server when correctly validated. HTTP gives requests and responses their application meaning. HTTPS does not decide which gallery Mohamed may see.

HTTP/1.1 and HTTP/2 commonly use TCP; HTTP/3 uses QUIC over UDP. Do not assume a transport change repairs a slow database. Cache reuse and existing connections can also mean a request does not repeat every step.

## Set up the practice space

Download the [local protocol lab](/downloads/protocol-lab.mjs), save it as protocol-lab.mjs, and open a terminal in that folder. Install Node.js from its official distribution if you do not already have it. No package install, account or API key is needed.

```sh
node --version
node protocol-lab.mjs
```

Leave this terminal running. In another terminal:

```sh
curl -i http://127.0.0.1:4310/catalog
```

On Windows PowerShell use curl.exe if curl is an alias. The expected response is 200 with a JSON array containing a public sample gallery. Visit that URL in your browser and inspect Network. Stop the server with Ctrl+C when finished. If port 4310 is occupied, close the earlier lab process; do not terminate an unfamiliar process.

The lab is intentionally HTTP on loopback, so it does not exercise public DNS or TLS. For those layers, inspect a normal HTTPS website in browser developer tools: request URL, timing and certificate information. Do not disable certificate verification.

## Break it deliberately

Stop the lab and repeat the request. Compare connection refused with a 404 response from a running server at /missing. The first cannot establish the connection; the second reached an HTTP server that answered. Record the difference without guessing about the application’s internals.

## Check your reasoning

Save a request map with six labels: name, connection, secure channel, HTTP, application and permission. For each, write one possible failure and one observation you could collect. Ready to continue when you can explain why a certificate error and a missing gallery need different investigations.

## A note to carry forward

Instead of “It is broken,” try “The server was reachable and returned 404; I have not yet checked whether the gallery exists.” Precision gives you a next step and gives another person something useful to work with.

## Sources

- [MDN: HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [TCP specification](https://www.rfc-editor.org/rfc/rfc9293.html)
- [TLS 1.3 specification](https://www.rfc-editor.org/rfc/rfc8446.html)
