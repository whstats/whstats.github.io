import { cloneElement, h } from "preact"
import { ChevronDown, ListTree } from "lucide-preact"
import { TableOfContents as QuartzTableOfContents } from "@quartz-community/table-of-contents/components"
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

export function TableOfContents(options) {
  const BaseTableOfContents = QuartzTableOfContents(options)

  const Component = (props) => {
    const root = BaseTableOfContents(props)
    if (!root || root.type === "details") return root

    const [header, content] = childrenOf(root)
    const [title] = childrenOf(header)
    const lucideHeader = cloneElement(
      header,
      {},
      h(ListTree, lucideProps(16, "toc-title-icon")),
      title,
      h(ChevronDown, lucideProps(24, "fold")),
    )
    return cloneElement(root, {}, lucideHeader, content)
  }

  Component.displayName = "TableOfContents"
  return inheritComponentResources(Component, BaseTableOfContents, iconCss)
}

export default TableOfContents
