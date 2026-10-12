import { readFileSync } from "node:fs"
import { h } from "preact"
import { Copy, Download } from "lucide-preact"
import { lucideProps } from "../../_shared/lucide.js"
import { publicSourcePath, safeSlugSegments } from "../paths.js"

const componentCss = readFileSync(new URL("./styles.css", import.meta.url), "utf8")
const componentScript = readFileSync(new URL("./client.inline.js", import.meta.url), "utf8")

function classNames(...values) {
  return values.filter(Boolean).join(" ")
}

export function markdownSourceHref(slug) {
  const segments = safeSlugSegments(slug)
  if (!segments) return null

  const rootDepth = Math.max(segments.length - 1, 0)
  const root = rootDepth === 0 ? "." : Array.from({ length: rootDepth }, () => "..").join("/")
  const encodedSlug = segments.map(encodeURIComponent).join("/")
  return `${root}/static/markdown/${encodedSlug}.md`
}

export function markdownDownloadName(relativePath, slug) {
  if (typeof relativePath === "string") {
    const candidate = relativePath.replaceAll("\\", "/").split("/").pop()
    if (candidate?.toLowerCase().endsWith(".md")) return candidate
  }

  const segments = safeSlugSegments(slug)
  return `${segments?.at(-1) ?? "note"}.md`
}

export function MarkdownActions() {
  const Component = ({ ctx, fileData, displayClass }) => {
    const sourceUrl = markdownSourceHref(fileData?.slug)
    if (!sourceUrl || !publicSourcePath(ctx.argv.directory, fileData.filePath)) return null

    const downloadName = markdownDownloadName(fileData.relativePath, fileData.slug)
    return h(
      "details",
      {
        class: classNames(displayClass, "markdown-actions"),
        "data-markdown-source": sourceUrl,
      },
      h(
        "summary",
        {
          class: "markdown-actions-trigger",
          "aria-label": "Markdown actions",
          title: "Copy or download this page as Markdown",
        },
        h(Download, lucideProps(18, "markdown-actions-icon")),
      ),
      h(
        "div",
        { class: "markdown-actions-menu", role: "menu", "aria-label": "Markdown actions" },
        h(
          "button",
          { type: "button", role: "menuitem", "data-markdown-action": "copy" },
          h(Copy, lucideProps(16, "markdown-actions-icon")),
          h("span", { "data-markdown-label": "" }, "Copy Markdown"),
        ),
        h(
          "a",
          {
            href: sourceUrl,
            download: downloadName,
            role: "menuitem",
            "data-router-ignore": "",
            "data-markdown-action": "download",
          },
          h(Download, lucideProps(16, "markdown-actions-icon")),
          h("span", null, "Download .md"),
        ),
        h("div", {
          class: "markdown-actions-status",
          role: "status",
          "aria-live": "polite",
          "aria-atomic": "true",
        }),
      ),
    )
  }

  Component.displayName = "MarkdownActions"
  Component.css = componentCss
  Component.afterDOMLoaded = componentScript
  return Component
}

export default MarkdownActions
