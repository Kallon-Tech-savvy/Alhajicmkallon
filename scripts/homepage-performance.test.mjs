import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const heroSource = await readFile(new URL('../src/components/Hero.tsx', import.meta.url), 'utf8');

test('homepage hero stays server-rendered without Framer Motion client runtime', () => {
  assert.doesNotMatch(heroSource, /^['"]use client['"];?/m);
  assert.doesNotMatch(heroSource, /from ['"]framer-motion['"]/);
  assert.doesNotMatch(heroSource, /<motion\./);
});

test('homepage portrait remains prioritized for Largest Contentful Paint', () => {
  assert.match(heroSource, /src=["']\/assets\/kallon1\.png["']/);
  assert.match(heroSource, /priority/);
});

const featuredWorkSource = await readFile(new URL('../src/components/FeaturedWork.tsx', import.meta.url), 'utf8');

test('featured work stays server-rendered without Framer Motion client runtime', () => {
  assert.doesNotMatch(featuredWorkSource, /^['"]use client['"];?/m);
  assert.doesNotMatch(featuredWorkSource, /from ['"]framer-motion['"]/);
  assert.doesNotMatch(featuredWorkSource, /<motion\./);
});
