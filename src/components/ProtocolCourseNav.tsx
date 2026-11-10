import Link from 'next/link';
import { PROTOCOL_LESSONS } from '@/lib/protocol-course';

/** Native disclosure keeps the course map available without client JavaScript. */
export function ProtocolCourseNav({ currentSlug }: { currentSlug: string }) {
  const index = PROTOCOL_LESSONS.findIndex(lesson => lesson.slug === currentSlug);
  if (index < 0) return null;
  const stages = ['Foundations', 'Contracts and live updates', 'Trust and reliability', 'Integration and review'];

  return <nav aria-label="Course lesson map" className="site-gutter border-b border-border py-6">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-medium">Lesson {index + 1} of {PROTOCOL_LESSONS.length} · {stages[Math.floor(index / 3)]}</p>
      <details className="mt-3 rounded-lg border border-border bg-surface">
        <summary className="cursor-pointer px-5 py-4 font-medium text-accent">Choose a lesson</summary>
        <div className="border-t border-border p-5">
          <p className="mb-5 text-sm leading-relaxed text-muted">Follow the sequence for a first pass, or return to a specific topic. This map shows your location, not completion.</p>
          <div className="grid gap-6 sm:grid-cols-2">
            {stages.map((stage, group) => <div key={stage}>
              <h2 className="mb-2 text-sm font-semibold">{stage}</h2>
              <ol start={group * 3 + 1} className="space-y-1">
                {PROTOCOL_LESSONS.slice(group * 3, group * 3 + 3).map((lesson, offset) => {
                  const current = lesson.slug === currentSlug;
                  return <li key={lesson.slug}><Link prefetch={false} href={`/knowledge/${lesson.slug}`} aria-current={current ? 'page' : undefined} className={`flex min-h-12 gap-3 rounded-md border px-3 py-3 text-sm leading-relaxed ${current ? 'border-accent font-semibold text-ivory' : 'border-transparent text-accent hover:border-border hover:bg-midnight'}`}>
                    <span className="shrink-0 font-mono">{String(group * 3 + offset + 1).padStart(2, '0')}</span>
                    <span>{lesson.title}{current && <span className="mt-1 block text-xs font-normal text-muted">Current lesson</span>}</span>
                  </Link></li>;
                })}
              </ol>
            </div>)}
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 text-sm">
            <Link prefetch={false} href="/knowledge/protocols" className="text-accent underline underline-offset-4">Course overview and glossary</Link>
            <Link prefetch={false} href="/knowledge/protocols#offline-course-title" className="text-accent underline underline-offset-4">Offline guide and notebook</Link>
          </div>
        </div>
      </details>
    </div>
  </nav>;
}
