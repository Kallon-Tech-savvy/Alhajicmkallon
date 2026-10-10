/**
 * Public content catalogue.
 *
 * Keep this file limited to owner-approved content. Drafts are intentionally
 * excluded from public exports; add authored entries only after their facts
 * and publication status have been verified.
 */

export type PublicationStatus = 'draft' | 'published';

export interface Project {
  id: string;
  slug: string;
  title: string;
  role: string;
  summary: string;
  description: string;
  topics: string[];
  technologies: string[];
  status: PublicationStatus;
  publishedAt?: string;
  image?: string;
  body?: string;
  links?: {
    live?: string;
    source?: string;
  };
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  topics: string[];
  date: string;
  readTime?: string;
  excerpt: string;
  content: string;
  status: PublicationStatus;
  kind: 'journal' | 'knowledge';
}

import { generatedArticles, generatedProjects } from './generated-content';

const projectCatalogue: Project[] = generatedProjects;
const articleCatalogue: Article[] = generatedArticles;

function assertUniqueSlugs<T extends { slug: string }>(entries: T[], type: string) {
  const seen = new Set<string>();
  for (const entry of entries) {
    if (!entry.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) {
      throw new Error(`Invalid ${type} slug: "${entry.slug}"`);
    }
    if (seen.has(entry.slug)) {
      throw new Error(`Duplicate ${type} slug: "${entry.slug}"`);
    }
    seen.add(entry.slug);
  }
}

assertUniqueSlugs(projectCatalogue, 'project');
assertUniqueSlugs(articleCatalogue, 'article');

export const PROJECTS = projectCatalogue.filter((project) => project.status === 'published');
export const ARTICLES = articleCatalogue.filter((article) => article.status === 'published');
export const JOURNAL_ENTRIES = ARTICLES.filter((article) => article.kind === 'journal');
export const KNOWLEDGE_ENTRIES = ARTICLES.filter((article) => article.kind === 'knowledge');

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}

export function getArticleBySlug(slug: string) {
  return ARTICLES.find((article) => article.slug === slug);
}

export function searchPublishedContent(query: string) {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return { projects: [], articles: [] };

  return {
    projects: PROJECTS.filter((project) =>
      [project.title, project.summary, project.description, ...project.topics, ...project.technologies]
        .some((value) => value.toLocaleLowerCase().includes(normalized)),
    ),
    articles: ARTICLES.filter((article) =>
      [article.title, article.excerpt, article.category, ...article.topics, article.content]
        .some((value) => value.toLocaleLowerCase().includes(normalized)),
    ),
  };
}
