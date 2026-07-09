import Image from 'next/image';
import Link from 'next/link';

const METRICS = [
  { label: 'Systems shipped', value: '12+' },
  { label: 'Latency target', value: '<100ms' },
  { label: 'Uptime posture', value: '99.99%' },
  { label: 'Base · timezone', value: 'SL · WAT' },
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

    <div className="relative z-10 flex flex-1 items-center px-6 pb-10 pt-28 md:px-8 lg:px-10">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <div className="reveal-in flex flex-col justify-center lg:col-span-7">
          <div className="mb-7 flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-muted">
            <span className="inline-flex h-2 w-2 rounded-full bg-pride-blue" />
            <span>Design engineer · Sierra Leone</span>
          </div>

          <h1
            className="mb-6 font-space font-black leading-[0.92] tracking-[-0.03em] text-ivory"
            style={{ fontSize: 'clamp(2.8rem, 6.2vw, 6.5rem)' }}
          >
            <span className="block">Designing digital</span>
            <span className="block text-pride-blue">experiences that feel</span>
            <span className="block">effortless.</span>
          </h1>

          <p className="mb-8 max-w-[46ch] text-[1rem] leading-7 text-[#9aa4b2] md:text-[1.05rem]">
            I design and build calm, high-performing product experiences for founders, teams, and communities who need clarity from day one.
          </p>

          <div className="mb-10 flex flex-col items-start gap-3 sm:flex-row">
            <Link
              href="/work"
              className="inline-flex items-center justify-center rounded-full border border-pride-blue bg-pride-blue/12 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-pride-blue transition-all duration-300 hover:-translate-y-0.5 hover:bg-pride-blue/20"
            >
              View selected work
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-ivory transition-all duration-300 hover:border-pride-blue/40 hover:bg-white/[0.06]"
            >
              Start a conversation
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-pride-blue" />
              Available for select projects
            </span>
          </div>
        </div>

        <div className="relative hidden lg:col-span-5 lg:block" style={{ height: '500px' }}>
          <div className="reveal-in absolute inset-0" style={{ animationDelay: '0.12s' }}>
            <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
              <Image
                src="/assets/kallon1.png"
                alt="Alhaji C.M. Kallon"
                fill
                priority
                className="object-cover"
                style={{ filter: 'grayscale(70%) contrast(1.08)' }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0, 102, 255, 0.12) 0%, transparent 50%)' }}
              />
            </div>
            <div className="absolute inset-x-4 top-4 flex items-center justify-between rounded-full border border-white/10 bg-black/20 px-3 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pride-blue" />
                <span className="text-[10px] uppercase tracking-[0.28em] text-muted">Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="relative z-10 border-t border-border/80">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 px-6 lg:grid-cols-4 lg:px-8">
        {METRICS.map((m, i) => (
          <div
            key={m.label}
            className="flex flex-col gap-2 border-r border-border/80 px-4 py-6 last:border-r-0"
          >
            <span className="font-space text-lg font-semibold text-ivory">{m.value}</span>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#9aa4b2]">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);