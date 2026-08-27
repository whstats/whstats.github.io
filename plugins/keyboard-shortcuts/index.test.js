import assert from "node:assert/strict"
import test from "node:test"
import vm from "node:vm"
import { KeyboardShortcuts } from "./index.js"

class FakeElement {
  constructor({ editable = false, connected = false } = {}) {
    this.attributes = new Map()
    this.children = []
    this.className = ""
    this.dataset = {}
    this.editable = editable
    this.hidden = false
    this.isConnected = connected
    this.parentElement = null
    this.style = {}
    this.textContent = ""
  }

  append(child) {
    child.parentElement = this
    child.isConnected = this.isConnected
    this.children.push(child)
  }

  closest() {
    return this.editable ? this : null
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null
  }

  remove() {
    if (this.parentElement) {
      this.parentElement.children = this.parentElement.children.filter((child) => child !== this)
    }
    this.parentElement = null
    this.isConnected = false
  }

  removeAttribute(name) {
    this.attributes.delete(name)
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value))
  }
}

class FakeArticle extends FakeElement {
  constructor() {
    super({ connected: true })
    this.containedNodes = new Set()
  }

  contains(node) {
    return this.containedNodes.has(node)
  }
}

class FakeButton extends FakeElement {
  constructor(onClick) {
    super({ connected: true })
    this.onClick = onClick
  }

  click() {
    this.onClick()
  }
}

class FakeRange {
  constructor(startContainer, endContainer, rect, clientRects) {
    this.endContainer = endContainer
    this.rect = { height: 20, left: 120, top: 500, width: 80, ...rect }
    this.rect.right = this.rect.right ?? this.rect.left + this.rect.width
    this.clientRects = (clientRects ?? [this.rect]).map((clientRect) => {
      const normalized = { height: 20, left: 120, top: 500, width: 80, ...clientRect }
      normalized.right = normalized.right ?? normalized.left + normalized.width
      return normalized
    })
    this.startContainer = startContainer
  }

  cloneRange() {
    return new FakeRange(this.startContainer, this.endContainer, this.rect, this.clientRects)
  }

  getBoundingClientRect() {
    return this.rect
  }

  getClientRects() {
    return this.clientRects
  }
}

class FakeSelection {
  constructor() {
    this.range = null
    this.text = ""
  }

  get isCollapsed() {
    return this.range === null
  }

  get rangeCount() {
    return this.range === null ? 0 : 1
  }

  getRangeAt() {
    return this.range
  }

  removeAllRanges() {
    this.range = null
    this.text = ""
  }

  toString() {
    return this.text
  }
}

