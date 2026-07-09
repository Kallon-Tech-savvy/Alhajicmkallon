'use client';

import { useEffect, useRef } from 'react';

/**
 * Subtle magnetic-pull hover effect for buttons/links.
 *
 * Performance notes:
 * - pointermove updates are batched through requestAnimationFrame, so even
 *   on a fast mouse we only ever touch the DOM once per paint frame.
 * - Writes go straight to el.style.transform, bypassing React entirely —
 *   no re-renders during mouse movement.
 * - Skipped outright on touch devices (`pointer: coarse`) and for
 *   prefers-reduced-motion users, since neither benefits from it.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let frame = 0;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    };

    const reset = () => {
      cancelAnimationFrame(frame);
      el.style.transform = 'translate(0, 0)';
    };

    el.addEventListener('pointermove', handleMove);
    el.addEventListener('pointerleave', reset);
    return () => {
      el.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerleave', reset);
      cancelAnimationFrame(frame);
    };
  }, [strength]);

  return ref;
}