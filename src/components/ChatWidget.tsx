'use client';

import Link from 'next/link';
import { Arrow } from './SwissMarks';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { MessageCircle, X, Send, Loader2, RotateCcw, Square } from 'lucide-react';
import { CHAT_STARTER_QUESTIONS, MAX_MESSAGE_LENGTH } from '@/packages/chat/shared';
import { useChatConversation } from '@/packages/chat/client';

function MessageContent({ content }: { content: string }) {
  return content.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
interface ChatWidgetProps {
  initialOpen?: boolean;
  showLauncher?: boolean;
  onClose?: () => void;
}

export function ChatWidget({ initialOpen = false, showLauncher = true, onClose }: ChatWidgetProps) {
  const [localOpen, setLocalOpen] = useState(initialOpen);
  const open = showLauncher ? localOpen : initialOpen;
  const conversation = useChatConversation();
  const { messages, input, setInput, loading, error, retry } = conversation;
  const [honeypot, setHoneypot] = useState('');
  const sendMessage = (value = input) => conversation.sendMessage(value, honeypot);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => {
    if (showLauncher) setLocalOpen(false);
    else onClose?.();
    document.querySelector<HTMLButtonElement>('[data-chat-launcher]')?.focus();
  }, [showLauncher, onClose]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    if (open)
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
  }, [messages, loading, open]);
  useEffect(() => {
    if (!open) return;
    const key = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    const outside = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!panelRef.current?.contains(target) && !target.closest('[data-chat-launcher]')) close();
    };
    document.addEventListener('keydown', key);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', key);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open, close]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage();
  }
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void sendMessage();
    }
  }
  return (
    <>
      {showLauncher && (
        <button
          type="button"
          data-chat-launcher
          onClick={() => setLocalOpen(!open)}
          aria-expanded={open}
          aria-controls="chat-panel"
          aria-label={open ? 'Close chat' : 'Ask about my work'}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-pride-blue text-[var(--ui-on-action)] shadow-xl"
        >
          {open ? <X size={22} /> : <MessageCircle size={22} />}
        </button>
      )}
      {open && (
        <div
          id="chat-panel"
          ref={panelRef}
          role="dialog"
          aria-labelledby="chat-title"
          aria-describedby="chat-description"
          className="ui-chat-panel fixed bottom-24 right-4 z-[70] flex h-[min(38rem,calc(100dvh-8rem))] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden text-ivory sm:right-6"
        >
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-4">
            <div>
              <h2 id="chat-title" className="font-semibold">
                Ask about Alhaji
              </h2>
              <p id="chat-description" className="mt-1 text-xs leading-relaxed text-muted">
                AI site assistant · Work, approach and enquiries.
                <br />
                Answers can be incomplete. Check the published pages.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close assistant"
              className="ui-icon-button shrink-0"
            >
              <X size={18} />
            </button>
          </header>
          <div className="ui-chat-toolbar shrink-0">
            <Link href="/work" className="underline underline-offset-4">
              Case studies
            </Link>
            <Link href="/contact" className="underline underline-offset-4">
              Contact Alhaji
            </Link>
            <button
              type="button"
              disabled={loading || !messages.length}
              onClick={() => {
                conversation.clearConversation();
                inputRef.current?.focus();
              }}
              className="ui-ghost ml-auto min-h-12 px-0 text-xs"
            >
              <RotateCcw size={12} /> Clear chat
            </button>
          </div>
          <div
            ref={scrollRef}
            role="log"
            aria-label="Conversation"
            aria-live="polite"
            aria-relevant="additions"
            aria-busy={loading}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4"
          >
            {!messages.length && (
              <div>
                <p className="text-lg font-semibold">What would you like to know?</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Hi, I’m here to answer questions about Alhaji’s work and how he can help. What are
                  you working on? For a personal response, use the contact form.
                </p>
                <div className="mt-5 grid gap-2">
                  {CHAT_STARTER_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      disabled={loading}
                      onClick={() => void sendMessage(question)}
                      className="ui-choice ui-chat-suggestion"
                    >
                      {question} <Arrow />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message, i) => (
              <div
                key={i}
                className={message.role === 'user' ? 'ui-chat-user' : 'ui-chat-assistant'}
              >
                <p className="mb-1 text-xs font-semibold">
                  {message.role === 'user' ? 'You' : 'Site assistant'}
                </p>
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  <MessageContent content={message.content} />
                </p>
              </div>
            ))}
            {loading && (
              <p role="status" className="flex items-center gap-2 text-sm text-muted">
                <Loader2 size={14} className="animate-spin" /> Finding an answer…
              </p>
            )}
          </div>
          {error && (
            <div role="alert" className="ui-notice ui-notice-error mx-4 mb-3 shrink-0">
              <p className="text-danger">{error}</p>
              {retry && (
                <button
                  type="button"
                  onClick={() => void sendMessage(retry)}
                  className="mt-2 min-h-9 font-semibold text-accent underline underline-offset-4"
                >
                  Retry question
                </button>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} className="shrink-0 border-t border-border p-3">
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-px w-px opacity-0"
            />
            <label htmlFor="chat-message" className="sr-only">
              Your message
            </label>
            <div className="flex items-end gap-2">
              <textarea
                id="chat-message"
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                maxLength={MAX_MESSAGE_LENGTH}
                disabled={loading}
                rows={2}
                placeholder="Ask about the work…"
                className="ui-field min-w-0 flex-1 resize-none"
              />
              {loading ? (
                <button
                  type="button"
                  onClick={(event) => {
                    // Aborting can replace this button with Submit before the
                    // browser runs its default action. Prevent a second send.
                    event.preventDefault();
                    conversation.stop();
                  }}
                  aria-label="Stop reply"
                  className="ui-primary min-w-12 shrink-0"
                >
                  <Square size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="ui-primary min-w-12 shrink-0"
                >
                  <Send size={16} />
                </button>
              )}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Avoid private information. Messages may be processed by OpenAI.{' '}
              <Link href="/privacy" className="underline">
                Privacy
              </Link>
            </p>
          </form>
        </div>
      )}
    </>
  );
}
