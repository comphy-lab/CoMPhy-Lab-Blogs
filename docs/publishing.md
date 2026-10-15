# Publishing the CoMPhy Lab blog

The repository is the publication source. Obsidian remains a Markdown editor;
Obsidian Publish is not the HTML host. Quartz reads this vault directly and
emits only Markdown pages with `publish: true`. Linked `_AtomicNotes` pages keep
their routes even though they are hidden from the primary navigation. A page
with `unlisted: true` is likewise published but left out of the Explorer and
folder listings. Lecture notes with a numeric filename prefix are listed in
numeric course order (1, 1.5, 1.75, 2, …). A course taught in several years
keeps one folder per year (for example `Lecture-Notes/Intro-Soft-Matter/2025/`);
old URLs are kept working with 301 rules in `_quartz/quartz/static/_redirects`. Tracked media, including existing
PDFs, is copied into the static site.

## Authoring

Authors edit in Obsidian, and Obsidian Sync delivers their edits to a single
Git checkout of this repository. Other synced copies of the vault carry no
`.git`, and Sync excludes `.git/` and `_quartz/`, so build tooling never
syncs. In the checkout, the author's edits are uncommitted changes. They are
reviewed against the privacy boundary in `AGENTS.md` and committed on their
own before any other change; they are never reset, cleaned or stashed. A
publish then typesets changed lecture notes (see below), passes
`npm run build:cloudflare` and pushes `main`. The push is the release.

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

`build:cloudflare` installs Playwright Chromium and verifies it can launch before
restoring the plugins pinned in `quartz.lock.json`, running an uncached
TypeScript check and unit tests, and building Quartz. Workers Builds uses an
unprivileged build user. On its Ubuntu 24.04 x64 image, the script uses APT's
signed package indexes and dependency resolver to download missing Chromium
runtime packages into `.quartz-cache/browser-runtime`, then extracts them
without installing packages or changing the system. Only browser processes
receive the resulting library and font configuration paths. Unsupported build
images fail before compilation. GitHub Actions explicitly sets
`PLAYWRIGHT_INSTALL_SYSTEM_DEPS=1` to install system dependencies on its runner.
It starts the pinned local
Wrangler preview on a free loopback port, renders PDFs from that preview into
`public/_Media/PDF/`, and adds missing PDF links to generated HTML. It then
stops and restarts Wrangler on the same port so its asset snapshot contains
the PDFs and updated pages before the full browser suite runs. It terminates
its own preview process in a `finally` block. Any failed step exits nonzero,
preventing Workers Builds from publishing that artifact. The script never
calls `wrangler deploy`.

Plugin restoration builds at most three independent plugins at once, then
checks all results before generating the plugin index. Set
`QUARTZ_PLUGIN_BUILD_CONCURRENCY` to an integer from 1 to 4 to tune a build
environment without changing the pinned versions or dropping validation.

The separate native deploy command is `npm run deploy`. Before invoking the
pinned Wrangler CLI, it requires `public/build-info.json` to name local HEAD
and to report `dirty: false`, checks that the local worktree is still clean,
and reads `origin/main` afresh with `git ls-remote`. It refuses to deploy an
older queued build once `main` has moved. This is a stale-build guard, not an
atomic compare-and-swap across the subsequent Wrangler API call. It suppresses
Git error output that could expose credentials; Wrangler keeps its deployment
diagnostics visible.

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

The source repository retains its existing `_Media/PDF/` copies. Lecture notes
can use locally typeset PDFs; other sections keep browser PDFs. Both use the
existing download URLs: Blog paths are flat, and other sections mirror the
full source path at any depth under `_Media/PDF/`.

### Typesetting lecture notes locally

Install Pandoc 3.10, TeX Live 2026 (LuaLaTeX, latexmk, TeX Gyre, DejaVu and
tcolorbox) and `rsvg-convert` on the authoring machine. Then run:

```bash
cd _quartz
npm run build:tex-pdfs
# Or regenerate one published page:
npm run build:tex-pdfs -- --only Lecture-Notes/Basilisk101/1-conduction-takeaways.md
```

The command selects `publish: true` Markdown pages anywhere under
`Lecture-Notes/`. It normalises Obsidian maths with Quartz's own helper,
resolves vault links with Quartz's resolver, converts images locally and uses
Pandoc plus the template/filter in `scripts/tex/` to produce LuaLaTeX PDFs.
It preserves source Markdown. The title comes from the first H1, the date
from frontmatter, and the course from the nearest ancestor `0-README.md` H1
(with a folder-name fallback). Footnotes, numbered references, links, tables,
code and callouts are typeset locally. Bibliography/CSL frontmatter and Pandoc
citations use citeproc when provided. Remote images must first be saved in the
vault; conversion failures use the browser fallback.

