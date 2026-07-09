// Optimized: Removed client overhead. Rendered completely on the server.
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
// import { PROJECTS } from '@/lib/content'; // Assumed static dataset
import {Reveal} from '@/components/Reveal';
import { UnicornBackground } from '@/components/UnicornBackground';
import { MagneticButton } from '@/components/MagneticButton';

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

      <Footer />
    </main>
  );
}