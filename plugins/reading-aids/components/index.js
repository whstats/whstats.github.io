import { readFileSync } from "node:fs"
import { h } from "preact"
import { ArrowRight, ArrowUp, ChevronDown, ListTree, X } from "lucide-preact"
import { lucideProps } from "../../_shared/lucide.js"

const componentCss = readFileSync(new URL("./styles.css", import.meta.url), "utf8")
const afterDOMLoaded = readFileSync(new URL("./client.inline.js", import.meta.url), "utf8")

// Mirrors the sidebar table of contents: long outlines collapse to top-level sections.
const MAX_ENTRIES = 15

export function mobileTocEntries(toc = []) {
  return toc.length <= MAX_ENTRIES ? toc : toc.filter((entry) => entry.depth === 0)
}

export function pageSummary(fileData) {
  return fileData.frontmatter?.description?.trim() || null
}

function MobileContents({ entries }) {
  return h(
    "details",
    { class: "reading-aids__contents" },
    h(
      "summary",
      null,
      h(ListTree, lucideProps(16, "reading-aids__icon")),
      h("span", null, "Contents"),
      h("span", { class: "reading-aids__count" }, `${entries.length} sections`),
      h(ChevronDown, lucideProps(16, "reading-aids__chevron")),
    ),
    h(
      "ol",
      null,
      entries.map((entry) =>
        h(
          "li",
          { class: `depth-${entry.depth}`, key: entry.slug },
          h("a", { href: `#${entry.slug}`, "data-for": entry.slug }, entry.text),
        ),
      ),
    ),
  )
}

// Filled in by the client script when the reader has a saved position on this page.
function ResumeLink() {
  return h(
    "p",
    { class: "reading-aids__resume", hidden: true },
    h(
      "a",
      { class: "reading-aids__resume-link", href: "#" },
      h("span", null, "Continue from "),
      h("span", { class: "reading-aids__resume-heading" }),
      h(ArrowRight, lucideProps(16)),
    ),
    h(
      "button",
      {
        type: "button",
        class: "reading-aids__resume-dismiss",
        "aria-label": "Forget reading position",
        title: "Forget reading position",
      },
      h(X, lucideProps(16)),
    ),
  )
}

export function ReadingAids() {
  const Component = ({ fileData, displayClass }) => {
    const summary = pageSummary(fileData)
    const entries = mobileTocEntries(fileData.toc)
    if (!summary && entries.length === 0) return null

    return h(
      "div",
      { class: [displayClass, "reading-aids"].filter(Boolean).join(" ") },
      summary && h("p", { class: "reading-aids__summary" }, summary),
      entries.length > 0 && h(ResumeLink),
      entries.length > 0 && h(MobileContents, { entries }),
      entries.length > 0 &&
        h(
          "button",
          {
            type: "button",
            class: "reading-aids__top",
            "aria-label": "Back to top",
            title: "Back to top",
            hidden: true,
          },
          h(ArrowUp, lucideProps(18)),
        ),
    )
  }

  Component.displayName = "ReadingAids"
  Component.css = componentCss
  Component.afterDOMLoaded = afterDOMLoaded
  return Component
}

export default ReadingAids
