'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GlobalSearch = dynamic(
  () => import('./GlobalSearch').then((module) => module.GlobalSearch),
  { ssr: false }
);

const LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Work', href: '/work' },
  { name: 'About', href: '/about' },
  { name: 'Writing', href: '/writing' },
  { name: 'Knowledge', href: '/knowledge' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
] as const;

const PRIMARY_LINKS = LINKS.filter(
  ({ href }) => !['/', '/faq', '/contact'].includes(href)
);

function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(href + '/'));
}

function NavIcon({ name, size }: { name: 'search' | 'menu' | 'close'; size: number }) {
  const props = {
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
    return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  }
  if (name === 'close') {
    return <svg {...props}><path d="m18 6-12 12M6 6l12 12" /></svg>;
  }
  return <svg {...props}><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
}

/** A small client island for navigation, mobile disclosure, and on-demand search. */
export function NavbarInteractions() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function openSearch(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setIsMobileMenuOpen(false);
        setIsSearchOpen(true);
      }
    }
    window.addEventListener('keydown', openSearch);
    return () => window.removeEventListener('keydown', openSearch);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const firstLink = menuPanelRef.current?.querySelector<HTMLAnchorElement>('a[href]');
    firstLink?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === 'Tab') {
        const button = menuButtonRef.current;
        const menuLinks = Array.from(menuPanelRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []);
        const focusable: HTMLElement[] = button ? [button, ...menuLinks] : menuLinks;
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="hidden items-center gap-1 lg:flex">
        {PRIMARY_LINKS.map(({ name, href }) => {
          const current = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={current ? 'page' : undefined}
              className={
                'relative rounded-sm px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] transition-colors duration-200 ' +
                (current ? 'text-[#A8C9FF]' : 'text-[#9AA4B2] hover:text-ivory')
              }
            >
              {name}
              {current && <span aria-hidden="true" className="absolute inset-x-2 bottom-0 h-px bg-pride-blue" />}
            </Link>
          );
        })}
        <span aria-hidden="true" className="mx-3 h-4 w-px bg-[#2A2A2A]" />
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="rounded p-2 text-[#C0C9D5] hover:text-white"
          aria-label="Search (Ctrl or Command K)"
        >
          <NavIcon name="search" size={16} />
        </button>
        <Link
          href="/contact"
          aria-current={pathname === '/contact' ? 'page' : undefined}
          className="ml-3 rounded-full border border-pride-blue/40 bg-pride-blue/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:border-[#A8C9FF] hover:bg-pride-blue/25"
        >
          Let&apos;s talk
        </Link>
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
          aria-label="Search site"
          className="rounded p-3 text-[#C0C9D5] hover:text-white"
        >
          <NavIcon name="search" size={18} />
        </button>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="relative z-[60] rounded p-3 text-[#C0C9D5] hover:text-white"
        >
          <NavIcon name={isMobileMenuOpen ? 'close' : 'menu'} size={22} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          ref={menuPanelRef}
          id="mobile-navigation"
          role="region"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-midnight px-6 pb-10 pt-28 lg:hidden"
        >
          <p className="mb-8 text-[10px] uppercase tracking-[0.35em] text-[#9AA4B2]">Explore the site</p>
          <div className="space-y-4">
            {LINKS.map(({ name, href }) => {
              const current = isActivePath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={current ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={
                    'block font-[family-name:var(--font-jetbrains-mono)] text-2xl font-bold transition-colors ' +
                    (current ? 'text-[#A8C9FF]' : 'text-[#E0E0E0] hover:text-white')
                  }
                >
                  <span aria-hidden="true" className="mr-2 text-[#9AA4B2]">&gt;</span>
                  {name}
                </Link>
              );
            })}
          </div>
          <div className="mt-10 border-t border-[#2A2A2A] pt-6">
            <div className="flex flex-wrap gap-6 text-xs uppercase tracking-widest text-[#9AA4B2]">
              <a href="https://x.com/alhajikallon" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://linkedin.com/in/alhaji-c-m-k-8b79a225b" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/Kallon-Tech-savvy" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      )}

      {isSearchOpen && <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
