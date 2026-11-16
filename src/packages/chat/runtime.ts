import 'server-only';
import { createHmac } from 'node:crypto';
import OpenAI from 'openai';
import {
  ChatQuotaError,
  createChatService,
  createMemoryQuotaStore,
  createRedisQuotaStore,
} from './server';
import type { ChatProvider, ChatService, QuotaStore } from './server';

let service: ChatService | undefined;
const memoryQuota = createMemoryQuotaStore();

function configuredQuota(): QuotaStore {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return createRedisQuotaStore({ url, token });
  if (process.env.NODE_ENV !== 'production') return memoryQuota;
  // Missing shared storage must never silently enable a per-instance AI budget.
  return {
    consume: async () => {
      throw new ChatQuotaError('quota_configuration');
    },
  };
}

function configuredProvider(): ChatProvider | undefined {
  if (!process.env.OPENAI_API_KEY) return undefined;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 0, timeout: 15_000 });
  return {
    async moderate(message, signal) {
      const response = await client.moderations.create({ input: message }, { signal });
      const verdict = response.results[0]?.flagged;
      if (typeof verdict !== 'boolean') throw new Error('Invalid moderation response.');
      return verdict;
    },
    async complete(messages, signal) {
      const response = await client.chat.completions.create(
        { model: 'gpt-4o-mini', messages, max_tokens: 500, temperature: 0.6 },
        { signal },
      );
      return response.choices[0]?.message?.content ?? null;
    },
  };
}

/** Use only an IP header overwritten by the trusted deployment proxy. */
export function identifyChatClient(request: Request): string {
  const header = process.env.CHAT_CLIENT_IP_HEADER;
  const address = header ? request.headers.get(header)?.split(',')[0]?.trim() : undefined;
  // Missing headers share one conservative bucket; never trust arbitrary headers.
  const secret = process.env.UPSTASH_REDIS_REST_TOKEN ?? 'local-development';
  return createHmac('sha256', secret)
    .update(address || 'unknown')
    .digest('hex');
}

export const answerChat: ChatService = async (input) => {
  try {
    service ??= createChatService({
      quota: configuredQuota(),
      provider: configuredProvider(),
      namespace: process.env.CHAT_QUOTA_NAMESPACE || 'alhajikallon:chat:v1',
      // Do not log provider payloads, visitor messages, or credentials.
      onError: logChatError,
    });
    return service(input);
  } catch (error) {
    logChatError(error);
    return { status: 503, body: { error: 'The chat service is currently unavailable.' } };
  }
};

/** Emit only fixed diagnostic codes and HTTP status, never upstream error contents. */
function logChatError(error: unknown) {
  console.error('chat_unavailable', {
    code: error instanceof ChatQuotaError ? error.code : 'chat_configuration_or_provider',
    ...(error instanceof ChatQuotaError && error.status !== undefined
      ? { status: error.status }
      : {}),
  });
}
