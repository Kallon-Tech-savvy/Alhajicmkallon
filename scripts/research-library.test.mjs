import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LIBRARY_CATEGORIES,
  LIBRARY_REVIEW_DATE,
  RESEARCH_RESOURCES,
} from '../src/lib/research-library.ts';

test('library contains traceable source links and all eight subject areas', () => {
  assert.ok(RESEARCH_RESOURCES.length >= 30, 'Keep a useful starting collection');
  assert.deepEqual(
    new Set(RESEARCH_RESOURCES.map((resource) => resource.category)),
    new Set(LIBRARY_CATEGORIES),
  );
  assert.match(LIBRARY_REVIEW_DATE, /^\d{4}-\d{2}-\d{2}$/);

  const urls = new Set();
  const ids = new Set();
  for (const resource of RESEARCH_RESOURCES) {
    assert.ok(resource.title.trim());
    assert.ok(resource.publisher.trim());
    assert.ok(resource.use.trim());
    assert.ok(resource.caution.trim());
    assert.ok(resource.question.trim());
    assert.ok(resource.tags.length);
    assert.match(resource.url, /^https:\/\/[^\s]+$/);
    const url = new URL(resource.url);
    assert.equal(url.username, '');
    assert.equal(url.password, '');
    assert.ok(!urls.has(resource.url), `Duplicate URL: ${resource.url}`);
    assert.ok(!ids.has(resource.id), `Duplicate id: ${resource.id}`);
    urls.add(resource.url);
    ids.add(resource.id);
  }
});
