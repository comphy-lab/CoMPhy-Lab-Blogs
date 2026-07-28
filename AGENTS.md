# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a research blog repository for the Computational Multiphase Physics (CoMPhy) Lab, containing academic content in Markdown format. The site is published at [blogs-comphy-lab.org](https://blogs-comphy-lab.org/).

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
website: https://blogs-comphy-lab.org/your-post-url
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

Content is managed through:
1. Obsidian vault for local editing
2. Headless Obsidian Sync to Worthington
3. Obsidian Publish at blogs.comphy-lab.org
4. Git version control as a secondary backup

### Automated PDF copies

- Every `publish: true` Markdown file under `Blog/`, `Code-Documentations/`, `Lecture-Notes/` and `Talks/` carries a managed `PDF version` callout below its H1 (or below frontmatter when no H1 exists).
- Blog PDF paths remain `_Media/PDF/<Markdown-filename>.pdf` for compatibility. Other sections mirror their vault path under `_Media/PDF/`, preventing collisions between nested pages with the same filename.
- Worthington LaunchAgent `non-ai.comphy.obsidian-publish-blogs` runs `_scripts/blog-pdf/publish-with-pdfs.sh` every 15 minutes.
- The wrapper publishes current HTML, renders changed live pages with headless Chrome, verifies PDF tagging and text extraction, writes the result to `_Media/PDF/`, performs a second ordinary publish pass, then verifies every live download link.
- The renderer fingerprints each source, referenced local media and `publish.css`; unchanged pages are not rebuilt.
- Do not edit generated PDFs manually. Fix the Markdown, media or print CSS and let the publisher rebuild them.
- `_Media` must remain in the Obsidian Publish include list. Never substitute `ob publish --all`.

The repository supports both individual researchers and collaborative editing through GitHub's issue templates and pull request workflow.
