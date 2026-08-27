import assert from "node:assert/strict"
import test from "node:test"
import renderToString from "preact-render-to-string"
import { TableOfContents } from "./components/index.js"

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
  assert.match(html, /class="math-source"/)
  assert.match(html, /class="katex"/)
  assert.doesNotMatch(html, /heading permalink/)
  assert.doesNotMatch(html, /data-for="high-dimensional-maxima">[^<]*\\sqrt/)
})
