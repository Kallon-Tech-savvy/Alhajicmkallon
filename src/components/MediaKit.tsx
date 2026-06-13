'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Image as ImageIcon, X } from 'lucide-react';

export const MediaKit = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const assets = [
    { title: "Professional Bio", type: "PDF", size: "1.2 MB", icon: <FileText size={20} /> },
    { title: "Headshots (Package)", type: "ZIP", size: "45 MB", icon: <ImageIcon size={20} /> },
    { title: "Speaker Rider", type: "PDF", size: "0.8 MB", icon: <FileText size={20} /> },
    { title: "Brand Guidelines", type: "PDF", size: "3.4 MB", icon: <FileText size={20} /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-midnight/90 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-navy border border-gold/20 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-space font-bold mb-1">Media Kit</h3>
                <p className="text-muted text-sm font-inter">Resources for press and speaking engagements.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-muted transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-4">
              {assets.map((asset, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="text-gold opacity-60 group-hover:opacity-100 transition-opacity">
                      {asset.icon}
                    </div>
                    <div>
                      <div className="text-sm font-space font-bold text-ivory">{asset.title}</div>
                      <div className="text-[10px] text-muted uppercase tracking-widest">{asset.type} • {asset.size}</div>
                    </div>
                  </div>
                  <button className="p-2 text-muted hover:text-gold transition-colors">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-8 bg-gold/5 flex justify-center">
              <button className="flex items-center gap-2 text-xs font-space font-bold uppercase tracking-[0.2em] text-gold hover:text-ivory transition-colors">
                Download Full Kit (ZIP) <Download size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