function shortcutHarness(script, { highlightsSupported = true, shortcutsEnabled = true } = {}) {
  const keydownListeners = []
  const documentListeners = new Map()
  const windowListeners = new Map()
  const highlightRegistry = new Map()
  const selection = new FakeSelection()
  const article = new FakeArticle()
  const body = new FakeElement({ connected: true })
  const scrollCalls = []
  const timeoutCallbacks = new Map()
  let timerClock = 0
  let nextTimerId = 1
  let readerModeClicks = 0
  let darkModeClicks = 0
  let searchClicks = 0
  let keyboardShortcutsEnabled = shortcutsEnabled
  const buttons = {
    ".readermode": new FakeButton(() => readerModeClicks++),
    ".darkmode": new FakeButton(() => darkModeClicks++),
    ".search-button": new FakeButton(() => searchClicks++),
  }

  class FakeHighlight {
    constructor(...ranges) {
      this.ranges = ranges
    }
  }

  class FakeResizeObserver {
    constructor(callback) {
      this.callback = callback
      this.disconnected = false
      this.observed = null
    }

    disconnect() {
      this.disconnected = true
      this.observed = null
    }

    observe(element) {
      this.observed = element
    }
  }

  const document = {
    activeElement: null,
    body,
    designMode: "off",
    documentElement: {
      getAttribute(name) {
        if (name === "data-keyboard-shortcuts") return String(keyboardShortcutsEnabled)
        return null
      },
    },
    addEventListener(type, listener) {
      if (type === "keydown") keydownListeners.push(listener)
      const handlers = documentListeners.get(type) ?? []
      handlers.push(listener)
      documentListeners.set(type, handlers)
    },
    createElement() {
      return new FakeElement()
    },
    querySelector(selector) {
      if (selector === ".center > article") return article
      return buttons[selector] ?? null
    },
    querySelectorAll(selector) {
      return buttons[selector] ? [buttons[selector]] : []
    },
  }
  const window = {
    addEventListener(type, listener) {
      const handlers = windowListeners.get(type) ?? []
      handlers.push(listener)
      windowListeners.set(type, handlers)
    },
    cancelAnimationFrame() {},
    clearTimeout(timerId) {
      timeoutCallbacks.delete(timerId)
    },
    getSelection() {
      return selection
    },
    innerHeight: 1000,
    innerWidth: 1200,
    requestAnimationFrame(callback) {
      callback()
      return 0
    },
    scrollTo(options) {
      scrollCalls.push(options)
    },
    scrollX: 0,
    scrollY: 0,
    setTimeout(callback, delay) {
      const timerId = nextTimerId++
      timeoutCallbacks.set(timerId, { callback, time: timerClock + delay })
      return timerId
    },
  }
  const context = {
    document,
    Element: FakeElement,
    ResizeObserver: FakeResizeObserver,
    window,
    ...(highlightsSupported
      ? { CSS: { highlights: highlightRegistry }, Highlight: FakeHighlight }
      : {}),
  }
  vm.runInNewContext(script, context)

  const dispatchDocumentEvent = (type) => {
    for (const listener of documentListeners.get(type) ?? []) listener({ type })
  }
  const keydown = (key, overrides = {}) => {
    let prevented = false
    keydownListeners[0]({
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
  const markerLayer = () =>
    body.children.find((child) => child.className === "temporary-bookmark-layer") ?? null
  const advanceTime = (milliseconds) => {
    const targetTime = timerClock + milliseconds
    while (true) {
      const nextTimer = Array.from(timeoutCallbacks.entries())
        .filter(([, timer]) => timer.time <= targetTime)
        .sort(([, left], [, right]) => left.time - right.time)[0]
      if (!nextTimer) break
      const [timerId, timer] = nextTimer
      timeoutCallbacks.delete(timerId)
      timerClock = timer.time
      timer.callback()
    }
    timerClock = targetTime
  }
  const selectText = ({
    clientRects,
    crossBoundary = false,
    inside = true,
    rect,
    text = "selected",
  } = {}) => {
    const start = {}
    const end = {}
    if (inside) article.containedNodes.add(start)
    if (inside && !crossBoundary) article.containedNodes.add(end)
    selection.range = new FakeRange(start, end, rect, clientRects)
    selection.text = text
    return selection.range
  }

  return {
    advanceTime,
    article,
    body,
    context,
    confirmationText: () =>
      body.children.find((child) => child.className === "temporary-bookmark-clear-confirmation")
        ?.textContent ?? null,
    darkModeClicks: () => darkModeClicks,
    dispatchDocumentEvent,
    highlight: () => highlightRegistry.get("notes-temporary-bookmarks") ?? null,
    keydown,
    keydownListeners,
    marker: (key) =>
      markerLayer()?.children.find((child) => child.dataset.bookmarkKey === key) ?? null,
    markerCount: () => markerLayer()?.children.length ?? 0,
    readerModeClicks: () => readerModeClicks,
    scrollCalls,
    selectText,
    selection,
    setShortcutsEnabled(enabled) {
      keyboardShortcutsEnabled = enabled
      dispatchDocumentEvent("keyboardshortcutschange")
    },
    shortcutAttribute(selector) {
      return buttons[selector]?.getAttribute("aria-keyshortcuts") ?? null
    },
    statusText: () =>
      body.children.find((child) => child.className === "temporary-bookmark-status")?.textContent ??
      null,
    searchClicks: () => searchClicks,
    setScrollPosition({ x, y }) {
      window.scrollX = x
      window.scrollY = y
    },
  }
}

test("loads one global shortcut script and its temporary-bookmark styles", () => {
  const resources = KeyboardShortcuts().externalResources()

  assert.equal(resources.js.length, 1)
  assert.equal(resources.js[0].loadTime, "afterDOMReady")
  assert.equal(resources.js[0].contentType, "inline")
  assert.equal(resources.css.length, 1)
  assert.equal(resources.css[0].inline, true)
  assert.match(resources.css[0].content, /::highlight\(notes-temporary-bookmarks\)/)
  assert.match(resources.css[0].content, /temporary-bookmark-marker/)
  assert.match(resources.css[0].content, /temporary-bookmark-clear-confirmation/)
  assert.match(resources.css[0].content, /temporary-bookmark-confirmation-window 2s/)
  assert.match(resources.css[0].content, /background: #d97706/)
  assert.match(resources.css[0].content, /border: 0/)
  assert.match(resources.css[0].content, /box-shadow: none/)
  assert.match(
    resources.css[0].content,
    /::highlight\(notes-temporary-bookmarks\) \{\s*background: color-mix\(in srgb, var\(--tertiary\) 30%, transparent\);\s*\}/,
  )
  assert.doesNotMatch(resources.css[0].content, /text-decoration/)
  assert.match(resources.js[0].script, /\.readermode/)
  assert.match(resources.js[0].script, /\.darkmode/)
  assert.match(resources.js[0].script, /\.search-button/)
  assert.match(resources.js[0].script, /notes-temporary-bookmarks/)
  assert.doesNotMatch(resources.js[0].script, /addEventListener\("scroll"/)
  assert.doesNotMatch(resources.js[0].script, /localStorage|sessionStorage/)
  assert.doesNotMatch(resources.js[0].script, /scrollByViewportQuarter/)
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

test("digits 1-9 set independent highlighted bookmarks with numbered markers", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  for (let digit = 1; digit <= 9; digit++) {
    harness.selectText({ rect: { left: 100 + digit, top: 300 + digit } })
    assert.equal(harness.keydown(String(digit)), true)
    assert.equal(harness.selection.isCollapsed, true)
    assert.equal(harness.marker(String(digit))?.textContent, String(digit))
  }

  assert.equal(harness.markerCount(), 9)
  assert.equal(harness.highlight()?.ranges.length, 9)
  assert.equal(harness.statusText(), "Temporary bookmark 9 set.")
})

test("numbered markers use the selection's upper-right document coordinates", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  harness.setScrollPosition({ x: 15, y: 240 })
  harness.selectText({ rect: { left: 100, top: 360, width: 90 } })
  harness.keydown("5")

  assert.equal(harness.marker("5")?.style.left, "205px")
  assert.equal(harness.marker("5")?.style.top, "600px")
})

test("fragmented formula selections use the complete selection's upper-right corner", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  harness.setScrollPosition({ x: 12, y: 180 })
  harness.selectText({
    rect: { height: 120, left: 100, top: 260, width: 240 },
    clientRects: [
      { height: 42, left: 100, top: 300, width: 38 },
      { height: 34, left: 150, top: 260, width: 62 },
      { height: 46, left: 270, top: 318, width: 70 },
    ],
  })
  harness.keydown("2")

  assert.equal(harness.marker("2")?.style.left, "352px")
  assert.equal(harness.marker("2")?.style.top, "440px")
})

test("an assigned digit jumps to its range when there is no selection", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  harness.selectText({ rect: { left: 140, top: 620 } })
  harness.keydown("4")
  assert.equal(harness.keydown("4"), true)
  assert.equal(harness.scrollCalls.length, 1)
  assert.equal(harness.scrollCalls[0].top, 340)
  assert.equal(harness.scrollCalls[0].left, 0)
  assert.equal(harness.statusText(), "Jumped to temporary bookmark 4.")
})

test("a new valid selection replaces an existing bookmark in the same slot", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  harness.selectText({ rect: { top: 400 } })
  harness.keydown("2")
  const oldMarker = harness.marker("2")

  harness.selectText({ rect: { top: 800 }, text: "replacement" })
  assert.equal(harness.keydown("2"), true)
  assert.equal(oldMarker.isConnected, false)
  assert.equal(harness.markerCount(), 1)
  assert.equal(harness.highlight()?.ranges.length, 1)

  assert.equal(harness.keydown("2"), true)
  assert.equal(harness.scrollCalls[0].top, 520)
})

test("0 requires a second press within two seconds to clear every bookmark", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  harness.selectText({ rect: { top: 400 } })
  harness.keydown("2")
  harness.selectText({ rect: { top: 700 } })
  harness.keydown("7")
  assert.equal(harness.markerCount(), 2)

  assert.equal(harness.keydown("0"), true)
  assert.equal(harness.markerCount(), 2)
  assert.equal(harness.highlight()?.ranges.length, 2)
  assert.equal(harness.confirmationText(), "Press 0 again to clear bookmarks")
  assert.equal(harness.statusText(), "Press 0 again within 2 seconds to clear temporary bookmarks.")

  harness.advanceTime(1999)
  assert.equal(harness.keydown("0"), true)
  assert.equal(harness.markerCount(), 0)
  assert.equal(harness.highlight(), null)
  assert.equal(harness.confirmationText(), null)
  assert.equal(harness.statusText(), "Temporary bookmarks cleared.")
  assert.equal(harness.keydown("2"), false)
  assert.equal(harness.scrollCalls.length, 0)
  assert.equal(harness.keydown("0"), false)
})

test("the clear confirmation expires after two seconds", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  harness.selectText({ rect: { top: 400 } })
  harness.keydown("2")
  harness.keydown("0")
  harness.advanceTime(2000)

  assert.equal(harness.confirmationText(), null)
  assert.equal(harness.markerCount(), 1)
  assert.equal(harness.highlight()?.ranges.length, 1)

  assert.equal(harness.keydown("0"), true)
  assert.equal(harness.markerCount(), 1)
  assert.equal(harness.confirmationText(), "Press 0 again to clear bookmarks")
  assert.equal(harness.keydown("0", { repeat: true }), false)
  assert.equal(harness.markerCount(), 1)
  assert.equal(harness.keydown("0"), true)
  assert.equal(harness.markerCount(), 0)
})

