'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const VisionMap = () => {
  return (
    <section id="vision" className="py-24 bg-midnight px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="font-space text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
            The Vision
          </span>
          <h2 className="font-space text-4xl md:text-6xl font-bold tracking-tighter mb-8">
            Africa Innovation <span className="text-gradient">2030</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto font-inter text-lg">
            A strategic roadmap for building digital sovereignty and fostering youth-led
            transformation across the continent.
          </p>
        </div>

        <div className="relative aspect-[16/9] lg:aspect-[21/9] bg-navy/30 rounded-3xl border border-white/5 flex items-center justify-center group">
          <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/2/21/Africa_map_blank.svg')] bg-contain bg-center bg-no-repeat filter invert grayscale" />

          {/* Interactive Hotspots Placeholder */}
          <div className="relative w-full h-full">
            {[
              { top: '40%', left: '45%', label: 'Technology', desc: 'Infrastructural depth' },
              { top: '60%', left: '55%', label: 'Youth', desc: 'Capacity building' },
              { top: '30%', left: '52%', label: 'Education', desc: 'Systemic reform' },
              { top: '55%', left: '48%', label: 'Entrepreneurship', desc: 'Venture ecosystem' },
            ].map((spot, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
                style={{ top: spot.top, left: spot.left }}
                className="absolute"
              >
                <div className="relative flex items-center justify-center group/spot">
                  <div className="w-3 h-3 bg-gold rounded-full animate-ping absolute opacity-75" />
                  <div className="w-3 h-3 bg-gold rounded-full relative z-10" />

                  <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 p-4 glass rounded-xl opacity-0 group-hover/spot:opacity-100 transition-opacity pointer-events-none z-20">
                    <div className="text-[10px] font-space font-bold uppercase tracking-widest text-gold mb-1">{spot.label}</div>
                    <div className="text-xs text-ivory font-inter">{spot.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-gold/5 font-space text-[20vw] font-black uppercase select-none">Impact</div>
          </div>
        </div>
      </div>
    </section>
  );
};
