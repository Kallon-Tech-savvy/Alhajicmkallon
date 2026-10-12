import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const heroSource = await readFile(new URL('../src/components/Hero.tsx', import.meta.url), 'utf8');

test('homepage hero stays server-rendered without Framer Motion client runtime', () => {
  assert.doesNotMatch(heroSource, /^['"]use client['"];?/m);
  assert.doesNotMatch(heroSource, /from ['"]framer-motion['"]/);
  assert.doesNotMatch(heroSource, /<motion\./);
});

test('homepage portrait remains prioritized for Largest Contentful Paint with responsive sizing', () => {
  assert.match(heroSource, /src=["']\/assets\/kallon1\.png["']/);
  assert.match(heroSource, /priority/);
  assert.match(heroSource, /sizes="\(min-width: 1024px\) 42vw, 1px"/);
  assert.doesNotMatch(heroSource, /loading="lazy"/);
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


test('homepage omits the decorative regional map section', async () => {
  const homepage = await readFile(new URL('../src/app/page.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(homepage, /VisionMap|components\/VisionMap/);
});

test('Lighthouse enforces the agreed performance and discoverability acceptance criteria', async () => {
  const workflow = await readFile(new URL('../.github/workflows/content-platform.yml', import.meta.url), 'utf8');
  assert.match(workflow, /--only-categories=performance,seo/);
  assert.match(workflow, /score < 0\.8/);
  assert.match(workflow, /seoScore < 1/);
  assert.match(workflow, /expected at least 80\/100/);
  assert.match(workflow, /expected 100\/100/);
  assert.match(workflow, /concurrency:\s*\n\s+group: content-platform-\$\{\{\s*github\.ref\s*\}\}/);
  assert.match(workflow, /cancel-in-progress:\s*true/);
});

const llmsRouteSource = await readFile(new URL('../src/app/llms.txt/route.ts', import.meta.url), 'utf8');

test('AI discovery guide links to canonical public pages and avoids invented evidence', () => {
  assert.match(llmsRouteSource, /export function GET\(\)/);
  assert.match(llmsRouteSource, /Content-Type.*text\/plain/);
  assert.match(llmsRouteSource, /\/work/);
  assert.match(llmsRouteSource, /\/writing/);
  assert.match(llmsRouteSource, /\/knowledge/);
  assert.match(llmsRouteSource, /Distinguish documented facts from interpretation/);
  assert.match(llmsRouteSource, /Cache-Control/);
});

const layoutSource = await readFile(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');

test('root layout exposes canonical URL and truthful Person/WebSite structured data', () => {
  assert.match(layoutSource, /alternates:\s*\{\s*canonical:\s*"\/"\s*\}/);
  assert.match(layoutSource, /"@context":\s*"https:\/\/schema\.org"/);
  assert.match(layoutSource, /"@type":\s*"Person"/);
  assert.match(layoutSource, /"@type":\s*"WebSite"/);
  assert.match(layoutSource, /JSON\.stringify\(structuredData\)/);
  assert.match(layoutSource, /addressCountry:\s*"SL"/);
});

const chatWidgetSource = await readFile(new URL('../src/components/ChatWidget.tsx', import.meta.url), 'utf8');
const chatLoaderSource = await readFile(new URL('../src/components/ChatWidgetLoader.tsx', import.meta.url), 'utf8');

test('chat conversation UI is dynamically loaded only after the visitor opens chat', () => {
  assert.match(layoutSource, /ChatWidgetLoader/);
  assert.doesNotMatch(layoutSource, /import \{ ChatWidget \} from/);
  assert.match(chatLoaderSource, /dynamic\(/);
  assert.match(chatLoaderSource, /import\('\.\/ChatWidget'\)/);
  assert.match(chatLoaderSource, /\{open && <ChatWidgetPanel initialOpen showLauncher=\{false\} onClose=\{closeChat\} \/>\}/);
  assert.match(chatWidgetSource, /showLauncher && <button/);
  assert.match(chatWidgetSource, /if \(!open && initialOpen\) onClose\?\.\(\)/);
});

const globalCssSource = await readFile(new URL('../src/app/globals.css', import.meta.url), 'utf8');

test('font setup avoids an unused font family and preserves the generated Inter variable', () => {
  assert.doesNotMatch(layoutSource, /Space_Mono|spaceMono\.variable/);
  assert.doesNotMatch(globalCssSource, /--font-inter:\s*var\(--font-inter\)/);
  assert.doesNotMatch(globalCssSource, /--font-cormorant:/);
  assert.match(layoutSource, /Inter, JetBrains_Mono/);
});


const navbarSourceForIcons = await readFile(new URL('../src/components/Navbar.tsx', import.meta.url), 'utf8');
const chatLauncherSourceForIcons = await readFile(new URL('../src/components/ChatWidgetLoader.tsx', import.meta.url), 'utf8');

test('initial navigation and chat launcher do not import the icon package into the client shell', () => {
  assert.doesNotMatch(navbarSourceForIcons, /from ['"]lucide-react['"]/);
  assert.doesNotMatch(chatLauncherSourceForIcons, /from ['"]lucide-react['"]/);
  assert.match(navbarSourceForIcons, /function NavIcon/);
  assert.match(chatLauncherSourceForIcons, /<svg/);
});
