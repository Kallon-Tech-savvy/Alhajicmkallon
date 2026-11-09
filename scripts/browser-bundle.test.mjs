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


test('production CSS includes the registered application palette and font utilities', async () => {
  async function collectCss(directory) {
    const files = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const name = path.join(directory, entry.name);
      if (entry.isDirectory()) files.push(...await collectCss(name));
      else if (name.endsWith('.css')) files.push(name);
    }
    return files;
  }
  const files = await collectCss(path.join(projectRoot, '.next/static'));
  assert.ok(files.length, 'Build must emit CSS');
  const css = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');
  for (const utility of ['bg-midnight', 'bg-surface', 'text-ivory', 'text-muted', 'text-accent', 'font-display', 'font-body', 'site-gutter', 'section-space']) {
    assert.ok(new RegExp('\\.' + utility + '(?:[,{])').test(css), `Missing generated theme utility: ${utility}`);
  }
});

test('shared text, action and menu colours meet their contrast budgets', async () => {
  const source = await readFile(path.join(projectRoot, 'src/app/globals.css'), 'utf8');
  const root = source.match(/:root\s*\{([^}]+)\}/)[1];
  const colours = Object.fromEntries([...root.matchAll(/--ui-([a-z-]+):\s*(#[0-9A-Fa-f]{6});/g)].map((match) => [match[1], match[2]]));
  function luminance(hex) {
    const values = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
  }
  for (const [foreground, background] of [['text','background'], ['text','surface'], ['muted','surface'], ['muted','elevated'], ['accent','elevated'], ['text','elevated'], ['muted','background'], ['background','accent'], ['background','action']]) {
    assert.ok(colours[foreground] && colours[background], 'Missing contrast token');
    const [low, high] = [luminance(colours[foreground]), luminance(colours[background])].sort((a,b) => a-b);
    const ratio = (high + 0.05) / (low + 0.05);
    assert.ok(ratio >= 4.5, `${foreground} on ${background}: ${ratio.toFixed(2)}:1 is below 4.5:1`);
  }
});


test('editorial text and primary action meet contrast budgets on each paper surface', async () => {
  const css = await readFile(path.join(projectRoot, 'src/app/globals.css'), 'utf8');
  const palette = css.match(/:root\s*\{([^}]+)\}/)[1];
  const colours = Object.fromEntries([...palette.matchAll(/--ui-([a-z-]+):\s*(#[0-9A-Fa-f]{6});/g)].map(m => [m[1], m[2]]));
  function light(hex) {
    const v = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
    return v[0]*.2126+v[1]*.7152+v[2]*.0722;
  }
  for (const fg of ['text','muted','accent']) for (const bg of ['background','surface','elevated']) {
    const [a,b] = [light(colours[fg]),light(colours[bg])].sort((a,b)=>a-b);
    assert.ok((b+.05)/(a+.05) >= 4.5, `${fg} on ${bg} needs 4.5:1`);
  }
});
