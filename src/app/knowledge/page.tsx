import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { KNOWLEDGE_ENTRIES } from '@/lib/content';

export const metadata = {
  title: 'Knowledge Hub',
  description: 'A library of durable notes, practical frameworks, and technical explanations.',
  alternates: { canonical: '/knowledge' },
};

export default function KnowledgePage() {
  const topics = Array.from(new Set(KNOWLEDGE_ENTRIES.flatMap((entry) => entry.topics)));
  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-gold/30">
      <Navbar />
      <section className="pt-40 pb-20 px-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <Reveal variant="fade" as="span" className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6 block">Knowledge hub</Reveal>
          <Reveal variant="up" as="h1" className="font-space text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-8">IDEAS THAT <span className="text-gradient">COMPOUND</span></Reveal>
          <p className="max-w-2xl text-muted text-lg leading-relaxed">A structured library for explanations, field notes, and reusable ways of thinking. Entries appear here when they are ready to publish.</p>
          {topics.length > 0 && <div className="flex flex-wrap gap-2 mt-8">{topics.map((topic) => <span key={topic} className="border border-white/10 rounded-full px-3 py-1 text-xs text-muted">{topic}</span>)}</div>}
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {KNOWLEDGE_ENTRIES.length ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{KNOWLEDGE_ENTRIES.map((entry) => <Link key={entry.slug} href={`/knowledge/${entry.slug}`} className="group border border-white/10 p-7 hover:border-gold/40 transition-colors"><BookOpen className="text-gold mb-5" size={20} /><p className="text-xs uppercase tracking-widest text-muted mb-3">{entry.category}</p><h2 className="font-space text-2xl font-bold mb-3 group-hover:text-gold">{entry.title}</h2><p className="text-muted leading-relaxed mb-5">{entry.excerpt}</p><span className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-widest">Read note <ArrowUpRight size={14} /></span></Link>)}</div> : <div className="border border-white/10 p-8 md:p-12"><h2 className="font-space text-2xl font-bold mb-4">The library is being prepared</h2><p className="max-w-2xl text-muted leading-relaxed">No knowledge notes are published yet. Drafts and unreviewed material are kept out of the public library.</p></div>}
        </div>
      </section>
      <Footer />
    </main>
  );
}
