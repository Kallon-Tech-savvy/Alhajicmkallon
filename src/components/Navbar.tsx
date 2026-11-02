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
      className="fixed inset-x-0 top-0 z-[60] border-b border-[#2A2A2A] bg-midnight/90 px-6 py-4 backdrop-blur-xl md:px-10"
    >
      <div className="relative z-50 mx-auto flex max-w-7xl items-center justify-between">
        <Link
          href="/"
          aria-label="Alhaji Kallon — Home"
          className="group flex select-none items-center gap-2"
        >
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold text-[#A8C9FF] md:text-sm">
            alhaji
          </span>
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold text-ivory transition-colors group-hover:text-pride-blue md:text-sm">
            kallon
          </span>
          <span
            aria-hidden="true"
            className="cursor-text-blink font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold text-pride-blue md:text-sm"
          >
            █
          </span>
        </Link>

        <NavbarInteractions />
      </div>
    </nav>
  );
}
