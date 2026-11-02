'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
const GlobalSearch = dynamic(
  () => import('./GlobalSearch').then((module) => module.GlobalSearch),
  { ssr: false }
);
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Each nav link gets a shell-command label
function NavIcon({ name, size }: { name: 'search' | 'menu' | 'close'; size: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  if (name === 'search') {
    return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  }
  if (name === 'close') {
    return <svg {...common}><path d="m18 6-12 12M6 6l12 12" /></svg>;
  }
  return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
}

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Work', href: '/work' },
  { name: 'About', href: '/about' },
  { name: 'Writing', href: '/writing' },
  { name: 'Knowledge', href: '/knowledge' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
];

const PRIMARY_NAV_LINKS = NAV_LINKS.filter(
  (link) => !['/', '/faq', '/contact'].includes(link.href)
);

function isCurrentPath(pathname: string, href: string): boolean {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
}

export const Navbar = () => {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setIsMobileOpen]  = useState(false);
  const [isSearchOpen, setIsSearchOpen]      = useState(false);
  const scrolledRef = useRef(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
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

  // Keep mobile navigation scrollable on small screens, while the page behind it stays still.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileMenuOpen]);

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
      <nav aria-label="Primary navigation"
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 md:px-10',
          isScrolled
            ? 'bg-midnight/90 backdrop-blur-xl border-b border-[#2A2A2A]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* ── Left: shell prompt ──────────────────────────────────── */}
          <Link href="/" aria-label="Alhaji Kallon — Home" className="group flex items-center gap-2 select-none">
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold md:text-sm"
                  style={{ color: '#A8C9FF' }}>
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
            {PRIMARY_NAV_LINKS.map(link => {
              const isActive = isCurrentPath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    'relative rounded-sm px-3 py-1.5 font-inter text-[11px] font-medium uppercase tracking-[0.24em] transition-all duration-200',
                    isActive
                      ? 'text-[#A8C9FF]'
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
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 transition-colors duration-200"
              style={{ color: '#C0C9D5' }}
              aria-label="Search (⌘K)"
            >
              <NavIcon name="search" size={14} />
            </button>

            <Link
              href="/contact"
              className="ml-3 rounded-full border px-4 py-2 font-inter text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 hover:border-[#A8C9FF] hover:bg-pride-blue/25"
              style={{
                color: '#F5F5F5',
                background: 'rgba(0, 102, 255, 0.16)',
                borderColor: 'rgba(0, 102, 255, 0.35)',
              }}

            >
              Let&apos;s talk
            </Link>
          </div>

          {/* ── Mobile toggles ─────────────────────────────────────── */}
          <div className="lg:hidden flex items-center gap-2">
            <button type="button" onClick={() => { setIsMobileOpen(false); setIsSearchOpen(true); }} aria-label="Search site" style={{ color: '#C0C9D5' }}
                    className="p-3">
              <NavIcon name="search" size={18} />
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMobileOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              style={{ color: '#C0C9D5' }}
              className="p-3 relative z-[60]"
            >
              {isMobileMenuOpen ? <NavIcon name="close" size={22} /> : <NavIcon name="menu" size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu is conditionally rendered without a motion runtime. */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          role="navigation"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto px-6 pb-10 pt-28 scanlines lg:hidden"
          style={{ background: '#0A0A0A' }}
        >
          <div className="mb-10 font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-[0.4em] uppercase"
               style={{ color: '#6B7280' }}>
            Explore the site
          </div>

          <div className="space-y-4">
            {NAV_LINKS.map((link, i) => (
              <div
                key={link.href}
                style={{ animation: 'slide-up 240ms ease-out both', animationDelay: `${i * 45}ms` }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  aria-current={isCurrentPath(pathname, link.href) ? 'page' : undefined}
                  className="font-[family-name:var(--font-jetbrains-mono)] text-2xl font-bold block transition-colors duration-200"
                  style={{ color: isCurrentPath(pathname, link.href) ? '#A8C9FF' : '#E0E0E0' }}
                >
                  <span style={{ color: '#6B7280', marginRight: 8 }}>&gt;</span>
                  {link.name}
                </Link>
              </div>
            ))}
          </div>

          <div
            className="mt-10 pt-6 border-t"
            style={{ borderColor: '#2A2A2A', animation: 'slide-up 240ms ease-out both', animationDelay: '300ms' }}
          >
            <div className="flex flex-wrap gap-6 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-widest"
                 style={{ color: '#9AA4B2' }}>
              <a href="https://x.com/alhajikallon" target="_blank" rel="noopener noreferrer"
                 className="hover:text-[#006BFF] transition-colors">Twitter</a>
              <a href="https://linkedin.com/in/alhaji-c-m-k-8b79a225b" target="_blank" rel="noopener noreferrer"
                 className="hover:text-[#006BFF] transition-colors">LinkedIn</a>
              <a href="https://github.com/Kallon-Tech-savvy" target="_blank" rel="noopener noreferrer"
                 className="hover:text-[#006BFF] transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      )}

      {isSearchOpen && <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};
