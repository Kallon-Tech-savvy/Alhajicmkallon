import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { useChatConversation } from '../client';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
Object.defineProperties(globalThis, {
  window: { value: dom.window, configurable: true },
  document: { value: dom.window.document, configurable: true },
  navigator: { value: dom.window.navigator, configurable: true },
  IS_REACT_ACT_ENVIRONMENT: { value: true, writable: true, configurable: true },
});
const { act, cleanup, renderHook } = await import('@testing-library/react');
afterEach(cleanup);

test('successful conversation sends bounded prior history and can be cleared', async () => {
  const bodies: Array<{ history: unknown[] }> = [];
  const fetcher: typeof fetch = async (_, options) => {
    bodies.push(JSON.parse(String(options?.body)));
    return Response.json({ reply: 'A useful reply' });
  };
  const { result } = renderHook(() => useChatConversation({ fetcher }));
  for (let i = 0; i < 8; i++) await act(async () => result.current.sendMessage(`Question ${i}`));
  assert.equal(bodies[0].history.length, 0);
  assert.equal(bodies[7].history.length, 12);
  assert.equal(result.current.messages.length, 16);
  assert.equal(result.current.loading, false);
  act(() => result.current.clearConversation());
  assert.deepEqual(result.current.messages, []);
  assert.equal(result.current.input, '');
});

test('failed requests restore the question; retry adds one user turn and one reply', async () => {
  let calls = 0;
  const fetcher: typeof fetch = async () =>
    ++calls === 1 ? new Response('', { status: 503 }) : Response.json({ reply: 'Recovered' });
  const { result } = renderHook(() => useChatConversation({ fetcher }));
  await act(async () => result.current.sendMessage(' My question '));
  assert.equal(result.current.input, 'My question');
  assert.equal(result.current.retry, 'My question');
  assert.deepEqual(result.current.messages, []);
  await act(async () => result.current.sendMessage(result.current.retry!));
  assert.deepEqual(result.current.messages, [
    { role: 'user', content: 'My question' },
    { role: 'assistant', content: 'Recovered' },
  ]);
  assert.equal(result.current.retry, null);
  assert.equal(result.current.error, null);
});

test('double sends are ignored while a request is pending', async () => {
  let resolve!: (value: Response) => void;
  let calls = 0;
  const fetcher: typeof fetch = () => {
    calls++;
    return new Promise((done) => {
      resolve = done;
    });
  };
  const { result } = renderHook(() => useChatConversation({ fetcher }));
  let pending!: Promise<void>;
  act(() => {
    pending = result.current.sendMessage('Question');
  });
  assert.equal(result.current.loading, true);
  await act(async () => result.current.sendMessage('Duplicate'));
  assert.equal(calls, 1);
  await act(async () => {
    resolve(Response.json({ reply: 'Done' }));
    await pending;
  });
  assert.equal(result.current.messages.length, 2);
});

function abortingFetch(onSignal: (signal: AbortSignal) => void): typeof fetch {
  return async (_, options) =>
    new Promise((_, reject) => {
      const signal = options!.signal!;
      onSignal(signal);
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), {
        once: true,
      });
    });
}

test('stopping a reply preserves input and allows retry', async () => {
  let signal!: AbortSignal;
  const fetcher = abortingFetch((value) => {
    signal = value;
  });
  const { result } = renderHook(() => useChatConversation({ fetcher }));
  let pending!: Promise<void>;
  act(() => {
    pending = result.current.sendMessage('Keep this question');
  });
  await act(async () => {
    result.current.stop();
    await pending;
  });
  assert.equal(signal.aborted, true);
  assert.equal(result.current.input, 'Keep this question');
  assert.match(result.current.error!, /Reply stopped/);
  assert.equal(result.current.loading, false);
});

test('the client deadline aborts transport and restores the question', async () => {
  const fetcher = abortingFetch(() => {});
  const { result } = renderHook(() => useChatConversation({ fetcher, timeoutMs: 15 }));
  await act(async () => result.current.sendMessage('Slow question'));
  assert.match(result.current.error!, /too long/);
  assert.equal(result.current.input, 'Slow question');
});

test('unmount aborts transport', async () => {
  let signal!: AbortSignal;
  const fetcher = abortingFetch((value) => {
    signal = value;
  });
  const { result, unmount } = renderHook(() => useChatConversation({ fetcher }));
  let pending!: Promise<void>;
  act(() => {
    pending = result.current.sendMessage('Pending question');
  });
  unmount();
  await pending;
  assert.equal(signal.aborted, true);
});

test('editing a failed question clears its obsolete retry action', async () => {
  const { result } = renderHook(() =>
    useChatConversation({ fetcher: async () => new Response('', { status: 429 }) }),
  );
  await act(async () => result.current.sendMessage('Question'));
  assert.match(result.current.error!, /Too many/);
  act(() => result.current.setInput('A different question'));
  assert.equal(result.current.retry, null);
});
