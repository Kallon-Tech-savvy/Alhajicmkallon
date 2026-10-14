import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { getArticleBySlug, ARTICLES } from '@/lib/content';
import { MarkdownContent } from '@/components/MarkdownContent';
import { serializeJsonLd } from '@/lib/serialize-json-ld';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ARTICLES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Writing not found' };
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
  if (!article) notFound();

  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-gold/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        url: `https://alhajicmkallon.vercel.app/writing/${article.slug}`,
        author: { '@id': 'https://alhajicmkallon.vercel.app/#person' },
        publisher: { '@id': 'https://alhajicmkallon.vercel.app/#person' },
        keywords: article.topics,
        inLanguage: 'en',
        isPartOf: { '@id': 'https://alhajicmkallon.vercel.app/#website' },
      }) }} />
      <Navbar />
      <section className="pt-40 pb-16 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <Link href="/writing" className="inline-flex items-center gap-2 text-gold font-space font-black text-xs uppercase tracking-widest mb-12 hover:text-ivory transition-colors">
            <ArrowLeft size={14} /> Back to Writing
          </Link>
          <Reveal variant="up">
            <div className="text-gold font-space text-xs font-bold uppercase tracking-widest mb-5">{article.category}</div>
            <h1 className="font-space text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">{article.title}</h1>
            <p className="text-muted text-lg md:text-xl font-inter leading-relaxed border-l-2 border-gold pl-6">{article.excerpt}</p>
            <div className="mt-6 text-muted font-space text-xs uppercase tracking-widest">{article.date}{article.readTime ? ` · ${article.readTime}` : ''}</div>
          </Reveal>
        </div>
      </section>
      <section className="py-16 px-6">
        <article className="max-w-3xl mx-auto font-inter text-base md:text-lg"><MarkdownContent source={article.content} /></article>
      </section>
      <Footer />
    </main>
  );
}
