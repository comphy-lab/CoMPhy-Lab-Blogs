import { posix } from "node:path"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkMath from "remark-math"
import { visit } from "unist-util-visit"
import { slug as headingSlug } from "github-slugger"
import { slugifyFilePath } from "@quartz-community/utils"
import type { FilePath } from "@quartz-community/utils"
import { normaliseMathFences } from "../../quartz/plugins/site-math"
import { resolveVaultLink } from "../../quartz/plugins/site-links"
import { obsidianImageSize, displaySize } from "../../quartz/plugins/site-media"

export const origin = "https://blogs.comphy-lab.org"
export const slugFor = (source: string) => slugifyFilePath(source as FilePath)

export function courseHeader(title: string): string {
  const compact = title.replace(/\s+/g, " ").trim()
  if (compact.length <= 52) return compact
  const shortened = compact.replace(/:\s*An Introduction\b/i, "")
  if (shortened.length <= 52) return shortened
  // Keep the year when shortening a long course title at a word boundary.
  const year = /\s*\(\d{4}\)$/.exec(shortened)?.[0] ?? ""
  const name = year ? shortened.slice(0, -year.length) : shortened
  const prefix = name
    .slice(0, 49 - year.length)
    .replace(/\s+\S*$/, "")
    .trimEnd()
  return `${prefix}…${year}`
}

// All source substitutions preserve literal code and maths. Pandoc performs
// the actual Markdown parsing; regexes here only bridge Obsidian syntax.
function literalRanges(source: string): [number, number][] {
  const tree = unified().use(remarkParse).use(remarkMath).parse(source)
  const ranges: [number, number][] = []
  visit(tree, (node) => {
    if (!["code", "inlineCode", "math", "inlineMath"].includes(node.type)) return
    const start = node.position?.start.offset
    const end = node.position?.end.offset
    if (start !== undefined && end !== undefined) ranges.push([start, end])
  })
  ranges.sort((a, b) => a[0] - b[0])
  return ranges
}

export function outsideLiterals(source: string, transform: (text: string) => string): string {
  const ranges = literalRanges(source)
  let offset = 0
  let output = ""
  for (const [start, end] of ranges) {
    if (start < offset) continue
    output += transform(source.slice(offset, start)) + source.slice(start, end)
    offset = end
  }
  return output + transform(source.slice(offset))
}

export function stripExportBlocks(source: string): string {
  for (const marker of ["PDF-EXPORT-IGNORE", "BLOG-PDF-LINK"]) {
    const ranges = literalRanges(source)
    const pattern = new RegExp(
      `<!--\\s*${marker}-START\\s*-->[\\s\\S]*?<!--\\s*${marker}-END\\s*-->`,
      "g",
    )
    source = source.replace(pattern, (block, offset: number) =>
      ranges.some(([start, end]) => offset >= start && offset < end) ? block : "",
    )
  }
  return source
}

function htmlAttribute(tag: string, name: string): string {
  return new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i").exec(tag)?.[1] ?? ""
}

export function prepareMarkdown(source: string): string {
  source = stripExportBlocks(source)
  source = outsideLiterals(source, (text) =>
    text
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, (html) => {
        const url = htmlAttribute(html, "src").replace(/&amp;/g, "&")
        const id = /https?:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/.exec(url)?.[1]
        const target = id ? `https://www.youtube.com/watch?v=${id}` : url
        return target ? `\n\nVideo: <${target}>\n\n` : ""
      })
      .replace(/<img\b[^>]*>/gi, (html) => {
        const src = htmlAttribute(html, "src")
        const alt = htmlAttribute(html, "alt").replace(/[\[\]]/g, "")
        const width = htmlAttribute(html, "width")
        const height = htmlAttribute(html, "height")
        const size = /^\d+$/.test(width)
          ? `|${width}${/^\d+$/.test(height) ? `x${height}` : ""}`
          : ""
        return `\n\n![${alt}${size}](<${src}>)\n\n`
      })
      .replace(/<br\s*\/?\s*>/gi, "  \n")
      .replace(/<\/?(?:div|span|p|figure|figcaption|section|center)\b[^>]*>/gi, "\n"),
  )
  source = outsideLiterals(source, (text) =>
    text
      .replace(/(!?)\[\[([^\]]+)\]\]/g, (_match, embed, inner: string) => {
        const [target, ...alias] = inner.replace(/\\\|/g, "|").split("|")
        let label = alias.join("|") || (embed ? "" : target.split("#").at(-1)!)
        if (embed && /^\d+(?:x\d+)?$/.test(label)) label = `|${label}`
        return `${embed}[${label.replace(/[\[\]]/g, "")}](<${target}>)`
      })
      // Pandoc requires a blank before a blockquote, including one directly
      // after display maths. Leave literal examples and TeX untouched.
      .replace(/^([ \t]*>[ \t]*\[![\w-]+\])/gm, "\n$1"),
  )
  // Pandoc already gives every $$…$$ display semantics, including single-line
  // displays. Reuse Quartz's multiline fence normaliser for Obsidian cases.
  return normaliseMathFences(source)
}

export function resolveTarget(source: string, target: string, files: string[]): string | undefined {
  const paths = new Map<string, string>(files.map((file) => [slugFor(file), file]))
  const resolved = resolveVaultLink(slugFor(source), target, new Set(paths.keys()))
  return paths.get(resolved.split(/[?#]/)[0]!)
}

export function webLink(source: string, target: string, files: string[]): string {
  if (/^(?:[a-z][\w+.-]*:|\/\/)/i.test(target)) return target
  const [, pathname = "", query = "", fragment = ""] = /^([^?#]*)(\?[^#]*)?(?:#([\s\S]*))?$/.exec(
    target,
  )!
  // Match resolveVaultLink's treatment of malformed percent escapes.
  const decode = (value: string) => {
    try {
      return decodeURI(value)
    } catch (error) {
      if (!(error instanceof URIError)) throw error
      return value
    }
  }
  const anchor = fragment ? `#${headingSlug(decode(fragment))}` : ""
  if (!pathname) return query + anchor
  const found = resolveTarget(source, pathname, files)
  const route = found
    ? slugFor(found)
    : posix.normalize(
        posix.join(posix.dirname(slugFor(source)), decode(pathname).replace(/\.md$/, "")),
      )
  return `${origin}/${route.split("/").map(encodeURIComponent).join("/")}${query}${anchor}`
}

// Alt text is for screen readers: the site never shows it, so the PDF does not
// print it either. Visible captions are the paragraph after the image.
export function imageLayout(alt: string, natural: { width: number; height: number }) {
  const size = displaySize(natural, obsidianImageSize(alt))
  return { fraction: Math.min(1, size.width / 900) }
}
