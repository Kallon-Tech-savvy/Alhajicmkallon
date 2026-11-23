import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ResearchLibrary } from '@/components/ResearchLibrary';
import { LIBRARY_REVIEW_DATE, RESEARCH_RESOURCES } from '@/lib/research-library';
import { serializeJsonLd } from '@/lib/serialize-json-ld';

const title = 'Research library: sources for essays, study and technical writing';
const description =
  'A curated, searchable research library for philosophy, society, research methods, design, software engineering, AI, writing, and Sierra Leone and Africa.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/library' },
  openGraph: {
    title: `${title} | Alhaji C.M. Kallon`,
    description,
    url: 'https://alhajikallon.com/library',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title, description },
};

const questions = [
  {
    step: '01',
    title: 'Define the question',
    description: 'What do you want to understand? Start with a specific, falsifiable question where possible.',
  },
  {
    step: '02',
    title: 'Find the original',
    description: 'Prefer the study, technical standard or dataset behind a summary. Read its methods and context.',
  },
  {
    step: '03',
    title: 'Test your interpretation',
    description: 'Separate observations from inferences, look for rival explanations, and record uncertainty.',
  },
  {
    step: '04',
    title: 'Write with evidence',
    description: 'Link each important claim to the specific source that supports it. Keep your voice your own.',
  },
] as const;

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-midnight text-ivory">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: title,
            description,
            url: 'https://alhajikallon.com/library',
            dateModified: LIBRARY_REVIEW_DATE,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: RESEARCH_RESOURCES.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.title,
                url: item.url,
              })),
            },
          }),
        }}
      />
      <header className="page-intro site-gutter">
        <div className="mx-auto max-w-[var(--layout-max)]">
          <p className="editorial-kicker text-accent">Source library · Read, question, build</p>
          <h1 className="page-title mt-5 max-w-5xl">
            Curiosity needs <span>good sources.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
            Research for articles, technical writing and independent study. Find a useful
            starting point, examine what it supports, and develop your own understanding.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <a href="#workbench-heading" className="editorial-link">
              Start a research brief ↓
            </a>
            <a href="#sources-heading" className="editorial-link">
              Browse sources ↓
            </a>
            <Link prefetch={false} href="/writing" className="editorial-link">
              Read my writing ↗
            </Link>
          </div>
        </div>
      </header>
      <div className="site-container">
        <section className="border-b border-border py-12" aria-labelledby="method-heading">
          <p className="editorial-kicker text-accent">How to use this library</p>
          <h2 id="method-heading" className="mt-3 text-2xl font-medium">
            From a question to a defensible draft.
          </h2>
          <ol className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {questions.map((item) => (
              <li key={item.step} className="border-t border-border pt-4">
                <span className="font-mono text-xs text-accent">{item.step}</span>
                <h3 className="mt-3 text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </li>
            ))}
          </ol>
        </section>
        <ResearchLibrary resources={RESEARCH_RESOURCES} />
        <aside className="mb-12 border-t border-border py-10 text-sm leading-relaxed" aria-labelledby="curation-heading">
          <h2 id="curation-heading" className="text-xl font-medium">How the sources are selected</h2>
          <p className="mt-3 max-w-3xl text-muted">
            This is a deliberately small, editorially selected list of real publishers,
            research repositories, universities, standards bodies and public data institutions.
            Entries favour authoritative starting points, useful explanations and source
            traceability, not popularity. Being included does not endorse every claim on
            an external site.
          </p>
          <p className="mt-3 max-w-3xl text-muted">
            The listed source pages and their publishers were reviewed on{' '}
            <time dateTime={LIBRARY_REVIEW_DATE}>23 November 2026</time>. Publication
            dates and individual findings should still be checked on the original pages.
            Archives such as arXiv may contain unreviewed preprints, while reference
            pages and frameworks are not experimental findings.
          </p>
          <p className="mt-4 text-muted">
            Found a broken link, error or important missing perspective?{' '}
            <Link prefetch={false} href="/contact" className="font-medium text-accent underline underline-offset-4">
              Suggest a source or correction
            </Link>.
          </p>
        </aside>
      </div>
      <Footer showInvitation={false} />
    </main>
  );
}
