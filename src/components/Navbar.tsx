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
      className="liquid-navigation fixed inset-x-0 top-0 z-[60] border-b border-[var(--color-border)] bg-midnight site-gutter py-4"
    >
      <div className="relative z-50 mx-auto flex max-w-[var(--layout-max)] items-center justify-between">
        <Link prefetch={false}
          href="/"
          aria-label="Alhaji Kallon — Home"
          className="group flex select-none items-center gap-2"
        >
          <span className="text-sm font-medium tracking-tight text-ivory">Alhaji Kallon</span>
        </Link>

        <div className="flex items-center gap-2"><div className="hidden lg:block"><ThemeSelect /></div><NavbarInteractions /></div>
      </div>
    </nav>
  );
}
