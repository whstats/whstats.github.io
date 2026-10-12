import assert from "node:assert/strict"
import test from "node:test"
import renderToString from "preact-render-to-string"
import { capitalizeGeneratedTitle, FolderPage } from "./index.js"
import { byReadingOrder, pagesInFolder, pagesToTable, readingMinutes } from "./components/index.js"

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

test("lists folder notes in reading order with description, reading time, and capped tags", () => {
  const pages = pagesInFolder(
    [
      { slug: "topics/later", frontmatter: { title: "Later", order: 2 }, text: "word" },
      {
        slug: "topics/first",
        frontmatter: { title: "First", order: 1, description: "Start here.", tags: ["a", "b", "c", "d", "e"] },
        text: Array.from({ length: 450 }, () => "word").join(" "),
      },
      { slug: "topics/unordered", frontmatter: { title: "Alpha" } },
      { slug: "topics/hidden", frontmatter: { title: "Hidden" }, unlisted: true },
      { slug: "topics/nested/deep", frontmatter: { title: "Deep" } },
      { slug: "elsewhere", frontmatter: { title: "Elsewhere" } },
    ],
    "topics/index",
  )

  const html = renderToString(pagesToTable(pages, "topics/index"))
  assert.match(html, /<th[^>]*>Note<\/th><th[^>]*>Tags<\/th>/)
  assert.ok(html.indexOf(">First<") < html.indexOf(">Later<"))
  assert.ok(html.indexOf(">Later<") < html.indexOf(">Alpha<"))
  assert.doesNotMatch(html, /Hidden|Deep|Elsewhere/)
  assert.match(html, /href="\.\.\/topics\/first"/)
  assert.match(html, /folder-table__description">Start here\.</)
  assert.match(html, />3 min read</)
  assert.match(html, />c<\/a><\/li><li class="folder-table__more" title="d, e">\+2</)
})

test("estimates reading time only when there is text", () => {
  assert.equal(readingMinutes(undefined), null)
  assert.equal(readingMinutes("   "), null)
  assert.equal(readingMinutes("one"), 1)
  assert.equal(readingMinutes(Array.from({ length: 401 }, () => "w").join(" ")), 3)
})

test("orders pages by frontmatter order, then title", () => {
  const sorted = [
    { frontmatter: { title: "b" } },
    { frontmatter: { title: "a" } },
    { frontmatter: { title: "z", order: 1 } },
  ].sort(byReadingOrder)
  assert.deepEqual(
    sorted.map((page) => page.frontmatter.title),
    ["z", "a", "b"],
  )
})
