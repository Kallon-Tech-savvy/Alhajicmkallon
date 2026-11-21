import Link from 'next/link';
import { SUBSTACK_URL } from '@/lib/public-channels';

export const NewsletterCTA = ({ latestNoteHref }: { latestNoteHref?: string }) => (
  <section className="section-space site-gutter border-t border-border">
    <div className="mx-auto grid max-w-[var(--layout-max)] gap-6 md:grid-cols-12">
      <p className="editorial-kicker text-accent md:col-span-3">Stay in touch</p>
      <div className="md:col-span-9">
        <h2 className="section-title font-semibold">Think clearly. Build usefully.</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          Notes on product decisions, technology and building digital products, with the reasoning
          left visible.
        </p>
        {latestNoteHref ? (
          <Link prefetch={false} href={latestNoteHref} className="editorial-link mt-5">
            Read the latest notes ↗
          </Link>
        ) : (
          <a href={`${SUBSTACK_URL}/subscribe`} className="editorial-link mt-5">
            Follow on Substack ↗
          </a>
        )}
      </div>
    </div>
  </section>
);
