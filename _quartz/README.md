# Site generator for blogs.comphy-lab.org

This folder holds a vendored copy of [Quartz](https://quartz.jzhao.xyz) v5.0.0
that turns the Obsidian vault at the repository root into a static website.
The vault itself is the content directory: wikilinks, embeds, callouts and the
`publish: true` frontmatter flag are read as they are.

## Build

Requires Node 22 or later.

```bash
cd _quartz
npm ci
npx quartz plugin restore   # installs the pinned community plugins
npx quartz build -d .. -o public
```

Only pages with `publish: true` are emitted. Non-Markdown files under the
vault (images, PDFs, favicon) are copied as-is, so existing media URLs keep
working. Folders and files listed under `ignorePatterns` in
`quartz.config.yaml` are never part of the site.

If your npm configuration disables lifecycle scripts, the two shared packages
`@quartz-community/utils` and `@quartz-community/types` and every community
plugin will install without their compiled output. Re-run the two install
steps with scripts enabled for that invocation only:

```bash
npm_config_ignore_scripts=false npm ci
npm_config_ignore_scripts=false npx quartz plugin restore
```

## Local preview

`wrangler.jsonc` describes the site as an assets-only Cloudflare Worker.
Wrangler serves the build output with the same routing rules as production:

```bash
npx wrangler dev --ip 127.0.0.1 --port 8790
```

Self-hosted fonts and the sitemap use absolute URLs built from `baseUrl`. To
preview on another host, build with `QUARTZ_BASE_URL=<host[:port]>` so those
URLs point at the preview host; leave it unset for production builds. Restart
`wrangler dev` after each rebuild, because Quartz recreates the output folder.

## Customisation

- `quartz.config.yaml`: site title, base URL, theme colours and fonts, and the
  plugin list. MathJax is the LaTeX engine to match Obsidian's rendering.
- `quartz/styles/custom.scss`: styles for the vault's custom callout types
  (`significance`, `pdf`, `link`, `meta`).
- `../index.md`: the landing page, which transcludes `0_README.md`.
