import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { VisitorPath } from '@/components/VisitorPath';
import { PracticeOverview } from '@/components/PracticeOverview';

// The following sections remain server-rendered; no client lazy loader is necessary.
import { ImpactCards } from '@/components/ImpactCards';
import { Timeline } from '@/components/Timeline';
import { FeaturedWork } from '@/components/FeaturedWork';
import { ThoughtLeadership } from '@/components/ThoughtLeadership';
import { NewsletterCTA } from '@/components/NewsletterCTA';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      {/* Show evidence before explaining the approach: one clear reading path. */}
      <FeaturedWork />
      <PracticeOverview />
      <ImpactCards />
      <Timeline />
      <ThoughtLeadership />

      {/* ── Terminal Quote Section ──────────────────────────────────── */}
      <section className="section-space site-gutter relative overflow-hidden bg-[var(--color-midnight)] border-t border-[var(--color-border)]">
        
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
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs mb-6 text-[var(--color-muted)]">
                  <span className="text-accent">alhaji@kallon</span>
                  <span>:~$&nbsp;</span>
                  <span className="text-[var(--color-ivory)]">cat ./professional_philosophy.md</span>
                </p>

                {/* The quote */}
                <blockquote className="font-[family-name:var(--font-jetbrains-mono)] text-xl md:text-2xl lg:text-3xl leading-relaxed mb-8 text-[var(--color-ivory)]">
                  <span className="text-accent mr-[0.5em]">&gt;</span>
                  &quot;A product does not earn its place because it exists. It earns it by solving a problem people care about—and by showing that it does.&quot;
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-[var(--color-border)]" />
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.16em] text-[var(--color-accent)]">
                    — Alhaji C M Kallon, Design Engineer
                  </span>
                </div>
              </div>
            </div>

            {/* Mantra as system command */}
            <div className="mt-8 flex items-center gap-3 reveal-in">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent">
                $
              </span>
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-[var(--color-muted)]">
                question --decide --build --learn
              </span>
              <span className="cursor-blink" />
            </div>
          </div>
        </div>
      </section>

      <VisitorPath />

      <NewsletterCTA />
      <Footer />
    </main>
  );
}