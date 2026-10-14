import Link from 'next/link';

const onboardingOptions = [
  {
    id: 'launch',
    title: 'Clarify a product idea',
    summary: 'For an idea that needs a sharper problem, a clearer value proposition, or a sensible first version.',
    cta: 'Discuss your idea',
    href: '/contact',
  },
  {
    id: 'explore',
    title: 'Explore the work',
    summary: 'Explore the problem, decisions, and implementation behind real projects.',
    cta: 'Read the case studies',
    href: '/work',
  },
  {
    id: 'read',
    title: 'Read the thinking',
    summary: 'Read practical notes on product thinking, technology, and how useful digital products get made.',
    cta: 'Explore the writing',
    href: '/writing',
  },
] as const;

/**
 * Static server-rendered visitor routes keep the homepage journey useful
 * without shipping client-side state just to reveal one of three links.
 */
export function VisitorPath() {
  return (
    <section className="border-t border-[#2A2A2A] bg-[#0A0A0A] px-6 py-20 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.35em] text-pride-blue">
            Start where you are
          </p>
          <h2 className="font-space text-2xl font-black tracking-[-0.02em] text-ivory md:text-3xl">
            What are you working through?
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#9aa4b2]">
            Whether you have an early idea, want to see how I work, or are here to learn, start with the path that fits.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {onboardingOptions.map((option) => (
            <article
              key={option.id}
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-200 hover:border-pride-blue/35"
            >
              <h3 className="mb-3 font-space text-lg font-bold text-ivory">
                {option.title}
              </h3>
              <p className="mb-6 flex-1 text-sm leading-7 text-[#9aa4b2]">
                {option.summary}
              </p>
              <Link
                href={option.href}
                className="inline-flex w-fit items-center justify-center rounded-full border border-pride-blue bg-pride-blue/12 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-pride-blue transition-colors duration-200 hover:bg-pride-blue/20"
              >
                {option.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
