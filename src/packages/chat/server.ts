/** Injectable API. Runtime credentials are wired only in runtime.ts. */
export { createChatService } from './lib/service';
export { ChatQuotaError, createMemoryQuotaStore, createRedisQuotaStore } from './lib/quota';
export type {
  ChatProvider,
  ChatService,
  ChatResult,
  QuotaStore,
  QuotaDecision,
} from './lib/contracts';
