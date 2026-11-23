'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  LIBRARY_CATEGORIES,
  type LibraryCategory,
  type ResearchResource,
} from '@/lib/research-library';

type WorkMode = 'Article' | 'Technical writing' | 'Study';

const MODES: Record<WorkMode, readonly string[]> = {
  Article: [
    'What question am I really exploring, and why does it matter to readers?',
    'What is my initial argument? Mark it as a hypothesis rather than a fact.',
    'What primary evidence and alternative interpretations do I need?',
    'Which counterargument would most seriously challenge my position?',
    'What should the reader understand, question or do differently?',
  ],
  'Technical writing': [
    'Who is the reader, and what must they be able to do?',
    'What prerequisites, system boundaries and assumptions must I state?',
    'What do authoritative documentation and standards actually require?',
    'What is the minimal reproducible example, including failures and recovery?',
    'How will I verify every command, version and technical claim?',
  ],
  Study: [
    'What concept am I trying to understand, not just memorise?',
    'What foundational idea must I learn first?',
    'How would I explain it without jargon or looking at the source?',
    'What contrasting example, failure case or counterexample tests my understanding?',
    'What small exercise would show that I can apply it?',
  ],
};

const FILTER_ALL = 'All topics';

function sourceNote(resource: ResearchResource) {
  return [
    '# Source note',
    '',
    `Title: ${resource.title}`,
    `Publisher: ${resource.publisher}`,
    `Source: ${resource.url}`,
    `Accessed: ${new Date().toISOString().slice(0, 10)}`,
    `Source type: ${resource.kind}`,
    '',
    `Potential use: ${resource.use}`,
    `Check before citing: ${resource.caution}`,
    `Question to investigate: ${resource.question}`,
    '',
    'Claim I want to support:',
    'Exact section, page, data table or passage:',
    'What the source actually establishes:',
    'Alternative evidence or counterargument:',
    'My interpretation (separate from the source):',
  ].join('\n');
}

function researchBrief(question: string, mode: WorkMode) {
  return [
    `# ${mode} research brief`,
    '',
    `Working question: ${question.trim() || '[Write your research question]'}`,
    '',
    '## Questions to work through',
    ...MODES[mode].map((item, i) => `${i + 1}. ${item}`),
    '',
    '## Evidence table',
    '| Claim | Original source and date | What it establishes | Limitations |',
    '| --- | --- | --- | --- |',
    '| | | | |',
    '',
    '## Thinking notes',
    'What I observed:',
    'What I inferred:',
    'What I still assume:',
    'What would change my mind:',
    '',
    '## Before publishing',
    '- [ ] Trace important factual claims to their original source.',
    '- [ ] Verify the scope, dates and methods of any statistics.',
    '- [ ] Describe uncertainty and important counterarguments.',
    '- [ ] Test technical examples against the stated version.',
    '- [ ] Give credit and link to the material actually used.',
  ].join('\n');
}

