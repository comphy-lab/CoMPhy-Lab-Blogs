#!/bin/zsh

# Retired publication entrypoint. Keep this executable as a fail-closed guard
# until every old scheduler on collaborator machines has been removed.
echo "The Obsidian Publish job is retired. This script does not publish HTML or regenerate PDFs." >&2
echo "Use docs/publishing.md for the Cloudflare Workers Builds workflow." >&2
exit 2
