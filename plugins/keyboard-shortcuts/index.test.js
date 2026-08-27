import assert from "node:assert/strict"
import test from "node:test"
import vm from "node:vm"
import { KeyboardShortcuts } from "./index.js"

class FakeElement {
  constructor(editable = false) {
    this.editable = editable
  }

  closest() {
    return this.editable ? this : null
  }
}

class FakeButton {
  constructor(onClick) {
    this.attributes = new Map()
    this.onClick = onClick
  }

  click() {
    this.onClick()
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null
  }

  removeAttribute(name) {
    this.attributes.delete(name)
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value))
  }
}

function shortcutHarness(script, { shortcutsEnabled = true } = {}) {
  const listeners = []
  const documentListeners = new Map()
  let readerModeClicks = 0
  let darkModeClicks = 0
  let searchClicks = 0
  let keyboardShortcutsEnabled = shortcutsEnabled
  const buttons = {
    ".readermode": new FakeButton(() => readerModeClicks++),
    ".darkmode": new FakeButton(() => darkModeClicks++),
    ".search-button": new FakeButton(() => searchClicks++),
  }
  const document = {
    activeElement: null,
    designMode: "off",
    documentElement: {
      getAttribute(name) {
        if (name === "data-keyboard-shortcuts") return String(keyboardShortcutsEnabled)
        return null
      },
    },
    addEventListener(type, listener) {
      if (type === "keydown") listeners.push(listener)
      const handlers = documentListeners.get(type) ?? []
      handlers.push(listener)
      documentListeners.set(type, handlers)
    },
    querySelector(selector) {
      return buttons[selector] ?? null
    },
    querySelectorAll(selector) {
      return buttons[selector] ? [buttons[selector]] : []
    },
  }
  const window = {}
  const context = { document, Element: FakeElement, window }
  vm.runInNewContext(script, context)

  const keydown = (key, overrides = {}) => {
    let prevented = false
    listeners[0]({
      key,
      target: new FakeElement(),
      defaultPrevented: false,
      isComposing: false,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      repeat: false,
      preventDefault() {
        prevented = true
      },
      ...overrides,
    })
    return prevented
  }

  return {
    context,
    darkModeClicks: () => darkModeClicks,
    document,
    dispatchDocumentEvent(type) {
      for (const listener of documentListeners.get(type) ?? []) listener({ type })
    },
    keydown,
    listeners,
    readerModeClicks: () => readerModeClicks,
    setShortcutsEnabled(enabled) {
      keyboardShortcutsEnabled = enabled
      this.dispatchDocumentEvent("keyboardshortcutschange")
    },
    shortcutAttribute(selector) {
      return buttons[selector]?.getAttribute("aria-keyshortcuts") ?? null
    },
    searchClicks: () => searchClicks,
  }
}

test("loads one global after-DOM shortcut script", () => {
  const resources = KeyboardShortcuts().externalResources()

  assert.equal(resources.js.length, 1)
  assert.equal(resources.js[0].loadTime, "afterDOMReady")
  assert.equal(resources.js[0].contentType, "inline")
  assert.match(resources.js[0].script, /\.readermode/)
  assert.match(resources.js[0].script, /\.darkmode/)
  assert.match(resources.js[0].script, /\.search-button/)
  assert.doesNotMatch(resources.js[0].script, /requestAnimationFrame|scrollByViewportQuarter/)
})

test("h, n, and f delegate to the existing toolbar buttons", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  assert.equal(harness.keydown("h"), true)
  assert.equal(harness.readerModeClicks(), 1)
  assert.equal(harness.keydown("n"), true)
  assert.equal(harness.darkModeClicks(), 1)
  assert.equal(harness.keydown("f"), true)
  assert.equal(harness.searchClicks(), 1)
  assert.equal(harness.keydown("h", { repeat: true }), false)
  assert.equal(harness.readerModeClicks(), 1)
})

test("j and k are ordinary keys without shortcut behavior", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  assert.equal(harness.keydown("j"), false)
  assert.equal(harness.keydown("k"), false)
  assert.equal(harness.readerModeClicks(), 0)
  assert.equal(harness.darkModeClicks(), 0)
  assert.equal(harness.searchClicks(), 0)
})

test("shortcuts do not interfere with editing, composition, or modifier chords", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  assert.equal(harness.keydown("h", { target: new FakeElement(true) }), false)
  harness.document.activeElement = new FakeElement(true)
  assert.equal(harness.keydown("n"), false)
  assert.equal(harness.keydown("f"), false)
  harness.document.activeElement = null
  assert.equal(harness.keydown("h", { isComposing: true }), false)
  assert.equal(harness.keydown("h", { metaKey: true }), false)
  assert.equal(harness.keydown("N"), false)
  assert.equal(harness.readerModeClicks(), 0)
  assert.equal(harness.darkModeClicks(), 0)
  assert.equal(harness.searchClicks(), 0)
})

test("shortcuts can be disabled and stop advertising inactive keys", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  assert.equal(harness.shortcutAttribute(".readermode"), "h")
  assert.equal(harness.shortcutAttribute(".darkmode"), "n")
  assert.equal(harness.shortcutAttribute(".search-button"), "f")

  harness.setShortcutsEnabled(false)
  assert.equal(harness.keydown("h"), false)
  assert.equal(harness.readerModeClicks(), 0)
  assert.equal(harness.shortcutAttribute(".readermode"), null)
  assert.equal(harness.shortcutAttribute(".darkmode"), null)
  assert.equal(harness.shortcutAttribute(".search-button"), null)
})

test("installs only one global shortcut listener", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)
  vm.runInNewContext(script, harness.context)

  assert.equal(harness.listeners.length, 1)
})
