'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Code, Send, Users, Mail } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Twitter', icon: <Send size={18} />, href: 'https://x.com/alhajikallon' },
    { name: 'LinkedIn', icon: <Users size={18} />, href: 'https://linkedin.com/in/alhajikallon' },
    { name: 'GitHub', icon: <Code size={18} />, href: 'https://github.com/alhajikallon' },
    { name: 'Email', icon: <Mail size={18} />, href: 'mailto:hello@alhajikallon.dev' },
  ];

  return (
    <footer id="contact" className="bg-midnight pt-32 pb-12 px-6 border-t border-white/5 relative overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute bottom-0 right-0 text-white/[0.02] font-space text-[25vw] font-black leading-[0.7] pointer-events-none select-none translate-y-1/4">
        AFRICA
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6 block">
                Let&apos;s Collaborate
              </span>
              <h2 className="font-space text-5xl md:text-7xl font-bold tracking-tighter mb-12 leading-[0.9]">
                Ready to build the <span className="text-gradient">future</span> together?
              </h2>
              <Link
                href="/contact"
                className="inline-flex items-center gap-4 px-10 py-5 bg-gold text-midnight font-space font-black text-sm uppercase tracking-widest hover:bg-ivory transition-all duration-500 group"
              >
                Send a Message
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowUpRight size={20} />
                </motion.span>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="font-space text-gold text-[10px] font-bold uppercase tracking-[0.3em]">Navigation</h3>
              <ul className="space-y-4 font-inter text-muted text-sm">
                <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
                <li><Link href="/work" className="hover:text-gold transition-colors">Work</Link></li>
                <li><Link href="/about" className="hover:text-gold transition-colors">About</Link></li>
                <li><Link href="/writing" className="hover:text-gold transition-colors">Writing</Link></li>
                <li><Link href="/speaking" className="hover:text-gold transition-colors">Speaking</Link></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h3 className="font-space text-gold text-[10px] font-bold uppercase tracking-[0.3em]">Social</h3>
              <ul className="space-y-4 font-inter text-muted text-sm">
                {socialLinks.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gold transition-colors flex items-center gap-2"
                    >
                      {social.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gold flex items-center justify-center rounded-sm font-space font-black text-midnight text-sm">
              A
            </div>
            <span className="font-space text-[10px] font-bold tracking-[0.2em] text-muted uppercase">
              ALHAJI KALLON © {currentYear}
            </span>
          </div>

          <div className="flex gap-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, color: '#D4AF37' }}
                className="text-muted transition-colors"
                aria-label={social.name}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>

          <div className="font-space text-[8px] font-bold tracking-[0.2em] text-muted/50 uppercase">
            Built with Passion in Sierra Leone
          </div>
        </div>
      </div>
    </footer>
  );
};
