'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Reveal } from './Reveal';
import { buildContactMailto } from '@/lib/contact-form.mjs';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'fallback'>(
    'idle',
  );
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const intentOptions = [
    'Clarify an idea',
    'Design and build a product',
    'Improve a product',
    'Something else',
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
      setStatusMessage(
        'Your email app should open with a draft. This does not confirm delivery, so please send the draft or email info@alhajikallon.com for general enquiries or dev@alhajikallon.com for development. Your message remains in this form until you confirm it has been sent.',
      );
      return;
    }

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, subject: `Inquiry: ${selectedIntent || 'General'}` }),
      });

      if (response.ok) {
        setStatus('success');
        setStatusMessage(
          'Thanks — your message has been sent. I’ll review it and reply with a useful next step.',
        );
        setFormData({ name: '', email: '', message: '' });
        setSelectedIntent('');
      } else {
        setStatus('error');
        setStatusMessage(
          'The message was not accepted. You can try again or open an email draft with your message preserved.',
        );
      }
    } catch {
      setStatus('error');
      setStatusMessage(
        'The message could not be sent. Check your connection, try again, or open an email draft with your message preserved.',
      );
    }
  };

  return (
    <Reveal variant="up" delay={120} className="lg:col-span-7">
      <div className="glass-frost p-8 md:p-12 rounded-xl shadow-none">
        {status !== 'success' ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Cognitive Ease Intent Selection */}
            <div className="space-y-4">
              <label className="font-display text-xs font-semibold tracking-normal text-accent block">
                What would you like to work on?
              </label>
              <div className="flex flex-wrap gap-2">
                {intentOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedIntent(option)}
                    aria-pressed={selectedIntent === option}
                    className={`rounded-md px-4 py-2 text-xs font-display font-semibold tracking-normal transition-all duration-200 border ${
                      selectedIntent === option
                        ? 'bg-pride-blue text-[var(--ui-on-action)] border-pride-blue'
                        : 'bg-transparent text-muted border-border hover:border-pride-blue/30 hover:text-ivory'
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
                <label
                  htmlFor="contact-name"
                  className="font-display text-xs font-medium text-muted"
                >
                  Your name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  type="text"
                  maxLength={120}
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="ui-field"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="contact-email"
                  className="font-display text-xs font-medium text-muted"
                >
                  Your email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  maxLength={254}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="ui-field"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="contact-message"
                className="font-display text-xs font-medium text-muted"
              >
                What would you like to change or achieve?
              </label>
              <textarea
                required
                id="contact-message"
                name="message"
                rows={5}
                maxLength={5000}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="ui-field"
                placeholder="What is happening now, who does it affect, and what would a better outcome look like? Share whatever you know; it is fine if the idea is still taking shape."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="ui-primary w-full transition-colors"
            >
              {status === 'loading' ? (
                'Sending message…'
              ) : (
                <>
                  Send message <Send size={14} />
                </>
              )}
            </button>

            {(status === 'error' || status === 'fallback') && (
              <div role="status" aria-live="polite" className="space-y-3 text-center">
                <p
                  className={`font-body text-sm leading-relaxed ${status === 'error' ? 'text-danger' : 'text-warning'}`}
                >
                  {statusMessage ||
                    'The message could not be sent. Please try again or use the email draft fallback.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = buildContactMailto({
                      ...formData,
                      intent: selectedIntent,
                    });
                    setStatus('fallback');
                    setStatusMessage(
                      'Your email app should open with a draft. This does not confirm delivery; send the draft to complete the message.',
                    );
                  }}
                  className="rounded-md border border-border px-4 py-2 text-xs font-semibold text-ivory transition-colors hover:border-pride-blue hover:text-accent"
                >
                  Open email draft instead
                </button>
              </div>
            )}
          </form>
        ) : (
          <Reveal
            variant="scale"
            as="div"
            className="py-16 flex flex-col items-center text-center space-y-6"
          >
            <div className="w-16 h-16 bg-pride-blue/15 text-accent rounded-md flex items-center justify-center shadow-lg">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-ivory uppercase tracking-tight">
                Message received
              </h3>
              <p className="text-muted font-body text-sm mt-2 max-w-xs leading-relaxed">
                {statusMessage ||
                  'Your note has been received. I’ll follow up within a day or two with a thoughtful response.'}
              </p>
            </div>
            <button
              onClick={() => {
                setStatus('idle');
                setStatusMessage('');
              }}
              className="rounded-md px-6 py-3 border border-border text-muted font-display font-bold text-xs tracking-normal hover:border-pride-blue hover:text-accent transition-colors duration-300"
            >
              Send Additional Message
            </button>
          </Reveal>
        )}
      </div>
    </Reveal>
  );
}
