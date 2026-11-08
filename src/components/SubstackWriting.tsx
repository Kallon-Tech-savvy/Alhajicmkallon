import 'server-only';
import { loadSubstackFeed } from '@/lib/substack-feed.mjs';
import { SUBSTACK_URL } from '@/lib/public-channels';

export async function SubstackWriting() {
  const { posts, available } = await loadSubstackFeed();
  return (
    <section aria-labelledby="substack-heading" className="section-space site-gutter border-t border-border">
      <div className="mx-auto max-w-[var(--layout-max)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent">From my Substack</p>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <h2 id="substack-heading" className="section-title font-bold">Technology, society and the questions between.</h2>
            <p className="mt-4 text-muted">Recent essays from my publication. Read the full stories and subscribe on Substack.</p>
          </div>
          <a href={`${SUBSTACK_URL}/subscribe`} className="ui-primary">Subscribe on Substack ↗</a>
        </div>
        {posts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => <article key={post.href} className="ui-panel flex flex-col p-6">
              {post.date && <time dateTime={post.date} className="mb-3 text-xs text-muted">{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(post.date))}</time>}
              <h3 className="text-xl font-semibold"><a href={post.href} className="text-ivory hover:text-accent">{post.title}</a></h3>
              {post.excerpt && <p className="mt-4 text-sm leading-relaxed text-muted">{post.excerpt}</p>}
              <a href={post.href} className="mt-auto pt-6 text-sm font-semibold text-accent" aria-label={`Read ${post.title} on Substack`}>Read on Substack ↗</a>
            </article>)}
          </div>
        ) : <p className="ui-panel p-6 text-muted">{available ? 'Explore my essays directly on Substack.' : 'The latest essays could not be loaded here right now.'} <a href={SUBSTACK_URL} className="text-accent underline underline-offset-4">Visit my publication ↗</a></p>}
      </div>
    </section>
  );
}
