---
slug: "protocols-06-live-updates"
title: "Make live updates survive a disconnect"
category: "Protocol course · Lesson 06"
topics: ["Protocols", "APIs", "Practical engineering"]
date: "2026-11-09"
readTime: "10–15 min reading · 60–90 min practice"
excerpt: "Compare polling, SSE and WebSocket through the experience of waiting for photographs to finish processing."
status: "published"
kind: "knowledge"
level: "intermediate"
prerequisites: ["Complete the previous course lesson or its readiness check", "Node.js 22 or later for local labs; browser developer tools", "Basic JavaScript; TypeScript examples are explained as you go"]
objectives: ["Choose a suitable update channel", "Design reconnection and duplicate-event handling"]
sources: ["https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events", "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"]
---

## Start with a person

Mohamed watches an upload reach 80 percent, then his connection drops. A progress bar that resets to zero can make him feel his work disappeared. Before adding animation, decide what state the server actually knows and how the interface recovers it.

## The idea

Polling periodically asks for state. SSE sends a stream of text events from server to browser over HTTP. WebSocket supports bidirectional messages over a persistent connection. Use the simplest option that meets the interaction: a progress feed does not automatically require a two-way channel.

Native EventSource supports reconnect behavior but cannot set arbitrary request headers. A browser design might use an appropriate same-origin cookie session, or a fetch-based streaming client with its own framing and reconnect logic. Do not put a long-lived bearer token into a URL to work around this.

## Observe the stream

```sh
curl -N http://127.0.0.1:4310/events -H "Authorization: Bearer studio-a"
```

The lab emits three progress events, with id, event and JSON data fields separated by blank lines. It then closes. This fixture has no replay storage; its counter restarts on every connection. It deliberately does not promise resumability.

Save the event output. Write a parser that buffers partial chunks until a complete event boundary exists; one network chunk is not necessarily one message. If you use a maintained parser, still test its handling of incomplete input.

## Build a recovery plan

Define a server-owned job id, current progress snapshot and monotonically meaningful event sequence for that job. On reconnect, fetch a fresh snapshot or implement a bounded replay log. Explain what happens if the requested event id is older than the retained history.

For an optional WebSocket extension, define message types for join, progress and comment. Authenticate the connection, authorize the gallery subscription, bound message size and test reconnect. The local lab does not supply a WebSocket server; choose an official or maintained implementation if extending it.

## Break it deliberately

Disconnect after the second event. Replay one event twice. Deliver progress after a job has completed. Your reducer must not show 150 percent or undo a confirmed completion. Test that switching galleries removes the previous subscription.

## Check your reasoning

Ready when you can show a reconnect transcript and explain your choice among polling, SSE and WebSocket. Write honest microcopy for “reconnecting” and “last confirmed progress.” A temporarily disconnected person deserves useful information, not a silent spinner.

## Sources

- [MDN: SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [MDN: WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
