import { cloneElement, h } from "preact"
import { Search as SearchIcon } from "lucide-preact"
import { Search as QuartzSearch } from "@quartz-community/search/components"
import { childrenOf, inheritComponentResources, lucideProps } from "../../_shared/lucide.js"

const iconCss = `
.search > .search-button > .lucide-search {
  color: var(--darkgray);
  transition: color 0.2s ease;
}
`

export function Search(options) {
  const BaseSearch = QuartzSearch(options)

  const Component = (props) => {
    const root = BaseSearch(props)
    const [button, container] = childrenOf(root)
    const [, label] = childrenOf(button)
    const lucideButton = cloneElement(
      button,
      {},
      h(SearchIcon, lucideProps(18, "search-icon")),
      label,
    )

    return cloneElement(root, {}, lucideButton, container)
  }

  Component.displayName = "Search"
  return inheritComponentResources(Component, BaseSearch, iconCss)
}

export default Search
