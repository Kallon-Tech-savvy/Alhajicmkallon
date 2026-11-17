import { ThemeSelect } from './ThemeSelect';
import Link from 'next/link';
import Image from 'next/image';
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
          <Image
            src="/assets/brand/portrait-logo.png"
            alt=""
            width={40}
            height={40}
            sizes="40px"
            className="brand-logo"
          />
          <span className="brand-name">
            Alhaji C M Kallon<span>A deliberate balance</span>
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
