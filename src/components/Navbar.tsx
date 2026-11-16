import { ThemeSelect } from './ThemeSelect';
import Link from 'next/link';
import { NavbarInteractions } from './NavbarInteractions';

/** Static identity with a small client island for navigation controls. */
export function Navbar() {
  return (
    <nav
      aria-label="Primary navigation"
      className="swiss-navigation fixed inset-x-0 top-0 z-[60] site-gutter"
    >
      <div className="nav-inner mx-auto flex max-w-[var(--layout-max)] items-center justify-between">
        <Link prefetch={false} href="/" aria-label="Alhaji Kallon — Home" className="swiss-brand">
          <span className="brand-mark" aria-hidden="true">
            a<span>k</span>
            <i />
          </span>
          <span className="brand-name">
            Alhaji Kallon<span>Design engineer</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <ThemeSelect />
          </div>
          <NavbarInteractions />
        </div>
      </div>
    </nav>
  );
}
