import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../src/components/WebVitalsReporter.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function reporter({ initial = '/', current = initial, navigationTiming = true } = {}) {
  let callback;
  const sent = [];
  const window = {
    location: { href: `https://alhajikallon.com${current}` },
    matchMedia: () => ({ matches: true }),
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, window, URL, navigator: {},
    performance: { getEntriesByType: () => navigationTiming ? [{ name: `https://alhajikallon.com${initial}` }] : [] },
    Math: Object.assign(Object.create(Math), { random: () => 0 }),
    require: (id) => {
      assert.equal(id, 'next/web-vitals');
      return { useReportWebVitals: (fn) => { callback = fn; } };
    },
    fetch: async (_url, options) => { sent.push(JSON.parse(options.body)); },
  });
  exports.WebVitalsReporter();
  return { window, sent, report: (name = 'LCP') => callback({ name, value: 900, id: name }) };
}

test('delayed document metrics retain the original section after client navigation', () => {
  const app = reporter();
  app.window.location.href = 'https://alhajikallon.com/work/mj-studio-backend';
  app.report();
  app.report('INP');
  assert.deepEqual(app.sent.map((metric) => metric.section), ['home', 'home']);
});

test('late reporter mounting uses the original navigation URL', () => {
  const app = reporter({ initial: '/writing/original?private=query', current: '/contact' });
  app.report();
  assert.equal(app.sent[0].section, 'writing');
  assert.deepEqual(Object.keys(app.sent[0]).sort(), ['name', 'section', 'value', 'viewport']);
  assert.equal(JSON.stringify(app.sent).includes('private'), false);
});

test('missing Navigation Timing falls back to the mount URL and retains it', () => {
  const app = reporter({ current: '/knowledge/topic', navigationTiming: false });
  app.window.location.href = 'https://alhajikallon.com/about';
  app.report();
  assert.equal(app.sent[0].section, 'knowledge');
});
