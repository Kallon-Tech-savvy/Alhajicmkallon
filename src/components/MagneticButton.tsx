'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useMagnetic } from '@/hooks/useMagnetic';

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function MagneticButton({ href, children, className = '' }: MagneticButtonProps) {
  const ref = useMagnetic<HTMLAnchorElement>(0.2);

  return (
    <Link
      ref={ref}
      href={href}
      className={`tap-scale ${className}`}
      style={{ transition: 'transform 0.2s ease-out' }}
    >
      {children}
    </Link>
  );
}