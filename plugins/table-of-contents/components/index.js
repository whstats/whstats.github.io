import { cloneElement, h } from "preact"
import { ListTree } from "lucide-preact"
import { TableOfContents as QuartzTableOfContents } from "@quartz-community/table-of-contents/components"
import { htmlToJsx } from "@quartz-community/utils"
import { childrenOf, inheritComponentResources, lucideProps } from "../../_shared/lucide.js"

const iconCss = `
.toc-static-header {
  display: flex;
  align-items: center;
  color: var(--dark);
}

.toc-static-header > .toc-title-icon {
  flex: 0 0 auto;
  margin-right: 0.4rem;
  stroke: currentColor;
}

.toc-static-header > h3 {
  display: inline-block;
  margin: 0;
  font-size: 1rem;
}

ul.toc-content.overflow > li > a {
  display: block;
  height: 1.6rem;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  font-size: 0.9rem;
  line-height: 1.6rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

ul.toc-content.overflow > li.depth-1 > a {
  font-size: 0.85rem;
}
`

function isHeading(node) {
  return node?.type === "element" && ["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName)
}

function findHeading(node, id) {
  if (isHeading(node) && String(node.properties?.id ?? "") === id) return node
  for (const child of node?.children ?? []) {
    const match = findHeading(child, id)
    if (match) return match
  }
  return null
}

function isHeadingAnchor(node) {
  return node?.type === "element" && node.tagName === "a" && node.properties?.role === "anchor"
}

export function renderedHeadingContent(tree, id) {
  const heading = findHeading(tree, id)
  if (!heading) return null

  return htmlToJsx({
    type: "root",
    children: heading.children.filter((child) => !isHeadingAnchor(child)),
  })
}

function renderTocHeadingLinks(node, tree) {
  if (!node || typeof node !== "object") return node

  const headingId = node.props?.["data-for"]
  if (typeof headingId === "string") {
    const content = renderedHeadingContent(tree, headingId)
    const label = typeof node.props?.children === "string" ? node.props.children : undefined
    if (content) return cloneElement(node, label ? { title: label } : {}, content)
  }

  const children = childrenOf(node)
  if (children.length === 0) return node
  return cloneElement(node, {}, ...children.map((child) => renderTocHeadingLinks(child, tree)))
}

export function visibleTocEntries(toc) {
  if (!Array.isArray(toc) || toc.length <= 15) return toc
  return toc.filter((entry) => Number(entry.depth) === 0)
}

export function TableOfContents(options) {
  const BaseTableOfContents = QuartzTableOfContents(options)

  const Component = (props) => {
    const root = BaseTableOfContents({
      ...props,
      fileData: {
        ...props.fileData,
        collapseToc: false,
        toc: visibleTocEntries(props.fileData?.toc),
      },
    })
    if (!root) return root
    if (root.type === "details") return renderTocHeadingLinks(root, props.tree)

    const [header, content] = childrenOf(root)
    const [title] = childrenOf(header)
    const staticHeader = h(
      "div",
      { class: "toc-static-header" },
      h(ListTree, lucideProps(16, "toc-title-icon")),
      title,
    )
    const renderedContent = renderTocHeadingLinks(content, props.tree)
    return cloneElement(root, {}, staticHeader, renderedContent)
  }

  Component.displayName = "TableOfContents"
  return inheritComponentResources(Component, BaseTableOfContents, iconCss)
}

export default TableOfContents
