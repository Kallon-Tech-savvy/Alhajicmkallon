'use client';

import { useEffect, useState } from 'react';
import { resolveTheme, THEME_KEY } from '@/lib/theme.mjs';

type Theme = 'system' | 'light' | 'dark';
export function ThemeSelect() {
  const [preference, setPreference] = useState<Theme>('system');
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const read = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem(THEME_KEY); } catch {}
      const next = saved === 'light' || saved === 'dark' ? saved : 'system';
      setPreference(next);
      document.documentElement.dataset.theme = resolveTheme(next, media.matches);
    };
    const sync = (event: Event) => setPreference((event as CustomEvent<Theme>).detail);
    read();
    media.addEventListener('change', read);
    window.addEventListener('storage', read);
    window.addEventListener('theme-change', sync);
    return () => { media.removeEventListener('change', read); window.removeEventListener('storage', read); window.removeEventListener('theme-change', sync); };
  }, []);
  return <label className="flex items-center gap-2 text-xs text-muted"><span className="sr-only">Colour theme</span><select aria-label="Colour theme" value={preference} onChange={event => {
    const next = event.target.value as Theme;
    setPreference(next);
    try { localStorage.setItem(THEME_KEY, next); } catch {}
    document.documentElement.dataset.theme = resolveTheme(next, window.matchMedia('(prefers-color-scheme: dark)').matches);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: next }));
  }} className="min-h-11 max-w-24 rounded border border-border bg-surface px-2 text-sm text-ivory"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label>;
}
