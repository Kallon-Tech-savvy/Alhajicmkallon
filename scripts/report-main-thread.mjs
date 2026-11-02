import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

// This diagnostic is observational. Lighthouse scores vary substantially
// between otherwise identical CI runs; do not use one TBT result as proof
// of a performance win or regression.
export function summarizeMainThread(report) {
  const audits = report.audits ?? {};
  const work = audits['mainthread-work-breakdown']?.details?.items ?? [];
  const scripts = audits['bootup-time']?.details?.items ?? [];
  const tasks = audits['long-tasks']?.details?.items ?? [];
  const category = report.categories?.performance?.score;
  const bucket = (name) => work.find((item) => item.group === name)?.duration ?? 0;
  return {
    score: typeof category === 'number' ? Math.round(category * 100) : null,
    blockingMs: audits['total-blocking-time']?.numericValue ?? null,
    scriptEvaluationMs: bucket('scriptEvaluation'),
    styleLayoutMs: bucket('styleLayout'),
    longTasks: [...tasks].sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0)).slice(0, 5)
      .map((item) => ({ durationMs: item.duration, source: item.url ?? 'unattributable' })),
    topBootupScripts: [...scripts].sort((a, b) => (b.scripting ?? 0) - (a.scripting ?? 0)).slice(0, 5)
      .map((item) => ({ evaluationMs: item.scripting, totalCpuMs: item.total, source: item.url ?? 'unattributable' })),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const reportPath = process.argv[2] ?? 'lighthouse-report.json';
  const report = JSON.parse(await readFile(reportPath, 'utf8'));
  const summary = summarizeMainThread(report);
  console.log('Main-thread diagnostic (single synthetic Lighthouse run):');
  console.log(JSON.stringify(summary, null, 2));
}
