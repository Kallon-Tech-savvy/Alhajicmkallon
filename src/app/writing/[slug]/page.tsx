'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ARTICLES } from '@/lib/content';
import { ArrowLeft, Send, Users, Link as LinkIcon, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ArticleTemplate() {
  const params = useParams();
  const article = ARTICLES.find(a => a.slug === params.slug) || ARTICLES[0];

  return (
    <main className="min-h-screen bg-midnight">
      <Navbar />

      {/* Article Header */}
      <section className="pt-48 pb-24 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <Link href="/writing" className="inline-flex items-center gap-2 text-gold font-space font-black text-xs uppercase tracking-widest mb-12 hover:translate-x-[-8px] transition-transform">
            <ArrowLeft size={16} /> Back to Writing
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="px-4 py-1 bg-gold text-midnight font-space font-black text-[10px] uppercase tracking-widest rounded-full">
                {article.category}
              </span>
              <div className="flex items-center gap-2 text-muted font-space text-[10px] font-bold uppercase tracking-widest">
                <Calendar size={12} /> {article.date}
              </div>
              <div className="flex items-center gap-2 text-muted font-space text-[10px] font-bold uppercase tracking-widest">
                <Clock size={12} /> {article.readTime}
              </div>
            </div>

            <h1 className="font-space text-4xl md:text-7xl font-bold tracking-tighter text-ivory mb-12 leading-[1.1]">
              {article.title}
            </h1>

            <p className="text-muted text-xl md:text-2xl font-inter leading-relaxed italic border-l-4 border-l-gold pl-8 py-2">
              {article.excerpt}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-24 px-6 relative">
        <div className="max-w-3xl mx-auto">
          {/* Main Body (Mock Content) */}
          <article className="prose prose-invert prose-gold max-w-none font-inter text-lg leading-relaxed text-ivory/80 space-y-8">
            <p>
              Innovation in Africa isn&apos;s just about importing Silicon Valley solutions. It&apos;s about deep empathy, localized systems, and building with resource constraints as a catalyst for creativity rather than a barrier.
            </p>

            <h2 className="font-space text-3xl font-bold text-ivory mt-16 mb-8 uppercase tracking-tighter">The Context of Freetown</h2>
            <p>
              In the bustling streets of Freetown, digital transformation looks different. It&apos;s mobile-first, data-conscious, and deeply social. When we design engineering solutions for this context, we must prioritize resilience and accessibility above all else.
            </p>

            <blockquote className="border-y border-white/10 py-12 px-8 my-16 text-center font-cormorant italic text-3xl text-gold">
              &quot;The real work is bridging the gap between what&apos;s possible and what&apos;s needed.&quot;
            </blockquote>

            <h2 className="font-space text-3xl font-bold text-ivory mt-16 mb-8 uppercase tracking-tighter">Localized AI</h2>
            <p>
              Artificial intelligence offers an unprecedented opportunity to scale impact. From Krio-language processing to automated agriculture advisory systems, the potential is vast. However, we must ensure these systems are built by and for the people they serve to avoid digital colonialism.
            </p>

            <p>
              We are at a pivotal moment. The next generation of African innovators is already here, and they are building the future with or without traditional infrastructure. Our role is to provide the platforms and tools that accelerate this movement.
            </p>
          </article>

          {/* Social Share */}
          <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
              <span className="font-space text-[10px] font-black uppercase tracking-widest text-muted">Share this idea</span>
              <div className="flex gap-4">
                <button className="p-3 rounded-full border border-white/10 text-muted hover:text-gold hover:border-gold transition-all"><Send size={18} /></button>
                <button className="p-3 rounded-full border border-white/10 text-muted hover:text-gold hover:border-gold transition-all"><Users size={18} /></button>
                <button className="p-3 rounded-full border border-white/10 text-muted hover:text-gold hover:border-gold transition-all"><LinkIcon size={18} /></button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold flex items-center justify-center rounded-sm font-space font-black text-midnight">A</div>
              <div className="text-left">
                <div className="font-space text-[10px] font-black uppercase tracking-widest text-ivory">Alhaji Kallon</div>
                <div className="font-inter text-[10px] text-muted">Design Engineer • Author</div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Progress Bar */}
        <div className="hidden xl:block fixed left-12 top-1/2 -translate-y-1/2 h-64 w-[1px] bg-white/5">
          <motion.div
            className="w-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            style={{ height: '30%' }}
          />
        </div>
      </section>

      {/* Read Next */}
      <section className="py-24 px-6 bg-navy/20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-space text-xs font-black uppercase tracking-[0.4em] text-gold mb-12">Read Next</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {ARTICLES.slice(0, 2).map(a => (
               <Link key={a.slug} href={`/writing/${a.slug}`} className="glass p-8 hover:border-gold/30 transition-colors group">
                 <div className="text-gold font-space text-[10px] font-black uppercase tracking-widest mb-4">{a.category}</div>
                 <h4 className="font-space text-xl font-bold text-ivory group-hover:text-gold transition-colors">{a.title}</h4>
               </Link>
             ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
