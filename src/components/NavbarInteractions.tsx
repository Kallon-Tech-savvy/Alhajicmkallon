'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { InteractionLoading, InteractionLoadingContext } from './InteractionLoading';
import Link from 'next/link';
import { ThemeSelect } from './ThemeSelect';
import { usePathname } from 'next/navigation';
import { cycleNavigationFocus } from '@/lib/navigation-focus.mjs';

const loadSearch = () => import('./GlobalSearch').then((module) => module.GlobalSearch);
const preloadSearch = () => {
  void loadSearch().catch(() => {});
};
const GlobalSearch = dynamic(loadSearch, { ssr: false, loading: InteractionLoading });

const LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Work', href: '/work' },
  { name: 'About', href: '/about' },
  { name: 'Writing', href: '/writing' },
  { name: 'Learn', href: '/knowledge' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
] as const;

const PRIMARY_LINKS = LINKS.filter(({ href }) => !['/', '/faq', '/contact'].includes(href));

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
    return (
      <svg {...props}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    );
  }
  if (name === 'close') {
    return (
      <svg {...props}>
        <path d="m18 6-12 12M6 6l12 12" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

/** A small client island for navigation, mobile disclosure, and on-demand search. */
export function NavbarInteractions() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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
        const menuLinks = Array.from(
          menuPanelRef.current?.querySelectorAll<HTMLElement>('a[href], select, summary') ?? [],
        ).filter(
          (element) =>
            element.getClientRects().length > 0 &&
            (element.tagName === 'SUMMARY' || !element.closest('details:not([open])')),
        );
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
            <Link
              prefetch={false}
              key={href}
              href={href}
              aria-current={current ? 'page' : undefined}
              className="ui-shell-link"
            >
              {name}
            </Link>
          );
        })}
        <span aria-hidden="true" className="mx-3 h-4 w-px bg-[var(--color-border)]" />
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="ui-icon-button"
          onPointerEnter={preloadSearch}
          onFocus={preloadSearch}
          onPointerDown={preloadSearch}
          aria-label="Search (Ctrl or Command K)"
        >
          <NavIcon name="search" size={16} />
          <span className="nav-search-label">Search</span>
        </button>
        <Link
          prefetch={false}
          href="/contact"
          aria-current={pathname === '/contact' ? 'page' : undefined}
          className="ui-primary ml-3"
        >
          Let’s talk <span aria-hidden="true">↗︎</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsSearchOpen(true);
          }}
          onPointerEnter={preloadSearch}
          onFocus={preloadSearch}
          onPointerDown={preloadSearch}
          aria-label="Search site"
          className="ui-icon-button"
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
          className="ui-icon-button relative z-[60] gap-2"
        >
          <span className="text-sm font-semibold">{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
          <NavIcon name={isMobileMenuOpen ? 'close' : 'menu'} size={22} />
        </button>
      </div>

      {isMobileMenuOpen &&
        createPortal(
          <div
            ref={menuPanelRef}
            id="mobile-navigation"
            role="region"
            aria-label="Mobile navigation"
            className="liquid-menu fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-[var(--color-midnight)] px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 text-[var(--color-ivory)] lg:hidden"
          >
            <div className="mx-auto w-full max-w-lg">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-[var(--color-muted)]">Navigation</p>
                <ThemeSelect />
              </div>
              <h2 className="mb-6 mt-2 text-3xl font-bold tracking-tight text-[var(--color-ivory)]">
                Find your next step
              </h2>
              <div className="mobile-primary-links">
                {LINKS.map(({ name, href }) => {
                  const current = isActivePath(pathname, href);
                  return (
                    <Link
                      prefetch={false}
                      key={href}
                      href={href}
                      aria-current={current ? 'page' : undefined}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={
                        'flex min-h-14 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xl font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ' +
                        (current
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-midnight'
                          : 'border-[var(--color-border)] bg-surface text-[var(--color-ivory)] hover:border-[var(--color-accent)] hover:bg-[var(--color-navy)]')
                      }
                    >
                      <span>{name}</span>
                      {current ? (
                        <span className="text-xs font-medium">Current</span>
                      ) : (
                        <span aria-hidden="true" className="text-[var(--color-muted)]">
                          →
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
              <details className="mobile-learning">
                <summary>
                  Learning paths <span aria-hidden="true">+</span>
                </summary>
                <div className="pt-4">
                  <Link
                    prefetch={false}
                    href="/knowledge/protocols"
                    aria-current={
                      pathname === '/knowledge/protocols'
                        ? 'page'
                        : pathname.startsWith('/knowledge/protocols-')
                          ? 'location'
                          : undefined
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mb-3 block rounded-lg border border-border bg-surface px-3 py-4 text-accent hover:bg-midnight"
                  >
                    <span className="block text-base font-semibold">Protocol course →</span>
                    <span className="mt-1 block text-sm text-muted">
                      12 practical lessons · Free to read
                    </span>
                  </Link>
                  <div className="space-y-1">
                    {[
                      ['New to development', 'beginner'],
                      ['Beyond the basics', 'intermediate'],
                      ['Working as a junior', 'junior'],
                    ].map(([title, id]) => (
                      <Link
                        prefetch={false}
                        key={id}
                        href={'/knowledge#' + id}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block min-h-12 rounded-lg px-2 py-3 text-base font-semibold text-[var(--color-accent)] hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                      >
                        {title} →
                      </Link>
                    ))}
                  </div>
                </div>
              </details>
              <div className="mt-7 border-t border-[var(--color-border)] pt-6">
                <div className="flex flex-wrap gap-6 text-sm font-medium text-[var(--color-accent)] underline underline-offset-4">
                  <a href="https://x.com/alhajikallon" target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                  <a
                    href="https://linkedin.com/in/alhaji-c-m-k-8b79a225b"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/Kallon-Tech-savvy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {isSearchOpen &&
        createPortal(
          <InteractionLoadingContext.Provider
            value={{ kind: 'search', open: isSearchOpen, onClose: closeSearch }}
          >
            <GlobalSearch isOpen={isSearchOpen} onClose={closeSearch} />
          </InteractionLoadingContext.Provider>,
          document.body,
        )}
    </>
  );
}
