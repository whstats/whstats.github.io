import { readFileSync } from "node:fs"
import { Check, Copy } from "lucide-preact"
import { visit } from "unist-util-visit"
import {
  SyntaxHighlighting as QuartzSyntaxHighlighting,
  tokenClassifierTransformer,
} from "@quartz-community/syntax-highlighting"
import { cloneHast, lucideHastTemplate } from "../_shared/lucide-hast.js"

const clipboardScript = readFileSync(new URL("./client.inline.js", import.meta.url), "utf8")
const clipboardCss = readFileSync(new URL("./styles.css", import.meta.url), "utf8")

const COPY_ICON = lucideHastTemplate(Copy, 16, "clipboard-icon clipboard-icon-copy")
const SUCCESS_ICON = lucideHastTemplate(Check, 16, "clipboard-icon clipboard-icon-success")

function hasClipboardButton(node) {
  return node.children.some(
    (child) =>
      child.type === "element" &&
      child.tagName === "button" &&
      Array.isArray(child.properties?.className) &&
      child.properties.className.includes("clipboard-button"),
  )
}

function rehypeLucideClipboardButton() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (
        node.tagName !== "pre" ||
        hasClipboardButton(node) ||
        !node.children.some((child) => child.type === "element" && child.tagName === "code")
      ) {
        return
      }

      node.children.unshift({
        type: "element",
        tagName: "button",
        properties: {
          type: "button",
          className: ["clipboard-button"],
          ariaLabel: "Copy source",
        },
        children: [cloneHast(COPY_ICON), cloneHast(SUCCESS_ICON)],
      })
    })
  }
}

export function SyntaxHighlighting(userOptions) {
  const options = { clipboard: true, ...userOptions }
  const base = QuartzSyntaxHighlighting({ ...userOptions, clipboard: false })

  return {
    ...base,
    htmlPlugins(ctx) {
      const plugins = base.htmlPlugins?.(ctx) ?? []
      return options.clipboard ? [...plugins, rehypeLucideClipboardButton] : plugins
    },
    externalResources(ctx) {
      const resources = base.externalResources?.(ctx) ?? {}
      if (!options.clipboard) return resources

      return {
        ...resources,
        js: [
          ...(resources.js ?? []),
          {
            script: clipboardScript,
            loadTime: "afterDOMReady",
            contentType: "inline",
          },
        ],
        css: [...(resources.css ?? []), { content: clipboardCss, inline: true }],
      }
    },
  }
}

export { tokenClassifierTransformer }
export default SyntaxHighlighting
