# Content Platform Foundation: Audit and Implementation Plan

## Goal

Evolve the existing site into a balanced professional platform for portfolio case studies, writing, and an evergreen knowledge hub while preserving the existing Next.js App Router, TypeScript, Tailwind CSS, and visual identity.

## Repository-grounded audit

### Confirmed issues

- `src/lib/content.ts` contains a project record with empty identity fields and unverified impact claims ("Cut design-to-dev time by 40%" and "Used across 12 digital services"). Do not publish these as factual results without evidence.
- `src/components/FeaturedWork.tsx` renders the project record as a placeholder image and displays a generic "Project 1" label.
- `src/app/work/page.tsx` has its `PROJECTS` import commented out and no rendered project grid.
- `src/app/writing/[slug]/page.tsx` receives a slug but does not look up the article; article metadata is commented out and body content is hard-coded.
- `src/app/writing/page.tsx` renders category buttons and a search input without filtering the list.
- `src/components/GlobalSearch.tsx` searches only the static project/article arrays; Ctrl/Cmd+K calls `onClose()`, so the shortcut does not open search.
- `src/components/NewsletterCTA.tsx` simulates a successful subscription without sending the address to a service. The "500+ readers" claim needs evidence or removal.
- `src/app/page.tsx` mounts `CustomCursor` while `src/app/layout.tsx` also mounts it.
- `src/app/work/page.tsx` and `src/app/writing/page.tsx` pass the placeholder `YOUR_UNICORN_STUDIO_PROJECT_ID`.
- The root `package.json` has no MDX dependencies and the repository root has no visible Next.js MDX configuration file.

### Constraints

- The audit was performed against repository source, not a local install or production browser test.
- No project case-study facts should be invented to fill the empty portfolio.
- No audience, performance, adoption, or business-impact figures should be presented as measured facts without supporting evidence.

## Implementation sequence

### Phase 1 — Stabilize and establish a baseline

1. Run `npm ci`, `npm run lint`, and `npm run build` in a local checkout or CI environment.
2. Record baseline failures before changing dependencies.
3. Remove placeholder integrations and duplicate cursor mounting.
4. Ensure empty portfolio states are intentional and do not show fabricated project cards.
5. Make article routes resolve content by slug and return not-found for unknown slugs.

### Phase 2 — Introduce a typed content model and MDX

1. Add and lock the MDX toolchain using the official Next.js MDX approach.
2. Add `mdx-components.tsx` and the required Next.js configuration.
3. Define typed metadata for articles, knowledge guides, and project case studies.
4. Keep content in Git under `content/writing`, `content/knowledge`, and `content/projects`.
5. Exclude drafts from public pages, search, metadata, and sitemap.
6. Validate required frontmatter and duplicate slugs during build/CI.

### Phase 3 — Complete content routes

- Work index and `/work/[slug]` case-study pages.
- Journal index and `/writing/[slug]` article pages.
- Knowledge index and `/knowledge/[slug]` evergreen guides.
- Shared content cards, topic pages, reading time, related content, and table of contents where useful.
- Functional search and filters across published projects, articles, and guides.

### Phase 4 — Trust, accessibility, and discovery

- Verify each published project and claim with source evidence.
- Add page-specific metadata, canonical URLs, Open Graph data, sitemap, and robots rules.
- Test keyboard use, reduced motion, contrast, semantic structure, responsive layouts, and screen-reader labels.
- Measure performance before making performance claims.
- Connect newsletter forms to a real provider or clearly mark the feature as unavailable.

## First vertical slice acceptance criteria

- One approved MDX article renders from its slug.
- One approved MDX case study renders from its slug and appears on the Work index.
- Unknown slugs return a proper not-found response.
- Draft content is not publicly discoverable.
- Search and topic filtering operate on published content.
- Lint and production build pass.
- No unsupported project metrics or placeholder integration IDs are shown to visitors.

## Decisions requiring owner input

The architecture can be built before these details are supplied, but publication cannot be completed without them:

- Which projects are approved for public presentation?
- For each project: public name, problem, personal role, timeline, stack, live/demo/source links, screenshots, constraints, and verifiable outcomes.
- Which articles and knowledge guides are intended to be public versus draft?
- Whether newsletter signup should be connected to a real email service now or removed until later.
