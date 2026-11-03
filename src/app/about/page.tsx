// Server component — no 'use client' needed
import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const siteUrl = 'https://alhajikallon.com';

export const metadata: Metadata = {
  title: 'About Alhaji C.M. Kallon',
  description:
    'Learn about Alhaji C.M. Kallon, a Freetown-based design engineer connecting problem discovery, product thinking, experience design and software engineering.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Alhaji C.M. Kallon | Design Engineer',
    description:
      'The background, working principles and product approach of Alhaji C.M. Kallon, a design engineer based in Sierra Leone.',
    url: `${siteUrl}/about`,
    type: 'profile',
  },
};

const MARQUEE_ITEMS = [
  'Design Systems',
  'React & Next.js',
  'TypeScript',
  'Sierra Leone',
  'Product Engineering',
  'Supabase',
  'Framer Motion',
  'UX Research',
  'Full-Stack',
  'Youth Empowerment',
  'AI & Systems Design',
  'Tailwind CSS',
];

const VALUES = [
  {
    num: '01',
    title: 'Evidence before claims',
    desc: 'Separate what is known from what is assumed. Describe outcomes only as strongly as the available evidence allows.',
  },
  {
    num: '02',
    title: 'Clarity before scope',
    desc: 'Define the problem and the intended outcome before adding features or committing to a solution.',
  },
  {
    num: '03',
    title: 'Useful over impressive',
    desc: 'Choose the simplest approach that serves the real need, and improve it when evidence shows where it falls short.',
  },
  {
    num: '04',
    title: 'People in context',
    desc: 'Design around people’s goals, constraints, and environment—not an imagined ideal user.',
  },
  {
    num: '05',
    title: 'Work in the open',
    desc: 'Explain trade-offs, invite useful feedback, and make room to change direction when the reasoning calls for it.',
  },
  {
    num: '06',
    title: 'Keep learning',
    desc: 'Treat every release as a chance to learn what works, what does not, and what deserves attention next.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-midnight text-ivory overflow-x-hidden">
      <Navbar />

      {/* ── Hero header ─────────────────────────────────────── */}
      <section className="page-intro site-gutter relative overflow-hidden">
        <div className="max-w-[var(--layout-max)] mx-auto">

          {/* Eyebrow */}
          <span
            className="font-display text-xs font-black tracking-[0.16em] uppercase mb-8 block"
            style={{ color: 'var(--color-accent)' }}
          >
            Design engineer · Product discovery · Experience design
          </span>

          {/* Headline + small portrait in header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-end">
            <div className="lg:col-span-8">
              <h1 className="page-title font-display tracking-tighter uppercase"
              >
                ABOUT
                <br />
                <span
                  style={{
                    background:
                      'linear-gradient(90deg, var(--color-ivory) 0%, var(--color-accent) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                  className='text-[60%]'
                >
                  C M KALLON
                </span>
              </h1>
            </div>

            {/* Thumbnail portrait anchored to headline bottom */}
            <div className="lg:col-span-4 relative hidden lg:block" style={{ height: '180px' }}>
              <div
                className="absolute bottom-0 right-0 overflow-hidden"
                style={{
                  width: '150px',
                  height: '180px',
                  border: '1px solid rgba(0,107,255,0.2)',
                }}
              >
                <Image
                  src="/assets/kallon1.png"
                  alt="Alhaji Kallon"
                  fill
                  className="object-cover object-top"
                  style={{ filter: 'grayscale(75%) contrast(1.05)' }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,107,255,0.2) 0%, transparent 55%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Background watermark */}
        <div
          className="absolute bottom-0 right-0 font-display font-black leading-none pointer-events-none select-none translate-x-[12%]"
          style={{ fontSize: '35vw', color: 'rgba(255,255,255,0.007)' }}
        >
          STORY
        </div>
      </section>

      {/* ── Marquee strip ───────────────────────────────────── */}
      <div
        className="py-[10px] overflow-hidden"
        style={{ borderTop: '1px solid var(--color-surface)', borderBottom: '1px solid var(--color-surface)' }}
      >
        <div className="marquee-track flex whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="font-display text-xs uppercase tracking-[0.16em] flex-shrink-0 flex items-center"
              style={{ color: 'var(--color-surface)', paddingRight: '48px' }}
            >
              {item}
              <span
                style={{ color: 'var(--color-pride-blue)', opacity: 0.35, paddingLeft: '48px' }}
              >
                ·
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Intro grid ──────────────────────────────────────── */}
      <section className="section-space site-gutter">
        <div className="max-w-[var(--layout-max)] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-start">

          {/* Photo */}
          <div className="lg:col-span-5 relative">
            <div
              className="relative aspect-[4/5] overflow-hidden"
              style={{ border: '1px solid rgba(0,107,255,0.12)' }}
            >
              <Image
                src="/assets/kallon1.png"
                alt="Alhaji C.M. Kallon"
                fill
                priority
                className="object-cover"
                style={{ filter: 'grayscale(65%) contrast(1.06) brightness(0.92)' }}
              />
              {/* Blue base gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,107,255,0.16) 0%, rgba(0,107,255,0.04) 35%, transparent 60%)',
                }}
              />
              {/* Caption bar */}
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-3"
                style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
              >
                <p
                  className="font-display text-xs uppercase tracking-[0.16em]"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Alhaji C.M. Kallon · Freetown, Sierra Leone
                </p>
              </div>
            </div>

            {/* Gold accent line */}
            <div
              className="absolute -bottom-3 left-0 h-[2px] w-16"
              style={{ background: 'var(--color-accent)' }}
            />
          </div>

          {/* Text */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h2
                className="font-display text-xs font-black uppercase tracking-[0.16em] mb-6"
                style={{ color: 'var(--color-accent)' }}
              >
                What I do
              </h2>
              <p
                className="text-3xl md:text-4xl font-body font-light leading-snug tracking-tight"
                style={{ color: 'var(--color-ivory)' }}
              >
                I’m Alhaji C.M. Kallon, a 
                <span
                  style={{
                    color: 'var(--color-accent)',
                    fontWeight: 500,
                    fontStyle: 'italic',
                  }}
                >
                  Sierra Leonean
                </span>{' '}
                design engineer based in Freetown, Sierra Leone. I help founders, businesses and organisations turn unclear ideas into useful digital products—from understanding the problem and deciding what to build to designing the experience and engineering the solution.
              </p>
            </div>

            <div
              className="space-y-6 text-lg font-body leading-relaxed font-light"
              style={{ color: 'var(--color-muted)' }}
            >
              <p>
                My work connects problem discovery, product thinking, experience design and software engineering. I help make the problem clearer, decide what is worth building, and turn that decision into a working product.
              </p>
              <p>
                A good implementation starts before the code. It means understanding who the product is for, what they need to do, and what constraints matter. The goal is not technology for its own sake; it is a useful solution people can understand and use.
              </p>
            </div>

            {/* Stats block */}
            <div
              className="grid grid-cols-3 border"
              style={{ borderColor: 'var(--color-surface)' }}
            >
              {[
                { val: '01', label: 'Understand' },
                { val: '02', label: 'Decide' },
                { val: '03', label: 'Build' },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="px-6 py-5"
                  style={{
                    borderRight: i < 2 ? '1px solid var(--color-surface)' : undefined,
                  }}
                >
                  <div
                    className="font-display font-black leading-none"
                    style={{ fontSize: '28px', color: 'var(--color-ivory)' }}
                  >
                    {s.val}
                  </div>
                  <div
                    className="font-display text-xs uppercase tracking-widest mt-2"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Full Story ──────────────────────────────────────── */}
      <section
        className="section-space"
        style={{
          borderTop: '1px solid var(--color-surface)',
          borderBottom: '1px solid var(--color-surface)',
          background: 'rgba(13,13,13,0.55)',
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          {/* Section header */}
          <div className="flex items-center gap-6 mb-16">
            <div
              className="h-[1px] w-12 flex-shrink-0"
              style={{ background: 'var(--color-pride-blue)' }}
            />
            <h2
              className="font-display text-xs font-black uppercase tracking-[0.16em]"
              style={{ color: 'var(--color-pride-blue)' }}
            >
              The story behind my work
            </h2>
            <div
              className="flex-1 h-[1px]"
              style={{ background: 'var(--color-surface)' }}
            />
          </div>

          <div
            className="space-y-10 text-xl font-body leading-relaxed font-light"
            style={{ color: 'var(--color-muted)' }}
          >
            <p>
              I’m interested in the gap between an idea and something that works in the real world. How do you know which problem matters? What should be built first? How can the experience make sense to the people who use it? Those questions shape how I approach product work.
            </p>
            <p>
              I also care about youth opportunity and access to useful knowledge. My work with youth-focused organisations has kept me close to the practical challenges institutions face when they need to explain their work, reach people, and make participation easier.
            </p>

            {/* Pull quote — upgraded typographically */}
            <div
              className="py-10"
              style={{
                borderTop: '1px solid var(--color-surface)',
                borderBottom: '1px solid var(--color-surface)',
              }}
            >
              <p
                className="font-display font-black leading-tight tracking-tight"
                style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)', color: 'var(--color-ivory)' }}
              >
                &ldquo;Start with the problem. Make the choices clear. Build something useful—and be honest about what the evidence shows.&rdquo;
              </p>
              <div
                className="mt-6 h-[2px] w-12"
                style={{ background: 'var(--color-accent)' }}
              />
            </div>

            <p>
              I share what I learn because good decisions improve when the reasoning is visible. This site brings together selected projects, notes, and lessons from the work—what I tried, why I chose it, and what I would investigate next.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values: editorial list ───────────────────────────── */}
      <section className="section-space site-gutter">
        <div className="max-w-[var(--layout-max)] mx-auto">

          {/* Section headline — outlined contrast treatment */}
          <div className="mb-16">
            <h2
              className="font-display font-black tracking-tighter uppercase leading-none"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--color-ivory)' }}
            >
              HOW I{' '}
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1px var(--color-border)',
                }}
              >
                WORK
              </span>
            </h2>
          </div>

          {/* List rows — editorial, not cards */}
          <div style={{ borderTop: '1px solid var(--color-surface)' }}>
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="group grid items-center gap-x-6 py-6 transition-all duration-300 hover:bg-[rgba(0,107,255,0.02)] -mx-3 px-3"
                style={{
                  gridTemplateColumns: '28px 1fr 2fr 20px',
                  borderBottom: '1px solid var(--color-surface)',
                }}
              >
                {/* Number */}
                <span
                  className="font-display text-xs font-black"
                  style={{ color: 'rgba(0,107,255,0.3)' }}
                >
                  {v.num}
                </span>

                {/* Title */}
                <h3
                  className="font-display text-base md:text-lg font-bold tracking-tight transition-colors duration-300 group-hover:text-accent"
                  style={{ color: 'var(--color-ivory)' }}
                >
                  {v.title}
                </h3>

                {/* Description */}
                <p
                  className="font-body text-sm leading-relaxed font-light"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {v.desc}
                </p>

                {/* Arrow indicator */}
                <ArrowRight
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: 'var(--color-pride-blue)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — split layout ───────────────────────────────── */}
      <section
        className="section-space site-gutter"
        style={{ borderTop: '1px solid var(--color-surface)' }}
      >
        <div className="max-w-[var(--layout-max)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div>
            <h2
              className="font-display font-black tracking-tighter uppercase leading-none"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--color-ivory)' }}
            >
              HAVE AN IDEA?
              <br />
              <span
                style={{
                  color: 'var(--color-pride-blue)',
                  textShadow: '0 0 28px rgba(0,107,255,0.3)',
                }}
              >
                MAKE IT CLEAR
              </span>
              <br />
              AND BUILD IT.
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            <p
              className="text-lg font-body font-light leading-relaxed"
              style={{ color: 'var(--color-muted)' }}
            >
              If you have an early idea, an existing product, or a problem that is difficult to define, we can work out the next useful step together.
            </p>
            <div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 font-display font-black text-xs uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-midnight)',
                  boxShadow: '0 0 24px rgba(255,176,0,0.2)',
                }}
              >
                Talk through your idea <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}