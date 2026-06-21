'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlobalSearch } from './GlobalSearch';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Work', href: '/work' },
    { name: 'About', href: '/about' },
    { name: 'Writing', href: '/writing' },
    { name: 'Speaking', href: '/speaking' },
    { name: 'Contact', href: '/contact' },
  ];


  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-6 md:px-12',
          isScrolled ? 'bg-midnight/80 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-gold flex items-center justify-center rounded-sm font-space font-black text-midnight text-xl relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="absolute inset-0 bg-ivory"
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">A</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-space font-bold text-sm tracking-tighter text-ivory group-hover:text-gold transition-colors">ALHAJI KALLON</span>
              <span className="font-space text-[8px] font-bold tracking-[0.2em] text-muted uppercase">Design Engineer</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-[10px] font-space font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-sm relative group",
                  pathname === link.href ? "text-gold" : "text-muted hover:text-ivory"
                )}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-4 right-4 h-[1px] bg-gold"
                  />
                )}
                <motion.div
                  className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-sm -z-10"
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}

            <div className="h-4 w-[1px] bg-white/10 mx-4" />

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-muted hover:text-gold transition-all duration-300 hover:scale-110"
              aria-label="Search"
            >
              <Search size={16} />
            </button>

            <Link
              href="/contact"
              aria-label="Contact Alhaji" className="ml-4 px-6 py-2 bg-gold text-midnight font-space font-bold text-[10px] uppercase tracking-[0.15em] rounded-sm hover:bg-ivory transition-colors flex items-center gap-2"
            >
              Let&apos;s Build <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center space-x-2" aria-label="Mobile Menu">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-muted"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted relative z-[60]"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 bg-midnight lg:hidden flex flex-col p-12 justify-center"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-navy/20 -z-10" />
              <div className="space-y-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "text-5xl font-space font-bold tracking-tighter block",
                        pathname === link.href ? "text-gold" : "text-ivory hover:text-gold"
                      )}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-24 pt-12 border-t border-white/5"
              >
                <p className="text-muted text-sm font-inter mb-6">Connect with me</p>
                <div className="flex gap-8 font-space font-bold text-xs uppercase tracking-widest text-ivory">
                  <a href="#" className="hover:text-gold">Twitter</a>
                  <a href="#" className="hover:text-gold">LinkedIn</a>
                  <a href="#" className="hover:text-gold">GitHub</a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
