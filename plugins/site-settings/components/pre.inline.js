;(() => {
  const storageKey = "notes:reading-settings:v2"
  const legacyStorageKey = "notes:reading-settings:v1"
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

  try {
    let stored = JSON.parse(window.localStorage.getItem(storageKey) ?? "null")
    const isCurrent = stored && typeof stored === "object"
    if (!isCurrent) stored = JSON.parse(window.localStorage.getItem(legacyStorageKey) ?? "null")
    if (!stored || typeof stored !== "object") return

    const legacyFontSize = clamp(stored.fontSize, 95, 120, 105)
    const fontSize = isCurrent
      ? clamp(stored.fontSize, 95, 120, 100)
      : clamp(Math.round((legacyFontSize / 105) * 100), 95, 120, 100)
    const measure = measures.has(stored.measure) ? stored.measure : "44rem"
    const storedLineHeight = stored.lineHeight === "1.65" ? "1.7" : stored.lineHeight
    const lineHeight = lineHeights.has(storedLineHeight) ? storedLineHeight : "1.7"
    const fontFamily = Object.hasOwn(fontFamilies, stored.fontFamily)
      ? stored.fontFamily
      : "ibm-plex-serif"
    const root = document.documentElement

    root.style.setProperty("--reading-body-font", fontFamilies[fontFamily])
    root.style.setProperty("--reader-font-scale", String(Number((fontSize / 100).toFixed(2))))
    root.style.setProperty("--reading-measure", measure)
    root.style.setProperty("--reading-line-height", lineHeight)
    if (stored.reduceMotion === true) root.setAttribute("data-reduce-motion", "true")
  } catch {
    // Storage may be unavailable in hardened or private browser contexts.
  }
})()
