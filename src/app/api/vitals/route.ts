import { NextRequest, NextResponse } from 'next/server';
import { MAX_VITAL_BYTES, parseAnonymousVital, readSmallVitalJson } from '@/lib/anonymous-vitals.mjs';

export const runtime = 'nodejs';
const NO_STORE = { 'Cache-Control': 'no-store' };

export async function POST(request: NextRequest) {
  if (process.env.WEB_VITALS_ENABLED !== '1') {
    return new NextResponse(null, { status: 404, headers: NO_STORE });
  }

  // Origin check is a browser spam barrier, not authentication.
  const origin = request.headers.get('origin');
  const fetchSite = request.headers.get('sec-fetch-site');
  const host = request.headers.get('host');
  let sameOrigin = false;
  if (origin && host) {
    try {
      const parsed = new URL(origin);
      const local = host === 'localhost:3001' || host === '127.0.0.1:3001' ||
        host === 'localhost:3000' || host === '127.0.0.1:3000';
      sameOrigin = parsed.origin === origin && parsed.host === host &&
        (parsed.protocol === 'https:' || (local && parsed.protocol === 'http:'));
    } catch {
      sameOrigin = false;
    }
  }
  // Request URL reconstruction can use a different internal hostname behind a proxy.
  // Compare browser Origin with the public Host header instead, and require HTTPS
  // except for local development/test servers. This is still not authentication.
  if (!sameOrigin || (fetchSite && fetchSite !== 'same-origin')) {
    return new NextResponse(null, { status: 403, headers: NO_STORE });
  }
  if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get('content-type') ?? '')) {
    return new NextResponse(null, { status: 415, headers: NO_STORE });
  }

  const length = request.headers.get('content-length');
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_VITAL_BYTES)) {
    return new NextResponse(null, { status: 413, headers: NO_STORE });
  }

  let input: unknown;
  try {
    input = await readSmallVitalJson(request);
  } catch (error) {
    return new NextResponse(null, {
      status: error instanceof RangeError ? 413 : 400,
      headers: NO_STORE,
    });
  }
  const vital = parseAnonymousVital(input);
  if (!vital) return new NextResponse(null, { status: 400, headers: NO_STORE });

  // No request, IP, user-agent, full URL, query string, cookie or metric ID in application logs.
  console.info('anonymous-web-vital', JSON.stringify(vital));
  return new NextResponse(null, { status: 204, headers: NO_STORE });
}
