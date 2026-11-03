import { JOURNAL_ENTRIES } from '@/lib/content';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const ThoughtLeadership = () => {
  return (
    <section id="insights" className="section-space bg-navy/30 site-gutter border-y border-border">
      <div className="max-w-[var(--layout-max)] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
          <div>
            <span className="font-display text-accent text-xs font-bold tracking-[0.16em] uppercase mb-6 block">
              Writing & Insights
            </span>
            <h2 className="section-title font-display text-5xl md:text-7xl font-bold tracking-tighter leading-none">
              THOUGHT <br /><span className="text-muted">LEADERSHIP</span>
            </h2>
          </div>
          <Link prefetch={false}
            href="/writing"
            className="px-10 py-5 border border-border text-ivory font-display font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-3"
          >
            All Articles <BookOpen size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {JOURNAL_ENTRIES.length ? JOURNAL_ENTRIES.map((article, i) => (
            <div
              key={article.slug}    
              className="glass p-8 rounded-xl group relative flex flex-col h-full hover:border-accent/30 transition-colors duration-500"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-accent font-display text-xs font-black uppercase tracking-widest px-3 py-1 bg-accent/10 rounded-full">
                  {article.category}
                </span>
                <span className="text-muted font-display text-xs font-bold uppercase tracking-widest">
                  {article.date}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold mb-6 group-hover:text-accent transition-colors leading-tight">
                {article.title}
              </h3>

              <p className="text-muted text-sm font-body mb-12 flex-grow leading-relaxed">
                {article.excerpt}
              </p>

              <Link prefetch={false}
                href={`/writing/${article.slug}`}
                className="mt-auto flex items-center gap-2 font-display text-xs font-black uppercase tracking-[0.2em] text-ivory group-hover:text-accent transition-colors"
              >
                Read Article <ArrowUpRight size={14} />
              </Link>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-accent opacity-0 group-hover:opacity-10 transition-opacity" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
            </div>
          )) : (
            <div className="md:col-span-3 border border-border p-8 md:p-12">
              <h3 className="font-display text-2xl font-bold mb-3">Writing will appear here when ready</h3>
              <p className="max-w-2xl text-muted leading-relaxed">Only authored and reviewed journal entries are featured. The library currently has no published articles.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
