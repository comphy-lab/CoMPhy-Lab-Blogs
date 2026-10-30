import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdir, mkdtemp, writeFile, rm } from "node:fs/promises"
import { join, dirname, resolve } from "node:path"
import { relative } from "node:path"
import { execFileSync } from "node:child_process"
import sharp from "sharp"
import {
  prepareMarkdown,
  stripExportBlocks,
  resolveTarget,
  webLink,
  imageLayout,
  courseHeader,
} from "../../scripts/tex/prepare"
import { convert, courseInfo, documentLinks, sourceDateEpoch } from "../../scripts/build-tex-pdfs"
import { assertSafeSource, assertSelfContainedSvg } from "../../scripts/tex/safety"
import { rasterDerivative } from "../../scripts/tex/images"
import {
  fingerprint,
  freshTexPdf,
  isTexPdfSource,
  linkInventory,
  pipelineInputs,
  sha256,
  validPdf,
  vaultFiles,
} from "../../scripts/tex/manifest.mjs"

test("course titles follow the nearest README H1 and retain the year", async () => {
  const titles = new Map([
    ["Lecture-Notes/Course/2025/0-README.md", "Soft Condensed Matter: An Introduction (2025)"],
    ["Lecture-Notes/Course/2026/0-README.md", "Soft Condensed Matter: An Introduction (2026)"],
    ["Lecture-Notes/Course/0-README.md", "Parent course"],
  ])
  const read = async (path: string) => {
    const title = titles.get(path)
    if (!title) throw Object.assign(new Error(path), { code: "ENOENT" })
    return Buffer.from(`---\npublish: true\n---\n# ${title}\n`)
  }
  for (const year of [2025, 2026]) {
    const course = await courseInfo(`Lecture-Notes/Course/${year}/note.md`, read)
    assert.equal(course.title, `Soft Condensed Matter: An Introduction (${year})`)
    assert.equal(course.path, `Lecture-Notes/Course/${year}/0-README.md`)
    assert.equal(courseHeader(course.title), course.title)
  }
  assert.equal((await courseInfo("Lecture-Notes/Course/2027/note.md", read)).title, "Parent course")
  const long = courseHeader(
    "A very long course name with many words about computational fluid dynamics (2026)",
  )
  assert(long.length <= 52)
  assert(long.endsWith("… (2026)"))
  assert.equal(courseHeader("  Short   course  "), "Short course")
  assert.deepEqual(await courseInfo("Talks/Seminar.md", read), {
    title: "Talks",
    path: undefined,
  })
  assert.deepEqual(await courseInfo("Talks/2026/Seminar.md", read), {
    title: "Talks",
    path: undefined,
  })
})

test("course titles use an index hub after trying the local README", async () => {
  const visited: string[] = []
  const read = async (path: string) => {
    visited.push(path)
    if (path === "Lecture-Notes/Course/index.md")
      return Buffer.from("# Soft Condensed Matter: An Introduction\n")
    throw Object.assign(new Error(path), { code: "ENOENT" })
  }
  assert.deepEqual(await courseInfo("Lecture-Notes/Course/Viscosity.md", read), {
    title: "Soft Condensed Matter: An Introduction",
    path: "Lecture-Notes/Course/index.md",
  })
  assert.deepEqual(visited, ["Lecture-Notes/Course/0-README.md", "Lecture-Notes/Course/index.md"])
})

test("lectures and talks share the TeX route at any folder depth", () => {
  for (const source of ["Talks/Seminar.md", "Talks/2026/Seminar.md", "Lecture-Notes/one.md"])
    assert(isTexPdfSource(source))
  for (const source of ["Blog/one.md", "_AtomicNotes/one.md", "Talks/one.pdf", "Talks.md"])
    assert(!isTexPdfSource(source))
})

