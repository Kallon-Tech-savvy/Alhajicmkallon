import { Arrow } from './SwissMarks';
import Link from 'next/link';
import { SUBSTACK_URL } from '@/lib/public-channels';

const SOCIAL_LINKS = [
  { name: 'Substack', href: SUBSTACK_URL },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/alhaji-c-m-k-8b79a225b' },
  { name: 'GitHub', href: 'https://github.com/Kallon-Tech-savvy' },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100072626448471' },
];
const NAV_LINKS = [
  { name: 'Work', href: '/work' },
  { name: 'About', href: '/about' },
  { name: 'Writing', href: '/writing' },
  { name: 'Learn', href: '/knowledge' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Privacy', href: '/privacy' },
];

export const Footer = () => (
  <footer className="swiss-footer site-gutter">
    <div className="mx-auto max-w-[var(--layout-max)]">
      <div className="footer-invitation">
        <div>
          <p className="swiss-meta">Have something in mind?</p>
          <h2>
            Let’s talk
            <br />
            it through<span>.</span>
          </h2>
          <p className="footer-invitation-copy">
            Tell me what you’re trying to do. I’ll tell you honestly how I can help.
          </p>
        </div>
        <Link
          prefetch={false}
          href="/contact"
          className="footer-contact-link"
        >
          <span>Start a conversation</span>
          <span className="footer-arrow" aria-hidden="true">
            <Arrow />
          </span>
        </Link>
      </div>
      <div className="footer-details">
        <div>
          <Link prefetch={false} href="/" className="footer-name">
            Alhaji C M Kallon
          </Link>
          <p className="mt-2 text-sm text-muted">
            A deliberate balance.
            <br />
            Design, engineering and curiosity.
          </p>
          <a href="mailto:info@alhajikallon.com" className="swiss-text-link mt-4">
            info@alhajikallon.com <Arrow />
          </a>
        </div>
        <nav aria-label="Footer navigation">
          <p className="swiss-meta mb-4 text-muted">Explore</p>
          <ul>
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link prefetch={false} href={item.href}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="swiss-meta mb-4 text-muted">Find me elsewhere</p>
          <ul>
            {SOCIAL_LINKS.map((item) => (
              <li key={item.name}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.name} <Arrow />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-colophon swiss-meta">
        <span>© {new Date().getFullYear()} Alhaji C M Kallon</span>
        <span>
          Designed and built by Alhaji in Freetown.{' '}
          <span aria-hidden="true">
            <Arrow />
          </span>
        </span>
      </div>
    </div>
  </footer>
);
