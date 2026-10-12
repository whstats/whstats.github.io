import { readFileSync } from "node:fs"
import { h } from "preact"
import { ALargeSmall, Check, TextAlignJustify, TextAlignStart, X } from "lucide-preact"
import { lucideProps } from "../../_shared/lucide.js"
import { createSettingsCore, SETTINGS_SCHEMA, withSettingsCore } from "./settings-core.js"

const componentCss = readFileSync(new URL("./styles.css", import.meta.url), "utf8")
const inlineScript = (name) =>
  withSettingsCore(readFileSync(new URL(name, import.meta.url), "utf8"))
const beforeDOMLoaded = inlineScript("./pre.inline.js")
const afterDOMLoaded = inlineScript("./client.inline.js")

const { defaults, normalize } = createSettingsCore(SETTINGS_SCHEMA)

export const DEFAULT_SETTINGS = Object.freeze({ ...defaults })
export const normalizeSettings = normalize

const TYPEFACES = [
  { label: "XCharter", value: "xcharter" },
  { label: "IBM Plex Serif", value: "ibm-plex-serif" },
  { label: "Minion Pro", value: "minion-pro", note: "if installed" },
  { label: "Times New Roman", value: "times-new-roman" },
  { label: "System", value: "system" },
]

function classNames(...values) {
  return values.filter(Boolean).join(" ")
}

function radio(keyName, value) {
  return h("input", {
    type: "radio",
    name: `site-settings-${keyName}`,
    value,
    checked: String(DEFAULT_SETTINGS[keyName]) === value,
    "data-settings-key": keyName,
  })
}

// Each typeface is named in its own face, so the choice is visible before it is made.
function TypefaceSetting() {
  return h(
    "fieldset",
    { class: "site-settings-group" },
    h("legend", { class: "site-settings-label" }, "Typeface"),
    h(
      "div",
      { class: "site-settings-typefaces" },
      TYPEFACES.map(({ label, value, note }) =>
        h(
          "label",
          {
            class: "site-settings-typeface",
            style: `font-family: ${SETTINGS_SCHEMA.fontFamilies[value]}`,
          },
          radio("fontFamily", value),
          h("span", { class: "site-settings-typeface-name" }, label),
          note && h("small", null, note),
          h(Check, lucideProps(15, "site-settings-check")),
        ),
      ),
    ),
  )
}

function SizeSetting() {
  const id = "site-settings-font-size"
  return h(
    "div",
    { class: "site-settings-group" },
    h(
      "div",
      { class: "site-settings-label-row" },
      h("label", { class: "site-settings-label", for: id }, "Text size"),
      h("output", { for: id, "data-settings-output": "fontSize" }, `${DEFAULT_SETTINGS.fontSize}%`),
    ),
    h(
      "div",
      { class: "site-settings-size" },
      h("span", { class: "site-settings-size-small", "aria-hidden": "true" }, "A"),
      h("input", {
        id,
        type: "range",
        min: 95,
        max: 120,
        step: 1,
        value: DEFAULT_SETTINGS.fontSize,
        "data-settings-key": "fontSize",
      }),
      h("span", { class: "site-settings-size-large", "aria-hidden": "true" }, "A"),
    ),
  )
}

function ChoiceSetting({ label, keyName, options }) {
  return h(
    "fieldset",
    { class: "site-settings-group" },
    h("legend", { class: "site-settings-label" }, label),
    h(
      "div",
      { class: "site-settings-segmented" },
      options.map(({ label: optionLabel, value, icon }) =>
        h(
          "label",
          { class: "site-settings-segment" },
          radio(keyName, value),
          h("span", null, icon && h(icon, lucideProps(15)), optionLabel),
        ),
      ),
    ),
  )
}

function ToggleSetting({ keyName, label, description }) {
  return h(
    "label",
    { class: "site-settings-toggle" },
    h("span", null, h("strong", null, label), h("small", null, description)),
    h("input", { type: "checkbox", "data-settings-key": keyName }),
    h("span", { class: "site-settings-switch", "aria-hidden": "true" }),
  )
}

export function SiteSettings() {
  const Component = ({ displayClass }) =>
    h(
      "details",
      { class: classNames(displayClass, "site-settings") },
      h(
        "summary",
        {
          class: "site-settings-trigger",
          role: "button",
          title: "Reading settings",
          "aria-label": "Reading settings",
          "aria-controls": "site-settings-panel",
          "aria-expanded": "false",
          "aria-haspopup": "dialog",
        },
        h(ALargeSmall, lucideProps(20, "site-settings-icon")),
      ),
      h("button", {
        class: "site-settings-scrim",
        type: "button",
        tabindex: -1,
        "aria-label": "Close reading settings",
        "data-settings-close": "",
      }),
      h(
        "section",
        {
          class: "site-settings-panel",
          id: "site-settings-panel",
          role: "dialog",
          "aria-modal": "false",
          "aria-labelledby": "site-settings-title",
        },
        h(
          "div",
          { class: "site-settings-header" },
          h("h2", { id: "site-settings-title" }, "Reading settings"),
          h(
            "button",
            {
              class: "site-settings-close",
              type: "button",
              "aria-label": "Close reading settings",
              "data-settings-close": "",
            },
            h(X, lucideProps(16, "site-settings-close-icon")),
          ),
        ),
        h(
          "div",
          { class: "site-settings-fields" },
          h(TypefaceSetting),
          h(SizeSetting),
          h(ChoiceSetting, {
            label: "Line length",
            keyName: "measure",
            options: [
              { label: "Compact", value: "44rem" },
              { label: "Comfortable", value: "47rem" },
              { label: "Wide", value: "50rem" },
            ],
          }),
          h(ChoiceSetting, {
            label: "Line spacing",
            keyName: "lineHeight",
            options: [
              { label: "Compact", value: "1.55" },
              { label: "Comfortable", value: "1.7" },
              { label: "Relaxed", value: "1.78" },
            ],
          }),
          h(ChoiceSetting, {
            label: "Alignment",
            keyName: "textAlign",
            options: [
              { label: "Left", value: "left", icon: TextAlignStart },
              { label: "Justified", value: "justify", icon: TextAlignJustify },
            ],
          }),
        ),
        h(
          "div",
          { class: "site-settings-toggles" },
          h(ToggleSetting, {
            keyName: "reduceMotion",
            label: "Reduce motion",
            description: "Minimize interface animation.",
          }),
          h(ToggleSetting, {
            keyName: "keyboardShortcuts",
            label: "Keyboard shortcuts",
            description: "Press ? on any page to see every shortcut.",
          }),
        ),
        h(
          "div",
          { class: "site-settings-footer" },
          h("span", { class: "site-settings-status", role: "status", "aria-live": "polite" }),
          h("span", { class: "site-settings-note" }, "Saved in this browser"),
          h("button", { type: "button", "data-settings-reset": "" }, "Restore defaults"),
        ),
      ),
    )

  Component.displayName = "SiteSettings"
  Component.css = componentCss
  Component.beforeDOMLoaded = beforeDOMLoaded
  Component.afterDOMLoaded = afterDOMLoaded
  return Component
}

export default SiteSettings
