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

The build prerenders every route (homepage and works pages) to its own `index.html`
with its own title, description and canonical tags; the browser hydrates that same markup. Use `npm run build`, not bare `vite build`, for production.
The homepage and booking links remain usable without JavaScript. Calendly links
open the booking page directly, so third-party widget assets are not loaded.

## Works (tools and writing from Obsidian)

`/works/` lists the tools and essays in `content/works/*.md`; each file becomes
`/works/<slug>/`, a sitemap entry and a "Selected works" row on the homepage. With no
files, none of that renders and the site is the homepage only.

Write in Obsidian at `Projects/Signal Schema/Works/` (template: *Signal Schema Work*).
Frontmatter: `title`, `kind` (`tool` or `essay`), `summary` (one sentence; also the meta
description), `status`, `access`, `for`, `stack` (tools), `topics` (essays), `related`,
`date`, `featured`, `cta`, `slug`, and `publish`. Other keys, vault `tags` and `%% comments %%`
are never copied. `[[links]]` to other published works become links; others become plain text.
`![[image.png]]` embeds are copied to `static/works/<slug>/`.

```bash
npm run works:preview   # every note, drafts included, in the dev server (never commit this)
npm run works:publish   # notes with publish: true → build check → commit → push (deploys)
```

Folder locations are in `works.config.json` (`WORKS_SOURCE` / `WORKS_VAULT` override them).
`content/works/` and `static/works/` are owned by the sync script; edit the notes, not these.

`static/404.html` disables Cloudflare Pages' implicit SPA fallback and gives unknown
paths a real 404 response. The prerender step writes `dist/sitemap.xml` from the
route table in `src/app/routes.ts`. `static/robots.txt` advertises the sitemap. Cloudflare's
managed crawler restrictions remain controlled separately in the dashboard.

## Production checks and remaining account settings

After deploying, verify `/` contains an H1 and body copy in View Source,
`/sitemap.xml` serves XML, `/robots.txt` serves only robots directives (plus any
Cloudflare-managed preamble), and an unknown path returns HTTP 404.

Configure a Cloudflare zone redirect from `www.signalschema.org` to
`https://signalschema.org`, preserving the path and query string, with status 301.
This is an account/DNS setting, not a Pages `_redirects` rule. Verify both HTTP
and HTTPS after configuring it. Submit the sitemap in Google Search Console.

Case studies, testimonials, prices, founder profiles and additional service pages
need verified business information before publication; do not invent proof or claims.

## Deploy

```bash
npx wrangler pages deploy dist --project-name signal-schema --branch main
```

The custom domain `signalschema.org` is attached to the project in Cloudflare Pages → Custom domains.
