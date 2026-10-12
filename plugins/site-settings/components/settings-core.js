// Single definition of the reading settings. The server imports it directly; the two
// inline scripts receive the same code through `withSettingsCore()` so the three
// runtimes cannot drift apart.

export const SETTINGS_SCHEMA = Object.freeze({
  storageKey: "notes:reading-settings:v2",
  defaults: {
    fontFamily: "xcharter",
    fontSize: 100,
    measure: "44rem",
    lineHeight: "1.7",
    textAlign: "justify",
    reduceMotion: false,
    keyboardShortcuts: true,
  },
  fontFamilies: {
    "ibm-plex-serif": "var(--reading-font-ibm-plex-serif)",
    "minion-pro": "var(--reading-font-minion-pro)",
    xcharter: "var(--reading-font-xcharter)",
    "times-new-roman": "var(--reading-font-times-new-roman)",
    system: "var(--reading-font-system)",
  },
  measures: ["44rem", "47rem", "50rem"],
  lineHeights: ["1.55", "1.7", "1.78"],
  textAligns: ["left", "justify"],
})

// Must stay self-contained: it is serialized with Function.prototype.toString.
export function createSettingsCore(schema) {
  const { defaults, fontFamilies, measures, lineHeights, textAligns } = schema

  const clamp = (value, minimum, maximum, fallback) => {
    const numeric = Number(value)
    return Number.isFinite(numeric)
      ? Math.min(maximum, Math.max(minimum, Math.round(numeric)))
      : fallback
  }

  const pick = (allowed, value, fallback) => (allowed.includes(value) ? value : fallback)

  // Stored values are reader-controlled, so every field is validated.
  const normalize = (value = {}) => ({
    fontFamily: Object.hasOwn(fontFamilies, value.fontFamily)
      ? value.fontFamily
      : defaults.fontFamily,
    fontSize: clamp(value.fontSize, 95, 120, defaults.fontSize),
    measure: pick(measures, value.measure, defaults.measure),
    lineHeight: pick(
      lineHeights,
      value.lineHeight === "1.65" ? "1.7" : value.lineHeight,
      defaults.lineHeight,
    ),
    textAlign: pick(textAligns, value.textAlign, defaults.textAlign),
    reduceMotion: value.reduceMotion === true,
    keyboardShortcuts: value.keyboardShortcuts !== false,
  })

  const readStored = () => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(schema.storageKey) ?? "null")
      return stored && typeof stored === "object" ? stored : null
    } catch {
      // Storage may be unavailable in hardened or private browser contexts.
      return null
    }
  }

  const applyToRoot = (settings) => {
    const root = document.documentElement
    root.style.setProperty("--reading-body-font", fontFamilies[settings.fontFamily])
    root.style.setProperty(
      "--reader-font-scale",
      String(Number((settings.fontSize / 100).toFixed(2))),
    )
    root.style.setProperty("--reading-measure", settings.measure)
    root.style.setProperty("--reading-line-height", settings.lineHeight)
    root.style.setProperty("--reading-text-align", settings.textAlign)
    // CSS matches [data-reduce-motion="true"], so the value matters, not just presence.
    if (settings.reduceMotion) root.setAttribute("data-reduce-motion", "true")
    else root.removeAttribute("data-reduce-motion")
    root.setAttribute("data-keyboard-shortcuts", String(settings.keyboardShortcuts))
  }

  return { storageKey: schema.storageKey, defaults, normalize, readStored, applyToRoot }
}

// Each inline script gets its own scope: both run as classic scripts on the same page,
// so a shared top-level `const settingsCore` would collide.
export function withSettingsCore(script) {
  const core = `(${createSettingsCore.toString()})(${JSON.stringify(SETTINGS_SCHEMA)})`
  return `;((settingsCore) => {\n${script}\n})(${core});\n`
}
