'use client';

import React from 'react';
import { motion } from 'framer-motion';

const milestones = [
  { year: '2020', title: 'Introduced to Computer Science', desc: 'After two years of back and forth comparison and research on Civil Engineering and Computer Science - I finally decided to go with Computer Science.' },
  { year: '2022', title: 'Foundation', desc: 'Enrolled in Computer Science program at Central University Sierra Leone and performed exceptional well. Aided other students with guidance on project and to clearly understand core subject areas' },
  { year: '2024', title: 'Drop Out', desc: 'Droput of University after a serious finacial scrambles and personal decisions to follow a self-learning path'},
  { year: '2026', title: 'Professional', desc: 'fully started developing projects from ideas to meaningful real world problem'}
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
