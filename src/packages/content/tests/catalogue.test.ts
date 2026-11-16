import test from 'node:test';
import assert from 'node:assert/strict';
import { createContentCatalogue } from '../catalogue';
import type { Article, Project } from '../types';

function project(slug: string, status: Project['status'] = 'published'): Project {
  return {
    id: slug,
    slug,
    title: slug,
    role: 'Builder',
    summary: 'API summary',
    description: 'Body',
    topics: [],
    technologies: [],
    status,
  };
}
const article: Article = {
  slug: 'guide',
  title: 'Guide',
  category: 'API',
  topics: [],
  date: '2026-11-16',
  excerpt: 'A guide',
  content: 'Body',
  status: 'published',
  kind: 'knowledge',
};

test('all public catalogue paths exclude drafts and preserve editorial curation', () => {
  const input = [
    project('unlisted'),
    project('mj-studio-backend'),
    project('aeem-digital-presence'),
    project('draft-api', 'draft'),
  ];
  const catalogue = createContentCatalogue({
    projects: input,
    articles: [article, { ...article, slug: 'draft-guide', status: 'draft' }],
  });
  assert.deepEqual(
    catalogue.PROJECTS.map((item) => item.slug),
    ['aeem-digital-presence', 'mj-studio-backend', 'unlisted'],
  );
  assert.equal(catalogue.getProjectBySlug('draft-api'), undefined);
  assert.equal(catalogue.getArticleBySlug('draft-guide'), undefined);
  assert.equal(catalogue.KNOWLEDGE_ENTRIES.length, 1);
  assert.equal(catalogue.JOURNAL_ENTRIES.length, 0);
  assert.equal(catalogue.searchPublishedContent('API').projects.length, 3);
  assert.equal(input[0].slug, 'unlisted');
});

test('duplicate and malformed slugs are rejected at the module boundary', () => {
  assert.throws(
    () => createContentCatalogue({ projects: [project('same'), project('same')], articles: [] }),
    /Duplicate/,
  );
  assert.throws(
    () => createContentCatalogue({ projects: [project('../invalid')], articles: [] }),
    /Invalid/,
  );
});
