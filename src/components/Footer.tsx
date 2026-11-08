import { Users, Code, Mail } from 'lucide-react';
import Link from 'next/link';
import { SUBSTACK_URL } from '@/lib/public-channels';

const SOCIAL_LINKS = [
  { name: 'Substack', icon: <Mail size={14} />, href: SUBSTACK_URL },
  {name: 'facebook', icon: <Users size={14} />, href: 'https://www.facebook.com/profile.php?id=100072626448471' },
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

export const Footer = () => <footer className="site-gutter border-t border-border py-12"><div className="mx-auto max-w-[var(--layout-max)]"><div className="grid gap-10 md:grid-cols-12"><div className="md:col-span-6"><Link prefetch={false} href="/" className="text-xl font-semibold">Alhaji C.M. Kallon</Link><p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">Design engineering from Freetown, Sierra Leone.<br />Clear thinking, considered experiences and working products.</p><a href="mailto:info@alhajikallon.com" className="editorial-link mt-5">Email me ↗</a></div><nav aria-label="Footer navigation" className="md:col-span-3"><p className="editorial-kicker mb-4 text-muted">Explore</p><ul className="grid gap-3">{NAV_CMDS.map(item=><li key={item.cmd}><Link prefetch={false} href={item.href} className="text-sm capitalize hover:text-accent">{item.cmd}</Link></li>)}</ul></nav><div className="md:col-span-3"><p className="editorial-kicker mb-4 text-muted">Elsewhere</p><ul className="grid gap-3">{SOCIAL_LINKS.map(item=><li key={item.name}><a href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm capitalize hover:text-accent">{item.icon}{item.name} ↗</a></li>)}</ul></div></div><p className="mt-10 border-t border-border pt-5 text-xs text-muted">© {new Date().getFullYear()} Alhaji C.M. Kallon · Built with care in Sierra Leone.</p></div></footer>;
