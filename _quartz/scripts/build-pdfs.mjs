#!/usr/bin/env node

import { createHash } from "node:crypto"
import { readFile, mkdir, rename, stat, writeFile } from "node:fs/promises"
import { resolve, dirname, join, posix, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright"
import matter from "gray-matter"

const quartzRoot = resolve(fileURLToPath(new URL("..", import.meta.url)))
const vaultRoot = resolve(quartzRoot, "..")
const siteRoot = resolve(quartzRoot, "public")
const sections = new Set(["Blog", "Code-Documentations", "Lecture-Notes", "Talks"])
const indexPath = join(siteRoot, "static", "contentIndex.json")

function optionsFrom(argv) {
  const options = {
    baseUrl: process.env.E2E_BASE_URL || "http://127.0.0.1:8790",
    outputDir: join(siteRoot, "_Media", "PDF"),
    only: null,
    injectLinks: false,
  }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--base-url") options.baseUrl = argv[++i]
    else if (arg === "--output-dir") options.outputDir = resolve(argv[++i])
    else if (arg === "--only") options.only = argv[++i]
    else if (arg === "--inject-links") options.injectLinks = true
    else throw new Error(`Unknown option: ${arg}`)
  }
  if (!/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?\/?$/.test(options.baseUrl)) {
    throw new Error("PDF input must be a local HTTP preview")
  }
  options.baseUrl = options.baseUrl.replace(/\/$/, "")
  if (options.injectLinks && options.outputDir !== join(siteRoot, "_Media", "PDF")) {
    throw new Error("Link injection requires the generated site's PDF output directory")
  }
  return options
}

function safePath(root, relativePath) {
  const absolute = resolve(root, relativePath)
  if (absolute !== root && !absolute.startsWith(root + sep)) {
    throw new Error(`Path escapes output root: ${relativePath}`)
  }
  return absolute
}

function pdfPathFor(slug) {
  const section = slug.split("/")[0]
  return `${section === "Blog" ? slug.slice(5) : slug}.pdf`
}

async function publishedPages(only) {
  const index = JSON.parse(await readFile(indexPath, "utf8"))
  const pages = []
  for (const entry of Object.values(index)) {
    const source = entry?.filePath
    if (typeof source !== "string" || !source.endsWith(".md")) continue
    const parts = source.split("/")
    if (
      parts.length < 2 ||
      !sections.has(parts[0]) ||
      parts.some((part) => !part || part === "." || part === "..")
    )
      continue
    if (posix.normalize(source) !== source) continue
    const markdownPath = safePath(vaultRoot, source)
    let markdown
    try {
      markdown = await readFile(markdownPath, "utf8")
    } catch (error) {
      if (error.code === "ENOENT" && posix.basename(source) === "index.md") continue
      throw error
    }
    if (matter(markdown).data.publish !== true) continue
    const sourceStem = source.slice(0, -3)
    const slug = entry.slug
    if (
      typeof slug !== "string" ||
      !slug ||
      slug.startsWith("/") ||
      slug.split("/").some((part) => !part || part === "." || part === "..") ||
      posix.normalize(slug) !== slug
    )
      throw new Error(`Unsafe index slug for ${source}`)
    if (only && only !== slug && only !== source) continue
    const htmlPath = safePath(siteRoot, `${slug}.html`)
    await stat(htmlPath)
    pages.push({
      slug,
      source,
      htmlPath,
      pdfRelativePath: pdfPathFor(sourceStem),
      title: entry.title || posix.basename(slug),
    })
  }
  if (only && pages.length !== 1)
    throw new Error(`Expected one published page for --only ${only}, found ${pages.length}`)
  if (!only && pages.length === 0)
    throw new Error("No published section pages found in the Quartz content index")
  return pages.sort((a, b) => a.slug.localeCompare(b.slug))
}

const printCss = `
  @page { size: A4; margin: 16mm 16mm 18mm; }
  html, body, #quartz-root, .page, #quartz-body { width: 178mm !important;
    min-width: 0 !important; max-width: 178mm !important; margin: 0 !important;
    padding: 0 !important; box-sizing: border-box !important; }
  html, body { background: #fff !important; color: #171717 !important; }
  #quartz-body { display: block !important; width: 178mm !important; max-width: 178mm !important; }
  #quartz-body > .left, #quartz-body > .right, .page-header, footer,
  .page-footer, .backlinks, .graph, .toc, .tags,
  article .callout[data-callout="pdf"] { display: none !important; }
  #quartz-body > .center, article { display: block !important; width: 100% !important;
    max-width: none !important; margin: 0 !important; padding: 0 !important; }
  article { font-size: 10.5pt !important; line-height: 1.48 !important; }
  article p, article li, article blockquote { line-height: 1.48 !important; }
  article h1 { font-size: 20pt !important; margin: 0 0 0.5em !important; }
  article h2 { font-size: 15pt !important; margin-top: 1.4em !important; }
  article h3 { font-size: 12pt !important; margin-top: 1.1em !important; }
  article h1, article h2, article h3, article h4 { break-after: avoid-page; }
  article pre, article table, article figure, article img, article .callout { break-inside: avoid; }
  article img, article svg, article video { max-width: 100% !important; height: auto !important; }
  article mjx-container.MathJax { max-width: 100% !important; overflow: visible !important; }
  article mjx-container.MathJax svg { max-width: 100% !important; height: auto !important; }
  article a { color: #075783 !important; text-decoration: underline; }
  .pdf-video-link { display: block; margin: 0.8em 0; }
`

