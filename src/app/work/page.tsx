import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FeaturedWork } from '@/components/FeaturedWork';

const description =
  'Selected work by design engineer Alhaji C.M. Kallon: the problem, the choices, what was built and what the evidence says so far.';

export const metadata: Metadata = {
  title: 'Selected work',
  description,
  alternates: { canonical: '/work' },
  openGraph: {
    title: 'Selected work | Alhaji C.M. Kallon',
    description,
    url: 'https://alhajikallon.com/work',
    type: 'website',
    images: [
      {
        url: '/assets/brand/alhaji-kallon-identity.jpg',
        width: 1280,
        height: 640,
        alt: 'Alhaji C M Kallon: a deliberate balance of design, engineering and curiosity',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Selected work | Alhaji C.M. Kallon',
    description,
    images: ['/assets/brand/alhaji-kallon-identity.jpg'],
  },
};

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-midnight text-ivory">
      <Navbar />
      <header className="page-intro site-gutter">
        <div className="mx-auto max-w-[var(--layout-max)]">
          <p className="editorial-kicker mb-6 text-accent">Selected work</p>
          <h1 className="page-title">
            From problem
            <br />
            <span>to product.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Start with the AEEM case study to see a live website and the decisions behind it.
            The projects below are still in development; their notes explain what is built,
            what has been checked and what remains uncertain.
          </p>
        </div>
      </header>
      <FeaturedWork variant="work" />
      <section className="site-gutter border-t border-border py-12">
        <div className="mx-auto flex max-w-[var(--layout-max)] flex-wrap items-center justify-between gap-6">
          <h2 className="text-2xl font-semibold">Want help with a project?</h2>
          <Link prefetch={false} href="/contact" className="editorial-link">
            Describe your project
          </Link>
        </div>
      </section>
      <Footer showInvitation={false} />
    </main>
  );
}
