import { cloneElement } from "preact"
import { Breadcrumbs as QuartzBreadcrumbs } from "@quartz-community/breadcrumbs/components"
import { childrenOf, inheritComponentResources } from "../../_shared/lucide.js"

function normalizedSlug(slug) {
  if (slug === "index") return ""
  return String(slug ?? "").replace(/\/index$/, "")
}

export function resolveBreadcrumbTitle(fileData, allFiles, slug) {
  const currentSlug = normalizedSlug(fileData?.slug)
  const currentTitle = fileData?.frontmatter?.title ?? fileData?.title
  if (normalizedSlug(slug) === currentSlug && currentTitle) return currentTitle

  const match = allFiles?.find((file) => normalizedSlug(file?.slug) === normalizedSlug(slug))
  return match?.frontmatter?.title ?? match?.title
}

export function Breadcrumbs(options) {
  const BaseBreadcrumbs = QuartzBreadcrumbs(options)

  const Component = (props) => {
    const root = BaseBreadcrumbs(props)
    if (!root) return root

    const slugParts = String(props.fileData?.slug ?? "").split("/")
    const crumbs = childrenOf(root).map((crumb, index) => {
      if (index === 0) return crumb

      const [link, ...rest] = childrenOf(crumb)
      const slug = slugParts.slice(0, index).join("/")
      const title = resolveBreadcrumbTitle(props.fileData, props.allFiles, slug)
      if (!title || !link) return crumb

      return cloneElement(crumb, {}, cloneElement(link, {}, title), ...rest)
    })

    return cloneElement(root, {}, ...crumbs)
  }

  Component.displayName = "Breadcrumbs"
  return inheritComponentResources(Component, BaseBreadcrumbs)
}

export default Breadcrumbs
