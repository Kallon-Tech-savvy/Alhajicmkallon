import { OpenAI } from 'openai';
import { buildSystemPrompt } from '@/lib/chatsystemPrompt';
import { MAX_HISTORY_MESSAGES, MAX_MESSAGE_LENGTH } from '@/lib/Chatconstant';
import { matchFaq } from '@/lib/FAQmatcher';
import { selectRelevantChunks } from '@/lib/Retrieval';
import { checkIpRateLimit, checkOpenAiBudget } from '@/lib/chatrate';

export const runtime = 'edge';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function isValidHistoryMessage(m: unknown): m is ChatMessage {
  if (typeof m !== 'object' || m === null) return false;
  const candidate = m as Record<string, unknown>;
  return (
    (candidate.role === 'user' || candidate.role === 'assistant') &&
    typeof candidate.content === 'string' &&
    candidate.content.length > 0 &&
    candidate.content.length <= MAX_MESSAGE_LENGTH
  );
}

function jsonResponse(body: Record<string, unknown>, status: number, extraHeaders?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...extraHeaders },
  });
}

/** Best-effort client IP from the headers a reverse proxy / edge network sets. */
function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  // No IP signal available — bucket these together rather than skip
  // rate limiting entirely.
  return 'unknown';
}

/**
 * Rejects requests whose Origin (or, failing that, Referer) doesn't match
 * the host this route is being served from. A same-origin `fetch` POST
 * from the widget will carry one of these headers; a script hitting the
 * endpoint directly from elsewhere generally won't match.
 */
function isSameOrigin(req: Request): boolean {
  const host = req.headers.get('host');
  if (!host) return false;

  const origin = req.headers.get('origin');
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  const referer = req.headers.get('referer');
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  // Neither header present — a genuine browser fetch POST should send at
  // least one. Treat as untrusted rather than silently allowing it through.
  return false;
}

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  const openAiKey = process.env.OPENAI_API_KEY;
  if (!openAiKey) {
    return jsonResponse({ error: 'OPENAI_API_KEY is missing.' }, 503);
  }

  // 1. Per-IP rate limit — applies to every request that reaches the
  // route, before any real work happens.
  const ip = getClientIp(req);
  const ipCheck = checkIpRateLimit(ip);
  if (!ipCheck.allowed) {
    return jsonResponse(
      { error: 'Too many messages sent too quickly. Please wait a moment and try again.' },
      429,
      { 'Retry-After': String(ipCheck.retryAfterSeconds) }
    );
  }

  // 2. Same-origin check — this endpoint is only meant to be called from
  // the widget on this site.
  if (!isSameOrigin(req)) {
    return jsonResponse({ error: 'Request could not be verified.' }, 403);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
  }

  const { message, history, company } = (body ?? {}) as {
    message?: unknown;
    history?: unknown;
    company?: unknown;
  };

  // 3. Honeypot — a hidden field real visitors never fill in. Reject
  // quietly with a generic error rather than confirming the mechanism.
  if (typeof company === 'string' && company.trim().length > 0) {
    return jsonResponse({ error: 'Unable to process this request.' }, 400);
  }

  if (typeof message !== 'string' || message.trim().length === 0) {
    return jsonResponse({ error: 'Please enter a message before sending.' }, 400);
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(
      { error: `Please shorten your message to ${MAX_MESSAGE_LENGTH} characters or fewer.` },
      400
    );
  }

  const trimmedMessage = message.trim();
  const safeHistory: ChatMessage[] = Array.isArray(history)
    ? history.filter(isValidHistoryMessage).slice(-MAX_HISTORY_MESSAGES)
    : [];

  // 4. Local FAQ short-circuit — zero-cost, zero-latency, zero
  // hallucination risk. Runs before OpenAI is ever touched.
  const faqAnswer = matchFaq(trimmedMessage);
  if (faqAnswer) {
    return jsonResponse({ reply: faqAnswer }, 200);
  }

  // 5. Global daily OpenAI budget — only requests that actually reach
  // OpenAI should count against it, so this sits after the FAQ check.
  const budgetCheck = checkOpenAiBudget();
  if (!budgetCheck.allowed) {
    return jsonResponse(
      {
        error:
          "The assistant has reached its usage limit for today. Please reach out directly at hello@alhajikallon.dev in the meantime.",
      },
      429,
      { 'Retry-After': String(budgetCheck.retryAfterSeconds) }
    );
  }

  // 6. Moderation — checked on the visitor's own message before it's sent
  // onward. This is a defense-in-depth check, not the only safety net (the
  // completion endpoint applies its own filtering), so a failure *in the
  // moderation call itself* — wrong API key permissions, a transient outage,
  // etc. — logs and falls through rather than taking the whole feature
  // down. Only an actual flagged result blocks the message.
  try {
    const moderation = await openai.moderations.create({ input: trimmedMessage });
    if (moderation.results?.[0]?.flagged) {
      return jsonResponse(
        { error: 'That message could not be processed. Please rephrase your inquiry or use the Contact page directly.' },
        400
      );
    }
  } catch (moderationError) {
    console.error('Moderation check failed, continuing without it:', moderationError);
  }

  try {
    // 7. Only the chunks relevant to this message + recent history go in
    // — not the whole knowledge base.
    const relevantChunks = selectRelevantChunks(trimmedMessage, safeHistory);

    const messages = [
      { role: 'system' as const, content: buildSystemPrompt(relevantChunks) },
      ...safeHistory,
      { role: 'user' as const, content: trimmedMessage },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });

    const reply = response.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return jsonResponse(
        { error: 'I was unable to generate a reply just now. Please try again in a moment.' },
        502
      );
    }

    return jsonResponse({ reply }, 200);
  } catch (error) {
    console.error('OpenAI request error:', error);
    return jsonResponse({ error: 'The chat service is currently unavailable.' }, 500);
  }
}