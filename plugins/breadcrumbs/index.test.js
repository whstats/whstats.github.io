import assert from "node:assert/strict"
import test from "node:test"
import { resolveBreadcrumbTitle } from "./components/index.js"

test("uses the generated folder title for the current breadcrumb", () => {
  const current = {
    slug: "topics/index",
    frontmatter: { title: "Topics" },
  }

  assert.equal(resolveBreadcrumbTitle(current, [], "topics"), "Topics")
})

test("resolves titles for ancestor folder breadcrumbs", () => {
  const current = { slug: "topics/example", frontmatter: { title: "Example" } }
  const files = [{ slug: "topics/index", title: "Topics" }]

  assert.equal(resolveBreadcrumbTitle(current, files, "topics"), "Topics")
})
