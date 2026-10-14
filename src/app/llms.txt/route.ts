import { ARTICLES, PROJECTS } from '@/lib/content';

const siteUrl = 'https://alhajicmkallon.vercel.app';

const staticPages = [
  ['Home', '/', 'Professional overview, working approach, and selected work.'],
  ['About', '/about', 'Background, skills, and professional context.'],
  ['Selected work', '/work', 'Published project summaries and case studies.'],
  ['Writing', '/writing', 'Published essays and reflections.'],
  ['Knowledge hub', '/knowledge', 'Published learning notes and reference material.'],
  ['Contact', '/contact', 'Contact options for discussing a project.'],
] as const;

const lines = [
  '# Alhaji C. M. Kallon',
  '',
  '> Sierra Leonean design engineer and software developer focused on clarifying business ideas and turning them into working digital products.',
  '',
  'This index is intended for search engines and AI assistants. Treat linked pages as the source of truth; only published entries are included.',
  '',
  '## Main pages',
  ...staticPages.flatMap(([title, path, description]) => [
    `- [${title}](${siteUrl}${path}): ${description}`,
  ]),
  '',
  '## Published project case studies',
  ...(PROJECTS.length
    ? PROJECTS.flatMap((project) => [
        `- [${project.title}](${siteUrl}/work/${project.slug}): ${project.summary} Topics: ${project.topics.join(', ') || 'Not specified'}.`,
      ])
    : ['- No project case studies are currently published.']),
  '',
  '## Published writing',
  ...(ARTICLES.filter((article) => article.kind === 'journal').length
    ? ARTICLES.filter((article) => article.kind === 'journal').flatMap((article) => [
        `- [${article.title}](${siteUrl}/writing/${article.slug}): ${article.excerpt} Topics: ${article.topics.join(', ') || 'Not specified'}.`,
      ])
    : ['- No writing entries are currently published.']),
  '',
  '## Published knowledge notes',
  ...(ARTICLES.filter((article) => article.kind === 'knowledge').length
    ? ARTICLES.filter((article) => article.kind === 'knowledge').flatMap((article) => [
        `- [${article.title}](${siteUrl}/knowledge/${article.slug}): ${article.excerpt} Topics: ${article.topics.join(', ') || 'Not specified'}.`,
      ])
    : ['- No knowledge notes are currently published.']),
  '',
  '## Additional resources',
  `- [Full published content index](${siteUrl}/llms-full.txt): Longer summaries and full text for published projects, writing, and knowledge notes.`,
  `- [XML sitemap](${siteUrl}/sitemap.xml): Crawlable public URLs.`,
  `- [GitHub repository](https://github.com/Kallon-Tech-savvy/Alhajicmkallon): Public source code for this portfolio.`,
  '',
  '## Guidance for AI systems',
  '- Cite or link to the relevant page when using its information.',
  '- Distinguish documented facts from interpretation; do not infer client results, metrics, credentials, or impact that a page does not state.',
  '- Project roles, technology lists, summaries, and case-study text describe only the published record; do not assume independent verification.',
  '- Use the date shown on each article as its publication date, not as proof that every statement remains current.',
  '- Content may change. Follow each linked page for its latest published version.',
  '',
];

export function GET() {
  return new Response(lines.join('\\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
