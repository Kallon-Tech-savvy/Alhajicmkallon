import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { getArticleBySlug, JOURNAL_ENTRIES } from '@/lib/content';
import { MarkdownContent } from '@/components/MarkdownContent';
import { serializeJsonLd } from '@/lib/serialize-json-ld';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return JOURNAL_ENTRIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.kind !== 'journal') return { title: 'Writing not found' };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/writing/${article.slug}` },
    openGraph: { title: article.title, description: article.excerpt, type: 'article' },
  };
}

export default async function ArticleTemplate({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.kind !== 'journal') notFound();

  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-accent/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        url: `https://alhajikallon.com/writing/${article.slug}`,
        author: { '@id': 'https://alhajikallon.com/#person' },
        publisher: { '@id': 'https://alhajikallon.com/#person' },
        keywords: article.topics,
        inLanguage: 'en',
        isPartOf: { '@id': 'https://alhajikallon.com/#website' },
      }) }} />
      <Navbar />
      <section className="page-intro site-gutter border-b border-border">
        <div className="max-w-4xl mx-auto">
          <Link href="/writing" className="inline-flex items-center gap-2 text-accent font-display font-black text-xs uppercase tracking-widest mb-12 hover:text-ivory transition-colors">
            <ArrowLeft size={14} /> Back to Writing
          </Link>
          <Reveal variant="up">
            <div className="text-accent font-display text-xs font-bold uppercase tracking-widest mb-5">{article.category}</div>
            <h1 className="page-title font-display font-bold tracking-tight mb-8 leading-tight">{article.title}</h1>
            <p className="text-muted text-lg md:text-xl font-body leading-relaxed border-l-2 border-accent pl-6">{article.excerpt}</p>
            <div className="mt-6 text-muted font-display text-xs uppercase tracking-widest">{article.date}{article.readTime ? ` · ${article.readTime}` : ''}</div>
          </Reveal>
        </div>
      </section>
      <section className="section-space site-gutter">
        <article className="max-w-3xl mx-auto font-body text-base md:text-lg"><MarkdownContent source={article.content} /></article>
      </section>
      <Footer />
    </main>
  );
}
