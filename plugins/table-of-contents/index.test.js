import assert from "node:assert/strict"
import test from "node:test"
import renderToString from "preact-render-to-string"
import { TableOfContents, visibleTocEntries } from "./components/index.js"

const headingId = "high-dimensional-maxima"
const tree = {
  type: "root",
  children: [
    {
      type: "element",
      tagName: "h2",
      properties: { id: headingId },
      children: [
        { type: "text", value: "High-Dimensional Maxima: Why " },
        {
          type: "element",
          tagName: "span",
          properties: {
            className: ["math-source"],
            "data-math-tex": String.raw`\sqrt{\log p}`,
          },
          children: [
            {
              type: "element",
              tagName: "span",
              properties: { className: ["katex"] },
              children: [{ type: "text", value: "rendered formula" }],
            },
          ],
        },
        { type: "text", value: " Appears" },
        {
          type: "element",
          tagName: "a",
          properties: { role: "anchor", href: `#${headingId}` },
          children: [{ type: "text", value: "heading permalink" }],
        },
      ],
    },
  ],
}

test("renders TOC labels from the processed heading markup", () => {
  const Component = TableOfContents()
  const html = renderToString(
    Component({
      cfg: { locale: "en-US" },
      fileData: {
        collapseToc: false,
        toc: [
          {
            depth: 0,
            slug: headingId,
            text: String.raw`High-Dimensional Maxima: Why \sqrt{\log p} Appears`,
          },
        ],
      },
      tree,
    }),
  )

  assert.match(html, /data-for="high-dimensional-maxima"/)
  assert.match(html, /title="High-Dimensional Maxima/)
  assert.match(html, /class="math-source"/)
  assert.match(html, /class="katex"/)
  assert.doesNotMatch(html, /heading permalink/)
  assert.doesNotMatch(html, /data-for="high-dimensional-maxima">[^<]*\\sqrt/)
})

test("renders the TOC expanded without a collapse control", () => {
  const Component = TableOfContents()
  const html = renderToString(
    Component({
      cfg: { locale: "en-US" },
      fileData: {
        collapseToc: true,
        toc: [{ depth: 0, slug: headingId, text: "High-Dimensional Maxima" }],
      },
      tree,
    }),
  )

  assert.match(html, /class="toc-static-header"/)
  assert.match(html, /class="toc-content overflow"/)
  assert.doesNotMatch(html, /<button/)
  assert.doesNotMatch(html, /collapsed/)
  assert.doesNotMatch(html, /class="fold"/)
})

test("styles second-level TOC entries smaller than first-level entries", () => {
  const Component = TableOfContents()

  assert.match(Component.css, /li\.depth-1 > a\s*{[^}]*font-size: 0\.85rem/s)
})

test("truncates overlong TOC labels with an ellipsis", () => {
  const Component = TableOfContents()

  assert.match(Component.css, /height: 1\.6rem/)
  assert.match(Component.css, /text-overflow: ellipsis/)
  assert.match(Component.css, /white-space: nowrap/)
})

test("shows only first-level sections when the TOC has more than 15 entries", () => {
  const fifteenEntries = Array.from({ length: 15 }, (_, index) => ({
    depth: index === 0 ? 0 : 1,
    slug: `entry-${index}`,
    text: `Entry ${index}`,
  }))
  const sixteenEntries = [...fifteenEntries, { depth: 1, slug: "entry-15", text: "Entry 15" }]

  assert.equal(visibleTocEntries(fifteenEntries), fifteenEntries)
  assert.deepEqual(visibleTocEntries(sixteenEntries), [fifteenEntries[0]])
})
