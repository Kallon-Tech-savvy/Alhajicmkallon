'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const projects = [
  {
    title: "EcoSystem Connect",
    category: "Software Development",
    challenge: "Fragmented digital resources for youth entrepreneurs in West Africa.",
    solution: "A centralized platform for resource sharing, networking, and digital literacy training.",
    impact: "Connected over 5,000 innovators across 10 regions, increasing startup viability by 25%.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Visionary Ledger",
    category: "Design Engineering",
    challenge: "Complex financial data visualization for non-experts in emerging markets.",
    solution: "Simplified, interactive dashboard with predictive modeling and local language support.",
    impact: "Reduced decision-making time by 40% for stakeholders and micro-investors.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
  }
];

export const FeaturedWork = () => {
  return (
    <section id="work" className="py-24 bg-midnight px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-space text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
              Portfolio
            </span>
            <h2 className="font-space text-4xl md:text-5xl font-bold tracking-tighter">
              Featured <span className="text-muted">Work</span>
            </h2>
          </div>
          <button className="flex items-center gap-2 text-gold font-space text-sm font-bold uppercase tracking-widest hover:gap-4 transition-all group">
            View All Projects <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-32">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col lg:flex-row gap-16 items-start"
            >
              <div className={`w-full lg:w-[60%] overflow-hidden rounded-2xl group relative ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                <Image
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={500}
                  className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>

              <div className="w-full lg:w-[40%] pt-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-[1px] bg-gold" />
                  <div className="text-gold text-xs font-bold font-space uppercase tracking-[0.2em]">
                    {project.category}
                  </div>
                </div>
                <h3 className="text-4xl md:text-5xl font-space font-bold mb-10 tracking-tight">{project.title}</h3>

                <div className="space-y-8">
                  <div className="glass p-6 rounded-xl border-l-2 border-l-muted/30">
                    <h4 className="text-xs font-space font-bold uppercase tracking-widest text-muted mb-3">The Challenge</h4>
                    <p className="text-ivory/80 font-inter leading-relaxed text-sm">{project.challenge}</p>
                  </div>
                  <div className="glass p-6 rounded-xl border-l-2 border-l-muted/30">
                    <h4 className="text-xs font-space font-bold uppercase tracking-widest text-muted mb-3">The Solution</h4>
                    <p className="text-ivory/80 font-inter leading-relaxed text-sm">{project.solution}</p>
                  </div>
                  <div className="glass p-6 rounded-xl border-l-2 border-l-gold/50 bg-gold/5">
                    <h4 className="text-xs font-space font-bold uppercase tracking-widest text-gold mb-3">The Impact</h4>
                    <p className="text-ivory font-medium font-inter leading-relaxed text-base">{project.impact}</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ x: 10 }}
                  className="mt-12 flex items-center gap-3 text-xs font-space font-bold uppercase tracking-widest text-gold"
                >
                  Explore Full Case Study <ArrowUpRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
