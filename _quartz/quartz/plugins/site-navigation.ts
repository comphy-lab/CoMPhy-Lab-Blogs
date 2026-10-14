import type { QuartzConfig, FullPageLayout } from "../cfg"
import type { QuartzComponent, QuartzComponentConstructor } from "../components/types"
import type { QuartzTransformerPlugin } from "./types"
import type { Root as MarkdownRoot } from "mdast"
import type { Root as HtmlRoot } from "hast"
import type { VFile } from "vfile"
import matter from "gray-matter"
import { h } from "preact"
import { classNames } from "../util/lang"
import { pathToRoot, joinSegments, type FullSlug } from "../util/path"
import { toString } from "mdast-util-to-string"
import { visit } from "unist-util-visit"

interface ExplorerNode {
  slugSegment?: string
  slugSegments?: string[]
  isFolder?: boolean
  displayName?: string
  data?: { slug?: string } | null
}

// The Explorer serialises this function into its browser script, so it must
// contain no references to module variables or closures. `unlisted` holds the
// slugs of published pages that are reached only through links.
export function showInExplorer(node: ExplorerNode, unlisted: string[] = []): boolean {
  if (node.slugSegment === "tags") return false
  if (node.data?.slug && unlisted.includes(node.data.slug)) return false
  return !(
    node.slugSegments?.length === 1 &&
    (node.slugSegment === "_AtomicNotes" || node.slugSegment === "0_README")
  )
}

// Lecture notes run in course order from their numeric filename prefix
// (0-README, 1-…, 1.5-…, 2-…, 7-8-…), not alphabetically by title. Folders stay
// first; everything outside Lecture-Notes keeps Quartz's title order.
// Serialised into the browser like showInExplorer: keep it self-contained.
export function sortExplorer(a: ExplorerNode, b: ExplorerNode): number {
  if (Boolean(a.isFolder) !== Boolean(b.isFolder)) return a.isFolder ? -1 : 1
  const aMatch =
    !a.isFolder && a.slugSegments?.[0] === "Lecture-Notes"
      ? /^(\d+(?:\.\d+)?)/.exec(a.slugSegment ?? "")
      : null
  const bMatch =
    !b.isFolder && b.slugSegments?.[0] === "Lecture-Notes"
      ? /^(\d+(?:\.\d+)?)/.exec(b.slugSegment ?? "")
      : null
  if (aMatch && !bMatch) return -1
  if (!aMatch && bMatch) return 1
  if (aMatch && bMatch && Number(aMatch[1]) !== Number(bMatch[1])) {
    return Number(aMatch[1]) - Number(bMatch[1])
  }
  const aKey = aMatch ? (a.slugSegment ?? "") : (a.displayName ?? "")
  const bKey = bMatch ? (b.slugSegment ?? "") : (b.displayName ?? "")
  return aKey.localeCompare(bKey, undefined, { numeric: true, sensitivity: "base" })
}

// Browser source for the Explorer filter with the unlisted slugs inlined.
export function explorerFilterSource(unlisted: string[]): string {
  return `(node) => (${showInExplorer.toString()})(node, ${JSON.stringify(unlisted)})`
}

export function lectureNumber(slug: string | undefined): number | undefined {
  const segments = (slug ?? "").split("/")
  const name = segments.at(-1)
  if (segments[0] !== "Lecture-Notes" || !name || name === "index") return undefined
  const match = /^(\d+(?:\.\d+)?)/.exec(name)
  return match ? Number(match[1]) : undefined
}

interface ListedPage {
  slug?: string
  frontmatter?: Record<string, unknown>
}

// Pages marked `unlisted: true` stay published and linkable but are left out
// of the Explorer and folder listings (for example homework answers that the
// lecture itself links to).
export function isUnlisted(page: ListedPage | null | undefined): boolean {
  return page?.frontmatter?.unlisted === true
}

export function unlistedSlugs(pages: readonly unknown[] | undefined): string[] {
  return ((pages ?? []) as ListedPage[])
    .filter((page) => isUnlisted(page) && typeof page.slug === "string")
    .map((page) => page.slug!)
    .sort()
}

