import assert from 'node:assert/strict';
import test from 'node:test';

const ORIGIN = 'https://alhajikallon.com';
const pages = ['/', '/about', '/work', '/writing', '/knowledge', '/faq', '/contact', '/privacy'];

for (const route of pages) {
  test(`live public page ${route} responds with HTML`, { timeout: 35_000 }, async () => {
    const url = ORIGIN + route.replace(/^\/$/, '/');
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'User-Agent': 'alhajikallon-production-smoke/1.0' },
          redirect: 'follow',
          signal: AbortSignal.timeout(8000),
        });
        assert.equal(response.status, 200, `HTTP ${response.status} at ${url}`);
        assert.match(response.headers.get('content-type') || '', /text\/html/i);
        const html = await response.text();
        assert.match(html, /<html[\s>]/i, `No HTML shell at ${route}`);
        assert.match(html, /<title[\s>]/i, `No page title at ${route}`);
        assert.ok(html.length > 800, `Suspiciously small page at ${route}`);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
    throw lastError;
  });
}

for (const route of ['/api/contact', '/api/chat']) {
  test(`live server handler ${route} rejects GET without sending anything`, { timeout: 35_000 }, async () => {
    const response = await fetch(ORIGIN + route, {
      method: 'GET',
      redirect: 'manual',
      headers: { 'User-Agent': 'alhajikallon-production-smoke/1.0' },
      signal: AbortSignal.timeout(10_000),
    });
    assert.equal(response.status, 405, `Expected 405 Method Not Allowed at ${route}; got ${response.status}`);
  });
}

test('live FAQ chat uses the production quota store without an AI provider call', { timeout: 20_000 }, async () => {
  // One known FAQ prompt per manually requested smoke run; it should be answered
  // locally *after* quota reservation, with no OpenAI usage and no visitor PII.
  const response = await fetch(ORIGIN + '/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: ORIGIN,
      'User-Agent': 'alhajikallon-production-smoke/1.0',
    },
    body: JSON.stringify({ message: 'Show me his case studies', history: [] }),
    signal: AbortSignal.timeout(12_000),
  });
  assert.equal(response.status, 200, `FAQ chat expected HTTP 200, got ${response.status}; check Upstash binding and Worker logs`);
  const result = await response.json();
  assert.ok(typeof result.reply === 'string' && result.reply.includes('AEEM'), 'Expected published case-study FAQ answer');
});

test('live contact endpoint rejects a deliberately invalid Turnstile token', { timeout: 20_000 }, async () => {
  // Negative-only test: a fabricated token can never authorize sending email.
  // 422 means the handler reached Siteverify; 503 can indicate missing runtime
  // configuration or an unavailable verification provider.
  const response = await fetch(ORIGIN + '/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: ORIGIN,
      'User-Agent': 'alhajikallon-production-smoke/1.0',
    },
    body: JSON.stringify({
      name: 'Smoke Test',
      email: 'no-reply-smoke@example.invalid',
      message: 'Please reject this test; its Turnstile token is deliberately invalid.',
      intent: 'Something else',
      website: '',
      turnstileToken: 'invalid-test-token-do-not-accept',
    }),
    signal: AbortSignal.timeout(12_000),
  });
  const result = await response.json().catch(() => ({}));
  const diagnostic = [
    'The contact service is unavailable.',
    'Verification is temporarily unavailable.',
    'Verification expired or failed. Please retry.',
  ].includes(result.error) ? result.error : 'Unexpected error response (redacted)';
  assert.equal(response.status, 422,
    `Invalid Turnstile token expected HTTP 422, got ${response.status}; safe server diagnostic: ${diagnostic}`);
  assert.match(result.error || '', /verification/i);
});
