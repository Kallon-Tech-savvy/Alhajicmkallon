import type { MetadataRoute } from 'next';
import { ARTICLES, PROJECTS, KNOWLEDGE_ENTRIES } from '@/lib/content';

const siteUrl = 'https://alhajicmkallon.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/work', '/writing', '/knowledge', '/contact'];
  const staticPages = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : 0.7,
  }));
  const writingPages = ARTICLES.filter((entry) => entry.kind === 'journal').map((entry) => ({
    url: `${siteUrl}/writing/${entry.slug}`,
    lastModified: entry.date ? new Date(entry.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  const knowledgePages = KNOWLEDGE_ENTRIES.map((entry) => ({
    url: `${siteUrl}/knowledge/${entry.slug}`,
    lastModified: entry.date ? new Date(entry.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  const projectPages = PROJECTS.map((project) => ({
    url: `${siteUrl}/work#${project.id}`,
    lastModified: project.publishedAt ? new Date(project.publishedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  return [...staticPages, ...writingPages, ...knowledgePages, ...projectPages];
}
