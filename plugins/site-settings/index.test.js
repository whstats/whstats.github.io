import assert from "node:assert/strict"
import test from "node:test"
import renderToString from "preact-render-to-string"
import { DEFAULT_SETTINGS, SiteSettings, normalizeSettings } from "./index.js"

test("normalizes stored settings into supported ranges and choices", () => {
  assert.deepEqual(normalizeSettings(), DEFAULT_SETTINGS)
  assert.equal(DEFAULT_SETTINGS.fontFamily, "xcharter")
  assert.equal(DEFAULT_SETTINGS.fontSize, 100)
  assert.equal(DEFAULT_SETTINGS.textAlign, "justify")
  assert.deepEqual(
    normalizeSettings({
      fontSize: 999,
      fontFamily: "comic-sans",
      measure: "100vw",
      lineHeight: "4",
      reduceMotion: "yes",
    }),
    {
      fontFamily: "xcharter",
      fontSize: 120,
      measure: "44rem",
      lineHeight: "1.7",
      textAlign: "justify",
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
      textAlign: "justify",
      reduceMotion: false,
      keyboardShortcuts: true,
    },
  )

  assert.equal(normalizeSettings({ fontSize: "invalid" }).fontSize, 100)
  assert.equal(normalizeSettings({ fontFamily: "xcharter" }).fontFamily, "xcharter")
  assert.equal(normalizeSettings({ keyboardShortcuts: false }).keyboardShortcuts, false)
})

test("renders an accessible toolbar trigger and complete reading controls", () => {
  const Component = SiteSettings()
  const html = renderToString(Component({ displayClass: "desktop-only" }))

  assert.match(html, /class="desktop-only site-settings"/)
  assert.match(html, /aria-label="Reading settings"/)
  assert.match(html, /role="dialog"/)
  for (const label of ["Typeface", "Text size", "Line length", "Line spacing", "Alignment"]) {
    assert.match(html, new RegExp(`>${label}<`))
  }
  assert.match(html, />XCharter</)
  assert.match(html, />Minion Pro<\/span><small>if installed</)
  assert.match(html, />Times New Roman</)
  assert.match(html, />System</)
  assert.match(html, /style="font-family: var\(--reading-font-ibm-plex-serif\)"/)
  assert.match(html, /data-settings-output="fontSize">100%</)
  assert.match(html, />Left</)
  assert.match(html, />Justified</)
  assert.match(html, />Reduce motion</)
  assert.match(html, />Keyboard shortcuts</)
  assert.match(html, /Press \? on any page to see every shortcut\./)
  assert.match(html, />Restore defaults</)
  assert.equal(typeof Component.beforeDOMLoaded, "string")
  assert.equal(typeof Component.afterDOMLoaded, "string")
  assert.match(Component.beforeDOMLoaded, /notes:reading-settings:v2/)
  assert.match(Component.beforeDOMLoaded, /--reader-font-scale/)
  assert.match(Component.beforeDOMLoaded, /--reading-body-font/)
  assert.match(Component.beforeDOMLoaded, /--reading-font-xcharter/)
  assert.match(Component.beforeDOMLoaded, /--reading-text-align/)
  assert.match(Component.afterDOMLoaded, /--reader-font-scale/)
  assert.match(Component.afterDOMLoaded, /--reading-body-font/)
  assert.match(Component.afterDOMLoaded, /--reading-font-xcharter/)
  assert.match(Component.afterDOMLoaded, /--reading-text-align/)
  assert.match(Component.afterDOMLoaded, /data-keyboard-shortcuts/)
  assert.match(Component.css, /site-settings-panel/)
})

test("choices are radio groups with the defaults pre-selected", () => {
  const html = renderToString(SiteSettings()({}))
  const checked = (key) =>
    [...html.matchAll(new RegExp(`<input[^>]*data-settings-key="${key}"[^>]*>`, "g"))]
      .filter(([tag]) => / checked/.test(tag))
      .map(([tag]) => tag.match(/value="([^"]*)"/)[1])

  assert.deepEqual(checked("fontFamily"), ["xcharter"])
  assert.deepEqual(checked("measure"), ["44rem"])
  assert.deepEqual(checked("lineHeight"), ["1.7"])
  assert.deepEqual(checked("textAlign"), ["justify"])
  assert.match(html, /type="radio" name="site-settings-measure"/)
})
