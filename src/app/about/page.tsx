import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

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
  return <main className="min-h-screen bg-midnight text-ivory">
    <Navbar />
    <header className="page-intro site-gutter border-b border-border"><div className="mx-auto max-w-[var(--layout-max)]"><p className="editorial-kicker mb-6 text-accent">About / Freetown, Sierra Leone</p><h1 className="page-title">Alhaji C.M. Kallon.<br /><span>Design engineer.</span></h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">I help organisations turn unclear ideas into useful digital products. My work connects problem discovery, product thinking, experience design and software engineering.</p></div></header>
    <section className="section-space site-gutter"><div className="mx-auto grid max-w-[var(--layout-max)] gap-8 md:grid-cols-12">
      <figure className="md:col-span-4"><Image src="/assets/9b71762f-5943-4c5b-8a2b-48e47023b178.png" alt="Alhaji C.M. Kallon at work" width={1402} height={1122} sizes="(max-width: 768px) 100vw, 380px" className="h-auto w-full border border-border"/><figcaption className="mt-3 text-xs text-muted">Designing and building from Sierra Leone.</figcaption></figure>
      <div className="max-w-2xl space-y-6 text-lg leading-relaxed md:col-span-7 md:col-start-6"><p className="editorial-kicker text-accent">The perspective behind my work</p><h2 className="text-3xl font-semibold leading-tight tracking-tight">A good implementation<br />starts before the code.</h2><p>Who is the product for? What do they need to do? Which constraints matter? Those questions shape the decisions I make before choosing an interface or a technology.</p><p className="text-muted">My work with youth-focused organisations has kept me close to the practical challenges of explaining a mission, making activities verifiable and helping people participate. In AEEM, I initiated the website and later volunteered as Chief Operating Officer.</p><p className="text-muted">I share the reasoning behind my work because another developer should be able to examine the decisions, understand the limitations and see what deserves attention next.</p><Link prefetch={false} href="/work/aeem-digital-presence" className="editorial-link">See that thinking in the AEEM case study ↗</Link></div>
    </div></section>
    <section className="section-space site-gutter border-t border-border"><div className="mx-auto grid max-w-[var(--layout-max)] gap-8 md:grid-cols-12"><h2 className="editorial-kicker text-accent md:col-span-3">How I work</h2><div className="md:col-span-9">{VALUES.map(value=><article key={value.num} className="grid gap-3 border-b border-border py-6 first:pt-0 sm:grid-cols-[3rem_1fr]"><span className="font-mono text-xs text-muted">{value.num}</span><div><h3 className="text-xl font-semibold">{value.title}</h3><p className="mt-2 max-w-2xl leading-relaxed text-muted">{value.desc}</p></div></article>)}</div></div></section>
    <Footer />
  </main>;
}
