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

## Development Commands

### PDF Export
Convert Markdown to PDF using the export script:
```bash
./.obsidian/scripts/export-pdf.sh "filename.md"
```

The script handles:
- Obsidian syntax conversion to standard Markdown
- Image path processing
- Bibliography integration via Pandoc
- LaTeX/XeLaTeX PDF generation

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

- During `build:cloudflare`, `_quartz/scripts/build-pdfs.mjs` renders every
  published page in `Blog/`, `Code-Documentations/`, `Lecture-Notes/` and
  `Talks/` from the local Quartz preview into generated `public/_Media/PDF/`.
  It adds a missing PDF download link to generated HTML only; source Markdown
  is unchanged.
- Blog PDF paths remain `_Media/PDF/<Markdown-filename>.pdf` for compatibility.
  Other sections mirror their vault path under `_Media/PDF/`, preventing
  collisions between nested pages with the same filename.
- The build restarts Wrangler after PDF generation so the final browser gate
  verifies refreshed HTML, PDF links and PDF bytes. Checked-in PDF copies are
  retained as source assets, but the build output is the deployed version.
- The former Obsidian Publish wrapper fails closed. Do not edit generated PDFs
  manually or describe a PDF as refreshed without a passing build receipt.

The repository supports both individual researchers and collaborative editing through GitHub's issue templates and pull request workflow.
