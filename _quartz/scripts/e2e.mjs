import { chromium } from "playwright"
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import assert from "node:assert/strict"
import matter from "gray-matter"
import { globby } from "globby"
import YAML from "yaml"
import { slugifyFilePath, simplifySlug } from "@quartz-community/utils"

const base = (process.env.E2E_BASE_URL ?? "http://127.0.0.1:8790").replace(/\/$/, "")
const publicDir = resolve(process.env.E2E_PUBLIC_DIR ?? "public")
const output = resolve("output/playwright")
mkdirSync(output, { recursive: true })
const capturePages = process.env.E2E_CAPTURE_PAGES === "true"
if (capturePages) mkdirSync(join(output, "pages"), { recursive: true })
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [relative(publicDir, join(dir, e.name))],
  )
const files = walk(publicDir)
const graphScript = readFileSync(join(publicDir, "postscript.js"), "utf8")
assert(
  !graphScript.includes("cdn.jsdelivr.net/npm/d3"),
  "unpatched CDN graph script is still bundled",
)
assert(
  !graphScript.includes("cdn.jsdelivr.net/npm/pixi.js"),
  "unpatched Pixi loader is still bundled",
)
assert.equal(
  graphScript.split("/static/graph/d3.min.js").length - 1,
  1,
  "graph script must be bundled once",
)
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
let browser = await chromium.launch({ headless: true })
const fail = (scope, error) => {
  const finding = { scope, error: (error?.stack ?? String(error)).slice(0, 1600) }
  report.failures.push(finding)
  console.error(JSON.stringify(finding))
}
const canonicalPath = (url) =>
  decodeURIComponent(new URL(url, base).pathname).replace(/\/$/, "") || "/"
