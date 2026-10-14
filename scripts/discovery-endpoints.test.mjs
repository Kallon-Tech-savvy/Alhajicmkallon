import test from 'node:test';
import assert from 'node:assert/strict';

const baseUrl = process.env.SITE_URL ?? 'http://127.0.0.1:3000';

async function get(path) {
  const response = await fetch(new URL(path, baseUrl));
  assert.equal(response.status, 200, `Expected ${path} to return HTTP 200`);
  return { response, body: await response.text() };
}

test('robots and sitemap expose the public crawl paths', async () => {
  const [{ body: robots }, { body: sitemap, response: sitemapResponse }] = await Promise.all([
    get('/robots.txt'),
    get('/sitemap.xml'),
  ]);

  assert.match(robots, /User-Agent:\s*\*/i);
  assert.match(robots, /Allow:\s*\//i);
  assert.match(robots, /Disallow:\s*\/api\//i);
  assert.match(robots, /Sitemap:\s*https:\/\/alhajicmkallon\.vercel\.app\/sitemap\.xml/i);
  assert.match(sitemapResponse.headers.get('content-type') ?? '', /application\/xml|text\/xml/i);
  for (const route of ['/about', '/work', '/writing', '/knowledge', '/contact']) {
    assert.ok(sitemap.includes(`https://alhajicmkallon.vercel.app${route}`), `Sitemap missing ${route}`);
  }
});

test('AI discovery index points to canonical content and the full-text feed', async () => {
  const { response, body } = await get('/llms.txt');
  assert.match(response.headers.get('content-type') ?? '', /text\/plain/i);
  assert.match(body, /Alhaji C\. M\. Kallon/);
  assert.match(body, /https:\/\/alhajicmkallon\.vercel\.app\/llms-full\.txt/);
  assert.match(body, /https:\/\/alhajicmkallon\.vercel\.app\/sitemap\.xml/);
  assert.match(body, /Published project case studies/);
  assert.match(body, /Published writing/);
  assert.match(body, /Published knowledge notes/);
  assert.match(body, /do not infer client results, metrics, credentials, or impact/i);
});

test('full AI feed includes canonical links and attribution guidance', async () => {
  const { response, body } = await get('/llms-full.txt');
  assert.match(response.headers.get('content-type') ?? '', /text\/plain/i);
  assert.match(body, /full published content/i);
  assert.match(body, /Canonical homepage:/);
  assert.match(body, /Evidence and attribution guidance/);
  assert.match(body, /Use canonical page URLs when citing or linking to content/);
});
