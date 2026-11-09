'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Article } from '@/lib/content';

// Only the fields used by the list and search controls cross the server/client boundary.
export type WritingListItem = Pick<Article, 'slug' | 'title' | 'excerpt' | 'category' | 'date' | 'topics'>;

export function ArticleFilters({ entries }: { entries: WritingListItem[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All topics');
  const categories = useMemo(() => ['All topics', ...Array.from(new Set(entries.map((entry) => entry.category)))], [entries]);
  const filtered = entries.filter((entry) => {
    const term = query.trim().toLocaleLowerCase();
    const matchesQuery = !term || [entry.title, entry.excerpt, entry.category, ...entry.topics].some((value) => value.toLocaleLowerCase().includes(term));
    return matchesQuery && (category === 'All topics' || entry.category === category);
  });

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 mb-8">
        <label className="sr-only" htmlFor="writing-search">Search writing</label>
        <input id="writing-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, summaries, topics…" className="ui-field" />
        <label className="sr-only" htmlFor="writing-category">Filter by topic</label>
        <select id="writing-category" value={category} onChange={(event) => setCategory(event.target.value)} className="ui-field">{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      </div>
      {filtered.length ? <div className="space-y-4">{filtered.map((entry) => <Link key={entry.slug} href={`/writing/${entry.slug}`} className="block border border-border p-6 hover:border-accent/40 transition-colors"><p className="text-accent text-xs uppercase tracking-widest mb-3">{entry.category} · {entry.date}</p><h2 className="font-display text-2xl font-bold mb-3">{entry.title}</h2><p className="text-muted leading-relaxed">{entry.excerpt}</p></Link>)}</div> : <p className="border border-border p-6 text-muted" role="status">{entries.length ? 'No writing matches those filters. Try another search or topic.' : 'No writing has been published yet.'}</p>}
    </div>
  );
}
