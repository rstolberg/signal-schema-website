#!/usr/bin/env bash
# Sync published notes from Obsidian, check the site builds, then commit and push.
# The push triggers the Cloudflare Pages deploy in .github/workflows/deploy.yml.
set -euo pipefail
cd "$(dirname "$0")/../.."

branch="$(git branch --show-current)"
if [[ "$branch" != main ]]; then
  echo "works: on branch '$branch'; switch to main to publish (only main deploys)" >&2
  exit 1
fi

node scripts/works/sync.mjs

if git diff --quiet -- content/works static/works && [[ -z "$(git ls-files --others --exclude-standard content/works static/works)" ]]; then
  echo "works: no changes to publish"
  exit 0
fi

npm run build >/dev/null
echo "works: build ok"

git add content/works static/works
changed="$(git diff --cached --name-only -- content/works | xargs -r -n1 basename | sed 's/\.md$//' | paste -sd, -)"
git commit -q -m "Publish works: ${changed:-assets}" -- content/works static/works
git push -q
echo "works: pushed; deploy runs in GitHub Actions"
