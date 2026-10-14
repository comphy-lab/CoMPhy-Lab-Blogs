import type { Root as MarkdownRoot, Paragraph, PhrasingContent, RootContent } from "mdast"
import type { VFile } from "vfile"
import { fromMarkdown } from "mdast-util-from-markdown"
import { visit } from "unist-util-visit"
import { visitParents } from "unist-util-visit-parents"
import type { QuartzTransformerPlugin } from "./types"

// The vault is written in Obsidian, whose display-maths rules are looser than
// remark-math's. These two steps make the site render what Obsidian shows.

const FENCE = "$$"

// Start offsets of exact, unescaped `$$` runs (`$$$` and `\$$` are not fences).
export function fencePositions(text: string): number[] {
  const positions: number[] = []
  for (let i = 0; i < text.length; ) {
    if (text[i] !== "$") {
      i++
      continue
    }
    let end = i
    while (text[end] === "$") end++
    let slashes = 0
    for (let j = i - 1; j >= 0 && text[j] === "\\"; j--) slashes++
    if (end - i === 2 && slashes % 2 === 0) positions.push(i)
    i = end
  }
  return positions
}

// Code, inline code and raw HTML keep their text verbatim. Find them with a
// plain CommonMark parse so list-indented, `~~~` and nested fences all count.
function protectedRanges(source: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = []
  visit(fromMarkdown(source), (node) => {
    if (node.type !== "code" && node.type !== "inlineCode" && node.type !== "html") return
    const start = node.position?.start.offset
    const end = node.position?.end.offset
    if (start !== undefined && end !== undefined) ranges.push([start, end])
  })
  return ranges
}

// remark-math only closes a display block on a line holding just `$$`, and it
// drops text after an opening `$$` as fence metadata. Obsidian accepts
// `$$\begin{cases}` … `\end{cases}$$`, so move such fences onto their own line.
// Blockquote/callout markers and indentation are kept.
export function normaliseMathFences(text: string): string {
  if (!text.includes(FENCE)) return text
  // Rebuilt lines use "\n"; normalise first so a CRLF file stays consistent.
  const source = text.replace(/\r\n?/g, "\n")
  const ranges = protectedRanges(source)
  const isProtected = (offset: number) =>
    ranges.some(([start, end]) => offset >= start && offset < end)
  const out: string[] = []
  let inMath = false
  let offset = 0
  for (const line of source.split("\n")) {
    const lineStart = offset
    offset += line.length + 1
    const prefix = /^(\s*>)+\s?/.exec(line)?.[0] ?? ""
    const body = line.slice(prefix.length)
    const text = body.trim()
    const indent = body.slice(0, body.length - body.trimStart().length)
    const fences = fencePositions(body)
    if (fences.length === 0 || isProtected(lineStart + prefix.length + fences[0]!)) {
      out.push(line)
      continue
    }
    if (inMath) {
      if (text === FENCE) inMath = false
      else if (fences.length === 1) {
        // `\end{cases}$$` or `x = 1.$$ where …`: close here, keep any prose after.
        const at = fences[0]!
        const before = body.slice(0, at).trimEnd()
        const after = body.slice(at + FENCE.length).trim()
        if (before.trim()) out.push(prefix + before)
        out.push(prefix + indent + FENCE)
        if (after) out.push(prefix + indent + after)
        inMath = false
        continue
      }
    } else if (text === FENCE) inMath = true
    else if (fences.length === 1 && body.trimStart().startsWith(FENCE)) {
      out.push(prefix + indent + FENCE, prefix + indent + text.slice(FENCE.length).trimStart())
      inMath = true
      continue
    }
    out.push(line)
  }
  return out.join("\n")
}

function displayMath(value: string, position: Paragraph["position"]): RootContent {
  // Same shape as mdast-util-math's display node, so rehype-mathjax sees it.
  return {
    type: "math",
    meta: null,
    value,
    position,
    data: {
      hName: "pre",
      hChildren: [
        {
          type: "element",
          tagName: "code",
          properties: { className: ["language-math", "math-display"] },
          children: [{ type: "text", value }],
        },
      ],
    },
  } as RootContent
}

function isBlank(node: PhrasingContent): boolean {
  return (node.type === "text" && node.value.trim() === "") || node.type === "break"
}

function isDoubleDollar(node: { type: string; position?: Paragraph["position"] }, source: string) {
  if (node.type !== "inlineMath") return false
  const start = node.position?.start.offset
  const end = node.position?.end.offset
  if (start === undefined || end === undefined) return false
  const raw = source.slice(start, end)
  return raw.startsWith(FENCE) && raw.endsWith(FENCE) && raw.length > 2 * FENCE.length
}

// Render an inline maths node as display maths where it stands.
function displayInPlace(node: PhrasingContent): void {
  const data = (node.data ?? {}) as { hProperties?: Record<string, unknown> }
  node.data = {
    ...data,
    hProperties: { ...data.hProperties, className: ["language-math", "math-display"] },
  } as typeof node.data
}

// Prose left either side of an equation becomes its own paragraph, without the
// line breaks or spaces that separated it from the equation.
function proseParagraph(children: PhrasingContent[]): Paragraph | undefined {
  const content = [...children]
  while (content.length > 0 && isBlank(content[0]!)) content.shift()
  while (content.length > 0 && isBlank(content.at(-1)!)) content.pop()
  if (content.length === 0) return undefined
  const first = content[0]!
  if (first.type === "text") content[0] = { ...first, value: first.value.trimStart() }
  const last = content.at(-1)!
  if (last.type === "text") content[content.length - 1] = { ...last, value: last.value.trimEnd() }
  return { type: "paragraph", children: content }
}

// Obsidian always shows `$$…$$` as display maths, even on a line inside a
// paragraph ("Hooke's law:\n$$\sigma = E\varepsilon$$"); remark-math parses it
// as inline maths. Split such paragraphs around each equation. Where splitting
// would break raw HTML or emphasis around the equation, display it in place.
// Headings and table cells keep inline maths.
export function promoteDisplayMath(root: MarkdownRoot, source: string): void {
  visit(root, "paragraph", (paragraph: Paragraph, index, parent) => {
    if (!parent || index === undefined) return
    if (!paragraph.children.some((child) => isDoubleDollar(child, source))) return
    if (paragraph.children.some((child) => child.type === "html")) return
    const blocks: RootContent[] = []
    let prose: PhrasingContent[] = []
    const flush = () => {
      const text = proseParagraph(prose)
      if (text) blocks.push(text)
      prose = []
    }
    for (const child of paragraph.children) {
      if (!isDoubleDollar(child, source)) {
        prose.push(child)
        continue
      }
      flush()
      blocks.push(displayMath((child as { value: string }).value, child.position))
    }
    flush()
    parent.children.splice(index, 1, ...(blocks as typeof parent.children))
    return index + blocks.length
  })
  visitParents(root, "inlineMath", (node, ancestors) => {
    if (!isDoubleDollar(node, source)) return
    if (ancestors.some((a) => a.type === "heading" || a.type === "tableCell")) return
    displayInPlace(node as PhrasingContent)
  })
}

export const ObsidianMath: QuartzTransformerPlugin = () => ({
  name: "ObsidianMath",
  textTransform(_ctx, src) {
    return normaliseMathFences(src)
  },
  markdownPlugins() {
    return [() => (root: MarkdownRoot, file: VFile) => promoteDisplayMath(root, String(file.value))]
  },
})
