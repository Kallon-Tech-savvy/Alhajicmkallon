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