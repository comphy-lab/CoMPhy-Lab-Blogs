import { chromium } from "playwright"
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import assert from "node:assert/strict"
import matter from "gray-matter"
import { globby } from "globby"
import YAML from "yaml"
import { slugifyFilePath } from "@quartz-community/utils"

const base = (process.env.E2E_BASE_URL ?? "http://127.0.0.1:8790").replace(/\/$/, "")
const publicDir = resolve(process.env.E2E_PUBLIC_DIR ?? "public")
const output = resolve("output/playwright")
mkdirSync(output, { recursive: true })
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [relative(publicDir, join(dir, e.name))],
  )
const files = walk(publicDir)
const encodePath = (path) => path.split("/").map(encodeURIComponent).join("/")
const route = (file) => "/" + encodePath(file.replace(/\.html$/, "").replace(/(^|\/)index$/, "$1"))
const index = JSON.parse(readFileSync(join(publicDir, "static/contentIndex.json"), "utf8"))
const config = YAML.parse(readFileSync("quartz.config.yaml", "utf8"))
const sourceFiles = await globby("**/*.md", {
  cwd: "..",
  ignore: config.configuration.ignorePatterns,
})
for (const file of sourceFiles) {
  const published = matter(readFileSync(join("..", file), "utf8")).data.publish === true
  const slug = slugifyFilePath(file)
  assert.equal(Object.hasOwn(index, slug), published, `Publication inventory mismatch: ${file}`)
}
const pages = files.filter((f) => f.endsWith(".html") && f !== "404.html")
const report = {
  pages: pages.length,
  browserVisits: 0,
  spaVisits: 0,
  links: 0,
  assets: 0,
  anchors: 0,
  pdfs: 0,
  failures: [],
  externalFailures: [],
  interactions: {},
}
const refs = new Map()
const ids = new Map()
const browser = await chromium.launch({ headless: true })
const fail = (scope, error) => report.failures.push({ scope, error: String(error).slice(0, 600) })
const canonicalPath = (url) =>
  decodeURIComponent(new URL(url, base).pathname).replace(/\/$/, "") || "/"
