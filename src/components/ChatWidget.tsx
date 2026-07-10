'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_MESSAGE_LENGTH = 800;

function CairoIllustration() {
  return (
    <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
      <div className="absolute bottom-0 h-16 w-16 rounded-[40%_40%_45%_45%] bg-gradient-to-b from-[#8fd6ff] via-[#4f86ff] to-[#2149a8] shadow-[0_12px_30px_rgba(15,23,42,0.35)]" />
      <div className="absolute bottom-5 h-8 w-10 rounded-full border border-white/60 bg-[#fef7ed] shadow-inner" />
      <div className="absolute bottom-8 h-3 w-3 rounded-full bg-slate-900" />
      <div className="absolute bottom-8 left-[43px] h-3 w-3 rounded-full bg-slate-900" />
      <div className="absolute bottom-5 left-[18px] h-2.5 w-2.5 rounded-full bg-[#ffb9b9]" />
      <div className="absolute bottom-5 right-[18px] h-2.5 w-2.5 rounded-full bg-[#ffb9b9]" />
      <div className="absolute top-2 h-7 w-9 rounded-full bg-white/80" />
      <div className="absolute top-4 h-2.5 w-3 rounded-full bg-slate-900/80" />
      <div className="absolute right-4 top-3 h-8 w-8 rounded-full border border-white/50 bg-white/20 backdrop-blur-sm" />
      <div className="absolute -right-1 top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 rounded bg-[#ffd166]" />
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Escape closes the panel; click-outside closes it too.
  useEffect(() => {
    function handleKey(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function handleClickOutside(e: MouseEvent) {
      if (!open) return;
      const target = e.target as HTMLElement;
      if (panelRef.current?.contains(target)) return;
      if (target.closest('[data-chat-launcher]')) return;
      setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      setError(`Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    const priorMessages = messages;
    const nextMessages: ChatMessage[] = [...priorMessages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: priorMessages,
          company: honeypot,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const fallbackMessage = data?.reply ?? 'I am currently unavailable, but I can still help. Please try again in a moment or contact Alhaji directly.';
        setMessages([...nextMessages, { role: 'assistant', content: fallbackMessage }]);
        setError(data?.error ?? 'The chat service is currently unavailable. Please try again shortly.');
        return;
      }

      if (!data?.reply) {
        setError('The reply was empty. Please try again.');
        setMessages(priorMessages);
        return;
      }

      setMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...nextMessages, { role: 'assistant', content: 'I hit a connection issue. Please try again in a moment.' }]);
      setError('The chat was unable to reach the service. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        data-chat-launcher
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? 'Close chat' : 'Ask a question about Alhaji'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--color-pride-blue)] text-white flex items-center justify-center shadow-2xl tap-scale hover-lift transition-transform duration-300"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Panel */}
      {open && (
        <div
          id="chat-panel"
          ref={panelRef}
          role="dialog"
          aria-label="Chat with the site assistant"
          className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[560px] flex flex-col rounded-lg glass-frost shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 flex-shrink-0">
            <div className="font-space text-xs font-black uppercase tracking-widest text-ivory">
              Ask about Alhaji
            </div>
            <div className="text-[10px] text-muted mt-0.5">Usually answers instantly</div>
          </div>

          <div ref={scrollRef} role="log" aria-live="polite" className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center">
                <CairoIllustration />
                <h3 className="mt-3 text-sm font-semibold text-ivory">Hi, I&apos;m Cairo</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Ask me about Alhaji&apos;s work, skills, or how to get in touch.
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-2.5 rounded-lg text-sm font-inter leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === 'user'
                    ? 'ml-auto bg-[var(--color-pride-blue)] text-white'
                    : 'mr-auto bg-white/[0.04] text-ivory/90 border border-white/5'
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto flex items-center gap-2 text-muted text-xs px-4 py-2.5">
                <Loader2 size={14} className="animate-spin" /> Thinking…
              </div>
            )}
          </div>

          {error && (
            <p role="alert" className="px-4 py-2 text-[11px] text-red-400 font-inter border-t border-white/5 flex-shrink-0">
              {error}
            </p>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="relative p-3 border-t border-white/10 flex items-end gap-2 flex-shrink-0">
            {/* Honeypot — hidden from real users off-screen; bots that
                auto-fill every input tend to fill this one too. */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0"
            />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={1}
              placeholder="Type a question…"
              aria-label="Your message"
              className="flex-1 resize-none rounded-md bg-black/20 border border-white/10 px-3 py-2 text-sm text-ivory outline-none focus:border-[var(--color-pride-blue)]/40 transition-colors duration-300 max-h-24"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="w-10 h-10 flex-shrink-0 rounded-md bg-[var(--color-pride-blue)] text-white flex items-center justify-center disabled:opacity-40 tap-scale transition-opacity duration-300"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}