'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const articles = [
  {
    title: "The Renaissance of African Technology",
    desc: "How local innovators are bypassing traditional infrastructure to build a digital-first continent.",
    readTime: "8 min read",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Leadership in the Age of AI",
    desc: "Why human-centric innovation is the most critical asset for the next generation of engineers.",
    readTime: "5 min read",
    category: "Leadership",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Designing for the Next Billion",
    desc: "A framework for creating products that are both technically sophisticated and locally relevant.",
    readTime: "12 min read",
    category: "Design",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800"
  }
];

export const ThoughtLeadership = () => {
  return (
    <section id="insights" className="py-24 bg-navy px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-space text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
              Insights
            </span>
            <h2 className="font-space text-4xl md:text-5xl font-bold tracking-tighter">
              Thought <span className="text-gold italic font-cormorant font-medium px-1">Leadership</span>
            </h2>
          </div>
          <button className="text-muted hover:text-gold transition-colors font-space text-xs font-bold uppercase tracking-widest flex items-center gap-2 group">
            All Articles <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {articles.map((article, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-8 border border-white/5">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[0.5] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-midnight/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-6 left-6 bg-midnight/90 backdrop-blur-md px-3 py-1 rounded text-[10px] font-space font-bold uppercase tracking-widest text-gold border border-gold/20">
                  {article.category}
                </div>
              </div>

              <h3 className="text-2xl font-space font-bold mb-4 group-hover:text-gold transition-colors leading-snug tracking-tight">
                {article.title}
              </h3>
              <p className="text-muted text-base font-inter leading-relaxed mb-8 flex-1">
                {article.desc}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-[10px] font-space font-bold uppercase tracking-widest text-muted/60 flex items-center gap-2">
                  <BookOpen size={14} className="text-gold/50" /> {article.readTime}
                </span>
                <span className="text-[10px] font-space font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                  READ <ArrowRight size={12} />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
