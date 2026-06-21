'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, Code, Send, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const socialLinks = [
    { name: 'Send', icon: <Send size={20} />, href: 'https://x.com/alhajikallon', desc: 'Real-time updates & thoughts' },
    { name: 'LinkedIn', icon: <Users size={20} />, href: 'https://linkedin.com/in/alhajikallon', desc: 'Professional network & articles' },
    { name: 'GitHub', icon: <Code size={20} />, href: 'https://github.com/alhajikallon', desc: 'Open source & technical work' }
  ];

  return (
    <main className="min-h-screen bg-midnight">
      <Navbar />

      {/* Header */}
      <section className="pt-48 pb-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-space text-gold text-xs font-bold tracking-[0.4em] uppercase mb-8 block">
              Let&apos;s Build the Future
            </span>
            <h1 className="font-space text-6xl md:text-9xl font-black tracking-tighter mb-16 leading-[0.85]">
              GET IN <br /><span className="text-gradient">TOUCH.</span>
            </h1>
          </motion.div>
        </div>

        <div className="absolute top-1/2 right-0 text-white/[0.02] font-space text-[30vw] font-black leading-none pointer-events-none select-none">
          HELLO
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24">

          {/* Info Side */}
          <div className="lg:col-span-5 space-y-24">
            <div>
              <h2 className="font-space text- gold text-xs font-black uppercase tracking-[0.3em] mb-12">Contact Information</h2>
              <div className="space-y-12">
                <div className="group flex items-start gap-6">
                  <div className="p-4 bg-gold/10 rounded-xl text-gold group-hover:bg-gold group-hover:text-midnight transition-all duration-500">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-space font-black uppercase tracking-widest text-muted mb-2">Email Me</div>
                    <a href="mailto:hello@alhajikallon.dev" className="text-2xl font-space font-bold text-ivory hover:text-gold transition-colors">
                      hello@alhajikallon.dev
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-space text-gold text-xs font-black uppercase tracking-[0.3em] mb-12">Social Channels</h2>
              <div className="space-y-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 glass border border-white/5 hover:border-gold/30 rounded-sm group transition-all duration-500"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-muted group-hover:text-gold transition-colors">{social.icon}</div>
                      <div>
                        <div className="font-space font-bold text-ivory group-hover:text-gold transition-colors">{social.name}</div>
                        <div className="text-[10px] text-muted uppercase tracking-widest mt-1">{social.desc}</div>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-muted group-hover:text-gold group-hover:translate-x-2 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="glass p-12 md:p-16 rounded-sm border border-white/10 relative">
              <AnimatePresence mode="wait">
                {status !== 'success' ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleSubmit}
                    className="space-y-12"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-2">
                        <label className="font-space text-[10px] font-black uppercase tracking-widest text-gold">Your Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-transparent border-b border-white/20 py-4 font-inter text-ivory outline-none focus:border-gold transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-space text-[10px] font-black uppercase tracking-widest text-gold">Your Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-transparent border-b border-white/20 py-4 font-inter text-ivory outline-none focus:border-gold transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-space text-[10px] font-black uppercase tracking-widest text-gold">Subject</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-transparent border-b border-white/20 py-4 font-inter text-ivory outline-none focus:border-gold transition-colors"
                        placeholder="Project Inquiry, Speaking Engagement, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-space text-[10px] font-black uppercase tracking-widest text-gold">Message</label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-transparent border-b border-white/20 py-4 font-inter text-ivory outline-none focus:border-gold transition-colors resize-none"
                        placeholder="Tell me about your project or idea..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-6 bg-gold text-midnight font-space font-black text-sm uppercase tracking-widest hover:bg-ivory transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                      {status === 'loading' ? 'Sending Message...' : (
                        <>Send Message <Send size={18} /></>
                      )}
                    </button>

                    {status === 'error' && (
                      <p className="text-red-400 font-space text-xs font-bold uppercase tracking-widest text-center">
                        Something went wrong. Please try again.
                      </p>
                    )}
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-32 flex flex-col items-center text-center space-y-8"
                  >
                    <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center text-midnight shadow-[0_0_50px_rgba(212,175,55,0.3)]">
                      <CheckCircle2 size={48} />
                    </div>
                    <div>
                      <h3 className="font-space text-3xl font-bold text-ivory uppercase tracking-tighter">Message Received!</h3>
                      <p className="text-muted font-inter mt-4 max-w-sm">
                        Thank you for reaching out. I&apos;ll get back to you within 24-48 hours.
                      </p>
                    </div>
                    <button
                      onClick={() => setStatus('idle')}
                      className="px-8 py-4 border border-gold text-gold font-space font-black text-[10px] uppercase tracking-widest hover:bg-gold hover:text-midnight transition-all"
                    >
                      Send Another
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-space text-gold text-[10px] font-black uppercase tracking-widest mb-6">Response Time</h3>
            <p className="text-muted font-inter text-sm leading-relaxed">
              I typically respond within 24-48 hours on business days. If your matter is urgent, please indicate so in your subject line.
            </p>
          </div>
          <div>
            <h3 className="font-space text-gold text-[10px] font-black uppercase tracking-widest mb-6">Based In</h3>
            <p className="text-muted font-inter text-sm leading-relaxed">
              Freetown, Sierra Leone (GMT). Working with partners and clients across Africa and internationally.
            </p>
          </div>
          <div>
            <h3 className="font-space text-gold text-[10px] font-black uppercase tracking-widest mb-6">Media Kit</h3>
            <p className="text-muted font-inter text-sm leading-relaxed mb-6">
              Need my headshot or bio for an event? Download the official media kit below.
            </p>
            <button className="flex items-center gap-2 text-ivory hover:text-gold font-space font-bold text-[10px] uppercase tracking-widest transition-colors">
              Download Media Kit <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
