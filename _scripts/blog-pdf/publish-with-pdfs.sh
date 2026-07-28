#!/bin/zsh

set -euo pipefail

vault="/Users/vatsal/.openclaw/workspace-archiver/CoMPhy-Lab-Blogs"
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

# Publish current Markdown and media, then render the live pages.
/opt/homebrew/bin/node /opt/homebrew/bin/ob publish --yes --path "$vault"
/opt/homebrew/bin/node "$builder" --no-write-links

# Upload newly generated PDFs from the already-included _Media directory.
/opt/homebrew/bin/node /opt/homebrew/bin/ob publish --yes --path "$vault"

# The first pass can add a link before its PDF target exists. Verify every live
# link after the PDF upload, allowing a bounded window for Publish propagation.
/opt/homebrew/bin/node "$builder" --no-write-links --verify-links-only

echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') publish completed"
