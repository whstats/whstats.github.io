import assert from "node:assert/strict"
import test from "node:test"
import renderToString from "preact-render-to-string"
import { Darkmode } from "./index.js"

test("exposes the theme shortcut to assistive technology", () => {
  const Component = Darkmode()
  const html = renderToString(Component({}))

  assert.match(html, /class="darkmode"/)
  assert.match(html, /aria-keyshortcuts="n"/)
})
