import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import * as security from '../src/lib/chat-request-security.mjs';

// Execute the actual route with isolated external dependencies, never a live API.
const source = await readFile(new URL('../src/app/api/chat/route.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;

function handler(moderate) {
  let completions = 0;
  const dependencies = {
    'next/server': { NextResponse: { json: (body, options) => Response.json(body, options) } },
    openai: class {
      moderations = { create: moderate };
      chat = { completions: { create: async () => {
        completions++;
        return { choices: [{ message: { content: 'A useful reply' } }] };
      } } };
    },
    '@/lib/chatrate': { checkIpRateLimit: () => ({ allowed: true }), checkOpenAiBudget: () => ({ allowed: true }) },
    '@/lib/chatsystemPrompt': { buildSystemPrompt: () => 'System instructions' },
    '@/lib/Retrieval': { selectRelevantChunks: () => [] },
    '@/lib/FAQmatcher': { matchFaq: () => null },
    '@/lib/Chatconstant': { MAX_MESSAGE_LENGTH: 800, MAX_HISTORY_MESSAGES: 12 },
    '@/lib/chat-request-security.mjs': security,
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require: (id) => {
      assert.ok(Object.hasOwn(dependencies, id), `Unexpected route dependency: ${id}`);
      return dependencies[id];
    },
    process: { env: { OPENAI_API_KEY: 'test-placeholder', NODE_ENV: 'production' } },
    console: { error() {} },
    AbortController, setTimeout, clearTimeout,
  });
  return { post: exports.POST, completions: () => completions };
}

function request() {
  return new Request('https://alhajikallon.com/api/chat', {
    method: 'POST',
    headers: { Origin: 'https://alhajikallon.com', 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Describe your development process' }),
  });
}

for (const [name, payload] of [
  ['missing response', undefined], ['null response', null], ['missing results', {}],
  ['empty results', { results: [] }], ['missing verdict', { results: [{}] }],
  ['non-boolean verdict', { results: [{ flagged: 'false' }] }],
]) {
  test(`chat fails closed on ${name}`, async () => {
    const route = handler(async () => payload);
    assert.equal((await route.post(request())).status, 503);
    assert.equal(route.completions(), 0);
  });
}

test('moderation failure never invokes completion', async () => {
  const route = handler(async () => { throw new Error('Upstream unavailable'); });
  assert.equal((await route.post(request())).status, 503);
  assert.equal(route.completions(), 0);
});

test('flagged input never invokes completion', async () => {
  const route = handler(async () => ({ results: [{ flagged: true }] }));
  assert.equal((await route.post(request())).status, 400);
  assert.equal(route.completions(), 0);
});

test('explicit unflagged input reaches completion once', async () => {
  const route = handler(async () => ({ results: [{ flagged: false }] }));
  const response = await route.post(request());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).reply, 'A useful reply');
  assert.equal(route.completions(), 1);
});
