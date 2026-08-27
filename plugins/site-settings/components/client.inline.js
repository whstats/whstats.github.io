;(() => {
  const storageKey = "notes:reading-settings:v2"
  const legacyStorageKey = "notes:reading-settings:v1"
  const defaults = Object.freeze({
    fontFamily: "minion-pro",
    fontSize: 100,
    measure: "44rem",
    lineHeight: "1.7",
    reduceMotion: false,
    keyboardShortcuts: true,
  })
  const measures = new Set(["44rem", "47rem", "50rem"])
  const lineHeights = new Set(["1.55", "1.7", "1.78"])
  const fontFamilies = Object.freeze({
    "ibm-plex-serif": "var(--reading-font-ibm-plex-serif)",
    "minion-pro": "var(--reading-font-minion-pro)",
    "times-new-roman": "var(--reading-font-times-new-roman)",
    system: "var(--reading-font-system)",
  })

  const clamp = (value, minimum, maximum, fallback) => {
    const numeric = Number(value)
    return Number.isFinite(numeric)
      ? Math.min(maximum, Math.max(minimum, Math.round(numeric)))
      : fallback
  }

  const normalize = (value = {}) => {
    const storedLineHeight = value.lineHeight === "1.65" ? "1.7" : value.lineHeight
    return {
      fontFamily: Object.hasOwn(fontFamilies, value.fontFamily)
        ? value.fontFamily
        : defaults.fontFamily,
      fontSize: clamp(value.fontSize, 95, 120, defaults.fontSize),
      measure: measures.has(value.measure) ? value.measure : defaults.measure,
      lineHeight: lineHeights.has(storedLineHeight) ? storedLineHeight : defaults.lineHeight,
      reduceMotion: value.reduceMotion === true,
      keyboardShortcuts: value.keyboardShortcuts !== false,
    }
  }

  const migrateLegacy = (value) => {
    const legacyFontSize = clamp(value.fontSize, 95, 120, 105)
    return normalize({
      ...value,
      fontSize: Math.round((legacyFontSize / 105) * 100),
    })
  }

  const readSettings = () => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? "null")
      if (stored && typeof stored === "object") {
        const normalized = normalize(stored)
        if (JSON.stringify(stored) !== JSON.stringify(normalized)) {
          window.localStorage.setItem(storageKey, JSON.stringify(normalized))
        }
        return normalized
      }

      const legacy = JSON.parse(window.localStorage.getItem(legacyStorageKey) ?? "null")
      if (!legacy || typeof legacy !== "object") return { ...defaults }

      const migrated = migrateLegacy(legacy)
      window.localStorage.setItem(storageKey, JSON.stringify(migrated))
      return migrated
    } catch {
      return { ...defaults }
    }
  }

  const saveSettings = (settings) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(settings))
    } catch {
      // The controls still work for the current page when storage is unavailable.
    }
  }

  const applySettings = (settings) => {
    const root = document.documentElement
    root.style.setProperty("--reading-body-font", fontFamilies[settings.fontFamily])
    root.style.setProperty(
      "--reader-font-scale",
      String(Number((settings.fontSize / 100).toFixed(2))),
    )
    root.style.setProperty("--reading-measure", settings.measure)
    root.style.setProperty("--reading-line-height", settings.lineHeight)
    root.toggleAttribute("data-reduce-motion", settings.reduceMotion)
    if (settings.reduceMotion) root.setAttribute("data-reduce-motion", "true")
    root.setAttribute("data-keyboard-shortcuts", String(settings.keyboardShortcuts))
    document.dispatchEvent(
      new CustomEvent("keyboardshortcutschange", {
        detail: { enabled: settings.keyboardShortcuts },
      }),
    )
  }

  const syncControls = (root, settings) => {
    for (const control of root.querySelectorAll("[data-settings-key]")) {
      const key = control.dataset.settingsKey
      if (key === "reduceMotion" || key === "keyboardShortcuts") control.checked = settings[key]
      else control.value = settings[key]
    }

    const fontOutput = root.querySelector('[data-settings-output="fontSize"]')
    if (fontOutput) fontOutput.textContent = `${settings.fontSize}%`
  }

  const settingsFromControls = (root) =>
    normalize({
      fontFamily: root.querySelector('[data-settings-key="fontFamily"]')?.value,
      fontSize: root.querySelector('[data-settings-key="fontSize"]')?.value,
      measure: root.querySelector('[data-settings-key="measure"]')?.value,
      lineHeight: root.querySelector('[data-settings-key="lineHeight"]')?.value,
      reduceMotion: root.querySelector('[data-settings-key="reduceMotion"]')?.checked,
      keyboardShortcuts: root.querySelector('[data-settings-key="keyboardShortcuts"]')?.checked,
    })

  const initializeSiteSettings = () => {
    const current = readSettings()
    applySettings(current)

    for (const root of document.querySelectorAll("details.site-settings")) {
      if (root.dataset.settingsInitialized === "true") continue
      root.dataset.settingsInitialized = "true"

      const trigger = root.querySelector("summary")
      const reset = root.querySelector("[data-settings-reset]")
      const status = root.querySelector(".site-settings-status")
      const cleanup = []
      const listen = (target, event, handler) => {
        target?.addEventListener(event, handler)
        cleanup.push(() => target?.removeEventListener(event, handler))
      }
      const close = (restoreFocus = false) => {
        root.open = false
        if (restoreFocus) trigger?.focus()
      }
      const commit = () => {
        const next = settingsFromControls(root)
        applySettings(next)
        saveSettings(next)
        syncControls(root, next)
        if (status) status.textContent = "Saved"
      }

      syncControls(root, current)

      for (const control of root.querySelectorAll("[data-settings-key]")) {
        listen(control, control.type === "range" ? "input" : "change", commit)
      }

      for (const closeButton of root.querySelectorAll("[data-settings-close]")) {
        listen(closeButton, "click", () => close(true))
      }

      listen(reset, "click", () => {
        try {
          window.localStorage.removeItem(storageKey)
          window.localStorage.removeItem(legacyStorageKey)
        } catch {
          // Reset still applies to the current page when storage is unavailable.
        }
        applySettings(defaults)
        syncControls(root, defaults)
        if (status) status.textContent = "Defaults restored"
      })

      listen(root, "toggle", () => {
        trigger?.setAttribute("aria-expanded", String(root.open))
        if (root.open && status) status.textContent = ""
      })

      listen(document, "click", (event) => {
        if (root.open && !root.contains(event.target)) close(false)
      })

      listen(root, "keydown", (event) => {
        if (root.open && event.key === "Escape") {
          event.preventDefault()
          close(true)
        }
      })

      window.addCleanup?.(() => {
        cleanup.forEach((remove) => remove())
        delete root.dataset.settingsInitialized
      })
    }
  }

  document.addEventListener("nav", initializeSiteSettings)
  document.addEventListener("render", initializeSiteSettings)
})()
