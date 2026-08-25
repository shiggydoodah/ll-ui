#!/usr/bin/env sh
set -eu

ROOT_DIR="$(git rev-parse --show-toplevel)"
cd "$ROOT_DIR"

staged_files="$(mktemp "${TMPDIR:-/tmp}/llui-staged-files.XXXXXX")"
prettier_files="$(mktemp "${TMPDIR:-/tmp}/llui-prettier-files.XXXXXX")"
trap 'rm -f "$staged_files" "$prettier_files"' EXIT HUP INT TERM

git diff --cached --name-only --diff-filter=ACMR -z >"$staged_files"

if [ ! -s "$staged_files" ]; then
  exit 0
fi

# Keep this list in sync with the `format`/`format:check` globs in the root
# package.json. `.mjs`/`.cjs` are the same language as `.js` under a different
# extension, and the repo's own tooling uses them (`eslint.config.mjs`,
# `packages/ui/scripts/verify-css-exports.mjs`). Omitting an extension means a
# commit touching one of those files lands unformatted and the next
# `pnpm format` reformats the whole file, burying the real diff in a
# quote-style change.
xargs -0 sh -c '
  for file do
    case "$file" in
      *.ts|*.tsx|*.js|*.mjs|*.cjs|*.json|*.md|*.css|*.yml|*.yaml|*.html) printf "%s\0" "$file" ;;
    esac
  done
' sh <"$staged_files" >"$prettier_files"

if [ ! -s "$prettier_files" ]; then
  exit 0
fi

echo "Formatting staged files with Prettier..."
xargs -0 pnpm exec prettier --write --ignore-unknown -- <"$prettier_files"
xargs -0 git add -- <"$prettier_files"
