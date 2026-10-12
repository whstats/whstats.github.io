import { readFileSync } from "node:fs"
import { h } from "preact"
import { SlidersHorizontal, X } from "lucide-preact"
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

function classNames(...values) {
  return values.filter(Boolean).join(" ")
}

function RangeSetting({ id, label, minimum, maximum, value, keyName }) {
  return h(
    "div",
    { class: "site-settings-field" },
    h(
      "div",
      { class: "site-settings-field-heading" },
      h("label", { for: id }, label),
      h("output", { for: id, "data-settings-output": keyName }, `${value}%`),
    ),
    h("input", {
      id,
      type: "range",
      min: minimum,
      max: maximum,
      step: 1,
      value,
      "data-settings-key": keyName,
    }),
  )
}

function SelectSetting({ id, label, value, keyName, options }) {
  return h(
    "label",
    { class: "site-settings-field", for: id },
    h("span", { class: "site-settings-field-heading" }, h("span", null, label)),
    h(
      "select",
      { id, value, "data-settings-key": keyName },
      options.map(({ label: optionLabel, value: optionValue }) =>
        h("option", { value: optionValue }, optionLabel),
      ),
    ),
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
        h(SlidersHorizontal, lucideProps(20, "site-settings-icon")),
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
          "aria-describedby": "site-settings-description",
        },
        h(
          "header",
          { class: "site-settings-header" },
          h(
            "div",
            null,
            h("h2", { id: "site-settings-title" }, "Reading settings"),
            h("p", { id: "site-settings-description" }, "Saved only in this browser."),
          ),
          h(
            "button",
            {
              class: "site-settings-close",
              type: "button",
              "aria-label": "Close reading settings",
              "data-settings-close": "",
            },
            h(X, lucideProps(20, "site-settings-close-icon")),
          ),
        ),
        h(
          "div",
          { class: "site-settings-fields" },
          h(SelectSetting, {
            id: "site-settings-font-family",
            label: "Body font",
            value: DEFAULT_SETTINGS.fontFamily,
            keyName: "fontFamily",
            options: [
              { label: "IBM Plex Serif", value: "ibm-plex-serif" },
              { label: "Minion Pro (if installed)", value: "minion-pro" },
              { label: "XCharter", value: "xcharter" },
              { label: "Times New Roman", value: "times-new-roman" },
              { label: "System", value: "system" },
            ],
          }),
          h(RangeSetting, {
            id: "site-settings-font-size",
            label: "Body text",
            minimum: 95,
            maximum: 120,
            value: DEFAULT_SETTINGS.fontSize,
            keyName: "fontSize",
          }),
          h(SelectSetting, {
            id: "site-settings-measure",
            label: "Reading width",
            value: DEFAULT_SETTINGS.measure,
            keyName: "measure",
            options: [
              { label: "Compact", value: "44rem" },
              { label: "Comfortable", value: "47rem" },
              { label: "Wide", value: "50rem" },
            ],
          }),
          h(SelectSetting, {
            id: "site-settings-line-height",
            label: "Line spacing",
            value: DEFAULT_SETTINGS.lineHeight,
            keyName: "lineHeight",
            options: [
              { label: "Compact", value: "1.55" },
              { label: "Comfortable", value: "1.7" },
              { label: "Relaxed", value: "1.78" },
            ],
          }),
          h(SelectSetting, {
            id: "site-settings-text-align",
            label: "Text alignment",
            value: DEFAULT_SETTINGS.textAlign,
            keyName: "textAlign",
            options: [
              { label: "Left", value: "left" },
              { label: "Justified", value: "justify" },
            ],
          }),
          h(
            "label",
            { class: "site-settings-motion" },
            h(
              "span",
              null,
              h("strong", null, "Reduce motion"),
              h("small", null, "Minimize interface animation."),
            ),
            h("input", {
              type: "checkbox",
              "data-settings-key": "reduceMotion",
            }),
            h("span", { class: "site-settings-switch", "aria-hidden": "true" }),
          ),
          h(
            "label",
            { class: "site-settings-motion" },
            h(
              "span",
              null,
              h("strong", null, "Keyboard shortcuts"),
              h("small", null, "Press ? on any page to see every shortcut."),
            ),
            h("input", {
              type: "checkbox",
              "data-settings-key": "keyboardShortcuts",
            }),
            h("span", { class: "site-settings-switch", "aria-hidden": "true" }),
          ),
        ),
        h(
          "div",
          { class: "site-settings-footer" },
          h("button", { type: "button", "data-settings-reset": "" }, "Restore defaults"),
          h("span", { class: "site-settings-status", role: "status", "aria-live": "polite" }),
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
