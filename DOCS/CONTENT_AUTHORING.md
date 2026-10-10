# Content platform authoring guide

## Current publishing contract

The public catalogue is defined in `src/lib/content.ts`. Public pages, search, and sitemap entries must use its published exports rather than independently assembling content. Entries marked `draft` must never be included in public lists, search results, metadata generation, or sitemap output.

The current catalogue is intentionally empty. Do not add sample client names, project results, personal achievements, metrics, testimonials, or publication dates unless the owner has supplied and approved them.

## Adding an entry

Add an authored entry to the appropriate catalogue with:
- A stable lowercase hyphenated `slug` (unique within its content type).
- A descriptive title and concise summary/excerpt.
- A category and relevant topics.
- An explicit `status` of `draft` or `published`.
- A journal/knowledge `kind` for articles.
- A date only when the publication date is known.
- Links and technology labels only when they are real and verified.

Keep content focused on one useful idea. Use headings, short paragraphs, examples, and sources where appropriate. Distinguish facts, personal opinions, hypotheses, and recommendations. Do not publish private client or personal information.

## Review checklist

Before setting an entry to `published`:
1. Verify factual claims and links.
2. Confirm the slug is stable and unique.
3. Check that the correct category/kind is selected.
4. Confirm there are no unsupported impact or readership claims.
5. Preview the index, detail page, search result, metadata, and sitemap behavior.
6. Run lint and production build checks.

## Markdown/MDX status

Markdown/MDX file loading and rendering is not yet wired into the application. Until that pipeline is implemented, catalogue content is authored as typed TypeScript data. Do not assume files placed in a content folder will automatically become public pages.
