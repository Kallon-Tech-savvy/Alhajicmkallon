import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NewsletterCTA } from '@/components/NewsletterCTA';
import { ArticleFilters } from '@/components/ArticleFilters';
import { JOURNAL_ENTRIES } from '@/lib/content';

export const metadata = {
  title: 'Writing & Ideas',
  description: 'Essays and reflections on design, technology, and building useful digital systems.',
  alternates: { canonical: '/writing' },
};

export default function WritingPage() {
  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-accent/30">
      <Navbar />
      <section className="page-intro site-gutter relative overflow-hidden">
        <div className="max-w-[var(--layout-max)] mx-auto relative z-10">
          <span className="font-display text-accent text-xs font-bold tracking-[0.16em] uppercase mb-6 block">Journal & Reflections</span>
          <h1 className="page-title font-display tracking-tighter mb-10 uppercase">WRITING & <br /><span className="text-gradient">IDEAS</span></h1>
          <p className="max-w-2xl text-muted text-lg font-body leading-relaxed">A growing collection of essays and considered notes. Only published entries are searchable and visible.</p>
        </div>
        <div aria-hidden="true" className="absolute top-1/2 left-0 text-white/[0.01] font-display text-[30vw] font-black leading-none pointer-events-none select-none -translate-x-1/4">THINK</div>
      </section>
      <section className="section-space site-gutter pb-24">
        <div className="max-w-[var(--layout-max)] mx-auto"><ArticleFilters entries={JOURNAL_ENTRIES.map(({ slug, title, excerpt, category, date, topics }) => ({ slug, title, excerpt, category, date, topics }))} /></div>
      </section>
      <NewsletterCTA />
      <Footer />
    </main>
  );
}
