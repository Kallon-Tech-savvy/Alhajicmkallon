'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';

export const NewsletterCTA = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Mock subscription
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <section className="py-32 px-6 bg-gold relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <span className="font-space text-midnight text-xs font-black tracking-[0.4em] uppercase mb-8 block">
            The Future Builder Newsletter
          </span>
          <h2 className="font-space text-4xl md:text-6xl font-black tracking-tighter text-midnight mb-8 leading-tight">
            GET WEEKLY INSIGHTS ON <br />AFRICA&apos;S INNOVATION.
          </h2>
          <p className="text-midnight/70 text-lg md:text-xl font-medium font-inter mb-12 max-w-2xl mx-auto">
            Join 500+ readers building Africa&apos;s future. Receive deep dives on technology,
            design engineering, and youth leadership.
          </p>

          <AnimatePresence mode="wait">
            {status !== 'success' ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-8 py-5 bg-midnight text-ivory font-space font-bold text-sm uppercase tracking-widest outline-none border-none focus:ring-2 focus:ring-ivory/20 transition-all placeholder:text-muted/50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-10 py-5 bg-ivory text-midnight font-space font-black text-xs uppercase tracking-[0.2em] hover:bg-midnight hover:text-ivory transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === 'loading' ? 'Joining...' : (
                    <>Subscribe <Send size={16} /></>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-midnight p-12 rounded-sm inline-flex flex-col items-center gap-6"
              >
                <CheckCircle2 className="text-gold" size={64} />
                <div className="space-y-2">
                  <h3 className="font-space text-2xl font-black text-ivory uppercase tracking-tighter">Welcome to the future!</h3>
                  <p className="text-muted font-inter text-sm">Please check your inbox to confirm your subscription.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-midnight/50 text-[10px] font-space font-bold uppercase tracking-widest">
            No spam. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
