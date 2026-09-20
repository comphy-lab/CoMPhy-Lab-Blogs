import { test } from "node:test"
import assert from "node:assert/strict"
import { aliasRoutes, resolveVaultLink } from "./site-links"

test("relative PDFs resolve beside the article despite duplicate basenames", () => {
  const slugs = new Set(["Lecture/one.pdf", "_Media/PDF/Lecture/one.pdf"])
  assert.equal(resolveVaultLink("Lecture/one", "./one.pdf", slugs), "Lecture/one.pdf")
  assert.equal(
    resolveVaultLink("Lecture/one", "_Media/PDF/Lecture/one.pdf", slugs),
    "_Media/PDF/Lecture/one.pdf",
  )
})

test("course links use local context and unique suffixes without guessing ambiguity", () => {
  const slugs = new Set(["Lecture/A/0-README", "Lecture/B/0-README"])
  assert.equal(
    resolveVaultLink("Lecture/A/one", "0-README#overview", slugs),
    "Lecture/A/0-README#overview",
  )
  assert.equal(resolveVaultLink("Blog/post", "A/0-README", slugs), "Lecture/A/0-README")
  assert.equal(resolveVaultLink("Blog/post", "0-README", slugs), "0-README")
  assert.equal(
    resolveVaultLink("Blog/post", "https://example.org/a", slugs),
    "https://example.org/a",
  )
})

test("aliases cannot replace their own article or another canonical page", () => {
  const routes = aliasRoutes([
    { slug: "Lecture/Gauss", aliases: ["Lecture/Gauss", "Gauss", "Other"] },
    { slug: "Other", aliases: [] },
  ])
  assert.deepEqual([...routes], [["Gauss", "Lecture/Gauss"]])
  assert.throws(() => aliasRoutes([{ slug: "one", aliases: ["../escape"] }]))
  assert.throws(() =>
    aliasRoutes([
      { slug: "one", aliases: ["duplicate"] },
      { slug: "two", aliases: ["duplicate"] },
    ]),
  )
})
