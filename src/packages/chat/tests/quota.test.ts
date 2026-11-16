import test from 'node:test';
import assert from 'node:assert/strict';
import { ChatQuotaError, createRedisQuotaStore } from '../server';

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
    /quota_configuration/,
  );
});

test('quota diagnostics distinguish faults without retaining upstream secrets', async () => {
  for (const [fetcher, code, status] of [
    [
      async () => {
        throw new Error('secret upstream details');
      },
      'quota_network',
      undefined,
    ],
    [async () => new Response('secret response', { status: 401 }), 'quota_http', 401],
    [async () => new Response('not json'), 'quota_response', undefined],
  ] as const) {
    const store = createRedisQuotaStore({
      url: 'https://redis.example',
      token: 'secret-token',
      fetcher,
    });
    await assert.rejects(store.consume('visitor-key', 5, 60, signal), (error: unknown) => {
      assert.ok(error instanceof ChatQuotaError);
      assert.equal(error.code, code);
      assert.equal(error.status, status);
      assert.doesNotMatch(JSON.stringify(error), /secret|visitor|redis.example/);
      return true;
    });
  }
});
