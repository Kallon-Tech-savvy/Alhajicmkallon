'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, ExternalLink } from 'lucide-react';
import { MediaKit } from './MediaKit';

export const Footer = () => {
  const [isMediaKitOpen, setIsMediaKitOpen] = useState(false);

  return (
    <footer id="contact" className="bg-midnight pt-24 pb-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-6xl font-space font-bold tracking-tighter mb-8 leading-tight">
                Let's build the <br />
                <span className="text-gold italic font-cormorant font-medium">future together.</span>
              </h2>
              <p className="text-muted text-lg font-inter max-w-md leading-relaxed">
                Whether you're looking for a partnership, a speaker, or just a conversation about
                innovation in Africa, I'd love to hear from you.
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Mail size={20} />, label: "Email", href: "mailto:hello@alhajikallon.com" },
                { icon: <Send size={20} />, label: "Substack", href: "https://substack.com/@alhajicmkallon" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                  className="p-4 rounded-xl border border-white/5 flex items-center justify-center text-muted hover:text-gold transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <div className="glass p-8 md:p-12 rounded-3xl">
              <h3 className="font-space text-2xl font-bold mb-6">Stay Informed</h3>
              <p className="text-muted text-sm font-inter mb-8">
                Join my monthly newsletter for insights on technology, innovation, and youth empowerment in Africa.
              </p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-navy/50 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-gold/50 transition-colors font-inter text-ivory"
                  />
                  <button className="absolute right-2 top-2 bottom-2 bg-gold text-midnight px-6 rounded-lg font-space font-bold text-xs uppercase tracking-widest hover:bg-ivory transition-colors">
                    Join
                  </button>
                </div>
                <p className="text-[10px] text-muted text-center uppercase tracking-widest">
                  Integrated with <a href="https://substack.com/@alhajicmkallon" className="text-gold underline" target="_blank" rel="noopener noreferrer">Substack</a>
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8">
          <div className="text-xl font-space font-bold tracking-tighter">
            AK<span className="text-gold">.</span>
          </div>

          <div className="flex gap-8 text-[10px] font-space font-bold uppercase tracking-[0.2em] text-muted">
            <button className="hover:text-gold transition-colors">Download CV</button>
            <button
              onClick={() => setIsMediaKitOpen(true)}
              className="hover:text-gold transition-colors"
            >
              Media Kit
            </button>
            <button className="hover:text-gold transition-colors">Privacy</button>
          </div>

          <div className="text-[10px] font-space font-bold uppercase tracking-[0.2em] text-muted">
            &copy; {new Date().getFullYear()} ALHAJI KALLON
          </div>
        </div>
      </div>

      <MediaKit isOpen={isMediaKitOpen} onClose={() => setIsMediaKitOpen(false)} />
    </footer>
  );
};
