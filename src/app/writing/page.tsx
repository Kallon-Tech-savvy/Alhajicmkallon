'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NewsletterCTA } from '@/components/NewsletterCTA';
import { ARTICLES } from '@/lib/content';
import { ArrowUpRight, Search, Tag } from 'lucide-react';
import Link from 'next/link';

export default function WritingPage() {
  const categories = Array.from(new Set(ARTICLES.map(a => a.category)));

  return (
    <main className="min-h-screen bg-midnight">
      <Navbar />

      {/* Header */}
      <section className="pt-48 pb-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase mb-8 block">
              Knowledge & Reflections
            </span>
            <h1 className="font-space text-6xl md:text-9xl font-black tracking-tighter mb-16 leading-[0.85]">
              WRITING & <br /><span className="text-gradient">IDEAS</span>
            </h1>
          </motion.div>
        </div>

        <div className="absolute top-1/2 left-0 text-white/[0.02] font-space text-[30vw] font-black leading-none pointer-events-none select-none -translate-x-1/4">
          THINK
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="py-12 px-6 border-y border-white/5 bg-navy/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-2 bg-gold text-midnight font-space font-bold text-[10px] uppercase tracking-widest rounded-full">All Topics</button>
            {categories.map(cat => (
              <button key={cat} className="px-6 py-2 border border-white/10 text-muted hover:text-ivory hover:border-ivory font-space font-bold text-[10px] uppercase tracking-widest rounded-full transition-all">
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-12 pr-6 py-3 bg-white/5 border border-white/10 text-ivory font-inter text-sm outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Article List */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12">
          {ARTICLES.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/writing/${article.slug}`} className="group grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-8 border border-white/5 hover:border-gold/30 hover:bg-white/[0.02] transition-all duration-500 rounded-sm">
                <div className="md:col-span-2">
                  <div className="text-gold font-space font-black text-xs uppercase tracking-[0.2em]">{article.date}</div>
                  <div className="text-muted font-space text-[10px] font-bold uppercase tracking-widest mt-2">{article.readTime}</div>
                </div>

                <div className="md:col-span-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Tag size={12} className="text-gold" />
                    <span className="text-gold font-space text-[10px] font-black uppercase tracking-widest">{article.category}</span>
                  </div>
                  <h2 className="font-space text-3xl md:text-4xl font-bold tracking-tighter text-ivory group-hover:text-gold transition-colors leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-muted text-lg font-inter mt-4 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                <div className="md:col-span-2 text-right hidden md:block">
                  <div className="inline-flex p-4 rounded-full border border-white/10 text-muted group-hover:text-gold group-hover:border-gold transition-all group-hover:rotate-45 transform">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <NewsletterCTA />
      <Footer />
    </main>
  );
}
