import 'server-only';
import { createContentCatalogue } from './catalogue';
import { generatedArticles, generatedProjects } from './lib/generated-content';

export const {
  PROJECTS,
  ARTICLES,
  JOURNAL_ENTRIES,
  KNOWLEDGE_ENTRIES,
  getProjectBySlug,
  getArticleBySlug,
  searchPublishedContent,
} = createContentCatalogue({ projects: generatedProjects, articles: generatedArticles });
