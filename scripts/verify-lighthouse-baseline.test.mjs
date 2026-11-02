import test from 'node:test';
import assert from 'node:assert/strict';
import { assessLighthouseReports } from './verify-lighthouse-baseline.mjs';

function makeReport({ performance = 0.95, seo = 1, tbt = 100, lcp = 900, rsc = 0 } = {}) {
  return {
    categories: { performance: { score: performance }, seo: { score: seo } },
    audits: {
      'total-blocking-time': { numericValue: tbt },
      'largest-contentful-paint': { numericValue: lcp },
      'cumulative-layout-shift': { numericValue: 0 },
      'network-requests': { details: { items: rsc ? [
        { resourceType: 'Fetch', url: 'https://example.com/work?_rsc=abc', transferSize: 2700 },
      ] : [] } },
    },
  };
}

test('median budget tolerates one noisy run but reports its variance', () => {
  const result = assessLighthouseReports([
    makeReport({ performance: 0.77, tbt: 1020 }),
    makeReport({ performance: 0.92, tbt: 361 }),
    makeReport({ performance: 1, tbt: 70 }),
  ]);
  assert.equal(result.passed, true);
  assert.equal(result.medians.performance, 92);
  assert.deepEqual(result.medians.tbtMs, { min: 70, median: 361, max: 1020 });
  assert.equal(result.runs.length, 3);
});

test('fails if the median performance is below the accepted floor', () => {
  const result = assessLighthouseReports([
    makeReport({ performance: 0.77 }),
    makeReport({ performance: 0.79 }),
    makeReport({ performance: 0.99 }),
  ]);
  assert.equal(result.passed, false);
  assert.match(result.failures.join(' '), /80\/100 median/);
});

test('SEO must be 100 in every audit, even if the median is 100', () => {
  const result = assessLighthouseReports([
    makeReport(),
    makeReport({ seo: 0.98 }),
    makeReport(),
  ]);
  assert.equal(result.passed, false);
  assert.match(result.failures.join(' '), /Run 2: SEO/);
});

test('even one speculative route-data fetch fails the homepage baseline', () => {
  const result = assessLighthouseReports([makeReport(), makeReport({ rsc: 1 }), makeReport()]);
  assert.equal(result.passed, false);
  assert.equal(result.runs[1].routePrefetchBytes, 2700);
  assert.match(result.failures.join(' '), /Run 2: homepage/);
});

test('rejects missing reports, invalid scores and absent network detail', () => {
  assert.throws(() => assessLighthouseReports([makeReport()]), /exactly three/);
  assert.throws(() => assessLighthouseReports([
    makeReport(), makeReport({ performance: null }), makeReport(),
  ]), /invalid Lighthouse performance/);
  const missingNetwork = makeReport();
  delete missingNetwork.audits['network-requests'];
  assert.throws(() => assessLighthouseReports([
    makeReport(), missingNetwork, makeReport(),
  ]), /network-request audit/);
});
