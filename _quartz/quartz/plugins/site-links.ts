import path from "node:path"
import fs from "node:fs/promises"
import { visit } from "unist-util-visit"
import { escapeHTML, slugifyFilePath, simplifySlug } from "@quartz-community/utils"
import type { FilePath, FullSlug } from "@quartz-community/utils"
import type { QuartzEmitterPlugin, QuartzTransformerPlugin } from "./types"

// Resolve real vault paths before CrawlLinks applies its shortest-name fallback.
// In particular, ./file.pdf is relative to its article even when another PDF
// with the same name exists in _Media/PDF.
export function resolveVaultLink(source: string, target: string, slugs: Set<string>) {
  if (!target || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(target)) return target
  const hash = target.indexOf("#")
  const rawPath = hash < 0 ? target : target.slice(0, hash)
  const anchor = hash < 0 ? "" : target.slice(hash)
  let decoded: string
  try {
    decoded = decodeURI(rawPath)
  } catch (error) {
    if (!(error instanceof URIError)) throw error
    decoded = rawPath
  }
  const slug = slugifyFilePath(decoded as FilePath)
  const local = path.posix.normalize(path.posix.join(path.posix.dirname(source), slug))
  const root = slug.replace(/^\.?\//, "")
  const explicitRelative = /^\.\.?\//.test(decoded)
  const candidates = explicitRelative ? [local] : [root, local]
  let resolved = candidates.find((candidate) => slugs.has(candidate))
  if (!resolved && !explicitRelative) {
    const matches = [...slugs].filter((candidate) => candidate.endsWith("/" + root))
    if (matches.length === 1) resolved = matches[0]
  }
  return resolved ? resolved + anchor : target
}

export const VaultLinks: QuartzTransformerPlugin = () => ({
  name: "VaultLinks",
  htmlPlugins(ctx) {
    return [
      () => (tree, file) => {
        const slugs = new Set(ctx.allSlugs)
        visit(tree, "element", (node) => {
          for (const attr of ["href", "src"] as const) {
            const value = node.properties?.[attr]
            if (typeof value === "string") {
              node.properties[attr] = resolveVaultLink(file.data.slug!, value, slugs)
            }
          }
        })
      },
    ]
  },
})

export function aliasRoutes(pages: { slug: string; aliases: string[] }[]) {
  const canonical = new Set(pages.map((page) => simplifySlug(page.slug as FullSlug)))
  const routes = new Map<string, string>()
  for (const page of pages) {
    const target = simplifySlug(page.slug as FullSlug)
    for (const alias of page.aliases) {
      const route = simplifySlug(alias as FullSlug)
      // Aliases must never overwrite an article, including their own article.
      if (canonical.has(route)) continue
      if (
        !route ||
        route.startsWith("/") ||
        route.split("/").some((p) => p === ".." || p === ".")
      ) {
        throw new Error(`Invalid alias path: ${alias}`)
      }
      const previous = routes.get(route)
      if (previous && previous !== target) throw new Error(`Ambiguous alias: ${alias}`)
      routes.set(route, target)
    }
  }
  return routes
}

export const SafeAliasRedirects: QuartzEmitterPlugin = () => ({
  name: "SafeAliasRedirects",
  async *emit(ctx, content) {
    const routes = aliasRoutes(
      content.map(([, file]) => ({
        slug: file.data.slug!,
        aliases: (file.data as { aliases?: string[] }).aliases ?? [],
      })),
    )
    for (const [alias, target] of routes) {
      const url = "/" + target.split("/").map(encodeURIComponent).join("/")
      const destination = path.join(ctx.argv.output, alias + ".html")
      await fs.mkdir(path.dirname(destination), { recursive: true })
      await fs.writeFile(
        destination,
        `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>${escapeHTML(target)}</title><meta name="robots" content="noindex">
<link rel="canonical" href="${escapeHTML(url)}">
<meta http-equiv="refresh" content="0; url=${escapeHTML(url)}">
</head><body><a href="${escapeHTML(url)}">Continue to article</a></body></html>`,
      )
      yield destination as FilePath
    }
  },
})
