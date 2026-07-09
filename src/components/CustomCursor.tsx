'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const GREEN   = '#006BFF';
const MAGENTA = '#FF2D55';

export const CustomCursor = () => {
  const [isVisible, setIsVisible]  = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const spring = { damping: 28, stiffness: 300 };
  const x = useSpring(cursorX, spring);
  const y = useSpring(cursorY, spring);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setIsHovering(
        t.tagName === 'A' ||
        t.tagName === 'BUTTON' ||
        !!t.closest('a') ||
        !!t.closest('button') ||
        t.classList.contains('cursor-pointer')
      );
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  const color = isHovering ? MAGENTA : GREEN;
  const glow  = isHovering
    ? '0 0 10px rgba(255,45,85,0.8)'
    : '0 0 8px rgba(0,107,255,0.7)';

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Crosshair container */}
      <motion.div
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          position: 'absolute',
        }}
      >
        {/* Horizontal arm — left */}
        <motion.div
          animate={{ width: isHovering ? 14 : 10, opacity: 1 }}
          style={{
            position: 'absolute',
            top: '50%',
            right: '54%',
            height: 1,
            background: color,
            boxShadow: glow,
            transformOrigin: 'right center',
            marginTop: -0.5,
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Horizontal arm — right */}
        <motion.div
          animate={{ width: isHovering ? 14 : 10, opacity: 1 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '54%',
            height: 1,
            background: color,
            boxShadow: glow,
            marginTop: -0.5,
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Vertical arm — top */}
        <motion.div
          animate={{ height: isHovering ? 14 : 10, opacity: 1 }}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '54%',
            width: 1,
            background: color,
            boxShadow: glow,
            marginLeft: -0.5,
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Vertical arm — bottom */}
        <motion.div
          animate={{ height: isHovering ? 14 : 10, opacity: 1 }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '54%',
            width: 1,
            background: color,
            boxShadow: glow,
            marginLeft: -0.5,
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Center dot */}
        <motion.div
          animate={{
            width:  isHovering ? 3 : 2,
            height: isHovering ? 3 : 2,
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            background: color,
            boxShadow: glow,
            borderRadius: 0,
            transform: 'translate(-50%, -50%)',
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Corner brackets (outer reticle) */}
        {[
          { top: -14, left: -14, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
          { top: -14, right: -14, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` },
          { bottom: -14, left: -14, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` },
          { bottom: -14, right: -14, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` },
        ].map((s, i) => (
          <motion.div
            key={i}
            animate={{ opacity: isHovering ? 0.8 : 0.35, scale: isHovering ? 1.6 : 1 }}
            style={{
              position: 'absolute',
              width: 7,
              height: 7,
              ...s,
            }}
            transition={{ duration: 0.15 }}
          />
        ))}
      </motion.div>
    </div>
  );
};