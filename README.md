# Signal Schema Website

Static Cloudflare Pages-ready website for `signalschema.org`.

## Local preview

```bash
cd /home/rstolberg/Projects/signal_schema_website/public
python -m http.server 8788
```

Then open <http://127.0.0.1:8788>.

## Cloudflare Pages deploy

If Wrangler is authenticated:

```bash
cd /home/rstolberg/Projects/signal_schema_website
npx wrangler pages deploy public --project-name signal-schema --branch main
```

Then attach the custom domain `signalschema.org` in Cloudflare Pages → Custom domains.
# signal-schema-website
