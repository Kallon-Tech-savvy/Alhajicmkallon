'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CustomCursor } from '@/components/CustomCursor';

// 1. Dynamic Imports: Defers loading of below-the-fold Client Components
const ImpactCards = dynamic(() => import('@/components/ImpactCards').then(mod => mod.ImpactCards));
const Timeline = dynamic(() => import('@/components/Timeline').then(mod => mod.Timeline));
const FeaturedWork = dynamic(() => import('@/components/FeaturedWork').then(mod => mod.FeaturedWork));
const ThoughtLeadership = dynamic(() => import('@/components/ThoughtLeadership').then(mod => mod.ThoughtLeadership));
const VisionMap = dynamic(() => import('@/components/VisionMap').then(mod => mod.VisionMap));
const NewsletterCTA = dynamic(() => import('@/components/NewsletterCTA').then(mod => mod.NewsletterCTA));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

const onboardingOptions = [
  {
    id: 'launch',
    title: 'Launch a sharper product',
    summary: 'Best for founders who need a premium digital presence, tighter messaging, and a faster path to trust.',
    cta: 'Start a product conversation',
    href: '/contact',
  },
  {
    id: 'explore',
    title: 'Explore the work',
    summary: 'Best for curious visitors who want to see systems, strategy, and thoughtful execution in action.',
    cta: 'View selected work',
    href: '/work',
  },
  {
    id: 'read',
    title: 'Read the thinking',
    summary: 'Best for people who want perspective on design, technology, and building responsibly in public.',
    cta: 'Open writing',
    href: '/writing',
  },
] as const;

export default function Home() {
  const [selectedFlow, setSelectedFlow] = useState<(typeof onboardingOptions)[number]['id']>('launch');
  const activeFlow = onboardingOptions.find((option) => option.id === selectedFlow) ?? onboardingOptions[0];

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <LoadingScreen />
      <CustomCursor />
      <Hero />
      <ImpactCards />
      <Timeline />
      <FeaturedWork />
      <ThoughtLeadership />
      <VisionMap />

      {/* ── Terminal Quote Section ──────────────────────────────────── */}
      <section className="py-48 px-6 relative overflow-hidden bg-[#0A0A0A] border-t border-[#2A2A2A]">
        
        {/* Watermark */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none font-[family-name:var(--font-jetbrains-mono)] text-[28vw] font-black text-white/[0.012] whitespace-nowrap"
          aria-hidden
        >
          VALUES
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="reveal-in">
            {/* Terminal panel chrome */}
            <div className="terminal-panel" data-title="philosophy.log">
              <div className="p-8 md:p-12">
                
                {/* Prompt line */}
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs mb-6 text-[#6B7280]">
                  <span className="text-[var(--color-pride-blue)]">alhaji@kallon</span>
                  <span>:~$&nbsp;</span>
                  <span className="text-[#E0E0E0]">cat ./professional_philosophy.md</span>
                </p>

                {/* The quote */}
                <blockquote className="font-[family-name:var(--font-space-mono)] text-xl md:text-2xl lg:text-3xl leading-relaxed mb-8 text-[#E0E0E0]">
                  <span className="text-[var(--color-pride-blue)] mr-[0.5em]">&gt;</span>
                  &quot;Innovation is most meaningful when it expands opportunity,
                  empowers people, and creates lasting value for society.&quot;
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#2A2A2A]" />
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.5em] text-[#FFB000]">
                    — Alhaji C M Kallon, Design Engineer
                  </span>
                </div>
              </div>
            </div>

            {/* Mantra as system command */}
            <div className="mt-8 flex items-center gap-3 reveal-in">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-[var(--color-pride-blue)]">
                $
              </span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-[#6B7280]">
                believe --courage --strength --build
              </span>
              <span className="cursor-blink" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#2A2A2A] bg-[#0A0A0A] px-6 py-20 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.35em] text-pride-blue">
              smarter onboarding
            </p>
            <h2 className="font-space text-2xl font-black tracking-[-0.02em] text-ivory md:text-3xl">
              A guided path for every kind of visitor.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#9aa4b2]">
              Choose the path that fits your intent and I’ll guide you to the right next step without friction.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex flex-wrap gap-2">
              {onboardingOptions.map((option) => {
                const isActive = option.id === selectedFlow;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedFlow(option.id)}
                    className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] transition-all duration-300 ${
                      isActive
                        ? 'border-pride-blue bg-pride-blue/16 text-pride-blue'
                        : 'border-white/10 bg-white/[0.03] text-muted hover:border-pride-blue/35 hover:text-ivory'
                    }`}
                  >
                    {option.title}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeFlow.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)]"
              >
                <p className="mb-2 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.28em] text-pride-blue">
                  {activeFlow.title}
                </p>
                <p className="mb-5 text-sm leading-7 text-[#9aa4b2]">{activeFlow.summary}</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={activeFlow.href}
                    className="inline-flex items-center justify-center rounded-full border border-pride-blue bg-pride-blue/12 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-pride-blue transition-all duration-300 hover:-translate-y-0.5 hover:bg-pride-blue/20"
                  >
                    {activeFlow.cta}
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition-all duration-300 hover:border-pride-blue/40 hover:bg-white/[0.06]"
                  >
                    Ask a question
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <NewsletterCTA />
      <Footer />
    </main>
  );
}