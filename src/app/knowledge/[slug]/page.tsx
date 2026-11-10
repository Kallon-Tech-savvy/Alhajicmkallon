import { CourseProgress } from '@/components/CourseProgress';
import React from 'react';
import { ProtocolLessonVisual } from '@/components/ProtocolLessonVisual';
import { ProtocolInfographics } from '@/components/ProtocolInfographics';
import { PROTOCOL_LESSONS } from '@/lib/protocol-course';
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
  const lessonIndex = PROTOCOL_LESSONS.findIndex(lesson => lesson.slug === slug);
  const previous = PROTOCOL_LESSONS[lessonIndex - 1];
  const next = PROTOCOL_LESSONS[lessonIndex + 1];
  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-accent/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: entry.title,
        description: entry.excerpt,
        url: `https://alhajikallon.com/knowledge/${entry.slug}`,
        creator: { '@id': 'https://alhajikallon.com/#person' },
        learningResourceType: lessonIndex >= 0 ? 'Course lesson' : 'Practical guide',
        educationalLevel: entry.level,
        teaches: entry.objectives,
        citation: entry.sources,
        datePublished: entry.date,
        author: { '@id': 'https://alhajikallon.com/#person' },
        keywords: entry.topics,
        inLanguage: 'en',
        isPartOf: { '@id': lessonIndex >= 0 ? 'https://alhajikallon.com/knowledge/protocols#course' : 'https://alhajikallon.com/#website' },
      }) }} />
      <Navbar />
      <section className="page-intro site-gutter border-b border-border">
        <div className="max-w-4xl mx-auto">
          <Link href="/knowledge" className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-10"><ArrowLeft size={14} /> Back to Knowledge Hub</Link>
          <Reveal variant="up"><p className="text-accent text-xs uppercase tracking-widest mb-5">{entry.category}</p><h1 className="page-title font-display font-bold tracking-tight leading-tight mb-7">{entry.title}</h1><p className="text-muted text-lg leading-relaxed">{entry.excerpt}</p></Reveal>
        </div>
      </section>
      <section className="section-space site-gutter border-b border-border"><div className="mx-auto max-w-4xl grid gap-7 md:grid-cols-2"><div><p className="text-sm text-[var(--color-muted)]">By Alhaji C. M. Kallon · <time dateTime={entry.date}>{entry.date}</time> · {entry.level} · {entry.readTime}</p><h2 className="mt-5 mb-2 font-semibold">Before you start</h2><ul className="list-disc pl-5 text-sm text-[var(--color-muted)]">{entry.prerequisites?.map((item) => <li key={item}>{item}</li>)}</ul><h2 className="mt-5 mb-2 font-semibold">What you will practise</h2><ul className="list-disc pl-5 text-sm text-[var(--color-muted)]">{entry.objectives?.map((item) => <li key={item}>{item}</li>)}</ul></div><nav aria-label="On this page"><h2 className="mb-3 font-semibold">On this page</h2><ul className="space-y-2 text-sm">{[...entry.content.matchAll(/^## (.+)$/gm)].map((match) => <li key={match[1]}><a className="text-[var(--color-accent)] underline underline-offset-4" href={'#' + match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}>{match[1]}</a></li>)}</ul></nav></div></section>
      {lessonIndex === 0 && <ProtocolInfographics />}
      {lessonIndex > 0 && <ProtocolLessonVisual lessonIndex={lessonIndex} />}
      <section className="section-space site-gutter"><article className="max-w-3xl mx-auto font-body text-base md:text-lg"><MarkdownContent source={entry.content} /></article></section>
      {lessonIndex >= 0 && <CourseProgress lessons={PROTOCOL_LESSONS.map(({ slug, title }) => ({ slug, title }))} currentSlug={slug} />}
      {lessonIndex >= 0 && <nav aria-label="Protocol course navigation" className="site-gutter border-t border-border py-10"><div className="mx-auto max-w-3xl"><p className="text-sm text-muted">Lesson {lessonIndex + 1} of {PROTOCOL_LESSONS.length}</p><Link prefetch={false} href="/knowledge/protocols" className="mt-3 inline-block text-sm text-accent underline underline-offset-4">Course overview and glossary</Link><div className="mt-6 grid gap-5 sm:grid-cols-2">{previous && <Link prefetch={false} href={`/knowledge/${previous.slug}`} className="rounded-lg border border-border p-4 text-sm leading-relaxed hover:bg-surface">← Previous: {previous.title}</Link>}{next && <Link prefetch={false} href={`/knowledge/${next.slug}`} className="rounded-lg border border-border p-4 text-sm leading-relaxed hover:bg-surface">Next: {next.title} →</Link>}{!next && <Link prefetch={false} href="/knowledge/protocols" className="editorial-link">Return to the course →</Link>}</div></div></nav>}
      <Footer />
    </main>
  );
}
