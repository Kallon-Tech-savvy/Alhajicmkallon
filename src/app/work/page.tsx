import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { MagneticButton } from '@/components/MagneticButton';
import { PROJECTS } from '@/lib/content';

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-gold/30">
      <Navbar />
      <section className="pt-48 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal variant="fade" as="span" className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6 block">
            Selected work
          </Reveal>
          <Reveal variant="up" delay={100} as="h1" className="font-space text-6xl md:text-9xl font-black tracking-tighter mb-12 leading-[0.85] uppercase">
            CRAFTING <br /><span className="text-gradient">SOLUTIONS</span>
          </Reveal>
          <p className="max-w-2xl text-muted text-lg font-inter leading-relaxed">
            A portfolio of projects will appear here as approved case studies are ready to share.
          </p>
        </div>
        <div aria-hidden="true" className="absolute top-1/2 right-0 text-white/[0.01] font-space text-[30vw] font-black leading-none pointer-events-none select-none">WORK</div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.length ? PROJECTS.map((project) => (
            <article key={project.id} id={project.id} className="border border-white/10 p-8 rounded-sm">
              <p className="text-gold text-xs uppercase tracking-widest mb-4">{project.role}</p>
              <h2 className="font-space text-3xl font-bold mb-4">{project.title}</h2>
              <p className="text-muted leading-relaxed mb-6">{project.summary}</p>
              <div className="flex flex-wrap gap-2 mb-6">{project.technologies.map((technology) => <span key={technology} className="text-xs border border-white/10 px-3 py-1 rounded-full">{technology}</span>)}</div>
              {project.body && <p className="text-muted leading-relaxed whitespace-pre-wrap mb-6">{project.body}</p>}
              {project.links?.live && <a href={project.links.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gold">Open project <ArrowUpRight size={14} /></a>}
              <Link href={`/work#${project.id}`} className="sr-only">View {project.title}</Link>
            </article>
          )) : (
            <div className="md:col-span-2 border border-white/10 p-8 md:p-12">
              <h2 className="font-space text-2xl md:text-3xl font-bold mb-4">No public case studies yet</h2>
              <p className="max-w-2xl text-muted leading-relaxed">This portfolio will show projects when their descriptions and supporting details are ready to publish. No placeholder projects or unsupported impact claims are shown.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-32 bg-navy/10 px-6 text-center border-t border-white/5 relative overflow-hidden">
        <Reveal variant="scale" className="max-w-3xl mx-auto space-y-8 relative z-10 p-10 md:p-14 rounded-sm glass-frost">
          <h2 className="font-space text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-none">Have an <span className="text-gradient">Idea?</span></h2>
          <p className="text-muted text-lg font-inter max-w-xl mx-auto font-light">I&apos;m open to discussing new projects, digital product development, or thoughtful collaborations.</p>
          <MagneticButton href="/contact" className="inline-flex px-10 py-5 bg-gold text-midnight font-space font-black text-xs uppercase tracking-widest hover:bg-ivory transition-colors duration-300 shadow-xl rounded-sm">Start a Conversation</MagneticButton>
        </Reveal>
      </section>
      <Footer />
    </main>
  );
}
