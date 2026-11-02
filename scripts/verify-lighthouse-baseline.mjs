import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const EXPECTED_RUNS = 3;

function median(values) {
  const ordered = [...values].sort((a, b) => a - b);
  return ordered[Math.floor(ordered.length / 2)];
}

function scoreFor(report, category) {
  const score = report.categories?.[category]?.score;
  if (!Number.isFinite(score) || score < 0 || score > 1) {
    throw new Error('Missing or invalid Lighthouse ' + category + ' score.');
  }
  return score;
}

function metric(report, name) {
  const value = report.audits?.[name]?.numericValue;
  return Number.isFinite(value) ? value : null;
}

function stats(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  if (!valid.length) return null;
  return {
    min: Math.min(...valid),
    median: median(valid),
    max: Math.max(...valid),
  };
}

export function assessLighthouseReports(reports) {
  if (!Array.isArray(reports) || reports.length !== EXPECTED_RUNS) {
    throw new Error('Expected exactly three independent Lighthouse reports.');
  }

  const runs = reports.map((report, index) => {
    const score = scoreFor(report, 'performance');
    const seoScore = scoreFor(report, 'seo');
    const requests = report.audits?.['network-requests']?.details?.items;
    if (!Array.isArray(requests)) {
      throw new Error('Run ' + (index + 1) + ': missing network-request audit; route prefetch could not be validated.');
    }
    const rscRequests = requests.filter(
      (item) => item.resourceType === 'Fetch' && typeof item.url === 'string' && /[?&]_rsc=/.test(item.url)
    );
    return {
      run: index + 1,
      performanceScore: Math.round(score * 100),
      performanceRaw: score,
      seoScore: Math.round(seoScore * 100),
      seoRaw: seoScore,
      lcpMs: metric(report, 'largest-contentful-paint'),
      tbtMs: metric(report, 'total-blocking-time'),
      cls: metric(report, 'cumulative-layout-shift'),
      routePrefetchRequests: rscRequests.length,
      routePrefetchBytes: rscRequests.reduce((sum, request) => sum + (request.transferSize ?? 0), 0),
    };
  });

  const score = median(runs.map((run) => run.performanceRaw));
  const failures = [];
  if (score < 0.8) {
    failures.push('Performance budget failed: expected at least 80/100 median across three independent runs.');
  }
  for (const run of runs) {
    const seoScore = run.seoRaw;
    if (seoScore < 1) {
      failures.push('Run ' + run.run + ': SEO / discoverability budget failed: expected 100/100.');
    }
    if (run.routePrefetchRequests > 0) {
      failures.push('Run ' + run.run + ': homepage made ' + run.routePrefetchRequests + ' speculative route-data requests.');
    }
  }

  return {
    runs,
    medians: {
      performance: Math.round(score * 100),
      lcpMs: stats(runs.map((run) => run.lcpMs)),
      tbtMs: stats(runs.map((run) => run.tbtMs)),
      cls: stats(runs.map((run) => run.cls)),
    },
    passed: failures.length === 0,
    failures,
  };
}

async function main() {
  const inputs = process.argv.slice(2);
  if (inputs.length !== EXPECTED_RUNS) {
    throw new Error('Usage: node scripts/verify-lighthouse-baseline.mjs <run-1.json> <run-2.json> <run-3.json>');
  }
  const reports = await Promise.all(inputs.map(async (file) => JSON.parse(await readFile(file, 'utf8'))));
  const result = assessLighthouseReports(reports);
  await mkdir('lighthouse-reports', { recursive: true });
  await writeFile('lighthouse-reports/summary.json', JSON.stringify(result, null, 2) + '\n');
  console.log('Repeated Lighthouse baseline (3 runs, same production build):');
  for (const run of result.runs) {
    console.log('Run ' + run.run + ': performance ' + run.performanceScore + ', SEO ' + run.seoScore
      + ', LCP ' + Math.round(run.lcpMs ?? 0) + ' ms, TBT ' + Math.round(run.tbtMs ?? 0)
      + ' ms, route prefetch ' + run.routePrefetchRequests + ' / ' + run.routePrefetchBytes + ' bytes');
  }
  console.log('Median performance: ' + result.medians.performance + '/100');
  for (const name of ['lcpMs', 'tbtMs', 'cls']) {
    const values = result.medians[name];
    if (values) console.log(name + ' min / median / max: ' + values.min.toFixed(2)
      + ' / ' + values.median.toFixed(2) + ' / ' + values.max.toFixed(2));
  }
  for (const failure of result.failures) console.error(failure);
  if (!result.passed) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
