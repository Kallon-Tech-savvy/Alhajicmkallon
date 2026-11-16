'use client';

import { useEffect, useRef, useState } from 'react';
import { MAX_HISTORY_MESSAGES, MAX_MESSAGE_LENGTH } from '../shared';
import type { ChatMessage } from '../shared';

type RequestState =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'error'; message: string; retry: string | null };

function failureMessage(error: unknown, signal: AbortSignal, timedOut: boolean): string {
  if (signal.aborted) {
    return timedOut
      ? 'The reply took too long. You can retry your question.'
      : 'Reply stopped. Your question is ready to edit or retry.';
  }
  return error instanceof Error ? error.message : 'Connection interrupted. Please retry.';
}

/** Owns transport, cancellation and rollback; the widget owns presentation/focus. */
export function useChatConversation({
  fetcher = fetch,
  timeoutMs = 25_000,
}: {
  fetcher?: typeof fetch;
  timeoutMs?: number;
} = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [request, setRequest] = useState<RequestState>({ status: 'idle' });
  const activeRequest = useRef<AbortController | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      activeRequest.current?.abort();
    };
  }, []);

  async function sendMessage(value = input, company = '') {
    const message = value.trim();
    if (!message || activeRequest.current) return;
    if (message.length > MAX_MESSAGE_LENGTH) {
      setRequest({
        status: 'error',
        message: `Keep your question under ${MAX_MESSAGE_LENGTH} characters.`,
        retry: null,
      });
      return;
    }
    const previous = messages;
    const next: ChatMessage[] = [...previous, { role: 'user', content: message }];
    const controller = new AbortController();
    activeRequest.current = controller;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    setMessages(next);
    setInput('');
    setRequest({ status: 'sending' });

    try {
      const response = await fetcher('/api/chat', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: previous.slice(-MAX_HISTORY_MESSAGES), company }),
      });
      const payload: unknown = await response.json().catch(() => null);
      controller.signal.throwIfAborted();
      const reply =
        typeof payload === 'object' && payload !== null && 'reply' in payload
          ? payload.reply
          : null;
      if (!response.ok || typeof reply !== 'string' || !reply.trim()) {
        if (response.status === 429)
          throw new Error(
            'Too many questions right now. Please wait before retrying, or contact Alhaji directly.',
          );
        throw new Error(
          'The assistant is unavailable. Your question is saved below; retry or use the contact page.',
        );
      }
      if (mounted.current) {
        setMessages([...next, { role: 'assistant', content: reply.trim() }]);
        setRequest({ status: 'idle' });
      }
    } catch (error) {
      if (mounted.current) {
        setMessages(previous);
        setInput(message);
        setRequest({
          status: 'error',
          message: failureMessage(error, controller.signal, timedOut),
          retry: message,
        });
      }
    } finally {
      clearTimeout(timer);
      activeRequest.current = null;
    }
  }

  function editInput(value: string) {
    setInput(value);
    if (request.status === 'error') setRequest({ status: 'idle' });
  }

  function clearConversation() {
    if (activeRequest.current) return;
    setMessages([]);
    setInput('');
    setRequest({ status: 'idle' });
  }

  return {
    messages,
    input,
    setInput: editInput,
    sendMessage,
    clearConversation,
    loading: request.status === 'sending',
    error: request.status === 'error' ? request.message : null,
    retry: request.status === 'error' ? request.retry : null,
    stop: () => activeRequest.current?.abort(),
  };
}
