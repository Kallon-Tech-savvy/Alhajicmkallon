'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, Code, Send, Users, CheckCircle2, ArrowRight, Book, Video } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { buildContactMailto } from '@/lib/contact-form.mjs';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'fallback'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Pre-configured intents reduce typing overhead and guide the user
  const intentOptions = [
    "Clarify an idea",
    "Design and build a product",
    "Improve a product",
    "Something else"
  ];

  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMessage('');

    if (!formspreeId) {
      const mailtoLink = buildContactMailto({
        ...formData,
        intent: selectedIntent,
      });

      if (typeof window !== 'undefined') {
        window.location.href = mailtoLink;
      }

      setStatus('fallback');
      setStatusMessage('Your email app should open with a draft. This does not confirm delivery, so please send the draft or email hello@alhajikallon.dev directly. Your message remains in this form until you confirm it has been sent.');
      return;
    }

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, subject: `Inquiry: ${selectedIntent || 'General'}` })
      });

      if (response.ok) {
        setStatus('success');
        setStatusMessage('Thanks — your message has been sent. I’ll review it and reply with a useful next step.');
        setFormData({ name: '', email: '', message: '' });
        setSelectedIntent('');
      } else {
        setStatus('error');
        setStatusMessage('The message was not accepted. You can try again or open an email draft with your message preserved.');
      }
    } catch {
      setStatus('error');
      setStatusMessage('The message could not be sent. Check your connection, try again, or open an email draft with your message preserved.');
    }
  };

  return (
    <main className="min-h-screen bg-midnight text-ivory">
      <Navbar />

      <section className="pt-36 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[40%] h-[55%] rounded-full blur-3xl bg-pride-blue/10" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal variant="up" className="max-w-3xl">
            <p className="font-space text-xs uppercase tracking-[0.35em] text-pride-blue mb-5">
              Start with the problem
            </p>
            <h1 className="font-space text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] mb-4 leading-[0.95]">
              Let’s make the <span className="text-ivory/80">next step clear.</span>
            </h1>
            <p className="text-base md:text-lg text-muted max-w-2xl leading-relaxed">
              Have an early idea, a business problem, or an existing product that needs work? Tell me what you want to achieve and what you know so far. You do not need a finished brief—we can clarify the problem together.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Grid */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Social Channels & Credentials */}
          <Reveal variant="up" delay={60} className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="font-space text-gold text-xs font-black uppercase tracking-[0.3em] mb-6">Email me directly</h2>
              <div className="p-6 glass-frost-light rounded-sm flex items-center gap-4 group hover-lift">
                <div className="p-3 bg-gold/10 text-gold rounded-sm group-hover:bg-gold group-hover:text-midnight transition-colors duration-300">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-[9px] font-space font-bold uppercase tracking-widest text-muted mb-1">Email</div>
                  <a href="mailto:hello@alhajikallon.dev" className="text-lg font-space font-bold hover:text-gold transition-colors duration-300 underline-grow">
                    hello@alhajikallon.dev
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: 'LinkedIn', icon: <Users size={18} />, href: 'https://linkedin.com/in/alhaji-c-m-k-8b79a225b', desc: 'Professional background and updates' },
                  { name: 'GitHub', icon: <Code size={18} />, href: 'https://github.com/Kallon-Tech-savvy', desc: 'Code, experiments, and project work' },
                  { name: 'Substack', icon: <Book size={18} />, href: 'https://substack.com/@alhajicmkallon', desc: 'Writing on technology and society' },
                  { name: 'TikTok', icon: <Video size={18} />, href: 'https://tiktok.com/Zs9jMKdFNCeJ7-ypwTZ', desc: 'Short videos and updates' },
                  { name: 'Facebook', icon: <Users size={18} />, href: 'https://www.facebook.com/profile.php?id=100072626448471', desc: 'Community updates' }
                ].map((social, i) => (
                  <Reveal key={social.name} variant="up" delay={i * 50}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 glass-frost-light hover:border-gold/20 hover-lift transition-colors duration-300 rounded-sm group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-muted group-hover:text-gold transition-colors duration-300">{social.icon}</div>
                        <div>
                          <div className="font-space font-bold text-sm text-ivory group-hover:text-gold transition-colors duration-300">{social.name}</div>
                          <div className="text-[10px] text-muted tracking-wide mt-0.5">{social.desc}</div>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-muted/50 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Optimized Interactive Form Container — frosted panel */}
          <Reveal variant="up" delay={120} className="lg:col-span-7">
            <div className="glass-frost p-8 md:p-12 rounded-sm shadow-2xl">
              {status !== 'success' ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Step 1: Cognitive Ease Intent Selection */}
                  <div className="space-y-4">
                    <label className="font-space text-[10px] font-black uppercase tracking-[0.3em] text-pride-blue block">
                      What would you like to work on?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {intentOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSelectedIntent(option)}
                          aria-pressed={selectedIntent === option}
                          className={`rounded-full px-4 py-2 text-xs font-space font-semibold tracking-[0.2em] uppercase transition-all duration-200 border tap-scale ${
                            selectedIntent === option
                              ? 'bg-pride-blue text-white border-pride-blue'
                              : 'bg-transparent text-muted border-white/10 hover:border-pride-blue/30 hover:text-ivory'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Fields Stack */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label htmlFor="contact-name" className="font-space text-[10px] font-bold uppercase tracking-widest text-muted">Your name</label>
                      <input
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        type="text"
                        maxLength={120}
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-inter text-sm text-ivory outline-none transition-colors duration-300 focus:border-pride-blue/40"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="contact-email" className="font-space text-[10px] font-bold uppercase tracking-widest text-muted">Your email</label>
                      <input
                        id="contact-email"
                        name="email"
                        autoComplete="email"
                        type="email"
                        maxLength={254}
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-inter text-sm text-ivory outline-none transition-colors duration-300 focus:border-pride-blue/40"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="contact-message" className="font-space text-[10px] font-bold uppercase tracking-widest text-muted">What would you like to change or achieve?</label>
                    <textarea
                      required
                      id="contact-message"
                      name="message"
                      rows={5}
                      maxLength={5000}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-inter text-sm text-ivory outline-none transition-colors duration-300 resize-none focus:border-pride-blue/40"
                      placeholder="What is happening now, who does it affect, and what would a better outcome look like? Share whatever you know; it is fine if the idea is still taking shape."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full rounded-xl py-4 bg-pride-blue text-white font-space font-semibold text-xs uppercase tracking-[0.25em] transition-all duration-300 flex items-center justify-center gap-3 hover:bg-pride-blue/90 disabled:opacity-50 tap-scale"
                  >
                    {status === 'loading' ? 'Sending message…' : (
                      <>Send message <Send size={14} /></>
                    )}
                  </button>

                  {(status === 'error' || status === 'fallback') && (
                    <div role="status" aria-live="polite" className="space-y-3 text-center">
                      <p className={`font-inter text-sm leading-relaxed ${status === 'error' ? 'text-red-300' : 'text-amber-200'}`}>
                        {statusMessage || 'The message could not be sent. Please try again or use the email draft fallback.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = buildContactMailto({
                            ...formData,
                            intent: selectedIntent,
                          });
                          setStatus('fallback');
                          setStatusMessage('Your email app should open with a draft. This does not confirm delivery; send the draft to complete the message.');
                        }}
                        className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-ivory transition-colors hover:border-pride-blue hover:text-pride-blue"
                      >
                        Open email draft instead
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                <Reveal variant="scale" as="div" className="py-16 flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-pride-blue/15 text-pride-blue rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="font-space text-2xl font-bold text-ivory uppercase tracking-tight">Message received</h3>
                    <p className="text-muted font-inter text-sm mt-2 max-w-xs leading-relaxed">
                      {statusMessage || 'Your note has been received. I’ll follow up within a day or two with a thoughtful response.'}
                    </p>
                  </div>
                  <button
                    onClick={() => { setStatus('idle'); setStatusMessage(''); }}
                    className="rounded-full px-6 py-3 border border-white/10 text-muted font-space font-bold text-[10px] uppercase tracking-[0.25em] hover:border-pride-blue hover:text-pride-blue transition-colors duration-300 tap-scale"
                  >
                    Send Additional Message
                  </button>
                </Reveal>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}