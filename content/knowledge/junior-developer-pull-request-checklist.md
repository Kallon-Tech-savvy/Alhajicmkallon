---
slug: "junior-developer-pull-request-checklist"
title: "What should a junior developer check before opening a pull request?"
category: "Delivery practice"
topics: ["Git", "code review", "workflow"]
date: "2026-11-02"
readTime: "4 min with practice"
excerpt: "Before opening a pull request, compare the change with the intended behaviour, inspect the diff, run relevant checks and explain what a reviewer should verify. A small coherent change is easier to assess than unrelated cleanup mixed with a feature."
status: "published"
kind: "knowledge"
level: "junior"
prerequisites: ["Make a commit on a feature branch"]
objectives: ["Review the staged change", "Describe behaviour and validation"]
sources: ["https://git-scm.com/docs/git-diff"]
---

## Quick answer

Before opening a pull request, compare the change with the intended behaviour, inspect the diff, run relevant checks and explain what a reviewer should verify. A small coherent change is easier to assess than unrelated cleanup mixed with a feature.

## Inspect the change

Use git diff to inspect unstaged tracked changes and git diff --cached to inspect staged changes. Neither replaces checking git status for new untracked files.

```sh
git status --short
git diff
git diff --cached
```

Look for accidental generated files, credentials, debug output and unrelated edits. Do not paste secret values into a review description or test log.

## Try it yourself

Write a three-sentence review note: the problem, the resulting behaviour and the checks you ran. Include a concrete before-and-after example when behaviour changed.

## Common mistake

“Tests pass” is incomplete evidence when no test covers the changed path. Name the behaviour exercised, and disclose checks you could not run.

## Check your understanding

Would you include a formatting rewrite of every file in a small bug fix? Usually defer it so the behavioural change remains visible.

## Next step

Use [the feature completion guide](/knowledge/when-is-a-feature-done) before requesting approval.

## Sources and further reading

- [Git documentation: git diff](https://git-scm.com/docs/git-diff)

Published 2 November 2026. Examples are teaching exercises, not claims about client results.
