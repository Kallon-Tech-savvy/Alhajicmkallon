import test from 'node:test';
import assert from 'node:assert/strict';
import { createChatHandler, MAX_CHAT_REQUEST_BYTES } from '../http';

function request(
  body = JSON.stringify({ message: 'Hello' }),
  headers: Record<string, string> = {},
) {
  return new Request('https://alhajikallon.com/api/chat', {
    method: 'POST',
    body,
    headers: { Origin: 'https://alhajikallon.com', 'Content-Type': 'application/json', ...headers },
  });
}

test('HTTP gates reject unsafe requests without calling the service', async () => {
  const post = createChatHandler({
    originConfig: { nodeEnv: 'production' },
    identify: () => 'id',
    answer: async () => {
      throw new Error('must not run');
    },
  });
  for (const [req, status] of [
    [request('{}', { Origin: 'https://attacker.example' }), 403],
    [request('{}', { 'Content-Type': 'text/plain' }), 415],
    [request('{}', { 'Content-Length': String(MAX_CHAT_REQUEST_BYTES + 1) }), 413],
    [request('x'.repeat(MAX_CHAT_REQUEST_BYTES + 1)), 413],
    [request('{broken'), 400],
  ] as const) {
    const response = await post(req);
    assert.equal(response.status, status);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
});

test('HTTP adapter passes identity/body/cancellation and preserves rate-limit responses', async () => {
  const req = request();
  const post = createChatHandler({
    originConfig: { nodeEnv: 'production' },
    identify: () => 'hashed-id',
    answer: async (input) => {
      assert.deepEqual(input.body, { message: 'Hello' });
      assert.equal(input.clientId, 'hashed-id');
      assert.equal(input.signal, req.signal);
      return { status: 429, body: { error: 'Budget reached' }, retryAfterSeconds: 625 };
    },
  });
  const response = await post(req);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '625');
  assert.deepEqual(await response.json(), { error: 'Budget reached' });
});
