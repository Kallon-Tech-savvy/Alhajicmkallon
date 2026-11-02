---
slug: "when-is-a-feature-done"
title: "When is a frontend feature ready for review?"
category: "Product delivery"
topics: ["product thinking", "testing", "accessibility"]
date: "2026-11-02"
readTime: "4 min with practice"
excerpt: "A feature is ready for review when its intended journey works, expected failure states are handled and another person can verify the result. A screen that looks finished may still leave visitors unable to complete their task."
status: "published"
kind: "knowledge"
level: "junior"
prerequisites: ["Build a small interactive interface"]
objectives: ["Define observable acceptance criteria", "Check the complete visitor journey"]
sources: ["https://developer.mozilla.org/en-US/curriculum/core/"]
---

## Quick answer

A feature is ready for review when its intended journey works, expected failure states are handled and another person can verify the result. A screen that looks finished may still leave visitors unable to complete their task.

## Start with one outcome

For a contact form, define the outcome as “the visitor can submit an enquiry and understand what happens next.” Then identify required fields, validation messages, submission feedback and a recovery path when delivery fails.

## Try it yourself

Write three observable checks before implementation. For example: a missing email is explained beside the field; a valid request receives clear feedback; a network failure preserves entered text and offers retry.

Test the journey with a keyboard, a narrow viewport and a slow connection. Explain what remains unverified instead of treating a local preview as production evidence.

## Common mistake

A green build proves that a build completed. It does not prove that a message was delivered or that a visitor understood the next step.

## Check your understanding

What evidence supports “the form works”? A controlled submission and verified receipt, plus checks for invalid input and failure recovery, are stronger evidence than a screenshot.

## Next step

Prepare [a reviewable pull request](/knowledge/junior-developer-pull-request-checklist).

## Sources and further reading

- [MDN Curriculum: Core modules](https://developer.mozilla.org/en-US/curriculum/core/)

Published 2 November 2026. Examples are teaching exercises, not claims about client results.
