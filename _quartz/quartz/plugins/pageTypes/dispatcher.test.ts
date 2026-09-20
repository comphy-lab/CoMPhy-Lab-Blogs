import { test } from "node:test"
import assert from "node:assert/strict"
import { h } from "preact"
import { render } from "preact-render-to-string"
import { defaultProcessedContent } from "../vfile"
import { populateVirtualPageHtmlAst, refreshTrieWithVirtualPages } from "./dispatcher"
import type { FullPageLayout } from "../../cfg"
import type { QuartzComponent, QuartzComponentProps } from "../../components/types"
import type { BuildCtx } from "../../util/ctx"
import type { FilePath, FullSlug } from "../../util/path"
import type { Root } from "hast"

test("virtual folder body is available for transclusion without doubling its listing", () => {
  const slug = "Blog/index" as FullSlug
  const [tree, vfile] = defaultProcessedContent({ slug })
  const folderBody: QuartzComponent = ({ tree: contentTree }) =>
    h(
      "article",
      null,
      (contentTree as Root).children.length > 0 &&
        h("div", { class: "page-listing" }, "inherited content"),
      h("div", { class: "page-listing" }, "8 items under this folder"),
    )
  const entries = [
    {
      tree,
      vfile,
      layout: { pageBody: folderBody } as FullPageLayout,
      vpSlug: slug,
    },
  ]
  const ctx = { cfg: { configuration: {} } } as BuildCtx
  const resources = { css: [], js: [], additionalHead: [] }

  populateVirtualPageHtmlAst(entries, ctx, [], resources)

  assert.equal(tree.children.length, 0, "the final page must retain its original empty tree")
  assert.equal(vfile.data.htmlAst?.children.length, 1, "transclusion keeps the rendered body")
  const finalHtml = render(folderBody({ tree } as unknown as QuartzComponentProps))
  assert.equal((finalHtml.match(/class="page-listing"/g) ?? []).length, 1)
})

test("generated folder titles replace raw path names in the folder trie", () => {
  const articleSlug = "Lecture-Notes/Slender-Jets/viscoelastic" as FullSlug
  const folderSlug = "Lecture-Notes/Slender-Jets/index" as FullSlug
  const article = {
    slug: articleSlug,
    filePath: "Lecture-Notes/Slender-Jets/viscoelastic.md" as FilePath,
    frontmatter: { title: "Viscoelastic slender jets", tags: [] },
  }
  const [, folder] = defaultProcessedContent({
    slug: folderSlug,
    relativePath: "Lecture-Notes/Slender-Jets/index.md" as FilePath,
    frontmatter: { title: "Slender Jets", tags: [] },
  })
  const ctx = {} as BuildCtx

  refreshTrieWithVirtualPages(ctx, [article], [{ vfile: folder, vpSlug: folderSlug }])

  assert.equal(ctx.trie?.findNode(["Lecture-Notes", "Slender-Jets"])?.displayName, "Slender Jets")
})
