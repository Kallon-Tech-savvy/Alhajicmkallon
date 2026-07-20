// Optimized: Server Page utilizing asynchronous route params
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
// import { ARTICLES } from '@/lib/content'; // Assumed static dataset
import { ArrowLeft, Send, Users, Link as LinkIcon, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleTemplate({ params }: PageProps) {
  const resolvedParams = await params;
  // const article = ARTICLES.find(a => a.slug === resolvedParams.slug) || ARTICLES[0];

  return (
    <main className="min-h-screen bg-midnight text-ivory selection:bg-gold/30">
      <Navbar />

      {/* Article Typography Header */}
      <section className="pt-48 pb-16 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/writing"
            className="inline-flex items-center gap-2 text-gold font-space font-black text-xs uppercase tracking-widest mb-12 hover:text-ivory transition-colors duration-300 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" /> Back to Writing
          </Link>

          <Reveal variant="up">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-gold text-midnight font-space font-black text-[9px] uppercase tracking-widest rounded-full">
                {/* {article.category} */}
              </span>
              <div className="flex items-center gap-1.5 text-muted font-space text-[10px] font-bold uppercase tracking-widest">
                {/* <Calendar size={12} /> {article.date} */}
              </div>
              <div className="flex items-center gap-1.5 text-muted font-space text-[10px] font-bold uppercase tracking-widest">
                {/* <Clock size={12} /> {article.readTime} */}
              </div>
            </div>

            <h1 className="font-space text-4xl md:text-6xl font-bold tracking-tighter text-ivory mb-8 leading-[1.1] uppercase">
              {/* {article.title} */}
            </h1>

            <p className="text-muted/90 text-lg md:text-xl font-inter leading-relaxed italic border-l-2 border-gold pl-6 py-1 font-light">
              {/* {article.excerpt} */}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Article Core Body */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal variant="fade" delay={100}>
            <article className="prose prose-invert prose-gold max-w-none font-inter text-base md:text-lg leading-relaxed text-ivory/80 space-y-6 font-light">
              <p>
                Innovation in Africa isn&apos;t just about importing Silicon Valley solutions. It&apos;s about deep empathy, localized systems, and building with resource constraints as a catalyst for creativity rather than a barrier.
              </p>

              <h2 className="font-space text-2xl font-bold text-ivory pt-8 tracking-tight uppercase">The Context of Freetown</h2>
              <p>
                In the bustling streets of Freetown, digital transformation looks different. It&apos;s mobile-first, data-conscious, and deeply social. When we design engineering solutions for this context, we must prioritize resilience and accessibility above all else.
              </p>

              <blockquote className="border-y border-white/10 py-10 px-6 my-12 text-center italic text-2xl text-gold font-light">
                &quot;The real work is bridging the gap between what&apos;s possible and what&apos;s needed.&quot;
              </blockquote>

              <h2 className="font-space text-2xl font-bold text-ivory pt-8 tracking-tight uppercase">Localized AI</h2>
              <p>
                Artificial intelligence offers an unprecedented opportunity to scale impact. From Krio-language processing to automated agriculture advisory systems, the potential is vast. However, we must ensure these systems are built by and for the people they serve to avoid digital colonialism.
              </p>

              <p>
                We are at a pivotal moment. The next generation of African innovators is already here, and they are building the future with or without traditional infrastructure. Our role is to provide the platforms and tools that accelerate this movement.
              </p>
            </article>
          </Reveal>

          {/* Social Interactions Strip — frosted */}
          <Reveal variant="up" delay={150}>
            <div className="mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 p-6 glass-frost-light rounded-sm">
              <div className="flex items-center gap-4">
                <span className="font-space text-[9px] font-black uppercase tracking-widest text-muted">Share this idea</span>
                <div className="flex gap-2">
                  <button aria-label="Share via Email" className="p-2.5 rounded-sm border border-white/5 text-muted hover:text-gold hover:border-gold/40 hover-lift transition-colors duration-300"><Send size={14} /></button>
                  <button aria-label="Share via Network" className="p-2.5 rounded-sm border border-white/5 text-muted hover:text-gold hover:border-gold/40 hover-lift transition-colors duration-300"><Users size={14} /></button>
                  <button aria-label="Copy Link" className="p-2.5 rounded-sm border border-white/5 text-muted hover:text-gold hover:border-gold/40 hover-lift transition-colors duration-300"><LinkIcon size={14} /></button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold flex items-center justify-center rounded-sm font-space font-black text-xs text-midnight">A</div>
                <div className="text-left">
                  <div className="font-space text-[10px] font-black uppercase tracking-widest text-ivory">Alhaji Kallon</div>
                  <div className="font-inter text-[10px] text-muted font-light">Design Engineer • Author</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 px-6 bg-navy/[0.05] border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <Reveal variant="fade" as="h3" className="font-space text-xs font-black uppercase tracking-[0.3em] text-gold mb-8">
            Read Next
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* {ARTICLES.slice(0, 2).map((a, i) => (
               <Reveal key={a.slug} variant="up" delay={i * 80}>
                 <Link href={`/writing/${a.slug}`} className="bg-white/[0.01] border border-white/5 p-6 hover:border-gold/20 hover-lift glass-frost-light transition-colors duration-300 block rounded-sm group">
                   <div className="text-gold/80 font-space text-[9px] font-black uppercase tracking-widest mb-2">{a.category}</div>
                   <h4 className="font-space text-lg font-bold text-ivory group-hover:text-gold transition-colors duration-300 tracking-tight">{a.title}</h4>
                 </Link>
               </Reveal>
             ))} */}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}