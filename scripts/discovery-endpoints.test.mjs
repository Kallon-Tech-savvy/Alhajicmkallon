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
  assert.match(robots, /Sitemap:\s*https:\/\/alhajikallon\.com\/sitemap\.xml/i);
  assert.match(sitemapResponse.headers.get('content-type') ?? '', /application\/xml|text\/xml/i);
  for (const route of ['/about', '/work', '/writing', '/knowledge', '/faq', '/contact']) {
    assert.ok(sitemap.includes(`https://alhajikallon.com${route}`), `Sitemap missing ${route}`);
  }
});

test('AI discovery index points to canonical content and the full-text feed', async () => {
  const { response, body } = await get('/llms.txt');
  assert.match(response.headers.get('content-type') ?? '', /text\/plain/i);
  assert.match(body, /Alhaji C\. M\. Kallon/);
  assert.match(body, /https:\/\/alhajikallon\.com\/llms-full\.txt/);
  assert.match(body, /https:\/\/alhajikallon\.com\/sitemap\.xml/);
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

test('search endpoint returns public summaries but never complete content bodies', async () => {
  const { response, body } = await get('/api/search?q=aeem');
  assert.match(response.headers.get('content-type') ?? '', /application\/json/);
  assert.match(response.headers.get('cache-control') ?? '', /no-store/);
  const results = JSON.parse(body);
  assert.ok(results.projects.some((entry) => entry.href === '/work/aeem-digital-presence'));
  assert.equal(results.projects.length <= 8, true);
  assert.equal(results.articles.length <= 8, true);
  for (const result of [...results.projects, ...results.articles]) {
    assert.ok(Object.keys(result).every((key) => ['id','slug','title','summary','excerpt','href'].includes(key)));
    assert.ok(!('description' in result) && !('content' in result) && !('body' in result));
    assert.ok((result.summary ?? result.excerpt).length <= 220);
    assert.ok(result.href.startsWith('/') && !result.href.startsWith('//'));
  }
  assert.ok(body.length < 10_000, 'Search responses should stay small');
});

test('search ignores case, handles empty queries and rejects overlong input', async () => {
  const [upper, lower, empty, tooLong] = await Promise.all([
    get('/api/search?q=AEEM'),
    get('/api/search?q=aeem'),
    get('/api/search?q='),
    fetch(new URL('/api/search?q=' + 'x'.repeat(121), baseUrl)),
  ]);
  const upperResults = JSON.parse(upper.body);
  assert.deepEqual(upperResults, JSON.parse(lower.body));
  assert.deepEqual(JSON.parse(empty.body), { projects: [], articles: [] });
  assert.equal(tooLong.status, 400);
  assert.match(tooLong.headers.get('cache-control') ?? '', /no-store/);
});

test('anonymous web vitals collector is disabled unless explicitly configured', async () => {
  const response = await fetch(new URL('/api/vitals', baseUrl), {
    method: 'POST',
    headers: { Origin: baseUrl, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'LCP', value: 900, section: 'home', viewport: 'small' }),
  });
  const expected = process.env.WEB_VITALS_ENABLED === '1' ? 204 : 404;
  assert.equal(response.status, expected);
  assert.match(response.headers.get('cache-control') ?? '', /no-store/);
});
