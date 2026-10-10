'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ARTICLES } from '@/lib/content';

export function ArticleFilters() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All topics');
  const categories = useMemo(() => ['All topics', ...Array.from(new Set(ARTICLES.map((entry) => entry.category)))], []);
  const filtered = ARTICLES.filter((entry) => {
    const term = query.trim().toLocaleLowerCase();
    const matchesQuery = !term || [entry.title, entry.excerpt, entry.content, entry.category, ...entry.topics].some((value) => value.toLocaleLowerCase().includes(term));
    return matchesQuery && (category === 'All topics' || entry.category === category);
  });

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 mb-8">
        <label className="sr-only" htmlFor="writing-search">Search writing</label>
        <input id="writing-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, ideas, topics…" className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-ivory placeholder:text-muted focus:border-gold outline-none" />
        <label className="sr-only" htmlFor="writing-category">Filter by topic</label>
        <select id="writing-category" value={category} onChange={(event) => setCategory(event.target.value)} className="bg-midnight border border-white/10 px-4 py-3 text-ivory focus:border-gold outline-none">{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      </div>
      {filtered.length ? <div className="space-y-4">{filtered.map((entry) => <Link key={entry.slug} href={`/writing/${entry.slug}`} className="block border border-white/10 p-6 hover:border-gold/40 transition-colors"><p className="text-gold text-xs uppercase tracking-widest mb-3">{entry.category} · {entry.date}</p><h2 className="font-space text-2xl font-bold mb-3">{entry.title}</h2><p className="text-muted leading-relaxed">{entry.excerpt}</p></Link>)}</div> : <p className="border border-white/10 p-6 text-muted" role="status">{ARTICLES.length ? 'No writing matches those filters. Try another search or topic.' : 'No writing has been published yet.'}</p>}
    </div>
  );
}
