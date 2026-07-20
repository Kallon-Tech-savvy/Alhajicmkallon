'use client';

import { useMemo, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';

const galleryItems = [
  {
    title: 'Brand system for a fintech launch',
    description: 'A modular identity system for a new African payments platform.',
    tags: ['branding', 'finance', 'identity'],
    image: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?auto=format&fit=crop&w=1200&q=80',
  },
];

const allTags = ['all', ...Array.from(new Set(galleryItems.flatMap((item) => item.tags)))];

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return galleryItems.filter((item) => {
      const matchesTag = selectedTag === 'all' || item.tags.includes(selectedTag);
      const matchesQuery =
        !query || [item.title, item.description, ...item.tags].some((field) => field.toLowerCase().includes(query));
      return matchesTag && matchesQuery;
    });
  }, [searchQuery, selectedTag]);

  return (
    <main className="min-h-screen bg-midnight text-ivory">
      <Navbar />

      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal variant="up" className="mb-10">
            <p className="font-space text-xs uppercase tracking-[0.35em] text-pride-blue mb-4">
              visual case studies
            </p>
            <h1 className="font-space text-5xl md:text-6xl font-black tracking-[-0.03em] leading-tight">
              Gallery.
            </h1>
            <p className="mt-4 max-w-3xl text-base text-muted leading-8">
              A curated collection of creative explorations, product visuals, and polished system work arranged in a masonry-inspired gallery.
            </p>
          </Reveal>

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} shown
              </p>
            </div>
            <label className="relative w-full md:w-80 block">
              <span className="sr-only">Filter gallery</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search gallery by title, tag, or description"
                className="w-full rounded-full border border-white/10 bg-[#0F0F0F] py-3 px-4 pr-12 text-sm text-ivory outline-none transition focus:border-pride-blue/50 focus:ring-2 focus:ring-pride-blue/10"
                aria-label="Filter gallery"
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 grid place-content-center text-sm text-muted">
                🔍
              </span>
            </label>
          </div>

          <div className="mb-10 flex flex-wrap gap-3">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  selectedTag === tag
                    ? 'border-pride-blue bg-pride-blue/15 text-pride-blue'
                    : 'border-white/10 bg-white/[0.03] text-muted hover:border-pride-blue/30 hover:text-ivory'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="gallery-grid mt-12">
            {filteredItems.map((item, index) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0D0D0D] shadow-[0_35px_100px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="overflow-hidden rounded-[1.5rem] bg-black">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-space text-2xl font-black tracking-[-0.03em] mb-3">
                    {item.title}
                  </h2>
                  <p className="text-sm leading-7 text-muted">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="mt-16 rounded-3xl border border-white/10 bg-[#111111] p-12 text-center text-sm text-muted">
              No results found. Try a different keyword like “research”, “visual”, or “platform”.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
