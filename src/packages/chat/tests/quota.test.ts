import test from 'node:test';
import assert from 'node:assert/strict';
import { createRedisQuotaStore } from '../server';

const signal = new AbortController().signal;
test('Redis adapter uses a single authenticated atomic command and forwards cancellation', async () => {
  const store = createRedisQuotaStore({
    url: 'https://redis.example',
    token: 'test-token',
    fetcher: async (url, options) => {
      assert.equal(String(url), 'https://redis.example/');
      assert.equal(options?.signal, signal);
      assert.equal(options?.cache, 'no-store');
      assert.equal(new Headers(options?.headers).get('authorization'), 'Bearer test-token');
      const [command, lua, numberOfKeys, ...args] = JSON.parse(String(options?.body));
      assert.equal(command, 'EVAL');
      assert.equal(numberOfKeys, '1');
      assert.match(lua, /redis.call\('INCR'/);
      assert.deepEqual(args, ['site:ai', '300', '86400']);
      return Response.json({ result: [0, 42] });
    },
  });
  assert.deepEqual(await store.consume('site:ai', 300, 86400, signal), {
    allowed: false,
    retryAfterSeconds: 42,
  });
});

test('Redis storage errors and malformed replies fail closed', async () => {
  for (const payload of [
    { error: 'offline' },
    { result: [true, 0] },
    { result: [1, -2] },
    { result: [1] },
    { result: [0, '42'] },
  ]) {
    const store = createRedisQuotaStore({
      url: 'https://redis.example',
      token: 'test',
      fetcher: async () => Response.json(payload),
    });
    await assert.rejects(store.consume('key', 1, 60, signal));
  }
  const store = createRedisQuotaStore({
    url: 'https://redis.example',
    token: 'test',
    fetcher: async () => new Response('', { status: 503 }),
  });
  await assert.rejects(store.consume('key', 1, 60, signal));
  assert.throws(
    () => createRedisQuotaStore({ url: 'http://redis.example', token: 'test' }),
    /HTTPS/,
  );
});
