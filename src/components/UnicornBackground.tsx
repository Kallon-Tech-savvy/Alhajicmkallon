'use client';

import { useEffect, useRef, useState } from 'react';

interface UnicornBackgroundProps {
  /**
   * Project ID from unicorn.studio → Export → Embed.
   * Replace the placeholder below with your real scene ID.
   */
  projectId: string;
  className?: string;
  /** CSS gradient shown before the scene loads, and permanently for
   *  reduced-motion / low-end-device users who never get the WebGL scene */
  fallbackClassName?: string;
}

declare global {
  interface Window {
    UnicornStudio?: { init?: () => void };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadUnicornScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();
    if (window.UnicornStudio) return resolve();
    const script = document.createElement('script');
    // NOTE: verify this URL against unicorn.studio's current embed docs —
    // CDN paths can change between their releases.
    script.src = 'https://cdn.unicorn.studio/unicornStudio.umd.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unicorn Studio script failed to load'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Performance notes:
 * - The WebGL script is NOT loaded on page mount. It only starts loading
 *   once this element scrolls near the viewport (IntersectionObserver,
 *   200px rootMargin), and even then it's deferred via
 *   requestIdleCallback so it never competes with input handling or the
 *   initial paint.
 * - Skipped entirely for prefers-reduced-motion users and for devices
 *   that report low memory / few cores — they keep the static CSS
 *   gradient fallback instead, which costs nothing.
 * - The container is `-z-10` and `aria-hidden` — it's purely decorative,
 *   so it never intercepts clicks or gets read by screen readers.
 */
export function UnicornBackground({
  projectId,
  className = '',
  fallbackClassName = 'bg-gradient-to-br from-[var(--color-pride-blue)]/10 via-transparent to-transparent',
}: UnicornBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const nav = navigator as Navigator & { deviceMemory?: number };
    if (nav.deviceMemory && nav.deviceMemory < 4) return;
    if (nav.hardwareConcurrency && nav.hardwareConcurrency < 4) return;

    let idleId: number | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const init = () => {
            loadUnicornScript()
              .then(() => {
                window.UnicornStudio?.init?.();
                setLoaded(true);
              })
              .catch(() => setLoaded(false));
          };

          if ('requestIdleCallback' in window) {
            idleId = window.requestIdleCallback(init, { timeout: 2000 });
          } else {
            setTimeout(init, 200);
          }
          observer.disconnect();
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [projectId]);

  return (
    <div
      ref={containerRef}
      data-us-project={projectId}
      className={`absolute inset-0 -z-10 transition-opacity duration-1000 ${fallbackClassName} ${
        loaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      aria-hidden
    />
  );
}