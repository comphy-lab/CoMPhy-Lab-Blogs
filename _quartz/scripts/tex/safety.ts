import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkMath from "remark-math"
import { visit } from "unist-util-visit"

// Reject file access, execution and the token/macro machinery that could hide
// those operations. Code examples are inert; maths and raw TeX are not.
const unsafeCommand =
  /^(?:.*(?:input|include|file|read|write|lua|import|font|graphic|image|bibliography|bibresource|attach|embed|command|environment|macro|hook).*|(?:new|renew|provide|declare)\w*|UseName|@nameuse|@namedef|pgf\w*|tikz\w*|epsf\w*|openin|openout|closein|closeout|immediate|catcode|csname|endcsname|expandafter|noexpand|scantokens|let|futurelet|(?:g|e|x)?def|ExplSyntaxOn|makeatletter|toks|every\w*|usepackage|RequirePackage|documentclass|LoadClass|special|shipout|pdf\w*|latelua|endlinechar|escapechar|global|globaldefs|afterassignment|aftergroup|loop|repeat)$/i

// LaTeX's \begin looks up a command by name, including primitives such as
// openout. Only literal maths environments may reach that dispatcher.
const mathEnvironment =
  /^(?:aligned|alignedat|align\*?|alignat\*?|cases|gathered|gather\*?|split|equation\*?|multline\*?|array|[pbBvV]?matrix\*?|smallmatrix)$/

export function assertSafeTex(text: string): void {
  if (text.includes("^^")) throw new Error("Unsafe TeX character escape (^^); using browser PDF")
  for (const match of text.matchAll(/\\([a-zA-Z@]+)/g)) {
    if (unsafeCommand.test(match[1]!))
      throw new Error(`Unsafe TeX command \\${match[1]}; using browser PDF`)
    if (match[1] === "begin" || match[1] === "end") {
      const name = /^\s*\{([^}]*)\}/.exec(text.slice(match.index + match[0].length))?.[1]
      if (!name || !mathEnvironment.test(name))
        throw new Error(`Unsafe TeX environment ${name ?? "(dynamic name)"}; using browser PDF`)
    }
  }
}

export function assertSafeSource(source: string): void {
  const tree = unified().use(remarkParse).use(remarkMath).parse(source)
  const code: [number, number][] = []
  visit(tree, (node) => {
    if (node.type !== "code" && node.type !== "inlineCode") return
    const start = node.position?.start.offset
    const end = node.position?.end.offset
    if (start !== undefined && end !== undefined) code.push([start, end])
  })
  let offset = 0
  for (const [start, end] of code.sort((a, b) => a[0] - b[0])) {
    assertSafeTex(source.slice(offset, start))
    offset = end
  }
  assertSafeTex(source.slice(offset))
}

export function assertSelfContainedSvg(bytes: Buffer): void {
  let svg = bytes.toString("utf8")
  // Do not let XML entities, processing instructions or CSS escapes conceal
  // resource URLs from the check below. Ordinary predefined/numeric entities
  // are decoded before inspecting href and CSS URL values.
  if (/<!\s*(?:DOCTYPE|ENTITY)|<\?xml-stylesheet|\bxml:base\s*=|\\|\0/i.test(svg))
    throw new Error("SVG has unsupported declarations or CSS escapes; using browser PDF")
  svg = svg.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, entity: string) => {
    if (entity[0] === "#") {
      const value =
        entity[1]?.toLowerCase() === "x"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10)
      return String.fromCodePoint(value)
    }
    return ({ amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" } as Record<string, string>)[
      entity.toLowerCase()
    ]!
  })
  // Removing comments also exposes CSS such as u/**/rl(...).
  svg = svg.replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, "")
  const local = (value: string) => /^(?:#|data:)/i.test(value.trim())
  const references = [
    ...svg.matchAll(/\b(?:xlink:)?href\s*=\s*["']([^"']*)["']/gi),
    ...svg.matchAll(/\burl\s*\(\s*["']?([^"')]*?)["']?\s*\)/gi),
    ...svg.matchAll(/@import\s*["']([^"']*)["']/gi),
  ]
  for (const match of references) {
    if (!local(match[1]!))
      throw new Error(`SVG external resource refused: ${match[1]}; using browser PDF`)
  }
}
