/** Browser-safe conversation contract. Provider details stay private. */
export const MAX_MESSAGE_LENGTH = 800;
export const MAX_HISTORY_MESSAGES = 12;
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
export interface ChatResponse {
  reply?: string;
  error?: string;
}
