import { createChatHandler } from '@/packages/chat/http';
import { answerChat, identifyChatClient } from '@/packages/chat/runtime';

export const runtime = 'nodejs';
export const POST = createChatHandler({
  answer: answerChat,
  identify: identifyChatClient,
  originConfig: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    previewUrl: process.env.VERCEL_URL,
    nodeEnv: process.env.NODE_ENV,
  },
});
