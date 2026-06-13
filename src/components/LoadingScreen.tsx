'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-midnight"
        >
          <div className="flex flex-col items-center">
            <div className="relative w-[300px] h-[1px] bg-white/10 overflow-hidden mb-8">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute top-0 bottom-0 w-full bg-gold"
              />
            </div>

            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-space text-gold tracking-[0.4em] uppercase text-[10px] font-bold"
              >
                Building Possibility
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-[8px] font-space text-muted tracking-[0.2em] uppercase"
            >
              ALHAJI KALLON © {new Date().getFullYear()}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
