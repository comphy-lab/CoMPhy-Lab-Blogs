---
website: https://blogs-comphy-lab.org/
publish: false
status: done
---

# CoMPhy Lab Blog Repository

Welcome to the Computational Multiphase Physics (CoMPhy) Lab's blog repository! This repository hosts our research blog posts, code documentation, lecture notes, and talks. Visit our published content at [blogs-comphy-lab.org](https://blogs-comphy-lab.org/).

## Repository Structure

- `Blog/` - Research blog posts and updates
- `Code-Documentations/` - Technical documentation
- `Lecture-Notes/` - Teaching materials
- `Talks/` - Presentation materials
- `_AtomicNotes/` - Atomic knowledge pieces
- `_Media/` - Images and other media files

## How to Contribute

We welcome contributions from the CoMPhy lab members and collaborators! Here's how you can contribute:

### Adding New Content

1. Fork this repository
2. Create a new `.md` file in the appropriate directory:
   - Research posts → `Blog/`
   - Code docs → `Code-Documentations/`
   - Teaching materials → `Lecture-Notes/`
   - Presentations → `Talks/`
3. Add the required front matter:
   ```yaml
   ---
   created: YYYY-MM-DDThh:mm:ss+01:00
   modified: YYYY-MM-DDThh:mm:ss+01:00
   status: [Published/Working/Draft]
   website: https://blogs-comphy-lab.org/your-post-url
   ---
   ```
4. Write your content using Markdown
5. Submit a Pull Request

### Opening Issues

We have templates for different types of issues:
- [📝 Request New Blog Topic](https://github.com/comphy-lab/CoMPhy-Lab-Blogs/issues/new?template=blog_topic_request.md&labels=blog-request)
- [🔍 Submit Content Correction](https://github.com/comphy-lab/CoMPhy-Lab-Blogs/issues/new?template=content_correction.md&labels=correction)
- [📚 Request Documentation](https://github.com/comphy-lab/CoMPhy-Lab-Blogs/issues/new?template=documentation_request.md&labels=documentation)

### Style Guidelines

- Use Markdown for formatting
- Place images in `_Media/` directory
- Link to other posts using wiki-style links: `[[post-name]]`
- Keep atomic notes in `_AtomicNotes/`

### Local Development

1. Install [Obsidian](https://obsidian.md/) (recommended but not necessary)
2. Clone this repository
3. Open the repository as an Obsidian vault
4. Make your changes
5. Submit a PR

### PDF versions

Published research posts provide a `Download this page as PDF` link below the title. Worthington generates these tagged, text-extractable PDFs from the live Obsidian Publish page and stores them under `_Media/PDF/`. The HTML page remains the canonical accessible version; the PDF is an alternative format for offline reading and printing.

The tracked implementation is in `_scripts/blog-pdf/`. Generated PDFs should not be edited by hand.

For more detailed information about our blog and documentation structure, see [0_README.md](0_README.md).

### Note
- [[favicon.ico]] is the favicon for the website blog.
## License

Content is licensed under [appropriate license - please specify]

## Questions?

Visit our [website](https://comphy-lab.org/) or open an issue for questions.
