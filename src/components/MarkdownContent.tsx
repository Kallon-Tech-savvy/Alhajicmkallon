import React from 'react';

type InlinePart = string | React.ReactElement;

function renderInline(source: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source))) {
    if (match.index > cursor) parts.push(source.slice(cursor, match.index));
    const token = match[0];
    if (token.startsWith('**')) parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith('*')) parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    else if (token.startsWith('`')) parts.push(<code key={match.index} className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em]">{token.slice(1, -1)}</code>);
    else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (!link) parts.push(token);
      else {
        const [, label, href] = link;
        if (/^https:\/\//i.test(href) || href.startsWith('/')) {
          parts.push(<a key={match.index} href={href} className="text-gold underline underline-offset-4" rel={href.startsWith('https://') ? 'noreferrer noopener' : undefined}>{label}</a>);
        } else parts.push(label);
      }
    }
    cursor = match.index + token.length;
  }
  if (cursor < source.length) parts.push(source.slice(cursor));
  return parts;
}

export function MarkdownContent({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/);
  return <div className="space-y-6">{blocks.map((block, index) => {
    const lines = block.split('\n');
    const heading = lines.length === 1 ? lines[0].match(/^(#{1,4})\s+(.+)$/) : null;
    if (heading) {
      const level = heading[1].length;
      const className = 'font-space font-bold tracking-tight text-ivory ' + (level <= 2 ? 'text-2xl md:text-3xl' : level === 3 ? 'text-xl' : 'text-lg');
      if (level <= 2) return <h2 key={index} className={className}>{renderInline(heading[2])}</h2>;
      if (level === 3) return <h3 key={index} className={className}>{renderInline(heading[2])}</h3>;
      return <h4 key={index} className={className}>{renderInline(heading[2])}</h4>;
    }
    if (lines.every((line) => /^\s*[-*]\s+/.test(line))) return <ul key={index} className="list-disc space-y-2 pl-6">{lines.map((line, i) => <li key={i}>{renderInline(line.replace(/^\s*[-*]\s+/, ''))}</li>)}</ul>;
    if (lines.every((line) => /^\s*\d+\.\s+/.test(line))) return <ol key={index} className="list-decimal space-y-2 pl-6">{lines.map((line, i) => <li key={i}>{renderInline(line.replace(/^\s*\d+\.\s+/, ''))}</li>)}</ol>;
    if (lines.every((line) => /^>\s?/.test(line))) return <blockquote key={index} className="border-l-2 border-gold pl-5 italic text-muted">{lines.map((line) => line.replace(/^>\s?/, '')).join(' ')}</blockquote>;
    return <p key={index} className="leading-relaxed text-ivory/90">{lines.map((line, i) => <React.Fragment key={i}>{i > 0 && <br />}{renderInline(line)}</React.Fragment>)}</p>;
  })}</div>;
}