Year folders use their own README title, including the year. The title-page
course label retains the full H1; the running header shortens long titles at a
word boundary, preserving a trailing year. Unicode maths uses bold italic
Latin and Greek for `\boldsymbol`, `\bm` and `\mathbf`, and bold calligraphic
letters for nested `\mathcal` tensors. To check the actual PDF glyphs locally,
run `node scripts/tex/verify-maths.mjs` from `_quartz` (requires `pdftotext`
from Poppler as well as Pandoc and LuaLaTeX).

Review the PDFs, then commit `tex-pdfs/manifest.json` together with the relevant
`tex-pdfs/Lecture-Notes/**/*.pdf` files. These tracked source assets deliberately
live under `_quartz/`, which Quartz excludes from its ordinary asset copy.
They cannot be overwritten by the browser exporter. Intermediate Markdown,
Pandoc JSON, `.tex`, compilation logs and converted images stay in the ignored
`.quartz-cache/tex-pdfs/` directory. The per-page summary is `summary.json` there.
Individual conversion failures are reported and omitted from the manifest;
missing tools and filesystem failures exit nonzero. TeX runs without shell
escape, and this command never downloads a TeX distribution.

Maths and raw TeX containing file access, execution or token/macro rewriting
commands are refused with a browser-fallback reason. LuaLaTeX additionally uses
paranoid file access (`openin_any=p`, `openout_any=p`) and no shell escape.
SVGs must be self-contained: resource references may use only `#fragment` or
`data:` URLs; external resources and declarations/escapes that hide them are
refused.

Print raster derivatives never upscale and retain their natural aspect ratio.
Their width is capped at 1900 pixels times the displayed text-width fraction
(approximately 300 dpi), reduced further when the template's height limit
constrains the displayed width. PNG sources, diagrams and images with alpha stay
lossless PNG. JPEG sources without alpha use JPEG quality 88 and 4:4:4 chroma
when the derivative is at least 900 pixels wide; this deliberately conservative
photograph heuristic avoids applying lossy compression to PNG line art.
The derivative policy is included in freshness hashing; original media stay
unchanged.

Each page uses its source file's last Git commit time as `SOURCE_DATE_EPOCH`
with `FORCE_SOURCE_DATE=1`, falling back to 1 January 2000 UTC without Git
history. LuaLaTeX omits volatile PDF dates, source-path metadata and the
automatic trailer ID. With identical inputs and toolchain, clean conversions
produce identical PDF bytes.

### Freshness and deployment

The manifest binds each page to SHA-256 hashes of its Markdown, course README,
referenced local images and bibliography/CSL files, the converter, shared
helpers, template, Lua filter, dependency lock and Quartz configuration. A
hash of the vault filename inventory also detects changes that affect shortest
link resolution. PDF bytes have a separate integrity hash; toolchain versions
are recorded for provenance. Deploys do not run TeX or verify a local TeX
installation.

During `build:cloudflare`, `build-pdfs.mjs` validates the manifest using Node.
A fresh TeX PDF is copied to its public download path. Missing, stale or
damaged TeX output produces a page-specific warning and a new browser PDF.
Staleness never blocks publishing. The report is
`output/tex-pdf-status.json`, with a non-blocking GitHub step summary in CI.
Previously checked-in `_Media/PDF/` assets are replaced in generated `public/`
by whichever exporter was selected, so an old copy cannot silently win.

Rendering and missing download-link injection change only generated `public/`
output. `PDF-EXPORT-IGNORE-START/END` and `BLOG-PDF-LINK-START/END` blocks are
excluded from TeX input; the download callout stays on the website. The final
browser suite checks every published lecture's download link, PDF response
signature and trailer, alongside the existing page-layout checks. The former
`_scripts/blog-pdf/publish-with-pdfs.sh` entrypoint fails closed and cannot
publish HTML to the old service.

Site presentation lives in `_quartz/quartz.config.yaml` and
`_quartz/quartz/styles/`. Cloudflare response headers and domain redirects are
managed on Cloudflare; see [browser security](browser-security.md) for the
boundary between repository content and live platform configuration.
