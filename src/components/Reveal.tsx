'use client';

import { useEffect, useRef } from 'react';
import type { ElementType, ReactNode, CSSProperties } from 'react';

type RevealVariant = 'up' | 'fade' | 'scale';

interface RevealProps {
  children: ReactNode;
  /** Underlying tag to render — defaults to div */
  as?: ElementType;
  /** Which CSS entrance treatment to use — all are transform/opacity only */
  variant?: RevealVariant;
  /** Stagger delay in ms — e.g. index * 60 for list items */
  delay?: number;
  className?: string;
  /** Re-trigger every time it re-enters the viewport (default: once) */
  repeat?: boolean;
}

/**
 * Entrance-on-scroll wrapper.
 *
 * Performance notes:
 * - Uses IntersectionObserver, not a scroll listener — the browser handles
 *   this off the main thread, so it never runs per-frame JS during scroll.
 * - Toggles a class directly via classList inside the observer callback —
 *   no setState, so mounting many <Reveal> instances in a list costs zero
 *   extra React re-renders.
 * - The actual animation is a CSS transition on transform/opacity only,
 *   which the browser can run on the compositor thread (GPU), so it won't
 *   block the main thread even while other JS is running.
 * - `will-change` is set only while animating and released to `auto`
 *   afterward (see globals.css) so idle sections don't hold GPU layers.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  className = '',
  repeat = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (!repeat) observer.unobserve(entry.target);
          } else if (repeat) {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat]);

  const style: CSSProperties & Record<'--d', string> = {
    '--d': `${delay}ms`,
  } as CSSProperties & Record<'--d', string>;

  return (
    <Tag ref={ref} className={`reveal-${variant} ${className}`} style={style}>
      {children}
    </Tag>
  );
}