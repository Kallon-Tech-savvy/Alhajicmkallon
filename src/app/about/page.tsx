import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { serializeJsonLd } from '@/lib/serialize-json-ld';

const siteUrl = 'https://alhajikallon.com';
const aboutDescription =
  'The background, working principles and product approach of Alhaji C.M. Kallon, a design engineer based in Freetown, Sierra Leone.';

export const metadata: Metadata = {
  title: { absolute: 'About Alhaji C.M. Kallon | Design Engineer' },
  description:
    'Learn about Alhaji C.M. Kallon, a Freetown-based design engineer connecting problem discovery, product thinking, experience design and software engineering.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Alhaji C.M. Kallon | Design Engineer',
    description: aboutDescription,
    url: `${siteUrl}/about`,
    type: 'profile',
    images: [{ url: '/assets/brand/alhaji-kallon-identity.jpg', width: 1280, height: 640 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Alhaji C.M. Kallon | Design Engineer',
    description: aboutDescription,
    images: ['/assets/brand/alhaji-kallon-identity.jpg'],
  },
};

const VALUES = [
  {
    num: '01',
    title: 'Evidence before claims',
    desc: 'Separate what is known from what is assumed, and describe outcomes only as strongly as the evidence allows.',
    forYou: 'You get honest reporting, not inflated promises.',
  },
  {
    num: '02',
    title: 'Clarity before scope',
    desc: 'Define the problem and the intended outcome before adding features or committing to a solution.',
    forYou: 'You avoid paying for features that solve the wrong problem.',
  },
  {
    num: '03',
    title: 'Useful over impressive',
    desc: 'Choose the simplest approach that serves the real need, and improve it as evidence shows where it falls short.',
    forYou: 'You get something that works for your users first, then gets refined.',
  },
  {
    num: '04',
    title: 'People in context',
    desc: 'Design around people’s goals, constraints and environment, not an imagined ideal user.',
    forYou: 'The product fits real life, not a perfect scenario.',
  },
  {
    num: '05',
    title: 'Work in the open',
    desc: 'Explain trade-offs, invite useful feedback, and stay open to changing direction when the reasoning calls for it.',
    forYou: 'You know why a decision was made, and you can challenge it.',
  },
  {
    num: '06',
    title: 'Keep learning',
    desc: 'Treat every release as a chance to learn what works, what doesn’t and what deserves attention next.',
    forYou: 'Each release teaches us something we use in the next.',
  },
];

const BACKGROUND = [
  ['2022', 'Began studying Computer Science at Central University Sierra Leone.'],
  [
    'From 2024',
    'Continued independent study and practical work in software, product thinking and design.',
  ],
  [
    'AEEM',
    'Initiated the education organisation’s website and later volunteered as Chief Operating Officer.',
  ],
  [
    'Current work',
    'Developing the backend of a photography-studio application and working from Freetown.',
  ],
  ['Tools', 'React, TypeScript, Next.js, Vite, Supabase, Express and Cloudflare Workers.'],
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-midnight text-ivory">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            '@id': `${siteUrl}/about#profile`,
            url: `${siteUrl}/about`,
            name: 'About Alhaji C.M. Kallon',
            description: aboutDescription,
            mainEntity: {
              '@type': 'Person',
              '@id': `${siteUrl}/#person`,
              name: 'Alhaji C.M. Kallon',
            },
            isPartOf: { '@id': `${siteUrl}/#website` },
            inLanguage: 'en',
          }),
        }}
      />
      <Navbar />
      <header className="page-intro site-gutter border-b border-border">
        <div className="mx-auto max-w-[var(--layout-max)]">
          <p className="editorial-kicker mb-6 text-accent">About / Freetown, Sierra Leone</p>
          <h1 className="page-title">
            Alhaji C.M. Kallon.
            <br />
            <span>Design engineer.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            I help founders, businesses and organisations turn unclear ideas into useful digital
            products. My work connects problem discovery, product thinking, experience design and
            software engineering.
          </p>
        </div>
      </header>
      <section className="section-space site-gutter" aria-labelledby="my-story-heading">
        <div className="mx-auto grid max-w-[var(--layout-max)] gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="editorial-kicker text-accent">My story</p>
          </div>
          <div className="max-w-3xl space-y-5 leading-relaxed md:col-span-9">
            <h2 id="my-story-heading" className="section-title">
              Where I’m coming from.
            </h2>
            <p>
              I live and work in Freetown, Sierra Leone. The conditions in which people actually use
              technology matter to me, from how they find information to what they can rely on.
            </p>
            <p>
              I began studying Computer Science at Central University Sierra Leone in 2022, and
              continued learning through practical work. One project that shaped my perspective was
              building a website for the Africa Education Empowerment Movement (AEEM).
            </p>
            <p>
              That work connects the questions I ask before a design with the decisions I make in
              code. I want a product to be understandable, useful and workable in its real context.
            </p>
          </div>
        </div>
      </section>
      <section className="section-space site-gutter border-t border-border">
        <div className="mx-auto grid max-w-[var(--layout-max)] gap-8 md:grid-cols-12">
          <figure className="md:col-span-4">
            <Image
              src="/assets/9b71762f-5943-4c5b-8a2b-48e47023b178.png"
              alt="Alhaji C.M. Kallon at work"
              width={1402}
              height={1122}
              sizes="(max-width: 768px) 100vw, 380px"
              className="h-auto w-full border border-border"
            />
            <figcaption className="mt-3 text-xs text-muted">
              Working from Freetown, Sierra Leone.
            </figcaption>
          </figure>
          <div className="max-w-2xl space-y-6 text-lg leading-relaxed md:col-span-7 md:col-start-6">
            <p className="editorial-kicker text-accent">The perspective behind my work</p>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              A good implementation
              <br />
              starts before the code.
            </h2>
            <p>
              Who is the product for? What do they need to do? Which constraints matter? Those
              questions shape the decisions I make before choosing an interface or a technology.
            </p>
            <p className="text-muted">
              My work with AEEM kept me close to the practical challenges of explaining a mission
              and helping people take part. I initiated the website as a volunteer and later served
              as the organisation’s Chief Operating Officer, seeing the work from both the building
              side and the running side.
            </p>
            <p className="text-muted">
              I share the reasoning behind my work so that a client, teammate or developer can
              examine my decisions, understand the limits and see what deserves attention next.
            </p>
            <Link prefetch={false} href="/work/aeem-digital-presence" className="editorial-link">
              See that thinking in the AEEM case study ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="section-space site-gutter border-t border-border">
        <div className="mx-auto grid max-w-[var(--layout-max)] gap-8 md:grid-cols-12">
          <h2 className="editorial-kicker text-accent md:col-span-3">How I work</h2>
          <div className="md:col-span-9">
            {VALUES.map((value) => (
              <article
                key={value.num}
                className="grid gap-3 border-b border-border py-6 first:pt-0 sm:grid-cols-[3rem_1fr]"
              >
                <span className="font-mono text-xs text-muted">{value.num}</span>
                <div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-muted">{value.desc}</p>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                    <strong className="text-ivory font-medium">For you:</strong> {value.forYou}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space site-gutter border-t border-border">
        <div className="mx-auto grid max-w-[var(--layout-max)] gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="editorial-kicker text-accent">Background</p>
            <h2 className="mt-3 text-3xl font-medium">At a glance.</h2>
          </div>
          <dl className="md:col-span-9">
            {BACKGROUND.map(([label, detail]) => (
              <div
                key={label}
                className="grid gap-2 border-b border-border py-5 first:pt-0 sm:grid-cols-[8rem_1fr]"
              >
                <dt className="text-sm font-semibold">{label}</dt>
                <dd className="text-muted">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <Footer />
    </main>
  );
}
