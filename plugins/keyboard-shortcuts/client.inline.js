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
  }
  const bookmarks = new Map()
  let markerLayer = null
  let statusRegion = null
  let markerFrame = 0
  let articleObserver = null
  let observedArticle = null
  let clearConfirmation = null
  let clearConfirmationTimer = 0

  const shortcutsEnabled = () =>
    document.documentElement.getAttribute("data-keyboard-shortcuts") !== "false"

  const highlightsSupported = () =>
    typeof CSS !== "undefined" && CSS.highlights !== undefined && typeof Highlight !== "undefined"

  const ensureMarkerLayer = () => {
    if (markerLayer?.isConnected) return markerLayer
    markerLayer = document.createElement("div")
    markerLayer.className = "temporary-bookmark-layer"
    markerLayer.setAttribute("aria-hidden", "true")
    document.body.append(markerLayer)
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

  const dismissClearConfirmation = () => {
    if (clearConfirmationTimer !== 0) window.clearTimeout(clearConfirmationTimer)
    clearConfirmationTimer = 0
    clearConfirmation?.remove()
    clearConfirmation = null
  }

  const showClearConfirmation = () => {
    dismissClearConfirmation()
    clearConfirmation = document.createElement("div")
    clearConfirmation.className = "temporary-bookmark-clear-confirmation"
    clearConfirmation.setAttribute("aria-hidden", "true")
    clearConfirmation.textContent = "Press 0 again to clear bookmarks"
    document.body.append(clearConfirmation)
    clearConfirmationTimer = window.setTimeout(() => {
      clearConfirmationTimer = 0
      clearConfirmation?.remove()
      clearConfirmation = null
    }, clearConfirmationDuration)
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
    for (const { range, marker } of bookmarks.values()) {
      const rect = rangeBounds(range)
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        marker.hidden = true
        continue
      }

      marker.hidden = false
      marker.style.left = `${window.scrollX + rect.right}px`
      marker.style.top = `${window.scrollY + rect.top}px`
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

  const stopObservingArticle = () => {
    articleObserver?.disconnect()
    articleObserver = null
    observedArticle = null
  }

  const observeArticle = (article) => {
    if (observedArticle === article || typeof ResizeObserver === "undefined") return
    stopObservingArticle()
    articleObserver = new ResizeObserver(scheduleMarkerUpdate)
    articleObserver.observe(article)
    observedArticle = article
  }

  const removeBookmark = (key) => {
    const bookmark = bookmarks.get(key)
    if (!bookmark) return false
    bookmark.marker.remove()
    bookmarks.delete(key)
    syncHighlight()
    if (bookmarks.size === 0) {
      dismissClearConfirmation()
      stopObservingArticle()
      markerLayer?.remove()
      markerLayer = null
    }
    return true
  }

  const clearBookmarks = ({ removeStatus = false } = {}) => {
    const hadBookmarks = bookmarks.size > 0
    dismissClearConfirmation()
    for (const { marker } of bookmarks.values()) marker.remove()
    bookmarks.clear()
    if (highlightsSupported()) CSS.highlights.delete(bookmarkHighlightName)
    stopObservingArticle()
    if (markerFrame !== 0) window.cancelAnimationFrame(markerFrame)
    markerFrame = 0
    markerLayer?.remove()
    markerLayer = null
    if (removeStatus) {
      statusRegion?.remove()
      statusRegion = null
    }
    return hadBookmarks
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
    ensureMarkerLayer().append(marker)
    bookmarks.set(key, { marker, range })
    observeArticle(article)
    syncHighlight()
    selection.removeAllRanges()
    updateMarkers()
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
      if (clearConfirmationTimer === 0) {
        showClearConfirmation()
        return true
      }
      clearBookmarks()
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

  const syncShortcutAttributes = () => {
    for (const [key, selector] of Object.entries(shortcutButtonSelectors)) {
      for (const button of document.querySelectorAll(selector)) {
        if (shortcutsEnabled()) button.setAttribute("aria-keyshortcuts", key)
        else button.removeAttribute("aria-keyshortcuts")
      }
    }
  }

  const handleShortcutSettingChange = () => {
    syncShortcutAttributes()
    if (!shortcutsEnabled()) clearBookmarks()
    else scheduleMarkerUpdate()
  }

  const clearPageBookmarks = () => clearBookmarks({ removeStatus: true })

  document.addEventListener("nav", syncShortcutAttributes)
  document.addEventListener("prenav", clearPageBookmarks)
  document.addEventListener("render", clearPageBookmarks)
  document.addEventListener("render", syncShortcutAttributes)
  document.addEventListener("keyboardshortcutschange", handleShortcutSettingChange)
  document.addEventListener("readermodechange", scheduleMarkerUpdate)
  window.addEventListener("resize", scheduleMarkerUpdate)
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

    if (handleNumericShortcut(event)) return

    const buttonSelector = shortcutButtonSelectors[event.key]
    if (!buttonSelector) return
    const button = document.querySelector(buttonSelector)
    if (!button) return
    event.preventDefault()
    button.click()
  })
})()
