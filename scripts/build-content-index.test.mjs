import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { buildContentIndex, parseDocument } from './build-content-index.mjs';

test('parses frontmatter and preserves Markdown body', () => {
  const parsed = parseDocument('---\nslug: clear-writing\ntitle: "Clear writing"\ntopics: ["systems", "writing"]\n---\n\nA **useful** paragraph.');
  assert.equal(parsed.metadata.slug, 'clear-writing');
  assert.deepEqual(parsed.metadata.topics, ['systems', 'writing']);
  assert.equal(parsed.body, 'A **useful** paragraph.');
});
test('rejects documents without frontmatter', () => assert.throws(() => parseDocument('# Heading'), /must start with YAML frontmatter/));
test('rejects duplicate metadata keys', () => assert.throws(() => parseDocument('---\nslug: first\nslug: second\n---\nBody'), /duplicate frontmatter field/));
test('rejects malformed inline arrays', () => assert.throws(() => parseDocument('---\ntopics: [not valid JSON]\n---\nBody'), /valid JSON syntax/));


test('indexes Markdown and MDX-compatible editorial files but exports published content only', async () => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), 'content-index-'));
  try {
    await mkdir(path.join(projectRoot, 'content', 'journal'), { recursive: true });
    await mkdir(path.join(projectRoot, 'content', 'knowledge'), { recursive: true });
    await mkdir(path.join(projectRoot, 'content', 'projects'), { recursive: true });
    await writeFile(path.join(projectRoot, 'content', 'journal', 'published.mdx'), [
      '---',
      'slug: published-note',
      'title: Published note',
      'category: Systems',
      'topics: ["testing"]',
      'date: "2026-10-10"',
      'excerpt: A published MDX-compatible note.',
      'status: published',
      'kind: journal',
      '---',
      '',
      'A **published** note.',
    ].join('\n'));
    await writeFile(path.join(projectRoot, 'content', 'journal', 'draft.md'), [
      '---',
      'slug: private-draft',
      'title: Private draft',
      'category: Systems',
      'topics: ["testing"]',
      'date: "2026-10-10"',
      'excerpt: This must not be public.',
      'status: draft',
      'kind: journal',
      '---',
      '',
      'Private draft body.',
    ].join('\n'));
    await writeFile(path.join(projectRoot, 'content', 'projects', 'verified-project.md'), [
      '---',
      'slug: verified-project',
      'title: Verified project',
      'role: Builder',
      'summary: A verified project summary.',
      'topics: ["engineering"]',
      'technologies: ["TypeScript"]',
      'status: published',
      'publishedAt: "2026-10-10"',
      '---',
      '',
      'Documented project body.',
    ].join('\n'));
    const outputPath = path.join(projectRoot, 'src', 'lib', 'generated-content.ts');
    const counts = await buildContentIndex({ projectRoot, destination: outputPath });
    const generated = await readFile(outputPath, 'utf8');
    assert.deepEqual(counts, { articles: 1, projects: 1 });
    assert.match(generated, /published-note/);
    assert.match(generated, /verified-project/);
    assert.doesNotMatch(generated, /private-draft/);
    assert.doesNotMatch(generated, /Private draft body/);
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test('rejects duplicate slugs across content types', async () => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), 'content-index-'));
  try {
    await mkdir(path.join(projectRoot, 'content', 'journal'), { recursive: true });
    await mkdir(path.join(projectRoot, 'content', 'projects'), { recursive: true });
    const article = ['---','slug: shared-slug','title: Article','category: Notes','topics: []','date: "2026-10-10"','excerpt: Article summary','status: published','kind: journal','---','','Article body'].join('\n');
    const project = ['---','slug: shared-slug','title: Project','role: Builder','summary: Project summary','topics: []','technologies: []','status: published','publishedAt: "2026-10-10"','---','','Project body'].join('\n');
    await writeFile(path.join(projectRoot, 'content', 'journal', 'article.md'), article);
    await writeFile(path.join(projectRoot, 'content', 'projects', 'project.md'), project);
    await assert.rejects(buildContentIndex({ projectRoot, destination: path.join(projectRoot, 'generated.ts') }), /Duplicate content slug/);
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});
