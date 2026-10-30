#!/usr/bin/env bash
# Sync notes from Obsidian, check the site builds, then commit and push.
# The push triggers the Cloudflare Pages deploy in .github/workflows/deploy.yml.
#
#   publish.sh                    every note with publish: true (removes the rest)
#   publish.sh --only <note.md>   just that note; removes it if publish is not true
set -euo pipefail
cd "$(dirname "$0")/../.."

branch="$(git branch --show-current)"
if [[ "$branch" != main ]]; then
  echo "works: on branch '$branch'; switch to main to publish (only main deploys)" >&2
  exit 1
fi

out="$(node scripts/works/sync.mjs "$@")"
echo "$out"

paths=(content/works static/works)
slug="$(sed -n 's/^works: slug //p' <<<"$out")"
if [[ -n "$slug" ]]; then
  paths=("content/works/$slug.md")
  # the asset folder only exists when the note embeds images (or used to)
  if [[ -e "static/works/$slug" ]] || [[ -n "$(git ls-files "static/works/$slug")" ]]; then
    paths+=("static/works/$slug")
  fi
fi

if [[ -z "$(git status --porcelain -- "${paths[@]}")" ]]; then
  echo "works: no changes to publish"
  exit 0
fi

npm run build >/dev/null
echo "works: build ok"

git add -A -- "${paths[@]}"
changed="$(git diff --cached --name-only -- "${paths[@]}" | grep '\.md$' | xargs -r -n1 basename | sed 's/\.md$//' | paste -sd, - || true)"
verb=Publish
[[ -n "$slug" && ! -e "content/works/$slug.md" ]] && verb=Unpublish
git commit -q -m "$verb works: ${changed:-assets}" -- "${paths[@]}"
git push -q
echo "works: pushed; deploy runs in GitHub Actions"
