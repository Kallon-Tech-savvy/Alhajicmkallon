/**
 * Shared limits used by both the client (ChatWidget) and the server
 * (chat API route). Keeping these in one place stops the two sides from
 * silently drifting out of sync — previously MAX_MESSAGE_LENGTH was
 * hardcoded separately in both files.
 */
export const MAX_MESSAGE_LENGTH = 800;

// How many *messages* (user+assistant combined) of history the server
// will actually forward to OpenAI. Kept small on purpose — history rides
// along on every single turn, so this is the single biggest lever on cost.
export const MAX_HISTORY_TURNS = 6;
export const MAX_HISTORY_MESSAGES = MAX_HISTORY_TURNS * 2;

// The client also trims to this before sending, so the request payload
// itself doesn't grow unbounded over a very long conversation (previously
// the client sent the entire unsliced history every time).
export const CLIENT_HISTORY_LIMIT = MAX_HISTORY_MESSAGES;

/**
 * Pre-verified quick questions surfaced in the onboarding guide and the
 * chat widget's empty state.
 *
 * Each one is worded to match the `triggerKeywords` of an entry in
 * `FAQ_ENTRIES` (see Knowledgebase.ts). matchFaq() runs before the request
 * ever reaches OpenAI (see api/chat/route.ts), so tapping one of these is
 * guaranteed to return the same pre-approved, human-written answer every
 * time — zero model calls, zero hallucination risk, near-instant.
 *
 * If you rename or remove a FAQ_ENTRIES trigger, update the matching
 * question here too, or a tap will silently fall through to the LLM.
 */
export const QUICK_QUESTIONS = [
  'Is Alhaji available for hire?',
  'What services do you offer?',
  "What's his pricing like?",
  'Can I see past work?',
  "What's the process?",
  'How do I get in touch?',
  'What should I include in the contact form?',
] as const;