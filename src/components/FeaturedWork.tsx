'use client';

import React from 'react';
import Image from 'next/image';
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
              A closer look at the decisions behind a working product: the problem, the trade-offs, what shipped, and what still needs to be measured.
            </p>
            <Link href="/work" className="font-space text-xs font-black uppercase tracking-[0.2em] text-ivory hover:text-gold transition-colors flex items-center gap-2 group">
              View All Projects <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-32">
          {PROJECTS.length === 0 ? (
            <div className="border border-white/10 p-8 md:p-12">
              <h3 className="font-space text-2xl font-bold mb-4">Case studies coming when ready</h3>
              <p className="max-w-2xl text-muted leading-relaxed">This section will feature verified projects rather than placeholder work or unsubstantiated impact claims.</p>
            </div>
          ) : PROJECTS.map((project, _i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center group"
            >
              <div className={cn(
                "lg:col-span-7 relative aspect-video overflow-hidden bg-navy rounded-sm border border-white/10",
                _i % 2 === 1 ? "lg:order-2" : ""
              )}>
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                    <span className="font-space text-2xl md:text-4xl font-bold text-white/30">{project.title}</span>
                  </div>
                )}
              </div>

              <div className={cn(
                "lg:col-span-5",
                _i % 2 === 1 ? "lg:order-1" : ""
              )}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-space text-gold text-[10px] font-black uppercase tracking-[0.3em]">
                    {project.role}
                  </span>
                  <div className="h-[1px] w-8 bg-gold/30" />
                </div>

                <h3 className="font-space text-4xl md:text-5xl font-bold tracking-tighter mb-6 group-hover:text-gold transition-colors">
                  <Link href={`/work/${project.slug}`}>{project.title}</Link>
                </h3>

                <p className="text-muted text-lg font-inter mb-8 leading-relaxed">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  {project.technologies.map(t => (
                    <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-space font-bold text-muted uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>

                <Link href={`/work/${project.slug}`} className="inline-flex items-center gap-3 px-8 py-4 border border-gold/30 text-gold font-space font-black text-[10px] uppercase tracking-widest hover:bg-gold hover:text-midnight transition-all duration-500">
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
