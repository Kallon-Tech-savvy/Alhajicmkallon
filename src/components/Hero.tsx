'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden bg-midnight">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)]" />
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-gold/5 rounded-full blur-[120px]"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] bg-navy/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-[1px] bg-gold" />
                <span className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase">
                  Design Engineer & Software Developer
                </span>
              </div>

              <h1 className="font-space text-6xl md:text-8xl xl:text-9xl font-black tracking-tighter mb-10 leading-[0.85]">
                BUILDING <br />
                <span className="text-gradient">AFRICA&apos;S</span> <br />
                FUTURE.
              </h1>

              <p className="text-muted text-lg md:text-xl max-w-xl mb-12 font-inter leading-relaxed">
                Designing and building digital solutions at the intersection of technology,
                innovation, and youth empowerment. Based in <span className="text-ivory font-medium">Sierra Leone</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link href="/work" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-gold text-midnight font-space font-black text-xs uppercase tracking-widest hover:bg-ivory transition-all duration-300 w-full shadow-[0_20px_50px_rgba(212,175,55,0.15)] flex items-center justify-center gap-3"
                  >
                    View My Work <ArrowUpRight size={18} />
                  </motion.button>
                </Link>
                <Link href="/writing" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 border border-gold/30 text-gold font-space font-black text-xs uppercase tracking-widest hover:bg-gold/5 transition-all duration-300 w-full flex items-center justify-center gap-3"
                  >
                    Read Writing
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              {/* Main Image Container */}
              <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden border border-white/5 shadow-2xl group">
                <Image
                  src="/images/kallon1.png"
                  alt="Alhaji Kallon"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent" />

                {/* Floating Badge */}
                <div className="absolute bottom-8 left-8 right-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 3 }}
                    className="glass p-6 border-l-2 border-l-gold backdrop-blur-md"
                  >
                    <div className="text-[10px] font-space font-bold uppercase tracking-[0.3em] text-gold mb-2">Current Mission</div>
                    <div className="text-sm font-inter text-ivory leading-relaxed">
                      Equipping the next generation of African innovators with tools for impact.
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-12 -right-12 w-32 h-32 border border-gold/20 rounded-full flex items-center justify-center -z-10"
              >
                <div className="w-24 h-24 border border-gold/10 rounded-full" />
              </motion.div>

              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gold/5 blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] text-gold font-space font-bold uppercase tracking-[0.4em]">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] h-16 bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>

      {/* Vertical Side Text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
        <span className="font-space text-[10px] font-bold text-muted uppercase tracking-[0.8em] vertical-text transform rotate-180">
          DESIGN • ENGINEERING • INNOVATION
        </span>
      </div>
    </section>
  );
};
