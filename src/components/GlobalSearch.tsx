'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Code, Map, ArrowRight } from 'lucide-react';
import { PROJECTS, ARTICLES } from '@/lib/content';
import Link from 'next/link';

export const GlobalSearch = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose(); // This logic needs to be handled by parent state ideally
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredProjects = query === '' ? [] : PROJECTS.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredArticles = query === '' ? [] : ARTICLES.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-midnight/95 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-navy/50 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl"
          >
            <div className="p-6 border-b border-white/5 flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <Search size={20} />
              </div>
              <input
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-ivory placeholder-muted font-space text-xl py-2 font-bold"
                placeholder="Search anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {query === '' ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-[10px] font-space font-bold uppercase tracking-[0.3em] text-gold/50 mb-4 px-2">Popular Categories</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { icon: <Code size={18} />, label: 'Case Studies', href: '/work', color: 'text-blue-400' },
                        { icon: <FileText size={18} />, label: 'Writing', href: '/writing', color: 'text-purple-400' },
                        { icon: <Map size={18} />, label: 'Speaking', href: '/speaking', color: 'text-blue-400' },
                        { icon: <ArrowRight size={18} />, label: 'About Alhaji', href: '/about', color: 'text-gold' },
                      ].map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          onClick={onClose}
                          className="flex items-center p-4 rounded-xl hover:bg-white/5 text-left transition-all duration-300 group border border-transparent hover:border-white/5"
                        >
                          <div className="p-2 bg-white/5 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                            {item.icon}
                          </div>
                          <div className="text-sm font-space font-bold text-ivory uppercase tracking-widest">{item.label}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredProjects.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-space font-bold uppercase tracking-[0.3em] text-gold/50 mb-4 px-2">Projects</h3>
                      <div className="space-y-2">
                        {filteredProjects.map(p => (
                          <Link key={p.id} href={`/work#${p.id}`} onClick={onClose} className="block p-4 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-sm font-space font-bold text-ivory group-hover:text-gold uppercase tracking-widest">{p.title}</div>
                            <div className="text-xs text-muted mt-1">{p.description}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredArticles.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-space font-bold uppercase tracking-[0.3em] text-gold/50 mb-4 px-2">Articles</h3>
                      <div className="space-y-2">
                        {filteredArticles.map(a => (
                          <Link key={a.slug} href={`/writing/${a.slug}`} onClick={onClose} className="block p-4 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-sm font-space font-bold text-ivory group-hover:text-gold uppercase tracking-widest">{a.title}</div>
                            <div className="text-xs text-muted mt-1">{a.excerpt}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredProjects.length === 0 && filteredArticles.length === 0 && (
                    <div className="py-20 text-center">
                      <p className="text-muted italic font-inter text-ivory/50">No results found for &quot;{query}&quot;</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5 flex justify-between items-center px-6">
              <div className="flex items-center space-x-4 text-[9px] text-muted uppercase tracking-[0.2em] font-space font-bold">
                <span><kbd className="bg-white/10 px-2 py-1 rounded text-ivory">ESC</kbd> to close</span>
              </div>
              <div className="flex items-center space-x-1 text-gold/30">
                <div className="w-1 h-1 rounded-full bg-current" />
                <div className="w-1 h-1 rounded-full bg-current" />
                <div className="w-1 h-1 rounded-full bg-current" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
