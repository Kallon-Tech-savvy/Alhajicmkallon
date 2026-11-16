import type { Article, Project } from '../types';
import { rankSearchEntries } from './search-relevance';

export function createContentCatalogue({
  projects: projectCatalogue,
  articles: articleCatalogue,
}: {
  projects: readonly Project[];
  articles: readonly Article[];
}) {
  function assertUniqueSlugs<T extends { slug: string }>(entries: readonly T[], type: string) {
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

  // Curate the public portfolio by strength of available evidence, not recency.
  const PROJECT_ORDER = ['aeem-digital-presence', 'mj-studio-backend'];

  const PROJECTS: readonly Project[] = projectCatalogue
    .filter((project) => project.status === 'published')
    .sort((a, b) => {
      const aIndex = PROJECT_ORDER.indexOf(a.slug);
      const bIndex = PROJECT_ORDER.indexOf(b.slug);
      const aOrder = aIndex === -1 ? PROJECT_ORDER.length : aIndex;
      const bOrder = bIndex === -1 ? PROJECT_ORDER.length : bIndex;
      return aOrder - bOrder;
    });
  const ARTICLES: readonly Article[] = articleCatalogue.filter(
    (article) => article.status === 'published',
  );
  const JOURNAL_ENTRIES: readonly Article[] = ARTICLES.filter(
    (article) => article.kind === 'journal',
  );
  const KNOWLEDGE_ORDER = [
    'semantic-html-for-beginners',
    'css-layout-without-guesswork',
    'fetch-loading-error-empty-states',
    'typescript-runtime-validation',
    'when-is-a-feature-done',
    'junior-developer-pull-request-checklist',
  ];
  const KNOWLEDGE_ENTRIES: readonly Article[] = ARTICLES.filter(
    (article) => article.kind === 'knowledge',
  ).sort((a, b) => {
    const order = (slug: string) => {
      const i = KNOWLEDGE_ORDER.indexOf(slug);
      return i < 0 ? KNOWLEDGE_ORDER.length : i;
    };
    return order(a.slug) - order(b.slug);
  });

  function getProjectBySlug(slug: string) {
    return PROJECTS.find((project) => project.slug === slug);
  }

  function getArticleBySlug(slug: string) {
    return ARTICLES.find((article) => article.slug === slug);
  }

  function searchPublishedContent(query: string) {
    return {
      projects: rankSearchEntries(PROJECTS, query, (project) => ({
        title: project.title,
        summary: project.summary,
        metadata: [...project.topics, ...project.technologies],
        body: project.description,
      })),
      articles: rankSearchEntries(ARTICLES, query, (article) => ({
        title: article.title,
        summary: article.excerpt,
        metadata: [article.category, ...article.topics],
        body: article.content,
      })),
    };
  }

  return {
    PROJECTS,
    ARTICLES,
    JOURNAL_ENTRIES,
    KNOWLEDGE_ENTRIES,
    getProjectBySlug,
    getArticleBySlug,
    searchPublishedContent,
  };
}
