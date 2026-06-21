'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ARTICLES } from '@/lib/content';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const ThoughtLeadership = () => {
  return (
    <section id="insights" className="py-32 bg-navy/30 px-6 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-24 gap-8">
          <div>
            <span className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6 block">
              Writing & Insights
            </span>
            <h2 className="font-space text-5xl md:text-7xl font-bold tracking-tighter leading-none">
              THOUGHT <br /><span className="text-muted">LEADERSHIP</span>
            </h2>
          </div>
          <Link
            href="/writing"
            className="px-10 py-5 border border-white/10 text-ivory font-space font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-3"
          >
            All Articles <BookOpen size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-sm group relative flex flex-col h-full hover:border-gold/30 transition-colors duration-500"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-gold font-space text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gold/10 rounded-full">
                  {article.category}
                </span>
                <span className="text-muted font-space text-[10px] font-bold uppercase tracking-widest">
                  {article.date}
                </span>
              </div>

              <h3 className="font-space text-2xl font-bold mb-6 group-hover:text-gold transition-colors leading-tight">
                {article.title}
              </h3>

              <p className="text-muted text-sm font-inter mb-12 flex-grow leading-relaxed">
                {article.excerpt}
              </p>

              <Link
                href={`/writing/${article.slug}`}
                className="mt-auto flex items-center gap-2 font-space text-[10px] font-black uppercase tracking-[0.2em] text-ivory group-hover:text-gold transition-colors"
              >
                Read Article <ArrowUpRight size={14} />
              </Link>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gold opacity-0 group-hover:opacity-10 transition-opacity" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
