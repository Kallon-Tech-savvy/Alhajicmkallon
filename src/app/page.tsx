'use client';

import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CustomCursor } from '@/components/CustomCursor';
import { OnboardingGuide } from '@/components/OnboardingGuide';

// 1. Dynamic Imports: Defers loading of below-the-fold Client Components
const ImpactCards = dynamic(() => import('@/components/ImpactCards').then(mod => mod.ImpactCards));
const Timeline = dynamic(() => import('@/components/Timeline').then(mod => mod.Timeline));
const FeaturedWork = dynamic(() => import('@/components/FeaturedWork').then(mod => mod.FeaturedWork));
const ThoughtLeadership = dynamic(() => import('@/components/ThoughtLeadership').then(mod => mod.ThoughtLeadership));
const VisionMap = dynamic(() => import('@/components/VisionMap').then(mod => mod.VisionMap));
const NewsletterCTA = dynamic(() => import('@/components/NewsletterCTA').then(mod => mod.NewsletterCTA));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default function Home() {
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

      <OnboardingGuide />

      <NewsletterCTA />
      <Footer />
    </main>
  );
}
