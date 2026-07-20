import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NewsletterCTA } from '@/components/NewsletterCTA';
import { ARTICLES } from '@/lib/content'; // Assumed static dataset
import { ArrowUpRight, Search, Tag } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { UnicornBackground } from '@/components/UnicornBackground';

export default function WritingPage() {
  const categories = Array.from(new Set(ARTICLES.map(a => a.category)));

  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-gold/30">
      <Navbar />
      
      {/* Header */}
      <section className="pt-48 pb-24 px-6 relative overflow-hidden">
        {/* Subtle animated backdrop — replace projectId with your unicorn.studio scene */}
        <UnicornBackground
          projectId="YOUR_UNICORN_STUDIO_PROJECT_ID"
          fallbackClassName="bg-gradient-to-br from-[var(--color-pride-blue)]/8 via-transparent to-transparent"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal variant="fade" as="span" className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6 block">
            Knowledge & Reflections
          </Reveal>
          <Reveal variant="up" delay={100} as="h1" className="font-space text-6xl md:text-9xl font-black tracking-tighter mb-12 leading-[0.85] uppercase">
            WRITING & <br /><span className="text-gradient">IDEAS</span>
          </Reveal>
        </div>
        <div className="absolute top-1/2 left-0 text-white/[0.01] font-space text-[30vw] font-black leading-none pointer-events-none select-none -translate-x-1/4">
          THINK
        </div>
      </section>

      {/* Control Strip — frosted, sticky-ready layering */}
      <section className="sticky top-0 z-20 py-8 px-6 border-y border-white/5 glass-frost-bar">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button className="px-5 py-2 bg-gold text-midnight font-space font-bold text-[10px] uppercase tracking-widest rounded-full tap-scale transition-transform">
              All Topics
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className="px-5 py-2 border border-white/10 text-muted hover:text-ivory hover:border-ivory font-space font-bold text-[10px] uppercase tracking-widest rounded-full transition-all duration-300 tap-scale"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={14} />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/10 text-ivory font-inter text-xs outline-none focus:border-gold/40 transition-colors duration-300 rounded-sm"
            />
          </div>
        </div>
      </section>

      {/* Article List Grid — staggered entrance, frosted rows, content-visibility for offscreen cost savings */}
      <section className="py-24 px-6 cv-auto">
        <div className="max-w-7xl mx-auto space-y-4">
          {ARTICLES.map((article, i) => (
            <Reveal key={article.slug} variant="up" delay={Math.min(i, 6) * 60}>
              <Link
                href={`/writing/${article.slug}`}
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center p-6 md:p-8 border border-white/5 hover:border-gold/20 glass-frost-light hover-lift transition-colors duration-300 rounded-sm block"
              >
                {/* Meta Timeline Column */}
                <div className="md:col-span-2 space-y-1">
                  <div className="text-gold font-space font-black text-xs uppercase tracking-[0.15em]">{article.date}</div>
                  <div className="text-muted font-space text-[9px] font-bold uppercase tracking-widest">{article.readTime}</div>
                </div>

                {/* Context Overview Column */}
                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag size={10} className="text-gold/70" />
                    <span className="text-gold/80 font-space text-[9px] font-black uppercase tracking-widest">{article.category}</span>
                  </div>
                  <h2 className="font-space text-2xl md:text-3xl font-bold tracking-tight text-ivory group-hover:text-gold transition-colors duration-300 leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-muted text-base font-inter font-light leading-relaxed line-clamp-2 pt-1">
                    {article.excerpt}
                  </p>
                </div>

                {/* Vector Direction Column */}
                <div className="md:col-span-2 text-right hidden md:block">
                  <div className="inline-flex p-3 rounded-full border border-white/5 text-muted/60 group-hover:text-gold group-hover:border-gold/40 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <NewsletterCTA />
      <Footer />
    </main>
  );
}