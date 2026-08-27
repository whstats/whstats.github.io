;(() => {
  const installationKey = "__notesKeyboardShortcutsInstalled"
  if (window[installationKey]) return
  window[installationKey] = true

  const editableSelector =
    'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]'
  const isEditableElement = (target) =>
    target instanceof Element && target.closest(editableSelector) !== null
  const shortcutButtonSelectors = {
    h: ".readermode",
    n: ".darkmode",
    f: ".search-button",
  }
  const shortcutsEnabled = () =>
    document.documentElement.getAttribute("data-keyboard-shortcuts") !== "false"
  const syncShortcutAttributes = () => {
    for (const [key, selector] of Object.entries(shortcutButtonSelectors)) {
      for (const button of document.querySelectorAll(selector)) {
        if (shortcutsEnabled()) button.setAttribute("aria-keyshortcuts", key)
        else button.removeAttribute("aria-keyshortcuts")
      }
    }
  }
  const scrollDuration = 520
  let scrollFrame = 0
  let scrollTarget = null
  let animatedScrollingElement = null
  let previousScrollBehavior = ""

  const restoreScrollBehavior = () => {
    if (!animatedScrollingElement) return
    animatedScrollingElement.style.scrollBehavior = previousScrollBehavior
    animatedScrollingElement = null
    previousScrollBehavior = ""
  }

  const cancelScrollAnimation = () => {
    if (scrollFrame !== 0) window.cancelAnimationFrame(scrollFrame)
    scrollFrame = 0
    scrollTarget = null
    restoreScrollBehavior()
  }

  const prefersReducedMotion = () =>
    document.documentElement.getAttribute("data-reduce-motion") === "true" ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true

  const easeInOutCubic = (progress) =>
    progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

  const scrollByViewportQuarter = (direction) => {
    const scrollingElement = document.scrollingElement ?? document.documentElement
    const currentScroll = window.scrollY
    const maximumScroll = Math.max(0, scrollingElement.scrollHeight - window.innerHeight)
    const targetScroll = Math.min(
      maximumScroll,
      Math.max(0, (scrollTarget ?? currentScroll) + direction * window.innerHeight * 0.25),
    )

    if (scrollFrame !== 0) window.cancelAnimationFrame(scrollFrame)
    scrollTarget = targetScroll

    if (prefersReducedMotion()) {
      restoreScrollBehavior()
      scrollingElement.scrollTop = targetScroll
      scrollFrame = 0
      scrollTarget = null
      return
    }

    if (animatedScrollingElement !== scrollingElement) {
      restoreScrollBehavior()
      animatedScrollingElement = scrollingElement
      previousScrollBehavior = scrollingElement.style.scrollBehavior
      scrollingElement.style.scrollBehavior = "auto"
    }

    const startScroll = currentScroll
    const distance = targetScroll - startScroll
    if (distance === 0) {
      scrollFrame = 0
      scrollTarget = null
      restoreScrollBehavior()
      return
    }
    const startTime = performance.now()
    const step = (timestamp) => {
      const progress = Math.min(1, (timestamp - startTime) / scrollDuration)
      scrollingElement.scrollTop = startScroll + distance * easeInOutCubic(progress)

      if (progress < 1) {
        scrollFrame = window.requestAnimationFrame(step)
      } else {
        scrollFrame = 0
        scrollTarget = null
        restoreScrollBehavior()
      }
    }

    scrollFrame = window.requestAnimationFrame(step)
  }

  window.addEventListener("wheel", cancelScrollAnimation, { passive: true })
  window.addEventListener("touchstart", cancelScrollAnimation, { passive: true })
  window.addEventListener("pointerdown", cancelScrollAnimation, { passive: true })
  document.addEventListener("prenav", cancelScrollAnimation)
  document.addEventListener("nav", syncShortcutAttributes)
  document.addEventListener("render", syncShortcutAttributes)
  document.addEventListener("keyboardshortcutschange", syncShortcutAttributes)
  syncShortcutAttributes()

  document.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
      cancelScrollAnimation()
      return
    }

    if (
      !shortcutsEnabled() ||
      event.defaultPrevented ||
      event.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      document.designMode === "on" ||
      isEditableElement(event.target) ||
      isEditableElement(document.activeElement)
    ) {
      return
    }

    if (event.key === "j" || event.key === "k") {
      event.preventDefault()
      const direction = event.key === "j" ? 1 : -1
      scrollByViewportQuarter(direction)
      return
    }

    const buttonSelector = shortcutButtonSelectors[event.key]
    if (!buttonSelector || event.repeat) return

    const button = document.querySelector(buttonSelector)
    if (!button) return
    event.preventDefault()
    cancelScrollAnimation()
    button.click()
  })
})()
