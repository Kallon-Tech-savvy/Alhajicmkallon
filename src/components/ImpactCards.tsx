'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Lightbulb, Users, PenTool } from 'lucide-react';

const impactAreas = [
  {
    title: "Technology",
    desc: "Building digital solutions that solve real-world problems through robust engineering.",
    icon: <Cpu className="text-gold" size={24} aria-hidden="true" />,
    color: "from-blue-500/10 to-transparent"
  },
  {
    title: "Innovation",
    desc: "Designing systems and products that push the boundaries of what's possible.",
    icon: <Lightbulb className="text-gold" size={24} aria-hidden="true" />,
    color: "from-yellow-500/10 to-transparent"
  },
  {
    title: "Leadership",
    desc: "Developing people and institutions to foster a culture of excellence and growth.",
    icon: <Users className="text-gold" size={24} aria-hidden="true" />,
    color: "from-green-500/10 to-transparent"
  },
  {
    title: "Writing",
    desc: "Sharing ideas that inspire action and contribute to the global tech discourse.",
    icon: <PenTool className="text-gold" size={24} aria-hidden="true" />,
    color: "from-purple-500/10 to-transparent"
  }
];

export const ImpactCards = () => {
  return (
    <section className="py-24 bg-midnight px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-space text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
              Areas of Impact
            </span>
            <h2 className="font-space text-4xl md:text-5xl font-bold tracking-tighter">
              Defining the <span className="text-muted">Standards</span>
            </h2>
          </div>
          <p className="text-muted max-w-md font-inter">
            Bridging the gap between conceptual innovation and practical application across four key pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactAreas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-2xl group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="mb-6 p-3 bg-white/5 w-fit rounded-xl group-hover:bg-gold/10 transition-colors">
                {area.icon}
              </div>
              <h3 className="font-space text-xl font-bold mb-3">{area.title}</h3>
              <p className="text-muted text-sm leading-relaxed font-inter">
                {area.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
