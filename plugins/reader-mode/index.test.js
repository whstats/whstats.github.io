import assert from "node:assert/strict"
import test from "node:test"
import renderToString from "preact-render-to-string"
import { ReaderMode } from "./index.js"

test("exposes the reader mode shortcut to assistive technology", () => {
  const Component = ReaderMode()
  const html = renderToString(Component({}))

  assert.match(html, /class="readermode"/)
  assert.match(html, /aria-keyshortcuts="h"/)
})
