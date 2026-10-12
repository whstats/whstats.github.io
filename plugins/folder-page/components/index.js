import { cloneElement, h } from "preact"
import { FolderContent as QuartzFolderContent } from "@quartz-community/folder-page/components"
import { childrenOf } from "../../_shared/lucide.js"

const WORDS_PER_MINUTE = 200
const VISIBLE_TAGS = 3

function hasClass(node, className) {
  return String(node?.props?.class ?? "")
    .split(/\s+/)
    .includes(className)
}

function folderPrefix(slug) {
  if (slug.endsWith("/index")) return slug.slice(0, -"index".length)
  return slug.endsWith("/") ? slug : `${slug}/`
}

/** Published notes that sit directly inside the folder page's folder. */
export function pagesInFolder(allFiles, folderSlug) {
  const prefix = folderPrefix(folderSlug)
  return allFiles.filter((file) => {
    if (file.unlisted === true || !file.slug.startsWith(prefix)) return false
    const rest = file.slug.slice(prefix.length)
    return rest.length > 0 && rest !== "index" && !rest.includes("/")
  })
}

function titleOf(page) {
  return page.frontmatter.title
}

function orderOf(page) {
  const order = Number(page.frontmatter.order)
  return Number.isFinite(order) ? order : Number.POSITIVE_INFINITY
}

/** Frontmatter `order` gives the suggested reading path; unordered notes follow by title. */
export function byReadingOrder(a, b) {
  const difference = orderOf(a) - orderOf(b)
  if (difference !== 0 && !Number.isNaN(difference)) return difference
  return titleOf(a).localeCompare(titleOf(b), undefined, { numeric: true, sensitivity: "base" })
}

export function readingMinutes(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return words === 0 ? null : Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

function relativeHref(fromSlug, toSlug) {
  const depth = Math.max(fromSlug.split("/").length - 1, 0)
  const root = depth === 0 ? "." : Array.from({ length: depth }, () => "..").join("/")
  return `${root}/${toSlug.replace(/\/index$/, "/")}`
}

function noteCell(page, fromSlug) {
  const description = page.frontmatter.description ?? page.description
  const minutes = readingMinutes(page.text)

  return h(
    "td",
    { class: "folder-table__note" },
    h(
      "h3",
      null,
      h("a", { href: relativeHref(fromSlug, page.slug), class: "internal" }, titleOf(page)),
    ),
    description ? h("p", { class: "folder-table__description" }, description) : null,
    minutes ? h("p", { class: "folder-table__meta" }, `${minutes} min read`) : null,
  )
}

function tagsCell(page, fromSlug) {
  const tags = page.frontmatter.tags ?? []
  const visible = tags.slice(0, VISIBLE_TAGS)
  const hidden = tags.length - visible.length

  return h(
    "td",
    { class: "folder-table__tags" },
    h(
      "ul",
      { class: "tags" },
      ...visible.map((tag) =>
        h(
          "li",
          null,
          h("a", { class: "internal tag-link", href: relativeHref(fromSlug, `tags/${tag}`) }, tag),
        ),
      ),
      hidden > 0
        ? h("li", { class: "folder-table__more", title: tags.slice(VISIBLE_TAGS).join(", ") }, `+${hidden}`)
        : null,
    ),
  )
}

export function pagesToTable(pages, fromSlug) {
  const rows = [...pages]
    .sort(byReadingOrder)
    .map((page) => h("tr", null, noteCell(page, fromSlug), tagsCell(page, fromSlug)))

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
          h("th", { scope: "col", class: "folder-table__note" }, "Note"),
          h("th", { scope: "col", class: "folder-table__tags" }, "Tags"),
        ),
      ),
      h("tbody", null, rows),
    ),
  )
}

function replacePageList(node, table) {
  if (!node || typeof node !== "object") return node
  if (node.type === "ul" && hasClass(node, "section-ul")) return table

  const children = childrenOf(node)
  if (children.length === 0) return node
  return cloneElement(node, {}, ...children.map((child) => replacePageList(child, table)))
}

export function FolderContent(options) {
  const BaseFolderContent = QuartzFolderContent(options)

  const Component = (props) => {
    const root = BaseFolderContent(props)
    if (!root) return root
    const slug = props.fileData.slug
    return replacePageList(root, pagesToTable(pagesInFolder(props.allFiles, slug), slug))
  }
  Component.css = BaseFolderContent.css
  Component.displayName = "FolderContent"
  return Component
}

export default FolderContent
