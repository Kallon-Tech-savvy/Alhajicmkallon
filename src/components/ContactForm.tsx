'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Send, CheckCircle2 } from 'lucide-react';
import { Reveal } from './Reveal';
import { buildContactMailto } from '@/lib/contact-form.mjs';

type TurnstileApi = {
  render: (element: HTMLElement, options: {
    sitekey: string;
    action: 'contact';
    size: 'compact' | 'flexible';
    theme: 'auto';
    callback: (token: string) => void;
    'expired-callback': () => void;
    'error-callback': () => void;
  }) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
declare global { interface Window { turnstile?: TurnstileApi } }

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

  // The site key is public. A build-time override is optional for staging.
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAGF6eqlDlOmcJvuf';
  const [captchaToken, setCaptchaToken] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [scriptReady, setScriptReady] = useState(false);
  const [widgetSize, setWidgetSize] = useState<'compact' | 'flexible'>('flexible');
  const captchaElement = useRef<HTMLDivElement>(null);
  const captchaWidgetId = useRef<string | undefined>(undefined);
  const showForm = status !== 'success';

  // Cloudflare's flexible widget has a 300px minimum width. Narrow mobile
  // containers need the 150px compact widget instead of horizontal overflow.
  useEffect(() => {
    const element = captchaElement.current;
    if (!showForm || !element) return;
    const syncSize = () => {
      setWidgetSize(element.getBoundingClientRect().width < 300 ? 'compact' : 'flexible');
    };
    syncSize();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(syncSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [showForm]);

  useEffect(() => {
    if (!turnstileSiteKey || !scriptReady || !showForm || !captchaElement.current || !window.turnstile) return;
    const id = window.turnstile.render(captchaElement.current, {
      sitekey: turnstileSiteKey,
      action: 'contact',
      size: widgetSize,
      theme: 'auto', 
      callback: setCaptchaToken,
      'expired-callback': () => setCaptchaToken(''),
      'error-callback': () => setCaptchaToken(''),
    });
    captchaWidgetId.current = id;
    return () => {
      window.turnstile?.remove(id);
      captchaWidgetId.current = undefined;
    };
  }, [turnstileSiteKey, scriptReady, showForm, widgetSize]);

  const resetVerification = () => {
    setCaptchaToken('');
    window.turnstile?.reset(captchaWidgetId.current);
  };

  const openDraft = () => {
    window.location.href = buildContactMailto({ ...formData, intent: selectedIntent });
    setStatus('fallback');
    setStatusMessage('Your email app should open with a draft. Delivery is not confirmed until you send it.');
  };

  const intentOptions = [
    'Clarify an idea',
    'Design and build a product',
    'Improve a product',
    'Suggest a guide or correction',
    'Something else',
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage('');

    if (!turnstileSiteKey) {
      openDraft();
      return;
    }
    if (!captchaToken) {
      setStatus('error');
      setStatusMessage('Please complete the verification before sending your message.');
      return;
    }
    setStatus('loading');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          ...formData,
          intent: selectedIntent,
          website: honeypot,
          turnstileToken: captchaToken,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const result =
        payload !== null && typeof payload === 'object' && !Array.isArray(payload)
          ? (payload as { ok?: unknown; error?: unknown })
          : null;
      if (response.ok && result?.ok === true) {
        setStatus('success');
        setStatusMessage('Thank you. Your enquiry has been submitted for delivery. I’ll review it and respond when I can.');
        setFormData({ name: '', email: '', message: '' });
        setSelectedIntent('');
        setHoneypot('');
        setCaptchaToken('');
      } else {
        setStatus('error');
        setStatusMessage(
          typeof result?.error === 'string'
            ? result.error + ' Your message has been preserved; try again or open an email draft.'
            : 'The message could not be confirmed. Your message has been preserved; try again or open an email draft.',
        );
        resetVerification();
      }
    } catch {
      setStatus('error');
      setStatusMessage(
        'Something went wrong and delivery could not be confirmed. Your message is still here. Try again or email info@alhajikallon.com directly.',
      );
      resetVerification();
    }
  };

  return (
    <Reveal variant="up" delay={120} className="lg:col-span-7">
      <div className="ui-form-panel">
        {turnstileSiteKey && (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onReady={() => setScriptReady(true)}
          />
        )}
        {status !== 'success' ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="ui-form-heading">
              <span className="ui-label">Project enquiry or feedback</span>
              <h2>Tell me what you have in mind.</h2>
              <p>Name, email and message are required. Choosing a topic is optional.</p>
            </div>
            <fieldset>
              <legend className="ui-label">What would you like to work on? (optional)</legend>
              <div className="flex flex-wrap gap-2">
                {intentOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedIntent(option)}
                    aria-pressed={selectedIntent === option}
                    className="ui-choice"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="ui-label">
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
              <div className="space-y-2">
                <label htmlFor="contact-email" className="ui-label">
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
                  aria-describedby="contact-email-help"
                />
                <p id="contact-email-help" className="text-xs text-muted">
                  I’ll use this address to reply to you, and to acknowledge your enquiry if confirmations are enabled.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-message" className="ui-label">
                What are you trying to achieve?
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
                placeholder="What is happening now, who does it affect, and what would a better outcome look like?"
                aria-describedby="contact-message-help"
              />
              <p id="contact-message-help" className="text-xs text-muted">
                Tell me what you know so far and where you need help.
              </p>
            </div>

            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="contact-website">Leave this field empty</label>
              <input
                id="contact-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {turnstileSiteKey ? (
              <div>
                <div ref={captchaElement} aria-label="Spam protection verification" />
                <p className="mt-2 text-xs text-muted">Verification helps protect this form from spam.</p>
              </div>
            ) : (
              <p className="text-sm text-muted">
                Direct submission is not configured yet. You can still prepare an email draft below.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="ui-primary w-full transition-colors"
            >
              {status === 'loading' ? (
                'Sending…'
              ) : (
                <>
                  {turnstileSiteKey ? 'Send enquiry' : 'Open email draft'} <Send size={14} />
                </>
              )}
            </button>

            {(status === 'error' || status === 'fallback') && (
              <div
                role="status"
                aria-live="polite"
                className={`ui-notice ${status === 'error' ? 'ui-notice-error' : ''}`}
              >
                <p
                  className={`font-body text-sm leading-relaxed ${status === 'error' ? 'text-danger' : 'text-warning'}`}
                >
                  {statusMessage ||
                    'Your message has not been confirmed. Please retry or open an email draft.'}
                </p>
                <button
                  type="button"
                  onClick={openDraft}
                  className="ui-ghost mt-3"
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
              <h3 className="font-display text-2xl font-normal text-ivory">Enquiry submitted</h3>
              <p className="text-muted font-body text-sm mt-2 max-w-xs leading-relaxed">
                {statusMessage ||
                  'Your enquiry has been submitted for delivery. I’ll respond when I can.'}
              </p>
            </div>
            <button
              onClick={() => {
                setStatus('idle');
                setStatusMessage('');
              }}
              className="ui-secondary"
            >
              Send Additional Message
            </button>
          </Reveal>
        )}
      </div>
    </Reveal>
  );
}
