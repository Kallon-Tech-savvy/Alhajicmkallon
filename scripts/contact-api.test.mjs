import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SENDER_PROFILES, CONTACT_INTENTS, buildNotification, buildReceipt,
  createContactHandler, escapeEmailHtml, parseContactInput,
} from '../src/lib/contact-email.mjs';

const env = {
  NODE_ENV: 'production',
  RESEND_API_KEY: 'test-key-not-real',
  CONTACT_TO_EMAIL: 'owner@example.net',
  CONTACT_DEV_TO_EMAIL: 'developer@example.net',
  TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
};
const valid = {
  name: 'Aminata Conteh',
  email: 'aminata@example.com',
  message: 'I want to improve our online booking process.',
  intent: 'Improve a product',
  website: '',
  turnstileToken: 'test-verification-token',
};

function request(body = valid, headers = {}) {
  return new Request('https://alhajikallon.com/api/contact', {
    method: 'POST',
    headers: { origin: 'https://alhajikallon.com', 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
function fakeProvider({ captcha = { success: true, hostname: 'alhajikallon.com' }, emailStatus = 200 } = {}) {
  const sends = [];
  const fetcher = async (url, options) => {
    if (url.includes('siteverify')) return Response.json(captcha);
    if (url === 'https://api.resend.com/emails') {
      sends.push(JSON.parse(options.body));
      return Response.json(emailStatus === 200 ? { id: 'test-id' } : { error: 'Provider rejected' }, { status: emailStatus });
    }
    throw new Error('Unexpected URL ' + url);
  };
  return { sends, fetcher };
}

test('five verified-domain sender identities have unique labels and footer notes', () => {
  assert.deepEqual(Object.keys(SENDER_PROFILES), ['noreply', 'dev', 'cm', 'info', 'contact']);
  for (const profile of Object.values(SENDER_PROFILES)) {
    assert.match(profile.address, /@alhajikallon\.com$/);
    assert.ok(profile.label && profile.signoff && profile.note);
  }
});

test('rejects invalid topics, injected headers, malformed email and honeypot', () => {
  assert.equal(CONTACT_INTENTS.length, 4);
  assert.equal(parseContactInput({ ...valid, intent: 'Unauthorized category' }), null);
  assert.equal(parseContactInput({ ...valid, name: 'Aminata\nBcc: hidden' }), null);
  assert.equal(parseContactInput({ ...valid, email: 'user@example.com\nCc: another@example.com' }), null);
  assert.equal(parseContactInput({ ...valid, website: 'bot.example' }), null);
  assert.equal(parseContactInput({ ...valid, message: 'short' }), null);
  assert.equal(parseContactInput({ ...valid, turnstileToken: '' }), null);
});

test('HTML escapes user content; the plaintext copy preserves the original text', () => {
  assert.equal(escapeEmailHtml('<script>&"'), '&lt;script&gt;&amp;&quot;');
  const notification = buildNotification({ ...valid, name: 'Aminata <Admin>', message: 'Hello <script>alert(1)</script>\nSecond line' });
  assert.ok(notification.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;<br>Second line'));
  assert.ok(notification.text.includes('<script>alert(1)</script>\nSecond line'));
  assert.ok(!notification.html.includes('<script>alert(1)</script>'));
  assert.equal(notification.reply_to, valid.email);
  assert.match(buildReceipt(valid).text, /automated message/i);
});

test('blocks cross-origin and non-JSON requests before network calls', async () => {
  const api = fakeProvider();
  const handler = createContactHandler({ getEnv: () => env, fetcher: api.fetcher });
  assert.equal((await handler(request(valid, { origin: 'https://attacker.example' }))).status, 403);
  assert.equal((await handler(request(valid, { 'Content-Type': 'text/plain' }))).status, 415);
  assert.equal(api.sends.length, 0);
});

test('blocks oversized and invalid request content', async () => {
  const handler = createContactHandler({ getEnv: () => env, fetcher: fakeProvider().fetcher });
  assert.equal((await handler(request('x'.repeat(17_000)))).status, 413);
  assert.equal((await handler(request({ ...valid, website: 'filled' }))).status, 422);
  assert.equal((await handler(request('{bad-json'))).status, 400);
});

test('missing secrets fail closed and send no email', async () => {
  const api = fakeProvider();
  const handler = createContactHandler({
    getEnv: () => ({ ...env, TURNSTILE_SECRET_KEY: undefined }),
    fetcher: api.fetcher,
  });
  assert.equal((await handler(request())).status, 503);
  assert.equal(api.sends.length, 0);
});

test('invalid Turnstile response or hostname prevents delivery', async () => {
  for (const captcha of [
    { success: false, hostname: 'alhajikallon.com' },
    { success: true, hostname: 'attacker.example' },
  ]) {
    const api = fakeProvider({ captcha });
    const handler = createContactHandler({ getEnv: () => env, fetcher: api.fetcher });
    assert.equal((await handler(request())).status, 422);
    assert.equal(api.sends.length, 0);
  }
});

test('valid enquiry sends only to configured development inbox, never visitor-controlled recipients', async () => {
  const api = fakeProvider();
  const handler = createContactHandler({ getEnv: () => env, fetcher: api.fetcher });
  const response = await handler(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(api.sends.length, 1);
  assert.deepEqual(api.sends[0].to, [env.CONTACT_DEV_TO_EMAIL]);
  assert.equal(api.sends[0].reply_to, valid.email);
  assert.equal(api.sends[0].from, 'Alhaji C M Kallon <contact@alhajikallon.com>');
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('general enquiries go to the primary configured inbox', async () => {
  const api = fakeProvider();
  const handler = createContactHandler({ getEnv: () => env, fetcher: api.fetcher });
  assert.equal((await handler(request({ ...valid, intent: 'Clarify an idea' }))).status, 200);
  assert.deepEqual(api.sends[0].to, [env.CONTACT_TO_EMAIL]);
});

test('optional automated receipt uses noreply identity only after primary submission succeeds', async () => {
  const api = fakeProvider();
  const handler = createContactHandler({
    getEnv: () => ({ ...env, CONTACT_CONFIRMATION_ENABLED: '1' }),
    fetcher: api.fetcher,
  });
  assert.equal((await handler(request())).status, 200);
  assert.equal(api.sends.length, 2);
  assert.equal(api.sends[1].from, 'Alhaji C M Kallon <noreply@alhajikallon.com>');
  assert.deepEqual(api.sends[1].to, [valid.email]);
  assert.ok(!api.sends[1].text.includes(valid.message));
});

test('Resend rejects send: endpoint reports failure rather than falsely claiming delivery', async () => {
  const api = fakeProvider({ emailStatus: 403 });
  const handler = createContactHandler({ getEnv: () => env, fetcher: api.fetcher, logger: { warn() {} } });
  const response = await handler(request());
  assert.equal(response.status, 502);
  assert.equal((await response.json()).ok, undefined);
});
