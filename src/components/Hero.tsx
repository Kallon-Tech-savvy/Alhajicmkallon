import Image from 'next/image';
import Link from 'next/link';

export const Hero = () => (
  <section className="editorial-hero site-gutter">
    <div className="mx-auto max-w-[var(--layout-max)]">
      <div className="editorial-kicker flex flex-wrap justify-between gap-3 border-b border-border pb-5">
        <span>Alhaji C.M. Kallon · Design engineer</span>
        <span>Freetown, Sierra Leone</span>
      </div>
      <div className="grid gap-8 pb-10 pt-10 md:grid-cols-12 md:pb-14 md:pt-14">
        <div className="md:col-span-8">
          <p className="editorial-kicker mb-5 text-accent">Independent thinking. Working products.</p>
          <h1 className="editorial-headline">Make the idea clear.<br /><span className="text-accent">Make it useful.</span></h1>
        </div>
        <div className="flex flex-col justify-end md:col-span-4">
          <p className="max-w-lg text-base leading-relaxed text-muted md:text-lg">I help organisations understand the problem, shape the experience and build digital products people can use.</p>
          <Link prefetch={false} href="/work/aeem-digital-presence" className="editorial-link mt-6 self-start">Explore the AEEM case study <span aria-hidden="true">↗</span></Link>
          <div className="mt-8 hidden items-center gap-4 lg:flex">
            <Image src="/assets/kallon1.png" alt="Alhaji C.M. Kallon" width={56} height={56} loading="lazy" sizes="56px" className="h-14 w-14 rounded-full object-cover grayscale" />
            <p className="text-xs leading-relaxed text-muted">Designing from Sierra Leone.<br />Sharing the decisions behind the work.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
