import assert from "node:assert/strict"
import { execFileSync, spawnSync } from "node:child_process"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { dirname, join, relative, resolve } from "node:path"
import { test } from "node:test"
import { convert } from "./build-tex-pdfs"
import { webLink } from "./tex/prepare"

test("TeX preserves DOI and URL labels and still hyphenates prose links", async (t) => {
  const missing = ["pandoc", "latexmk", "lualatex", "pdftotext", "pdfinfo"].filter((tool) => {
    const { error } = spawnSync(tool, ["--version"], { stdio: "ignore" })
    return error && "code" in error && error.code === "ENOENT"
  })
  if (missing.length) return t.skip(`PDF tools unavailable: ${missing.join(", ")}`)

  const cache = resolve(".quartz-cache")
  await mkdir(cache, { recursive: true })
  const fixture = await mkdtemp(join(cache, "tex-links-"))
  const input = join(fixture, "links.md")
  const source = relative(resolve(".."), input)
  const work = join(cache, "tex-pdfs", source.slice(0, -3))
  const output = join("tex-pdfs", dirname(source))
  const relativeUrl = "internationalization.md"
  const bareWikiTitle = "Bare-Wiki-Link-Title"
  const doi = "10.12345/electroencephalographically/a_b123456789"
  const spacedDoi = "10.12346/electroencephalographically/a_b123456789"
  const doubleHashLabel = "doi:10.1000/ab##cd"
  const doubleHashTarget = "https://doi.org/10.1000/ab%23%23cd"
  const url = "www.example.org/electroencephalographically?variant=a_b"
  const footnote = Array(8).fill("Electroencephalographically").join(" ")
  const wrapped = [
    {
      label: `doi:${doi}`,
      markdown: `\`doi:${doi}\``,
      prefix: "doi:10.",
      target: `https://doi.org/${doi}`,
    },
    {
      label: `DOI: ${spacedDoi}`,
      markdown: `DOI: ${spacedDoi}`,
      prefix: "DOI: ",
      target: `https://doi.org/${spacedDoi}`,
    },
    { label: url, markdown: url, prefix: "www.", target: `https://${url}` },
  ]
  const spacedLinks = [
    "Space in identifier [`doi:10.1000/a  b`](https://doi.org/10.1000/a_b)",
    "NBSP [`doi:\u00a010.1000/a_b`](https://doi.org/10.1000/a_b)",
    "Em space [`doi:\u200310.1000/a_b`](https://doi.org/10.1000/a_b)",
  ].join("\n\n")
  const otherColumns = Array(4).fill("A wide column reserves room for the rest of the table.")
  try {
    await writeFile(
      input,
      [
        "# Link labels",
        "",
        spacedLinks,
        "",
        "[DOI:10.1000/uppercase](https://doi.org/10.1000/uppercase)",
        "",
        `Double hash [${doubleHashLabel}](${doubleHashTarget})`,
        "",
        "[`doi:  10.1000/repeated`](https://doi.org/10.1000/repeated)",
        "",
        `[10.1000/footnote^[${footnote}]](https://doi.org/10.1000/footnote)`,
        "",
        `[${relativeUrl}](${relativeUrl})`,
        "",
        `[[${bareWikiTitle}]]`,
        "",
        `| Label | ${otherColumns.join(" | ")} |`,
        "| --- | --- | --- | --- | --- |",
        ...wrapped.map(({ markdown, target }) => `| [${markdown}](${target}) | | | | |`),
        "| [HTTPS deployment electroencephalographically](https://example.org/) | | | | |",
        "",
      ].join("\n"),
    )
    const result = await convert(source, [source], {})
    const pdf = join("tex-pdfs", result.pdf)
    const text = execFileSync("pdftotext", ["-layout", pdf, "-"], { encoding: "utf8" })
    const urls = execFileSync("pdfinfo", ["-url", pdf], { encoding: "utf8" })
      .split("\n")
      .map((line) => line.trim().split(/\s+/).at(-1))
    const tex = await readFile(join(work, "lecture.tex"), "utf8")

    const lines = text.split("\n").map((line) => line.trim())
    const starts = [...wrapped.map(({ prefix }) => prefix), "HTTPS"].map((prefix) => {
      const start = lines.findIndex((line) => line.startsWith(prefix))
      assert(start >= 0, `Missing extracted line starting with ${prefix}`)
      return start
    })
    for (const [i, { label, target }] of wrapped.entries()) {
      const fragments = lines.slice(starts[i], starts[i + 1]).filter(Boolean)
      assert(fragments.length > 1, `Expected ${label} to wrap`)
      assert.equal(fragments.join(""), label)
      assert.equal(urls.filter((url) => url === target).length, fragments.length)
    }
    const pandocSpacedLinks = execFileSync("pandoc", ["-f", "markdown", "-t", "latex"], {
      input: spacedLinks,
      encoding: "utf8",
    }).trim()
    assert(tex.includes(pandocSpacedLinks), "Pandoc must retain spacings inside code labels")
    assert.match(tex, /\{DOI:\s+\\texorpdfstring\{\\lectureurl\{10\.12346\//)
    assert.match(text, /\bDOI:10\.1000\/uppercase\b/)
    assert(tex.includes(String.raw`{DOI:\texorpdfstring{\lectureurl{10.1000/uppercase}}`))
    assert(text.includes(doubleHashLabel), "Expected both hashes in the DOI label")
    assert(urls.includes(doubleHashTarget))
    assert(
      tex.includes(
        String.raw`\texttt{doi:\ \ }\texorpdfstring{\texttt{\lectureurl{10.1000/repeated}}`,
      ),
    )
    const note = tex.match(/\\footnote\{([^{}]+)\}/)?.[1]
    assert.equal(note?.replace(/\s+/g, " ").trim(), footnote)
    assert.match(text, /\bElec[a-z]*-\s/)
    assert.match(text, /\binternationalization\.md\b/)
    assert.match(tex, /\\lectureurl\{internationalization\.md\}/)
    assert(urls.includes(webLink(source, relativeUrl, [source])))
    assert(
      tex.includes(
        String.raw`\href{${webLink(source, bareWikiTitle, [source])}}{${bareWikiTitle}}`,
      ),
      "A bare wiki-link title must use the prose link label",
    )
    assert.match(text, /\belec[a-z]*-\s/)
  } finally {
    await rm(fixture, { recursive: true, force: true })
    await rm(work, { recursive: true, force: true })
    await rm(output, { recursive: true, force: true })
  }
})
