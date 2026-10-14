import { test } from "node:test"
import assert from "node:assert/strict"
import {
  contentImageVaultPath,
  displaySize,
  imagePresentation,
  labelRenderedMath,
  obsidianImageSize,
  webpSrc,
} from "./site-media"
import type { Root } from "hast"

test("content images resolve from the article directory onto the vault", () => {
  assert.equal(
    contentImageVaultPath(
      "Blog/2025-JFM-viscous-drop-impact",
      "../_Media/JFM-viscous-drop-impact-blog-1740211822831.png",
    ),
    "_Media/JFM-viscous-drop-impact-blog-1740211822831.png",
  )
  assert.equal(contentImageVaultPath("Blog/post", "/_Media/figure.jpg"), "_Media/figure.jpg")
  assert.equal(contentImageVaultPath("Blog/post", "https://example.com/a.png"), null)
  assert.equal(contentImageVaultPath("Blog/post", "../static/logo.png"), "static/logo.png")
  assert.equal(contentImageVaultPath("index", "../../secret.png"), null)
})

test("webp sources keep the same relative location", () => {
  assert.equal(
    webpSrc("../_Media/JFM-viscous-drop-impact-blog-1740211513533.jpg"),
    "../_Media/JFM-viscous-drop-impact-blog-1740211513533.webp",
  )
})

test("Obsidian alt-text sizes split from the caption", () => {
  assert.deepEqual(obsidianImageSize("|750"), { alt: "", width: 750 })
  assert.deepEqual(obsidianImageSize("Shell | 640x480"), { alt: "Shell", width: 640, height: 480 })
  assert.deepEqual(obsidianImageSize("fig1"), { alt: "fig1" })
  assert.deepEqual(obsidianImageSize("a|b"), { alt: "a|b" })
})

test("display sizes keep the intrinsic aspect ratio", () => {
  const natural = { width: 2656, height: 1716 }
  assert.deepEqual(displaySize(natural, {}), natural)
  assert.deepEqual(displaySize(natural, { width: 750 }), { width: 750, height: 485 })
  assert.deepEqual(displaySize(natural, { height: 429 }), { width: 664, height: 429 })
  assert.deepEqual(displaySize(natural, { width: 100, height: 100 }), { width: 100, height: 65 })
  assert.deepEqual(displaySize(natural, { width: 1000, height: 300 }), { width: 464, height: 300 })
})

test("only the first content image stays eager", () => {
  assert.deepEqual(imagePresentation(0), {
    loading: "eager",
    decoding: "async",
    fetchPriority: "high",
  })
  assert.deepEqual(imagePresentation(1), { loading: "lazy", decoding: "async" })
})

test("MathJax SVGs receive the TeX as their accessible name", () => {
  const tree: Root = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "mjx-container",
        properties: { className: ["MathJax"] },
        children: [
          {
            type: "element",
            tagName: "svg",
            properties: { role: "img", focusable: "false" },
            children: [],
          },
        ],
      },
    ],
  }
  labelRenderedMath(tree, ["We = \\rho V_0^2 D_0 / \\gamma"])
  const svg = tree.children[0]
  assert.equal(svg.type, "element")
  if (svg.type !== "element") return
  const graphic = svg.children[0]
  assert.equal(graphic.type, "element")
  if (graphic.type !== "element") return
  assert.equal(graphic.properties?.ariaLabel, "We = \\rho V_0^2 D_0 / \\gamma")
  assert.equal(graphic.properties?.role, "img")
})