test("navigation, rendering, and disabling shortcuts discard page bookmarks", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  for (const eventType of ["prenav", "render"]) {
    harness.selectText()
    harness.keydown("3")
    assert.equal(harness.markerCount(), 1)
    harness.keydown("0")
    assert.equal(harness.confirmationText(), "Press 0 again to clear bookmarks")
    harness.dispatchDocumentEvent(eventType)
    assert.equal(harness.markerCount(), 0)
    assert.equal(harness.highlight(), null)
    assert.equal(harness.confirmationText(), null)
    assert.equal(harness.statusText(), null)
    assert.equal(harness.keydown("3"), false)
  }

  harness.selectText()
  harness.keydown("3")
  harness.keydown("0")
  harness.setShortcutsEnabled(false)
  assert.equal(harness.markerCount(), 0)
  assert.equal(harness.highlight(), null)
  assert.equal(harness.confirmationText(), null)
  assert.equal(harness.keydown("3"), false)
})

test("invalid selections never set, replace, or jump to a bookmark", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  harness.selectText({ rect: { top: 650 } })
  harness.keydown("1")
  harness.selectText({ text: "   " })
  assert.equal(harness.keydown("1"), false)
  harness.selectText({ inside: false })
  assert.equal(harness.keydown("1"), false)
  harness.selectText({ crossBoundary: true })
  assert.equal(harness.keydown("1"), false)
  assert.equal(harness.markerCount(), 1)
  assert.equal(harness.scrollCalls.length, 0)
})

