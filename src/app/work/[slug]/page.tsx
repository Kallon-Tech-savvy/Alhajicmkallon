import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { getProjectBySlug, PROJECTS } from '@/lib/content';
import { MarkdownContent } from '@/components/MarkdownContent';

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

  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-gold/30">
      <Navbar />
      <section className="pt-40 pb-14 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <Link href="/work" className="inline-flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest mb-10">
            <ArrowLeft size={14} /> Back to selected work
          </Link>
          <Reveal variant="up">
            <p className="text-gold text-xs uppercase tracking-widest mb-5">{project.role}</p>
            <h1 className="font-space text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-7">{project.title}</h1>
            <p className="text-muted text-lg md:text-xl leading-relaxed">{project.summary}</p>
            {project.technologies.length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-7" aria-label="Technologies">
                {project.technologies.map((technology) => (
                  <li key={technology} className="border border-white/10 rounded-full px-3 py-1 text-xs text-muted">{technology}</li>
                ))}
              </ul>
            )}
          </Reveal>
        </div>
      </section>
      <section className="px-6 py-14">
        <article className="max-w-3xl mx-auto font-inter text-base md:text-lg">
          <MarkdownContent source={project.body ?? project.description} />
          {project.links?.live && (
            <p className="mt-10">
              <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gold underline underline-offset-4">
                Visit project <ArrowUpRight size={14} />
              </a>
            </p>
          )}
          {project.links?.source && (
            <p className="mt-4">
              <a href={project.links.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gold underline underline-offset-4">
                View source code <ArrowUpRight size={14} />
              </a>
            </p>
          )}
        </article>
      </section>
      <Footer />
    </main>
  );
}