export function ResearchLibrary({ resources }: { resources: readonly ResearchResource[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(FILTER_ALL);
  const [kind, setKind] = useState('All source types');
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<readonly string[]>([]);
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<WorkMode>('Article');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('research-library-saved-v1');
      const ids: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(ids)) {
        setSaved(ids.filter((id): id is string => typeof id === 'string'));
      }
    } catch {
      // Storage can be unavailable; browsing and copying still work.
    }
  }, []);

  const kinds = useMemo(
    () => ['All source types', ...Array.from(new Set(resources.map((r) => r.kind))).sort()],
    [resources],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return resources.filter((resource) => {
      if (category !== FILTER_ALL && resource.category !== category) return false;
      if (kind !== 'All source types' && resource.kind !== kind) return false;
      if (savedOnly && !saved.includes(resource.id)) return false;
      return (
        !term ||
        [
          resource.title,
          resource.publisher,
          resource.kind,
          resource.category,
          resource.use,
          resource.caution,
          resource.question,
          ...resource.tags,
        ].some((value) => value.toLocaleLowerCase().includes(term))
      );
    });
  }, [resources, query, category, kind, savedOnly, saved]);

  function toggleSaved(id: string) {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
    setSaved(next);
    try {
      window.localStorage.setItem('research-library-saved-v1', JSON.stringify(next));
    } catch {
      setNotice('Saving is unavailable in this browser. Your current selections still work.');
    }
  }

  async function copy(value: string, description: string) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      setNotice(`${description} copied. You can paste it into your notes.`);
    } catch {
      setNotice('Copy is unavailable. Try again on HTTPS or open the source directly.');
    }
  }

  return (
    <>
      <section aria-labelledby="workbench-heading" className="border-b border-border py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-12">
          <div>
            <p className="editorial-kicker text-accent">01 / Start with a question</p>
            <h2 id="workbench-heading" className="mt-3 text-3xl font-medium tracking-tight">
              Turn curiosity into a research brief.
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              A useful first step before searching: define what you want to learn, which evidence
              could matter, and what might challenge your initial view.
            </p>
            <p className="mt-3 text-sm text-muted">
              Nothing is sent to a server. This simply creates a structured note you can copy.
            </p>
          </div>
          <div className="border border-border bg-surface p-5 sm:p-7">
            <label htmlFor="research-mode" className="block text-sm font-medium">
              What are you working on?
            </label>
            <select
              id="research-mode"
              className="ui-field mt-2 w-full"
              value={mode}
              onChange={(event) => setMode(event.target.value as WorkMode)}
            >
              {(Object.keys(MODES) as WorkMode[]).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <label htmlFor="research-question" className="mt-5 block text-sm font-medium">
              Your working question
            </label>
            <textarea
              id="research-question"
              rows={3}
              maxLength={500}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="For example: Are we becoming more intelligent, or simply better assisted?"
              className="ui-field mt-2 w-full"
            />
            <button
              type="button"
              onClick={() => void copy(researchBrief(question, mode), 'Research brief')}
              className="ui-primary mt-4 inline-flex min-h-11 items-center justify-center px-5"
            >
              Copy my research brief
            </button>
            <details className="mt-5 border-t border-border pt-4">
              <summary className="text-sm font-medium text-accent">
                See the questions in this brief
              </summary>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
                {MODES[mode].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </details>
          </div>
        </div>
      </section>

      <section aria-labelledby="sources-heading" className="py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="editorial-kicker text-accent">02 / Find and examine</p>
            <h2 id="sources-heading" className="mt-3 text-3xl font-medium tracking-tight">
              Source library.
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              Original publishers, documented methods and useful starting points. Each entry
              explains what to use it for, what not to assume, and a question to explore.
            </p>
          </div>
          <p className="font-mono text-xs text-muted">{resources.length} curated resources</p>
        </div>

        <div className="border-y border-border bg-surface/60 px-4 py-5 sm:px-6">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <label htmlFor="source-search" className="mb-2 block text-sm font-medium">
                Search sources and questions
              </label>
              <input
                id="source-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Evidence, intelligence, API, Sierra Leone…"
                className="ui-field w-full"
              />
            </div>
            <div>
              <label htmlFor="source-topic" className="mb-2 block text-sm font-medium">
                Topic
              </label>
              <select
                id="source-topic"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="ui-field w-full"
              >
                <option value={FILTER_ALL}>{FILTER_ALL}</option>
                {LIBRARY_CATEGORIES.map((item: LibraryCategory) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="source-type" className="mb-2 block text-sm font-medium">
                Source type
              </label>
              <select
                id="source-type"
                value={kind}
                onChange={(event) => setKind(event.target.value)}
                className="ui-field w-full"
              >
                {kinds.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={savedOnly}
                onChange={(event) => setSavedOnly(event.target.checked)}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              My reading list ({saved.length})
            </label>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory(FILTER_ALL);
                setKind('All source types');
                setSavedOnly(false);
              }}
              className="min-h-11 px-2 text-sm text-accent underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        </div>

        <p role="status" className="mt-5 text-sm text-muted" aria-live="polite">
          Showing {filtered.length} of {resources.length} resources.
        </p>
        {notice && (
          <p role="status" className="mt-2 text-sm text-accent" aria-live="polite">
            {notice}
          </p>
        )}

        {filtered.length ? (
          <ul className="mt-5 grid gap-4 lg:grid-cols-2">
            {filtered.map((resource) => (
              <li
                key={resource.id}
                className="flex min-w-0 flex-col border border-border bg-surface p-5 sm:p-6"
              >
                <article className="flex h-full flex-col">
                  <p className="editorial-kicker text-accent">
                    {resource.category} <span className="px-1 text-muted">/</span> {resource.kind}
                  </p>
                  <h3 className="mt-3 text-xl font-medium leading-snug tracking-tight">
                    {resource.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{resource.publisher}</p>
                  <p className="mt-4 text-sm leading-relaxed">{resource.use}</p>
                  <p className="mt-4 border-l-2 border-accent pl-3 text-sm leading-relaxed text-muted">
                    <span className="font-medium text-ivory">Explore:</span> {resource.question}
                  </p>
                  <details className="mt-4 text-sm text-muted">
                    <summary className="inline-block text-accent underline underline-offset-4">
                      What to check before citing
                    </summary>
                    <p className="mt-2">{resource.caution}</p>
                  </details>
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5 text-sm">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4"
                    >
                      Open original source ↗<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => void copy(sourceNote(resource), 'Source note')}
                      className="min-h-11 font-medium text-accent underline underline-offset-4"
                    >
                      Copy source note
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSaved(resource.id)}
                      aria-pressed={saved.includes(resource.id)}
                      className="min-h-11 font-medium text-accent underline underline-offset-4"
                    >
                      {saved.includes(resource.id) ? 'Remove saved' : 'Save for reading'}
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 border border-border p-8 text-muted" role="status">
            No resources match the filters. Try another topic or clear the filters.
          </div>
        )}
        <p className="mt-5 max-w-3xl text-xs leading-relaxed text-muted">
          Saved sources stay only in this browser when storage is available; they do not sync to an
          account. The index is curated, not an automated academic search engine. A publisher’s
          authority is not a substitute for checking the original evidence.
        </p>
      </section>
    </>
  );
}
