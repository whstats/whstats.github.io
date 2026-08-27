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

function shortcutHarness(
  script,
  { reducedMotion = false, reducedMotionSetting = false, shortcutsEnabled = true } = {},
) {
  const listeners = []
  const documentListeners = new Map()
  const frames = new Map()
  const scrollingElement = { scrollHeight: 4000, scrollTop: 0, style: { scrollBehavior: "" } }
  let readerModeClicks = 0
  let darkModeClicks = 0
  let searchClicks = 0
  let frameId = 0
  let now = 0
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
        if (name === "data-reduce-motion" && reducedMotionSetting) return "true"
        if (name === "data-keyboard-shortcuts") return String(keyboardShortcutsEnabled)
        return null
      },
    },
    scrollingElement,
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
  const window = {
    innerHeight: 800,
    addEventListener() {},
    cancelAnimationFrame(id) {
      frames.delete(id)
    },
    matchMedia() {
      return { matches: reducedMotion }
    },
    requestAnimationFrame(callback) {
      const id = ++frameId
      frames.set(id, callback)
      return id
    },
  }
  Object.defineProperty(window, "scrollY", {
    get() {
      return scrollingElement.scrollTop
    },
  })
  const performance = { now: () => now }
  const context = { document, Element: FakeElement, performance, window }
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
    advanceAnimation(timestamp) {
      now = timestamp
      const callbacks = [...frames.values()]
      frames.clear()
      callbacks.forEach((callback) => callback(timestamp))
    },
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
    scrollTop: () => scrollingElement.scrollTop,
    searchClicks: () => searchClicks,
  }
}

test("loads one global after-DOM shortcut script", () => {
  const resources = KeyboardShortcuts().externalResources()

  assert.equal(resources.js.length, 1)
  assert.equal(resources.js[0].loadTime, "afterDOMReady")
  assert.equal(resources.js[0].contentType, "inline")
  assert.match(resources.js[0].script, /window\.innerHeight \* 0\.25/)
  assert.match(resources.js[0].script, /\.readermode/)
  assert.match(resources.js[0].script, /\.darkmode/)
  assert.match(resources.js[0].script, /\.search-button/)
})

test("j and k smoothly scroll by one quarter of the viewport", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  assert.equal(harness.keydown("j"), true)
  assert.equal(harness.scrollTop(), 0)
  harness.advanceAnimation(0)
  harness.advanceAnimation(260)
  assert.equal(harness.scrollTop(), 100)
  harness.advanceAnimation(520)
  assert.equal(harness.scrollTop(), 200)

  assert.equal(harness.keydown("k"), true)
  harness.advanceAnimation(520)
  harness.advanceAnimation(780)
  assert.equal(harness.scrollTop(), 100)
  harness.advanceAnimation(1040)
  assert.equal(harness.scrollTop(), 0)
})

test("reduced-motion preferences skip the scroll animation", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script

  for (const harness of [
    shortcutHarness(script, { reducedMotion: true }),
    shortcutHarness(script, { reducedMotionSetting: true }),
  ]) {
    assert.equal(harness.keydown("j"), true)
    assert.equal(harness.scrollTop(), 200)
  }
})

test("SPA navigation cancels an in-flight scroll animation", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  harness.keydown("j")
  harness.advanceAnimation(0)
  harness.advanceAnimation(160)
  const interruptedScroll = harness.scrollTop()
  assert.ok(interruptedScroll > 0 && interruptedScroll < 200)

  harness.dispatchDocumentEvent("prenav")
  harness.advanceAnimation(520)
  assert.equal(harness.scrollTop(), interruptedScroll)
})

test("modified navigation keys cancel an in-flight scroll animation", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  harness.keydown("j")
  harness.advanceAnimation(0)
  harness.advanceAnimation(160)
  const interruptedScroll = harness.scrollTop()
  assert.ok(interruptedScroll > 0 && interruptedScroll < 200)

  assert.equal(harness.keydown("Home", { ctrlKey: true }), false)
  harness.advanceAnimation(520)
  assert.equal(harness.scrollTop(), interruptedScroll)
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

test("shortcuts do not interfere with editing, composition, or modifier chords", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  assert.equal(harness.keydown("j", { target: new FakeElement(true) }), false)
  harness.document.activeElement = new FakeElement(true)
  assert.equal(harness.keydown("j"), false)
  assert.equal(harness.keydown("n"), false)
  assert.equal(harness.keydown("f"), false)
  harness.document.activeElement = null
  assert.equal(harness.keydown("k", { isComposing: true }), false)
  assert.equal(harness.keydown("h", { metaKey: true }), false)
  assert.equal(harness.keydown("J"), false)
  assert.equal(harness.scrollTop(), 0)
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
  assert.equal(harness.keydown("j"), false)
  assert.equal(harness.keydown("h"), false)
  assert.equal(harness.scrollTop(), 0)
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
