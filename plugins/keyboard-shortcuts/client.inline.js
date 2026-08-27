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
  document.addEventListener("nav", syncShortcutAttributes)
  document.addEventListener("render", syncShortcutAttributes)
  document.addEventListener("keyboardshortcutschange", syncShortcutAttributes)
  syncShortcutAttributes()

  document.addEventListener("keydown", (event) => {
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

    const buttonSelector = shortcutButtonSelectors[event.key]
    if (!buttonSelector || event.repeat) return

    const button = document.querySelector(buttonSelector)
    if (!button) return
    event.preventDefault()
    button.click()
  })
})()
