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
npm run plugins:restore   # installs the pinned community plugins
npm run build
```

The production gate is `npm run build:cloudflare` after `npm ci`. It performs
the plugin restore, type check, unit tests, site build, local-preview PDF
generation, and full browser suite before returning an artifact to Workers
Builds. See [publishing](../docs/publishing.md).

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
npm_config_ignore_scripts=false npm run plugins:restore
```

## Local preview

`wrangler.jsonc` describes the site as an assets-only Cloudflare Worker.
Wrangler serves the build output with the same routing rules as production:

```bash
npx wrangler dev --ip 127.0.0.1 --port 8790
```

Fonts use same-origin URLs. To generate preview metadata and sitemap URLs,
build with `QUARTZ_BASE_URL=<host[:port]>`; leave it unset for production. Restart
`wrangler dev` after each rebuild, because Quartz recreates the output folder.

## Customisation

- `quartz.config.yaml`: site title, base URL, theme colours and fonts, and the
  plugin list. MathJax is the LaTeX engine to match Obsidian's rendering.
- `quartz/styles/custom.scss`: styles for the vault's custom callout types
  (`significance`, `pdf`, `link`, `meta`).
- `../index.md`: the landing page, which transcludes `0_README.md`.

## Verification and deployment

`npm test` runs the generator's unit tests. After `npm run build`, start
`npm run preview` and run `npm run test:e2e` in another terminal. The browser
suite needs `npx playwright install chromium` once. Set `E2E_BASE_URL` to test
another preview origin. Fonts use same-origin paths in all environments.

The suite visits every generated page at desktop and mobile widths, follows
aliases, verifies article identity, traverses every indexed route through the
SPA, and checks internal links, heading anchors and all emitted assets. PDF
responses must contain PDF bytes. Search navigation, graph rendering, theme,
previews, mobile navigation, browser history and the real 404 response are also
checked. Results and screenshots are written to `output/playwright/`.

The **Blog site** GitHub Actions workflow verifies every push and pull request,
including feature branches, and uploads the browser report and generated site
as review artifacts. It does not deploy. Native Cloudflare Workers Builds is
the sole production publisher from `main`; its build command is
`npm run build:cloudflare`, with `_quartz` as root and `public` as the static
asset directory. The domain is managed in Cloudflare rather than this file.
The build command does not deploy directly.
The separate `npm run deploy` command checks that the generated build receipt,
clean checkout and freshly read `origin/main` all name the same commit before
it invokes pinned Wrangler. See [publishing](../docs/publishing.md).

The existing checked-in `_Media/PDF/` files remain in the source repository.
The build regenerates PDFs from local Quartz pages into `public/_Media/PDF/`,
refreshes the preview, and checks links and PDF bytes in the browser suite.
The former Obsidian Publish wrapper fails closed. See
[publishing](../docs/publishing.md) for the current publication and PDF
contract.
