import assert from "node:assert/strict"
import { test } from "node:test"
import { manifestDefect, requireFreshTex, texRegressions } from "./tex-fallback.mjs"

test("only local builds require fresh TeX PDFs, unless the fallback is accepted", () => {
  assert.equal(requireFreshTex({}), true)
  assert.equal(requireFreshTex({ WORKERS_CI: "1" }), false)
  assert.equal(requireFreshTex({ CI: "true" }), false)
  assert.equal(requireFreshTex({ ALLOW_STALE_TEX_PDFS: "1" }), false)
  assert.equal(requireFreshTex({ ALLOW_STALE_TEX_PDFS: "0" }), true)
})

test("a manifest without a version-1 page map is a defect", () => {
  assert.equal(manifestDefect({ version: 1, pages: {} }), null)
  for (const damaged of [
    null,
    [],
    "pages",
    { version: 1 },
    { version: 1, pages: "damaged" },
    { version: 1, pages: [] },
    { version: 2, pages: {} },
  ])
    assert.ok(manifestDefect(damaged), JSON.stringify(damaged))
})

test("a fallback counts as a regression only for pages that had a TeX PDF", () => {
  const files = ["Lecture-Notes/a.md", "Lecture-Notes/b.md", "constructor"]
  const stale = [
    { source: "Lecture-Notes/a.md", reason: "inputs changed" },
    { source: "Lecture-Notes/b.md", reason: "no manifest entry" },
    { source: "constructor", reason: "no manifest entry" },
  ]
  const manifest = { version: 1, pages: { "Lecture-Notes/a.md": {} } }
  assert.deepEqual(texRegressions(manifest, stale, files), [stale[0]])
  assert.deepEqual(texRegressions({ version: 1, pages: "damaged" }, stale, files), [])
})

test("moving every typeset note to a new folder is a regression", () => {
  const manifest = {
    version: 1,
    pages: { "Lecture-Notes/C/1-a.md": {}, "Lecture-Notes/C/2-b.md": {} },
  }
  const files = ["Lecture-Notes/C/2025/1-a.md", "Lecture-Notes/C/2025/2-b.md"]
  const stale = files.map((source) => ({ source, reason: "no manifest entry" }))
  assert.deepEqual(
    texRegressions(manifest, stale, files).map(({ source }) => source),
    ["Lecture-Notes/C/1-a.md", "Lecture-Notes/C/2-b.md"],
  )
})
