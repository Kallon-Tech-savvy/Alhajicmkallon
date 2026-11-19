import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function parseScalar(raw) {
  const value = raw.trim();
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value.startsWith('[') || value.startsWith('{')) {
    try { return JSON.parse(value); }
    catch { throw new Error('Frontmatter arrays/objects must use valid JSON syntax: ' + value); }
  }
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) return value.slice(1, -1);
  return value;
}

export function parseDocument(source, filePath = '<content>') {
  const normalized = source.replace(/^\uFEFF/, '');
  if (!normalized.startsWith('---\n')) throw new Error(filePath + ': document must start with YAML frontmatter (---)');
  const end = normalized.indexOf('\n---', 4);
  if (end < 0) throw new Error(filePath + ': missing closing frontmatter delimiter');
  const metadata = {};
  for (const [index, line] of normalized.slice(4, end).split('\n').entries()) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const match = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!match) throw new Error(filePath + ':' + (index + 2) + ': unsupported frontmatter syntax');
    const [, key, raw] = match;
    if (Object.hasOwn(metadata, key)) throw new Error(filePath + ': duplicate frontmatter field "' + key + '"');
    metadata[key] = parseScalar(raw);
  }
  return { metadata, body: normalized.slice(end + 4).trim() };
}

function requireString(metadata, key, filePath) {
  if (typeof metadata[key] !== 'string' || !metadata[key].trim()) throw new Error(filePath + ': "' + key + '" must be a non-empty string');
  return metadata[key].trim();
}
function requireStringArray(metadata, key, filePath) {
  const value = metadata[key] ?? [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new Error(filePath + ': "' + key + '" must be an inline JSON array of non-empty strings');
  }
  return value;
}
function validateCommon(metadata, filePath, type) {
  const slug = requireString(metadata, 'slug', filePath);
  if (!slugPattern.test(slug)) throw new Error(filePath + ': invalid slug "' + slug + '"');
  const status = metadata.status ?? 'draft';
  if (!['draft', 'published'].includes(status)) throw new Error(filePath + ': status must be "draft" or "published"');
  const title = requireString(metadata, 'title', filePath);
  const summary = requireString(metadata, type === 'project' ? 'summary' : 'excerpt', filePath);
  const topics = requireStringArray(metadata, 'topics', filePath);
  if (type === 'article') {
    requireString(metadata, 'category', filePath);
    if (metadata.cover !== undefined) {
      const cover = metadata.cover;
      if (!cover || typeof cover !== 'object' || Array.isArray(cover)
        || typeof cover.src !== 'string' || !/^\/assets\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpe?g)$/.test(cover.src)
        || typeof cover.alt !== 'string' || !cover.alt.trim()
        || !Number.isInteger(cover.width) || cover.width < 1 || cover.width > 10000
        || !Number.isInteger(cover.height) || cover.height < 1 || cover.height > 10000) {
        throw new Error(filePath + ': cover requires a local asset, descriptive alt and valid dimensions');
      }
    }
    if (metadata.level && !['beginner', 'intermediate', 'junior'].includes(metadata.level)) throw new Error(filePath + ': invalid learning level');
    for (const key of ['prerequisites', 'objectives', 'sources']) requireStringArray(metadata, key, filePath);
    for (const source of metadata.sources ?? []) {
      try { if (new URL(source).protocol !== 'https:') throw new Error(); }
      catch { throw new Error(filePath + ': sources must be HTTPS URLs'); }
    }
    if (!datePattern.test(requireString(metadata, 'date', filePath))) throw new Error(filePath + ': date must use YYYY-MM-DD');
    if (!['journal', 'knowledge'].includes(metadata.kind)) throw new Error(filePath + ': kind must be "journal" or "knowledge"');
  } else {
    requireString(metadata, 'role', filePath);
    requireStringArray(metadata, 'technologies', filePath);
    if (status === 'published' && !metadata.publishedAt) throw new Error(filePath + ': published projects require publishedAt');
    if (metadata.publishedAt && !datePattern.test(metadata.publishedAt)) throw new Error(filePath + ': publishedAt must use YYYY-MM-DD');
  }
  return { slug, title, status, summary, topics };
}
async function walk(directory) {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(fullPath);
    else if (entry.isFile() && entry.name.endsWith('.mdx')) files.push(fullPath);
  }
  return files;
}
export async function buildContentIndex({ projectRoot = root, destination = path.join(projectRoot, 'src/packages/content/lib/generated-content.ts') } = {}) {
  const contentRoot = path.join(projectRoot, 'content');
  const outputPath = destination;
  const articles = [];
  const projects = [];
  const slugs = new Set();
  for (const [folder, type] of [['journal', 'article'], ['knowledge', 'article'], ['projects', 'project']]) {
    for (const filePath of await walk(path.join(contentRoot, folder))) {
      const relative = path.relative(projectRoot, filePath);
      const parsed = parseDocument(await readFile(filePath, 'utf8'), relative);
      const { metadata, body } = parsed;
      const common = validateCommon(metadata, relative, type);
      if (type === 'article' && metadata.kind !== (folder === 'journal' ? 'journal' : 'knowledge')) throw new Error(relative + ': kind must match folder ' + folder);
      if (slugs.has(common.slug)) throw new Error('Duplicate content slug across content types: "' + common.slug + '"');
      slugs.add(common.slug);
      if (!body) throw new Error(relative + ': Markdown body must not be empty');
      if (common.status !== 'published') continue;
      if (type === 'article') articles.push({
        slug: common.slug, title: common.title, category: metadata.category, topics: common.topics,
        date: metadata.date, readTime: metadata.readTime, excerpt: common.summary, content: body,
        status: common.status, kind: metadata.kind, level: metadata.level, cover: metadata.cover,
        prerequisites: metadata.prerequisites ?? [], objectives: metadata.objectives ?? [], sources: metadata.sources ?? [],
      });
      else projects.push({
        id: common.slug, slug: common.slug, title: common.title, role: metadata.role, summary: common.summary,
        description: body, body, topics: common.topics, technologies: requireStringArray(metadata, 'technologies', relative),
        status: common.status, publishedAt: metadata.publishedAt, image: metadata.image, links: metadata.links,
      });
    }
  }
  await mkdir(path.dirname(outputPath), { recursive: true });
  const output = "// Generated by scripts/build-content-index.mjs. Do not edit by hand.\nimport type { Article, Project } from '../types';\nexport const generatedArticles: Article[] = " + JSON.stringify(articles, null, 2) + ";\nexport const generatedProjects: Project[] = " + JSON.stringify(projects, null, 2) + ";\n";
  await writeFile(outputPath, output, 'utf8');
  return { articles: articles.length, projects: projects.length };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await buildContentIndex();
    console.log('Content index generated: ' + result.articles + ' article(s), ' + result.projects + ' project(s).');
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
