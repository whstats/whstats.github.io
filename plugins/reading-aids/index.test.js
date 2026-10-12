import assert from "node:assert/strict"
import test from "node:test"
import { h } from "preact"
import renderToString from "preact-render-to-string"
import { mobileTocEntries, pageSummary, ReadingAids } from "./components/index.js"

const render = (fileData) => renderToString(h(ReadingAids(), { fileData }))

test("renders the frontmatter description as the page summary", () => {
  assert.equal(pageSummary({ frontmatter: { description: "  A note.  " } }), "A note.")
  assert.equal(pageSummary({ frontmatter: { description: "" } }), null)
  assert.match(render({ frontmatter: { description: "A note." } }), /reading-aids__summary">A note\.</)
})

test("renders nothing when there is neither a summary nor an outline", () => {
  assert.equal(render({ frontmatter: {} }), "")
})

test("builds mobile contents and a back-to-top control from the outline", () => {
  const html = render({
    frontmatter: {},
    toc: [
      { depth: 0, text: "Setup", slug: "setup" },
      { depth: 1, text: "Detail", slug: "detail" },
    ],
  })
  assert.match(html, /<details class="reading-aids__contents">/)
  assert.match(html, /2 sections/)
  assert.match(html, /<li class="depth-1"><a href="#detail" data-for="detail">Detail<\/a>/)
  assert.match(html, /aria-label="Back to top"[^>]*hidden/)
})

test("collapses long outlines to top-level sections", () => {
  const toc = Array.from({ length: 20 }, (_, index) => ({
    depth: index % 2,
    text: `Heading ${index}`,
    slug: `heading-${index}`,
  }))
  assert.equal(mobileTocEntries(toc).length, 10)
  assert.deepEqual(mobileTocEntries(undefined), [])
})
