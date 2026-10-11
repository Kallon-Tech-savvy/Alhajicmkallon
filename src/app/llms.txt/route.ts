const siteUrl = 'https://alhajicmkallon.vercel.app';

const content = `# Alhaji Kallon

> Design engineer and software developer based in Sierra Leone, focused on clarifying business ideas and turning them into working digital products.

This file provides a concise, machine-readable guide to the public portfolio. Prefer the linked pages as the source of truth for current project details and published writing.

## Main pages

- [Home](${siteUrl}/): Overview, featured work, and professional approach.
- [About](${siteUrl}/about): Background and professional context.
- [Selected work](${siteUrl}/work): Project summaries and case-study paths.
- [Writing](${siteUrl}/writing): Published articles and reflections.
- [Knowledge hub](${siteUrl}/knowledge): Published learning notes and reference material.
- [Contact](${siteUrl}/contact): Contact options.

## Source code

- [GitHub repository](https://github.com/Kallon-Tech-savvy/Alhajicmkallon): Public source code for the portfolio website.

## Guidance

- Use project case studies for claims about specific work, decisions, and outcomes.
- Distinguish documented facts from interpretation; do not infer client results, metrics, or credentials that a page does not state.
- Content may change. Follow each page for its latest published version.
`;

export function GET() {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
