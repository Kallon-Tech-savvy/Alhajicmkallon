import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_CHAT_REQUEST_BYTES,
  ChatBodyTooLargeError,
  hasJsonContentType,
  isAllowedChatOrigin,
  isOversizedContentLength,
  readChatJson,
} from '../src/lib/chat-request-security.mjs';

const config = { siteUrl: 'https://alhajikallon.com', nodeEnv: 'production' };

test('origin allowlist uses exact origins and blocks malformed and missing headers', () => {
  assert.equal(isAllowedChatOrigin('https://alhajikallon.com', config), true);
  assert.equal(isAllowedChatOrigin('https://www.alhajikallon.com', config), true);
  for (const origin of [null, 'https://alhajikallon.com.attacker.net', 'https://alhajikallon.com/path', 'null', 'http://localhost:3000']) {
    assert.equal(isAllowedChatOrigin(origin, config), false, String(origin));
  }
  assert.equal(isAllowedChatOrigin('http://localhost:3000', { nodeEnv: 'development' }), true);
  assert.equal(isAllowedChatOrigin('https://example.vercel.app', { ...config, previewUrl: 'example.vercel.app' }), true);
  assert.equal(isAllowedChatOrigin('https://another.vercel.app', { ...config, previewUrl: 'example.vercel.app' }), false);
});

test('only JSON requests pass the content-type gate', () => {
  assert.equal(hasJsonContentType('application/json'), true);
  assert.equal(hasJsonContentType('application/json; charset=UTF-8'), true);
  assert.equal(hasJsonContentType('text/plain'), false);
  assert.equal(hasJsonContentType(null), false);
});

test('invalid and over-budget body lengths are rejected', () => {
  assert.equal(isOversizedContentLength(null), false);
  assert.equal(isOversizedContentLength(String(MAX_CHAT_REQUEST_BYTES)), false);
  assert.equal(isOversizedContentLength(String(MAX_CHAT_REQUEST_BYTES + 1)), true);
  assert.equal(isOversizedContentLength('invalid'), true);
});

test('streamed JSON is parsed and oversized chunked requests are rejected', async () => {
  const normal = new Request('https://alhajikallon.com/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: 'Hello' }),
  });
  assert.deepEqual(await readChatJson(normal), { message: 'Hello' });

  const huge = new Request('https://alhajikallon.com/api/chat', {
    method: 'POST',
    body: 'x'.repeat(MAX_CHAT_REQUEST_BYTES + 1),
  });
  await assert.rejects(readChatJson(huge), ChatBodyTooLargeError);
});
