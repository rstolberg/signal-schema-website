import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

// Render the same components used by the browser; no duplicated page copy.
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
});

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const jsonLd = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

// Swap the homepage's title, description, canonical and social tags for this page's.
function withHead(html, url, route) {
  if (route.page === 'home') return html;
  const set = (re, value) => {
    if (!re.test(html)) throw new Error(`prerender: head tag missing: ${re}`);
    html = html.replace(re, (_, a, b) => `${a}${esc(value)}${b}`);
  };
  set(/(<title>)[^<]*(<\/title>)/, route.title);
  set(/(<meta name="description" content=")[^"]*(")/, route.description);
  set(/(<link rel="canonical" href=")[^"]*(")/, url);
  set(/(<meta property="og:title" content=")[^"]*(")/, route.title);
  set(/(<meta property="og:description" content=")[^"]*(")/, route.description);
  set(/(<meta property="og:url" content=")[^"]*(")/, url);
  set(/(<meta property="og:type" content=")[^"]*(")/, route.page === 'work' ? 'article' : 'website');
  set(/(<meta name="twitter:title" content=")[^"]*(")/, route.title);
  set(/(<meta name="twitter:description" content=")[^"]*(")/, route.description);

  if (route.page === 'work') {
    const w = route.work;
    const ld = {
      '@context': 'https://schema.org',
      '@type': w.kind === 'tool' ? 'TechArticle' : 'Article',
      headline: w.title,
      description: w.summary || undefined,
      url,
      datePublished: w.date || undefined,
      dateModified: w.updated || w.date || undefined,
      keywords: [...w.stack, ...w.topics].join(', ') || undefined,
      author: { '@type': 'Person', name: 'Riley Stolberg' },
      publisher: { '@id': 'https://signalschema.org/#organization' },
      mainEntityOfPage: url,
    };
    html = html.replace('</head>', `    ${jsonLd(ld)}\n  </head>`);
  }
  return html;
}

try {
  const { default: App } = await server.ssrLoadModule('/src/app/App.tsx');
  const { routes } = await server.ssrLoadModule('/src/app/routes.ts');
  const { SITE_URL } = await server.ssrLoadModule('/src/app/site.ts');
  const template = await readFile('dist/index.html', 'utf8');
  const marker = '<div id="root"></div>';
  if (!template.includes(marker)) throw new Error('Missing prerender root');

  const all = routes();
  for (const route of all) {
    const url = SITE_URL + route.path;
    const body = renderToString(createElement(App, { path: route.path }));
    const html = withHead(template, url, route).replace(marker, () => `<div id="root">${body}</div>`);
    const file = path.join('dist', route.path, 'index.html');
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
  }

  const urls = all.map((r) => {
    const lastmod = r.page === 'work' && (r.work.updated || r.work.date);
    return `  <url><loc>${SITE_URL}${r.path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
  });
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  console.log(`prerender: ${all.length} page(s)`);
} finally {
  await server.close();
}
