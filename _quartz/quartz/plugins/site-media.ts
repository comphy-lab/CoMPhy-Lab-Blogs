import path from "node:path"
import fs from "node:fs/promises"
import sharp from "sharp"
import { visit } from "unist-util-visit"
import { toString as hastToString } from "hast-util-to-string"
import type { Element, Root } from "hast"
import type { Pluggable } from "unified"
import type { QuartzTransformerPlugin } from "./types"
import type { BuildCtx } from "../util/ctx"

const RASTER = /\.(png|jpe?g)$/i

export function contentImageVaultPath(pageSlug: string, src: string): string | null {
  if (!src || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(src)) return null
  const cut = Math.min(
    ...["#", "?"].map((mark) => {
      const index = src.indexOf(mark)
      return index < 0 ? src.length : index
    }),
  )
  let pathname = src.slice(0, cut)
  try {
    pathname = decodeURI(pathname)
  } catch (error) {
    if (!(error instanceof URIError)) throw error
    return null
  }
  if (!RASTER.test(pathname)) return null
  if (pathname.startsWith("/")) {
    const rooted = pathname.replace(/^\/+/, "")
    if (rooted.split("/").some((part) => part === ".." || part === ".")) return null
    return rooted
  }
  const pageDir = pageSlug.split("/").slice(0, -1)
  const stack = [...pageDir]
  for (const part of pathname.split("/")) {
    if (part === "" || part === ".") continue
    if (part === "..") {
      if (stack.length === 0) return null
      stack.pop()
      continue
    }
    stack.push(part)
  }
  return stack.join("/")
}

export function webpSrc(src: string): string {
  return src.replace(/\.(png|jpe?g)(?=[?#]|$)/i, ".webp")
}

function positiveInteger(value: unknown): boolean {
  const number = typeof value === "number" ? value : Number(value)
  return Number.isInteger(number) && number > 0
}

export function imagePresentation(index: number): {
  loading: "eager" | "lazy"
  decoding: "async"
  fetchPriority?: "high"
} {
  if (index === 0) return { loading: "eager", decoding: "async", fetchPriority: "high" }
  return { loading: "lazy", decoding: "async" }
}

function classList(element: Element): string[] {
  const value = element.properties?.className
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === "string") return value.split(/\s+/)
  return []
}

function isMathSource(element: Element): boolean {
  const classes = classList(element)
  return (
    classes.includes("math-inline") ||
    classes.includes("math-display") ||
    classes.includes("language-math")
  )
}

export function labelRenderedMath(tree: Root, sources: string[]): void {
  let index = 0
  visit(tree, "element", (element) => {
    if (element.tagName !== "mjx-container") return
    const svg = element.children.find(
      (child): child is Element => child.type === "element" && child.tagName === "svg",
    )
    if (!svg) return
    const label = sources[index++]?.replace(/\s+/g, " ").trim()
    if (!label) return
    svg.properties = { ...svg.properties, role: "img", ariaLabel: label }
  })
}

type Attacher = (
  this: unknown,
  ...settings: unknown[]
) => ((tree: Root, file: unknown) => unknown) | void

function isAttacherTuple(plugin: Pluggable): plugin is [Attacher, ...unknown[]] {
  return Array.isArray(plugin)
}

// rehype-mathjax replaces the TeX node, so the source has to be captured first.
// The SVG is role="img" with no accessible name. aria-label keeps the TeX.
export function withMathLabels(plugin: Pluggable): Pluggable {
  const [attach, ...settings] = isAttacherTuple(plugin) ? plugin : [plugin as Attacher]
  const wrapped: Attacher = () => (tree, file) => {
    const sources: string[] = []
    visit(tree, "element", (element) => {
      if (isMathSource(element)) sources.push(hastToString(element))
    })
    const transformer = attach(...settings)
    const result = transformer ? transformer(tree, file) : undefined
    const label = () => labelRenderedMath(tree, sources)
    if (result && typeof (result as Promise<unknown>).then === "function") {
      return (result as Promise<unknown>).then(label)
    }
    label()
    return result
  }
  return wrapped
}

export function installMathLabels(
  transformers: { name: string; htmlPlugins?: (ctx: BuildCtx) => Pluggable[] }[],
): void {
  const latex = transformers.find((plugin) => plugin.name === "Latex")
  if (!latex?.htmlPlugins) throw new Error("Latex is required to label MathJax output")
  const original = latex.htmlPlugins.bind(latex)
  latex.htmlPlugins = (ctx) => original(ctx).map((plugin) => withMathLabels(plugin))
}

const webpWrites = new Map<string, Promise<void>>()

async function ensureWebp(source: string, destination: string): Promise<void> {
  const pending = webpWrites.get(destination)
  if (pending) return pending
  const write = (async () => {
    await fs.mkdir(path.dirname(destination), { recursive: true })
    try {
      const [sourceStat, destStat] = await Promise.all([
        fs.stat(source),
        fs.stat(destination).catch(() => null),
      ])
      if (destStat && destStat.mtimeMs >= sourceStat.mtimeMs && destStat.size > 0) return
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return
      throw error
    }
    await sharp(source).webp({ quality: 80, effort: 4 }).toFile(destination)
  })()
  webpWrites.set(destination, write)
  return write
}

export const ContentImages: QuartzTransformerPlugin = () => ({
  name: "ContentImages",
  htmlPlugins(ctx) {
    return [
      () => async (tree, file) => {
        const slug = String(file.data.slug ?? "")
        const vault = path.resolve(ctx.argv.directory)
        const output = path.resolve(ctx.argv.output)
        let rasterIndex = 0
        const writes: Promise<void>[] = []
        visit(tree, "element", (element) => {
          if (element.tagName !== "img") return
          const src = element.properties?.src
          if (typeof src !== "string") return
          if (
            positiveInteger(element.properties?.width) &&
            positiveInteger(element.properties?.height)
          ) {
            return
          }
          const vaultPath = contentImageVaultPath(slug, src)
          if (!vaultPath) return
          const presentation = imagePresentation(rasterIndex)
          rasterIndex += 1
          const absolute = path.join(vault, vaultPath)
          writes.push(
            (async () => {
              try {
                await fs.access(absolute)
                const metadata = await sharp(absolute).metadata()
                if (!metadata.width || !metadata.height) return
                const destination = path.join(output, webpSrc(vaultPath))
                await ensureWebp(absolute, destination)
                element.properties = {
                  ...element.properties,
                  src: webpSrc(src),
                  width: metadata.width,
                  height: metadata.height,
                  loading: presentation.loading,
                  decoding: presentation.decoding,
                  ...(presentation.fetchPriority
                    ? { fetchPriority: presentation.fetchPriority }
                    : {}),
                }
              } catch (error) {
                if ((error as NodeJS.ErrnoException).code === "ENOENT") return
                throw error
              }
            })(),
          )
        })
        await Promise.all(writes)
      },
    ]
  },
})
