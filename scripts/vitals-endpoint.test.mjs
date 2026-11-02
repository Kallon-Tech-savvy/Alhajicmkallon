import test from 'node:test';
import assert from 'node:assert/strict';

const baseUrl = process.env.VITALS_TEST_URL ?? 'http://127.0.0.1:3001';
const vital = { name: 'LCP', value: 900, section: 'home', viewport: 'small' };

function post(payload, { origin = baseUrl, headers = {} } = {}) {
  return fetch(new URL('/api/vitals', baseUrl), {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
  });
}

test('opt-in production collector accepts a valid anonymous metric', async () => {
  const res = await post(vital);
  assert.equal(res.status, 204);
  assert.match(res.headers.get('cache-control') ?? '', /no-store/);
  assert.equal(await res.text(), '');
});

test('origin, browser fetch metadata and content type are checked', async () => {
  assert.equal((await post(vital, { origin: 'https://attacker.example' })).status, 403);
  assert.equal((await post(vital, { headers: { 'Sec-Fetch-Site': 'cross-site' } })).status, 403);
  assert.equal((await post(vital, { headers: { 'Content-Type': 'text/plain' } })).status, 415);
});

test('rejects unbounded and identifying payloads', async () => {
  assert.equal((await post({ ...vital, id: 'visitor-123' })).status, 400);
  assert.equal((await post({ ...vital, section: '/work/private?token=secret' })).status, 400);
  assert.equal((await post('{broken')).status, 400);
  assert.equal((await post({ ...vital, padding: 'x'.repeat(500) })).status, 413);
});
