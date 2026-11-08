import { XMLParser } from 'fast-xml-parser';

export const PUBLICATION_URL = 'https://alhajicmkallon.substack.com';
const MAX_FEED_BYTES = 2 * 1024 * 1024;

function text(value) {
  if (typeof value !== 'string') return '';
  // Return plain text only; feed HTML is never rendered into the document.
  return value.replace(/<[^>]*>/g, ' ').replace(/&(?:nbsp|amp|quot|apos|lt|gt);/g, entity => ({'&nbsp;':' ', '&amp;':'&', '&quot;':'"', '&apos;':"'", '&lt;':'<', '&gt;':'>'})[entity]).replace(/\s+/g, ' ').trim();
}

export function parseSubstackFeed(xml) {
  if (new TextEncoder().encode(xml).byteLength > MAX_FEED_BYTES || /<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('Unsupported feed');
  const data = new XMLParser({ ignoreAttributes: true, processEntities: false, parseTagValue: false }).parse(xml);
  const channel = data?.rss?.channel;
  if (!channel || typeof channel !== 'object') throw new Error('Not an RSS feed');
  const items = channel.item ? (Array.isArray(channel.item) ? channel.item : [channel.item]) : [];
  const seen = new Set();
  return items.flatMap(item => {
    try {
      const url = new URL(item.link);
      const title = text(item.title).slice(0, 220);
      if (url.origin !== PUBLICATION_URL || !url.pathname.startsWith('/p/') || url.username || url.password || !title) return [];
      url.hash = ''; url.search = '';
      const href = url.href;
      if (seen.has(href)) return [];
      seen.add(href);
      const timestamp = Date.parse(item.pubDate);
      return [{ title, href, excerpt: text(item.description).slice(0, 240), date: Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null }];
    } catch { return []; }
  }).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).slice(0, 6);
}

export async function loadSubstackFeed(fetcher = fetch) {
  try {
    const response = await fetcher(`${PUBLICATION_URL}/feed`, {
      headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
      redirect: 'error', signal: AbortSignal.timeout(5000), next: { revalidate: 1800 },
    });
    if (!response.ok || !response.body) throw new Error('Feed unavailable');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let bytes = 0, xml = '';
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_FEED_BYTES) { await reader.cancel(); throw new Error('Feed too large'); }
        xml += decoder.decode(value, { stream: true });
      }
      xml += decoder.decode();
    } finally { reader.releaseLock(); }
    return { posts: parseSubstackFeed(xml), available: true };
  } catch { return { posts: [], available: false }; }
}
