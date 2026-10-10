import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDocument } from './build-content-index.mjs';

test('parses frontmatter and preserves Markdown body', () => {
  const parsed = parseDocument('---\nslug: clear-writing\ntitle: "Clear writing"\ntopics: ["systems", "writing"]\n---\n\nA **useful** paragraph.');
  assert.equal(parsed.metadata.slug, 'clear-writing');
  assert.deepEqual(parsed.metadata.topics, ['systems', 'writing']);
  assert.equal(parsed.body, 'A **useful** paragraph.');
});
test('rejects documents without frontmatter', () => assert.throws(() => parseDocument('# Heading'), /must start with YAML frontmatter/));
test('rejects duplicate metadata keys', () => assert.throws(() => parseDocument('---\nslug: first\nslug: second\n---\nBody'), /duplicate frontmatter field/));
test('rejects malformed inline arrays', () => assert.throws(() => parseDocument('---\ntopics: [not valid JSON]\n---\nBody'), /valid JSON syntax/));

test('parses frontmatter with Windows CRLF line endings and a BOM', () => {
  const source = '\uFEFF---\r\nslug: windows-lines\r\ntitle: "Windows lines"\r\ntopics: ["content"]\r\n---\r\n\r\nBody text.';
  const parsed = parseDocument(source);
  assert.equal(parsed.metadata.slug, 'windows-lines');
  assert.equal(parsed.body, 'Body text.');
});
