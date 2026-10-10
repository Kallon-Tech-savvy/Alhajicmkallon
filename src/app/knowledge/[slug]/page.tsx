import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { getArticleBySlug, KNOWLEDGE_ENTRIES } from '@/lib/content';

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return KNOWLEDGE_ENTRIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const entry = getArticleBySlug(slug);
  if (!entry || entry.kind !== 'knowledge') return { title: 'Knowledge note not found' };
  return {
    title: entry.title,
    description: entry.excerpt,
    alternates: { canonical: `/knowledge/${entry.slug}` },
    openGraph: { title: entry.title, description: entry.excerpt, type: 'article' },
  };
}

export default async function KnowledgeEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getArticleBySlug(slug);
  if (!entry || entry.kind !== 'knowledge') notFound();
  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-gold/30">
      <Navbar />
      <section className="pt-40 pb-14 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <Link href="/knowledge" className="inline-flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest mb-10"><ArrowLeft size={14} /> Back to Knowledge Hub</Link>
          <Reveal variant="up"><p className="text-gold text-xs uppercase tracking-widest mb-5">{entry.category}</p><h1 className="font-space text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-7">{entry.title}</h1><p className="text-muted text-lg leading-relaxed">{entry.excerpt}</p></Reveal>
        </div>
      </section>
      <section className="px-6 py-14"><article className="max-w-3xl mx-auto prose prose-invert font-inter text-base md:text-lg leading-relaxed whitespace-pre-wrap">{entry.content}</article></section>
      <Footer />
    </main>
  );
}
