import { FolderPage as QuartzFolderPage } from "@quartz-community/folder-page"
import { FolderContent } from "./components/index.js"

export function capitalizeGeneratedTitle(title, locale = "en-US") {
  if (typeof title !== "string" || title.length === 0) return title
  return title.replace(/^\p{Ll}/u, (letter) => letter.toLocaleUpperCase(locale))
}

export function FolderPage(options) {
  const base = QuartzFolderPage(options)

  return {
    ...base,
    generate(args) {
      const generatedPages = base.generate(args)
      const locale = args.cfg?.locale ?? "en-US"

      return generatedPages.map((page) => {
        const title = capitalizeGeneratedTitle(page.title, locale)
        return {
          ...page,
          title,
          data: {
            ...page.data,
            frontmatter: { ...page.data?.frontmatter, title },
          },
        }
      })
    },
    body: () => FolderContent(options),
  }
}

export default FolderPage
