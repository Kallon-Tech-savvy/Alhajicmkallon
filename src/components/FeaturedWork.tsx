import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS } from '@/lib/content';

export const FeaturedWork = () => {
  const aeem = PROJECTS.find(project => project.slug === 'aeem-digital-presence');
  const others = PROJECTS.filter(project => project.slug !== 'aeem-digital-presence');
  return (
    <section id="work" className="site-gutter pb-16 md:pb-24">
      <div className="mx-auto max-w-[var(--layout-max)]">
        <div className="mb-6 flex items-center justify-between gap-4 border-t border-border pt-5">
          <h2 className="editorial-kicker">Selected work</h2>
          <Link prefetch={false} href="/work" className="text-sm text-accent underline underline-offset-4">All projects ↗</Link>
        </div>
        {aeem && <article>
          <Link prefetch={false} href={`/work/${aeem.slug}`} className="editorial-project-image block" aria-label="Explore the AEEM case study">
            <Image src="/assets/aeem-live-home.webp" alt="The working AEEM homepage: its education mission, navigation and paths to impact and participation" width={1356} height={931} sizes="(max-width: 768px) 100vw, 1152px" className="h-auto w-full" />
          </Link>
          <div className="mt-7 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-3"><p className="editorial-kicker text-accent">AEEM · Education</p><p className="mt-3 text-sm text-muted">Working website<br />Product thinking · UX · Development</p></div>
            <div className="md:col-span-6"><h3 className="text-3xl font-medium leading-tight tracking-tight md:text-4xl"><Link prefetch={false} href={`/work/${aeem.slug}`}>Making an organisation’s work easier to understand.</Link></h3><p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">An education movement with work to show, reports to share and people who wanted to get involved. I brought those journeys into one place.</p></div>
            <div className="flex flex-col items-start gap-4 md:col-span-3 md:items-end"><Link prefetch={false} href={`/work/${aeem.slug}`} className="editorial-link">Explore the case study ↗</Link>{aeem.links?.live && <a href={aeem.links.live} target="_blank" rel="noopener noreferrer" className="text-sm text-muted underline underline-offset-4">Visit the working website ↗</a>}</div>
          </div>
        </article>}
        {others.map(project => <article key={project.slug} className="mt-12 grid gap-4 border-t border-border pt-6 md:grid-cols-12">
          <p className="editorial-kicker text-muted md:col-span-3">In development</p>
          <div className="md:col-span-6"><h3 className="text-2xl font-semibold tracking-tight"><Link prefetch={false} href={`/work/${project.slug}`}>{project.title}</Link></h3><p className="mt-3 text-sm leading-relaxed text-muted">{project.summary}</p></div>
          <Link prefetch={false} href={`/work/${project.slug}`} className="text-sm text-accent underline underline-offset-4 md:col-span-3 md:text-right">Read the development notes ↗</Link>
        </article>)}
      </div>
    </section>
  );
};
