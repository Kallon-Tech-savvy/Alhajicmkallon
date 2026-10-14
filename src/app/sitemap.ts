import type { MetadataRoute } from 'next';
import { ARTICLES, KNOWLEDGE_ENTRIES, PROJECTS } from '@/lib/content';

const siteUrl = 'https://alhajicmkallon.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/work', '/writing', '/knowledge', '/contact'];
  const staticPages = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : 0.7,
  }));
  const projectPages = PROJECTS.map((project) => ({
    url: `${siteUrl}/work/${project.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  const writingPages = ARTICLES.filter((entry) => entry.kind === 'journal').map((entry) => ({
    url: `${siteUrl}/writing/${entry.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  const knowledgePages = KNOWLEDGE_ENTRIES.map((entry) => ({
    url: `${siteUrl}/knowledge/${entry.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  return [...staticPages, ...projectPages, ...writingPages, ...knowledgePages];
}
