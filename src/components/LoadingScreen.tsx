'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  { text: '> booting alhaji.kallon.dev...', status: '',     delay: 0 },
  { text: '> loading kernel v2.0.0',        status: '[OK]', delay: 320 },
  { text: '> mounting design_system',        status: '[OK]', delay: 620 },
  { text: '> compiling belief_protocol.ts',  status: '[OK]', delay: 940 },
  { text: '> connecting node: Sierra Leone', status: '[OK]', delay: 1220 },
  { text: '> initializing build_future.sh',  status: '[OK]', delay: 1480 },
  { text: '> deploying to edge network',     status: '[OK]', delay: 1740 },
  { text: '',                                status: '',     delay: 2000 },
  { text: 'SYSTEM READY',                   status: '',     delay: 2160 },
];

const EXIT_DELAY = 2800;

export const LoadingScreen = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(prev => [...prev, i]);
        }, BOOT_LINES[i].delay)
      );
    });

    timers.push(
      setTimeout(() => setLoading(false), EXIT_DELAY)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col justify-center bg-midnight overflow-hidden scanlines"
        >
          {/* Subtle blue ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(0,107,255,0.04) 0%, transparent 70%)' }} />

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 border-b border-[#2A2A2A]">
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.4em] uppercase"
                  style={{ color: '#6B7280' }}>
              alhaji@kallon.dev
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: '#6B7280' }}>
              v2.0.0
            </span>
          </div>

          {/* Terminal output */}
          <div className="relative px-8 md:px-16 lg:px-24 max-w-3xl w-full">
            <div className="mb-8">
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.5em] uppercase"
                    style={{ color: '#006BFF' }}>
                ALHAJI KALLON / DESIGN ENGINEER
              </span>
            </div>

            <div className="space-y-2 min-h-[220px]">
              {BOOT_LINES.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={visibleLines.includes(i) ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.18 }}
                  className="flex items-center justify-between"
                >
                  {line.text === '' ? (
                    <div className="h-3" />
                  ) : line.text === 'SYSTEM READY' ? (
                    <span
                      className="font-[family-name:var(--font-jetbrains-mono)] text-lg md:text-2xl font-bold tracking-[0.15em]"
                      style={{ color: '#006BFF', textShadow: '0 0 12px rgba(0,107,255,0.6)' }}
                    >
                      {line.text}
                      {visibleLines.includes(i) && (
                        <span className="cursor-blink ml-2" />
                      )}
                    </span>
                  ) : (
                    <>
                      <span
                        className="font-[family-name:var(--font-jetbrains-mono)] text-xs md:text-sm"
                        style={{ color: '#94A3B8' }}
                      >
                        {line.text}
                      </span>
                      {line.status && (
                        <span
                          className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] font-bold ml-8 shrink-0"
                          style={{ color: '#006BFF' }}
                        >
                          {line.status}
                        </span>
                      )}
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 py-5 border-t border-[#2A2A2A]">
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: '#6B7280' }}>
              Sierra Leone · West Africa
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: '#6B7280' }}>
              Believe it. We build it.
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};