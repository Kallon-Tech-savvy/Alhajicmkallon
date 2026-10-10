import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NewsletterCTA } from '@/components/NewsletterCTA';
import { ARTICLES } from '@/lib/content';
import { ArrowUpRight, Tag } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';

export default function WritingPage() {
  const articles = ARTICLES;
  const categories = Array.from(new Set(articles.map((article) => article.category)));

  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-gold/30">
      <Navbar />
      <section className="pt-48 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal variant="fade" as="span" className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6 block">Knowledge & Reflections</Reveal>
          <Reveal variant="up" delay={100} as="h1" className="font-space text-6xl md:text-9xl font-black tracking-tighter mb-12 leading-[0.85] uppercase">WRITING & <br /><span className="text-gradient">IDEAS</span></Reveal>
          <p className="max-w-2xl text-muted text-lg font-inter leading-relaxed">A growing collection of essays and durable notes. Only published, reviewed entries appear here.</p>
        </div>
        <div aria-hidden="true" className="absolute top-1/2 left-0 text-white/[0.01] font-space text-[30vw] font-black leading-none pointer-events-none select-none -translate-x-1/4">THINK</div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {categories.length > 0 && <div className="mb-8 flex flex-wrap gap-2" aria-label="Article topics">{categories.map((category) => <span key={category} className="px-4 py-2 border border-white/10 rounded-full text-xs text-muted">{category}</span>)}</div>}
          {articles.length ? (
            <div className="space-y-4">
              {articles.map((article, index) => (
                <Reveal key={article.slug} variant="up" delay={Math.min(index, 6) * 60}>
                  <Link href={`/writing/${article.slug}`} className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center p-6 md:p-8 border border-white/5 hover:border-gold/20 glass-frost-light hover-lift transition-colors duration-300 rounded-sm">
                    <div className="md:col-span-2 space-y-1"><div className="text-gold font-space font-black text-xs uppercase tracking-[0.15em]">{article.date}</div>{article.readTime && <div className="text-muted font-space text-[9px] font-bold uppercase tracking-widest">{article.readTime}</div>}</div>
                    <div className="md:col-span-8 space-y-2"><div className="flex items-center gap-2"><Tag size={10} className="text-gold/70" /><span className="text-gold/80 font-space text-[9px] font-black uppercase tracking-widest">{article.category}</span></div><h2 className="font-space text-2xl md:text-3xl font-bold tracking-tight text-ivory group-hover:text-gold transition-colors duration-300 leading-tight">{article.title}</h2><p className="text-muted text-base font-inter font-light leading-relaxed line-clamp-2 pt-1">{article.excerpt}</p></div>
                    <div className="md:col-span-2 text-right hidden md:block"><div className="inline-flex p-3 rounded-full border border-white/5 text-muted/60 group-hover:text-gold group-hover:border-gold/40 transition-all duration-300"><ArrowUpRight size={20} /></div></div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="border border-white/10 p-8 md:p-12">
              <h2 className="font-space text-2xl md:text-3xl font-bold mb-4">The writing library is being prepared</h2>
              <p className="max-w-2xl text-muted leading-relaxed">There are no public entries yet. New writing will appear here after it has been authored and reviewed; unpublished drafts are not exposed.</p>
            </div>
          )}
        </div>
      </section>
      <NewsletterCTA />
      <Footer />
    </main>
  );
}
