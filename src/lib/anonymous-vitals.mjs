export const MAX_VITAL_BYTES = 256;
const METRIC_NAMES = new Set(['LCP', 'CLS', 'INP', 'FCP', 'TTFB']);
const SECTIONS = new Set(['home', 'work', 'writing', 'knowledge', 'about', 'contact', 'faq', 'other']);
const VIEWPORTS = new Set(['small', 'large']);

/** Accept only coarse non-identifying fields, never arbitrary URLs or metric IDs. */
export function parseAnonymousVital(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  if (Object.keys(input).sort().join(',') !== 'name,section,value,viewport') return null;
  const { name, value, section, viewport } = input;
  if (!METRIC_NAMES.has(name) || !SECTIONS.has(section) || !VIEWPORTS.has(viewport)) return null;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return null;
  if (name === 'CLS' && value > 1) return null;
  if (name !== 'CLS' && value > 120_000) return null;
  return { name, value, section, viewport };
}

/** Reject unbounded/chunked input without buffering the full request. */
export async function readSmallVitalJson(request) {
  if (!request.body) throw new SyntaxError('Missing body');
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let count = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      count += value.byteLength;
      if (count > MAX_VITAL_BYTES) {
        await reader.cancel();
        throw new RangeError('Payload exceeds limit');
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally {
    reader.releaseLock();
  }
}
