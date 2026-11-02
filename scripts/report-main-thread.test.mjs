import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeMainThread } from './report-main-thread.mjs';

test('reports script evaluation, layout work and the most expensive tasks', () => {
  const summary = summarizeMainThread({
    categories: { performance: { score: 0.93 } },
    audits: {
      'total-blocking-time': { numericValue: 320 },
      'mainthread-work-breakdown': { details: { items: [
        { group: 'scriptEvaluation', duration: 370 },
        { group: 'styleLayout', duration: 190 },
      ] } },
      'bootup-time': { details: { items: [
        { url: '/next.js', scripting: 230, total: 300 },
        { url: '/site.js', scripting: 35, total: 49 },
      ] } },
      'long-tasks': { details: { items: [
        { url: '/site.js', duration: 72 },
        { url: '/next.js', duration: 210 },
      ] } },
    },
  });
  assert.equal(summary.score, 93);
  assert.equal(summary.blockingMs, 320);
  assert.equal(summary.scriptEvaluationMs, 370);
  assert.equal(summary.styleLayoutMs, 190);
  assert.equal(summary.topBootupScripts[0].source, '/next.js');
  assert.equal(summary.longTasks[0].durationMs, 210);
});

test('handles a report without optional trace diagnostics', () => {
  const summary = summarizeMainThread({ audits: {}, categories: {} });
  assert.equal(summary.score, null);
  assert.equal(summary.blockingMs, null);
  assert.deepEqual(summary.longTasks, []);
  assert.deepEqual(summary.topBootupScripts, []);
});
