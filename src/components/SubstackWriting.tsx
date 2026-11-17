import 'server-only';
import { Suspense } from 'react';
import { loadSubstackFeed } from '@/lib/substack-feed.mjs';
import { SUBSTACK_URL } from '@/lib/public-channels';

// Only verified published articles belong in this fallback.
const RECOMMENDED = [{
  title: 'Sierra Leone’s Salone Pement Switch: The Game-Changer Fueling National Financial Uprising',
  href: 'https://alhajicmkallon.substack.com/p/sierra-leones-salone-pement-switch',
  summary: 'A look at the Salone Payment Switch and what interoperable digital payments could mean for Sierra Leone.',
}] as const;

async function RecentSubstackPosts() {
  // Cached server-side RSS; no browser CORS or client-side feed parsing.
  const { posts, available } = await loadSubstackFeed();
  const recommendedUrls = new Set<string>(RECOMMENDED.map((item) => item.href));
  const recent = posts.filter((post) => !recommendedUrls.has(post.href));

  return (
    <>
      {recent.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 text-lg font-medium">Recent essays</h3>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((post) => (
              <article key={post.href} className="ui-panel flex flex-col p-6">
                {post.date && (
                  <time dateTime={post.date} className="mb-3 text-xs text-muted">
                    {new Intl.DateTimeFormat('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
                    }).format(new Date(post.date))}
                  </time>
                )}
                <h4 className="text-xl font-semibold">
                  <a href={post.href} className="text-ivory hover:text-accent">{post.title}</a>
                </h4>
                {post.excerpt && (
                  <p className="mt-4 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                )}
                <a href={post.href} className="mt-auto pt-6 text-sm font-semibold text-accent"
                  aria-label={`Read ${post.title} on Substack`}>Read on Substack ↗</a>
              </article>
            ))}
          </div>
        </div>
      )}
      {!available && (
        <p className="mt-6 text-sm text-muted" role="status">
          I can’t show the latest essays here right now. You can read them on Substack.
        </p>
      )}
    </>
  );
}

/** The curated reading stays visible while the optional feed loads or fails. */
export function SubstackWriting() {
  return (
    <section aria-labelledby="substack-heading" className="section-space site-gutter border-t border-border">
      <div className="mx-auto max-w-[var(--layout-max)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent">From my Substack</p>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <h2 id="substack-heading" className="section-title font-bold">
              Technology, society and the questions between.
            </h2>
            <p className="mt-4 text-muted">
              Essays on technology and society, published on Substack. Read them there,
              or subscribe to get new ones by email.
            </p>
          </div>
          <a href={`${SUBSTACK_URL}/subscribe`} className="ui-primary">Subscribe on Substack ↗</a>
        </div>
        <div aria-label="Recommended Substack reading">
          <h3 className="mb-4 text-lg font-medium">Start here</h3>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {RECOMMENDED.map((post) => (
              <article key={post.href} className="ui-panel flex flex-col p-6">
                <h4 className="text-xl font-semibold">
                  <a href={post.href} className="text-ivory hover:text-accent">{post.title}</a>
                </h4>
                <p className="mt-4 text-sm leading-relaxed text-muted">{post.summary}</p>
                <a href={post.href} className="mt-auto pt-6 text-sm font-semibold text-accent">
                  Read the essay on Substack ↗
                </a>
              </article>
            ))}
          </div>
        </div>
        <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading recent essays…</p>}>
          <RecentSubstackPosts />
        </Suspense>
        <div className="mt-7 flex flex-wrap items-center gap-6 text-sm">
          <a href={SUBSTACK_URL} className="text-accent underline underline-offset-4">Visit my Substack ↗</a>
          <a href={`${SUBSTACK_URL}/feed`} className="text-accent underline underline-offset-4"
            type="application/rss+xml">Follow the RSS feed ↗</a>
        </div>
      </div>
    </section>
  );
}
