/** Local teaching fixture. Node 22+. Not a production API or authentication system.
 * Run: node protocol-lab.mjs ; stop: Ctrl+C. All data resets on restart.
 * Binds only to loopback. Uses deliberately public demo tokens; never add secrets.
 */
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export function createProtocolLab() {
  const galleries = [{ id: 'gallery-a', studio: 'studio-a', title: 'Augusta’s portrait session' }];
  const operations = new Map();
  return createServer(async (req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const requestId = randomUUID();
    res.setHeader('X-Request-ID', requestId);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const json = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
    res.on('finish', () => console.log(JSON.stringify({ requestId, method: req.method, path: url.pathname, status: res.statusCode })));
    // Browser preflight fixture: only our explicit, fictional local frontend origin.
    const origin = req.headers.origin;
    if (origin === 'http://localhost:3000') { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin'); }
    if (req.method === 'OPTIONS') {
      if (origin !== 'http://localhost:3000') return json(403, { error: 'origin_not_allowed' });
      res.writeHead(204, { 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key' }); return res.end();
    }
    if (url.pathname === '/catalog' && req.method === 'GET') {
      res.setHeader('Cache-Control', 'public, max-age=30'); res.setHeader('ETag', '"catalog-v1"');
      if (req.headers['if-none-match'] === '"catalog-v1"') { res.writeHead(304); return res.end(); }
      return json(200, [{ id: 'public-demo', title: 'Public sample gallery' }]);
    }
    if (url.pathname === '/failure') return json(503, { error: 'simulated_outage', requestId });
    if (!['/events', '/galleries'].includes(url.pathname) && !url.pathname.startsWith('/galleries/')) return json(404, { error: 'not_found' });
    const studio = req.headers.authorization?.replace(/^Bearer /, '');
    if (!['studio-a', 'studio-b'].includes(studio)) return json(401, { error: 'demo_token_required' });
    if (url.pathname === '/events' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store' });
      let id = 0;
      const timer = setInterval(() => {
        res.write(`id: ${++id}\nevent: progress\ndata: ${JSON.stringify({ completed: id, total: 3 })}\n\n`);
        if (id === 3) { clearInterval(timer); res.end(); }
      }, 300);
      res.on('close', () => clearInterval(timer)); return;
    }
    if (url.pathname === '/galleries' && req.method === 'GET') return json(200, galleries.filter(g => g.studio === studio));
    if (url.pathname.startsWith('/galleries/') && req.method === 'GET') {
      const gallery = galleries.find(g => g.id === url.pathname.split('/')[2] && g.studio === studio);
      return gallery ? json(200, gallery) : json(404, { error: 'not_found' });
    }
    if (url.pathname === '/galleries' && req.method === 'POST') {
      if (!req.headers['content-type']?.startsWith('application/json')) return json(415, { error: 'json_required' });
      let raw = '';
      try { for await (const chunk of req) { raw += chunk; if (Buffer.byteLength(raw) > 2048) return json(413, { error: 'too_large' }); } } catch { return; }
      let body; try { body = JSON.parse(raw); } catch { return json(400, { error: 'invalid_json' }); }
      if (!body || typeof body.title !== 'string' || !body.title.trim() || body.title.length > 100) return json(400, { error: 'title_required' });
      const key = req.headers['idempotency-key'];
      if (typeof key !== 'string' || !key || key.length > 100) return json(400, { error: 'idempotency_key_required' });
      const scope = `${studio}:${key}`; const title = body.title.trim();
      const previous = operations.get(scope);
      if (previous) return previous.title === title ? json(200, previous) : json(409, { error: 'key_reused_with_different_request' });
      if (galleries.length >= 200) return json(429, { error: 'restart_lab_to_reset' });
      const gallery = { id: randomUUID(), studio, title };
      galleries.push(gallery); operations.set(scope, gallery);
      // Deliberately commit before delaying the reply. Use to study ambiguous outcomes.
      if (url.searchParams.get('delay') === '1500') await new Promise(resolve => setTimeout(resolve, 1500));
      res.setHeader('Location', `/galleries/${gallery.id}`); return json(201, gallery);
    }
    json(404, { error: 'not_found' });
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createProtocolLab().listen(4310, '127.0.0.1', () => console.log('Protocol lab: http://127.0.0.1:4310 — Ctrl+C to stop. Teaching fixtures only.'));
}