const inventory = () => ({
  slug: document.body.dataset.slug,
  heading: document.querySelector("h1")?.textContent,
  article: document.querySelector("article")?.textContent?.trim().length ?? 0,
  overflow: document.documentElement.scrollWidth > innerWidth + 1,
  listingCount: document.querySelectorAll(".page-listing").length,
  bodyFontSize: parseFloat(getComputedStyle(document.body).fontSize),
  pdfAlignment: [...document.querySelectorAll('article .callout[data-callout="pdf"]')].map((el) => {
    const title = el.querySelector(".callout-title").getBoundingClientRect()
    const link = el.querySelector(".callout-content").getBoundingClientRect()
    return {
      sameRow: Math.abs(title.top - link.top) < Math.min(title.height, link.height),
      centreOffset: Math.abs(title.top + title.height / 2 - link.top - link.height / 2),
    }
  }),
  navigation: [...document.querySelectorAll(".explorer-content a")].map((a) => ({
    text: a.textContent,
    href: a.getAttribute("href"),
  })),
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
          if (data.slug?.endsWith("/index") && !data.slug.startsWith("tags/")) {
            assert.equal(data.listingCount, 1, "folder listing rendered more than once")
          }
          assert(data.navigation.length > 0, "primary navigation is empty")
          assert(data.bodyFontSize >= 18, "body text is too small")
          assert(
            data.pdfAlignment.every((row) => !row.sameRow || row.centreOffset <= 1),
            "PDF label and link are not vertically aligned",
          )
          assert(!/^Folder:/.test(data.heading), "folder heading has a redundant prefix")
          assert(
            !data.navigation.some((a) => /_AtomicNotes/.test(a.href ?? "")),
            "atomic notes leaked into primary navigation",
          )
          assert(
            !data.navigation.some((a) => /^Folder:/.test(a.text ?? "")),
            "folder navigation has a redundant prefix",
          )
          const expected = Object.keys(index).find((slug) => route(slug + ".html") === route(file))
          if (expected) assert.equal(data.slug, expected, "canonical page overwritten by alias")
          if (expected && !expected.startsWith("tags/") && !expected.endsWith("/index")) {
            assert(data.article > 30, "article body missing")
          }
          if (width === 1280) collect(data, page.url())
          if (capturePages) {
            await page.screenshot({
              path: join(output, "pages", `${width}-${file.replaceAll("/", "__")}.png`),
            })
          }
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
  await browser.close()
  browser = await chromium.launch({ headless: true })
  await sweep(390)
  // Visit every canonical route through the live SPA, with the existing DOM and
  // history retained. Fresh-document checks alone miss rebasing regressions.
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
  })
  page.on("pageerror", (e) => fail("SPA", e))
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("[Graph]")) {
      fail("graph lifecycle", message.text())
    }
  })
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
  const tocLink = page.locator(".toc a").first()
  await tocLink.waitFor()
  const sectionHref = await tocLink.getAttribute("href")
  await tocLink.click()
  assert.equal(new URL(page.url()).hash, new URL(sectionHref, page.url()).hash)
  assert.equal(await page.locator(".graph").count(), 1)
  report.interactions.tableOfContents = true

  // Every push rebuilds the graph from the same published index verified above.
  const graphPage = "Lecture-Notes/Slender-Jets/slender-jets-VE-order-0"
  await page.goto(base + "/" + graphPage, { waitUntil: "networkidle" })
  const localGraph = page.locator('.graph-container[data-graph-ready="true"]')
  await localGraph.waitFor()
  assert.equal(await localGraph.getAttribute("data-graph-slug"), graphPage)
  assert(Number(await localGraph.getAttribute("data-graph-node-count")) > 1)
  assert.equal(await localGraph.locator("canvas").count(), 1)
  const expectedGraphIds = new Set(Object.keys(index).map(simplifySlug))
  function checkGraphIds(ids) {
    assert(ids.length > 1, "graph contains no connected content")
    for (const id of ids)
      assert(expectedGraphIds.has(id), `graph has an unpublished or stale node: ${id}`)
  }
  checkGraphIds(JSON.parse(await localGraph.getAttribute("data-graph-node-ids")))
  const globalButton = page.getByRole("button", { name: "Global Graph", exact: true })
  // Close while asynchronous setup may still be running, then reopen.
  for (let attempt = 0; attempt < 3; attempt++) {
    await globalButton.click()
    await page.keyboard.press("Escape")
  }
  await globalButton.click()
  const globalGraph = page.locator('.global-graph-container[data-graph-ready="true"]')
  await globalGraph.waitFor()
  const globalIds = JSON.parse(await globalGraph.getAttribute("data-graph-node-ids"))
  checkGraphIds(globalIds)
  assert.deepEqual(
    new Set(globalIds),
    expectedGraphIds,
    "global graph is missing current published content",
  )
  assert.equal(await globalGraph.locator("canvas").count(), 1)
  await page.screenshot({ path: join(output, "global-graph.png") })
  await page.keyboard.press("Escape")
  await page.waitForFunction(() => !document.querySelector(".global-graph-outer.active"))
  report.interactions.globalGraphReopen = true

  for (let attempt = 0; attempt < 2; attempt++) {
    await page.locator(".darkmode").first().click()
    await localGraph.waitFor()
    assert.equal(await localGraph.locator("canvas").count(), 1)
  }
  report.interactions.graphThemeChange = true
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForFunction(() => {
    const graph = document.querySelector('.graph-container[data-graph-ready="true"]')
    const canvas = graph?.querySelector("canvas")
    return canvas && Math.abs(canvas.getBoundingClientRect().width - graph.clientWidth) <= 1
  })
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.waitForFunction(() => {
    const graph = document.querySelector('.graph-container[data-graph-ready="true"]')
    const canvas = graph?.querySelector("canvas")
    return canvas && Math.abs(canvas.getBoundingClientRect().width - graph.clientWidth) <= 1
  })
  report.interactions.graphResize = true
  const beforeGraph = page.url()
  const canvas = localGraph.locator("canvas")
  const box = await canvas.boundingBox()
  assert(box)
  graphHit: for (let y = 8; y < box.height; y += 8) {
    for (let x = 8; x < box.width; x += 8) {
      await page.mouse.move(box.x + x, box.y + y)
      if ((await canvas.evaluate((el) => getComputedStyle(el).cursor)) !== "pointer") continue
      await page.mouse.click(box.x + x, box.y + y)
      await page.waitForTimeout(200)
      if (page.url() !== beforeGraph) break graphHit
    }
  }
  assert.notEqual(page.url(), beforeGraph, "graph node click did not navigate")
  await localGraph.waitFor()
  assert.equal(
    await localGraph.getAttribute("data-graph-slug"),
    await page.locator("body").getAttribute("data-slug"),
  )
  report.interactions.graphNodeNavigation = true
  await page.goto(base + "/0_README", { waitUntil: "networkidle" })
  await page.locator('article a.internal[href*="2025-JFM-viscous-drop-impact"]').first().hover()
  await page.locator(".popover.active-popover").waitFor()
  report.interactions.popover = true
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(base, { waitUntil: "networkidle" })
  await page.getByRole("button", { name: "Open navigation", exact: true }).click()
  await page.waitForFunction(
    () => !document.querySelector(".explorer").classList.contains("collapsed"),
  )
  await page.locator(".explorer-content").waitFor({ state: "visible" })
  assert.equal(await page.locator('.explorer-content a[href*="_AtomicNotes"]').count(), 0)
  await page.screenshot({ path: join(output, "mobile.png") })
  await page.keyboard.press("Escape")
  await page.waitForFunction(() =>
    document.querySelector(".explorer").classList.contains("collapsed"),
  )
  report.interactions.mobileExplorer = true
  await page.goto(base + "/_AtomicNotes/Moving-Delta-identity", { waitUntil: "networkidle" })
  const wideEquation = page.locator('article mjx-container[tabindex="0"]').first()
  await wideEquation.waitFor()
  await wideEquation.focus()
  await page.keyboard.press("ArrowRight")
  await page.waitForFunction(() => {
    const equation = document.querySelector('article mjx-container[tabindex="0"]')
    return equation && equation.scrollLeft > 0
  })
  report.interactions.keyboardEquationScroll = true
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
  const repaired = await fetch(base + "/Lecture-Notes/Lecture-Notes/Gauss-law-of-Electrostatics", {
    signal: AbortSignal.timeout(10000),
  })
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
