'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '@/lib/content';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const FeaturedWork = () => {
  return (
    <section id="work" className="py-32 bg-midnight px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6 block">
              Portfolio
            </span>
            <h2 className="font-space text-5xl md:text-7xl font-bold tracking-tighter leading-none">
              FEATURED <br /><span className="text-muted">PROJECTS</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-md"
          >
            <p className="text-muted text-lg font-inter leading-relaxed mb-8">
              A selection of digital products and systems designed to solve complex
              problems in low-resource environments.
            </p>
            <Link href="/work" className="font-space text-xs font-black uppercase tracking-[0.2em] text-ivory hover:text-gold transition-colors flex items-center gap-2 group">
              View All Projects <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-32">
          {PROJECTS.slice(0, 2).map((project, _i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center group"
            >
              <div className={cn(
                "lg:col-span-7 relative aspect-video overflow-hidden bg-navy rounded-sm",
                _i % 2 === 1 ? "lg:order-2" : ""
              )}>
                <div className="absolute inset-0 bg-gold/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700 z-10" />
                <div className="w-full h-full relative transform group-hover:scale-105 transition-transform duration-1000">
                   {/* Placeholder for project image */}
                   <div className="absolute inset-0 flex items-center justify-center font-space text-8xl font-black text-white/5 select-none">
                    {project.title.split(' ')[0]}
                   </div>
                </div>
              </div>

              <div className={cn(
                "lg:col-span-5",
                _i % 2 === 1 ? "lg:order-1" : ""
              )}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-space text-gold text-[10px] font-black uppercase tracking-[0.3em]">
                    {project.subtitle || project.role}
                  </span>
                  <div className="h-[1px] w-8 bg-gold/30" />
                </div>

                <h3 className="font-space text-4xl md:text-5xl font-bold tracking-tighter mb-6 group-hover:text-gold transition-colors">
                  {project.title}
                </h3>

                <p className="text-muted text-lg font-inter mb-8 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  {project.tech.map(t => (
                    <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-space font-bold text-muted uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>

                <Link href={`/work#${project.id}`} className="inline-flex items-center gap-3 px-8 py-4 border border-gold/30 text-gold font-space font-black text-[10px] uppercase tracking-widest hover:bg-gold hover:text-midnight transition-all duration-500">
                  Case Study <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
