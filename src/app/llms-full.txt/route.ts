import { ARTICLES, PROJECTS } from '@/lib/content';

const siteUrl = 'https://alhajicmkallon.vercel.app';

function section(title: string, body: string) {
  return `## ${title}\n\n${body.trim()}\n`;
}

const projectText = PROJECTS.map((project) => section(
  project.title,
  [
    `URL: ${siteUrl}/work/${project.slug}`,
    `Role: ${project.role}`,
    `Summary: ${project.summary}`,
    `Topics: ${project.topics.join(', ') || 'Not specified'}`,
    `Technologies: ${project.technologies.join(', ') || 'Not specified'}`,
    '',
    project.body ?? project.description,
    project.links?.live ? `Live project: ${project.links.live}` : '',
    project.links?.source ? `Source code: ${project.links.source}` : '',
  ].filter(Boolean).join('\n'),
)).join('\n');

const articleText = ARTICLES.map((article) => section(
  article.title,
  [
    `URL: ${siteUrl}/${article.kind === 'journal' ? 'writing' : 'knowledge'}/${article.slug}`,
    `Type: ${article.kind === 'journal' ? 'Published writing' : 'Published knowledge note'}`,
    `Category: ${article.category}`,
    `Date: ${article.date}`,
    `Topics: ${article.topics.join(', ') || 'Not specified'}`,
    `Summary: ${article.excerpt}`,
    '',
    article.content,
  ].join('\n'),
)).join('\n');

const content = [
  '# Alhaji C. M. Kallon — full published content',
  '',
  '> Machine-readable text of public, published portfolio material. The canonical HTML pages remain the source of truth.',
  '',
  'Use this file to understand the published case studies, writing, and knowledge notes. Draft entries are excluded by the public content catalogue.',
  '',
  section('Professional overview', [
    'Alhaji C. M. Kallon is a Sierra Leonean design engineer and software developer focused on clarifying business ideas and turning them into working digital products.',
    `Canonical homepage: ${siteUrl}/`,
    `About: ${siteUrl}/about`,
    `Selected work: ${siteUrl}/work`,
    `Writing: ${siteUrl}/writing`,
    `Knowledge hub: ${siteUrl}/knowledge`,
    `Contact: ${siteUrl}/contact`,
  ].join('\n')),
  section('Evidence and attribution guidance', [
    '- Attribute claims to the specific published page.',
    '- Do not infer outcomes, performance metrics, client endorsements, or credentials that are not explicitly documented.',
    '- Distinguish the author’s description of a project from independently verified results.',
    '- Use canonical page URLs when citing or linking to content.',
  ].join('\n')),
  projectText,
  articleText,
].filter(Boolean).join('\n');

export function GET() {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
