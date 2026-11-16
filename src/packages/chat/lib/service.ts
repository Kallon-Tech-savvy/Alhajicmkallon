import { MAX_HISTORY_MESSAGES, MAX_MESSAGE_LENGTH } from '../shared';
import type { ChatMessage } from '../shared';
import type { ChatProvider, ChatResult, ChatService, QuotaStore } from './contracts';
import { matchFaq } from './faq';
import { buildSystemPrompt } from './prompt';
import { selectRelevantChunks } from './retrieval';

const UNAVAILABLE: ChatResult = {
  status: 503,
  body: {
    reply:
      'The assistant is temporarily unavailable. Please try again or contact Alhaji through the contact page.',
    error: 'The chat service is currently unavailable.',
  },
};

function validHistoryMessage(value: unknown): value is ChatMessage {
  if (typeof value !== 'object' || value === null) return false;
  const message = value as Record<string, unknown>;
  return (
    (message.role === 'user' || message.role === 'assistant') &&
    typeof message.content === 'string' &&
    message.content.trim().length > 0 &&
    message.content.length <= MAX_MESSAGE_LENGTH
  );
}

function parseInput(body: unknown): { message: string; history: ChatMessage[] } | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null;
  const input = body as Record<string, unknown>;
  if (typeof input.company === 'string' && input.company.trim()) return null;
  if (
    typeof input.message !== 'string' ||
    !input.message.trim() ||
    input.message.length > MAX_MESSAGE_LENGTH
  )
    return null;
  return {
    message: input.message.trim(),
    history: Array.isArray(input.history)
      ? input.history.filter(validHistoryMessage).slice(-MAX_HISTORY_MESSAGES)
      : [],
  };
}

export function createChatService({
  provider,
  quota,
  timeoutMs = 15_000,
  namespace = 'alhajikallon:chat:v1',
  onError = () => {},
}: {
  provider?: ChatProvider;
  quota: QuotaStore;
  timeoutMs?: number;
  namespace?: string;
  onError?: (error: unknown) => void;
}): ChatService {
  return async ({ body, clientId, signal: requestSignal }) => {
    const input = parseInput(body);
    if (!input)
      return {
        status: 400,
        body: { error: `Please enter a message of 1–${MAX_MESSAGE_LENGTH} characters.` },
      };
    const { message, history } = input;
    const controller = new AbortController();
    const cancel = () => controller.abort(requestSignal?.reason);
    requestSignal?.addEventListener('abort', cancel, { once: true });
    if (requestSignal?.aborted) cancel();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort(new Error('Chat deadline exceeded.'));
    }, timeoutMs);
    const signal = controller.signal;

    async function answer(): Promise<ChatResult> {
      signal.throwIfAborted();
      const rate = await quota.consume(`${namespace}:ip:${clientId}`, 5, 60, signal);
      if (!rate.allowed)
        return {
          status: 429,
          body: { error: 'Too many messages. Please wait a moment and try again.' },
          retryAfterSeconds: rate.retryAfterSeconds,
        };
      signal.throwIfAborted();
      const faq = matchFaq(message);
      if (faq) return { status: 200, body: { reply: faq } };
      if (!provider) return UNAVAILABLE;
      // Count reserved attempts, including failed/flagged calls. Never refund:
      // a provider may have processed a request even when its reply is lost.
      const budget = await quota.consume(`${namespace}:ai`, 300, 86_400, signal);
      if (!budget.allowed)
        return {
          status: 429,
          body: {
            error:
              'Daily question budget reached. Please try again later or contact Alhaji directly.',
          },
          retryAfterSeconds: budget.retryAfterSeconds,
        };
      signal.throwIfAborted();
      const flagged = await provider.moderate(message, signal);
      if (typeof flagged !== 'boolean') throw new Error('Invalid moderation response.');
      if (flagged)
        return {
          status: 400,
          body: { error: "Try asking about Alhaji's work, skills, or how to reach him." },
        };
      signal.throwIfAborted();
      const context = selectRelevantChunks(message, history);
      const reply = await provider.complete(
        [
          { role: 'system', content: buildSystemPrompt(context) },
          ...history,
          { role: 'user', content: message },
        ],
        signal,
      );
      signal.throwIfAborted();
      if (!reply?.trim())
        return {
          status: 502,
          body: { error: 'The assistant did not return a reply. Please retry.' },
        };
      return { status: 200, body: { reply: reply.trim() } };
    }

    let rejectOnAbort: (() => void) | undefined;
    try {
      const aborted = new Promise<never>((_, reject) => {
        rejectOnAbort = () => reject(signal.reason);
        signal.addEventListener('abort', rejectOnAbort, { once: true });
        if (signal.aborted) rejectOnAbort();
      });
      return await Promise.race([answer(), aborted]);
    } catch (error) {
      if (timedOut) return { status: 504, body: { error: 'The request timed out. Please retry.' } };
      if (requestSignal?.aborted)
        return { status: 499, body: { error: 'The request was cancelled.' } };
      onError(error);
      return UNAVAILABLE;
    } finally {
      clearTimeout(timer);
      requestSignal?.removeEventListener('abort', cancel);
      if (rejectOnAbort) signal.removeEventListener('abort', rejectOnAbort);
    }
  };
}
