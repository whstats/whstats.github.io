;(() => {
  const installationKey = "__notesKeyboardShortcutsInstalled"
  if (window[installationKey]) return
  window[installationKey] = true

  const editableSelector =
    'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]'
  const articleSelector = ".center > article"
  const bookmarkHighlightName = "notes-temporary-bookmarks"
  const bookmarkKeyPattern = /^[1-9]$/
  const numericKeyPattern = /^[0-9]$/
  const clearConfirmationDuration = 2000
  const isEditableElement = (target) =>
    target instanceof Element && target.closest(editableSelector) !== null
  const shortcutButtonSelectors = {
    h: ".readermode",
    n: ".darkmode",
    f: ".search-button",
    "/": ".search-button",
  }
  const helpKey = "?"
  const toastDuration = 2600
  const helpRows = [
    ["F or /", "Search notes"],
    ["N", "Toggle dark mode"],
    ["H", "Toggle reader mode"],
    ["Select text, then 1–9", "Bookmark the selection"],
    ["1–9", "Jump to that bookmark"],
    ["0 0", "Clear all bookmarks"],
    ["?", "Show or hide this list"],
  ]
  const bookmarks = new Map()
  let markerLayer = null
  let statusRegion = null
  let markerFrame = 0
  let articleObserver = null
  let toast = null
  let toastTimer = 0
  let clearArmed = false
  let helpOverlay = null

  const shortcutsEnabled = () =>
    document.documentElement.getAttribute("data-keyboard-shortcuts") !== "false"

  const highlightsSupported = () =>
    typeof CSS !== "undefined" && CSS.highlights !== undefined && typeof Highlight !== "undefined"

  // The layer lives inside the article, so markers move with it when content above it
  // changes height; only the article's own size changes need a repositioning pass.
  const ensureMarkerLayer = (article) => {
    if (markerLayer?.parentElement === article) return markerLayer
    markerLayer?.remove()
    markerLayer = document.createElement("div")
    markerLayer.className = "temporary-bookmark-layer"
    markerLayer.setAttribute("aria-hidden", "true")
    article.append(markerLayer)
    articleObserver?.disconnect()
    articleObserver = null
    if (typeof ResizeObserver !== "undefined") {
      articleObserver = new ResizeObserver(scheduleMarkerUpdate)
      articleObserver.observe(article)
    }
    return markerLayer
  }

  const ensureStatusRegion = () => {
    if (statusRegion?.isConnected) return statusRegion
    statusRegion = document.createElement("div")
    statusRegion.className = "temporary-bookmark-status"
    statusRegion.setAttribute("role", "status")
    statusRegion.setAttribute("aria-live", "polite")
    document.body.append(statusRegion)
    return statusRegion
  }

  const announce = (message) => {
    ensureStatusRegion().textContent = message
  }

  // Clearing is armed only while its countdown toast is on screen.
  const dismissToast = () => {
    if (toastTimer !== 0) window.clearTimeout(toastTimer)
    toastTimer = 0
    toast?.remove()
    toast = null
    clearArmed = false
  }

  const showToast = (badge, message, { duration = toastDuration, countdown = false } = {}) => {
    dismissToast()
    toast = document.createElement("div")
    toast.className = countdown
      ? "temporary-bookmark-toast temporary-bookmark-toast--countdown"
      : "temporary-bookmark-toast"
    toast.setAttribute("aria-hidden", "true")
    toast.dataset.badge = badge
    toast.textContent = message
    document.body.append(toast)
    toastTimer = window.setTimeout(dismissToast, duration)
  }

  const armClear = () => {
    showToast("0", "Press 0 again to clear bookmarks", {
      duration: clearConfirmationDuration,
      countdown: true,
    })
    clearArmed = true
    announce("Press 0 again within 2 seconds to clear temporary bookmarks.")
  }

  const firstRangeRect = (range) => {
    const rects = range.getClientRects?.()
    if (rects?.length) return rects[0]
    return range.getBoundingClientRect?.() ?? null
  }

  const rangeBounds = (range) => {
    const rect = range.getBoundingClientRect?.()
    if (rect && (rect.width !== 0 || rect.height !== 0)) return rect
    return firstRangeRect(range)
  }

  const updateMarkers = () => {
    markerFrame = 0
    const origin = markerLayer?.parentElement?.getBoundingClientRect()
    if (!origin) return
    for (const { range, marker } of bookmarks.values()) {
      const rect = rangeBounds(range)
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        marker.hidden = true
        continue
      }

      marker.hidden = false
      marker.style.left = `${rect.right - origin.left}px`
      marker.style.top = `${rect.top - origin.top}px`
    }
  }

  const scheduleMarkerUpdate = () => {
    if (markerFrame !== 0 || bookmarks.size === 0) return
    markerFrame = window.requestAnimationFrame(updateMarkers)
  }

  const syncHighlight = () => {
    if (!highlightsSupported()) return
    CSS.highlights.delete(bookmarkHighlightName)
    if (bookmarks.size > 0) {
      CSS.highlights.set(
        bookmarkHighlightName,
        new Highlight(...Array.from(bookmarks.values(), ({ range }) => range)),
      )
    }
  }

  const removeMarkerLayer = () => {
    articleObserver?.disconnect()
    articleObserver = null
    if (markerFrame !== 0) window.cancelAnimationFrame(markerFrame)
    markerFrame = 0
    markerLayer?.remove()
    markerLayer = null
  }

  const removeBookmark = (key) => {
    const bookmark = bookmarks.get(key)
    if (!bookmark) return false
    bookmark.marker.remove()
    bookmarks.delete(key)
    syncHighlight()
    if (bookmarks.size === 0) {
      if (clearArmed) dismissToast()
      removeMarkerLayer()
    }
    return true
  }

  const clearBookmarks = ({ removeStatus = false } = {}) => {
    bookmarks.clear()
    syncHighlight()
    removeMarkerLayer()
    if (clearArmed || removeStatus) dismissToast()
    if (removeStatus) {
      statusRegion?.remove()
      statusRegion = null
    }
  }

  const currentSelection = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return { selection, hasSelection: false, bookmark: null }
    }

    const range = selection.getRangeAt(0)
    const article = document.querySelector(articleSelector)
    const insideArticle =
      article?.contains(range.startContainer) && article.contains(range.endContainer)
    const selectedText = selection.toString().trim()
    if (!insideArticle || selectedText.length === 0) {
      return { selection, hasSelection: true, bookmark: null }
    }

    return {
      selection,
      hasSelection: true,
      bookmark: { article, range: range.cloneRange() },
    }
  }

  const setBookmark = (key, selection, { article, range }) => {
    removeBookmark(key)
    const marker = document.createElement("span")
    marker.className = "temporary-bookmark-marker"
    marker.dataset.bookmarkKey = key
    marker.textContent = key
    ensureMarkerLayer(article).append(marker)
    bookmarks.set(key, { marker, range })
    syncHighlight()
    selection.removeAllRanges()
    updateMarkers()
    showToast(
      key,
      `Bookmark ${key} set. Press ${key} to return here; it lasts until you leave the page.`,
    )
    announce(`Temporary bookmark ${key} set.`)
  }

  const jumpToBookmark = (key) => {
    const bookmark = bookmarks.get(key)
    if (!bookmark) return false
    const rect = firstRangeRect(bookmark.range)
    if (!rect) {
      removeBookmark(key)
      return false
    }

    window.scrollTo({
      left: window.scrollX,
      top: Math.max(0, window.scrollY + rect.top - window.innerHeight * 0.28),
    })
    announce(`Jumped to temporary bookmark ${key}.`)
    return true
  }

  const handleNumericShortcut = (event) => {
    if (!numericKeyPattern.test(event.key)) return false

    if (event.key === "0") {
      if (bookmarks.size === 0) return true
      event.preventDefault()
      if (!clearArmed) {
        armClear()
        return true
      }
      clearBookmarks()
      showToast("0", "Bookmarks cleared")
      announce("Temporary bookmarks cleared.")
      return true
    }

    if (!bookmarkKeyPattern.test(event.key)) return true
    const { selection, hasSelection, bookmark } = currentSelection()
    if (hasSelection) {
      if (!bookmark) return true
      event.preventDefault()
      setBookmark(event.key, selection, bookmark)
      return true
    }

    if (!bookmarks.has(event.key)) return true
    event.preventDefault()
    jumpToBookmark(event.key)
    return true
  }

  const keysBySelector = () => {
    const grouped = new Map()
    for (const [key, selector] of Object.entries(shortcutButtonSelectors)) {
      grouped.set(selector, [...(grouped.get(selector) ?? []), key])
    }
    return grouped
  }

  // Tooltips name the key so the shortcuts can be discovered by hovering the toolbar.
  const syncShortcutAttributes = () => {
    for (const [selector, keys] of keysBySelector()) {
      for (const button of document.querySelectorAll(selector)) {
        if (button.dataset.shortcutBaseTitle === undefined) {
          button.dataset.shortcutBaseTitle =
            button.getAttribute("title") ?? button.getAttribute("aria-label") ?? ""
        }
        const baseTitle = button.dataset.shortcutBaseTitle
        if (shortcutsEnabled()) {
          button.setAttribute("aria-keyshortcuts", keys.join(" "))
          const keyLabel = keys.map((key) => key.toUpperCase()).join(" or ")
          button.setAttribute("title", baseTitle ? `${baseTitle} (${keyLabel})` : keyLabel)
        } else {
          button.removeAttribute("aria-keyshortcuts")
          if (baseTitle) button.setAttribute("title", baseTitle)
          else button.removeAttribute("title")
        }
      }
    }
  }

  const closeHelp = () => {
    if (!helpOverlay) return false
    helpOverlay.remove()
    helpOverlay = null
    return true
  }

  const openHelp = () => {
    closeHelp()
    helpOverlay = document.createElement("div")
    helpOverlay.className = "keyboard-help"
    helpOverlay.setAttribute("role", "dialog")
    helpOverlay.setAttribute("aria-modal", "true")
    helpOverlay.setAttribute("aria-label", "Keyboard shortcuts")

    const panel = document.createElement("div")
    panel.className = "keyboard-help__panel"
    const title = document.createElement("h2")
    title.textContent = "Keyboard shortcuts"
    const list = document.createElement("dl")
    for (const [keys, action] of helpRows) {
      const term = document.createElement("dt")
      term.textContent = keys
      const detail = document.createElement("dd")
      detail.textContent = action
      list.append(term)
      list.append(detail)
    }
    const note = document.createElement("p")
    note.textContent =
      "Bookmarks are temporary: they disappear when you reload or leave the page. Press Esc to close."
    panel.append(title)
    panel.append(list)
    panel.append(note)
    helpOverlay.append(panel)
    helpOverlay.addEventListener?.("click", (event) => {
      if (event.target === helpOverlay) closeHelp()
    })
    document.body.append(helpOverlay)
    return true
  }

  const handleShortcutSettingChange = () => {
    syncShortcutAttributes()
    if (!shortcutsEnabled()) {
      closeHelp()
      clearBookmarks({ removeStatus: true })
    } else scheduleMarkerUpdate()
  }

  const clearPageBookmarks = () => clearBookmarks({ removeStatus: true })

  document.addEventListener("nav", syncShortcutAttributes)
  document.addEventListener("prenav", clearPageBookmarks)
  document.addEventListener("prenav", closeHelp)
  document.addEventListener("render", clearPageBookmarks)
  document.addEventListener("render", syncShortcutAttributes)
  document.addEventListener("keyboardshortcutschange", handleShortcutSettingChange)
  syncShortcutAttributes()

  document.addEventListener("keydown", (event) => {
    if (
      !shortcutsEnabled() ||
      event.defaultPrevented ||
      event.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.repeat ||
      document.designMode === "on" ||
      isEditableElement(event.target) ||
      isEditableElement(document.activeElement)
    ) {
      return
    }

    if (event.key === "Escape") {
      if (closeHelp()) event.preventDefault()
      return
    }

    if (event.key === helpKey) {
      event.preventDefault()
      if (!closeHelp()) openHelp()
      return
    }

    if (handleNumericShortcut(event)) return

    const buttonSelector = shortcutButtonSelectors[event.key]
    if (!buttonSelector) return
    const button = document.querySelector(buttonSelector)
    if (!button) return
    event.preventDefault()
    button.click()
  })
})()