test("temporary bookmarks still navigate without CSS Highlight support", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script, { highlightsSupported: false })

  harness.selectText({ rect: { top: 560 } })
  assert.equal(harness.keydown("8"), true)
  assert.equal(harness.marker("8")?.textContent, "8")
  assert.equal(harness.keydown("8"), true)
  assert.equal(harness.scrollCalls[0].top, 280)
})

test("ordinary keys and guarded keyboard states do not trigger shortcuts", () => {
  const script = KeyboardShortcuts().externalResources().js[0].script
  const harness = shortcutHarness(script)

  harness.selectText()
  assert.equal(harness.keydown("j"), false)
  assert.equal(harness.keydown("k"), false)
  assert.equal(harness.keydown("1", { target: new FakeElement({ editable: true }) }), false)
  assert.equal(harness.keydown("1", { isComposing: true }), false)
  assert.equal(harness.keydown("1", { metaKey: true }), false)
  assert.equal(harness.keydown("1", { repeat: true }), false)
  assert.equal(harness.markerCount(), 0)

  harness.context.document.activeElement = new FakeElement({ editable: true })
  assert.equal(harness.keydown("h"), false)
  assert.equal(harness.keydown("n"), false)
  assert.equal(harness.keydown("f"), false)
  assert.equal(harness.readerModeClicks(), 0)
  assert.equal(harness.darkModeClicks(), 0)
  assert.equal(harness.searchClicks(), 0)
})

test("shortcuts can be disabled and stop advertising inactive interface keys", () => {
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

  assert.equal(harness.keydownListeners.length, 1)
})
