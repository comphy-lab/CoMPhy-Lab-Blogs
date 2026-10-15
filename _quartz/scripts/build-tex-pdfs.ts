#!/usr/bin/env -S npx tsx
import { execFileSync } from "node:child_process"
import { readFile, writeFile, mkdir, rename } from "node:fs/promises"
import { dirname, extname, join, posix, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import sharp from "sharp"
import { format, resolveConfig } from "prettier"
import { assertSafeSource, assertSafeTex, assertSelfContainedSvg } from "./tex/safety"
import { rasterDerivative } from "./tex/images"
import {
  imageLayout,
  courseHeader,
  origin,
  prepareMarkdown,
  resolveTarget,
  slugFor,
  webLink,
} from "./tex/prepare"
import {
  fingerprint,
  pdfPathFor,
  readInput,
  safePath,
  sha256,
  validPdf,
  vaultFiles,
} from "./tex/manifest.mjs"

const quartz = resolve(fileURLToPath(new URL("..", import.meta.url)))
const root = resolve(quartz, "..")
const output = join(quartz, "tex-pdfs")
const cache = join(quartz, ".quartz-cache", "tex-pdfs")
// TeX is a local authoring dependency. Never download it in this command.
const env = {
  ...process.env,
  PATH: `/Library/TeX/texbin:/opt/homebrew/bin:${process.env.PATH}`,
  openin_any: "p",
  openout_any: "p",
}
function run(command: string, args: string[], cwd = quartz, input?: string | Buffer, pageEnv = {}) {
  return execFileSync(command, args, {
    cwd,
    env: { ...env, ...pageEnv },
    input,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    stdio: ["pipe", "pipe", "pipe"],
  })
}

export function sourceDateEpoch(source: string): string {
  try {
    const epoch = run("git", ["log", "-1", "--format=%ct", "--", source], root).trim()
    if (/^\d+$/.test(epoch)) return epoch
  } catch {
    // Archives and machines without Git use the same fixed UTC epoch.
  }
  return "946684800"
}

// Pandoc's JSON tree is deliberately open: native tables/citations/footnotes
// pass through without maintaining a second copy of its schema.
interface Node {
  t: string
  c: any
}
const stringify = (nodes: Node[]): string =>
  nodes
    .map((n) =>
      n.t === "Str"
        ? n.c
        : ["Math", "Code"].includes(n.t)
          ? n.c[1]
          : ["Link", "Image", "Span", "Cite"].includes(n.t)
            ? stringify(n.c[1])
            : ["Space", "SoftBreak", "LineBreak"].includes(n.t)
              ? " "
              : Array.isArray(n.c)
                ? stringify(
                    n.c.filter(
                      (v: unknown): v is Node => typeof v === "object" && v !== null && "t" in v,
                    ),
                  )
                : "",
    )
    .join("")
const cleanText = (text: string) =>
  text
    .replace(/[\p{Emoji_Presentation}\uFE0F\u200D]/gu, "")
    .replace(/✅|✔|✓/g, "yes")
    .replace(/❌|✗/g, "no")

export async function courseInfo(source: string, read: (path: string) => Promise<Buffer>) {
  let dir = posix.dirname(source)
  while (dir.startsWith("Lecture-Notes/")) {
    const path = `${dir}/0-README.md`
    try {
      const content = matter((await read(path)).toString()).content
      const title = /^#\s+(.+)$/m.exec(content)?.[1]
      if (title) return { title, path }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
    }
    dir = posix.dirname(dir)
  }
  return { title: posix.basename(posix.dirname(source)).replace(/-/g, " "), path: undefined }
}

export async function convert(
  source: string,
  files: string[],
  versions: Record<string, string>,
  baseline?: Awaited<ReturnType<typeof fingerprint>>,
) {
  const initial = baseline ?? (await fingerprint(root, [], files))
  const readHashes = new Map<string, string>()
  const read = async (path: string) => {
    const bytes = await readInput(root, path)
    readHashes.set(path, sha256(bytes))
    return bytes
  }
  const work = safePath(cache, source.slice(0, -3))
  await mkdir(work, { recursive: true })
  const dependencies = new Set([source])
  const parsed = matter((await read(source)).toString())
  assertSafeSource(parsed.content)
  const pageEnv = { SOURCE_DATE_EPOCH: sourceDateEpoch(source), FORCE_SOURCE_DATE: "1" }
  const prepared = prepareMarkdown(parsed.content)
  await writeFile(join(work, "prepared.md"), prepared)
  const doc = JSON.parse(
    run(
      "pandoc",
      [
        "--from=markdown+tex_math_dollars+raw_html+footnotes+pipe_tables+fenced_code_blocks+fenced_divs+lists_without_preceding_blankline-raw_tex-yaml_metadata_block",
        "--to=json",
      ],
      quartz,
      prepared,
    ),
  )
  const course = await courseInfo(source, read)
  if (course.path) dependencies.add(course.path)
  const titleAt = doc.blocks.findIndex((node: Node) => node.t === "Header" && node.c[0] === 1)
  const title =
    titleAt >= 0
      ? doc.blocks.splice(titleAt, 1)[0].c[2]
      : [{ t: "Str", c: parsed.data.title || posix.basename(source, ".md") }]
  doc.meta = {
    title: { t: "MetaInlines", c: title },
    course: { t: "MetaString", c: course.title },
    "course-header": { t: "MetaString", c: courseHeader(course.title) },
    "web-url": {
      t: "MetaString",
      c: `${origin}/${slugFor(source).split("/").map(encodeURIComponent).join("/")}`,
    },
  }
  const date = parsed.data.date ?? parsed.data.created
  if (date) {
    const value = new Date(date)
    doc.meta.date = {
      t: "MetaString",
      c: Number.isNaN(value.valueOf())
        ? String(date)
        : value.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }),
    }
  }
  const bibliographies = parsed.data.bibliography ? [parsed.data.bibliography].flat() : []
  for (const bibliography of bibliographies) {
    const path =
      resolveTarget(source, String(bibliography), files) ??
      posix.join(posix.dirname(source), String(bibliography))
    await read(path)
    dependencies.add(path)
  }
  if (bibliographies.length)
    doc.meta.bibliography = {
      t: "MetaList",
      c: [...dependencies]
        .filter((p) => p !== source && p !== course.path)
        .map((p) => ({ t: "MetaString", c: safePath(root, p) })),
    }
  if (parsed.data.csl) {
    const path =
      resolveTarget(source, String(parsed.data.csl), files) ??
      posix.join(posix.dirname(source), String(parsed.data.csl))
    await read(path)
    dependencies.add(path)
    doc.meta.csl = { t: "MetaString", c: safePath(root, path) }
  }
  async function image(node: Node) {
    const target = node.c[2][0] as string
    if (/^https?:/i.test(target))
      throw new Error(`Remote image must be saved in the vault: ${target}`)
    const path = resolveTarget(source, target, files)
    if (!path) throw new Error(`Image not found or ambiguous: ${target}`)
    dependencies.add(path)
    const bytes = await read(path)
    const extension = extname(path).toLowerCase()
    const svg = extension === ".svg" || /<svg(?:\s|>)/i.test(bytes.toString("utf8"))
    if (svg) assertSelfContainedSvg(bytes)
    const metadata = await sharp(bytes, { animated: false }).metadata()
    if (metadata.format === "svg" && !svg)
      throw new Error(`Unsupported SVG encoding: ${path}; using browser PDF`)
    if (!metadata.width || !metadata.height) throw new Error(`No image dimensions: ${path}`)
    const layout = imageLayout(stringify(node.c[1]), {
      width: metadata.width,
      height: metadata.pageHeight ?? metadata.height,
    })
    const derivative = svg ? undefined : await rasterDerivative(bytes, layout.fraction)
    const key = sha256(derivative?.bytes ?? bytes)
    const relativeAsset = `assets/${key}${derivative?.extension ?? ".pdf"}`
    const asset = join(work, relativeAsset)
    await mkdir(dirname(asset), { recursive: true })
    if (derivative) await writeFile(asset, derivative.bytes)
    else run("rsvg-convert", ["--format=pdf", "--output", asset], work, bytes, pageEnv)
    node.c[0][2].push(["pdf-width", String(layout.fraction)])
    node.c[1] = []
    node.c[2][0] = relativeAsset
  }
  async function walk(value: any): Promise<void> {
    if (!value || typeof value !== "object") return
    if (Array.isArray(value)) {
      for (const child of value) await walk(child)
      return
    }
    if (value.t === "Str") value.c = cleanText(value.c)
    if (value.t === "Math") assertSafeTex(value.c[1])
    if (value.t === "Header") value.c[0] = Math.max(1, value.c[0] - 1)
    if (value.t === "Table") {
      // Pipe-table delimiter lengths are not useful print widths. Balance
      // columns by content, keeping room for both prose and short equations.
      const rows = [
        ...value.c[3][1],
        ...value.c[4].flatMap((body: any) => [...body[2], ...body[3]]),
        ...value.c[5][1],
      ]
      const weights = value.c[2].map((_: unknown, index: number) =>
        Math.sqrt(
          Math.max(
            12,
            ...rows.map(
              (row: any) => stringify(row[1][index]?.[4] ?? []).replace(/\\[a-z]+/gi, "").length,
            ),
          ),
        ),
      )
      const total = weights.reduce((sum: number, weight: number) => sum + weight, 0)
      value.c[2].forEach((column: any, index: number) => {
        column[1] = { t: "ColWidth", c: weights[index] / total }
      })
    }
    if (value.t === "Link") value.c[2][0] = webLink(source, value.c[2][0], files)
    if (value.t === "Image") await image(value)
    if (value.t === "RawBlock" || value.t === "RawInline") {
      if (value.c[0] !== "html") throw new Error("Unexpected raw content")
      value.c = ["html", ""]
    }
    await walk(value.c)
  }
  await walk(doc.blocks)
  await walk(doc.meta.title.c)
  let referenceLevel = 0
  let referenceNumber = 1
  for (const block of doc.blocks as Node[]) {
    if (block.t === "Header") {
      const text = stringify(block.c[2])
      if (referenceLevel && block.c[0] <= referenceLevel) referenceLevel = 0
      if (!referenceLevel && /^(?:.*\bReferences\b.*|Further Reading)$/i.test(text)) {
        referenceLevel = block.c[0]
        referenceNumber = 1
      }
    }
    if (referenceLevel && block.t === "BulletList") {
      const items = block.c
      block.t = "OrderedList"
      block.c = [[referenceNumber, { t: "Decimal" }, { t: "Period" }], items]
      referenceNumber += items.length
    } else if (referenceLevel && block.t === "OrderedList") {
      block.c[0][0] = referenceNumber
      referenceNumber += block.c[1].length
    }
  }
  await writeFile(join(work, "document.json"), JSON.stringify(doc))
  const tex = run(
    "pandoc",
    [
      "--from=json",
      "--to=latex",
      "--standalone",
      "--citeproc",
      "--syntax-highlighting=tango",
      "--template",
      join(quartz, "scripts/tex/lecture.tex"),
      "--lua-filter",
      join(quartz, "scripts/tex/lecture.lua"),
    ],
    work,
    JSON.stringify(doc),
  )
  await writeFile(join(work, "lecture.tex"), tex)
  try {
    run(
      "latexmk",
      [
        "-lualatex",
        "-g",
        "-interaction=nonstopmode",
        "-halt-on-error",
        "-file-line-error",
        "-no-shell-escape",
        "lecture.tex",
      ],
      work,
      undefined,
      pageEnv,
    )
  } catch (error) {
    const log = await readFile(join(work, "lecture.log"), "utf8").catch(() => "")
    throw new Error(`${(error as Error).message.split("\n")[0]}\n${log.slice(-3500)}`)
  }
  const bytes = await readFile(join(work, "lecture.pdf"))
  if (!validPdf(bytes)) throw new Error("Invalid compiled PDF")
  // A README without an H1 still affected the course-title search and must
  // remain a dependency (adding an H1 should invalidate the previous PDF).
  for (const path of readHashes.keys()) dependencies.add(path)
  const current = await fingerprint(root, [...dependencies], files)
  for (const [path, hash] of [...Object.entries(initial.inputs), ...readHashes]) {
    if (current.inputs[path] !== hash)
      throw new Error(`Input changed during conversion: ${path}; regenerate`)
  }
  const pdf = pdfPathFor(source.slice(0, -3))
  const path = safePath(output, pdf)
  await mkdir(dirname(path), { recursive: true })
  await writeFile(`${path}.tmp`, bytes)
  await rename(`${path}.tmp`, path)
  return {
    pdf,
    dependencies: [...dependencies].sort(),
    ...current,
    pdfSha256: sha256(bytes),
    toolchain: versions,
  }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length && !(args.length === 2 && args[0] === "--only"))
    throw new Error("Usage: npm run build:tex-pdfs -- [--only vault/path.md]")
  const versions = Object.fromEntries(
    ["pandoc", "latexmk", "lualatex", "rsvg-convert"].map((tool) => [
      tool,
      run(tool, [tool === "latexmk" ? "-v" : "--version"])
        .trim()
        .split("\n")[0]!,
    ]),
  )
  await mkdir(output, { recursive: true })
  const manifestPath = join(output, "manifest.json")
  let manifest: { version: number; pages: Record<string, any> } = { version: 1, pages: {} }
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
  }
  const files = await vaultFiles(root)
  const pages = []
  for (const source of files.filter(
    (file) => file.startsWith("Lecture-Notes/") && file.endsWith(".md"),
  )) {
    if (matter((await readInput(root, source)).toString()).data.publish === true) pages.push(source)
  }
  if (args[1] && !pages.includes(args[1]))
    throw new Error(`Not a published lecture page: ${args[1]}`)
  const selected = args[1] ? [args[1]] : pages
  const baseline = await fingerprint(root, [], files)
  let succeeded = 0
  const failures = []
  for (const source of selected) {
    try {
      manifest.pages[source] = await convert(source, files, versions, baseline)
      succeeded++
      console.log(`[tex-pdfs] OK ${source}`)
    } catch (error) {
      if (
        ["EACCES", "EPERM", "ENOSPC", "EMFILE"].includes(
          (error as NodeJS.ErrnoException).code ?? "",
        )
      )
        throw error
      delete manifest.pages[source]
      failures.push(source)
      console.warn(`[tex-pdfs] FALLBACK ${source}: ${(error as Error).message}`)
    }
  }
  if (!args[1])
    for (const source of Object.keys(manifest.pages))
      if (!pages.includes(source)) delete manifest.pages[source]
  const manifestJson = await format(JSON.stringify(manifest), {
    ...(await resolveConfig(manifestPath)),
    filepath: manifestPath,
  })
  await writeFile(`${manifestPath}.tmp`, manifestJson)
  await rename(`${manifestPath}.tmp`, manifestPath)
  await writeFile(
    join(cache, "summary.json"),
    JSON.stringify({ succeeded, failed: failures.length, failures }, null, 2) + "\n",
  )
  console.log(
    `[tex-pdfs] ${succeeded}/${selected.length} converted; ${failures.length} left to browser fallback. TeX and logs: ${cache}`,
  )
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch((error) => {
    console.error(`[tex-pdfs] Infrastructure error: ${error.stack || error}`)
    process.exitCode = 1
  })