test("export markers remove download blocks, preserve literal examples and keep adjacent content", () => {
  const ignored = "<!-- PDF-EXPORT-IGNORE-START -->\n> hidden\n<!-- PDF-EXPORT-IGNORE-END -->"
  assert.equal(stripExportBlocks(`before\n${ignored}\nafter`), "before\n\nafter")
  assert.equal(
    stripExportBlocks(
      "before\n<!-- PDF-EXPORT-IGNORE-START -->\n```c\nhidden();\n```\n$$x$$\n<!-- PDF-EXPORT-IGNORE-END -->\nafter",
    ),
    "before\n\nafter",
  )
  const code = `\`\`\`md\n${ignored}\n\`\`\``
  assert.equal(stripExportBlocks(code), code)
  assert(
    !prepareMarkdown(
      `<!-- BLOG-PDF-LINK-START -->\n> [!pdf] PDF\n<!-- BLOG-PDF-LINK-END -->`,
    ).includes("[!pdf]"),
  )
})

test("Obsidian links and HTML are bridged without touching code or maths", () => {
  const result = prepareMarkdown(
    '[[note#Heading|label]] ![[image.png|750]]\n<br>\n<div><iframe src="https://www.youtube-nocookie.com/embed/abc123?start=90"></iframe></div>\n<img src="x.png" alt="caption" width="640" height="480">\n`[[literal]]`\n$$\\begin{cases}\na & b\n\\end{cases}$$ trailing prose',
  )
  assert(result.includes("[label](<note#Heading>)"))
  assert(result.includes("![|750](<image.png>)"))
  assert(result.includes("https://www.youtube.com/watch?v=abc123"))
  assert(result.includes("&t=90s"))
  assert(result.includes("![caption|640x480](<x.png>)"))
  assert(result.includes("`[[literal]]`"))
  assert(result.includes("$$\n\\begin{cases}"))
  assert(result.includes("\\end{cases}\n$$\ntrailing prose"))
  assert(!result.includes("<iframe"))
})

test("native video becomes a labelled link while source code examples stay literal", () => {
  const video =
    '<video aria-label="Bubble bursting"><source src="https://media.example/movie.mp4" type="video/mp4"><p>Fallback text</p></video>'
  const result = prepareMarkdown(
    `${video}\n\nCredit: the experimenters.\n\n\`\`\`html\n${video}\n\`\`\``,
  )
  assert(result.startsWith("\n\n[Bubble bursting](<https://media.example/movie.mp4>)"))
  assert(result.includes("Credit: the experimenters."))
  assert(result.includes(`\`\`\`html\n${video}\n\`\`\``))
  assert(
    prepareMarkdown(
      '<video src="https://media.example/direct.mp4" title="Direct clip"></video>',
    ).includes("[Direct clip](<https://media.example/direct.mp4>)"),
  )
})

test("video labels preserve punctuation, ignore data attributes and resolve relative media", () => {
  const prepared = prepareMarkdown(
    `<video data-src="wrong.mp4" src="../_Media/my clip.mp4" aria-label="Worthington's $jet$ [1]"></video>`,
  )
  assert(prepared.includes("Worthington\\'s \\$jet\\$ \\[1\\]"))
  assert(prepared.includes("(<../_Media/my%20clip.mp4>)"))
  assert(!prepared.includes("wrong.mp4"))
  assert(
    prepareMarkdown(
      '<iframe data-title="Wrong" title="YouTube video player" src="https://www.youtube.com/embed/abc123?start=7"></iframe>',
    ).includes("[Video](<https://www.youtube.com/watch?v=abc123&t=7s>)"),
  )
})

test("the conversion collects title, image, unresolved and bibliography link queries", () => {
  const link = (target: string) => ({
    t: "Link",
    c: [["", [], []], [{ t: "Str", c: "label" }], [target, ""]],
  })
  const doc = {
    blocks: [
      { t: "Header", c: [1, ["", [], []], [link("title-note")]] },
      {
        t: "Para",
        c: [link("unresolved"), { t: "Image", c: [["", [], []], [], ["figure.png", ""]] }],
      },
      { t: "CodeBlock", c: [["", [], []], "[literal](not-a-link)"] },
    ],
  }
  assert.deepEqual(
    [...documentLinks(doc, { bibliography: ["refs.bib"], csl: "style.csl" })].sort(),
    ["figure.png", "refs.bib", "style.csl", "title-note", "unresolved"],
  )
})

