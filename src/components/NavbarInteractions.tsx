'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ThemeSelect } from './ThemeSelect';
import { usePathname } from 'next/navigation';
import { cycleNavigationFocus } from '@/lib/navigation-focus.mjs';

const GlobalSearch = dynamic(
  () => import('./GlobalSearch').then((module) => module.GlobalSearch),
  { ssr: false }
);

const LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Work', href: '/work' },
  { name: 'About', href: '/about' },
  { name: 'Writing', href: '/writing' },
  { name: 'Learn', href: '/knowledge' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
] as const;

const PRIMARY_LINKS = LINKS.filter(
  ({ href }) => !['/', '/faq', '/contact', '/knowledge'].includes(href)
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
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);
  const learningMenuRef = useRef<HTMLDetailsElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (learningMenuRef.current) learningMenuRef.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const closeLearningMenu = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && learningMenuRef.current?.open) {
        learningMenuRef.current.open = false;
        learningMenuRef.current.querySelector('summary')?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (learningMenuRef.current && !learningMenuRef.current.contains(event.target as Node)) learningMenuRef.current.open = false;
    };
    const onResize = () => { if (window.innerWidth >= 1024) setIsMobileMenuOpen(false); };
    window.addEventListener('keydown', closeLearningMenu);
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', closeLearningMenu);
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

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
        const menuLinks = Array.from(menuPanelRef.current?.querySelectorAll<HTMLElement>('a[href], select') ?? []);
        const focusable: HTMLElement[] = button ? [button, ...menuLinks] : menuLinks;
        cycleNavigationFocus(event, focusable, document.activeElement);
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
            <Link prefetch={false}
              key={href}
              href={href}
              aria-current={current ? 'page' : undefined}
              className={
                'relative rounded-xl px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-200 ' +
                (current ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)] hover:text-ivory')
              }
            >
              {name}
              {current && <span aria-hidden="true" className="absolute inset-x-2 bottom-0 h-px bg-pride-blue" />}
            </Link>
          );
        })}
        <details ref={learningMenuRef} className="relative">
          <summary className={'cursor-pointer rounded px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ' + (isActivePath(pathname, '/knowledge') ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]')}>Learn</summary>
          <div className="absolute right-0 top-full mt-3 w-80 rounded-xl border border-border bg-surface p-3 shadow-2xl">
            <p className="px-3 py-2 text-xs text-[var(--color-muted)]">Choose your next step</p>
            {[['Learning hub', '/knowledge', 'All guides and learning paths'], ['New to development', '/knowledge#beginner', 'HTML, CSS and first projects'], ['Beyond the basics', '/knowledge#intermediate', 'JavaScript, APIs and TypeScript'], ['Working as a junior', '/knowledge#junior', 'Delivery, testing and code review']].map(([title, href, description]) => <Link prefetch={false} key={href} href={href} onClick={() => { if (learningMenuRef.current) learningMenuRef.current.open = false; }} className="block rounded-lg p-3 hover:bg-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"><span className="block text-sm font-semibold text-ivory">{title}</span><span className="mt-1 block text-xs text-[var(--color-muted)]">{description}</span></Link>)}
          </div>
        </details>
        <span aria-hidden="true" className="mx-3 h-4 w-px bg-[var(--color-border)]" />
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="rounded p-2 text-[var(--color-muted)] hover:text-ivory"
          aria-label="Search (Ctrl or Command K)"
        >
          <NavIcon name="search" size={16} />
        </button>
        <Link prefetch={false}
          href="/contact"
          aria-current={pathname === '/contact' ? 'page' : undefined}
          className="ml-3 rounded-full border border-pride-blue/40 bg-pride-blue/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:border-[var(--color-accent)] hover:bg-pride-blue/25 ui-primary"
        >
          Let&apos;s talk
        </Link>
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
          aria-label="Search site"
          className="rounded p-3 text-[var(--color-muted)] hover:text-ivory"
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
          className="relative z-[60] inline-flex min-h-12 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
        >
          <span className="text-sm font-semibold">{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
          <NavIcon name={isMobileMenuOpen ? 'close' : 'menu'} size={22} />
        </button>
      </div>

      {isMobileMenuOpen && createPortal(
        <div
          ref={menuPanelRef}
          id="mobile-navigation"
          role="region"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-[var(--color-midnight)] px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 text-[var(--color-ivory)] lg:hidden"
        >
          <div className="mx-auto w-full max-w-lg">
          <div className="mb-4 flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Navigation</p><ThemeSelect /></div>
          <h2 className="mb-6 mt-2 text-3xl font-bold tracking-tight text-[var(--color-ivory)]">Explore the site</h2>
          <div className="space-y-2">
            {LINKS.map(({ name, href }) => {
              const current = isActivePath(pathname, href);
              return (
                <Link prefetch={false}
                  key={href}
                  href={href}
                  aria-current={current ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={
                    'flex min-h-14 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xl font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ' +
                    (current ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-midnight' : 'border-[var(--color-border)] bg-surface text-[var(--color-ivory)] hover:border-[var(--color-accent)] hover:bg-[var(--color-navy)]')
                  }
                >
                  <span>{name}</span>
                  {current ? <span className="text-xs font-medium">Current</span> : <span aria-hidden="true" className="text-[var(--color-muted)]">→</span>}
                </Link>
              );
            })}
          </div>
          <div className="mt-7 rounded-xl border border-[var(--color-border)] bg-[var(--color-navy)] p-4"><h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">Learning paths</h2><div className="space-y-1">{[['New to development', 'beginner'], ['Beyond the basics', 'intermediate'], ['Working as a junior', 'junior']].map(([title, id]) => <Link prefetch={false} key={id} href={'/knowledge#' + id} onClick={() => setIsMobileMenuOpen(false)} className="block min-h-12 rounded-lg px-2 py-3 text-base font-semibold text-[var(--color-accent)] hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]">{title} →</Link>)}</div></div>
          <div className="mt-7 border-t border-[var(--color-border)] pt-6">
            <div className="flex flex-wrap gap-6 text-sm font-medium text-[var(--color-accent)] underline underline-offset-4">
              <a href="https://x.com/alhajikallon" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://linkedin.com/in/alhaji-c-m-k-8b79a225b" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/Kallon-Tech-savvy" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
          </div>
        </div>, document.body
      )}

      {isSearchOpen && createPortal(<GlobalSearch isOpen={isSearchOpen} onClose={closeSearch} />, document.body)}
    </>
  );
}
