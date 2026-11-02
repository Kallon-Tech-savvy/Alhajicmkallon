import { NextRequest, NextResponse } from 'next/server';
import { searchPublishedContent } from '@/lib/content';

// Return a strictly limited public projection. Do not send full Markdown
// bodies or the generated catalogue to the browser.
const MAX_QUERY_LENGTH = 120;
const MAX_RESULTS_PER_TYPE = 8;
const MAX_SNIPPET_LENGTH = 220;

function snippet(text: string) {
  const value = text.trim();
  return value.length > MAX_SNIPPET_LENGTH
    ? `${value.slice(0, MAX_SNIPPET_LENGTH - 1).trimEnd()}…`
    : value;
}

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: 'Search terms must be 120 characters or fewer.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!query) {
    return NextResponse.json(
      { projects: [], articles: [] },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const matches = searchPublishedContent(query);
  return NextResponse.json(
    {
      projects: matches.projects.slice(0, MAX_RESULTS_PER_TYPE).map((project) => ({
        id: project.id,
        title: project.title,
        summary: snippet(project.summary),
        href: `/work/${project.slug}`,
      })),
      articles: matches.articles.slice(0, MAX_RESULTS_PER_TYPE).map((article) => ({
        slug: article.slug,
        title: article.title,
        excerpt: snippet(article.excerpt),
        href: `${article.kind === 'knowledge' ? '/knowledge' : '/writing'}/${article.slug}`,
      })),
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
