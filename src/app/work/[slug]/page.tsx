import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { AEEMCaseStudy } from '@/components/AEEMCaseStudy';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { getProjectBySlug, PROJECTS } from '@/lib/content';
import { MarkdownContent } from '@/components/MarkdownContent';
import { serializeJsonLd } from '@/lib/serialize-json-ld';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROJECTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project not found' };

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, type: 'article' },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  if (project.slug === 'aeem-digital-presence') {
    return <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        '@context': 'https://schema.org', '@type': 'CreativeWork',
        name: project.title, description: project.summary,
        url: `https://alhajikallon.com/work/${project.slug}`,
        creator: { '@id': 'https://alhajikallon.com/#person' },
        isPartOf: { '@id': 'https://alhajikallon.com/#website' },
      }) }} />
      <AEEMCaseStudy source={project.body ?? project.description} liveUrl={project.links.live} />
    </>;
  }

  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-accent/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        headline: project.title,
        description: project.summary,
        url: `https://alhajikallon.com/work/${project.slug}`,
        creator: { '@id': 'https://alhajikallon.com/#person' },
        keywords: project.topics,
        genre: project.role,
        isPartOf: { '@id': 'https://alhajikallon.com/#website' },
      }) }} />
      <Navbar />
      <section className="page-intro site-gutter border-b border-border">
        <div className="max-w-4xl mx-auto">
          <Link href="/work" className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-10">
            <ArrowLeft size={14} /> Back to selected work
          </Link>
          <Reveal variant="up">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <p className="text-accent text-xs uppercase tracking-widest">{project.role}</p>
              <span className="text-xs uppercase tracking-widest text-muted border border-border px-2 py-1">{project.links?.live ? 'Live website' : project.role.toLowerCase().includes('in progress') ? 'In progress' : 'Case study'}</span>
            </div>
            <h1 className="page-title font-display font-bold tracking-tight leading-tight mb-7">{project.title}</h1>
            <p className="text-muted text-lg md:text-xl leading-relaxed">{project.summary}</p>
            {(project.links?.live || project.links?.source) && (
              <div className="flex flex-wrap gap-5 mt-8">
                {project.links?.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent text-midnight px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-ivory transition-colors"
                  >
                    Visit live project <ArrowUpRight size={14} />
                  </a>
                )}
                {project.links?.source && (
                  <a
                    href={project.links.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-xs font-bold uppercase tracking-widest text-ivory hover:border-accent hover:text-accent transition-colors"
                  >
                    View source code <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            )}
            {project.technologies.length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-7" aria-label="Technologies">
                {project.technologies.map((technology) => (
                  <li key={technology} className="border border-border rounded-full px-3 py-1 text-xs text-muted">{technology}</li>
                ))}
              </ul>
            )}
          </Reveal>
        </div>
      </section>
      <section className="section-space site-gutter">
        <article className="max-w-3xl mx-auto font-body text-base md:text-lg">
          <MarkdownContent source={project.body ?? project.description} />
        </article>
      </section>
      <Footer />
    </main>
  );
}
