import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { getArticleBySlug, KNOWLEDGE_ENTRIES } from '@/lib/content';
import { MarkdownContent } from '@/components/MarkdownContent';
import { serializeJsonLd } from '@/lib/serialize-json-ld';

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: entry.title,
        description: entry.excerpt,
        url: `https://alhajikallon.com/knowledge/${entry.slug}`,
        creator: { '@id': 'https://alhajikallon.com/#person' },
        learningResourceType: 'Practical guide',
        educationalLevel: entry.level,
        teaches: entry.objectives,
        citation: entry.sources,
        datePublished: entry.date,
        author: { '@id': 'https://alhajikallon.com/#person' },
        keywords: entry.topics,
        inLanguage: 'en',
        isPartOf: { '@id': 'https://alhajikallon.com/#website' },
      }) }} />
      <Navbar />
      <section className="pt-40 pb-14 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <Link href="/knowledge" className="inline-flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest mb-10"><ArrowLeft size={14} /> Back to Knowledge Hub</Link>
          <Reveal variant="up"><p className="text-gold text-xs uppercase tracking-widest mb-5">{entry.category}</p><h1 className="font-space text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-7">{entry.title}</h1><p className="text-muted text-lg leading-relaxed">{entry.excerpt}</p></Reveal>
        </div>
      </section>
      <section className="px-6 py-8 border-b border-white/10"><div className="mx-auto max-w-4xl grid gap-7 md:grid-cols-2"><div><p className="text-sm text-[#C0C9D5]">By Alhaji C. M. Kallon · <time dateTime={entry.date}>{entry.date}</time> · {entry.level} · {entry.readTime}</p><h2 className="mt-5 mb-2 font-semibold">Before you start</h2><ul className="list-disc pl-5 text-sm text-[#C0C9D5]">{entry.prerequisites?.map((item) => <li key={item}>{item}</li>)}</ul><h2 className="mt-5 mb-2 font-semibold">What you will practise</h2><ul className="list-disc pl-5 text-sm text-[#C0C9D5]">{entry.objectives?.map((item) => <li key={item}>{item}</li>)}</ul></div><nav aria-label="On this page"><h2 className="mb-3 font-semibold">On this page</h2><ul className="space-y-2 text-sm">{[...entry.content.matchAll(/^## (.+)$/gm)].map((match) => <li key={match[1]}><a className="text-[#A8C9FF] underline underline-offset-4" href={'#' + match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}>{match[1]}</a></li>)}</ul></nav></div></section>
      <section className="px-6 py-14"><article className="max-w-3xl mx-auto font-inter text-base md:text-lg"><MarkdownContent source={entry.content} /></article></section>
      <Footer />
    </main>
  );
}
