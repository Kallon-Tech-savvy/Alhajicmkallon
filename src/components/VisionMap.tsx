'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const VisionMap = () => {
  return (
    <section className="py-32 bg-navy relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase block mb-6"
          >
            Regional Impact
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-space text-5xl md:text-7xl font-bold tracking-tighter"
          >
            BEYOND <span className="text-muted">BORDERS.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="relative aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center">
             {/* Abstract Africa Map SVG or Placeholder */}
             <div className="w-full h-full bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="w-3/4 h-3/4 border-2 border-gold/20 rounded-full flex items-center justify-center italic font-cormorant text-gold/40 text-4xl"
                >
                  AFRICA
                </motion.div>

                {/* Hotspots */}
                <motion.div
                   animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                   transition={{ duration: 3, repeat: Infinity }}
                   className="absolute top-1/4 right-1/3 w-4 h-4 bg-gold rounded-full"
                />
                <motion.div
                   animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                   transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                   className="absolute bottom-1/2 left-1/4 w-3 h-3 bg-gold/50 rounded-full"
                />
             </div>
          </div>

          <div className="space-y-12">
            <div className="glass p-8 border-l-4 border-l-gold">
              <h3 className="font-space text-2xl font-bold mb-4 tracking-tighter uppercase">Localized AI</h3>
              <p className="text-muted font-inter leading-relaxed">
                Building LLMs and computer vision systems that understand regional languages
                and cultural nuances, starting with Sierra Leone.
              </p>
            </div>

            <div className="glass p-8 border-l-4 border-l-white/10">
              <h3 className="font-space text-2xl font-bold mb-4 tracking-tighter uppercase">Digital Infrastructure</h3>
              <p className="text-muted font-inter leading-relaxed">
                Architecting scalable platforms for government and education that operate
                seamlessly in low-bandwidth environments.
              </p>
            </div>

            <div className="glass p-8 border-l-4 border-l-white/10">
              <h3 className="font-space text-2xl font-bold mb-4 tracking-tighter uppercase">Youth Ecosystems</h3>
              <p className="text-muted font-inter leading-relaxed">
                Creating digital pipelines for mentorship and skills development to empower
                the next 10 million African innovators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
