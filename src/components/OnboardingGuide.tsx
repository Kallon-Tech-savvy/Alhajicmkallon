'use client';

/**
 * Onboarding / support concierge.
 *
 * This is deliberately NOT an LLM chatbot. It's a small deterministic
 * decision tree: every heading, body line, and CTA below is hand-written
 * and rendered as-is — nothing here is generated, so there's no
 * hallucination surface at all, no latency, and no API cost. That's the
 * right tool for "route this visitor to the right page" — the job doesn't
 * need generation, it needs four honest, pre-written answers.
 *
 * For genuinely open-ended questions, the "quick question" branch below
 * hands off to Cairo (ChatWidget) — which already has its own grounding,
 * moderation, and fallback protocol. This component doesn't duplicate
 * that; it reuses it via a small window event (see ChatWidget's
 * `cairo:ask` listener).
 */

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { QUICK_QUESTIONS } from '@/lib/Chatconstant';

type PathId = 'build' | 'hire' | 'explore' | 'ask';

const PATHS: { id: PathId; label: string }[] = [
  { id: 'build', label: 'I need something built' },
  { id: 'hire', label: "I'm hiring or reviewing candidates" },
  { id: 'explore', label: 'Just exploring the work' },
  { id: 'ask', label: 'I have a quick question' },
];

const PATH_CONTENT: Record<
  Exclude<PathId, 'ask'>,
  { heading: string; body: string; primary: { label: string; href: string }; secondary: { label: string; href: string } }
> = {
  build: {
    heading: "Good — let's point you the right way.",
    body: "The fastest path is a short note on what you're building, who it serves, and any relevant deadlines. It goes straight to Alhaji's inbox, not a queue.",
    primary: { label: 'Start a project conversation', href: '/contact' },
    secondary: { label: 'See relevant work first', href: '/work' },
  },
  hire: {
    heading: "Here's what to look at first.",
    body: 'Alhaji is selective but open to high-impact roles and contracts. Choose the closest intent, summarize your team and outcome expectations, and use the contact form to start.',
    primary: { label: 'View background', href: '/about' },
    secondary: { label: 'View selected work', href: '/work' },
  },
  explore: {
    heading: 'Take your time.',
    body: 'Selected projects with real problem, approach, and outcome breakdowns live on Work. Longer-form thinking lives on Writing.',
    primary: { label: 'View selected work', href: '/work' },
    secondary: { label: 'Read the writing', href: '/writing' },
  },
};

function askCairo(question: string) {
  window.dispatchEvent(new CustomEvent('cairo:ask', { detail: { question } }));
}

export const OnboardingGuide = () => {
  const [selected, setSelected] = useState<PathId | null>(null);

  const activePath = selected && selected !== 'ask' ? (selected as Exclude<PathId, 'ask'>) : null;
  const activeContent = activePath ? PATH_CONTENT[activePath] : null;

  return (
    <section className="border-t border-[#2A2A2A] bg-[#0A0A0A] px-6 py-20 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.35em] text-pride-blue">
            guided pathfinding
          </p>
          <h2 className="font-space text-2xl font-black tracking-[-0.02em] text-ivory md:text-3xl">
            A guided path for every kind of visitor.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#9aa4b2]">
            Pick what brings you here. Every answer below is pre-written — instant, and nothing to double-check.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-wrap gap-2">
            {PATHS.map((path) => {
              const isActive = path.id === selected;
              return (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => setSelected(path.id)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] transition-all duration-300 ${
                    isActive
                      ? 'border-pride-blue bg-pride-blue/16 text-pride-blue'
                      : 'border-white/10 bg-white/[0.03] text-muted hover:border-pride-blue/35 hover:text-ivory'
                  }`}
                >
                  {path.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {!selected && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center rounded-2xl border border-dashed border-white/10 p-6 text-sm text-muted"
              >
                Pick an option on the left to see next steps.
              </motion.div>
            )}

            {selected === 'ask' && (
              <motion.div
                key="ask"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)]"
              >
                <p className="mb-2 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.28em] text-pride-blue">
                  quick answers
                </p>
                <p className="mb-5 text-sm leading-7 text-[#9aa4b2]">
                  Tap one for an instant, pre-verified answer, or open the full chat for anything else.
                </p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => askCairo(q)}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-left text-[11px] leading-tight text-ivory transition-all duration-200 hover:border-pride-blue/40 hover:bg-white/[0.06]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => askCairo('')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-pride-blue bg-pride-blue/12 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-pride-blue transition-all duration-300 hover:-translate-y-0.5 hover:bg-pride-blue/20"
                >
                  <MessageCircle size={14} /> Ask something else
                </button>
              </motion.div>
            )}

            {activeContent && activePath && (
              <motion.div
                key={activePath}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)]"
              >
                <p className="mb-2 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.28em] text-pride-blue">
                  {PATHS.find((p) => p.id === activePath)?.label}
                </p>
                <p className="mb-2 font-space text-lg font-semibold text-ivory">{activeContent.heading}</p>
                <p className="mb-5 text-sm leading-7 text-[#9aa4b2]">{activeContent.body}</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={activeContent.primary.href}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-pride-blue bg-pride-blue/12 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-pride-blue transition-all duration-300 hover:-translate-y-0.5 hover:bg-pride-blue/20"
                  >
                    {activeContent.primary.label}
                    <ArrowUpRight size={14} />
                  </Link>
                  <Link
                    href={activeContent.secondary.href}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition-all duration-300 hover:border-pride-blue/40 hover:bg-white/[0.06]"
                  >
                    {activeContent.secondary.label}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
