'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Code, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SearchProject {
  id: string;
  title: string;
  summary: string;
  href: string;
}

interface SearchArticle {
  slug: string;
  title: string;
  excerpt: string;
  href: string;
}

interface SearchResults {
  projects: SearchProject[];
  articles: SearchArticle[];
}

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
const EMPTY_RESULTS: SearchResults = { projects: [], articles: [] };

export const GlobalSearch = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled])'
        )];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  // Search stays server-side; a cancelled response cannot replace newer results.
  useEffect(() => {
    const normalized = query.trim();
    if (!isOpen || !normalized) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(normalized)}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Search is temporarily unavailable');
        const payload: SearchResults = await response.json();
        if (!controller.signal.aborted) {
          setResults(payload);
          setSearchStatus('success');
        }
      } catch {
        if (!controller.signal.aborted) {
          setResults(EMPTY_RESULTS);
          setSearchStatus('error');
        }
      }
    }, 220);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, isOpen]);

  const { projects: filteredProjects, articles: filteredArticles } = results;

  return isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 pb-6 px-4">
          <div
            className="fixed inset-0 bg-midnight/95 backdrop-blur-xl"
            onClick={onClose}
            aria-hidden="true"
          />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-search-title"
            className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden "
          >
            <div className="p-6 border-b border-border flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent" aria-hidden="true">
                <Search size={20} />
              </div>
              <h2 id="global-search-title" className="sr-only">Search this website</h2>
              <input
                ref={inputRef}
                aria-label="Search projects and articles"
                className="min-w-0 flex-1 bg-transparent border-none outline-none text-ivory placeholder-muted font-display text-xl py-2 font-bold"
                placeholder="Search anything..."
                value={query}
                maxLength={120}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuery(value);
                  setResults(EMPTY_RESULTS);
                  setSearchStatus(value.trim() ? 'loading' : 'idle');
                }}
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="p-2 hover:bg-white/5 rounded-full text-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar" aria-live="polite" aria-busy={searchStatus === 'loading'}>
              {query.trim() === '' ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs font-display font-bold uppercase tracking-[0.16em] text-muted mb-4 px-2">Popular Categories</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { icon: <Code size={18} />, label: 'Case Studies', href: '/work', color: 'text-accent' },
                        { icon: <FileText size={18} />, label: 'Writing', href: '/writing', color: 'text-accent' },
                        { icon: <BookOpen size={18} />, label: 'Knowledge', href: '/knowledge', color: 'text-accent' },
                        { icon: <ArrowRight size={18} />, label: 'About Alhaji', href: '/about', color: 'text-accent' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={false}
                          onClick={onClose}
                          className="flex items-center p-4 rounded-xl hover:bg-white/5 text-left transition-all duration-300 group border border-transparent hover:border-border"
                        >
                          <div className="p-2 bg-white/5 rounded-lg mr-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                            {item.icon}
                          </div>
                          <div className="text-sm font-display font-bold text-ivory uppercase tracking-widest">{item.label}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : searchStatus === 'loading' ? (
                <p role="status" className="py-12 text-center text-sm text-muted">Searching published work and writing…</p>
              ) : searchStatus === 'error' ? (
                <div role="alert" className="py-12 text-center text-sm text-ivory">
                  <p>Search could not be completed. Please change your query or browse directly.</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-4">
                    <Link href="/work" prefetch={false} onClick={onClose} className="text-[var(--color-accent)] underline underline-offset-4">Work</Link>
                    <Link href="/writing" prefetch={false} onClick={onClose} className="text-[var(--color-accent)] underline underline-offset-4">Writing</Link>
                    <Link href="/knowledge" prefetch={false} onClick={onClose} className="text-[var(--color-accent)] underline underline-offset-4">Knowledge</Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredProjects.length > 0 && (
                    <div>
                      <h3 className="text-xs font-display font-bold uppercase tracking-[0.16em] text-muted mb-4 px-2">Projects</h3>
                      <div className="space-y-2">
                        {filteredProjects.map(p => (
                          <Link key={p.id} href={p.href} prefetch={false} onClick={onClose} className="block p-4 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-sm font-display font-bold text-ivory group-hover:text-accent uppercase tracking-widest">{p.title}</div>
                            <div className="text-xs text-muted mt-1">{p.summary}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredArticles.length > 0 && (
                    <div>
                      <h3 className="text-xs font-display font-bold uppercase tracking-[0.16em] text-muted mb-4 px-2">Articles</h3>
                      <div className="space-y-2">
                        {filteredArticles.map((a) => (
                          <Link key={a.slug} href={a.href} prefetch={false} onClick={onClose} className="block p-4 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-sm font-display font-bold text-ivory group-hover:text-accent uppercase tracking-widest">{a.title}</div>
                            <div className="text-xs text-muted mt-1">{a.excerpt}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchStatus === 'success' && filteredProjects.length === 0 && filteredArticles.length === 0 && (
                    <div className="py-20 text-center">
                      <p className="text-muted italic font-body text-muted">No results found for &quot;{query}&quot;</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5 border-t border-border flex justify-between items-center px-6">
              <div className="flex items-center space-x-4 text-xs text-muted uppercase tracking-[0.2em] font-display font-bold">
                <span><kbd className="bg-white/10 px-2 py-1 rounded text-ivory">ESC</kbd> to close</span>
              </div>
              <div className="flex items-center space-x-1 text-accent/30" aria-hidden="true">
                <div className="w-1 h-1 rounded-full bg-current" />
                <div className="w-1 h-1 rounded-full bg-current" />
                <div className="w-1 h-1 rounded-full bg-current" />
              </div>
            </div>
          </div>
        </div>
  ) : null;
};
