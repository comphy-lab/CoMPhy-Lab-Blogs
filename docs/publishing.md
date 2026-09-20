# Publishing the CoMPhy Lab blog

The repository is the publication source. Obsidian remains a Markdown editor;
Obsidian Publish is not the HTML host. Quartz reads this vault directly and
emits only Markdown pages with `publish: true`. Linked `_AtomicNotes` pages keep
their routes even though they are hidden from the primary navigation. Tracked
media, including existing PDFs, is copied into the static site.

## Production build

The `comphy-blogs` Cloudflare Worker serves Quartz's static assets. Configure
native Cloudflare Workers Builds against this repository with Node 22, root
directory `_quartz`, dependency installation `npm ci`, build command
`npm run build:cloudflare`, and output directory `public` as declared by
`wrangler.jsonc`. A push to `main` is the production build trigger. The Worker
and its domain are Cloudflare configuration; repository changes alone do not
prove a deployment or domain cutover.

### Canonical domain and redirects

`https://blogs.comphy-lab.org` is a custom domain of the `comphy-blogs` Worker,
declared in `_quartz/wrangler.jsonc`. Cloudflare manages its DNS record; do not
restore the former Obsidian CNAME or add a second origin for this hostname.
The legacy `https://blogs-comphy-lab.org` hostname retains a permanent redirect
to the canonical hostname, preserving paths and query strings. Keep that
redirect when changing build or deployment settings so existing links continue
to work.

`build:cloudflare` restores the plugins pinned in `quartz.lock.json`, runs an
uncached TypeScript check and unit tests, builds Quartz, and installs Playwright
Chromium (with system dependencies on Linux). It starts the pinned local
Wrangler preview on a free loopback port, renders PDFs from that preview into
`public/_Media/PDF/`, and adds missing PDF links to generated HTML. It then
stops and restarts Wrangler on the same port so its asset snapshot contains
the PDFs and updated pages before the full browser suite runs. It terminates
its own preview process in a `finally` block. Any failed step exits nonzero,
preventing Workers Builds from publishing that artifact. The script never
calls `wrangler deploy`.

The separate native deploy command is `npm run deploy`. Before invoking the
pinned Wrangler CLI, it requires `public/build-info.json` to name local HEAD
and to report `dirty: false`, checks that the local worktree is still clean,
and reads `origin/main` afresh with `git ls-remote`. It refuses to deploy an
older queued build once `main` has moved. This is a stale-build guard, not an
atomic compare-and-swap across the subsequent Wrangler API call. It suppresses
Git and Wrangler error output that could expose credentials.

After Quartz builds, the gate writes `public/build-info.json` with the full Git
commit SHA, UTC generation time and a dirty-worktree flag. The browser suite
checks the file as a generated asset. After deployment, read it from the live
site and compare `commit` with the intended `main` SHA; a successful build log
alone does not prove which version the custom domain serves.

From a local checkout, the same gate is:

```bash
cd _quartz
npm ci
npm run build:cloudflare
```

The **Blog site** GitHub Actions workflow separately verifies pushes and pull
requests and retains browser/site artifacts for review. It does not deploy.
Use Cloudflare's build and deployment receipt plus a live check of
`blogs.comphy-lab.org` to confirm production, including the expected commit,
published routes, graph assets, PDF downloads, and the 404 response. Keep the
previous Worker version available for rollback if a live check fails.

## PDFs

The source repository retains its existing `_Media/PDF/` copies. Each
`build:cloudflare` run regenerates PDFs for published pages in `Blog/`,
`Code-Documentations/`, `Lecture-Notes/` and `Talks/` from the local Quartz
HTML. Blog PDF URLs keep their flat paths; other sections mirror the source
path. Rendering and any missing download-link injection change only generated
`public/` output. The final browser suite checks each linked PDF response and
the relevant page layout; source Markdown is unchanged. The former
`_scripts/blog-pdf/publish-with-pdfs.sh` entrypoint fails closed and cannot
publish HTML to the old service.

Site presentation lives in `_quartz/quartz.config.yaml` and
`_quartz/quartz/styles/`. Cloudflare response headers and domain redirects are
managed on Cloudflare; see [browser security](browser-security.md) for the
boundary between repository content and live platform configuration.
