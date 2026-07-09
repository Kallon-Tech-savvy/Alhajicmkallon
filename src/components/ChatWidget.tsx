'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_MESSAGE_LENGTH = 800;

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
      setError(`Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`);
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
          history: priorMessages, // server appends the new message itself
          company: honeypot, // should always be empty for real users
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.reply) {
        setError(data?.error ?? 'Something went wrong. Please try again.');
        setMessages(priorMessages); // roll back the optimistic add on failure
        return;
      }

      setMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setMessages(priorMessages);
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

          {/* Messages — plain text only; React escapes this automatically,
              so nothing the model or a visitor sends can inject markup. */}
          <div ref={scrollRef} role="log" aria-live="polite" className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-muted text-sm font-inter leading-relaxed">
                Ask me about Alhaji&apos;s work, skills, or how to get in touch.
              </p>
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