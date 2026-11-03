import Image from 'next/image';
import Link from 'next/link';

const METRICS = [
  { label: '01 · Understand', value: 'Discover' },
  { label: '02 · Decide', value: 'Define' },
  { label: '03 · Shape', value: 'Design' },
  { label: '04 · Deliver', value: 'Build' },
];

export const Hero = () => (
  <section className="relative flex min-h-screen flex-col overflow-hidden bg-midnight">
    <div className="pointer-events-none absolute inset-0 select-none">
      <div
        className="absolute right-0 top-0 h-[72%] w-[48%]"
        style={{
          background: 'radial-gradient(ellipse 100% 90% at 85% 0%, rgba(0, 102, 255, 0.08) 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(26, 26, 26, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 26, 26, 0.15) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 100% 100% at 50% 0%, black 0%, transparent 65%)',
        }}
      />
    </div>

    <div className="relative z-10 flex flex-1 items-center site-gutter pb-10 pt-28">
      <div className="mx-auto grid w-full max-w-[var(--layout-max)] grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <div className="flex flex-col justify-center lg:col-span-7">
          <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
            <span className="inline-flex h-2 w-2 rounded-full bg-pride-blue" />
            <span>Design engineer · Sierra Leone</span>
          </div>

          <h1
            className="mb-6 max-w-[13ch] font-display font-black leading-[1.04] tracking-[-0.035em] text-ivory"
            style={{ fontSize: 'clamp(2.8rem, 6.2vw, 6.5rem)' }}
          >
            <span className="block">From unclear ideas</span>
            <span className="block text-[var(--color-accent)]">to useful digital products.</span>
          </h1>

          <p className="mb-8 max-w-[54ch] text-base leading-8 text-[var(--color-muted)] md:text-lg">
            I’m Alhaji C.M. Kallon, a design engineer in Sierra Leone. I help founders, businesses and organisations discover the right problem, design a clear experience and build working digital products.
          </p>

          <div className="mb-10 flex flex-col items-start gap-3 sm:flex-row">
            <div className="transition-transform duration-200 hover:-translate-y-[3px] hover:scale-[1.01]">
              <Link prefetch={false}
                href="/work"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-6 py-3 text-sm font-bold text-[var(--color-midnight)] transition-colors hover:bg-white focus-visible:outline-offset-4 ui-primary"
              >
                See the work and evidence
              </Link>
            </div>
            <div className="transition-transform duration-200 hover:-translate-y-[3px] hover:scale-[1.01]">
              <Link prefetch={false}
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 bg-surface px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-offset-4"
              >
                Discuss your project
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[var(--color-muted)]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-pride-blue" />
              Discover → Define → Design → Build
            </span>
          </div>
        </div>

        <div className="relative hidden lg:col-span-5 lg:block" style={{ height: '500px' }}>
          <div className="reveal-in absolute inset-0" style={{ animationDelay: '0.12s' }}>
            <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
              <Image
                src="/assets/kallon1.png"
                alt="Alhaji C.M. Kallon"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 42vw, 1px"
                className="object-cover"
                style={{ filter: 'grayscale(70%) contrast(1.08)' }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0, 102, 255, 0.12) 0%, transparent 50%)' }}
              />
            </div>
            <div className="absolute inset-x-4 top-4 flex items-center justify-between rounded-full border border-border bg-midnight/95 px-3 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pride-blue" />
                <span className="text-xs uppercase tracking-[0.16em] text-muted">Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="relative z-10 border-t border-border/80">
      <div className="mx-auto grid max-w-[var(--layout-max)] grid-cols-2 gap-0 site-gutter lg:grid-cols-4">
        {METRICS.map((m) => (
          <div
            key={m.label}
            className="flex flex-col gap-2 border-r border-border/80 px-4 py-6 last:border-r-0"
          >
            <span className="font-display text-lg font-semibold text-ivory">{m.value}</span>
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);