test("callouts after display maths start a new Pandoc block, preserving literal markers", () => {
  const callout = "> [!tldr] Note\n> Explanation"
  const literal = `\`\`\`md\n${callout}\n\`\`\``
  const result = prepareMarkdown(`$$x$$\n${callout}\n\n${literal}`)
  assert(result.includes(`$$x$$\n\n${callout}`))
  assert(result.includes(literal))
})

test("escaped wiki aliases inside pipe tables resolve to the atomic note", () => {
  const prepared = prepareMarkdown(
    "| Identity | Details |\n| --- | --- |\n| Moving delta | [[Moving-Delta-identity\\|the detailed note]] |",
  )
  assert(prepared.includes("[the detailed note](<Moving-Delta-identity>)"))
  const target = /\[the detailed note\]\(<([^>]+)>\)/.exec(prepared)![1]!
  assert.equal(
    webLink("Lecture-Notes/Intro-Soft-Matter/2025/2.5-Conservation-Laws.md", target, [
      "_AtomicNotes/Moving-Delta-identity.md",
    ]),
    "https://blogs.comphy-lab.org/_AtomicNotes/Moving-Delta-identity",
  )
})

test("local PDF links preserve queries, encode only paths and tolerate literal percent fragments", () => {
  const source = "Lecture-Notes/Course/one.md"
  const files = [source, "_AtomicNotes/note.md"]
  assert.equal(
    webLink(source, "note.md?x=1#Heading", files),
    "https://blogs.comphy-lab.org/_AtomicNotes/note?x=1#heading",
  )
  assert.equal(
    webLink(source, "note.md?x=%23&y=2#100% complete", files),
    "https://blogs.comphy-lab.org/_AtomicNotes/note?x=%23&y=2#100-complete",
  )
  assert.equal(webLink(source, "#bad%E0%A4%A", files), "#bade0a4a")
  assert.equal(webLink(source, "?x=1#Heading", files), "?x=1#heading")
  assert.equal(
    webLink(source, "missing%20note.md?x=1#Heading", files),
    "https://blogs.comphy-lab.org/Lecture-Notes/Course/missing%20note?x=1#heading",
  )
})

test("TeX input in maths rejects conversion and leaves the browser fallback eligible", async () => {
  const parent = resolve(".quartz-cache")
  await mkdir(parent, { recursive: true })
  const fixture = await mkdtemp(join(parent, "tex-unsafe-"))
  const source = relative(resolve(".."), join(fixture, "unsafe.md"))
  try {
    await writeFile(join(fixture, "unsafe.md"), "# Unsafe\n$\\input{local-math.tex}$")
    await assert.rejects(
      convert(source, [source], {}, { inputs: {}, sha256: "" }),
      /Unsafe TeX command \\input; using browser PDF/,
    )
    assert.equal(
      (await freshTexPdf(resolve(".."), source, { version: 1, pages: {} }, [source])).reason,
      "no manifest entry",
    )
  } finally {
    await rm(fixture, { recursive: true, force: true })
    await rm(resolve(".quartz-cache/tex-pdfs", source.slice(0, -3)), {
      recursive: true,
      force: true,
    })
  }
})

