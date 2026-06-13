'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const timelineEvents = [
  { title: "Curiosity", year: "2010 - 2014", desc: "Early fascination with technology and the power of logic. Self-taught basics of programming while exploring the digital landscape." },
  { title: "Learning", year: "2015 - 2018", desc: "Rigorous study of engineering principles and software development. Building the foundation of a 'Future Builder'." },
  { title: "Building", year: "2019 - 2022", desc: "Launching high-impact digital solutions and consulting for emerging tech startups in West Africa." },
  { title: "Empowering", year: "2023 - Present", desc: "Focusing on institutional growth, youth leadership, and creating sustainable innovation frameworks." },
  { title: "Future", year: "2025 & Beyond", desc: "Architecting the infrastructure that will define the next century of African excellence and technological sovereignty." }
];

export const Timeline = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-navy">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="px-6 md:px-12 absolute top-24 left-0 z-10">
          <span className="font-space text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
            The Journey
          </span>
          <h2 className="font-space text-4xl md:text-5xl font-bold tracking-tighter">
            Timeline of <span className="text-gold">Evolution</span>
          </h2>
        </div>

        <motion.div style={{ x }} className="flex gap-12 px-12 md:px-24">
          {timelineEvents.map((event, i) => (
            <div key={i} className="flex-shrink-0 w-[300px] md:w-[500px] relative">
              <div className="text-gold font-space text-[10rem] md:text-[15rem] font-black opacity-[0.03] absolute -top-32 -left-12 select-none">
                0{i + 1}
              </div>
              <div className="glass p-8 md:p-16 rounded-3xl relative z-10 border border-white/5">
                <div className="inline-block px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] font-bold font-space uppercase tracking-widest mb-6">
                  {event.year}
                </div>
                <h3 className="text-3xl md:text-5xl font-space font-bold mb-6 tracking-tight">{event.title}</h3>
                <p className="text-muted text-lg leading-relaxed font-inter">
                  {event.desc}
                </p>
                <div className="mt-10 w-12 h-[1px] bg-gold/30" />
              </div>
              {i < timelineEvents.length - 1 && (
                <div className="absolute top-1/2 -right-6 w-12 h-[1px] bg-gradient-to-r from-gold/30 to-transparent hidden md:block" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
