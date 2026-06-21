'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 20);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-midnight overflow-hidden"
        >
          {/* Animated Background Gradients */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-gold/5 rounded-full blur-[120px]"
          />

          <div className="relative flex flex-col items-center max-w-xs w-full px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-24"
            >
              <div className="w-16 h-16 bg-gold flex items-center justify-center rounded-sm font-space font-black text-midnight text-3xl">
                A
              </div>
            </motion.div>

            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${counter}%` }}
                className="absolute top-0 left-0 h-full bg-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]"
              />
            </div>

            <div className="flex justify-between w-full items-end">
              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  className="font-space text-gold tracking-[0.4em] uppercase text-[10px] font-bold"
                >
                  Building Possibility
                </motion.p>
              </div>
              <div className="font-space text-ivory text-4xl font-black tabular-nums tracking-tighter">
                {counter}<span className="text-gold text-lg">%</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-[8px] font-space text-muted tracking-[0.3em] uppercase text-center"
            >
              ALHAJI KALLON • DESIGN ENGINEER • SIERRA LEONE
            </motion.div>
          </div>

          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center opacity-20">
            <div className="font-space text-[10px] font-bold uppercase tracking-widest text-ivory">EST. 2024</div>
            <div className="font-space text-[10px] font-bold uppercase tracking-widest text-ivory">V1.0.0</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
