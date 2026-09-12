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

The build prerenders the React homepage into `dist/index.html`; the browser hydrates
that same markup. Use `npm run build`, not bare `vite build`, for production.
The homepage and booking links remain usable without JavaScript. Calendly links
open the booking page directly, so third-party widget assets are not loaded.

`static/404.html` disables Cloudflare Pages' implicit SPA fallback and gives unknown
paths a real 404 response. `static/sitemap.xml` lists published canonical pages;
update it when adding pages. `static/robots.txt` advertises the sitemap. Cloudflare's
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
