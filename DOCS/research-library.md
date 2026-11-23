# Research library — editorial and maintenance guide

Route: `/library`

## Purpose
Help visitors discover reliable starting points for research, brainstorming, study, articles and technical writing. This is a curated directory, not a research search engine or a claim that every linked document has been verified.

## Data model
Edit `src/lib/research-library.ts`. The collection is a lightweight, statically imported index; no database, third-party API keys or paid service are required. Each record contains:
- Category and source kind (what a resource is, not a quality score)
- Original publisher, full HTTPS URL and page title
- One specific use, one limitation and one generative study question
- Searchable topic tags

Always prefer an original publisher, standards organisation, national statistics office, institution or reputable open resource. Do not republish copyrighted full texts.

## Source curation protocol
1. Open the original page. Confirm that its title, publisher, topic and destination match the entry.
2. Explain **what it can actually be used for**. A methods page, preprint archive or documentation site is not evidence for a separate factual assertion.
3. State a meaningful limitation. Assess dates, sample, research method, conflicting interests, coverage, update practices and whether an item was peer-reviewed.
4. Use direct, stable links. Avoid tracking parameters, paywall-only destinations when a reliable open source exists, and unverified AI-generated references.
5. If replacing or adding an entry, update the reviewed date only for a genuine editorial review of the linked pages. Do not label anything independently validated solely because its home page loaded.
6. Confirm research citations at **the exact claim level** before publication, including the original publication date and section/table.
7. Do not attach arbitrary credibility scores. The provenance and methodological limits are more useful than an unexplained rating.

`LIBRARY_REVIEW_DATE` describes the list's editorial review, **not** the publication or last-update date of a linked source.

## UX and privacy
- The source index renders without remote calls. Search and filters run in the browser.
- Reading-list IDs are saved in that browser's localStorage only, with no account or cross-device sync. If storage fails, browsing remains available.
- Questions typed into the research-brief workbench are not sent to the server, saved or analysed; the copy button puts a Markdown template into the user's clipboard when permitted.
- External links are marked as new-tab and use `noopener noreferrer`.
- No automatic content scraping, AI summaries, citation fabrication, user analytics or email capture is part of this feature.

## Maintenance and testing
Run:
```bash
npm run test:content
npm run typecheck
npm run lint
npm run format:check
npm run test:boundaries
```

The integrity test in `scripts/research-library.test.mjs` checks duplicates, HTTPS links, required fields and category coverage **offline**. It does not certify that websites stay reachable. Revisit links and claims periodically using the original publishers.

## Possible future improvements
Only after evidence of demand: a structured source submission review workflow, a periodic broken-link report, export of a browser reading list and topic-specific reading paths. Avoid full-papers ingestion or account login without clear user need.