// Folder listings: folders first, numbered lecture notes in course order, then
// the remaining pages in `fallback` order.
export function courseOrder<T extends ListedPage>(
  fallback: (a: T, b: T) => number,
): (a: T, b: T) => number {
  return (a, b) => {
    const aFolder = (a.slug ?? "").endsWith("/index")
    const bFolder = (b.slug ?? "").endsWith("/index")
    if (aFolder !== bFolder) return aFolder ? -1 : 1
    const aNumber = lectureNumber(a.slug)
    const bNumber = lectureNumber(b.slug)
    if (aNumber !== undefined && bNumber === undefined) return -1
    if (aNumber === undefined && bNumber !== undefined) return 1
    if (aNumber !== undefined && bNumber !== undefined) {
      if (aNumber !== bNumber) return aNumber - bNumber
      return (a.slug ?? "").localeCompare(b.slug ?? "", undefined, { numeric: true })
    }
    return fallback(a, b)
  }
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
    // GFM adds a screen-reader "Footnotes" heading that has no Markdown source.
    const classes = node.properties?.className
    const srOnly = Array.isArray(classes) && classes.includes("sr-only")
    if (node.properties?.id === "footnote-label" && srOnly) return
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
        // ArticleTitle renders the frontmatter title as plain text, so only a
        // heading made of text (plus Quartz's anchor link) can move without
        // losing rendered maths, code or emphasis.
        // Quartz appends an anchor link (with an icon) to every heading; it is
        // not content.
        const plain = first.children.every(
          (child) =>
            child.type === "text" ||
            (child.type === "element" &&
              child.tagName === "a" &&
              (child.properties?.role === "anchor" ||
                child.children.every((grandchild) => grandchild.type === "text"))),
        )
        if (!plain) return
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

interface DatedPage extends ListedPage {
  dates?: Record<string, Date | undefined>
}

// Quartz's folder default: newest first, then title.
export function byDateThenTitle(dateType: string): (a: DatedPage, b: DatedPage) => number {
  return (a, b) => {
    const aTime = a.dates?.[dateType]?.getTime()
    const bTime = b.dates?.[dateType]?.getTime()
    if (aTime !== undefined && bTime === undefined) return -1
    if (aTime === undefined && bTime !== undefined) return 1
    if (aTime !== undefined && bTime !== undefined && aTime !== bTime) return bTime - aTime
    const aTitle = String(a.frontmatter?.title ?? "").toLowerCase()
    const bTitle = String(b.frontmatter?.title ?? "").toLowerCase()
    return aTitle.localeCompare(bTitle)
  }
}

interface FolderTrie {
  data: unknown
  children: FolderTrie[]
  findNode(path: string[]): FolderTrie | undefined
}

// The folder-page plugin sorts by date unless it is given a sort function,
// which its YAML options cannot express. Rebuild its body from the same plugin
// module with course order, and hide unlisted pages from the listing.
async function courseFolderContent(dateType: string): Promise<QuartzComponentConstructor> {
  const { getPluginEntryPoint, parsePluginSource, toFileUrl } = await import("./loader/gitLoader")
  const spec = parsePluginSource("github:quartz-community/folder-page")
  const module = (await import(toFileUrl(getPluginEntryPoint(spec.name, spec.subdir)))) as {
    FolderContent?: QuartzComponentConstructor<{ sort?: (a: DatedPage, b: DatedPage) => number }>
  }
  const FolderContent = module.FolderContent
  if (typeof FolderContent !== "function") {
    throw new Error("Required Quartz FolderContent component did not load")
  }
  return () => {
    const source = FolderContent({ sort: courseOrder(byDateThenTitle(dateType)) })
    const component: QuartzComponent = (props) => {
      const trie = (props.ctx as { trie?: FolderTrie }).trie
      if (!trie) {
        return source({ ...props, allFiles: props.allFiles.filter((file) => !isUnlisted(file)) })
      }
      const listed: Pick<FolderTrie, "findNode"> = {
        findNode(path) {
          const folder = trie.findNode(path)
          if (!folder) return undefined
          return {
            ...folder,
            children: folder.children.filter((child) => !isUnlisted(child.data as ListedPage)),
          }
        },
      }
      return source({ ...props, ctx: { ...props.ctx, trie: listed } as typeof props.ctx })
    }
    component.css = source.css
    component.beforeDOMLoaded = source.beforeDOMLoaded
    component.afterDOMLoaded = source.afterDOMLoaded
    return component
  }
}

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
  folderPage.body = await courseFolderContent(config.configuration.defaultDateType ?? "created")

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
    filterFn?: (node: ExplorerNode) => boolean
    sortFn?: typeof sortExplorer
  }>
  // @ts-expect-error Quartz's inline-script loader imports this browser module as text.
  const { default: explorerControls } = await import("./site-explorer.inline.ts")
  componentRegistry.register(
    "explorer",
    (options: { filterFn?: (node: ExplorerNode) => boolean; sortFn?: typeof sortExplorer }) => {
      // The Explorer serialises filterFn with toString() while rendering, so
      // the unlisted slugs of the page being rendered are inlined there.
      let unlisted: string[] = []
      const filterFn = Object.assign((node: ExplorerNode) => showInExplorer(node, unlisted), {
        toString: () => explorerFilterSource(unlisted),
      })
      const source = originalExplorer({ ...options, filterFn, sortFn: sortExplorer })
      const component: QuartzComponent = (props) => {
        unlisted = unlistedSlugs(props.allFiles)
        return source(props)
      }
      component.css = source.css
      component.beforeDOMLoaded = source.beforeDOMLoaded
      component.afterDOMLoaded = [source.afterDOMLoaded, explorerControls]
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

  // Site title: the lab mark from comphy-lab.org beside the wordmark.
  const pageTitle = componentRegistry.get("page-title")
  if (pageTitle && typeof pageTitle.component === "function") {
    const originalPageTitle = pageTitle.component as QuartzComponentConstructor
    componentRegistry.register(
      "page-title",
      (options: undefined) => {
        const source = originalPageTitle(options)
        const component: QuartzComponent = (props) => {
          const title = props.cfg.pageTitle
          const baseDir = pathToRoot(props.fileData.slug as FullSlug)
          return h(
            "h2",
            { class: classNames(props.displayClass, "page-title") },
            h(
              "a",
              { href: baseDir },
              h("img", {
                class: "site-logo",
                src: joinSegments(baseDir, "static/logo.png"),
                alt: "",
                width: 320,
                height: 212,
                decoding: "async",
              }),
              h("span", { class: "site-wordmark" }, title),
            ),
          )
        }
        component.css = source.css
        component.beforeDOMLoaded = source.beforeDOMLoaded
        component.afterDOMLoaded = source.afterDOMLoaded
        component.displayName = "PageTitle"
        return component
      },
      pageTitle.source,
      pageTitle.manifest,
    )
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
