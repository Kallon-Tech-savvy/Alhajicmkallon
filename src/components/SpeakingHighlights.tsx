'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SPEAKING } from '@/lib/content';
import { Mic2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const SpeakingHighlights = () => {
  return (
    <section className="py-32 bg-midnight px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6 block">
                Public Speaking
              </span>
              <h2 className="font-space text-5xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
                SHARING <br /><span className="text-gradient">IDEAS</span> ACROSS <br />THE GLOBE.
              </h2>
              <p className="text-muted text-lg font-inter mb-12 leading-relaxed">
                Available for speaking engagements on innovation, youth empowerment,
                and technology in Africa. I&apos;ve shared insights with audiences at
                Africa Tech Summit, UNDP, and Global AI Forums.
              </p>
              <Link
                href="/speaking"
                className="inline-flex items-center gap-4 px-8 py-4 bg-white/5 text-ivory font-space font-black text-[10px] uppercase tracking-widest hover:bg-gold hover:text-midnight transition-all duration-500 group"
              >
                Booking Inquiries <Mic2 size={16} />
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-4">
              {SPEAKING.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center group hover:bg-white/[0.02] transition-colors"
                >
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-space text-gold text-[10px] font-black uppercase tracking-widest">
                        {event.year}
                      </span>
                      <div className="w-4 h-[1px] bg-white/10" />
                      <span className="text-muted font-space text-[10px] font-bold uppercase tracking-widest">
                        {event.organization}
                      </span>
                    </div>
                    <h3 className="font-space text-xl font-bold text-ivory group-hover:text-gold transition-colors">
                      {event.title}
                    </h3>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 45 }}
                    className="p-3 rounded-full border border-white/10 text-muted group-hover:text-gold group-hover:border-gold transition-colors"
                  >
                    <ArrowUpRight size={20} />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
