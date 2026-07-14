import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkIpRateLimit, checkOpenAiBudget } from '@/lib/chatrate';
import { buildSystemPrompt } from '@/lib/chatsystemPrompt';
import { selectRelevantChunks } from '@/lib/Retrieval';
import { matchFaq } from '@/lib/FAQmatcher';
import { MAX_MESSAGE_LENGTH, MAX_HISTORY_MESSAGES } from '@/lib/Chatconstant';

export const runtime = 'nodejs';

const MODEL = 'gpt-4o-mini';
const MAX_OUTPUT_TOKENS = 500;
const REQUEST_TIMEOUT_MS = 15_000;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

let cachedClient: OpenAI | null = null;
function getOpenAiClient(): OpenAI {
  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return cachedClient;
}

const FALLBACK_REPLY =
  "I’m currently taking a short break, but I can still help. Please try again in a moment or contact Alhaji directly through the contact page.";

const BUDGET_REACHED_REPLY =
  "I've reached my question budget for today. Please try again tomorrow, or reach Alhaji directly via the Contact page or hello@alhajikallon.dev.";

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

  const ip = getClientIp(req);
  const ipResult = checkIpRateLimit(ip);
  if (!ipResult.allowed) {
    return NextResponse.json(
      {
        reply: 'I am receiving a lot of questions right now. Please wait a moment and try again.',
        error: 'Too many messages. Please wait a moment and try again.',
      },
      { status: 429, headers: { 'Retry-After': String(ipResult.retryAfterSeconds) } }
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

  // Honeypot field validation
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

  const trimmedMessage = message.trim();

  // Fast path local FAQ execution bypass
  const faqAnswer = matchFaq(trimmedMessage);
  if (faqAnswer) {
    return NextResponse.json({ reply: faqAnswer });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is missing from environment variables');
    return NextResponse.json(
      { reply: FALLBACK_REPLY, error: 'The chat service is currently unavailable.' },
      { status: 503 }
    );
  }

  const budgetResult = checkOpenAiBudget();
  if (!budgetResult.allowed) {
    return NextResponse.json(
      { reply: BUDGET_REACHED_REPLY, error: 'Daily question budget reached.' },
      { status: 429, headers: { 'Retry-After': String(budgetResult.retryAfterSeconds) } }
    );
  }

  const safeHistory: ChatMessage[] = Array.isArray(history)
    ? history.filter(isValidHistoryMessage).slice(-MAX_HISTORY_MESSAGES)
    : [];

  // Execute Moderation checks cleanly and intercept fatal connection errors early
  try {
    const moderation = await getOpenAiClient().moderations.create({ input: trimmedMessage });
    if (moderation.results[0]?.flagged) {
      return NextResponse.json(
        { error: "I can't help with that. Try asking about Alhaji's work, skills, or how to reach him." },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.error('OpenAI Moderation check failed:', err);
    // If the account is explicitly restricted (403 Forbidden), intercept and short-circuit right here
    if (err?.status === 403) {
      return NextResponse.json(
        { reply: FALLBACK_REPLY, error: 'Upstream gateway clearance exception.' },
        { status: 500 }
      );
    }
  }

  const relevantChunks = selectRelevantChunks(trimmedMessage, safeHistory);
  const systemPrompt = buildSystemPrompt(relevantChunks);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const completion = await getOpenAiClient().chat.completions.create(
      {
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...safeHistory,
          { role: 'user', content: trimmedMessage },
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
        { reply: FALLBACK_REPLY, error: 'The assistant did not return a valid payload.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (err: unknown) {
    clearTimeout(timeout);

    if (err instanceof Error && (err.name === 'AbortError' || (err as { status?: number }).status === 408)) {
      return NextResponse.json(
        { reply: FALLBACK_REPLY, error: 'The request timed out.' },
        { status: 504 }
      );
    }

    console.error('OpenAI Chat Completion failure:', err);
    return NextResponse.json(
      { reply: FALLBACK_REPLY, error: 'The chat service is currently unavailable.' },
      { status: 500 }
    );
  }
}