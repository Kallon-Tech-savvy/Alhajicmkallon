import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function compile(path, modules = {}) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => {
    assert.ok(name in modules, `Unexpected dependency: ${name}`);
    return modules[name];
  } });
  return exports;
}
const { rankSearchEntries } = compile('../src/lib/search-relevance.ts');
const doc = entry => ({ title: entry.title, summary: entry.summary ?? '', metadata: entry.metadata ?? [], body: entry.body ?? '' });
const ids = results => Array.from(results, entry => entry.id);

test('direct HTTP lesson outranks body-only matches and reference URLs do not manufacture relevance', () => {
  const entries = [
    { id: 'reference', title: 'CSS layouts', body: '[Source](https://example.com/http/guide)' },
    { id: 'mention', title: 'Debug a client', body: 'Inspect the HTTP response.' },
    { id: 'lesson', title: 'Make HTTP responses mean something', summary: 'Inspect real requests.' },
  ];
  assert.deepEqual(ids(rankSearchEntries(entries, 'HTTP', doc)), ['lesson', 'mention']);
});
test('exact titles outrank broader titles, metadata and summaries', () => {
  const entries = [
    { id: 'summary', title: 'First project', summary: 'Learn CSS' },
    { id: 'metadata', title: 'Layouts', metadata: ['CSS'] },
    { id: 'broad', title: 'CSS layout' },
    { id: 'exact', title: 'CSS' },
  ];
  assert.deepEqual(ids(rankSearchEntries(entries, ' css ', doc)), ['exact', 'broad', 'summary', 'metadata']);
});
test('multiple words must all match, across fields and independent of word order', () => {
  const entries = [
    { id: 'partial', title: 'HTTP caching' },
    { id: 'complete', title: 'Retry policies', summary: 'Recover HTTP requests' },
  ];
  assert.deepEqual(ids(rankSearchEntries(entries, 'HTTP retry', doc)), ['complete']);
  assert.deepEqual(ids(rankSearchEntries(entries, 'HTTP retries', doc)), []);
  assert.deepEqual(ids(rankSearchEntries(entries, 'HTTP policies', doc)), ['complete']);
  assert.deepEqual(ids(rankSearchEntries(entries, 'policies HTTP', doc)), ['complete']);
});
test('word matching avoids accidental substring matches and normalizes Unicode case', () => {
  assert.deepEqual(ids(rankSearchEntries([{ id: 'false', title: 'Assess a project' }, { id: 'sse', title: 'SSE streams' }], 'sse', doc)), ['sse']);
  assert.deepEqual(ids(rankSearchEntries([{ id: 'fullwidth', title: 'ＨＴＴＰ' }], 'http', doc)), ['fullwidth']);
  assert.deepEqual(ids(rankSearchEntries([{ id: 'accent', title: 'Café systems' }], 'CAFÉ', doc)), ['accent']);
});
test('blank and punctuation-only queries match nothing; equal scores preserve editorial order without mutation', () => {
  const entries = [{ id: 'second', title: 'HTTP A' }, { id: 'first', title: 'HTTP B' }];
  assert.deepEqual(ids(rankSearchEntries(entries, '  ', doc)), []);
  assert.deepEqual(ids(rankSearchEntries(entries, '???', doc)), []);
  assert.deepEqual(ids(rankSearchEntries(entries, 'http', doc)), ['second', 'first']);
  assert.deepEqual(entries.map(entry => entry.id), ['second', 'first']);
});
test('published catalogue integration excludes drafts before ranking both content types', () => {
  const common = { category: 'Guide', topics: [], date: '2026-11-16', excerpt: '', content: '', kind: 'knowledge' };
  const articles = [
    { ...common, slug: 'draft-http', title: 'HTTP', status: 'draft' },
    { ...common, slug: 'http-guide', title: 'HTTP guide', status: 'published' },
  ];
  const projects = [
    { id: 'draft', slug: 'draft-api', title: 'API', status: 'draft', topics: [], technologies: [], summary: '', description: '' },
    { id: 'live', slug: 'api-project', title: 'API project', status: 'published', topics: [], technologies: [], summary: '', description: '' },
  ];
  const catalogue = compile('../src/lib/content.ts', { 'server-only': {}, './search-relevance': { rankSearchEntries }, './generated-content': { generatedArticles: articles, generatedProjects: projects } });
  assert.deepEqual(Array.from(catalogue.searchPublishedContent('HTTP').articles, entry => entry.slug), ['http-guide']);
  assert.deepEqual(ids(catalogue.searchPublishedContent('API').projects), ['live']);
});