async function render(browser, pageInfo, options) {
  const context = await browser.newContext({ colorScheme: "light" })
  const page = await context.newPage()
  const outputPath = safePath(options.outputDir, pageInfo.pdfRelativePath)
  const temporaryPath = `${outputPath}.${process.pid}.tmp`
  try {
    const route = pageInfo.slug.split("/").map(encodeURIComponent).join("/")
    const response = await page.goto(`${options.baseUrl}/${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    })
    if (!response?.ok())
      throw new Error(`HTTP ${response?.status() ?? "unknown"} for ${pageInfo.slug}`)
    await page.locator("article").waitFor({ timeout: 30000 })
    const content = page.locator("article")
    if (!(await content.innerText()).trim()) throw new Error(`Empty article: ${pageInfo.slug}`)
    await page.evaluate(async (previewOrigin) => {
      for (const iframe of document.querySelectorAll("article iframe")) {
        const link = document.createElement("a")
        link.href = iframe.src
        link.textContent = iframe.title || "Watch embedded video"
        link.className = "pdf-video-link"
        iframe.replaceWith(link)
      }
      for (const link of document.querySelectorAll("article a[href]")) {
        const raw = link.getAttribute("href")
        if (raw?.startsWith("#")) continue
        const target = new URL(link.href)
        if (target.origin === previewOrigin) {
          link.href = `https://blogs.comphy-lab.org${target.pathname}${target.search}${target.hash}`
        }
      }
      await document.fonts.ready
      await Promise.all(
        [...document.querySelectorAll("article img")].map(async (image) => {
          if (!image.complete)
            await Promise.race([
              new Promise((done) => {
                image.addEventListener("load", done, { once: true })
                image.addEventListener("error", done, { once: true })
              }),
              new Promise((_, fail) =>
                setTimeout(() => fail(new Error(`Image timed out: ${image.src}`)), 15000),
              ),
            ])
          if (!image.naturalWidth) throw new Error(`Image failed to load: ${image.src}`)
        }),
      )
    }, new URL(options.baseUrl).origin)
    await page.addStyleTag({ content: printCss })
    await page.emulateMedia({ media: "print" })
    await mkdir(dirname(outputPath), { recursive: true })
    await page.pdf({
      path: temporaryPath,
      format: "A4",
      printBackground: true,
      tagged: true,
      outline: true,
      margin: { top: "16mm", right: "16mm", bottom: "18mm", left: "16mm" },
    })
    const bytes = await readFile(temporaryPath)
    if (bytes.length < 1024 || bytes.subarray(0, 5).toString() !== "%PDF-") {
      throw new Error(`Invalid or empty PDF for ${pageInfo.slug}`)
    }
    await rename(temporaryPath, outputPath)
    return {
      slug: pageInfo.slug,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    }
  } finally {
    await context.close()
  }
}

async function injectLink(pageInfo) {
  const html = await readFile(pageInfo.htmlPath, "utf8")
  const articleStart = html.indexOf("<article")
  const articleEnd = html.indexOf("</article>", articleStart)
  if (articleStart < 0 || articleEnd < 0)
    throw new Error(`Article not found in ${pageInfo.htmlPath}`)
  const article = html.slice(articleStart, articleEnd)
  if (article.includes("Download this page as PDF")) return false
  const headingEnd = article.indexOf("</h1>")
  if (headingEnd < 0) throw new Error(`Article title not found in ${pageInfo.htmlPath}`)
  const href = `/_Media/PDF/${pageInfo.pdfRelativePath.split("/").map(encodeURIComponent).join("/")}`
  const callout = `<blockquote class="callout pdf" data-callout="pdf"><div class="callout-title"><div class="callout-title-inner"><p>PDF version</p></div></div><div class="callout-content"><p><a href="${href}">Download this page as PDF</a></p></div></blockquote>`
  const insertion = articleStart + headingEnd + "</h1>".length
  await writeFile(
    pageInfo.htmlPath,
    `${html.slice(0, insertion)}${callout}${html.slice(insertion)}`,
    "utf8",
  )
  return true
}

async function main() {
  const options = optionsFrom(process.argv.slice(2))
  const pages = await publishedPages(options.only)
  console.log(`[build-pdfs] rendering ${pages.length} published pages from ${options.baseUrl}`)
  const browser = await chromium.launch({ headless: true, timeout: 60000 })
  const results = []
  try {
    for (const pageInfo of pages) {
      const result = await render(browser, pageInfo, options)
      results.push(result)
      console.log(`[build-pdfs] ${result.slug}: ${result.bytes} bytes`)
    }
  } finally {
    await browser.close()
  }
  if (options.injectLinks) {
    let added = 0
    for (const pageInfo of pages) if (await injectLink(pageInfo)) added++
    console.log(`[build-pdfs] inserted ${added} generated HTML download links`)
  }
  console.log(`[build-pdfs] rendered ${results.length}/${pages.length} PDFs`)
}

main().catch((error) => {
  console.error(`[build-pdfs] ${error.stack || error}`)
  process.exitCode = 1
})
