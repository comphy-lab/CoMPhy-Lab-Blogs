import { test } from "node:test"
import assert from "node:assert/strict"
import { alignTocControls, transcludeNeedsTitle } from "./renderPage"
import type { ElementContent } from "hast"

const h1: ElementContent = {
  type: "element",
  tagName: "h1",
  properties: {},
  children: [{ type: "text", value: "Title" }],
}
const paragraph: ElementContent = {
  type: "element",
  tagName: "p",
  properties: {},
  children: [{ type: "text", value: "Welcome" }],
}

test("a transclude keeps one title when the note already opens with an H1", () => {
  assert.equal(transcludeNeedsTitle([h1, paragraph]), false)
  assert.equal(transcludeNeedsTitle([{ type: "text", value: "\n" }, h1]), false)
  assert.equal(transcludeNeedsTitle([paragraph]), true)
  assert.equal(transcludeNeedsTitle([]), true)
})

test("table of contents controls point at the list that follows the button", () => {
  const html = `<button type="button" class="toc-header" aria-controls="toc-5" aria-expanded="true"><h3>Table of Contents</h3></button><ul id="list-1" class="toc-content overflow">`
  const aligned = alignTocControls(html)
  assert.match(aligned, /aria-controls="list-1"/)
  assert.doesNotMatch(aligned, /aria-controls="toc-5"/)
})
