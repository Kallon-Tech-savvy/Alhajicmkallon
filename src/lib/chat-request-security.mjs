/**
 * Browser request gates for the public chat endpoint.
 * Origin checks are defence in depth, not authentication: non-browser clients
 * can forge Origin. Enforce distributed rate limits at the edge in production.
 */
export const MAX_CHAT_REQUEST_BYTES = 64 * 1024;

export function isAllowedChatOrigin(origin, { siteUrl, previewUrl, nodeEnv } = {}) {
  if (typeof origin !== 'string') return false;
  let parsed;
  try {
    parsed = new URL(origin);
  } catch {
    return false;
  }
  // Only a serialized origin is valid: no paths, usernames or suffix matches.
  if (parsed.origin !== origin) return false;

  const allowed = new Set(['https://alhajikallon.com', 'https://www.alhajikallon.com']);
  if (siteUrl) {
    try {
      allowed.add(new URL(siteUrl).origin);
    } catch {
      // A malformed configuration must not open access to arbitrary origins.
    }
  }
  if (previewUrl && /^[a-z0-9.-]+\.vercel\.app$/i.test(previewUrl)) {
    allowed.add(`https://${previewUrl}`);
  }
  if (nodeEnv !== 'production') {
    allowed.add('http://localhost:3000');
    allowed.add('http://127.0.0.1:3000');
  }
  return allowed.has(origin);
}

export function hasJsonContentType(contentType) {
  return typeof contentType === 'string' &&
    /^application\/json(?:\s*;\s*charset\s*=\s*utf-8)?$/i.test(contentType);
}

export function isOversizedContentLength(header) {
  if (header === null) return false;
  return !/^\d+$/.test(header) || Number(header) > MAX_CHAT_REQUEST_BYTES;
}

export class ChatBodyTooLargeError extends Error {
  constructor() {
    super('Chat request exceeds the size limit.');
    this.name = 'ChatBodyTooLargeError';
  }
}

/** Read incrementally so chunked requests cannot evade the body-size cap. */
export async function readChatJson(request) {
  if (!request.body) throw new SyntaxError('Missing JSON body');
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let received = 0;
  let text = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > MAX_CHAT_REQUEST_BYTES) {
        await reader.cancel();
        throw new ChatBodyTooLargeError();
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally {
    reader.releaseLock();
  }
}
