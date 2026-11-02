import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { KNOWLEDGE_ENTRIES } from '@/lib/content';
import { serializeJsonLd } from '@/lib/serialize-json-ld';

export const metadata = {
  title: 'Learn frontend development: beginner to junior developer',
  description: 'Practical HTML, CSS, JavaScript, TypeScript and delivery guides, organised by starting point. Read a clear answer, try an exercise and check your understanding.',
  alternates: { canonical: '/knowledge' },
};

const paths = [
  { id: 'beginner', title: 'New to development', description: 'Start with HTML and CSS. Build a readable page, then make its layout adapt to different screens.', outcome: 'Build your first accessible, responsive page.' },
  { id: 'intermediate', title: 'Beyond the basics', description: 'You can build a page. Now practise API states, data boundaries and reliable interactions.', outcome: 'Handle data and failure states with confidence.' },
  { id: 'junior', title: 'Working as a junior', description: 'Turn a brief into a complete journey, review your changes and explain the evidence behind them.', outcome: 'Deliver a small feature that another developer can review.' },
] as const;

export default function KnowledgePage() {
  return (
    <main className="min-h-screen bg-midnight text-ivory">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Frontend development learning hub',
        url: 'https://alhajikallon.com/knowledge', description: metadata.description,
        mainEntity: { '@type': 'ItemList', itemListElement: KNOWLEDGE_ENTRIES.map((entry, i) => ({ '@type': 'ListItem', position: i + 1, name: entry.title, url: `https://alhajikallon.com/knowledge/${entry.slug}` })) },
      }) }} />
      <section className="px-6 pb-14 pt-36 md:pt-44 border-b border-white/10">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#A8C9FF]">Knowledge hub · Learn by building</p>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">A clearer next step in frontend development.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#C0C9D5]">Choose where you are today. Each guide gives you a direct explanation, a practical exercise, common mistakes and primary sources to explore.</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#C0C9D5]">Experience levels overlap: a junior developer can still need a beginner explanation. Start with the skill you want to practise.</p>
          <nav aria-label="Choose a learning path" className="mt-9 grid gap-4 md:grid-cols-3">
            {paths.map((path, i) => <a key={path.id} href={`#${path.id}`} className="rounded-xl border border-white/20 bg-white/[0.03] p-6 transition-colors hover:border-[#A8C9FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A8C9FF]"><span className="text-xs text-[#A8C9FF]">0{i + 1}</span><h2 className="mt-3 text-xl font-semibold">{path.title}</h2><p className="mt-3 text-sm leading-relaxed text-[#C0C9D5]">{path.outcome}</p><span className="mt-4 inline-block text-sm text-[#A8C9FF]">Explore this path ↓</span></a>)}
          </nav>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6 py-12">
        {paths.map((path) => <section id={path.id} key={path.id} className="scroll-mt-28 border-b border-white/10 py-10 first:pt-0">
          <h2 className="text-3xl font-semibold tracking-tight">{path.title}</h2><p className="mb-7 mt-3 max-w-2xl leading-relaxed text-[#C0C9D5]">{path.description}</p>
          <ol className="grid gap-4 md:grid-cols-2">{KNOWLEDGE_ENTRIES.filter((entry) => entry.level === path.id).map((entry, i) => <li key={entry.slug}><Link prefetch={false} href={`/knowledge/${entry.slug}`} className="group block h-full rounded-xl border border-white/15 p-6 transition-colors hover:border-[#A8C9FF]"><p className="text-xs uppercase tracking-widest text-[#A8C9FF]">Step {i + 1} · {entry.category}</p><h3 className="mt-3 text-xl font-semibold group-hover:text-[#A8C9FF]">{entry.title}</h3><p className="mt-3 text-sm leading-relaxed text-[#C0C9D5]">{entry.excerpt}</p><p className="mt-5 text-xs text-[#C0C9D5]">{entry.readTime} · Published <time dateTime={entry.date}>{entry.date}</time></p><span className="mt-4 inline-block text-sm text-[#A8C9FF]">Read and practise →</span></Link></li>)}</ol>
        </section>)}
        <aside className="mt-10 max-w-3xl text-sm leading-relaxed text-[#C0C9D5]"><h2 className="mb-3 text-lg font-semibold text-ivory">How this library is curated</h2><p>Guides focus on one useful question, make prerequisites visible and link to primary documentation. Exercises are suggestions for practice, not proof of professional competence. Source links support further study; they do not imply endorsement.</p><p className="mt-3">See the ideas applied in <Link prefetch={false} href="/work" className="text-[#A8C9FF] underline underline-offset-4">project case studies</Link>, or <Link prefetch={false} href="/contact" className="text-[#A8C9FF] underline underline-offset-4">suggest a correction or topic</Link>.</p></aside>
      </div>
      <Footer />
    </main>
  );
}
