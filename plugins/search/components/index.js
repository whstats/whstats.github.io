import { cloneElement, h } from "preact"
import { Search as SearchIcon } from "lucide-preact"
import { Search as QuartzSearch } from "@quartz-community/search/components"
import { childrenOf, inheritComponentResources, lucideProps } from "../../_shared/lucide.js"

const iconCss = `
.search > .search-button > .lucide-search {
  color: var(--darkgray);
  transition: color 0.2s ease;
}

/* Keep the matching excerpt in the result list so body-only matches are distinguishable. */
@media all and not (max-width: 800px) {
  .search > .search-container > .search-space > .search-layout[data-preview] > .results-container {
    flex-basis: min(38%, 480px);
  }

  .search > .search-container > .search-space > .search-layout[data-preview] .result-card > p.card-description {
    display: -webkit-box;
    margin: 0.3rem 0 0;
    overflow: hidden;
    color: var(--gray);
    font-size: 0.8rem;
    line-height: 1.4;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
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
      { "aria-keyshortcuts": "f /" },
      h(SearchIcon, lucideProps(18, "search-icon")),
      label,
    )

    return cloneElement(root, {}, lucideButton, container)
  }

  Component.displayName = "Search"
  return inheritComponentResources(Component, BaseSearch, iconCss)
}

export default Search
