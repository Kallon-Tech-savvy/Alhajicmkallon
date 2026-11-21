/** Browser-safe conversation contract. Provider details stay private. */
export const MAX_MESSAGE_LENGTH = 800;
export const MAX_HISTORY_MESSAGES = 12;
/** Visible starters are covered by local FAQs; they must not require an AI key. */
export const CHAT_STARTER_QUESTIONS = [
  'What does a design engineer do?',
  'Can you help with my project?',
  'Show me your best work',
] as const;
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
export interface ChatResponse {
  reply?: string;
  error?: string;
}
