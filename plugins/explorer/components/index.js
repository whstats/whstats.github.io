import { cloneElement, h } from "preact"
import { ChevronDown, FolderTree, Menu } from "lucide-preact"
import { Explorer as QuartzExplorer } from "@quartz-community/explorer/components"
import { childrenOf, inheritComponentResources, lucideProps } from "../../_shared/lucide.js"

const iconCss = `
.explorer .explorer-title-icon {
  flex: 0 0 auto;
  margin-right: 0.4rem;
  stroke: currentColor;
}

.explorer-content ul li > a,
.explorer-content .folder-container div > a,
.explorer-content .folder-container div > button span {
  font-size: 0.9rem;
}

.explorer-content ul li > a,
.explorer-content .folder-container div > a,
.explorer-content .folder-container div > button {
  font-family: var(--bodyFont);
}

.explorer-content ul li > a {
  opacity: 0.35;
  transition: 0.5s ease opacity, 0.3s ease color;
}

.explorer-content ul li > a:hover {
  color: var(--dark);
  opacity: 0.75;
}

.explorer-content ul li > a.active {
  color: var(--secondary);
  opacity: 1;
  font-weight: 700;
}
`

export function Explorer(options) {
  const BaseExplorer = QuartzExplorer(options)

  const Component = (props) => {
    const root = BaseExplorer(props)
    const [mobileButton, desktopButton, content, fileTemplate, folderTemplate] = childrenOf(root)

    const lucideMobileButton = cloneElement(
      mobileButton,
      {},
      h(Menu, lucideProps(24, "explorer-menu-icon")),
    )

    const [title] = childrenOf(desktopButton)
    const lucideDesktopButton = cloneElement(
      desktopButton,
      {},
      h(FolderTree, lucideProps(16, "explorer-title-icon")),
      title,
      h(ChevronDown, lucideProps(14, "fold")),
    )

    const folderListItem = childrenOf(folderTemplate)[0]
    const [folderContainer, folderOuter] = childrenOf(folderListItem)
    const [, folderLabel] = childrenOf(folderContainer)
    const lucideFolderContainer = cloneElement(
      folderContainer,
      {},
      h(ChevronDown, lucideProps(12, "folder-icon nav-folder-collapse-indicator collapse-icon")),
      folderLabel,
    )
    const lucideFolderItem = cloneElement(folderListItem, {}, lucideFolderContainer, folderOuter)
    const lucideFolderTemplate = cloneElement(folderTemplate, {}, lucideFolderItem)

    return cloneElement(
      root,
      {},
      lucideMobileButton,
      lucideDesktopButton,
      content,
      fileTemplate,
      lucideFolderTemplate,
    )
  }

  Component.displayName = "Explorer"
  return inheritComponentResources(Component, BaseExplorer, iconCss)
}

export default Explorer
