'use client';

import { useState } from 'react';
import Link from 'next/link';

const onboardingOptions = [
  {
    id: 'launch',
    title: 'Clarify a product idea',
    summary: 'For an early idea that needs a clearer problem, value proposition, or first set of features.',
    cta: 'Talk through an idea',
    href: '/contact',
  },
  {
    id: 'explore',
    title: 'Explore the work',
    summary: 'See how product decisions, experience design, and engineering come together in a working project.',
    cta: 'View selected work',
    href: '/work',
  },
  {
    id: 'read',
    title: 'Read the thinking',
    summary: 'Explore notes on product decisions, technology, and building useful digital products.',
    cta: 'Read the writing',
    href: '/writing',
  },
] as const;

export function VisitorPath() {
  const [selectedFlow, setSelectedFlow] = useState<(typeof onboardingOptions)[number]['id']>('launch');
  const activeFlow = onboardingOptions.find((option) => option.id === selectedFlow) ?? onboardingOptions[0];

  return (
    <section className="border-t border-[#2A2A2A] bg-[#0A0A0A] px-6 py-20 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.35em] text-pride-blue">
            Find your next step
          </p>
          <h2 className="font-space text-2xl font-black tracking-[-0.02em] text-ivory md:text-3xl">
            What brings you here?
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#9aa4b2]">
            Choose what you need. I’ll point you to the most useful next step.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-wrap gap-2" aria-label="Choose your next step">
            {onboardingOptions.map((option) => {
              const isActive = option.id === selectedFlow;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedFlow(option.id)}
                  className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 ${
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

          <div
            key={activeFlow.id}
            className="animate-[slide-up_180ms_ease-out_both] rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
              <p className="mb-2 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.24em] text-pride-blue">
                {activeFlow.title}
              </p>
              <p className="mb-5 text-sm leading-7 text-[#9aa4b2]">{activeFlow.summary}</p>
              <Link
                href={activeFlow.href}
                className="inline-flex items-center justify-center rounded-full border border-pride-blue bg-pride-blue/12 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-pride-blue transition-colors duration-200 hover:bg-pride-blue/20"
              >
                {activeFlow.cta}
              </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
