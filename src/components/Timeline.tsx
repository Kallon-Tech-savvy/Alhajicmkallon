'use client';

import React from 'react';
import { motion } from 'framer-motion';

const milestones = [
  { year: '2020', title: 'Introduced to Computer Science', desc: 'After two years weighing Civil Engineering against Computer Science, I finally chose Computer Science.' },
  { year: '2022', title: 'Foundation', desc: 'Enrolled in the Computer Science program at Central University, Sierra Leone, and did well enough to spend a lot of my own time helping other students work through projects and core subjects.' },
  { year: '2024', title: 'Independent Path', desc: 'Left university after a period of financial hardship — and chose to keep building through self-directed learning instead of stopping.' },
  { year: '2026', title: 'Professional', desc: 'Shipped real, end-to-end projects — AEEM, a civic innovation platform for Sierra Leone, and an AI-native rewards system — while taking on brand work like Kallon Pride FC.' }
];

export const Timeline = () => {
  return (
    <section className="py-24 bg-midnight px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-20">
          <h2 className="font-space text-2xl font-bold tracking-tighter uppercase italic text-muted">The Journey</h2>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="font-space text-6xl font-black text-white/5 absolute -top-10 -left-4 select-none">
                {m.year}
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center text-gold font-space font-bold text-xs mb-6 border border-gold/20">
                  0{i+1}
                </div>
                <h3 className="font-space text-lg font-bold text-ivory mb-2 uppercase tracking-widest">{m.title}</h3>
                <p className="text-muted text-sm font-inter leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
