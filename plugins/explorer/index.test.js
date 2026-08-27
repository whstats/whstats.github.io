import assert from "node:assert/strict"
import test from "node:test"
import { Explorer } from "./index.js"

test("matches the TOC visual hierarchy for the active page", () => {
  const css = Explorer().css

  assert.match(
    css,
    /\.explorer-content ul li > a,[\s\S]*?\.folder-container div > button span \{[\s\S]*?font-size: 0\.9rem;/,
  )
  assert.match(
    css,
    /\.explorer-content ul li > a,[\s\S]*?\.folder-container div > button \{[\s\S]*?font-family: var\(--bodyFont\);/,
  )
  assert.match(css, /\.explorer-content ul li > a \{[\s\S]*?opacity: 0\.35;/)
  assert.match(css, /\.explorer-content ul li > a:hover \{[\s\S]*?opacity: 0\.75;/)
  assert.match(
    css,
    /\.explorer-content ul li > a\.active \{[\s\S]*?color: var\(--secondary\);[\s\S]*?opacity: 1;[\s\S]*?font-weight: 700;/,
  )
})
