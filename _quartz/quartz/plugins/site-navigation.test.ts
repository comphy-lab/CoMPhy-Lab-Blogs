import { test } from "node:test"
import assert from "node:assert/strict"
import {
  assertRequiredPageTypes,
  firstSourceHeading,
  folderTitle,
  matchTocToRenderedHeadings,
  showInExplorer,
} from "./site-navigation"
import type { QuartzConfig } from "../cfg"

test("generated folder titles use the final readable folder name", () => {
  assert.equal(folderTitle("Blog/index"), "Blog")
  assert.equal(folderTitle("Lecture-Notes/Basilisk101/index"), "Basilisk101")
  assert.equal(folderTitle("Code-Documentations/index"), "Code Documentations")
  assert.equal(folderTitle("_AtomicNotes/index"), "AtomicNotes")
})

test("explorer omits only the root atomic folder and duplicate landing page", () => {
  assert.equal(
    showInExplorer({
      slugSegments: ["_AtomicNotes"],
      slugSegment: "_AtomicNotes",
    }),
    false,
  )
  assert.equal(showInExplorer({ slugSegments: ["0_README"], slugSegment: "0_README" }), false)
  assert.equal(showInExplorer({ slugSegments: ["Blog"], slugSegment: "Blog" }), true)
  assert.equal(
    showInExplorer({
      slugSegments: ["Lecture", "0_README"],
      slugSegment: "0_README",
    }),
    true,
  )
  assert.equal(showInExplorer({ slugSegments: ["tags"], slugSegment: "tags" }), false)
})

test("explorer filter remains self-contained when Quartz serialises it", () => {
  const revived = new Function(
    "node",
    `return (${showInExplorer.toString()})(node)`,
  ) as typeof showInExplorer
  assert.equal(revived({ slugSegments: ["_AtomicNotes"], slugSegment: "_AtomicNotes" }), false)
  assert.equal(revived({ slugSegments: ["Talks"], slugSegment: "Talks" }), true)
})

test("missing page plugins fail the build before an empty site can be emitted", () => {
  const config = {
    plugins: { pageTypes: [{ name: "ContentPage" }, { name: "FolderPage" }] },
  } as QuartzConfig
  assert.throws(() => assertRequiredPageTypes(config), /TagPage/)
})

test("article title follows the existing first H1 without editing it", () => {
  assert.equal(
    firstSourceHeading({
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "Introduction" }],
        },
        {
          type: "heading",
          depth: 1,
          children: [
            { type: "text", value: "Why " },
            { type: "emphasis", children: [{ type: "text", value: "drops" }] },
            { type: "text", value: " pinch off" },
          ],
        },
      ],
    }),
    "Why drops pinch off",
  )
  assert.equal(
    firstSourceHeading({
      type: "root",
      children: [
        {
          type: "heading",
          depth: 1,
          children: [
            { type: "text", value: "Computational Multiphase Physics " },
            { type: "html", value: "<br>" },
            { type: "text", value: " (CoMPhy)" },
          ],
        },
      ],
    }),
    "Computational Multiphase Physics (CoMPhy)",
  )
})

test("TOC anchors follow the final rendered heading IDs", () => {
  const toc = [
    {
      depth: 0,
      text: "Computational Multiphase Physics (CoMPhy)",
      slug: "computational-multiphase-physics-br-comphy",
    },
    { depth: 1, text: "About Us", slug: "about-us" },
  ]
  const html = {
    type: "root" as const,
    children: [
      {
        type: "element" as const,
        tagName: "h1",
        properties: { id: "computational-multiphase-physics--comphy" },
        children: [],
      },
      {
        type: "element" as const,
        tagName: "h2",
        properties: { id: "about-us" },
        children: [],
      },
    ],
  }
  assert.deepEqual(matchTocToRenderedHeadings(toc, html), [
    { ...toc[0], slug: "computational-multiphase-physics--comphy" },
    toc[1],
  ])
  assert.equal(matchTocToRenderedHeadings(toc, { type: "root", children: [] }), undefined)
})
