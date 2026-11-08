import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FeaturedWork } from '@/components/FeaturedWork';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="editorial-page min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedWork />
      <section className="site-gutter border-t border-border py-16 md:py-24" aria-labelledby="perspective-heading">
        <div className="mx-auto grid max-w-[var(--layout-max)] gap-8 md:grid-cols-12">
          <p className="editorial-kicker text-accent md:col-span-3">02 / Perspective</p>
          <div className="md:col-span-9">
            <h2 id="perspective-heading" className="max-w-3xl text-3xl font-medium leading-tight tracking-tight md:text-5xl">The circumstances matter<br />as much as the interface.</h2>
            <div className="mt-8 grid gap-6 text-base leading-relaxed text-muted md:grid-cols-2">
              <p>My work is shaped by life in Sierra Leone and by the organisations I work with. In AEEM, the challenge was helping people understand the mission, inspect the work and find their way into it.</p>
              <p>I’m interested in the choices that make a product useful: what to explain, what to leave out and what needs testing. I share those choices so other developers can examine and learn from the work.</p>
            </div>
            <Link prefetch={false} href="/about" className="editorial-link mt-8 inline-flex">More about my practice ↗</Link>
          </div>
        </div>
      </section>
      <section className="site-gutter border-t border-border py-12 md:py-16" aria-label="Writing and enquiries">
        <div className="mx-auto grid max-w-[var(--layout-max)] gap-8 md:grid-cols-2">
          <div><p className="editorial-kicker text-muted">For fellow developers</p><h2 className="mt-3 text-2xl font-semibold">Notes worth sharing.</h2><p className="mt-3 max-w-md text-muted">Practical guides and reflections on design, technology and the decisions behind a working product.</p><Link prefetch={false} href="/writing" className="editorial-link mt-5 inline-flex">Read the writing ↗</Link></div>
          <div className="border-t border-border pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0"><p className="editorial-kicker text-muted">For organisations</p><h2 className="mt-3 text-2xl font-semibold">Start with what needs to change.</h2><p className="mt-3 max-w-md text-muted">You don’t need a finished brief. Tell me what is happening, who it affects and what a better outcome would look like.</p><Link prefetch={false} href="/contact" className="editorial-link mt-5 inline-flex">Talk through your project ↗</Link></div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
