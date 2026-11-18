import { createContactHandler } from '@/lib/contact-email.mjs';

export const runtime = 'nodejs';
export const POST = createContactHandler();
