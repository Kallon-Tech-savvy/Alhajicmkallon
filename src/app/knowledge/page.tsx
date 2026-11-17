import type { Metadata } from 'next';
import Link from 'next/link';
import { PROTOCOL_SLUGS } from '@/lib/protocol-course';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { KNOWLEDGE_ENTRIES } from '@/packages/content/server';
import { serializeJsonLd } from '@/lib/serialize-json-ld';

export const metadata: Metadata = {
  title: 'Practical development guides and software protocol course',
  description: 'Practical development guides and a free 12-part software protocol course covering HTTP, APIs, identity, events, safe AI tools and debugging.',
  alternates: { canonical: '/knowledge' },
  openGraph: {
    title: 'Practical development guides and software protocol course | Alhaji C.M. Kallon',
    description: 'Practical development guides and a free 12-part software protocol course covering HTTP, APIs, identity, events, safe AI tools and debugging.',
    url: 'https://alhajikallon.com/knowledge',
    type: 'website',
  },
  twitter: {
    title: 'Practical development guides and software protocol course | Alhaji C.M. Kallon',
    description: 'Practical development guides and a free 12-part software protocol course covering HTTP, APIs, identity, events, safe AI tools and debugging.',
    card: 'summary_large_image',
  },
};

const paths = [
  { id: 'beginner', title: 'New to development', description: 'Start with HTML and CSS. Build a readable page, then make its layout adapt to different screens.', outcome: 'Build your first accessible, responsive page.' },
  { id: 'intermediate', title: 'Beyond the basics', description: 'You can build a page. Now practise working with real data: loading states, errors, and checking what an API sends back.', outcome: 'Handle data and failure states with confidence.' },
  { id: 'junior', title: 'Working as a junior', description: 'Turn a brief into a complete journey, review your changes and explain the evidence behind them.', outcome: 'Deliver a small feature that another developer can review.' },
] as const;

export default function KnowledgePage() {
  return (
    <main className="min-h-screen bg-midnight text-ivory">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Development and software protocols learning hub',
        url: 'https://alhajikallon.com/knowledge', description: metadata.description,
        mainEntity: { '@type': 'ItemList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Software protocols: a practical course', url: 'https://alhajikallon.com/knowledge/protocols' }, ...KNOWLEDGE_ENTRIES.map((entry, i) => ({ '@type': 'ListItem', position: i + 2, name: entry.title, url: `https://alhajikallon.com/knowledge/${entry.slug}` }))] },
      }) }} />
      <section className="page-intro site-gutter border-b border-border">
        <div className="mx-auto max-w-[var(--layout-max)]">
          <p className="mb-5 text-xs font-semibold tracking-normal text-[var(--color-accent)]">Learn · Practical guides and a free course</p>
          <h1 className="page-title max-w-4xl font-bold leading-tight tracking-tight">A clearer next step in learning to build.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">Choose where you are today. Each guide gives you a direct explanation, a practical exercise, common mistakes and primary sources to explore.</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">Experience levels overlap: a junior developer can still need a beginner explanation. Start with the skill you want to practise.</p>
          <nav aria-label="Choose a learning path" className="mt-9 grid gap-4 md:grid-cols-3">
            {paths.map((path, i) => <a key={path.id} href={`#${path.id}`} className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"><span className="text-xs text-[var(--color-accent)]">0{i + 1}</span><h2 className="mt-3 text-xl font-semibold">{path.title}</h2><p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{path.outcome}</p><span className="mt-4 inline-block text-sm text-[var(--color-accent)]">See the guides ↓</span></a>)}
          </nav>
        </div>
      </section>
      <section className="site-container py-12" aria-labelledby="protocol-course-title"><div className="grid gap-7 rounded-lg border border-border bg-surface p-6 md:grid-cols-12 md:p-8"><div className="md:col-span-8"><p className="editorial-kicker text-muted">A complete learning path · 12 lessons</p><h2 id="protocol-course-title" className="mt-3 text-3xl font-medium tracking-tight">Software protocols, with people in mind.</h2><p className="mt-3 text-sm leading-relaxed text-muted">Protocols are the agreed rules that let software systems talk to each other, like HTTP between a browser and a server.</p><p className="mt-4 max-w-2xl leading-relaxed text-muted">Trace a request, design an API, recover from failure and protect private data. Follow one realistic photo-gallery app from start to finish through practical labs, clear explanations and checkpoints you can verify.</p><p className="mt-3 text-sm text-muted">Covers HTTP, APIs, identity, events, safe AI tools and debugging.</p><p className="mt-3 text-sm text-muted">From foundations to junior practice. This course is free to read, and the core labs run on your computer without paid services or API keys.</p></div><div className="flex items-center md:col-span-4 md:justify-end"><Link prefetch={false} href="/knowledge/protocols" className="editorial-link">Explore the protocol course →</Link></div></div></section>
      <div className="site-container pb-12">
        {paths.map((path) => <section id={path.id} key={path.id} className="scroll-mt-28 border-b border-border py-10 first:pt-0">
          <h2 className="text-3xl font-semibold tracking-tight">{path.title}</h2><p className="mb-7 mt-3 max-w-2xl leading-relaxed text-[var(--color-muted)]">{path.description}</p>
          <ol className="grid gap-4 md:grid-cols-2">{KNOWLEDGE_ENTRIES.filter((entry) => entry.level === path.id && !PROTOCOL_SLUGS.has(entry.slug)).map((entry, i) => <li key={entry.slug}><Link prefetch={false} href={`/knowledge/${entry.slug}`} className="group block h-full rounded-xl border border-border p-6 transition-colors hover:border-[var(--color-accent)]"><p className="text-xs tracking-normal text-[var(--color-accent)]">Step {i + 1} · {entry.category}</p><h3 className="mt-3 text-xl font-semibold group-hover:text-[var(--color-accent)]">{entry.title}</h3><p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{entry.excerpt}</p><p className="mt-5 text-xs text-[var(--color-muted)]">Read: {entry.readTime?.replace(/\s+with\s+practice$/i, '') ?? 'time varies'} · Includes practice · Published <time dateTime={entry.date}>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(entry.date + 'T12:00:00Z'))}</time></p><span className="mt-4 inline-block text-sm text-[var(--color-accent)]">Read and practise →</span></Link></li>)}</ol>
        </section>)}
        <aside className="mt-10 max-w-3xl text-sm leading-relaxed text-[var(--color-muted)]"><h2 className="mb-3 text-lg font-semibold text-ivory">How this library is curated</h2><p>Each guide answers one question, shows what you need to know first, and links to official documentation. The exercises are for practice, not a certificate. Links are there to help you go deeper.</p><p className="mt-3">See the ideas applied in <Link prefetch={false} href="/work" className="text-[var(--color-accent)] underline underline-offset-4">project case studies</Link>, or <Link prefetch={false} href="/contact" className="text-[var(--color-accent)] underline underline-offset-4">suggest a correction or topic</Link>.</p></aside>
      </div>
      <div className="site-container border-t border-border py-10">
        <p className="editorial-kicker text-accent">Keep learning</p>
        <h2 className="mt-3 text-2xl font-medium">Missing something?</h2>
        <p className="mt-3 text-muted">Tell me which topic you want next, or point out a mistake.</p>
        <Link prefetch={false} href="/contact" className="editorial-link mt-4">Suggest a topic ↗</Link>
      </div>
      <Footer showInvitation={false} />
    </main>
  );
}
