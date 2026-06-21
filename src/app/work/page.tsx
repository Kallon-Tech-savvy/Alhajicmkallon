'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PROJECTS } from '@/lib/content';
import { ArrowUpRight, ExternalLink, Code } from 'lucide-react';
import Link from 'next/link';

export default function WorkPage() {
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
              Selected Works 2021—2024
            </span>
            <h1 className="font-space text-6xl md:text-9xl font-black tracking-tighter mb-16 leading-[0.85]">
              CRAFTING <br /><span className="text-gradient">SOLUTIONS</span>
            </h1>
          </motion.div>
        </div>

        <div className="absolute top-1/2 right-0 text-white/[0.02] font-space text-[30vw] font-black leading-none pointer-events-none select-none">
          WORK
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-64">
          {PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              id={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
            >
              {/* Image Side */}
              <div className="lg:col-span-7 group">
                <div className="relative aspect-[16/10] bg-navy rounded-sm overflow-hidden border border-white/5 shadow-2xl">
                  <div className="absolute inset-0 bg-gold/5 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center font-space text-[15vw] font-black text-white/[0.02] select-none uppercase">
                    {project.title.split(' ')[0]}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-midnight/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20 backdrop-blur-sm">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="px-8 py-4 bg-gold text-midnight font-space font-black text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                    >
                      View Case Study <ArrowUpRight size={16} />
                    </motion.div>
                  </div>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-3 mt-8">
                  {project.tech.map(t => (
                    <span key={t} className="px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-[10px] font-space font-bold text-muted uppercase tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Side */}
              <div className="lg:col-span-5 pt-8">
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-space text-gold text-xs font-black uppercase tracking-[0.3em] bg-gold/10 px-3 py-1 rounded-full">
                    {project.timeline}
                  </span>
                </div>

                <h2 className="font-space text-5xl md:text-6xl font-bold tracking-tighter mb-8 text-ivory leading-none">
                  {project.title}
                </h2>

                <div className="space-y-12">
                  <div>
                    <h3 className="font-space text-gold text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gold rounded-full" /> The Problem
                    </h3>
                    <p className="text-muted text-lg font-inter leading-relaxed">
                      {project.problem}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-space text-gold text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gold rounded-full" /> The Impact
                    </h3>
                    <ul className="space-y-4">
                      {project.impact.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-ivory font-inter">
                          <span className="text-gold font-space font-black mt-1">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8 flex flex-wrap gap-6 border-t border-white/5">
                    <a href={project.links.live} className="flex items-center gap-2 text-ivory hover:text-gold font-space font-bold text-[10px] uppercase tracking-[0.2em] transition-colors">
                      Live Project <ExternalLink size={14} />
                    </a>
                    <a href={project.links.github} className="flex items-center gap-2 text-ivory hover:text-gold font-space font-bold text-[10px] uppercase tracking-[0.2em] transition-colors">
                      View Source <Code size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Want to Work Together Section */}
      <section className="py-64 bg-navy px-6 text-center border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="font-space text-5xl md:text-7xl font-bold tracking-tighter mb-12 uppercase leading-none">
            Have an <span className="text-gradient">Idea?</span>
          </h2>
          <p className="text-muted text-xl font-inter mb-16 max-w-2xl mx-auto">
            I&apos;m always open to discussing new projects, digital transformation
            consulting, or impactful collaborations in Africa.
          </p>
          <Link
            href="/contact"
            className="px-12 py-6 bg-gold text-midnight font-space font-black text-sm uppercase tracking-widest hover:bg-ivory transition-all duration-500 shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
          >
            Start a Conversation
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
