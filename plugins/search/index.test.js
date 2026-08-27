import assert from "node:assert/strict"
import test from "node:test"
import renderToString from "preact-render-to-string"
import { Search } from "./index.js"

test("exposes the search shortcut to assistive technology", () => {
  const Component = Search()
  const html = renderToString(Component({ cfg: { locale: "en-US" } }))

  assert.match(html, /class="search-button"/)
  assert.match(html, /aria-keyshortcuts="f"/)
})
