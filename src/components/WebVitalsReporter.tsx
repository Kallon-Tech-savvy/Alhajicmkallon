'use client';

import { useReportWebVitals } from 'next/web-vitals';

// No cookies, fingerprints or persistent IDs. Sample independently per page load.
const SAMPLE_RATE = 0.2;
const included = Math.random() < SAMPLE_RATE;
const metrics = new Set(['LCP', 'CLS', 'INP', 'FCP', 'TTFB']);
const lastValues = new Map<string, number>();

function pageCategory(pathname: string) {
  if (pathname === '/') return 'home';
  const section = pathname.split('/')[1];
  return ['work', 'writing', 'knowledge', 'about', 'contact', 'faq'].includes(section)
    ? section : 'other';
}

function reportVital(metric: { name: string; value: number; id: string }) {
  if (!included || !metrics.has(metric.name) || !Number.isFinite(metric.value)) return;
  const privacy = navigator as Navigator & { globalPrivacyControl?: boolean; doNotTrack?: string | null };
  if (privacy.globalPrivacyControl === true || privacy.doNotTrack === '1') return;

  // A Next metric may be updated; ignore exact duplicates without sending its ID.
  const key = metric.id + ':' + metric.name;
  if (lastValues.get(key) === metric.value) return;
  lastValues.set(key, metric.value);

  const body = JSON.stringify({
    name: metric.name,
    value: metric.name === 'CLS'
      ? Math.round(metric.value * 1000) / 1000
      : Math.round(metric.value),
    section: pageCategory(window.location.pathname),
    viewport: window.matchMedia('(max-width: 767px)').matches ? 'small' : 'large',
  });

  try {
    // Unlike sendBeacon, fetch lets us explicitly omit cookies and full referrers.
    void fetch('/api/vitals', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    }).catch(() => {});
  } catch {
    // Measurement must never disrupt rendering or navigation.
  }
}

/** Optional isolated client island, mounted only when enabled server-side. */
export function WebVitalsReporter() {
  useReportWebVitals(reportVital);
  return null;
}
