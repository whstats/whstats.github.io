import assert from "node:assert/strict"
import test from "node:test"
import { h } from "preact"
import renderToString from "preact-render-to-string"
import { capitalizeGeneratedTitle, FolderPage } from "./index.js"
import { pageListToTable } from "./components/index.js"

test("capitalizes generated folder titles without changing the remaining text", () => {
  assert.equal(capitalizeGeneratedTitle("topics"), "Topics")
  assert.equal(capitalizeGeneratedTitle("Reference Notes"), "Reference Notes")
})

test("stores the generated title where page headings and breadcrumbs can share it", () => {
  const plugin = FolderPage()
  const pages = plugin.generate({
    content: [
      [
        { type: "root", children: [] },
        {
          data: {
            slug: "topics/example",
            relativePath: "topics/example.md",
          },
        },
      ],
    ],
    cfg: { locale: "en-US" },
  })
  const topics = pages.find((page) => page.slug === "topics/index")

  assert.equal(topics?.title, "Topics")
  assert.equal(topics?.data?.frontmatter?.title, "Topics")
})

test("converts the generated three-column page list into the shared table structure", () => {
  const pageList = h(
    "ul",
    { class: "section-ul" },
    h(
      "li",
      { class: "section-li" },
      h(
        "div",
        { class: "section" },
        h("p", { class: "meta" }, h("time", null, "Aug 27, 2026")),
        h("div", { class: "desc" }, h("h3", null, h("a", null, "A Note"))),
        h("ul", { class: "tags" }, h("li", null, h("a", null, "probability"))),
      ),
    ),
  )

  const html = renderToString(pageListToTable(pageList))
  assert.match(html, /class="table-container folder-table"/)
  assert.match(html, /<th[^>]*>Date<\/th><th[^>]*>Note<\/th><th[^>]*>Tags<\/th>/)
  assert.match(html, /<tbody><tr><td[^>]*><time>Aug 27, 2026<\/time><\/td>/)
  assert.match(html, />A Note</)
  assert.match(html, />probability</)
})
