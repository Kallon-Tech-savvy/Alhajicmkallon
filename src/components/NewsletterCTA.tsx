'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const NewsletterCTA = () => (
  <section className="py-32 px-6 bg-gold relative overflow-hidden">
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-10"
      style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }}
    />
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
        <span className="font-space text-midnight text-xs font-black tracking-[0.4em] uppercase mb-8 block">
          Notes & Ideas
        </span>
        <h2 className="font-space text-4xl md:text-6xl font-black tracking-tighter text-midnight mb-8 leading-tight">
          THOUGHTFUL WORK. <br />USEFUL IDEAS.
        </h2>
        <p className="text-midnight/70 text-lg md:text-xl font-medium font-inter mb-12 max-w-2xl mx-auto">
          Read writing on design, technology, and building useful digital systems. A newsletter will be announced when a real subscription service is available.
        </p>
        <Link
          href="/writing"
          className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-midnight text-ivory font-space font-black text-xs uppercase tracking-[0.2em] hover:bg-ivory hover:text-midnight transition-colors duration-300"
        >
          Explore the writing <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  </section>
);
