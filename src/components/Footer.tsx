import { ArrowUpRight, Terminal, Send, Users, Code, Mail } from 'lucide-react';
import Link from 'next/link';

const SOCIAL_LINKS = [
  {name: 'facebook', icon: <Users size={14} />, href: 'https://www.facebook.com/profile.php?id=100072626448471' },
  { name: 'twitter', icon: <Send size={14} />, href: 'https://x.com/' },
  { name: 'linkedin', icon: <Users size={14} />, href: 'https://linkedin.com/in/alhaji-c-m-k-8b79a225b'},
  { name: 'github', icon: <Code size={14} />, href: 'https://github.com/Kallon-Tech-savvy' },
  { name: 'mail', icon: <Mail size={14} />, href: 'mailto:hello@alhajikallon.dev' },
];

const NAV_CMDS = [
  { cmd: 'home', href: '/' },
  { cmd: 'work', href: '/work' },
  { cmd: 'about', href: '/about' },
  { cmd: 'Contact', href: '/contact' },
];

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative overflow-hidden pt-24 pb-10 px-6"
      style={{ background: '#0A0A0A', borderTop: '1px solid #2A2A2A' }}
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

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24">
          <div className="reveal-in">
            
            <h2
              className="mb-10 font-space font-semibold leading-[1.02] text-ivory"
              style={{ fontSize: 'clamp(2rem, 4.6vw, 3.2rem)' }}
            >
              Need a calmer, faster digital experience?
            </h2>

            <p className="mb-8 max-w-xl text-base leading-7 text-[#9AA4B2]">
              I help teams turn complex ideas into thoughtful product systems that feel clear from the first click.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-pride-blue px-6 py-3 font-inter text-[12px] font-semibold uppercase tracking-[0.24em] text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              Start a conversation
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <p
                className="mb-6 font-inter text-[10px] uppercase tracking-[0.32em]"
                style={{ color: '#9AA4B2' }}
              >
                navigate
              </p>
              <ul className="space-y-3">
                {NAV_CMDS.map(item => (
                  <li key={item.cmd}>
                    <Link
                      href={item.href}
                      className="font-inter text-sm transition-colors duration-150 hover:text-[var(--color-pride-blue)]"
                      style={{ color: '#9AA4B2' }}
                    >
                      {item.cmd}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p
                className="mb-6 font-inter text-[10px] uppercase tracking-[0.32em]"
                style={{ color: '#9AA4B2' }}
              >
                channels
              </p>
              <ul className="space-y-3">
                {SOCIAL_LINKS.map(s => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-inter text-sm transition-colors duration-150 hover:text-[var(--color-pride-blue)]"
                      style={{ color: '#9AA4B2' }}
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
          style={{ borderTop: '1px solid #2A2A2A' }}
        >
          <div className="flex items-center gap-3">
            
            <span
              className="font-inter text-[10px] uppercase tracking-[0.3em]"
              style={{ color: '#9AA4B2' }}
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
              className="font-inter text-[10px] uppercase tracking-[0.24em]"
              style={{ color: '#9AA4B2' }}
            >
              All systems operational
            </span>
          </div>

          <span
            className="font-inter text-[9px] uppercase tracking-[0.3em]"
            style={{ color: 'rgba(107,114,128,0.5)' }}
          >
            Built with purpose / Sierra Leone / West Africa
          </span>
        </div>
      </div>
    </footer>
  );
};

function StatusItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] uppercase tracking-widest"
        style={{ color: '#6B7280' }}
      >
        {label}:
      </span>
      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