test("unsafe maths and raw TeX are refused while code examples and normal maths remain inert", () => {
  for (const command of [
    "input",
    "include",
    "InputIfFileExists",
    "openin",
    "read",
    "openout",
    "write",
    "immediate",
    "lstinputlisting",
    "verbatiminput",
    "includegraphics",
    "directlua",
    "luaexec",
    "catcode",
    "csname",
    "def",
    "ExplSyntaxOn",
  ])
    assert.throws(() => assertSafeSource(`$\\${command}{x}$`), /Unsafe TeX/)
  assert.throws(() => assertSafeSource("\\input{local-math.tex}"), /Unsafe TeX/)
  assert.throws(() => assertSafeSource("$\\begin{filecontents}{x}$"), /Unsafe TeX/)
  assert.throws(() => assertSafeSource("$\\UseName{input}{assets/probe.tex}$"), /Unsafe TeX/)
  assert.throws(() => assertSafeSource("$\\begin{openout}0=probe.txt$"), /Unsafe TeX/)
  assert.throws(() => assertSafeSource("$\\begin{in\\string put}{probe.tex}$"), /Unsafe TeX/)
  assert.throws(() => assertSafeSource("$\\begin \\bgroup input\\egroup{probe.tex}$"), /Unsafe TeX/)
  assert.throws(() => assertSafeSource("$\\in^^70ut{x}$"), /Unsafe TeX/)
  assert.doesNotThrow(() =>
    assertSafeSource("`\\input{example}`\n\n```tex\n\\write18{example}\n```\n$\\int_0^1 x \\, dx$"),
  )
})

test("SVG external hrefs and CSS resources are refused before rendering", () => {
  for (const resource of [
    '<image href="outside.png"/>',
    '<image xlink:href="https://example.org/figure.png"/>',
    '<image href="&#104;ttps://example.org/figure.png"/>',
    "<style>path { fill: url(../paint.svg#x) }</style>",
    '<style>@import "theme.css";</style>',
    '<style>@import"https://example.org/style.css";</style>',
    '<style>@import/**/"outside.css";</style>',
    "<style>path { fill: u/**/rl(outside.svg) }</style>",
    '<!DOCTYPE svg [<!ENTITY x SYSTEM "outside.svg">]>',
    "<style>path { fill: u\\72l(outside.svg) }</style>",
  ])
    assert.throws(() => assertSelfContainedSvg(Buffer.from(`<svg>${resource}</svg>`)), /SVG/)
  assert.doesNotThrow(() =>
    assertSelfContainedSvg(
      Buffer.from(
        '<svg><use href="#plot"/><image href="data:image/png;base64,AAAA"/><style>path { fill: url(#gradient) }</style></svg>',
      ),
    ),
  )
})

test("print derivatives cap width without upscaling, preserve aspect and alpha, and are deterministic", async () => {
  const png = await sharp({
    create: { width: 2400, height: 1200, channels: 4, background: "#ff000080" },
  })
    .png()
    .toBuffer()
  const first = await rasterDerivative(png, 0.5)
  const metadata = await sharp(first.bytes).metadata()
  assert.equal(first.extension, ".png")
  assert.equal(metadata.width, 950)
  assert.equal(metadata.height, 475)
  assert.equal(metadata.hasAlpha, true)
  assert.deepEqual(first.bytes, (await rasterDerivative(png, 0.5)).bytes)
  const small = await sharp(png).resize(300).png().toBuffer()
  assert.equal((await sharp((await rasterDerivative(small, 1)).bytes).metadata()).width, 300)
  const jpeg = await sharp(png).flatten({ background: "white" }).jpeg().toBuffer()
  assert.equal((await rasterDerivative(jpeg, 1)).extension, ".jpg")
  const portrait = await sharp({
    create: { width: 1200, height: 2400, channels: 4, background: "white" },
  })
    .png()
    .toBuffer()
  const portraitMetadata = await sharp((await rasterDerivative(portrait, 1)).bytes).metadata()
  assert.equal(portraitMetadata.width, Math.round((1900 * 0.65 * 251) / 164 / 2))
  assert.equal(portraitMetadata.height, portraitMetadata.width! * 2)
})

test("source epoch follows Git history and has a fixed fallback", () => {
  const source = "Lecture-Notes/Intro-Soft-Matter/2025/2.5-Conservation-Laws.md"
  let gitEpoch = ""
  try {
    gitEpoch = execFileSync("git", ["log", "-1", "--format=%ct", "--", source], {
      cwd: resolve(".."),
      encoding: "utf8",
    }).trim()
  } catch {
    // Builds without Git (archives, some CI images) use the fixed fallback below.
  }
  if (gitEpoch) assert.equal(sourceDateEpoch(source), gitEpoch)
  assert.equal(sourceDateEpoch("does-not-exist.md"), "946684800")
})

