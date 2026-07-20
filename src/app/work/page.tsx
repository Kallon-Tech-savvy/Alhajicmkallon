// Optimized: Removed client overhead. Rendered completely on the server.
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PROJECTS } from '@/lib/content';
import {Reveal} from '@/components/Reveal';
import { UnicornBackground } from '@/components/UnicornBackground';
import { MagneticButton } from '@/components/MagneticButton';
import { ArrowUpRight, Code } from 'lucide-react';

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-gold/30">
      <Navbar />

      {/* Header */}
      <section className="pt-48 pb-24 px-6 relative overflow-hidden">
        <UnicornBackground
          projectId="YOUR_UNICORN_STUDIO_PROJECT_ID"
          fallbackClassName="bg-gradient-to-bl from-[var(--color-pride-blue)]/8 via-transparent to-transparent"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal variant="fade" as="span" className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6 block">
            highlights of core work this year
          </Reveal>
          <Reveal variant="up" delay={100} as="h1" className="font-space text-6xl md:text-9xl font-black tracking-tighter mb-12 leading-[0.85] uppercase">
            CRAFTING <br /><span className="text-gradient">SOLUTIONS</span>
          </Reveal>
        </div>
        <div className="absolute top-1/2 right-0 text-white/[0.01] font-space text-[30vw] font-black leading-none pointer-events-none select-none">
          WORK
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto space-y-20">
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              id={project.id}
              className="scroll-mt-28 border-t border-white/10 pt-16 first:border-t-0 first:pt-0"
            >
              <Reveal variant="up" delay={Math.min(i * 60, 240)} as="article" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                <div className="lg:col-span-4">
                  <div className="aspect-[4/3] rounded-sm bg-navy border border-white/10 flex items-center justify-center overflow-hidden">
                    {project.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-space text-6xl font-black text-white/10 select-none">
                        {project.title.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="font-space text-gold text-[10px] font-black uppercase tracking-[0.3em]">
                      {project.role}
                    </span>
                    {project.timeline && (
                      <span className="text-[10px] uppercase tracking-[0.24em] text-muted">
                        · {project.timeline}
                      </span>
                    )}
                  </div>

                  <h2 className="font-space text-3xl md:text-4xl font-bold tracking-tighter mb-2">
                    {project.title}
                  </h2>
                  {project.subtitle && (
                    <p className="text-muted text-xs uppercase tracking-[0.2em] mb-6">{project.subtitle}</p>
                  )}

                  <p className="text-[#c7ccd4] text-base leading-relaxed mb-6 max-w-2xl">
                    {project.description}
                  </p>

                  {project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tech.map((t) => (
                        <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-space font-bold text-muted uppercase tracking-wider">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {(project.problem || project.approach || project.solution) && (
                    <div className="grid sm:grid-cols-3 gap-6 mb-8 text-sm">
                      {project.problem && (
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.24em] text-gold mb-2">Problem</p>
                          <p className="text-muted leading-relaxed">{project.problem}</p>
                        </div>
                      )}
                      {project.approach && (
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.24em] text-gold mb-2">Approach</p>
                          <p className="text-muted leading-relaxed">{project.approach}</p>
                        </div>
                      )}
                      {project.solution && (
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.24em] text-gold mb-2">Outcome</p>
                          <p className="text-muted leading-relaxed">{project.solution}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {project.impact.length > 0 && (
                    <ul className="mb-8 space-y-1.5">
                      {project.impact.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-muted">
                          <span className="mt-2 h-1 w-1 rounded-full bg-gold shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-wrap gap-4">
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-gold/30 text-gold font-space font-black text-[10px] uppercase tracking-widest hover:bg-gold hover:text-midnight transition-all duration-300"
                      >
                        Visit Live <ArrowUpRight size={14} />
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-ivory font-space font-black text-[10px] uppercase tracking-widest hover:border-gold/40 transition-all duration-300"
                      >
                        <Code size={14} /> Code
                      </a>
                    )}
                    {!project.links.live && !project.links.github && (
                      <span className="text-[11px] uppercase tracking-[0.2em] text-muted/70">
                        Live link coming soon
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* Contextual Conversion Gateway — frosted panel over subtle glow */}
      <section className="py-48 bg-navy/10 px-6 text-center border-t border-white/5 relative overflow-hidden">
        <Reveal variant="scale" className="max-w-3xl mx-auto space-y-8 relative z-10 p-10 md:p-14 rounded-sm glass-frost">
          <h2 className="font-space text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-none">
            Have an <span className="text-gradient">Idea?</span>
          </h2>
          <p className="text-muted text-lg font-inter max-w-xl mx-auto font-light">
            I&apos;m always open to discussing new projects, digital transformation consulting, or impactful collaborations in Africa.
          </p>
          <div className="pt-4">
            <MagneticButton
              href="/contact"
              className="inline-flex px-10 py-5 bg-gold text-midnight font-space font-black text-xs uppercase tracking-widest hover:bg-ivory transition-colors duration-300 shadow-xl rounded-sm"
            >
              Start a Conversation
            </MagneticButton>
          </div>
        </Reveal>
      </section>

      <Footer
        ctaHeading="See something you'd want built?"
        ctaBody="Every project above started as a rough idea. If you've got one, let's talk about how to build it right."
      />
    </main>
  );
}