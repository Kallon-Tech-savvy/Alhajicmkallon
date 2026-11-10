import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseDocument } from './build-content-index.mjs';

const root = new URL('../', import.meta.url);
const require = createRequire(import.meta.url);
const dependencies = {};
async function compile(file) {
  const source = await readFile(new URL(file, root), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const exports = {};
  vm.runInNewContext(output, { exports, require: id => dependencies[id] ?? require(id) });
  return exports;
}
dependencies['@/lib/protocol-visuals'] = await compile('src/lib/protocol-visuals.ts');
const { PROTOCOL_LESSONS } = await compile('src/lib/protocol-course.ts');
const { MarkdownContent } = await compile('src/components/MarkdownContent.tsx');
const { ProtocolInfographics } = await compile('src/components/ProtocolInfographics.tsx');
const { ProtocolLessonVisual } = await compile('src/components/ProtocolLessonVisual.tsx');
const escape = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const lab = await readFile(new URL('public/downloads/protocol-lab.mjs',root),'utf8');
let digestInput = lab + JSON.stringify(dependencies['@/lib/protocol-visuals']);
const sections = [];
const notebook = ['# Protocol course — practice notebook','Edition: 10 November 2026','Save a separate copy for your notes. This file has no automatic saving or assessment.',''];
for (const [index, lesson] of PROTOCOL_LESSONS.entries()) {
  const raw = await readFile(new URL(`content/knowledge/${lesson.slug}.md`,root),'utf8');
  digestInput += raw;
  const { metadata, body } = parseDocument(raw, lesson.slug);
  let html = renderToStaticMarkup(React.createElement(React.Fragment,null,
    React.createElement(index === 0 ? ProtocolInfographics : ProtocolLessonVisual, { lessonIndex:index }),
    React.createElement(MarkdownContent,{ source:body })));
  // Namespace repeated heading and diagram identifiers inside each lesson.
  html = html.replace(/id="([^"]+)"/g,(_,id)=>`id="${lesson.slug}--${id}"`).replace(/aria-labelledby="([^"]+)"/g,(_,id)=>`aria-labelledby="${lesson.slug}--${id}"`).replace(/href="#([^"]+)"/g,(_,id)=>`href="#${lesson.slug}--${id}"`);
  sections.push(`<article id="${lesson.slug}"><p>Lesson ${index+1} of 12 · ${escape(metadata.level)}</p><h2>${escape(lesson.title)}</h2><p>${escape(metadata.excerpt)}</p><p><a href="#contents">Course contents</a> · <a href="#notebook">Practice notebook</a></p>${html}</article>`);
  notebook.push(`## ${index+1}. ${lesson.title}`, '', 'Claim or question:', '', 'Expected behavior:', '', 'Observed behavior and safe evidence:', '', 'Assumptions and limits:', '', 'Competing explanation:', '', 'Smallest next test:', '', 'Result and revised understanding:', '', 'Practised on (optional):', '', '');
}
const version = createHash('sha256').update(digestInput + sections.join('')).digest('hex').slice(0,12);
let document = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Software protocols — offline course</title><style>
:root{color-scheme:light dark;font:17px/1.7 system-ui,sans-serif;background:#f4f1ea;color:#20221f}body{max-width:58rem;margin:auto;padding:2rem 1.25rem}a{color:#174e72;text-underline-offset:.2em}h1,h2,h3{line-height:1.2;letter-spacing:-.02em}h1{font-size:2.5rem}h2{font-size:1.8rem;margin-top:2rem}h3{font-size:1.25rem}article,header,section#lab,section#notebook{border-bottom:1px solid #8a8d82;padding:2rem 0}article>h2{font-size:2.2rem}p{margin:1rem 0}figure{margin:2rem 0}figure ol{list-style:none;padding:0;display:grid;gap:1rem}figure li,aside{border:1px solid #8a8d82;border-radius:.5rem;padding:1rem}figure li h3{margin:.5rem 0}figure li p{margin:.5rem 0}table{width:100%;border-collapse:collapse;font-size:.9rem}td,th{border:1px solid #8a8d82;text-align:left;padding:.65rem;vertical-align:top}pre{overflow:auto;white-space:pre;padding:1rem;border:1px solid #8a8d82;font-size:.85rem}code{font-family:ui-monospace,monospace}summary{cursor:pointer;padding:.75rem 0;font-weight:600}details{border-top:1px solid #8a8d82;margin-top:1rem}dt{font-weight:600;margin-top:1rem}dd{margin:0}blockquote{border-left:3px solid #174e72;padding-left:1rem;margin-left:0}pre:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #174e72;outline-offset:3px}[id]{scroll-margin-top:1rem}
.reading-content{overflow-wrap:anywhere}.code-example{min-width:0;max-width:100%;border:1px solid #8a8d82;border-radius:.75rem;overflow:hidden}.code-example figcaption{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.5rem;padding:.65rem 1rem;border-bottom:1px solid #8a8d82;font-size:.8rem}.code-example pre{border:0;margin:0;overflow-wrap:normal;overscroll-behavior-x:contain}.code-example pre:focus-visible{outline-offset:-4px}
@media(prefers-color-scheme:dark){:root{background:#161a1c;color:#f4f1ea}a{color:#a0d4f2}blockquote{border-color:#a0d4f2}}
@media print{:root{color-scheme:light;background:white;color:black;font-size:11pt}body{max-width:none;padding:0}article{break-before:page}pre{white-space:pre-wrap;overflow:visible;overflow-wrap:anywhere}h2,h3{break-after:avoid}details:not([open])>*:not(summary){display:block!important}details{content-visibility:visible}a{color:black}aside,figure li{break-inside:avoid}header a{display:none}.code-example{overflow:visible}.code-example figcaption span:last-child{display:none}}
</style></head><body><header><p>Alhaji C.M. Kallon · Knowledge</p><h1>Software protocols: offline study guide</h1><p>Edition: 10 November 2026 · Content revision ${version}</p><p>All 12 lessons, mechanism maps, worked answers and the local practice server are contained in this file. Reading requires no connection, scripts, fonts or external assets. Source references and links to other website guides require internet access.</p><p>This is a downloaded snapshot, not a live copy. Check the <a href="https://alhajikallon.com/knowledge/protocols">online course</a> for later revisions. Website progress is not copied into this guide. Save notes in the notebook below or in a separate file; typing on this page does not save a record.</p><p>For print or Save as PDF, expand the worked answers you want included before printing. Preview page breaks in your browser. Labs require Node.js 22 or later on a computer; fake credentials and memory-only storage are teaching fixtures.</p></header><nav id="contents" aria-label="Course contents"><h2>Contents</h2><ol>${PROTOCOL_LESSONS.map(l=>`<li><a href="#${l.slug}">${escape(l.title)}</a></li>`).join('')}</ol><p><a href="#notebook">Practice notebook</a> · <a href="#lab">Local practice server source</a></p></nav>${sections.join('\n')}<section id="notebook"><h2>Practice notebook</h2><p>Copy this template into a text file for each lesson. Record only synthetic or appropriately redacted evidence.</p><pre>${escape(notebook.join('\n'))}</pre></section><section id="lab"><h2>Local practice server</h2><p>Copy the code below into a plain text file named protocol-lab.mjs. In its folder run <code>node protocol-lab.mjs</code>. Open a second terminal for the lesson commands. Stop with Ctrl+C. No package installation or API key is needed.</p><pre><code>${escape(lab)}</code></pre></section></body></html>`;
for (const lesson of PROTOCOL_LESSONS) document = document.replaceAll(`href="/knowledge/${lesson.slug}"`,`href="#${lesson.slug}"`);
document = document.replaceAll('href="/knowledge/protocols"','href="#contents"').replaceAll('href="/downloads/protocol-lab.mjs"','href="#lab"').replace(/href="(\/[^\"]*)"/g,(_,path)=>`href="https://alhajikallon.com${path}"`);
await mkdir(new URL('public/downloads/',root),{recursive:true});
await writeFile(new URL('public/downloads/protocol-course-offline.html',root),document);
await writeFile(new URL('public/downloads/protocol-practice-notebook.md',root),notebook.join('\n'));
console.log(`Offline course generated: 12 lessons, revision ${version}.`);
