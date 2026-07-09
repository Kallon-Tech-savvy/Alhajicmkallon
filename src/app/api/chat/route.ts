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

// Initialize the OpenAI client natively
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

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

export async function POST(req: NextRequest) {
  // 1. Same-origin security check
  const origin = req.headers.get('origin');
  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  if (allowedOrigin && origin && origin !== allowedOrigin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. API Key verification guard
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is missing from environment variables');
    return NextResponse.json({ error: 'Chat is temporarily unavailable.' }, { status: 503 });
  }

  // 3. In-memory Rate Limiting
  const ip = getClientIp(req);
  const rateResult = checkRateLimit(ip);
  if (!rateResult.allowed) {
    return NextResponse.json(
      { error: 'Too many messages. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(rateResult.retryAfterSeconds) } }
    );
  }

  // 4. Defensive body parsing & Honeypot verification
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { message, history, company } = (body ?? {}) as {
    message?: unknown;
    history?: unknown;
    company?: unknown;
  };

  if (typeof company === 'string' && company.trim().length > 0) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).` },
      { status: 400 }
    );
  }

  const safeHistory: ChatMessage[] = Array.isArray(history)
    ? history.filter(isValidHistoryMessage).slice(-MAX_HISTORY_TURNS * 2)
    : [];

  // 5. SDK Moderation Layer (Catches policy-violating prompts for free)
  try {
    const moderation = await openai.moderations.create({ input: message });
    if (moderation.results[0]?.flagged) {
      return NextResponse.json(
        {
          error: "I can't help with that. Try asking about Alhaji's work, skills, or how to get in touch.",
        },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error('OpenAI Moderation check failed:', err);
    // Fail open if moderation service encounters an unexpected network issue
  }

  // 6. AbortController for Request Timeout handling
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
      { signal: controller.signal } // Pass the abort signal directly to the SDK
    );

    clearTimeout(timeout);

    const reply = completion.choices[0]?.message?.content;
    if (!reply) {
      return NextResponse.json({ error: 'No response generated. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (err: any) {
    clearTimeout(timeout);
    
    if (err?.name === 'AbortError' || err?.status === 408) {
      return NextResponse.json({ error: 'The request took too long. Please try again.' }, { status: 504 });
    }
    
    console.error('OpenAI Chat Completion failure:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

