# Signal Schema Website

Vite + React + Tailwind site for `signalschema.org`, deployed to Cloudflare Pages.
Design exported from Figma Make: <https://www.figma.com/design/HBRl8myprZlSd9XQBYxRNC/Consulting-Company-Website>

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`. Files in `static/` (`_headers`, favicon assets) are copied into the build as-is.

## Deploy

```bash
npx wrangler pages deploy dist --project-name signal-schema --branch main
```

The custom domain `signalschema.org` is attached to the project in Cloudflare Pages → Custom domains.
