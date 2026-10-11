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

const visitorPathSource = await readFile(new URL('../src/components/VisitorPath.tsx', import.meta.url), 'utf8');

test('visitor path avoids shipping a separate animation runtime', () => {
  assert.doesNotMatch(visitorPathSource, /from ['"]framer-motion['"]/);
  assert.doesNotMatch(visitorPathSource, /<AnimatePresence|<motion\\./);
  assert.ok(visitorPathSource.includes('animate-[slide-up_180ms_ease-out_both]'));
});

const workPageSource = await readFile(new URL('../src/app/work/page.tsx', import.meta.url), 'utf8');

test('work page communicates product thinking and the project evidence journey', () => {
  assert.match(workPageSource, /FROM QUESTIONS/);
  assert.match(workPageSource, /TO PRODUCTS/);
  assert.match(workPageSource, /decisions, trade-offs, and implementation/);
});

test('work page keeps case-study and live-project paths distinct and safe', () => {
  assert.match(workPageSource, /Read case study/);
  assert.match(workPageSource, /Visit live project/);
  assert.match(workPageSource, /target="_blank" rel="noopener noreferrer"/);
});

const navbarSource = await readFile(new URL('../src/components/Navbar.tsx', import.meta.url), 'utf8');

test('navigation avoids loading Framer Motion for the mobile menu', () => {
  assert.doesNotMatch(navbarSource, /from ['"]framer-motion['"]/);
  assert.doesNotMatch(navbarSource, /<AnimatePresence|<motion\./);
  assert.match(navbarSource, /isMobileMenuOpen &&/);
});

const globalSearchSource = await readFile(new URL('../src/components/GlobalSearch.tsx', import.meta.url), 'utf8');

test('global search avoids the Framer Motion runtime', () => {
  assert.doesNotMatch(globalSearchSource, /from ['"]framer-motion['"]/);
  assert.doesNotMatch(globalSearchSource, /<AnimatePresence|<motion\\./);
});

test('global search is split out until a visitor opens it', () => {
  assert.ok(navbarSource.includes('dynamic(') && navbarSource.includes("import('./GlobalSearch')"));
  assert.ok(navbarSource.includes('isSearchOpen && <GlobalSearch'));
});


const belowFoldMotionFiles = [
  '../src/components/ImpactCards.tsx',
  '../src/components/Timeline.tsx',
  '../src/components/ThoughtLeadership.tsx',
  '../src/components/VisionMap.tsx',
  '../src/components/NewsletterCTA.tsx',
];

test('below-the-fold sections do not pull Framer Motion into the homepage bundle', async () => {
  for (const file of belowFoldMotionFiles) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /from ['"]framer-motion['"]/, file);
    assert.doesNotMatch(source, /<motion\./, file);
  }
});
