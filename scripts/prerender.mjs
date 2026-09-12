import { createServer } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

// Render the same component used by the browser; no duplicated homepage copy.
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
});
try {
  const { default: App } = await server.ssrLoadModule('/src/app/App.tsx');
  const html = await readFile('dist/index.html', 'utf8');
  const marker = '<div id="root"></div>';
  if (!html.includes(marker)) throw new Error('Missing prerender root');
  await writeFile('dist/index.html', html.replace(marker, () => `<div id="root">${renderToString(createElement(App))}</div>`));
} finally {
  await server.close();
}
