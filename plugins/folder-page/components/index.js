import { cloneElement, h } from "preact"
import { FolderContent as QuartzFolderContent } from "@quartz-community/folder-page/components"
import { childrenOf } from "../../_shared/lucide.js"

function hasClass(node, className) {
  return String(node?.props?.class ?? "")
    .split(/\s+/)
    .includes(className)
}

export function pageListToTable(list) {
  const rows = childrenOf(list).flatMap((item) => {
    const section = childrenOf(item)[0]
    if (!hasClass(section, "section")) return []

    const [meta, description, tags] = childrenOf(section)
    return [
      h(
        "tr",
        null,
        h("td", { class: "folder-table__date" }, ...childrenOf(meta)),
        h("td", { class: "folder-table__note" }, ...childrenOf(description)),
        h("td", { class: "folder-table__tags" }, tags),
      ),
    ]
  })

  return h(
    "div",
    { class: "table-container folder-table" },
    h(
      "table",
      { "aria-label": "Notes in this folder" },
      h(
        "thead",
        null,
        h(
          "tr",
          null,
          h("th", { scope: "col", class: "folder-table__date" }, "Date"),
          h("th", { scope: "col", class: "folder-table__note" }, "Note"),
          h("th", { scope: "col", class: "folder-table__tags" }, "Tags"),
        ),
      ),
      h("tbody", null, rows),
    ),
  )
}

function transformPageList(node) {
  if (!node || typeof node !== "object") return node
  if (node.type === "ul" && hasClass(node, "section-ul")) return pageListToTable(node)

  const children = childrenOf(node)
  if (children.length === 0) return node
  return cloneElement(node, {}, ...children.map(transformPageList))
}

export function FolderContent(options) {
  const BaseFolderContent = QuartzFolderContent(options)

  const Component = (props) => transformPageList(BaseFolderContent(props))
  Component.css = BaseFolderContent.css
  Component.displayName = "FolderContent"
  return Component
}

export default FolderContent
