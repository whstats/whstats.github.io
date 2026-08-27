import assert from "node:assert/strict"
import test from "node:test"
import { TocActiveHeading } from "./index.js"

test("loads a local after-DOM script for single-section TOC tracking", () => {
  const resources = TocActiveHeading().externalResources()

  assert.equal(resources.js.length, 1)
  assert.equal(resources.js[0].loadTime, "afterDOMReady")
  assert.equal(resources.js[0].contentType, "inline")
  assert.match(resources.js[0].script, /toc-current/)
  assert.match(resources.js[0].script, /aria-current/)
  assert.match(resources.js[0].script, /scrollPaddingTop/)
  assert.match(resources.js[0].script, /scrollMarginTop/)
  assert.match(resources.js[0].script, /scrollPadding \+ scrollMargin/)
})
