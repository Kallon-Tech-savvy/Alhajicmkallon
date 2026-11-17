import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { SubstackWriting } from '@/components/SubstackWriting';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NewsletterCTA } from '@/components/NewsletterCTA';
import { ArticleFilters } from '@/components/ArticleFilters';
import { JOURNAL_ENTRIES } from '@/packages/content/server';
import { SUBSTACK_URL } from '@/lib/public-channels';

const description =
  'Notes and essays by design engineer Alhaji C.M. Kallon on design, technology and the decisions behind building useful digital products.';

export const metadata: Metadata = {
  title: 'Writing: notes and essays',
  description,
  alternates: { canonical: '/writing' },
  // Do not index an empty on-site journal while it is only an external reading hub.
  robots: JOURNAL_ENTRIES.length ? undefined : { index: false, follow: true },
  openGraph: {
    title: 'Writing: notes and essays | Alhaji C.M. Kallon',
    description,
    url: 'https://alhajikallon.com/writing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writing: notes and essays | Alhaji C.M. Kallon',
    description,
  },
};

export default function WritingPage() {
  const hasNotes = JOURNAL_ENTRIES.length > 0;
  const newestNote = [...JOURNAL_ENTRIES]
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-accent/30">
      <Navbar />
      <section className="page-intro site-gutter relative overflow-hidden">
        <div className="max-w-[var(--layout-max)] mx-auto relative z-10">
          <span className="font-display text-accent text-xs font-bold tracking-normal mb-6 block">Writing</span>
          <h1 className="page-title font-display mb-6">
            Notes from<br /><span>the work.</span>
          </h1>
          <p className="max-w-2xl text-muted text-lg font-body leading-relaxed">
            {hasNotes
              ? 'A growing collection of notes on product decisions, design and engineering, with the reasoning left visible.'
              : 'Short notes on product decisions, design and engineering, written with the reasoning left visible. The first ones are on their way.'}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Notes on this site explore building useful products. Essays on Substack explore technology and society.
          </p>
        </div>
      </section>
      <section className="section-space site-gutter pb-16">
        <div className="max-w-[var(--layout-max)] mx-auto">
          <h2 className="mb-6 text-2xl font-medium">Notes on this site</h2>
          <ArticleFilters
            entries={JOURNAL_ENTRIES.map(({ slug, title, excerpt, category, date, topics }) => ({
              slug, title, excerpt, category, date, topics,
            }))}
          />
          {!hasNotes && (
            <p className="mt-4 text-sm text-muted">
              In the meantime, <a className="text-accent underline underline-offset-4" href={SUBSTACK_URL}>
                read my essays on Substack ↗
              </a>.
            </p>
          )}
        </div>
      </section>
      <Suspense fallback={
        <section className="section-space site-gutter" aria-label="Loading recent Substack essays">
          <p className="text-muted">Loading recent essays…</p>
        </section>
      }>
        <SubstackWriting />
      </Suspense>
      <NewsletterCTA latestNoteHref={newestNote ? `/writing/${newestNote.slug}` : undefined} />
      <Footer showInvitation={false} />
    </main>
  );
}
