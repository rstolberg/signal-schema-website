#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="${CF_PAGES_PROJECT_NAME:-signal-schema}"
BRANCH="${CF_PAGES_BRANCH:-main}"
POLL_SECONDS="${WATCH_POLL_SECONDS:-2}"

fingerprint_sources() {
  find src static index.html package.json vite.config.ts postcss.config.mjs wrangler.toml \
    -type f 2>/dev/null \
    -not -path '*/node_modules/*' \
    -not -path '*/dist/*' \
    -print0 \
    | sort -z \
    | xargs -0 sha256sum 2>/dev/null \
    | sha256sum \
    | awk '{print $1}'
}

build_and_deploy() {
  echo "[watch:deploy] Building..."
  npm run build

  echo "[watch:deploy] Deploying dist/ to Cloudflare Pages project '${PROJECT_NAME}' on branch '${BRANCH}'..."
  npx wrangler pages deploy dist --project-name "${PROJECT_NAME}" --branch "${BRANCH}"
}

last_fingerprint=""

echo "[watch:deploy] Watching source files. Press Ctrl+C to stop."
echo "[watch:deploy] Project: ${PROJECT_NAME}; branch: ${BRANCH}; poll: ${POLL_SECONDS}s"

while true; do
  current_fingerprint="$(fingerprint_sources)"
  if [[ "${current_fingerprint}" != "${last_fingerprint}" ]]; then
    last_fingerprint="${current_fingerprint}"
    build_and_deploy
    echo "[watch:deploy] Waiting for changes..."
  fi
  sleep "${POLL_SECONDS}"
done
