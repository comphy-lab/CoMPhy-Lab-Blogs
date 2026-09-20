import type { QuartzConfig, FullPageLayout } from "../cfg"
import type { QuartzComponent, QuartzComponentConstructor } from "../components/types"
import type { QuartzTransformerPlugin } from "./types"
import type { Root as MarkdownRoot } from "mdast"
import type { Root as HtmlRoot } from "hast"
import type { VFile } from "vfile"
import matter from "gray-matter"
import { toString } from "mdast-util-to-string"
import { visit } from "unist-util-visit"

interface ExplorerNode {
  slugSegment?: string
  slugSegments?: string[]
}

// The Explorer serialises this function into its browser script, so it must
// contain no references to module variables or closures.
export function showInExplorer(node: ExplorerNode): boolean {
  if (node.slugSegment === "tags") return false
  return !(
    node.slugSegments?.length === 1 &&
    (node.slugSegment === "_AtomicNotes" || node.slugSegment === "0_README")
  )
}

export function folderTitle(slug: string): string {
  const segments = slug.split("/")
  const folder = segments.at(-1) === "index" ? segments.at(-2) : segments.at(-1)
  if (!folder) throw new Error(`Invalid folder page slug: ${slug}`)
  return folder.replace(/^_+/, "").replace(/[-_]+/g, " ")
}

export function assertRequiredPageTypes(config: QuartzConfig): void {
  const names = new Set(config.plugins.pageTypes?.map((pageType) => pageType.name))
  for (const name of ["ContentPage", "FolderPage", "TagPage"]) {
    if (!names.has(name)) throw new Error(`Required Quartz page type did not load: ${name}`)
  }
}

export function firstSourceHeading(root: MarkdownRoot): string | undefined {
  const heading = root.children.find((node) => node.type === "heading" && node.depth === 1)
  return heading ? readableHeading(heading) : undefined
}

function readableHeading(heading: MarkdownRoot["children"][number]): string | undefined {
  return toString(heading, { includeHtml: false }).replace(/\s+/g, " ").trim() || undefined
}

interface TocEntry {
  depth: number
  text: string
  slug: string
}

export function matchTocToRenderedHeadings(
  toc: TocEntry[],
  root: HtmlRoot,
): TocEntry[] | undefined {
  const ids: string[] = []
  visit(root, "element", (node) => {
    if (!/^h[12]$/.test(node.tagName)) return
    const id = node.properties?.id
    if (typeof id === "string") ids.push(id)
  })
  if (ids.length !== toc.length) return undefined
  return toc.map((entry, index) => ({ ...entry, slug: ids[index]! }))
}

// TOC's Markdown slugger does not see the final IDs assigned by rehype-slug
// (notably headings containing inline HTML). Use the rendered IDs instead.
export const RenderedTocAnchors: QuartzTransformerPlugin = () => ({
  name: "RenderedTocAnchors",
  markdownPlugins() {
    return [
      () => (root: MarkdownRoot, file: VFile) => {
        const toc = file.data.toc as TocEntry[] | undefined
        if (!toc) return
        const headings: string[] = []
        visit(root, "heading", (node) => {
          if (node.depth <= 2) headings.push(readableHeading(node) ?? "")
        })
        if (headings.length !== toc.length) return
        toc.forEach((entry, index) => {
          entry.text = headings[index]!
        })
      },
    ]
  },
  htmlPlugins() {
    return [
      () => (root: HtmlRoot, file: VFile) => {
        const toc = file.data.toc as TocEntry[] | undefined
        if (!toc) return
        const matched = matchTocToRenderedHeadings(toc, root)
        if (matched) file.data.toc = matched
        else delete file.data.toc
      },
    ]
  },
})

// NoteProperties establishes frontmatter and falls back to the file stem.
// Improve that fallback from the article's own H1 while leaving explicit
// frontmatter titles untouched.
export const SourceHeadingTitle: QuartzTransformerPlugin = () => ({
  name: "SourceHeadingTitle",
  markdownPlugins() {
    return [
      () => (root: MarkdownRoot, file: VFile) => {
        const heading = firstSourceHeading(root)
        if (!heading) return
        file.data.sourceHeadingTitle = true
        const declared = matter(String(file.value)).data.title
        if (declared !== undefined && declared !== null && String(declared) !== "") return
        if (file.data.frontmatter) file.data.frontmatter.title = heading
      },
    ]
  },
})

// When the article opens with its own H1, move that heading into the page
// header: remove it from the rendered body (so ArticleTitle renders the same
// text above the metadata) and drop its entry from the table of contents.
// An H1 that appears later in the body is left where the author put it.
export const HoistLeadingHeading: QuartzTransformerPlugin = () => ({
  name: "HoistLeadingHeading",
  htmlPlugins() {
    return [
      () => (root: HtmlRoot, file: VFile) => {
        if (!file.data.sourceHeadingTitle) return
        const first = root.children.find((node) => node.type === "element")
        if (!first || first.type !== "element" || first.tagName !== "h1") return
        const index = root.children.indexOf(first)
        root.children.splice(index, 1)
        file.data.hoistedHeading = true
        const toc = file.data.toc as TocEntry[] | undefined
        if (toc && toc.length > 0 && toc[0]!.depth === 0) {
          const rest = toc.slice(1)
          const min = Math.min(...rest.map((entry) => entry.depth))
          file.data.toc = rest.map((entry) => ({
            ...entry,
            depth: entry.depth - min,
          }))
        }
      },
    ]
  },
})

