import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const config = readFileSync(new URL('../cloudflare.config.ts', import.meta.url), 'utf8');
const chat = readFileSync(new URL('../src/packages/chat/runtime.ts', import.meta.url), 'utf8');
const contact = readFileSync(new URL('../src/lib/contact-email.mjs', import.meta.url), 'utf8');

const required = [
  'RESEND_API_KEY',
  'TURNSTILE_SECRET',
  'CONTACT_TO_EMAIL',
  'OPENAI_API_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
];

test('Worker declares all production email, AI and quota secrets by name', () => {
  for (const name of required) {
    assert.match(config, new RegExp(`\\b${name}: bindings\\.secret\\(\\)`));
  }
  assert.match(config, /name:\s*["']alhajicmkallon["']/);
  assert.match(config, /CHAT_CLIENT_IP_HEADER: bindings\.text\(["']cf-connecting-ip["']\)/);
  assert.match(config, /NEXT_PUBLIC_SITE_URL: bindings\.text\(["']https:\/\/alhajikallon\.com["']\)/);
});

test('Worker declarations match real server-side environment usage', () => {
  for (const name of ['OPENAI_API_KEY', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']) {
    assert.ok(chat.includes(`process.env.${name}`), `chat runtime does not read ${name}`);
  }
  for (const name of ['RESEND_API_KEY', 'TURNSTILE_SECRET', 'CONTACT_TO_EMAIL']) {
    assert.ok(contact.includes(name), `contact handler does not use ${name}`);
  }
  // Optional features must not turn into required deploy-time secrets.
  assert.doesNotMatch(config, /CONTACT_DEV_TO_EMAIL:\s*bindings\.secret\(\)/);
  assert.doesNotMatch(config, /CONTACT_CONFIRMATION_ENABLED:\s*bindings\.secret\(\)/);
});
