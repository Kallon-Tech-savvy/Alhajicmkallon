import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function collectJavaScript(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectJavaScript(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(fullPath);
  }
  return files;
}

function parseGeneratedArray(source, name, nextName) {
  const prefix = `export const ${name}: ${name === 'generatedArticles' ? 'Article' : 'Project'}[] = `;
  const start = source.indexOf(prefix);
  assert.notEqual(start, -1, `Missing ${name} in generated index`);
  const jsonStart = start + prefix.length;
  const tail = nextName ? `;\nexport const ${nextName}` : ';';
  const end = nextName ? source.indexOf(tail, jsonStart) : source.lastIndexOf(';');
  assert.ok(end > jsonStart, `Cannot read generated index ${name}`);
  return JSON.parse(source.slice(jsonStart, end));
}

function contentSamples(entries) {
  const samples = new Set();
  for (const entry of entries) {
    const text = entry.body ?? entry.content ?? entry.description ?? '';
    const matches = text.match(/[A-Za-z][A-Za-z0-9 ,().-]{110,}/g) ?? [];
    for (const candidate of matches.slice(0, 3)) samples.add(candidate.slice(0, 96));
  }
  return [...samples];
}

test('client JavaScript does not contain the published full-text catalogue', async () => {
  const generated = await readFile(path.join(projectRoot, 'src/lib/generated-content.ts'), 'utf8');
  const articles = parseGeneratedArray(generated, 'generatedArticles', 'generatedProjects');
  const projects = parseGeneratedArray(generated, 'generatedProjects');
  const markers = contentSamples([...articles, ...projects]);
  assert.ok(markers.length, 'Expected at least one long published-content marker');

  const chunkRoot = path.join(projectRoot, '.next/static');
  const chunks = await collectJavaScript(chunkRoot);
  assert.ok(chunks.length, 'Expected a production browser bundle; run npm run build first');

  let totalBytes = 0;
  for (const file of chunks) {
    const content = await readFile(file, 'utf8');
    totalBytes += Buffer.byteLength(content, 'utf8');
    for (const marker of markers) {
      assert.ok(!content.includes(marker), `Full text leaked into browser asset: ${path.relative(projectRoot, file)}`);
    }
  }
  console.log(`Checked ${chunks.length} production browser JavaScript files (${totalBytes} uncompressed bytes) against ${markers.length} full-text markers.`);
});
