'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlobalSearch } from './GlobalSearch';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Each nav link gets a shell-command label
const NAV_LINKS = [
  { name: 'home',       href: '/',         short: 'HOME'     },
  { name: 'work',       href: '/work',      short: 'WORK'     },
  { name: 'about',      href: '/about',     short: 'ABOUT'    },
  { name: 'writing',  href: '/writing',   short: 'WRITING'  },
  { name: 'contact', href: '/contact',   short: 'CONTACT'  },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setIsMobileOpen]  = useState(false);
  const [isSearchOpen, setIsSearchOpen]      = useState(false);
  const scrolledRef = useRef(false);
  const pathname = usePathname();

  // Scroll listener
  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 50;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setIsScrolled(next);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cmd+K search shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 md:px-10',
          isScrolled
            ? 'bg-midnight/90 backdrop-blur-xl border-b border-[#2A2A2A]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* ── Left: shell prompt ──────────────────────────────────── */}
          <Link href="/" className="group flex items-center gap-2 select-none">
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold md:text-sm"
                  style={{ color: '#006BFF' }}>
              alhaji
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold text-ivory transition-colors group-hover:text-pride-blue md:text-sm">
              kallon
            </span>
            <span
              className="cursor-text-blink font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold md:text-sm"
              style={{ color: 'var(--color-pride-blue)' }}
            >
              █
            </span>
          </Link>

          {/* ── Desktop nav ─────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative rounded-sm px-3 py-1.5 font-inter text-[11px] font-medium uppercase tracking-[0.24em] transition-all duration-200',
                    isActive
                      ? 'text-pride-blue'
                      : 'text-[#9AA4B2] hover:text-ivory'
                  )}
                >
                  {link.name}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-2 right-2 h-[1px]"
                      style={{ background: 'var(--color-pride-blue)' }}
                    />
                  )}
                </Link>
              );
            })}

            <div className="h-4 w-px mx-3" style={{ background: '#2A2A2A' }} />

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 transition-colors duration-200"
              style={{ color: '#6B7280' }}
              aria-label="Search (⌘K)"
            >
              <Search size={14} />
            </button>

            <Link
              href="/contact"
              className="ml-3 rounded-full border px-4 py-1.5 font-inter text-[11px] font-semibold uppercase tracking-[0.24em] transition-all duration-200"
              style={{
                color: '#F5F5F5',
                background: 'rgba(0, 102, 255, 0.16)',
                borderColor: 'rgba(0, 102, 255, 0.35)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(0,107,255,0.4)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              Let&apos;s talk
            </Link>
          </div>

          {/* ── Mobile toggles ─────────────────────────────────────── */}
          <div className="lg:hidden flex items-center gap-2">
            <button onClick={() => setIsSearchOpen(true)} style={{ color: '#6B7280' }}
                    className="p-2">
              <Search size={18} />
            </button>
            <button
              onClick={() => setIsMobileOpen(!isMobileMenuOpen)}
              style={{ color: '#6B7280' }}
              className="p-2 relative z-[60]"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 lg:hidden flex flex-col justify-center p-10 scanlines"
            style={{ background: '#0A0A0A' }}
          >
            {/* Prompt header */}
            <div className="mb-10 font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.4em] uppercase"
                 style={{ color: '#6B7280' }}>
              alhaji@kallon ~$
            </div>

            <div className="space-y-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="font-[family-name:var(--font-jetbrains-mono)] text-2xl font-bold block transition-colors duration-200"
                    style={{ color: pathname === link.href ? '#FFB000' : '#E0E0E0' }}
                  >
                    <span style={{ color: '#6B7280', marginRight: 8 }}>&gt;</span>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-16 pt-8 border-t"
              style={{ borderColor: '#2A2A2A' }}
            >
              <p className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-widest uppercase mb-5"
                 style={{ color: '#6B7280' }}>
                // social channels
              </p>
              <div className="flex gap-8 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-widest"
                   style={{ color: '#6B7280' }}>
                <a href="https://x.com/alhajikallon" target="_blank" rel="noopener noreferrer"
                   className="hover:text-[#006BFF] transition-colors">Twitter</a>
                <a href="https://linkedin.com/in/alhajikallon" target="_blank" rel="noopener noreferrer"
                   className="hover:text-[#006BFF] transition-colors">LinkedIn</a>
                <a href="https://github.com/alhajikallon" target="_blank" rel="noopener noreferrer"
                   className="hover:text-[#006BFF] transition-colors">GitHub</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
