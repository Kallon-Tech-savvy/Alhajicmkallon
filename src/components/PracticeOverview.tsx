import Link from 'next/link';

/**
 * Visible, server-rendered answers to the questions visitors and search engines
 * need answered before choosing a case study or making an enquiry.
 */
export function PracticeOverview() {
  return (
    <section aria-labelledby="practice-heading" className="border-t border-border bg-surface site-gutter section-space">
      <div className="mx-auto grid max-w-[var(--layout-max)] gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-accent)]">What I do</p>
          <h2 id="practice-heading" className="max-w-[18ch] text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            Design engineering, from problem discovery to working software.
          </h2>
        </div>
        <div className="space-y-8 lg:col-span-7">
          <p className="max-w-[58ch] text-lg leading-8 text-[var(--color-muted)]">
            I work with founders, businesses and organisations to understand users, decide what to build,
            design accessible experiences and develop useful digital products. I’m based in Freetown, Sierra Leone.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border-l-2 border-[var(--color-accent)] pl-5">
              <h3 className="mb-2 text-lg font-semibold text-white">Have an idea but no clear brief?</h3>
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Start with the problem, the people affected and the assumptions worth testing before building.
              </p>
              <Link prefetch={false} href="/contact" className="mt-4 inline-block text-sm font-semibold text-[var(--color-accent)] underline underline-offset-4 hover:text-white">
                Discuss an idea
              </Link>
            </div>
            <div className="border-l-2 border-[var(--color-accent)] pl-5">
              <h3 className="mb-2 text-lg font-semibold text-white">Want to see how I work?</h3>
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Explore case studies showing context, decisions, implementation and the limits of the evidence.
              </p>
              <Link prefetch={false} href="/work" className="mt-4 inline-block text-sm font-semibold text-[var(--color-accent)] underline underline-offset-4 hover:text-white">
                Read case studies
              </Link>
            </div>
          </div>
          <p className="text-sm leading-7 text-[var(--color-muted)]">
            Looking for a specific answer? <Link prefetch={false} href="/faq" className="font-semibold text-[var(--color-accent)] underline underline-offset-4 hover:text-white">Read frequently asked questions</Link> about services, process and project experience.
          </p>
        </div>
      </div>
    </section>
  );
}
