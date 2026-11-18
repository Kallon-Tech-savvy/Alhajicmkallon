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
