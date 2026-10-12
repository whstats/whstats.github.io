;(() => {
  // `settingsCore` is injected ahead of this script (see settings-core.js).
  const { storageKey, defaults, normalize, readStored, applyToRoot } = settingsCore

  const readSettings = () => {
    const stored = readStored()
    if (!stored) return { ...defaults }

    const normalized = normalize(stored)
    if (JSON.stringify(stored) !== JSON.stringify(normalized)) saveSettings(normalized)
    return normalized
  }

  const saveSettings = (settings) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(settings))
    } catch {
      // The controls still work for the current page when storage is unavailable.
    }
  }

  const applySettings = (settings) => {
    applyToRoot(settings)
    document.dispatchEvent(
      new CustomEvent("keyboardshortcutschange", {
        detail: { enabled: settings.keyboardShortcuts },
      }),
    )
  }

  const syncControls = (root, settings) => {
    for (const control of root.querySelectorAll("[data-settings-key]")) {
      const key = control.dataset.settingsKey
      if (control.type === "checkbox") control.checked = settings[key]
      else if (control.type === "radio") control.checked = control.value === String(settings[key])
      else control.value = settings[key]
    }

    const fontOutput = root.querySelector('[data-settings-output="fontSize"]')
    if (fontOutput) fontOutput.textContent = `${settings.fontSize}%`
  }

  // Radio groups report their checked member; other controls report themselves.
  const settingsFromControls = (root) => {
    const value = (key) =>
      root.querySelector(`[data-settings-key="${key}"]:is(:checked, :not([type="radio"]))`)?.value
    const checked = (key) => root.querySelector(`[data-settings-key="${key}"]`)?.checked
    return normalize({
      fontFamily: value("fontFamily"),
      fontSize: value("fontSize"),
      measure: value("measure"),
      lineHeight: value("lineHeight"),
      textAlign: value("textAlign"),
      reduceMotion: checked("reduceMotion"),
      keyboardShortcuts: checked("keyboardShortcuts"),
    })
  }

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
