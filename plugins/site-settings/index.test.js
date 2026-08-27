import assert from "node:assert/strict"
import test from "node:test"
import renderToString from "preact-render-to-string"
import { DEFAULT_SETTINGS, SiteSettings, normalizeSettings } from "./index.js"

test("normalizes stored settings into supported ranges and choices", () => {
  assert.deepEqual(normalizeSettings(), DEFAULT_SETTINGS)
  assert.equal(DEFAULT_SETTINGS.fontFamily, "minion-pro")
  assert.equal(DEFAULT_SETTINGS.fontSize, 100)
  assert.deepEqual(
    normalizeSettings({
      fontSize: 999,
      fontFamily: "comic-sans",
      measure: "100vw",
      lineHeight: "4",
      reduceMotion: "yes",
    }),
    {
      fontFamily: "minion-pro",
      fontSize: 120,
      measure: "44rem",
      lineHeight: "1.7",
      reduceMotion: false,
      keyboardShortcuts: true,
    },
  )

  assert.deepEqual(
    normalizeSettings({
      fontFamily: "minion-pro",
      fontSize: 105,
      measure: "50rem",
      lineHeight: "1.65",
    }),
    {
      fontFamily: "minion-pro",
      fontSize: 105,
      measure: "50rem",
      lineHeight: "1.7",
      reduceMotion: false,
      keyboardShortcuts: true,
    },
  )

  assert.equal(normalizeSettings({ fontSize: "invalid" }).fontSize, 100)
  assert.equal(normalizeSettings({ keyboardShortcuts: false }).keyboardShortcuts, false)
})

test("renders an accessible toolbar trigger and complete reading controls", () => {
  const Component = SiteSettings()
  const html = renderToString(Component({ displayClass: "desktop-only" }))

  assert.match(html, /class="desktop-only site-settings"/)
  assert.match(html, /aria-label="Reading settings"/)
  assert.match(html, /role="dialog"/)
  assert.match(html, />Body font</)
  assert.match(html, />Minion Pro</)
  assert.match(html, />Times New Roman</)
  assert.match(html, />System</)
  assert.match(html, />Body text</)
  assert.match(html, /data-settings-output="fontSize">100%</)
  assert.match(html, />Reading width</)
  assert.match(html, />Line spacing</)
  assert.match(html, />Reduce motion</)
  assert.match(html, />Keyboard shortcuts</)
  assert.match(html, />Restore defaults</)
  assert.equal(typeof Component.beforeDOMLoaded, "string")
  assert.equal(typeof Component.afterDOMLoaded, "string")
  assert.match(Component.beforeDOMLoaded, /notes:reading-settings:v2/)
  assert.match(Component.beforeDOMLoaded, /--reader-font-scale/)
  assert.match(Component.beforeDOMLoaded, /--reading-body-font/)
  assert.match(Component.afterDOMLoaded, /--reader-font-scale/)
  assert.match(Component.afterDOMLoaded, /--reading-body-font/)
  assert.match(Component.afterDOMLoaded, /data-keyboard-shortcuts/)
  assert.match(Component.css, /site-settings-panel/)
})
