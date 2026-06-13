'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Code, Map } from 'lucide-react';

export const GlobalSearch = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose(); // This would toggle in a real scenario
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-midnight/90 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="relative w-full max-w-2xl bg-navy border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex items-center space-x-3">
              <Search className="text-muted" size={20} />
              <input
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-ivory placeholder-muted font-inter py-2"
                placeholder="Search projects, articles, resources..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-md text-muted">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {query === '' ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-space font-bold uppercase tracking-widest text-gold mb-3 px-2">Suggestions</h3>
                    <div className="space-y-1">
                      {[
                        { icon: <Code size={16} />, label: 'Technical Projects', desc: 'Software and systems built' },
                        { icon: <FileText size={16} />, label: 'Recent Articles', desc: 'Thoughts on tech and Africa' },
                        { icon: <Map size={16} />, label: 'Innovation Map', desc: 'Visualizing impact across Africa' },
                      ].map((item, i) => (
                        <button key={i} className="w-full flex items-center p-3 rounded-lg hover:bg-white/5 text-left transition-colors group">
                          <div className="p-2 bg-white/5 rounded-md text-muted group-hover:text-gold mr-4">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-ivory">{item.label}</div>
                            <div className="text-xs text-muted">{item.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-muted italic">Searching for "{query}"...</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-white/5 border-t border-white/5 flex justify-end">
              <div className="flex items-center space-x-4 text-[10px] text-muted uppercase tracking-widest font-space">
                <span><kbd className="bg-white/10 px-1 rounded">ESC</kbd> to close</span>
                <span><kbd className="bg-white/10 px-1 rounded">ENTER</kbd> to select</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
