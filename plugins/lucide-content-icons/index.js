import { visit } from "unist-util-visit"
import {
  BookOpen,
  Bug,
  ChevronDown,
  CircleCheck,
  CircleCheckBig,
  CircleHelp,
  CircleX,
  ClipboardList,
  FlaskConical,
  Info,
  Lightbulb,
  Link as LinkIcon,
  ListChecks,
  MessageSquareText,
  NotebookPen,
  Quote,
  Sigma,
  TriangleAlert,
  Zap,
} from "lucide-preact"
import { cloneHast, lucideHastTemplate } from "../_shared/lucide-hast.js"

const CALLOUT_ICONS = new Map([
  ["note", NotebookPen],
  ["abstract", ClipboardList],
  ["summary", ClipboardList],
  ["tldr", ClipboardList],
  ["info", Info],
  ["todo", CircleCheckBig],
  ["tip", Lightbulb],
  ["hint", Lightbulb],
  ["important", Lightbulb],
  ["success", CircleCheck],
  ["check", CircleCheck],
  ["done", CircleCheck],
  ["question", CircleHelp],
  ["help", CircleHelp],
  ["faq", CircleHelp],
  ["warning", TriangleAlert],
  ["caution", TriangleAlert],
  ["attention", TriangleAlert],
  ["failure", CircleX],
  ["fail", CircleX],
  ["missing", CircleX],
  ["danger", Zap],
  ["error", Zap],
  ["bug", Bug],
  ["example", FlaskConical],
  ["quote", Quote],
  ["cite", Quote],
  ["definition", BookOpen],
  ["theorem", Sigma],
  ["proof", ListChecks],
  ["remark", MessageSquareText],
])

function classesOf(node) {
  const className = node?.properties?.className
  if (Array.isArray(className)) return className.map(String)
  return typeof className === "string" ? className.split(/\s+/).filter(Boolean) : []
}

function hasClass(node, className) {
  return classesOf(node).includes(className)
}

const HEADING_LINK_ICON = lucideHastTemplate(LinkIcon, 18, "heading-anchor-icon")
const CALLOUT_FOLD_ICON = lucideHastTemplate(
  ChevronDown,
  18,
  "fold-callout-icon callout-fold lucide-callout-fold",
)
const CALLOUT_ICON_TEMPLATES = new Map(
  [...CALLOUT_ICONS].map(([type, Icon]) => [
    type,
    lucideHastTemplate(Icon, 18, "callout-icon lucide-callout-icon"),
  ]),
)

function calloutType(node) {
  const properties = node.properties ?? {}
  const value = properties.dataCallout ?? properties["data-callout"] ?? "note"
  return String(value).toLowerCase()
}

function replaceHeadingAnchor(node) {
  if (node.tagName !== "a" || node.properties?.role !== "anchor") return

  const iconIndex = node.children.findIndex(
    (child) => child.type === "element" && child.tagName === "svg",
  )
  if (iconIndex !== -1) node.children[iconIndex] = cloneHast(HEADING_LINK_ICON)
}

function replaceCalloutIcons(callout) {
  const template =
    CALLOUT_ICON_TEMPLATES.get(calloutType(callout)) ?? CALLOUT_ICON_TEMPLATES.get("note")

  visit(callout, "element", (node, index, parent) => {
    if (index === undefined || !parent || hasClass(node, "lucide")) return

    if (hasClass(node, "callout-icon")) {
      parent.children[index] = cloneHast(template)
    } else if (hasClass(node, "fold-callout-icon")) {
      parent.children[index] = cloneHast(CALLOUT_FOLD_ICON)
    }
  })
}

function rehypeLucideContentIcons() {
  return (tree) => {
    visit(tree, "element", (node) => {
      replaceHeadingAnchor(node)
      if (node.tagName === "blockquote" && hasClass(node, "callout")) {
        replaceCalloutIcons(node)
      }
    })
  }
}

export function LucideContentIcons() {
  return {
    name: "LucideContentIcons",
    htmlPlugins() {
      return [rehypeLucideContentIcons]
    },
  }
}

export default LucideContentIcons
