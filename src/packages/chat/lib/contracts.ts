import type { ChatMessage, ChatResponse } from '../shared';
export interface QuotaDecision {
  allowed: boolean;
  retryAfterSeconds: number;
}
/** Each consume must atomically check and reserve one attempt. */
export interface QuotaStore {
  consume(
    key: string,
    limit: number,
    windowSeconds: number,
    signal: AbortSignal,
  ): Promise<QuotaDecision>;
}
export interface ChatProvider {
  moderate(message: string, signal: AbortSignal): Promise<boolean>;
  complete(
    messages: Array<{ role: 'system' | ChatMessage['role']; content: string }>,
    signal: AbortSignal,
  ): Promise<string | null>;
}
export interface ChatResult {
  status: number;
  body: ChatResponse;
  retryAfterSeconds?: number;
}
export type ChatService = (input: {
  body: unknown;
  clientId: string;
  signal?: AbortSignal;
}) => Promise<ChatResult>;

/** Only fixed operational stages may appear in diagnostics; never visitor content. */
export type ChatFailureStage =
  'visitor_quota' | 'provider_configuration' | 'ai_quota' | 'moderation' | 'completion';
