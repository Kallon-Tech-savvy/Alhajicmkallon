import type { ChatService } from './server';
import {
  ChatBodyTooLargeError,
  hasJsonContentType,
  isAllowedChatOrigin,
  isOversizedContentLength,
  readChatJson,
} from './lib/request-security';
export {
  MAX_CHAT_REQUEST_BYTES,
  ChatBodyTooLargeError,
  hasJsonContentType,
  isAllowedChatOrigin,
  isOversizedContentLength,
  readChatJson,
} from './lib/request-security';

/** HTTP gates and translation; answering policy belongs to the chat service. */
export function createChatHandler({
  answer,
  originConfig,
  identify,
}: {
  answer: ChatService;
  originConfig: { siteUrl?: string; previewUrl?: string; nodeEnv?: string };
  identify: (request: Request) => string;
}) {
  return async (request: Request): Promise<Response> => {
    const headers = { 'Cache-Control': 'no-store' };
    const fail = (status: number, error: string) => Response.json({ error }, { status, headers });
    if (!isAllowedChatOrigin(request.headers.get('origin'), originConfig))
      return fail(403, 'This chat can only be used from the website itself.');
    if (!hasJsonContentType(request.headers.get('content-type')))
      return fail(415, 'Only JSON requests are accepted.');
    if (isOversizedContentLength(request.headers.get('content-length')))
      return fail(413, 'The request is too large.');
    let body: unknown;
    try {
      body = await readChatJson(request);
    } catch (error) {
      return error instanceof ChatBodyTooLargeError
        ? fail(413, 'The request is too large.')
        : fail(400, 'The message could not be read.');
    }
    const result = await answer({ body, clientId: identify(request), signal: request.signal });
    return Response.json(result.body, {
      status: result.status,
      headers: {
        ...headers,
        ...(result.retryAfterSeconds !== undefined
          ? { 'Retry-After': String(result.retryAfterSeconds) }
          : {}),
      },
    });
  };
}
