import { ThemeSelect } from './ThemeSelect';
import Link from 'next/link';
import { NavbarInteractions } from './NavbarInteractions';

/**
 * Server-rendered navigation shell. The brand never needs hydration; only
 * the menu and search controls participate in the client runtime.
 */
export function Navbar() {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 top-0 z-[60] border-b border-[var(--color-border)] bg-midnight site-gutter py-4"
    >
      <div className="relative z-50 mx-auto flex max-w-[var(--layout-max)] items-center justify-between">
        <Link prefetch={false}
          href="/"
          aria-label="Alhaji Kallon — Home"
          className="group flex select-none items-center gap-2"
        >
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold text-[var(--color-accent)] md:text-sm">
            alhaji
          </span>
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold text-ivory transition-colors group-hover:text-accent md:text-sm">
            kallon
          </span>
          <span
            aria-hidden="true"
            className="cursor-text-blink font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold text-accent md:text-sm"
          >
            █
          </span>
        </Link>

        <div className="flex items-center gap-2"><div className="hidden lg:block"><ThemeSelect /></div><NavbarInteractions /></div>
      </div>
    </nav>
  );
}
