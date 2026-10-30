// Turns one Markdown work file (frontmatter + body) into the data the site renders.
// Pure: no filesystem, no knowledge of where the file came from.
import { parse as parseYaml } from 'yaml';
import { Marked } from 'marked';

const marked = new Marked({ gfm: true });

export function splitFrontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) return { data: {}, body: raw };
  return { data: parseYaml(m[1]) ?? {}, body: raw.slice(m[0].length) };
}

export function slugify(s) {
  return String(s)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const list = (v) => (v == null ? [] : (Array.isArray(v) ? v : String(v).split(',')).map((x) => String(x).trim()).filter(Boolean));
const isoDate = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v ? String(v).slice(0, 10) : '');

// Obsidian callouts (> [!note] Title) render as labelled asides instead of raw "[!note]" text.
function callouts(html) {
  return html.replace(
    /<blockquote>\s*<p>\[!(\w+)\][-+]?[ \t]*([^\n<]*)\n?/g,
    (_, type, title) => `<blockquote class="callout" data-callout="${type.toLowerCase()}"><p>${title ? `<strong>${title}</strong><br>` : ''}`,
  );
}

export function parseWork(raw, fallbackSlug) {
  const { data, body } = splitFrontmatter(raw);
  const title = String(data.title ?? fallbackSlug);
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug: slugify(data.slug ?? fallbackSlug),
    title,
    kind: data.kind === 'essay' ? 'essay' : 'tool',
    summary: String(data.summary ?? ''),
    date: isoDate(data.date),
    updated: isoDate(data.updated),
    status: data.status ? String(data.status) : '',
    access: data.access ? String(data.access) : '',
    audience: data.for ? String(data.for) : '',
    stack: list(data.stack),
    // `topics`, not `tags`: vault tags are for Obsidian and stay private.
    topics: list(data.topics),
    related: list(data.related).map(slugify),
    featured: data.featured === true,
    cta: data.cta ? String(data.cta) : '',
    minutes: Math.max(1, Math.round(words / 230)),
    html: callouts(marked.parse(body)),
  };
}

// Newest first; featured pieces lead.
export function sortWorks(works) {
  return [...works].sort((a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}
