import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MarkdownContent } from './MarkdownContent';

export function AEEMCaseStudy({ source, liveUrl }: { source: string; liveUrl: string }) {
  const sections = [...source.matchAll(/^## (.+)$/gm)].map(match => ({ title: match[1], id: match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }));
  return <main className="editorial-page min-h-screen">
    <Navbar />
    <header className="editorial-hero site-gutter pb-10 md:pb-14">
      <div className="mx-auto max-w-[var(--layout-max)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5"><Link prefetch={false} href="/work" className="text-sm text-accent underline underline-offset-4">← Selected work</Link><p className="editorial-kicker text-muted">Case study / 01</p></div>
        <div className="grid gap-8 pt-10 md:grid-cols-12 md:pt-14">
          <div className="md:col-span-8"><p className="editorial-kicker mb-5 text-accent">AEEM · Education · Sierra Leone</p><h1 className="editorial-headline editorial-case-title">Good work needs<br />a clearer way in.</h1></div>
          <div className="flex flex-col justify-end md:col-span-4"><p className="text-lg leading-relaxed text-muted">A website for understanding the organisation, exploring its documented activities and finding a way to participate.</p><a href={liveUrl} target="_blank" rel="noopener noreferrer" className="editorial-link mt-6 self-start">Visit the working website ↗</a></div>
        </div>
        <dl className="mt-10 grid gap-6 border-t border-border pt-6 text-sm md:grid-cols-3"><div><dt className="editorial-kicker text-muted">My contribution</dt><dd className="mt-2 leading-relaxed">Product thinking, content, UX and web development</dd></div><div><dt className="editorial-kicker text-muted">Product status</dt><dd className="mt-2">Live and in use</dd></div><div><dt className="editorial-kicker text-muted">Evidence available</dt><dd className="mt-2 leading-relaxed">Working product and core-team feedback. Public outcomes not yet measured.</dd></div></dl>
      </div>
    </header>
    <figure className="site-gutter mx-auto max-w-[calc(var(--layout-max)+var(--page-gutter)*2)]"><div className="editorial-project-image"><Image src="/assets/aeem-live-home.webp" alt="AEEM's live homepage, showing the education mission, main navigation and links to impact and upcoming events" width={1356} height={931} sizes="(max-width: 768px) 100vw, 1152px" className="h-auto w-full" /></div><figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-xs leading-relaxed text-muted"><span>01 / The working AEEM homepage.</span><span>Captured 8 November 2026. Live content may change.</span></figcaption></figure>
    <section className="site-gutter py-12 md:py-20">
      <div className="mx-auto grid max-w-[var(--layout-max)] gap-10 lg:grid-cols-12">
        <aside className="lg:col-span-3"><nav aria-label="Case study sections" className="lg:sticky lg:top-28"><p className="editorial-kicker mb-5 text-accent">Inside the project</p><ol className="grid gap-3 text-sm leading-relaxed">{sections.map((section, i) => <li key={section.id}><a href={`#${section.id}`} className="flex gap-3 text-muted hover:text-accent"><span className="font-mono text-xs" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><span>{section.title}</span></a></li>)}</ol></nav></aside>
        <article className="editorial-story max-w-3xl lg:col-span-8 lg:col-start-5"><MarkdownContent source={source} /></article>
      </div>
    </section>
    <section className="site-gutter border-t border-border py-12 md:py-16"><div className="mx-auto grid max-w-[var(--layout-max)] gap-6 md:grid-cols-12"><p className="editorial-kicker text-accent md:col-span-3">A useful next step</p><div className="md:col-span-9"><h2 className="text-3xl font-semibold tracking-tight">Does your organisation face a similar problem?</h2><p className="mt-4 max-w-xl leading-relaxed text-muted">If people struggle to understand your work or find their way into it, tell me where the journey gets difficult.</p><Link prefetch={false} href="/contact" className="editorial-link mt-6 inline-flex">Talk through the problem ↗</Link></div></div></section>
    <Footer />
  </main>;
}
