import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NewsletterCTA } from '@/components/NewsletterCTA';
import { ArticleFilters } from '@/components/ArticleFilters';

export const metadata = {
  title: 'Writing & Ideas',
  description: 'Essays and reflections on design, technology, and building useful digital systems.',
  alternates: { canonical: '/writing' },
};

export default function WritingPage() {
  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-gold/30">
      <Navbar />
      <section className="pt-48 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6 block">Journal & Reflections</span>
          <h1 className="font-space text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] uppercase">WRITING & <br /><span className="text-gradient">IDEAS</span></h1>
          <p className="max-w-2xl text-muted text-lg font-inter leading-relaxed">A growing collection of essays and considered notes. Only published entries are searchable and visible.</p>
        </div>
        <div aria-hidden="true" className="absolute top-1/2 left-0 text-white/[0.01] font-space text-[30vw] font-black leading-none pointer-events-none select-none -translate-x-1/4">THINK</div>
      </section>
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto"><ArticleFilters /></div>
      </section>
      <NewsletterCTA />
      <Footer />
    </main>
  );
}
