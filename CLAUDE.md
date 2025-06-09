# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a research blog repository for the Computational Multiphase Physics (CoMPhy) Lab, containing academic content in Markdown format. The site is published at [blogs-comphy-lab.org](https://blogs-comphy-lab.org/).

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
2. Git version control for collaboration
3. Website deployment at blogs-comphy-lab.org

The repository supports both individual researchers and collaborative editing through GitHub's issue templates and pull request workflow.