'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export const Hero = () => {
  return (
    <section className="h-screen flex items-center justify-center bg-midnight overflow-hidden relative">
      {/* Background: Animated particle field effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-gold)_0%,_transparent_1.5px)] bg-[length:48px_48px] opacity-[0.15]" />

        {/* Subtle animated blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-gold rounded-full blur-[120px]"
        />
      </div>

      <div className="z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <span className="font-space text-gold text-xs font-bold tracking-[0.3em] uppercase mb-6 block">
            The Future Builder
          </span>
          <h1 className="font-space text-5xl md:text-7xl xl:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
            Building <span className="text-gradient">Technology.</span> <br />
            Empowering <span className="text-gradient">People.</span> <br />
            Shaping Africa's <span className="text-gradient">Future.</span>
          </h1>
          <p className="text-muted text-lg md:text-xl max-w-xl mb-12 font-inter leading-relaxed">
            Design Engineer, Software Developer, Entrepreneur, Writer, and Youth Innovation Advocate.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-gold text-midnight font-bold rounded-sm text-sm uppercase tracking-wider hover:bg-ivory transition-colors duration-300 w-full sm:w-auto shadow-lg shadow-gold/20"
            >
              Explore My Work
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 border border-gold/30 text-gold font-bold rounded-sm text-sm uppercase tracking-wider hover:bg-gold/10 transition-colors duration-300 w-full sm:w-auto"
            >
              Read My Insights
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 2.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative w-[500px] h-[600px] mx-auto">
            {/* Decorative frame */}
            <div className="absolute inset-0 border border-gold/20 translate-x-6 translate-y-6 -z-10 rounded-2xl" />

            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 relative group">
              <Image
                src="/images/kallon1.png"
                alt="Alhaji Kallon"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-60" />

              <div className="absolute bottom-8 left-8 right-8">
                <div className="glass p-6 rounded-xl border border-gold/30 backdrop-blur-md">
                  <div className="text-[10px] font-space font-bold uppercase tracking-[0.2em] text-gold mb-1">Current Focus</div>
                  <div className="text-sm font-inter text-ivory">Building institutional capacity for digital innovation in Sierra Leone.</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-muted uppercase tracking-[0.2em] font-space">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  );
};
