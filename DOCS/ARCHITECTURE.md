# Architecture and module ownership

The app uses Next.js App Router. Routes compose pages or translate HTTP requests;
packages own policies and implementation details. Import a package's root entry
points only. Any nested folder is private, including `lib/` and `tests/`.

## Chat

| Entry point | Responsibility |
| --- | --- |
| `chat/shared` | Browser-safe message types and shared limits |
| `chat/client` | Conversation state, transport, timeout, cancellation, retry and rollback |
| `chat/server` | Injectable answering service and quota adapters |
| `chat/http` | Origin/content-type/body-size gates and HTTP response translation |
| `chat/runtime` | Server-only configuration, provider wiring and hashed visitor identity |

The route only wires HTTP configuration to the runtime. The service owns validation,
FAQ selection, quota reservations, moderation, context selection and completion.
The provider contract hides the OpenAI SDK. One deadline covers the whole service
operation, including storage and moderation. A request disconnect aborts the same
signal passed to every external call. Failed moderation never reaches completion.

The UI owns focus, panel visibility, dismissal and rendering. The conversation hook
owns request state and restores the previous conversation and question after failure.
Tests use injectable providers and fetchers, not paid API calls or source rewriting.

Knowledge remains a curated editorial summary. When published biographical or
project facts change, review `chat/lib/knowledge.ts` alongside the public pages.
Do not treat manually curated chat answers as an independent source of facts.

## Content

| Entry point | Responsibility |
| --- | --- |
| `content/types` | Browser-safe authored content shapes |
| `content/catalogue` | Create a validated, published-only catalogue |
| `content/server` | Server-only catalogue used by pages, search, sitemap and discovery feeds |

The generator writes `content/lib/generated-content.ts` from `content/` Markdown.
Validation, editorial ordering and ranking are private. Public lists are read-only
in TypeScript. Client components receive selected metadata; article bodies remain
on the server. The production bundle test checks full-text markers in emitted assets.

## Presentation

`src/components/` contains shared UI and page sections. Keep static page composition
on the server. Contact submission is isolated in `ContactForm`, so the contact page
and its site chrome do not become client components merely to host a form.

Use meaningful component boundaries and format changed JSX with Prettier. Avoid
extracting a separate component for every element. Do not introduce broad barrel
exports of private implementation files.

## Checks

TypeScript strict mode applies to all TypeScript source. JavaScript helpers are
not globally checked yet; add checked JSDoc or migrate them when changing their
contracts. Dependency-cruiser is locked in npm and checks package privacy plus
cycles throughout `src/`. `test:boundaries` proves the checker rejects a deliberate
private import and passes again after cleanup. The example package is its fixture.

Prefer observable behavior tests through public entry points. Retain structural
checks where they protect server/client separation and actual production bundle
budgets. Avoid assertions tied to JSX whitespace, variable names or private state.
