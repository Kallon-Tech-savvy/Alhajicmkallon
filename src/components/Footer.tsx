import { ArrowUpRight, Send, Users, Code, Mail } from 'lucide-react';
import Link from 'next/link';
import { SUBSTACK_URL } from '@/lib/public-channels';

const SOCIAL_LINKS = [
  { name: 'Substack', icon: <Mail size={14} />, href: SUBSTACK_URL },
  {name: 'facebook', icon: <Users size={14} />, href: 'https://www.facebook.com/profile.php?id=100072626448471' },
  { name: 'twitter', icon: <Send size={14} />, href: 'https://x.com/' },
  { name: 'linkedin', icon: <Users size={14} />, href: 'https://linkedin.com/in/alhaji-c-m-k-8b79a225b'},
  { name: 'github', icon: <Code size={14} />, href: 'https://github.com/Kallon-Tech-savvy' },
  { name: 'mail', icon: <Mail size={14} />, href: 'mailto:info@alhajikallon.com' },
];

const NAV_CMDS = [
  { cmd: 'home', href: '/' },
  { cmd: 'work', href: '/work' },
  { cmd: 'about', href: '/about' },
  { cmd: 'writing', href: '/writing' },
  { cmd: 'knowledge', href: '/knowledge' },
  { cmd: 'FAQ', href: '/faq' },
  { cmd: 'contact', href: '/contact' },
  { cmd: 'privacy', href: '/privacy' },
];

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative overflow-hidden pt-16 pb-8 site-gutter"
      style={{ background: 'var(--color-midnight)', borderTop: '1px solid var(--color-border)' }}
    >
      <div
        className="absolute bottom-0 right-0 pointer-events-none select-none leading-none"
        style={{
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: '22vw',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.012)',
          lineHeight: 0.75,
        }}
      >
        AFRICA
      </div>

      <div className="max-w-[var(--layout-max)] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="reveal-in">
            <h2
              className="mb-10 font-display font-semibold leading-[1.02] text-ivory"
              style={{ fontSize: 'clamp(2rem, 4.6vw, 3.2rem)' }}
            >
              Have an idea that needs a clearer path?
            </h2>

            <p className="mb-8 max-w-xl text-base leading-7 text-[var(--color-muted)]">
              I help founders and teams clarify the problem, decide what to build, and turn the right idea into a working digital product.
            </p>

            <Link prefetch={false}
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-pride-blue px-6 py-3 font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-transform duration-200 hover:-translate-y-0.5 ui-primary"
            >
              Talk through your idea
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <p
                className="mb-6 font-body text-xs uppercase tracking-[0.16em]"
                style={{ color: 'var(--color-muted)' }}
              >
                explore
              </p>
              <ul className="space-y-3">
                {NAV_CMDS.map(item => (
                  <li key={item.cmd}>
                    <Link prefetch={false}
                      href={item.href}
                      className="font-body text-sm transition-colors duration-150 hover:text-accent"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {item.cmd}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p
                className="mb-6 font-body text-xs uppercase tracking-[0.16em]"
                style={{ color: 'var(--color-muted)' }}
              >
                elsewhere
              </p>
              <ul className="space-y-3">
                {SOCIAL_LINKS.map(s => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-body text-sm transition-colors duration-150 hover:text-accent"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {s.icon}
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <span
              className="font-body text-xs uppercase tracking-[0.16em]"
              style={{ color: 'var(--color-muted)' }}
            >
              ALHAJI KALLON (C) {year}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--color-pride-blue)',
                boxShadow: '0 0 6px var(--color-pride-blue)',
              }}
            />
            <span
              className="font-body text-xs uppercase tracking-[0.16em]"
              style={{ color: 'var(--color-muted)' }}
            >
              Available for thoughtful projects
            </span>
          </div>

          <span
            className="font-body text-xs uppercase tracking-[0.16em]"
            style={{ color: 'var(--color-muted)' }}
          >
            Built with purpose / Sierra Leone / West Africa
          </span>
        </div>
      </div>
    </footer>
  );
};

