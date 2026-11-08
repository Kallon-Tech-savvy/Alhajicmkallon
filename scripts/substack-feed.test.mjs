import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSubstackFeed, loadSubstackFeed } from '../src/lib/substack-feed.mjs';
const rss = items => `<rss><channel><title>Alhaji</title>${items}</channel></rss>`;
const item = (title, link, date = 'Mon, 02 Nov 2026 12:00:00 GMT') => `<item><title><![CDATA[${title}]]></title><link>${link}</link><description><![CDATA[<p>A useful essay.</p>]]></description><pubDate>${date}</pubDate></item>`;

test('returns bounded plain-text summaries, valid dates and publication-only links', () => {
  const posts = parseSubstackFeed(rss(item('<b>My essay</b>', 'https://alhajicmkallon.substack.com/p/essay?source=rss')));
  assert.deepEqual(posts, [{ title:'My essay', href:'https://alhajicmkallon.substack.com/p/essay', excerpt:'A useful essay.', date:'2026-11-02T12:00:00.000Z' }]);
});
test('drops external, executable and credential-bearing links and deduplicates', () => {
  const posts = parseSubstackFeed(rss(item('Unsafe', 'javascript:alert(1)') + item('External', 'https://example.com/p/a') + item('Credentials', 'https://user:pass@alhajicmkallon.substack.com/p/a') + item('Valid', 'https://alhajicmkallon.substack.com/p/a') + item('Duplicate', 'https://alhajicmkallon.substack.com/p/a')));
  assert.equal(posts.length, 1);
  assert.equal(posts[0].title, 'Valid');
});
test('sorts newest first, limits to six and tolerates missing dates', () => {
  const posts = parseSubstackFeed(rss(Array.from({length:10}, (_,i) => item(`Post ${i}`, `https://alhajicmkallon.substack.com/p/${i}`, `2026-11-${String(i+1).padStart(2,'0')}`)).join('')));
  assert.equal(posts.length, 6); assert.equal(posts[0].title, 'Post 9');
  assert.equal(parseSubstackFeed(rss(item('No date', 'https://alhajicmkallon.substack.com/p/a', 'unknown')))[0].date, null);
});
test('rejects HTML error pages, declarations and excessive responses', () => {
  assert.throws(() => parseSubstackFeed('<html>Site Unavailable</html>'));
  assert.throws(() => parseSubstackFeed('<!DOCTYPE rss [<!ENTITY x "unsafe">]><rss/>'));
  assert.throws(() => parseSubstackFeed('x'.repeat(2*1024*1024+1)));
});
test('feed failures preserve an explicit fallback instead of breaking Writing', async () => {
  for (const fetcher of [async()=>{throw Error('network');}, async()=>new Response('unavailable',{status:503}), async()=>new Response('<html>Site Unavailable</html>')]) {
    assert.deepEqual(await loadSubstackFeed(fetcher), {posts:[], available:false});
  }
});
test('fetch uses a fixed source, timeout, redirect rejection and revalidation', async () => {
  const result = await loadSubstackFeed(async (url, options) => {
    assert.equal(url, 'https://alhajicmkallon.substack.com/feed');
    assert.equal(options.redirect, 'error'); assert.equal(options.next.revalidate,1800); assert.ok(options.signal);
    return new Response(rss(item('Essay','https://alhajicmkallon.substack.com/p/essay')));
  });
  assert.equal(result.available,true); assert.equal(result.posts.length,1);
});
