import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FeaturedWork } from '@/components/FeaturedWork';

export const metadata = { title: 'Selected work', description: 'Working products and development notes: the context, the choices, what I built, and what the evidence says so far.', alternates: { canonical: '/work' } };

export default function WorkPage() {
  return <main className="min-h-screen bg-midnight text-ivory"><Navbar />
    <header className="page-intro site-gutter"><div className="mx-auto max-w-[var(--layout-max)]"><p className="editorial-kicker mb-6 text-accent">Selected work</p><h1 className="page-title">From problem<br /><span className="text-accent">to product.</span></h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">Working products and development notes. Explore the context, the choices, what I built, and what the evidence says so far.</p></div></header>
    <FeaturedWork />
    <section className="site-gutter border-t border-border py-12"><div className="mx-auto flex max-w-[var(--layout-max)] flex-wrap items-center justify-between gap-6"><h2 className="text-2xl font-semibold">Have a problem worth working on?</h2><Link prefetch={false} href="/contact" className="editorial-link">Talk through the problem ↗</Link></div></section>
    <Footer />
  </main>;
}
