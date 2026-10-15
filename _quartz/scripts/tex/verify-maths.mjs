// Local authoring regression: verify the glyphs emitted by the real template.
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { resolve } from "node:path"

const quartz = fileURLToPath(new URL("../..", import.meta.url))
const work = resolve(quartz, ".quartz-cache/tex-maths")
mkdirSync(work, { recursive: true })
const env = { ...process.env, PATH: `/Library/TeX/texbin:/opt/homebrew/bin:${process.env.PATH}` }
const run = (tool, args, input) =>
  execFileSync(tool, args, { cwd: work, env, input, encoding: "utf8" })
const expressions = [
  String.raw`\boldsymbol{g v_i \Pi \sigma \nabla}`,
  String.raw`\bm{g v_i \Pi \sigma \nabla}`,
  String.raw`\mathbf{g v_i \Pi \sigma \nabla}`,
  String.raw`\boldsymbol{\mathcal{X}}`,
  String.raw`\bm{\mathcal{X}}`,
  String.raw`\mathbf{\mathcal{X}}`,
  String.raw`\overset{\nabla}{\boldsymbol{\mathcal{A}}}`,
]
const source = expressions.map((tex) => `$$${tex}$$`).join("\n\n")
const tex = run(
  "pandoc",
  [
    "--from=markdown",
    "--to=latex",
    "--standalone",
    "--template",
    resolve(quartz, "scripts/tex/lecture.tex"),
    "-M",
    "title=Bold mathematics regression",
    "-M",
    "course=Maths checks",
    "-M",
    "course-header=Maths checks",
    "-M",
    "web-url=https://blogs.comphy-lab.org/",
  ],
  source,
)
writeFileSync(resolve(work, "maths.tex"), tex)
run("lualatex", ["-interaction=nonstopmode", "-halt-on-error", "-no-shell-escape", "maths.tex"])
const text = run("pdftotext", ["maths.pdf", "-"])
// These are bold italic Latin/Greek, bold nabla and bold script X/A, not merely
// visually similar unbold glyphs. Count each command's actual PDF output.
for (const codepoint of [0x1d488, 0x1d497, 0x1d48a, 0x1d72b, 0x1d748, 0x1d6c1]) {
  const glyph = String.fromCodePoint(codepoint)
  assert.equal([...text].filter((char) => char === glyph).length, 3, `U+${codepoint.toString(16)}`)
}
assert.equal([...text].filter((char) => char === "𝓧").length, 3)
assert(text.includes("𝓐"))
console.log(
  `Verified 3 bold commands, Latin/Greek/nabla, nested calligraphic tensors and overset: ${work}/maths.pdf`,
)
