import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkRateLimit } from '@/lib/chatrate';
import { SYSTEM_PROMPT } from '@/lib/chatsystemPrompt';

export const runtime = 'nodejs';

const MODEL = 'gpt-4o-mini';
const MAX_OUTPUT_TOKENS = 300;
const MAX_HISTORY_TURNS = 6;
const MAX_MESSAGE_LENGTH = 800;
const REQUEST_TIMEOUT_MS = 15_000;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const FALLBACK_REPLY =
  "I’m currently taking a short break, but I can still help. Please try again in a moment or contact Alhaji directly through the contact page.";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
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

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;

  const allowedOrigins = [process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'];
  const normalized = origin.replace(/\/$/, '');

  return allowedOrigins.some((value) => {
    if (!value) return false;
    const normalizedValue = value.replace(/\/$/, '');
    return normalized === normalizedValue || normalized.startsWith(`${normalizedValue}/`);
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (origin && !isAllowedOrigin(origin)) {
    return NextResponse.json({ error: 'This chat can only be used from the website itself.' }, { status: 403 });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is missing from environment variables');
    return NextResponse.json(
      {
        reply: FALLBACK_REPLY,
        error: 'The chat service is currently unavailable. Please try again shortly.',
      },
      { status: 503 }
    );
  }

  const ip = getClientIp(req);
  const rateResult = checkRateLimit(ip);
  if (!rateResult.allowed) {
    return NextResponse.json(
      {
        reply: 'I am receiving a lot of questions right now. Please wait a moment and try again.',
        error: 'Too many messages. Please wait a moment and try again.',
      },
      { status: 429, headers: { 'Retry-After': String(rateResult.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'The message could not be read. Please try again.' }, { status: 400 });
  }

  const { message, history, company } = (body ?? {}) as {
    message?: unknown;
    history?: unknown;
    company?: unknown;
  };

  if (typeof company === 'string' && company.trim().length > 0) {
    return NextResponse.json({ error: 'The form was not completed correctly. Please try again.' }, { status: 400 });
  }

  if (typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Please enter a message before sending.' }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Please shorten your message to ${MAX_MESSAGE_LENGTH} characters or fewer.` },
      { status: 400 }
    );
  }

  const safeHistory: ChatMessage[] = Array.isArray(history)
    ? history.filter(isValidHistoryMessage).slice(-MAX_HISTORY_TURNS * 2)
    : [];

  try {
    const moderation = await openai.moderations.create({ input: message });
    if (moderation.results[0]?.flagged) {
      return NextResponse.json(
        {
          error: "I can't help with that. Try asking about Alhaji's work, skills, or how to reach him.",
        },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error('OpenAI Moderation check failed:', err);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const completion = await openai.chat.completions.create(
      {
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...safeHistory,
          { role: 'user', content: message.trim() },
        ],
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.6,
      },
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    const reply = completion.choices[0]?.message?.content;
    if (!reply) {
      return NextResponse.json(
        { reply: FALLBACK_REPLY, error: 'The assistant did not return a reply. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (err: unknown) {
    clearTimeout(timeout);

    if (err instanceof Error && (err.name === 'AbortError' || (err as { status?: number }).status === 408)) {
      return NextResponse.json(
        { reply: FALLBACK_REPLY, error: 'The request took too long. Please try again in a moment.' },
        { status: 504 }
      );
    }

    console.error('OpenAI Chat Completion failure:', err);
    return NextResponse.json(
      { reply: FALLBACK_REPLY, error: 'The chat service is currently unavailable. Please try again shortly.' },
      { status: 500 }
    );
  }
}

