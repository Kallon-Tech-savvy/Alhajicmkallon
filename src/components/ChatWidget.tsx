'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { MessageCircle, X, Send, Loader2, RotateCcw, Square } from 'lucide-react';
import { MAX_MESSAGE_LENGTH, CLIENT_HISTORY_LIMIT } from '@/lib/Chatconstant';

interface ChatMessage { role: 'user' | 'assistant'; content: string }
const SUGGESTIONS = ['Show me his case studies', 'What is his approach?', 'How can I get in touch?'];
function MessageContent({ content }: { content: string }) {
  return content.split(/(\*\*[^*]+\*\*)/g).map((part, i) => part.startsWith('**') && part.endsWith('**')
    ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>);
}
interface ChatWidgetProps { initialOpen?: boolean; showLauncher?: boolean; onClose?: () => void }

export function ChatWidget({ initialOpen = false, showLauncher = true, onClose }: ChatWidgetProps) {
  const [localOpen, setLocalOpen] = useState(initialOpen);
  const open = showLauncher ? localOpen : initialOpen;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [retry, setRetry] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => {
    if (showLauncher) setLocalOpen(false); else onClose?.();
    document.querySelector<HTMLButtonElement>('[data-chat-launcher]')?.focus();
  }, [showLauncher, onClose]);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => () => requestRef.current?.abort(), []);
  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [messages, loading, open]);
  useEffect(() => {
    if (!open) return;
    const key = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); close(); } };
    const outside = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!panelRef.current?.contains(target) && !target.closest('[data-chat-launcher]')) close();
    };
    document.addEventListener('keydown', key);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', outside); };
  }, [open, close]);

  async function sendMessage(value = input) {
    const trimmed = value.trim();
    if (!trimmed || requestRef.current) return;
    if (trimmed.length > MAX_MESSAGE_LENGTH) { setError(`Keep your question under ${MAX_MESSAGE_LENGTH} characters.`); return; }
    const prior = messages;
    const next: ChatMessage[] = [...prior, { role: 'user', content: trimmed }];
    const controller = new AbortController();
    requestRef.current = controller;
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 25000);
    setMessages(next); setInput(''); setError(null); setRetry(null); setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history: prior.slice(-CLIENT_HISTORY_LIMIT), company: honeypot }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || typeof data?.reply !== 'string' || !data.reply.trim()) {
        throw new Error(response.status === 429 ? 'Too many questions right now. Please wait before retrying, or contact Alhaji directly.' : 'The assistant is unavailable. Your question is saved below; retry or use the contact page.');
      }
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (failure) {
      setMessages(prior); setInput(trimmed); setRetry(trimmed);
      setError(controller.signal.aborted ? timedOut ? 'The reply took too long. You can retry your question.' : 'Reply stopped. Your question is ready to edit or retry.' : failure instanceof Error ? failure.message : 'Connection interrupted. Please retry.');
    } finally { clearTimeout(timeout); requestRef.current = null; setLoading(false); }
  }
  function handleSubmit(event: FormEvent) { event.preventDefault(); void sendMessage(); }
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void sendMessage(); }
  }
  return <>
    {showLauncher && <button type="button" data-chat-launcher onClick={() => setLocalOpen(!open)} aria-expanded={open} aria-controls="chat-panel" aria-label={open ? 'Close chat' : 'Ask a question about Alhaji'} className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-pride-blue text-[var(--ui-on-action)] shadow-xl">{open ? <X size={22}/> : <MessageCircle size={22}/>}</button>}
    {open && <div id="chat-panel" ref={panelRef} role="dialog" aria-labelledby="chat-title" aria-describedby="chat-description" className="fixed bottom-24 right-4 z-[70] flex h-[min(38rem,calc(100dvh-8rem))] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-xl border border-border bg-midnight text-ivory shadow-2xl sm:right-6">
      <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-4"><div><h2 id="chat-title" className="font-semibold">Ask about Alhaji</h2><p id="chat-description" className="mt-1 text-xs leading-relaxed text-muted">AI site assistant · Work, approach and enquiries.<br/>Answers can be incomplete. Check the published pages.</p></div><button type="button" onClick={close} aria-label="Close assistant" className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-border hover:bg-surface"><X size={18}/></button></header>
      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-4 py-3 text-xs"><Link href="/work" className="underline underline-offset-4">Case studies</Link><Link href="/contact" className="underline underline-offset-4">Contact Alhaji</Link><button type="button" disabled={loading || !messages.length} onClick={() => { setMessages([]); setInput(''); setError(null); setRetry(null); inputRef.current?.focus(); }} className="ml-auto inline-flex min-h-8 items-center gap-1 text-muted disabled:opacity-50"><RotateCcw size={12}/> Clear chat</button></div>
      <div ref={scrollRef} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" aria-busy={loading} className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4">
        {!messages.length && <div><p className="text-lg font-semibold">What would you like to know?</p><p className="mt-2 text-sm leading-relaxed text-muted">Explore the work or find the right next step. For a personal response, use the contact form.</p><div className="mt-5 grid gap-2">{SUGGESTIONS.map(question => <button key={question} type="button" disabled={loading} onClick={() => void sendMessage(question)} className="min-h-11 rounded-lg border border-border bg-surface p-3 text-left text-sm hover:bg-navy">{question} <span aria-hidden="true">↗</span></button>)}</div></div>}
        {messages.map((message, i) => <div key={i} className={message.role === 'user' ? 'ml-6 rounded-lg bg-pride-blue p-3 text-[var(--ui-on-action)]' : 'mr-3 rounded-lg border border-border bg-surface p-3'}><p className="mb-1 text-xs font-semibold">{message.role === 'user' ? 'You' : 'Site assistant'}</p><p className="whitespace-pre-wrap break-words text-sm leading-relaxed"><MessageContent content={message.content}/></p></div>)}
        {loading && <p role="status" className="flex items-center gap-2 text-sm text-muted"><Loader2 size={14} className="animate-spin"/> Finding an answer…</p>}
      </div>
      {error && <div role="alert" className="shrink-0 border-t border-border px-4 py-3 text-sm"><p className="text-danger">{error}</p>{retry && <button type="button" onClick={() => void sendMessage(retry)} className="mt-2 min-h-9 font-semibold text-accent underline underline-offset-4">Retry question</button>}</div>}
      <form onSubmit={handleSubmit} className="shrink-0 border-t border-border p-3"><input type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0"/><label htmlFor="chat-message" className="sr-only">Your message</label><div className="flex items-end gap-2"><textarea id="chat-message" ref={inputRef} value={input} onChange={e => { setInput(e.target.value); setRetry(null); }} onKeyDown={handleKeyDown} maxLength={MAX_MESSAGE_LENGTH} disabled={loading} rows={2} placeholder="Ask about the work…" className="ui-field min-w-0 flex-1 resize-none"/>{loading ? <button type="button" onClick={() => requestRef.current?.abort()} aria-label="Stop reply" className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-pride-blue text-[var(--ui-on-action)]"><Square size={16}/></button> : <button type="submit" disabled={!input.trim()} aria-label="Send message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-pride-blue text-[var(--ui-on-action)] disabled:opacity-40"><Send size={16}/></button>}</div><p className="mt-2 text-xs leading-relaxed text-muted">Avoid private information. Messages may be processed by OpenAI. <Link href="/privacy" className="underline">Privacy</Link></p></form>
    </div>}
  </>;
}
