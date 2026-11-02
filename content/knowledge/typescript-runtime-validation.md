---
slug: "typescript-runtime-validation"
title: "Does TypeScript validate data returned by an API?"
category: "TypeScript practice"
topics: ["TypeScript", "validation"]
date: "2026-11-02"
readTime: "4 min with practice"
excerpt: "TypeScript checks code during development; a type assertion does not inspect an API response at runtime. Treat external input as unknown and check its shape before using it."
status: "published"
kind: "knowledge"
level: "intermediate"
prerequisites: ["Understand JavaScript objects and arrays", "Read basic TypeScript types"]
objectives: ["Separate static types from runtime checks", "Narrow unknown values safely"]
sources: ["https://www.typescriptlang.org/docs/handbook/2/narrowing.html"]
---

## Quick answer

TypeScript checks code during development; a type assertion does not inspect an API response at runtime. Treat external input as unknown and check its shape before using it.

## Build a small example

```ts
function readTitle(value: unknown): string | null {
  if (typeof value !== 'object' || value === null) return null;
  if (!('title' in value)) return null;
  return typeof value.title === 'string' ? value.title : null;
}
```

This checks only the title field. A production parser needs to validate every field the application relies on, including meaningful limits and allowed values.

## Try it yourself

Pass null, an empty object, a numeric title, an empty string and a valid title. Decide whether an empty title should be accepted for your feature. Encode that decision explicitly.

## Common mistake

Writing “as Project” can silence a compiler error while leaving malformed data untouched. Type assertions are statements to the compiler, not runtime evidence.

## Check your understanding

Why check null separately? JavaScript reports typeof null as object. A broad object check alone cannot establish that reading a property is safe.

## Next step

Apply the same boundary thinking to form input and [API loading states](/knowledge/fetch-loading-error-empty-states).

## Sources and further reading

- [TypeScript Handbook: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

Published 2 November 2026. Examples are teaching exercises, not claims about client results.
