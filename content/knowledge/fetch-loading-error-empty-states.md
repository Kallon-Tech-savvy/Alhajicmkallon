---
slug: "fetch-loading-error-empty-states"
title: "How should a frontend handle loading, errors and empty API results?"
category: "JavaScript practice"
topics: ["JavaScript", "fetch", "API"]
date: "2026-11-02"
readTime: "4 min with practice"
excerpt: "Treat loading, success with data, success without data and failure as distinct UI states. A completed fetch is not proof of HTTP success: check response.ok before reading the result."
status: "published"
kind: "knowledge"
level: "intermediate"
prerequisites: ["Write async JavaScript functions", "Understand JSON"]
objectives: ["Distinguish HTTP errors from network errors", "Plan loading and empty states"]
sources: ["https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"]
---

## Quick answer

Treat loading, success with data, success without data and failure as distinct UI states. A completed fetch is not proof of HTTP success: check response.ok before reading the result.

## Build a small example

```js
async function loadProjects(signal) {
  const response = await fetch('/api/projects', { signal });
  if (!response.ok) throw new Error('Projects are unavailable');
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('Unexpected response');
  return data;
}
```

The example endpoint is illustrative; your application must provide it. Validate each record before displaying fields, not just the outer array.

## Try it yourself

Create fixtures for a non-empty array, an empty array, an HTTP error and malformed JSON. Write the visitor-facing message for each. Test a slow connection and two quickly superseded requests.

## Common mistake

A stale response can overwrite newer results. Abort superseded work and guard state updates so cancelled requests cannot replace the current view. Treat deliberate cancellation separately from a service failure.

## Check your understanding

Should an empty successful response show “something went wrong”? No. Explain that no items match and provide a useful next action.

## Next step

Read [runtime validation with TypeScript](/knowledge/typescript-runtime-validation).

## Sources and further reading

- [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

Published 2 November 2026. Examples are teaching exercises, not claims about client results.
