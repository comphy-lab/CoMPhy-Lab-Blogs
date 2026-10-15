# CoMPhy Lab Blogs

This file provides repository guidance for content and publishing work.

## Repository Overview

This is a research blog repository for the Computational Multiphase Physics (CoMPhy) Lab, containing academic content in Markdown format. The canonical site is [blogs.comphy-lab.org](https://blogs.comphy-lab.org/); the old hostname redirects there.

## Privacy Boundary

Treat this repository as public and publishable. Do not add personal admin notes, medical records, GP/NHS material, appointment details, identifiers, addresses, travel documents, finance paperwork, or private tasks here.

Automation may read designated public-safe inputs, but it must not write or
normalise private, administrative, or medical material inside this repository.
Route private material only to approved private storage, and do not name
private files, vaults, services, or paths in this public repository.

## Content Structure

- `Blog/` - Research blog posts and updates
- `Code-Documentations/` - Technical documentation
- `Lecture-Notes/` - Teaching materials and course content
- `Talks/` - Presentation materials and abstracts
- `_AtomicNotes/` - Atomic knowledge pieces (linked notes)
- `_Media/` - Images and media files
- `_scripts/` - Jupyter notebooks for generating figures

## Content Format

### Markdown Files

All content uses Markdown with YAML frontmatter:

```yaml
---
created: YYYY-MM-DDThh:mm:ss+01:00
modified: YYYY-MM-DDThh:mm:ss+01:00
status: [Published/Working/Draft/done ✅]
website: https://blogs.comphy-lab.org/your-post-url
---
```

### Obsidian Features

- Wiki-style links: `[[post-name]]` and `[[post-name|alias]]`
- Image embedding: `![[_Media/filename.png]]`
- Callouts: `> [!note]`, `> [!tldr]`, `> [!important]`
- Image size: `![caption|750](path.png)` sets the display width; the height follows the image's aspect ratio
- Display maths follows Obsidian: `$$…$$` always renders as display maths, and a fence sharing its line with TeX (`$$\begin{cases}` … `\end{cases}$$`) is split onto its own line at build time (`_quartz/quartz/plugins/site-math.ts`). Use single `$…$` for inline maths

### Lecture notes

- Files in `Lecture-Notes/` with a numeric filename prefix (`0-README`, `1-…`, `1.5-…`, `2-…`, `7-8-…`) are listed in that numeric order in the Explorer and folder pages
- Add `unlisted: true` to a published page that should be reached only through links (for example homework answers); it stays published but is left out of the Explorer and folder listings. Link it from the lecture that uses it
- A course that runs more than once keeps one folder per year (`Lecture-Notes/Intro-Soft-Matter/2025/`, `2026/`). A new year starts by linking to the previous year's notes and adds or revises lectures as they are taught; do not copy a whole year forward. When notes move, add a 301 rule for every old page and PDF URL to `_quartz/quartz/static/_redirects` (slides and old links point at them). Do not use `aliases:` for old paths: alias slugs join link resolution, so a bare `[[2-What-is-Viscosity]]` becomes ambiguous and breaks

## Development Commands

### PDF Export

Typeset published lecture notes locally with Pandoc 3.10 and TeX Live 2026:

```bash
cd _quartz
npm run build:tex-pdfs
```

Review and commit `_quartz/tex-pdfs/manifest.json` and its PDFs together.
Intermediate TeX/logs/images are ignored under `_quartz/.quartz-cache/tex-pdfs/`.
Use `-- --only Lecture-Notes/path.md` for one page. Never hand-edit the manifest
or generated PDFs. See `docs/publishing.md` for dependencies and freshness.

### Content Validation

- Ensure all images exist in `_Media/` directory
- Verify wiki links point to existing content
- Check YAML frontmatter format

## Content Guidelines

### File Organization

- Place new blog posts in `Blog/`
- Store images in `_Media/` with descriptive names
- Use atomic notes in `_AtomicNotes/` for reusable concepts

### Mathematical Content

- Use LaTeX syntax for equations: `$$equation$$` or `$inline$`
- Include Jupyter notebooks in `_scripts/` for computational examples
- Save generated plots to `_Media/`

### Academic Standards

- Include proper citations and references
- Use descriptive filenames without spaces
- Maintain consistent notation across related posts

## Publishing Workflow

Content is edited as public-safe Markdown in Obsidian and versioned in Git.
Quartz builds the site from `publish: true` pages; Cloudflare Workers Builds is
the only production publisher for `blogs.comphy-lab.org` after the cutover.
GitHub Actions verifies pushes and pull requests but does not deploy. Follow
[`docs/publishing.md`](docs/publishing.md) for the build and cutover contract.
Markdown task lists are not a private operations tracker.
The separate `npm run deploy` command refuses a dirty or stale build before
calling Wrangler; it is not an atomic lock on remote `main`.

This repository owns content, local media, Quartz configuration and styles.
Cloudflare owns hosting and response-header configuration; a repository edit
does not prove a live header change. Follow
[`docs/browser-security.md`](docs/browser-security.md) before proposing
browser-header changes.

### PDF copies

- During `build:cloudflare`, `_quartz/scripts/build-pdfs.mjs` copies fresh,
  integrity-checked lecture PDFs from `_quartz/tex-pdfs/` to generated
  `public/_Media/PDF/`. Missing/stale TeX output warns and falls back to browser
  rendering. Production never runs or downloads TeX. Blog, Talks and
  Code-Documentations always retain browser rendering.
  It adds a missing PDF download link to generated HTML only; source Markdown
  is unchanged.
- Blog PDF paths remain `_Media/PDF/<Markdown-filename>.pdf` for compatibility.
  Other sections mirror their vault path under `_Media/PDF/`, preventing
  collisions between nested pages with the same filename.
- The build restarts Wrangler after PDF generation so the final browser gate
  verifies refreshed HTML, PDF links and PDF bytes. Checked-in PDF copies are
  retained as source assets, but the selected build output is deployed. Keep
  TeX source PDFs separate from `_Media/PDF/` to avoid asset-copy collisions.
  Every lecture depth is supported; do not hard-code course/year directories.
- The former Obsidian Publish wrapper fails closed. Do not edit generated PDFs
  manually or describe a PDF as refreshed without a passing build receipt.

The repository supports both individual researchers and collaborative editing through GitHub's issue templates and pull request workflow.
