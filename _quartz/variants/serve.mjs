// Static preview servers for the design variants: one port per variant plus
// an index page. Mirrors the Cloudflare assets routing used in production
// (extensionless HTML, folder index, trailing-slash redirect, 404 page).
import http from "node:http"
import fs from "node:fs"
import path from "node:path"
import { VARIANTS, REVIEW_HOST, INDEX_PORT, CURRENT_PORT } from "./variants.mjs"

const root = path.resolve(import.meta.dirname, "..")
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".txt": "text/plain; charset=utf-8",
}

function send(res, status, file) {
  const ext = path.extname(file).toLowerCase()
  res.writeHead(status, {
    "content-type": types[ext] ?? "application/octet-stream",
    "cache-control": "no-store",
  })
  fs.createReadStream(file).pipe(res)
}

function serveDir(dir) {
  return (req, res) => {
    const url = new URL(req.url, "http://localhost")
    let pathname
    try {
      pathname = decodeURIComponent(url.pathname)
    } catch {
      res.writeHead(400).end()
      return
    }
    if (pathname.includes("..")) {
      res.writeHead(400).end()
      return
    }
    const candidates = []
    if (pathname.endsWith("/")) {
      candidates.push(path.join(dir, pathname, "index.html"))
    } else {
      candidates.push(path.join(dir, pathname))
      candidates.push(path.join(dir, `${pathname}.html`))
    }
    for (const file of candidates) {
      if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        send(res, 200, file)
        return
      }
    }
    // Folder page: redirect to trailing slash, as Cloudflare does.
    if (!pathname.endsWith("/") && fs.existsSync(path.join(dir, pathname, "index.html"))) {
      res.writeHead(307, { location: `${url.pathname}/${url.search}` }).end()
      return
    }
    const notFound = path.join(dir, "404.html")
    if (fs.existsSync(notFound)) send(res, 404, notFound)
    else res.writeHead(404, { "content-type": "text/plain" }).end("Not found")
  }
}

const servers = []
for (const variant of VARIANTS) {
  const dir = path.join(root, "public-variants", variant.key)
  if (!fs.existsSync(dir)) {
    console.warn(`skipping ${variant.key}: ${dir} not built`)
    continue
  }
  const server = http.createServer(serveDir(dir))
  server.listen(variant.port, "127.0.0.1", () =>
    console.log(
      `${variant.key.padEnd(10)} http://127.0.0.1:${variant.port}  https://${REVIEW_HOST}:${variant.port}`,
    ),
  )
  servers.push(server)
}

const escape = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c])
const samplePaths = [
  ["Home", "/"],
  ["Blog index", "/Blog/"],
  ["Viscous drop impact (figures, maths, TOC)", "/Blog/2025-JFM-viscous-drop-impact"],
  ["Dilute polymers (maths-heavy)", "/Blog/2026-Why-Polymers-Arrest-Drops-but-Not-Bubbles"],
  ["Lecture notes folder", "/Lecture-Notes/"],
]
const rows = [
  {
    name: "P · Production candidate (local Wrangler preview of main)",
    port: CURRENT_PORT,
    summary:
      "The production build as it will deploy: A2 · Paper & Ink — Masthead promoted to quartz.config.yaml and custom.scss, with the lab logo and favicon. Served by the same Wrangler assets runtime Cloudflare uses.",
  },
  ...VARIANTS,
]
const index = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>CoMPhy blog design variants</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
:root{--paper:#f3efe8;--ink:#1f1a15;--muted:#625648;--teal:#254c4a;--purple:#68236d;--border:rgba(15,12,8,.12)}
@media(prefers-color-scheme:dark){:root{--paper:#12100d;--ink:#e6dfd0;--muted:#9a8e7d;--teal:#6ac2bd;--purple:#c09bc4;--border:rgba(248,244,236,.12)}}
body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.6 -apple-system,"IBM Plex Sans",system-ui,sans-serif;padding:3rem 1.5rem}
main{max-width:52rem;margin:0 auto}
h1{font-size:1.6rem;letter-spacing:-.02em;margin:0 0 .25rem}
p.lede{color:var(--muted);margin:0 0 2rem}
.eyebrow{font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--purple)}
article{border-top:1px solid var(--border);padding:1.5rem 0}
article h2{font-size:1.2rem;margin:.1rem 0 .4rem}
article h2 a{color:var(--teal);text-decoration:none;border-bottom:1px solid currentColor}
article p{margin:.25rem 0 .75rem;color:var(--muted)}
ul{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:.4rem .9rem;font-size:.85rem}
ul a{color:var(--ink);text-decoration:underline;text-decoration-color:var(--border);text-underline-offset:.15em}
code{font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace;font-size:.85em}
footer{margin-top:2rem;color:var(--muted);font-size:.85rem;border-top:1px solid var(--border);padding-top:1rem}
</style></head><body><main>
<div class="eyebrow">CoMPhy Lab blogs · UI review</div>
<h1>Design variants</h1>
<p class="lede">Round 3. A2 · Paper & Ink — Masthead is the chosen design and is now the production configuration (P). The round-2 alternatives stay up for comparison. Every variant except 0 carries the readable rails, the graph that opens on the current page, hoisted titles, and subsetted preloaded fonts. Toggle dark mode with the moon icon inside each site.</p>
${rows
  .map(
    (r) => `<article>
<div class="eyebrow">port ${r.port}</div>
<h2><a href="https://${REVIEW_HOST}:${r.port}/">${escape(r.name)}</a></h2>
<p>${escape(r.summary)}</p>
<ul>${samplePaths.map(([label, p]) => `<li><a href="https://${REVIEW_HOST}:${r.port}${p}">${escape(label)}</a></li>`).join("")}</ul>
</article>`,
  )
  .join("\n")}
<footer>Served from the office Mac over the tailnet only. Variants are review builds on the <code>design-variants</code> branch of CoMPhy-Lab-Blogs; nothing is deployed.</footer>
</main></body></html>`

http
  .createServer((req, res) => {
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    })
    res.end(index)
  })
  .listen(INDEX_PORT, "127.0.0.1", () =>
    console.log(`index      http://127.0.0.1:${INDEX_PORT}  https://${REVIEW_HOST}:${INDEX_PORT}`),
  )
