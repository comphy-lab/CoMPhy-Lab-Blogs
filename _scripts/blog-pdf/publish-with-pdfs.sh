#!/bin/zsh

set -euo pipefail

vault="/Users/vatsal/.openclaw/workspace/CoMPhy-Lab-Blogs"
builder="$vault/_scripts/blog-pdf/build-blog-pdfs.mjs"
lock_dir="/tmp/non-ai.comphy.obsidian-publish-blogs.lock"

if ! mkdir "$lock_dir" 2>/dev/null; then
  echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') publish skipped: another run holds $lock_dir"
  exit 0
fi
trap 'rmdir "$lock_dir" 2>/dev/null || true' EXIT

echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') publish started"

# Add deterministic PDF links before publishing the HTML readers will see.
/opt/homebrew/bin/node "$builder" --ensure-links-only

# HTML publish is the job's success criterion. PDF render/verify need a
# Playwright Chromium that is often missing or blocked by system Chrome.
/opt/homebrew/bin/node /opt/homebrew/bin/ob publish --yes --path "$vault"

set +e
/opt/homebrew/bin/node "$builder" --no-write-links
pdf_rc=$?
if (( pdf_rc == 0 )); then
  /opt/homebrew/bin/node /opt/homebrew/bin/ob publish --yes --path "$vault"
  upload_rc=$?
  /opt/homebrew/bin/node "$builder" --no-write-links --verify-links-only
  verify_rc=$?
  if (( upload_rc != 0 || verify_rc != 0 )); then
    echo "pdf upload/verify failed (upload=$upload_rc verify=$verify_rc); HTML publish succeeded"
  fi
else
  echo "pdf render failed ($pdf_rc); HTML publish succeeded"
fi
set -e

echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') publish completed"