test("links resolve using Quartz at any lecture depth, never guessing ambiguous basenames", () => {
  const files = [
    "Lecture-Notes/Course/2025/one.md",
    "Lecture-Notes/Course/2025/0-README.md",
    "Lecture-Notes/Course/2026/0-README.md",
    "_AtomicNotes/unique.md",
    "_Media/diagram.png",
  ]
  const source = files[0]!
  assert.equal(resolveTarget(source, "0-README", files), files[1])
  assert.equal(resolveTarget(source, "../../../_Media/diagram.png", files), "_Media/diagram.png")
  assert.equal(resolveTarget("Blog/article.md", "0-README", files), undefined)
  assert.equal(webLink(source, "unique", files), "https://blogs.comphy-lab.org/_AtomicNotes/unique")
  assert.equal(
    webLink(source, "one.md#heading", files),
    "https://blogs.comphy-lab.org/Lecture-Notes/Course/2025/one#heading",
  )
  assert.equal(
    webLink(source, "https://doi.org/10.1/example", files),
    "https://doi.org/10.1/example",
  )
  assert.equal(webLink(source, "#heading", files), "#heading")
})

test("image width is bounded, a requested WxH fits the natural aspect ratio, and alt text stays hidden", () => {
  assert.deepEqual(imageLayout("Figure|750", { width: 1800, height: 900 }), {
    fraction: 750 / 900,
  })
  assert.equal(imageLayout("|640x480", { width: 400, height: 800 }).fraction, 240 / 900)
  assert.equal(imageLayout("|5000", { width: 400, height: 800 }).fraction, 1)
  assert.deepEqual(Object.keys(imageLayout("A described plot", { width: 900, height: 450 })), [
    "fraction",
  ])
})

