import React from 'react';
import Image from 'next/image';
import { SUBSTACK_URL, SUBSTACK_ARTICLE_URLS } from '@/lib/public-channels';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { getArticleBySlug, JOURNAL_ENTRIES } from '@/packages/content/server';
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
    openGraph: { title: article.title, description: article.excerpt, type: 'article', publishedTime: article.date, ...(article.cover ? { images: [{ url: article.cover.src, width: article.cover.width, height: article.cover.height, alt: article.cover.alt }] } : {}) },
    twitter: { card: 'summary_large_image', title: article.title, description: article.excerpt, ...(article.cover ? { images: [article.cover.src] } : {}) },
  };
}

export default async function ArticleTemplate({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.kind !== 'journal') notFound();

  const substackArticleUrl = SUBSTACK_ARTICLE_URLS[article.slug];

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
        datePublished: article.date,
        ...(article.cover ? { image: `https://alhajikallon.com${article.cover.src}` } : {}),
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
            <div className="mt-6 text-muted font-display text-xs uppercase tracking-widest">By Alhaji C.M. Kallon · <time dateTime={article.date}>{article.date}</time>{article.readTime ? ` · ${article.readTime}` : ''}</div>
          </Reveal>
        </div>
      </section>
      {article.cover && <section className="site-gutter pt-10" aria-label="Article cover"><figure className="mx-auto max-w-xl"><Image src={article.cover.src} alt={article.cover.alt} width={article.cover.width} height={article.cover.height} sizes="(max-width: 640px) calc(100vw - 2.5rem), 576px" className="h-auto w-full rounded-xl" /></figure></section>}
      <section className="section-space site-gutter">
        <article className="max-w-3xl mx-auto font-body text-base md:text-lg"><MarkdownContent source={article.content} /></article>
      </section>
      <aside className="site-gutter border-t border-border py-10" aria-label="More writing"><div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-5"><Link href="/writing" className="editorial-link">More writing on this site →</Link><a href={substackArticleUrl ?? SUBSTACK_URL} className="editorial-link">{substackArticleUrl ? 'Read on Substack ↗' : 'Read my Substack ↗'}</a></div></aside>
      <Footer />
    </main>
  );
}
