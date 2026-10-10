# Content platform authoring guide

## Source of truth

Author content as Markdown files in these folders:

- `content/journal/*.md` — journal entries.
- `content/knowledge/*.md` — durable knowledge notes.
- `content/projects/*.md` — project records and case studies.

Each file starts with frontmatter delimited by `---`. The content-index generator validates metadata and writes `src/lib/generated-content.ts`. Do not edit that generated file by hand. `npm run dev` and `npm run build` regenerate it before starting Next.js.

## Article template

```md
---
slug: clear-writing
title: "Clear writing"
category: "Writing"
topics: ["communication", "systems"]
date: "2026-10-10"
excerpt: "A concise description of the article."
status: draft
kind: journal
---

## A useful heading

Write the article in Markdown. Keep claims verifiable and cite sources where appropriate.
```

Use `kind: journal` in `content/journal` and `kind: knowledge` in `content/knowledge`. For projects, use `summary`, `role`, `topics`, and `technologies`; published projects must also provide a verified `publishedAt` date. Array values use JSON-compatible inline syntax, for example `["one", "two"]`. The current parser intentionally supports a small, predictable frontmatter subset rather than arbitrary YAML.

## Publishing safeguards

- Status defaults to `draft`; only entries explicitly marked `published` appear publicly.
- Slugs must be lowercase hyphenated identifiers and unique across all content types.
- Required metadata, dates, body text, folder/kind alignment, and duplicate slugs are validated during generation.
- Drafts are excluded from indexes, search, page metadata generation, and sitemap output.
- Do not add sample client names, project outcomes, personal achievements, metrics, testimonials, or publication claims unless the owner has supplied and approved them.
- Verify every factual claim and link; never publish private client or personal information.

## Markdown support and MDX status

Article and knowledge detail pages render a safe Markdown subset: headings, paragraphs, emphasis, inline code, lists, blockquotes, and HTTP(S) or local links. Raw HTML is not interpreted. MDX is deliberately rejected by the generator until a maintained MDX runtime and its dependency lock are configured; do not rename `.mdx` files to pretend they are supported.

## Verification

Run:

- `npm run test:content` — parser regression tests using Node's built-in test runner.
- `npm run lint`
- `npm run build`

Before publishing, preview the index, detail route, search result, metadata, and sitemap. If local or CI checks are unavailable, do not claim they passed.
