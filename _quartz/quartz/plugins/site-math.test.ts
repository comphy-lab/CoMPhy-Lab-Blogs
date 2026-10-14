import { test } from "node:test"
import assert from "node:assert/strict"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkMath from "remark-math"
import remarkRehype from "remark-rehype"
import type { Root as MarkdownRoot } from "mdast"
import type { Root as HtmlRoot, Element } from "hast"
import { visit } from "unist-util-visit"
import { fencePositions, normaliseMathFences, promoteDisplayMath } from "./site-math"

function mathClasses(markdown: string): string[] {
  const source = normaliseMathFences(markdown)
  const processor = unified().use(remarkParse).use(remarkMath)
  const mdast = processor.parse(source) as MarkdownRoot
  promoteDisplayMath(mdast, source)
  const hast = unified().use(remarkRehype).runSync(mdast) as HtmlRoot
  const found: string[] = []
  visit(hast, "element", (element: Element) => {
    const classes = element.properties?.className
    if (!Array.isArray(classes) || !classes.includes("language-math")) return
    found.push(classes.includes("math-display") ? "display" : "inline")
  })
  return found
}

test("fences that share a line with TeX move onto their own lines", () => {
  assert.equal(
    normaliseMathFences("$$G \\sim\n\\begin{cases}\na\n\\end{cases}$$\n\nNext"),
    "$$\nG \\sim\n\\begin{cases}\na\n\\end{cases}\n$$\n\nNext",
  )
  assert.equal(
    normaliseMathFences("> $$\\begin{align}\n> a &= b\n> \\end{align}$$"),
    "> $$\n> \\begin{align}\n> a &= b\n> \\end{align}\n> $$",
  )
  assert.equal(normaliseMathFences("$$\nx = 1.$$ where x"), "$$\nx = 1.\n$$\nwhere x")
})

test("CRLF files normalise to consistent line endings", () => {
  assert.equal(normaliseMathFences("$$a\r\nb$$\r\nText"), "$$\na\nb\n$$\nText")
})

test("fence normalisation leaves correct maths and code untouched", () => {
  const untouched = [
    "$$\nE = mc^2\n$$",
    "Inline $a$ and $$b$$ in a sentence.",
    "$$K \\sim U/a^3$$",
    "```bash\n$$ echo $$\n$$x\n```",
    "- item\n\n  ```tex\n  $$x\n  ```",
    "~~~md\n```\n$$x\n```\n~~~",
    "<pre>\n$$x\ny$$\n</pre>",
    "$$$\nx\n$$$",
    "Cost \\$$5 and \\$$6.",
  ]
  for (const text of untouched) assert.equal(normaliseMathFences(text), text)
})

test("only exact, unescaped $$ runs count as fences", () => {
  assert.deepEqual(fencePositions("$$a$$"), [0, 3])
  assert.deepEqual(fencePositions("$$$ \\$$ \\\\$$"), [10])
  assert.deepEqual(fencePositions("$a$"), [])
})

test("an escaped $$ inside a display block does not close it", () => {
  assert.equal(normaliseMathFences("$$\nx+\\$$\ny\n$$\n\nAfter"), "$$\nx+\\$$\ny\n$$\n\nAfter")
})

test("a paragraph of $$…$$ renders as display maths, as in Obsidian", () => {
  assert.deepEqual(mathClasses("$$K \\sim \\frac{U}{a^3}$$"), ["display"])
  assert.deepEqual(mathClasses("$$a$$\n$$b$$"), ["display", "display"])
  assert.deepEqual(mathClasses("- $$\\varepsilon = \\sigma/E$$"), ["display"])
  assert.deepEqual(mathClasses("> $$x = 1$$"), ["display"])
})

test("$$…$$ inside a paragraph becomes its own display block", () => {
  assert.deepEqual(mathClasses("**Hooke's Law:**\n$$\\sigma = E\\varepsilon$$"), ["display"])
  assert.deepEqual(
    mathClasses("The ratio $$\\text{Wi} = \\lambda\\dot\\gamma$$ matters, as $x$ does."),
    ["display", "inline"],
  )
  assert.deepEqual(mathClasses("Speed $v$ only."), ["inline"])
})

test("prose around a promoted equation keeps its words", () => {
  const source = "**Hooke's Law:**\n$$a$$\nwhere $a$ is stress."
  const mdast = unified().use(remarkParse).use(remarkMath).parse(source) as MarkdownRoot
  promoteDisplayMath(mdast, source)
  assert.deepEqual(
    mdast.children.map((node) => node.type),
    ["paragraph", "math", "paragraph"],
  )
  const html = unified().use(remarkRehype).runSync(mdast) as HtmlRoot
  const text: string[] = []
  visit(html, "text", (node: { value: string }) => {
    if (node.value.trim()) text.push(node.value)
  })
  assert.deepEqual(text, ["Hooke's Law:", "a", "where ", "a", " is stress."])
})

test("equations inside raw HTML or emphasis display in place", () => {
  const source = '<span style="color:red">Before $$x$$ after</span>'
  const mdast = unified().use(remarkParse).use(remarkMath).parse(source) as MarkdownRoot
  promoteDisplayMath(mdast, source)
  assert.deepEqual(
    mdast.children.map((node) => node.type),
    ["paragraph"],
  )
  assert.deepEqual(mathClasses(source), ["display"])
  assert.deepEqual(mathClasses("**$$x$$** and $y$"), ["display", "inline"])
  assert.deepEqual(mathClasses("# Title $$x$$"), ["inline"])
})

test("broken Obsidian fences render as one display block, not swallowed prose", () => {
  assert.deepEqual(mathClasses("$$G \\sim\n\\begin{cases}\na\n\\end{cases}$$\n\nText $x$."), [
    "display",
    "inline",
  ])
})
