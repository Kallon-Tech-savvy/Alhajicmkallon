'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Lightbulb, Users, PenTool } from 'lucide-react';

const impactAreas = [
  {
    title: "Technology",
    desc: "Building digital solutions that matter, solving real-world problems through robust engineering.",
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
    color: "from-blue-500/10 to-transparent"
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
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-4 block font-space text-[11px] font-semibold uppercase tracking-[0.3em] text-pride-blue">
              What I focus on
            </span>
            <h2 className="font-space text-3xl font-semibold tracking-[-0.02em] text-ivory md:text-4xl">
              Clear thinking. <span className="text-[#9AA4B2]">Real systems.</span>
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-[#9AA4B2]">
            I work at the intersection of strategy, product, and design to create experiences that feel sharp, calm, and easy to use.
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
              <div className="mb-6 w-fit rounded-xl bg-white/5 p-3 transition-colors group-hover:bg-pride-blue/10">
                {area.icon}
              </div>
              <h3 className="mb-3 font-space text-xl font-semibold text-ivory">{area.title}</h3>
              <p className="font-inter text-sm leading-7 text-[#9AA4B2]">
                {area.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
