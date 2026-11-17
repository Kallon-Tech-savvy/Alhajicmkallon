import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function source(path) {
  const text = await readFile(new URL(path, import.meta.url), 'utf8');
  return ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}
function imports(file) {
  return file.statements.filter(ts.isImportDeclaration).map((node) => node.moduleSpecifier.text);
}
function nodes(file, predicate) {
  const matches = [];
  function visit(node) {
    if (predicate(node)) matches.push(node);
    ts.forEachChild(node, visit);
  }
  visit(file);
  return matches;
}

// Check architectural constraints, without freezing copy, JSX layout or whitespace.
test('the homepage and its main sections remain server components', async () => {
  for (const path of [
    '../src/app/page.tsx',
    '../src/components/Hero.tsx',
    '../src/components/FeaturedWork.tsx',
    '../src/components/Navbar.tsx',
    '../src/components/Footer.tsx',
  ]) {
    const file = await source(path);
    const clientDirectives = nodes(
      file,
      (node) =>
        ts.isExpressionStatement(node) &&
        ts.isStringLiteral(node.expression) &&
        node.expression.text === 'use client',
    );
    assert.equal(clientDirectives.length, 0, path);
    assert.ok(!imports(file).includes('framer-motion'), path);
  }
});

test('identity imagery stays small and lazy rather than competing with the display headline', async () => {
  const file = await source('../src/components/Hero.tsx');
  const images = nodes(
    file,
    (node) => ts.isJsxSelfClosingElement(node) && node.tagName.getText(file) === 'Image',
  );
  assert.ok(images.length > 0);
  for (const image of images) {
    const attributes = new Map(
      image.attributes.properties
        .filter(ts.isJsxAttribute)
        .map((node) => [node.name.getText(file), node.initializer]),
    );
    if (attributes.get('src')?.text === '/assets/brand/alhaji-kallon-identity.jpg') {
      assert.equal(attributes.get('sizes')?.text, '(max-width: 767px) 100vw, 55vw');
      assert.ok(!attributes.has('priority'));
      continue;
    }
    assert.equal(attributes.get('loading')?.text, 'lazy');
    assert.ok(!attributes.has('priority'));
    assert.equal(attributes.get('sizes')?.text, '56px');
  }
});

test('search and chat remain dynamic imports rather than initial static dependencies', async () => {
  for (const [path, overlay] of [
    ['../src/components/NavbarInteractions.tsx', './GlobalSearch'],
    ['../src/components/ChatWidgetLoader.tsx', './ChatWidget'],
  ]) {
    const file = await source(path);
    assert.ok(!imports(file).includes(overlay));
    const deferred = nodes(
      file,
      (node) => ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword,
    );
    assert.ok(deferred.some((node) => node.arguments[0]?.text === overlay));
  }
});

test('initial navigation and chat controls do not load motion or icon runtimes', async () => {
  for (const path of [
    '../src/components/NavbarInteractions.tsx',
    '../src/components/ChatWidgetLoader.tsx',
  ]) {
    const dependencies = imports(await source(path));
    assert.ok(!dependencies.includes('framer-motion'));
    assert.ok(!dependencies.includes('lucide-react'));
  }
});

test('the published catalogue has a server-only boundary', async () => {
  assert.ok(imports(await source('../src/packages/content/server.ts')).includes('server-only'));
  const filters = await source('../src/components/ArticleFilters.tsx');
  for (const node of filters.statements.filter(ts.isImportDeclaration)) {
    if (node.moduleSpecifier.text.startsWith('@/packages/content/'))
      assert.equal(node.importClause.isTypeOnly, true);
  }
});
