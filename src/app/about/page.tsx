// Server component — no 'use client' needed
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
    title: 'Innovation',
    desc: 'Embracing creativity, experimentation, and continuous improvement to solve meaningful challenges.',
  },
  {
    num: '02',
    title: 'Excellence',
    desc: 'Maintaining high standards of quality, professionalism, and integrity in every endeavor.',
  },
  {
    num: '03',
    title: 'Lifelong Learning',
    desc: 'Remaining curious, adaptable, and committed to personal and professional growth.',
  },
  {
    num: '04',
    title: 'Empowerment',
    desc: 'Creating pathways for individuals and communities to realize their full potential.',
  },
  {
    num: '05',
    title: 'Collaboration',
    desc: 'Believing that the most impactful solutions emerge through collective effort.',
  },
  {
    num: '06',
    title: 'Service',
    desc: 'Using skills and knowledge to contribute positively to society.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-midnight text-ivory overflow-x-hidden">
      <Navbar />

      {/* ── Hero header ─────────────────────────────────────── */}
      <section className="pt-40 pb-0 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Eyebrow */}
          <span
            className="font-space text-[10px] font-black tracking-[0.5em] uppercase mb-8 block"
            style={{ color: 'var(--color-gold)' }}
          >
            The Architect of Impact
          </span>

          {/* Headline + small portrait in header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-end">
            <div className="lg:col-span-8">
              <h1
                className="font-space font-black tracking-tighter leading-[0.82] uppercase"
                style={{ fontSize: 'clamp(5rem, 14vw, 14rem)' }}
              >
                ABOUT
                <br />
                <span
                  style={{
                    background:
                      'linear-gradient(90deg, #E0E0E0 0%, var(--color-pride-blue) 100%)',
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
          className="absolute bottom-0 right-0 font-space font-black leading-none pointer-events-none select-none translate-x-[12%]"
          style={{ fontSize: '35vw', color: 'rgba(255,255,255,0.007)' }}
        >
          STORY
        </div>
      </section>

      {/* ── Marquee strip ───────────────────────────────────── */}
      <div
        className="py-[10px] overflow-hidden"
        style={{ borderTop: '1px solid #141414', borderBottom: '1px solid #141414' }}
      >
        <div className="marquee-track flex whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="font-space text-[9px] uppercase tracking-[0.4em] flex-shrink-0 flex items-center"
              style={{ color: '#1E1E1E', paddingRight: '48px' }}
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
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">

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
                  className="font-space text-[9px] uppercase tracking-[0.4em]"
                  style={{ color: '#334155' }}
                >
                  Alhaji C.M. Kallon · Freetown, Sierra Leone
                </p>
              </div>
            </div>

            {/* Gold accent line */}
            <div
              className="absolute -bottom-3 left-0 h-[2px] w-16"
              style={{ background: 'var(--color-gold)' }}
            />
          </div>

          {/* Text */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h2
                className="font-space text-[10px] font-black uppercase tracking-[0.4em] mb-6"
                style={{ color: 'var(--color-gold)' }}
              >
                The Short Version
              </h2>
              <p
                className="text-3xl md:text-4xl font-inter font-light leading-snug tracking-tight"
                style={{ color: '#E0E0E0' }}
              >
                Alhaji C.M. Kallon is a{' '}
                <span
                  style={{
                    color: 'var(--color-gold)',
                    fontWeight: 500,
                    fontStyle: 'italic',
                  }}
                >
                  Sierra Leonean
                </span>{' '}
                design engineer, software developer, entrepreneur, and writer committed
                to advancing innovation and building solutions that create lasting impact.
              </p>
            </div>

            <div
              className="space-y-6 text-lg font-inter leading-relaxed font-light"
              style={{ color: '#475569' }}
            >
              <p>
                As a design engineer and software developer, I build digital solutions
                that address real-world challenges. My work spans software engineering,
                product development, artificial intelligence, and systems design.
              </p>
              <p>
                But technology alone is never the answer. The real work is bridging the
                gap between what&apos;s possible and what&apos;s needed — ensuring that
                innovation remains accessible, relevant, and impactful for the people
                it&apos;s meant to serve.
              </p>
            </div>

            {/* Stats block */}
            <div
              className="grid grid-cols-3 border"
              style={{ borderColor: '#141414' }}
            >
              {[
                { val: '2+', label: 'Years building' },
                { val: '12+', label: 'Systems shipped' },
                { val: '∞', label: 'Ideas in motion' },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="px-6 py-5"
                  style={{
                    borderRight: i < 2 ? '1px solid #141414' : undefined,
                  }}
                >
                  <div
                    className="font-space font-black leading-none"
                    style={{ fontSize: '28px', color: '#E0E0E0' }}
                  >
                    {s.val}
                  </div>
                  <div
                    className="font-space text-[9px] uppercase tracking-widest mt-2"
                    style={{ color: '#334155' }}
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
        className="py-28"
        style={{
          borderTop: '1px solid #0F0F0F',
          borderBottom: '1px solid #0F0F0F',
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
              className="font-space text-[10px] font-black uppercase tracking-[0.5em]"
              style={{ color: 'var(--color-pride-blue)' }}
            >
              The Full Story
            </h2>
            <div
              className="flex-1 h-[1px]"
              style={{ background: '#141414' }}
            />
          </div>

          <div
            className="space-y-10 text-xl font-inter leading-relaxed font-light"
            style={{ color: 'rgba(224,224,224,0.7)' }}
          >
            <p>
              I grew up fascinated by how ideas become reality. Not just in theory,
              but in practice — how a thought transforms into a sketch, a sketch into
              a prototype, and a prototype into something that changes how people live
              and work.
            </p>
            <p>
              Beyond technology, I&apos;m deeply committed to youth empowerment and
              capacity building. I&apos;ve worked with youth-focused organizations and
              innovation ecosystems that equip young people with the skills, mindset,
              and opportunities they need to thrive.
            </p>

            {/* Pull quote — upgraded typographically */}
            <div
              className="py-10"
              style={{
                borderTop: '1px solid #141414',
                borderBottom: '1px solid #141414',
              }}
            >
              <p
                className="font-space font-black leading-tight tracking-tight"
                style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)', color: '#E0E0E0' }}
              >
                &ldquo;My mission is to leverage technology, innovation, and
                human-centered design to{' '}
                <span style={{ color: 'var(--color-pride-blue)' }}>
                  empower individuals
                </span>{' '}
                and strengthen institutions across Africa.&rdquo;
              </p>
              <div
                className="mt-6 h-[2px] w-12"
                style={{ background: 'var(--color-gold)' }}
              />
            </div>

            <p>
              I believe that ideas have the power to shape societies, and that sharing
              knowledge is one of the most effective ways to create positive change.
              Through technology, innovation, and education, I&apos;m working to play a
              role in building that future.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values: editorial list ───────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section headline — outlined contrast treatment */}
          <div className="mb-16">
            <h2
              className="font-space font-black tracking-tighter uppercase leading-none"
              style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', color: '#E0E0E0' }}
            >
              CORE{' '}
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1px #2A2A2A',
                }}
              >
                VALUES
              </span>
            </h2>
          </div>

          {/* List rows — editorial, not cards */}
          <div style={{ borderTop: '1px solid #141414' }}>
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="group grid items-center gap-x-6 py-6 transition-all duration-300 hover:bg-[rgba(0,107,255,0.02)] -mx-3 px-3"
                style={{
                  gridTemplateColumns: '28px 1fr 2fr 20px',
                  borderBottom: '1px solid #141414',
                }}
              >
                {/* Number */}
                <span
                  className="font-space text-[10px] font-black"
                  style={{ color: 'rgba(0,107,255,0.3)' }}
                >
                  {v.num}
                </span>

                {/* Title */}
                <h3
                  className="font-space text-base md:text-lg font-bold tracking-tight transition-colors duration-300 group-hover:text-[var(--color-pride-blue)]"
                  style={{ color: '#E0E0E0' }}
                >
                  {v.title}
                </h3>

                {/* Description */}
                <p
                  className="font-inter text-sm leading-relaxed font-light"
                  style={{ color: '#475569' }}
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
        className="py-24 px-6"
        style={{ borderTop: '1px solid #0F0F0F' }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div>
            <h2
              className="font-space font-black tracking-tighter uppercase leading-none"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)', color: '#E0E0E0' }}
            >
              READY TO
              <br />
              <span
                style={{
                  color: 'var(--color-pride-blue)',
                  textShadow: '0 0 28px rgba(0,107,255,0.3)',
                }}
              >
                EXECUTE
              </span>
              <br />
              YOUR VISION?
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            <p
              className="text-lg font-inter font-light leading-relaxed"
              style={{ color: '#475569' }}
            >
              Let&apos;s combine high-performance software architecture with
              human-centered product development.
            </p>
            <div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 font-space font-black text-xs uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'var(--color-gold)',
                  color: '#0A0A0A',
                  boxShadow: '0 0 24px rgba(255,176,0,0.2)',
                }}
              >
                Start a Conversation <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}