const inventory = () => ({
  slug: document.body.dataset.slug,
  heading: document.querySelector("h1")?.textContent,
  article: document.querySelector("article")?.textContent?.trim().length ?? 0,
  overflow: document.documentElement.scrollWidth > innerWidth + 1,
  ids: [...document.querySelectorAll("[id]")].map((el) => el.id),
  refs: [
    ...document.querySelectorAll(
      "a[href],link[href],img[src],script[src],iframe[src],audio[src],video[src],source[src]",
    ),
  ].map((el) => ({ url: el.href || el.src, tag: el.tagName })),
})
function collect(data, url) {
  ids.set(canonicalPath(url), new Set(data.ids))
  for (const ref of data.refs) {
    if (!ref.url || !/^https?:/.test(ref.url)) continue
    const target = new URL(ref.url)
    if (target.origin !== new URL(base).origin) continue
    report.links++
    refs.set(ref.url, { ...ref, from: url })
  }
}
async function sweep(width) {
  let next = 0
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (next < pages.length) {
        const file = pages[next++]
        const url = base + route(file)
        const context = await browser.newContext({
          viewport: { width, height: 900 },
        })
        const page = await context.newPage()
        page.on("pageerror", (e) => fail(`${width} ${file}`, e))
        page.on("console", (m) => {
          if (m.type() !== "error") return
          const source = m.location().url
          if (source && new URL(source, base).origin !== new URL(base).origin) {
            report.externalFailures.push({
              page: route(file),
              url: source,
              error: m.text(),
            })
          } else fail(`${width} ${file}`, m.text())
        })
        page.on("requestfailed", (r) => {
          if (r.failure()?.errorText === "net::ERR_ABORTED") return
          const entry = {
            page: route(file),
            url: r.url(),
            error: r.failure()?.errorText,
          }
          if (new URL(r.url()).origin === new URL(base).origin)
            fail(`${width} ${file}`, JSON.stringify(entry))
          else report.externalFailures.push(entry)
        })
        try {
          await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 30000,
          })
          await page.waitForSelector("body[data-slug]", { timeout: 15000 })
          await page.evaluate(() => document.fonts.ready)
          await page.waitForTimeout(350)
          const data = await page.evaluate(inventory)
          assert(data.heading && data.heading !== "404", "missing article or 404")
          assert(!data.overflow, "horizontal page overflow")
          const expected = Object.keys(index).find((slug) => route(slug + ".html") === route(file))
          if (expected) assert.equal(data.slug, expected, "canonical page overwritten by alias")
          if (expected && !expected.startsWith("tags/") && !expected.endsWith("/index")) {
            assert(data.article > 30, "article body missing")
          }
          if (width === 1280) collect(data, page.url())
          report.browserVisits++
        } catch (e) {
          fail(`${width} ${file}`, e)
        } finally {
          await context.close()
        }
      }
    }),
  )
  console.log(`Browser sweep ${width}px complete (${report.failures.length} failures)`)
}
try {
  await sweep(1280)
  await sweep(390)
  // Visit every canonical route through the live SPA, with the existing DOM and
  // history retained. Fresh-document checks alone miss rebasing regressions.
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
  })
  page.on("pageerror", (e) => fail("SPA", e))
  await page.goto(base, { waitUntil: "networkidle" })
  for (const slug of Object.keys(index)) {
    try {
      const url = base + route(slug + ".html")
      await page.evaluate((url) => window.spaNavigate(new URL(url)), url)
      assert.equal(await page.locator("body").getAttribute("data-slug"), slug)
      collect(await page.evaluate(inventory), page.url())
      report.spaVisits++
    } catch (e) {
      fail(`SPA ${slug}`, e)
    }
  }
  // Explicit regression: folder -> article, then history and reload.
  await page.goto(base + "/Lecture-Notes/", { waitUntil: "networkidle" })
  await page.locator('a[href*="Gauss-law-of-Electrostatics"]').last().click()
  await page.waitForURL("**/Lecture-Notes/Gauss-law-of-Electrostatics")
  assert.equal(
    await page.locator("body").getAttribute("data-slug"),
    "Lecture-Notes/Gauss-law-of-Electrostatics",
  )
  await page.reload({ waitUntil: "networkidle" })
  assert((await page.locator("mjx-container").count()) > 0)
  await page.goBack({ waitUntil: "domcontentloaded" })
  await page.waitForFunction(() => document.body.dataset.slug === "Lecture-Notes/index")
  report.interactions.gaussAndHistory = true

  await page.goto(base, { waitUntil: "networkidle" })
  await page.locator(".search button").first().click()
  await page.keyboard.type("Worthington")
  await page.locator(".result-card").first().waitFor()
  await page.screenshot({ path: join(output, "search.png") })
  await page.locator(".result-card").first().click()
  await page.waitForTimeout(500)
  assert(!["index", undefined].includes(await page.locator("body").getAttribute("data-slug")))
  report.interactions.searchNavigation = true
  const theme = await page.locator("html").getAttribute("saved-theme")
  await page.locator(".darkmode").first().click()
  assert.notEqual(await page.locator("html").getAttribute("saved-theme"), theme)
  report.interactions.darkMode = true
  await page.goto(base + "/Blog/2025-JFM-viscous-drop-impact", {
    waitUntil: "networkidle",
  })
  await page.locator(".graph .global-graph-icon").first().click()
  await page.locator(".global-graph-container canvas").waitFor()
  await page.waitForTimeout(1000)
  await page.screenshot({ path: join(output, "global-graph.png") })
  await page.keyboard.press("Escape")
  report.interactions.globalGraph = true
  const beforeGraph = page.url()
  const box = await page.locator(".graph-container canvas").first().boundingBox()
  assert(box)
  await page.waitForTimeout(1000)
  const canvas = page.locator(".graph-container canvas").first()
  graphHit: for (let y = 8; y < box.height; y += 8) {
    for (let x = 8; x < box.width; x += 8) {
      await page.mouse.move(box.x + x, box.y + y)
      if ((await canvas.evaluate((el) => getComputedStyle(el).cursor)) !== "pointer") continue
      await page.mouse.click(box.x + x, box.y + y)
      await page.waitForTimeout(300)
      if (page.url() !== beforeGraph) break graphHit
    }
  }
  assert.notEqual(page.url(), beforeGraph, "graph node click did not navigate")
  assert.notEqual(await page.locator("h1").first().textContent(), "404")
  report.interactions.graphNodeNavigation = true
  await page.goto(base + "/0_README", { waitUntil: "networkidle" })
  await page.locator("article a.internal").first().hover()
  await page.locator(".popover.active-popover").waitFor()
  report.interactions.popover = true
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(base, { waitUntil: "networkidle" })
  await page.locator(".explorer button").first().click()
  await page.screenshot({ path: join(output, "mobile.png") })
  report.interactions.mobileExplorer = true
  await page.close()
} catch (e) {
  fail("interaction suite", e)
}
try {
  // Check every emitted asset, not just assets encountered in sampled pages.
  for (const file of files.filter(
    (f) => !f.endsWith(".html") && !["_headers", "_redirects"].includes(f),
  )) {
    refs.set(base + "/" + encodePath(file), {
      from: "asset inventory",
      tag: "ASSET",
    })
  }
  const responses = new Map()
  for (const [url, ref] of refs) {
    try {
      const target = new URL(url)
      target.hash = ""
      let result = responses.get(target.href)
      if (!result) {
        const response = await fetch(target, {
          signal: AbortSignal.timeout(20000),
        })
        result = {
          status: response.status,
          url: response.url,
          type: response.headers.get("content-type") ?? "",
        }
        if (target.pathname.endsWith(".pdf")) {
          const bytes = Buffer.from(await response.arrayBuffer())
          assert.equal(bytes.subarray(0, 5).toString(), "%PDF-", "not a PDF")
          report.pdfs++
        } else await response.body?.cancel()
        responses.set(target.href, result)
      }
      assert.equal(result.status, 200, `${url} from ${ref.from}`)
      if (ref.tag === "ASSET") report.assets++
      const hash = new URL(url).hash
      if (hash && result.type.startsWith("text/html")) {
        const targetIds = ids.get(canonicalPath(result.url))
        assert(targetIds, `anchor target not crawled: ${url}`)
        assert(
          targetIds.has(decodeURIComponent(hash.slice(1))),
          `missing anchor: ${url} from ${ref.from}`,
        )
        report.anchors++
      }
    } catch (e) {
      fail(`link ${url}`, e)
    }
  }
  const missing = await fetch(base + "/e2e-deliberately-missing-page", {
    signal: AbortSignal.timeout(10000),
  })
  assert.equal(missing.status, 404)
  assert((await missing.text()).includes("404"))
  report.interactions.real404 = true
  const repaired = await fetch(base + "/Lecture-Notes/Lecture-Notes/Gauss-law-of-Electrostatics")
  assert.equal(repaired.status, 200)
  assert.equal(new URL(repaired.url).pathname, "/Lecture-Notes/Gauss-law-of-Electrostatics")
  assert((await repaired.text()).includes('data-slug="Lecture-Notes/Gauss-law-of-Electrostatics"'))
  report.interactions.reported404Redirect = true
} catch (e) {
  fail("asset suite", e)
} finally {
  await browser.close()
  writeFileSync(join(output, "report.json"), JSON.stringify(report, null, 2) + "\n")
  console.log(JSON.stringify(report, null, 2))
  if (report.failures.length) process.exitCode = 1
}