export async function configureSiteNavigation(config: QuartzConfig): Promise<{
  defaults: Partial<FullPageLayout>
  byPageType: Record<string, Partial<FullPageLayout>>
}> {
  assertRequiredPageTypes(config)
  const [{ componentRegistry }, { PageTypeDispatcher }, { loadQuartzLayout }] = await Promise.all([
    import("../components/registry"),
    import("./pageTypes"),
    import("./loader/config-loader"),
  ])

  const folderPage = config.plugins.pageTypes!.find((pageType) => pageType.name === "FolderPage")!
  const generateFolders = folderPage.generate
  if (!generateFolders) throw new Error("FolderPage cannot generate folder pages")
  folderPage.generate = (...args) =>
    generateFolders(...args).map((page) => ({
      ...page,
      title: folderTitle(page.slug),
    }))

  const frontmatterIndex = config.plugins.transformers.findIndex(
    (transformer) => transformer.name === "NoteProperties",
  )
  if (frontmatterIndex < 0) throw new Error("Required NoteProperties transformer did not load")
  config.plugins.transformers.splice(frontmatterIndex + 1, 0, SourceHeadingTitle())
  const tocIndex = config.plugins.transformers.findIndex(
    (transformer) => transformer.name === "TableOfContents",
  )
  const sluggerIndex = config.plugins.transformers.findIndex(
    (transformer) => transformer.name === "GitHubFlavoredMarkdown",
  )
  if (tocIndex < 0 || sluggerIndex < 0)
    throw new Error("Required Quartz TOC or heading IDs did not load")
  config.plugins.transformers.push(HoistLeadingHeading(), RenderedTocAnchors())

  const explorer = componentRegistry.get("explorer")
  if (!explorer || typeof explorer.component !== "function") {
    throw new Error("Required Quartz Explorer component did not load")
  }
  const originalExplorer = explorer.component as QuartzComponentConstructor<{
    filterFn?: typeof showInExplorer
  }>
  // @ts-expect-error Quartz's inline-script loader imports this browser module as text.
  const { default: explorerControls } = await import("./site-explorer.inline.ts")
  componentRegistry.register(
    "explorer",
    (options: { filterFn?: typeof showInExplorer }) => {
      const component = originalExplorer({
        ...options,
        filterFn: showInExplorer,
      })
      component.afterDOMLoaded = [component.afterDOMLoaded, explorerControls]
        .flat()
        .filter((script): script is string => typeof script === "string")
      return component
    },
    explorer.source,
    explorer.manifest,
  )

  const graph = componentRegistry.get("graph")
  if (graph) {
    if (typeof graph.component !== "function") throw new Error("Quartz Graph is not a component")
    const originalGraph = graph.component as QuartzComponentConstructor<Record<string, unknown>>
    // @ts-expect-error Quartz's inline-script loader imports this browser module as text.
    const { default: graphControls } = await import("./site-graph.inline.ts")
    const wrappedGraph: QuartzComponentConstructor<Record<string, unknown>> = (options) => {
      const component = originalGraph(options)
      component.afterDOMLoaded = graphControls
      return component
    }
    for (const [name, entry] of componentRegistry.getAll()) {
      if (entry.component === graph.component) {
        componentRegistry.register(name, wrappedGraph, entry.source, entry.manifest)
      }
    }
  }

  // Frames partition slots by component identity; compiled plugin function
  // names are minified, so tag the rail components with a stable displayName.
  const railTags: Record<string, string> = {
    explorer: "Explorer",
    "table-of-contents": "TableOfContents",
    graph: "Graph",
    backlinks: "Backlinks",
  }
  for (const [registryName, displayName] of Object.entries(railTags)) {
    const entry = componentRegistry.get(registryName)
    if (!entry || typeof entry.component !== "function") continue
    const original = entry.component as QuartzComponentConstructor<Record<string, unknown>>
    const tagged: QuartzComponentConstructor<Record<string, unknown>> = (options) => {
      const component = original(options)
      component.displayName = displayName
      return component
    }
    for (const [name, registered] of componentRegistry.getAll()) {
      if (registered.component === entry.component) {
        componentRegistry.register(name, tagged, registered.source, registered.manifest)
      }
    }
  }

  const articleTitle = componentRegistry.get("article-title")
  if (!articleTitle || typeof articleTitle.component !== "function") {
    throw new Error("Required Quartz ArticleTitle component did not load")
  }
  const originalArticleTitle = articleTitle.component as QuartzComponentConstructor
  componentRegistry.register(
    "article-title",
    (options: undefined) => {
      const source = originalArticleTitle(options)
      const component: QuartzComponent = (props) =>
        props.fileData.sourceHeadingTitle && !props.fileData.hoistedHeading ? null : source(props)
      component.css = source.css
      component.beforeDOMLoaded = source.beforeDOMLoaded
      component.afterDOMLoaded = source.afterDOMLoaded
      return component
    },
    articleTitle.source,
    articleTitle.manifest,
  )

  // The config loader already created a dispatcher with its initial layout.
  // Rebuild it after configuring the Explorer so every page uses the same tree.
  const layout = await loadQuartzLayout()
  const dispatcherIndex = config.plugins.emitters.findIndex(
    (emitter) => emitter.name === "PageTypeDispatcher",
  )
  if (dispatcherIndex < 0) throw new Error("Required Quartz page dispatcher did not load")
  config.plugins.emitters[dispatcherIndex] = PageTypeDispatcher(layout)
  return layout
}
