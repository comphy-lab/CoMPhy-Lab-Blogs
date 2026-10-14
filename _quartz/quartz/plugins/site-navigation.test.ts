import { test } from "node:test"
import assert from "node:assert/strict"
import {
  assertRequiredPageTypes,
  byDateThenTitle,
  courseOrder,
  explorerFilterSource,
  firstSourceHeading,
  folderTitle,
  lectureNumber,
  matchTocToRenderedHeadings,
  showInExplorer,
  sortExplorer,
  unlistedSlugs,
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

const course = "Lecture-Notes/Intro-Soft-Matter"
const lectureStems = [
  "7.5-Presentation-Paper-Topics",
  "2-What-is-Viscosity",
  "1.75-Complementary-Questions-Answers",
  "7-8-Student-Presentations",
  "0-README",
  "2.5-Conservation-Laws",
  "1-Intro-Soft-Matter",
  "1.5-Taylor-Culick-Paradox",
  "3-Soft-Matter-Instabilities",
]
const courseStems = [
  "0-README",
  "1-Intro-Soft-Matter",
  "1.5-Taylor-Culick-Paradox",
  "1.75-Complementary-Questions-Answers",
  "2-What-is-Viscosity",
  "2.5-Conservation-Laws",
  "3-Soft-Matter-Instabilities",
  "7-8-Student-Presentations",
  "7.5-Presentation-Paper-Topics",
]

test("explorer lists lecture notes in course order, decimals included", () => {
  const nodes = lectureStems.map((stem) => ({
    slugSegments: [...course.split("/"), stem],
    slugSegment: stem,
    isFolder: false,
    displayName: `Title of ${stem}`,
  }))
  assert.deepEqual(
    nodes.sort(sortExplorer).map((node) => node.slugSegment),
    courseStems,
  )
  const basilisk = [
    "4th-workingAssignment",
    "1st-workingAssignment",
    "1-conduction-takeaways",
    "0-README",
  ]
  assert.deepEqual(
    basilisk
      .map((stem) => ({
        slugSegments: ["Lecture-Notes", "Basilisk101", stem],
        slugSegment: stem,
        isFolder: false,
        displayName: stem,
      }))
      .sort(sortExplorer)
      .map((node) => node.slugSegment),
    ["0-README", "1-conduction-takeaways", "1st-workingAssignment", "4th-workingAssignment"],
  )
})

test("explorer keeps folders first and title order outside lecture notes", () => {
  const blog = [
    {
      slugSegments: ["Blog", "2025-b"],
      slugSegment: "2025-b",
      isFolder: false,
      displayName: "Alpha",
    },
    {
      slugSegments: ["Blog", "2024-a"],
      slugSegment: "2024-a",
      isFolder: false,
      displayName: "Beta",
    },
    { slugSegments: ["Blog", "Sub"], slugSegment: "Sub", isFolder: true, displayName: "Zeta" },
  ]
  assert.deepEqual(
    blog.sort(sortExplorer).map((node) => node.displayName),
    ["Zeta", "Alpha", "Beta"],
  )
})

test("explorer sort and unlisted filter survive serialisation", () => {
  const sort = new Function(
    "a",
    "b",
    `return (${sortExplorer.toString()})(a, b)`,
  ) as typeof sortExplorer
  const a = { slugSegments: ["Lecture-Notes", "X", "1.5-a"], slugSegment: "1.5-a", isFolder: false }
  const b = { slugSegments: ["Lecture-Notes", "X", "2-b"], slugSegment: "2-b", isFolder: false }
  assert.ok(sort(a, b) < 0)
  const hidden = `${course}/1.75-Complementary-Questions-Answers`
  const filter = new Function("node", `return (${explorerFilterSource([hidden])})(node)`) as (
    node: object,
  ) => boolean
  assert.equal(filter({ slugSegment: "1.75-x", isFolder: false, data: { slug: hidden } }), false)
  assert.equal(
    filter({
      slugSegment: "2-x",
      isFolder: false,
      data: { slug: `${course}/2-What-is-Viscosity` },
    }),
    true,
  )
  assert.equal(filter({ slugSegments: ["_AtomicNotes"], slugSegment: "_AtomicNotes" }), false)
})

test("unlisted pages come from explicit frontmatter only", () => {
  assert.deepEqual(
    unlistedSlugs([
      { slug: "b", frontmatter: { unlisted: true } },
      { slug: "a", frontmatter: { unlisted: true } },
      { slug: "c", frontmatter: { unlisted: "true" } },
      { slug: "d", frontmatter: {} },
    ]),
    ["a", "b"],
  )
})

test("folder listings put folders first and lectures in course order", () => {
  assert.equal(lectureNumber(`${course}/1.75-Complementary-Questions-Answers`), 1.75)
  assert.equal(lectureNumber(`${course}/7-8-Student-Presentations`), 7)
  assert.equal(lectureNumber(`${course}/index`), undefined)
  assert.equal(lectureNumber("Blog/2025-visual-pdes"), undefined)
  const dated = (slug: string, day: number) => ({
    slug,
    frontmatter: { title: slug },
    dates: { created: new Date(2025, 9, day) },
  })
  const pages = [
    ...lectureStems.map((stem, index) => dated(`${course}/${stem}`, 30 - index)),
    dated("Lecture-Notes/Basilisk101/index", 1),
    dated("Lecture-Notes/Gauss-law-of-Electrostatics", 2),
  ]
  const sorted = pages.sort(courseOrder(byDateThenTitle("created"))).map((page) => page.slug)
  assert.deepEqual(sorted, [
    "Lecture-Notes/Basilisk101/index",
    ...courseStems.map((stem) => `${course}/${stem}`),
    "Lecture-Notes/Gauss-law-of-Electrostatics",
  ])
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

test("the hidden GFM footnotes heading does not cancel the TOC", () => {
  const toc = [{ depth: 1, text: "Pinch-off", slug: "pinch-off" }]
  const html = {
    type: "root" as const,
    children: [
      {
        type: "element" as const,
        tagName: "h2",
        properties: { id: "pinch-off" },
        children: [],
      },
      {
        type: "element" as const,
        tagName: "h2",
        properties: { id: "footnote-label", className: ["sr-only"] },
        children: [],
      },
    ],
  }
  assert.deepEqual(matchTocToRenderedHeadings(toc, html), toc)
})

test("an author heading that happens to be called Footnote label still counts", () => {
  const toc = [{ depth: 1, text: "Footnote label", slug: "footnote-label" }]
  const html = {
    type: "root" as const,
    children: [
      {
        type: "element" as const,
        tagName: "h2",
        properties: { id: "footnote-label" },
        children: [],
      },
    ],
  }
  assert.deepEqual(matchTocToRenderedHeadings(toc, html), toc)
})
