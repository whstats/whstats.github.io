import { cloneElement, h } from "preact"
import { ChevronDown, ListTree } from "lucide-preact"
import { TableOfContents as QuartzTableOfContents } from "@quartz-community/table-of-contents/components"
import { htmlToJsx } from "@quartz-community/utils"
import { childrenOf, inheritComponentResources, lucideProps } from "../../_shared/lucide.js"

const iconCss = `
button.toc-header > .toc-title-icon {
  flex: 0 0 auto;
  margin-right: 0.4rem;
  stroke: currentColor;
}

ul.toc-content.overflow > li > a {
  font-size: 0.9rem;
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
    if (content) return cloneElement(node, {}, content)
  }

  const children = childrenOf(node)
  if (children.length === 0) return node
  return cloneElement(node, {}, ...children.map((child) => renderTocHeadingLinks(child, tree)))
}

export function TableOfContents(options) {
  const BaseTableOfContents = QuartzTableOfContents(options)

  const Component = (props) => {
    const root = BaseTableOfContents(props)
    if (!root) return root
    if (root.type === "details") return renderTocHeadingLinks(root, props.tree)

    const [header, content] = childrenOf(root)
    const [title] = childrenOf(header)
    const lucideHeader = cloneElement(
      header,
      {},
      h(ListTree, lucideProps(16, "toc-title-icon")),
      title,
      h(ChevronDown, lucideProps(24, "fold")),
    )
    const renderedContent = renderTocHeadingLinks(content, props.tree)
    return cloneElement(root, {}, lucideHeader, renderedContent)
  }

  Component.displayName = "TableOfContents"
  return inheritComponentResources(Component, BaseTableOfContents, iconCss)
}

export default TableOfContents