test("the conversion inventory honours Quartz exclusions at arbitrary course depth", async () => {
  const parent = resolve(".quartz-cache")
  await mkdir(parent, { recursive: true })
  const root = await mkdtemp(join(parent, "tex-inventory-"))
  try {
    for (const path of [
      "_quartz/quartz.config.yaml",
      "Lecture-Notes/Course/2026/note.md",
      "Lecture-Notes/Course/2026/hidden.md",
      "_Media/figure.svg",
      "README.md",
    ]) {
      await mkdir(dirname(join(root, path)), { recursive: true })
      await writeFile(
        join(root, path),
        path.endsWith(".yaml")
          ? "configuration:\n  ignorePatterns: ['_quartz/**', '**/hidden.md', 'README.md']\n"
          : "fixture",
      )
    }
    assert.deepEqual(await vaultFiles(root), [
      "Lecture-Notes/Course/2026/note.md",
      "_Media/figure.svg",
    ])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test("freshness binds source, assets, converter, resolution inventory and PDF bytes; stale is nonfatal", async () => {
  const parent = resolve(".quartz-cache")
  await mkdir(parent, { recursive: true })
  const root = await mkdtemp(join(parent, "tex-test-"))
  const source = "Lecture-Notes/Course/2026/one.md"
  const image = "_Media/figure.png"
  const files = [source, image]
  const put = async (name: string, value: string | Buffer) => {
    await mkdir(dirname(join(root, name)), { recursive: true })
    await writeFile(join(root, name), value)
  }
  try {
    for (const path of [...pipelineInputs, source, image]) await put(path, path)
    const pdf = Buffer.from("%PDF-1.7\n" + "x".repeat(1100) + "\n%%EOF\n")
    const entry = {
      pdf: "Lecture-Notes/Course/2026/one.pdf",
      dependencies: [source, image],
      ...(await fingerprint(root, [source, image], files)),
      pdfSha256: sha256(pdf),
    }
    const manifest = { version: 1, pages: { [source]: entry } }
    await put(`_quartz/tex-pdfs/${entry.pdf}`, pdf)
    assert((await freshTexPdf(root, source, manifest, files)).bytes)
    assert((await freshTexPdf(root, source, manifest, [...files, "new.md"])).reason)
    for (const changed of [source, image, pipelineInputs[0]!]) {
      await put(changed, "changed")
      assert.equal((await freshTexPdf(root, source, manifest, files)).reason, "inputs changed")
      await put(changed, changed)
    }
    await put(`_quartz/tex-pdfs/${entry.pdf}`, Buffer.from("damaged"))
    assert((await freshTexPdf(root, source, manifest, files)).reason)
    assert((await freshTexPdf(root, source, null, files)).reason)
    assert((await freshTexPdf(root, source, { version: 1, pages: {} }, files)).reason)
    assert(!validPdf(Buffer.from("%PDF-")))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test("unrelated pages keep TeX PDFs fresh; link collisions and newly present targets do not", async () => {
  await mkdir(resolve(".quartz-cache"), { recursive: true })
  const root = await mkdtemp(join(resolve(".quartz-cache"), "tex-lookups-"))
  const source = "Talks/Seminar.md"
  const image = "_Media/figure.png"
  const missing = "Lecture-Notes/Course/2026/0-README.md"
  const files = [source, image]
  const put = async (name: string, value: string | Buffer) => {
    await mkdir(dirname(join(root, name)), { recursive: true })
    await writeFile(join(root, name), value)
  }
  try {
    for (const path of [...pipelineInputs, source, image]) await put(path, path)
    const pdf = Buffer.from("%PDF-1.7\n" + "x".repeat(1100) + "\n%%EOF\n")
    const lookups = {
      links: ["figure.png", "not-written-yet", "https://example.org/", "#local"],
      missingPaths: [missing],
    }
    const entry = {
      pdf: "Talks/Seminar.pdf",
      dependencies: [source, image],
      lookups,
      ...(await fingerprint(root, [source, image], files, lookups)),
      pdfSha256: sha256(pdf),
    }
    const manifest = { version: 1, pages: { [source]: entry } }
    await put(`_quartz/tex-pdfs/${entry.pdf}`, pdf)
    assert((await freshTexPdf(root, source, manifest, files)).bytes)
    assert((await freshTexPdf(root, source, manifest, [...files, "Talks/Unrelated.md"])).bytes)
    assert.equal(
      (await freshTexPdf(root, source, manifest, [...files, "Other/figure.png"])).reason,
      "inputs changed",
    )
    assert.equal(
      (await freshTexPdf(root, source, manifest, [...files, "Other/not-written-yet.md"])).reason,
      "inputs changed",
    )
    await put(missing, "# A new course title")
    assert.match(
      (await freshTexPdf(root, source, manifest, [...files, missing])).reason!,
      /Previously absent input now exists/,
    )
    await rm(join(root, missing))
    for (const changed of [source, image, pipelineInputs[0]!]) {
      await put(changed, "changed")
      assert.equal((await freshTexPdf(root, source, manifest, files)).reason, "inputs changed")
      await put(changed, changed)
    }
    await put(`_quartz/tex-pdfs/${entry.pdf}`, Buffer.from("damaged"))
    assert((await freshTexPdf(root, source, manifest, files)).reason)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test("link inventory uses Quartz slug names, handles escaped names and preserves ambiguity", () => {
  const files = ["B/figure name.md", "A/figure name.md", "Other.md"]
  assert.deepEqual(linkInventory(files, ["figure%20name.md#Heading"]), [
    ["figure-name", ["A/figure name.md", "B/figure name.md"]],
  ])
  assert.deepEqual(linkInventory(files, ["https://example.org/figure-name", "#here"]), [])
  assert.deepEqual(linkInventory(["Z.md", "a.md"], ["a", "Z"]), [
    ["Z", ["Z.md"]],
    ["a", ["a.md"]],
  ])
})
