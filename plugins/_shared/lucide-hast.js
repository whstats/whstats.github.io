import { h } from "preact"
import render from "preact-render-to-string"
import { fromHtml } from "hast-util-from-html"
import { LUCIDE_STROKE_WIDTH } from "./lucide.js"

export function lucideHastTemplate(Icon, size, className) {
  const markup = render(
    h(Icon, {
      size,
      strokeWidth: LUCIDE_STROKE_WIDTH,
      class: className,
      "aria-hidden": "true",
      focusable: "false",
    }),
  )
  const fragment = fromHtml(markup, { fragment: true })
  const icon = fragment.children.find((child) => child.type === "element")
  if (!icon) throw new Error(`Lucide icon ${Icon.displayName ?? Icon.name} did not render`)
  return icon
}

export function cloneHast(node) {
  return structuredClone(node)
}
