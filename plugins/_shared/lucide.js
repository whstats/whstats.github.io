import { toChildArray } from "preact"

export const LUCIDE_STROKE_WIDTH = 1.8

export function lucideProps(size, className) {
  return {
    size,
    strokeWidth: LUCIDE_STROKE_WIDTH,
    class: className,
    "aria-hidden": "true",
    focusable: "false",
  }
}

export function childrenOf(node) {
  return toChildArray(node?.props?.children)
}

export function inheritComponentResources(component, source, extraCss = "") {
  component.css = [source.css, extraCss].filter(Boolean).join("\n")
  component.beforeDOMLoaded = source.beforeDOMLoaded
  component.afterDOMLoaded = source.afterDOMLoaded
  component.externalResources = source.externalResources
  return component
}
