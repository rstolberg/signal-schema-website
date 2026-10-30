#!/usr/bin/env node
// Copies publishable notes from an Obsidian folder into the site's content folder.
//
//   node scripts/works/sync.mjs            notes with `publish: true`
//   node scripts/works/sync.mjs --drafts   every note (local preview only; never commit)
//
// Where things live is set in works.config.json (or WORKS_SOURCE / WORKS_VAULT).
// The destination folders are owned by this script: files no longer published are removed.
import { readFile, writeFile, readdir, mkdir, rm, copyFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { stringify as toYaml } from 'yaml';
import { splitFrontmatter, slugify } from './parse.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const config = JSON.parse(await readFile(path.join(root, 'works.config.json'), 'utf8'));
const home = (p) => p.replace(/^~(?=\/|$)/, os.homedir());
const source = home(process.env.WORKS_SOURCE ?? config.source);
const vault = home(process.env.WORKS_VAULT ?? config.vault ?? source);
const dest = path.join(root, config.content);
const assetDest = path.join(root, config.assets);
const assetUrl = '/' + config.assets.replace(/^static\//, '');
const drafts = process.argv.includes('--drafts');

if (!existsSync(source)) {
  console.error(`works: source folder not found: ${source}`);
  process.exit(1);
}

// Only the keys the site uses are published; the rest of a note's frontmatter stays private.
const PUBLIC_KEYS = ['title', 'kind', 'summary', 'date', 'updated', 'status', 'access', 'for', 'stack', 'topics', 'related', 'featured', 'cta'];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const notes = [];
for (const file of (await walk(source)).filter((f) => f.endsWith('.md'))) {
  const { data, body } = splitFrontmatter(await readFile(file, 'utf8'));
  const name = path.basename(file, '.md');
  if (data.publish !== true && !drafts) continue;
  notes.push({ file, name, data, body, slug: slugify(data.slug ?? name) });
}

const dupes = notes.map((n) => n.slug).filter((s, i, a) => a.indexOf(s) !== i);
if (dupes.length) {
  console.error(`works: two notes share the slug "${dupes[0]}". Set a different \`slug:\` on one.`);
  process.exit(1);
}

// Attachments are looked up by file name anywhere in the vault, the way Obsidian resolves them.
let vaultFiles;
async function findAttachment(name) {
  vaultFiles ??= await walk(vault).catch(() => []);
  return vaultFiles.find((f) => path.basename(f) === path.basename(name));
}

const bySlugName = new Map(notes.map((n) => [n.name.toLowerCase(), n.slug]));
const warnings = [];

async function transform(note) {
  let body = note.body.replace(/%%[\s\S]*?%%/g, '');
  const copies = [];

  // ![[image.png|alt]] → copied next to the page
  const embeds = [...body.matchAll(/!\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g)];
  for (const [whole, target, alt] of embeds) {
    const found = await findAttachment(target.trim());
    if (!found || found.endsWith('.md')) {
      warnings.push(`${note.name}: dropped embed ${whole} (not an attachment in the vault)`);
      body = body.replace(whole, '');
      continue;
    }
    const file = slugify(path.basename(found, path.extname(found))) + path.extname(found).toLowerCase();
    copies.push([found, file]);
    const label = alt && !/^\d+(x\d+)?$/.test(alt) ? alt : path.basename(found, path.extname(found));
    body = body.replace(whole, `![${label}](${assetUrl}/${note.slug}/${file})`);
  }

  // [[Note|label]] → link if that note is published too, plain text otherwise
  body = body.replace(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g, (_, target, label) => {
    const slug = bySlugName.get(target.trim().toLowerCase());
    const text = (label ?? target).trim();
    return slug ? `[${text}](/works/${slug}/)` : text;
  });

  return { body: body.trim() + '\n', copies };
}

await mkdir(dest, { recursive: true });
await mkdir(assetDest, { recursive: true });
const keep = new Set();
const keepAssets = new Set();

for (const note of notes) {
  const { body, copies } = await transform(note);
  const fm = Object.fromEntries(PUBLIC_KEYS.filter((k) => note.data[k] != null).map((k) => [k, note.data[k]]));
  if (!fm.title) fm.title = note.name;
  // related: [[Note]] or note names → slugs of published works
  if (fm.related) fm.related = [].concat(fm.related).map((r) => {
    const name = String(r).replace(/^\[\[|\]\]$/g, '').split('|')[0].trim();
    return bySlugName.get(name.toLowerCase()) ?? slugify(name);
  });
  if (!fm.date) fm.date = (await stat(note.file)).mtime.toISOString().slice(0, 10);
  const out = `---\n${toYaml(fm).trim()}\n---\n\n${body}`;
  const target = path.join(dest, `${note.slug}.md`);
  const prev = existsSync(target) ? await readFile(target, 'utf8') : '';
  if (prev !== out) await writeFile(target, out);
  keep.add(`${note.slug}.md`);

  if (copies.length) {
    const dir = path.join(assetDest, note.slug);
    await mkdir(dir, { recursive: true });
    for (const [from, file] of copies) await copyFile(from, path.join(dir, file));
    keepAssets.add(note.slug);
  }
  console.log(`works: ${note.data.publish === true ? 'publish' : 'draft  '} ${note.slug}  ← ${path.relative(source, note.file)}`);
}

for (const f of await readdir(dest)) if (f.endsWith('.md') && !keep.has(f)) {
  await rm(path.join(dest, f));
  console.log(`works: removed ${f}`);
}
for (const d of await readdir(assetDest)) if (!keepAssets.has(d)) await rm(path.join(assetDest, d), { recursive: true });

for (const w of warnings) console.warn(`works: warning: ${w}`);
if (!notes.length) console.log(`works: nothing marked \`publish: true\` in ${source}`);
