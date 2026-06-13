'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Manifesto = () => {
  const phrases = [
    "I believe innovation is not",
    "measured by what we create,",
    "but by the opportunities",
    "we create for others."
  ];

  return (
    <section className="py-32 md:py-64 px-6 bg-midnight relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-gold" />
            <span className="font-space text-gold text-xs font-bold tracking-[0.3em] uppercase block">
              Personal Manifesto
            </span>
          </div>
        </motion.div>

        <div className="space-y-4">
          {phrases.map((phrase, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-space text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95]"
              >
                {phrase.includes("opportunities") ? (
                  <span className="text-gold italic font-cormorant font-medium">{phrase}</span>
                ) : (
                  phrase
                )}
              </motion.h2>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-24 max-w-3xl ml-auto"
        >
          <p className="text-muted text-xl md:text-3xl font-inter leading-relaxed font-light">
            In a world of rapid technological advancement, we must ensure that no one is left behind.
            My mission is to build the digital infrastructure and <span className="text-ivory font-normal">human capacity</span> that will define
            the next century of African innovation.
          </p>
          <div className="mt-12 w-24 h-[1px] bg-gold/30" />
        </motion.div>
      </div>
    </section>
  );
};
