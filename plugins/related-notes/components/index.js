import { readFileSync } from "node:fs"
import { h } from "preact"
import { Network } from "lucide-preact"
import { resolveRelative, simplifySlug } from "@quartz-community/utils"
import { lucideProps } from "../../_shared/lucide.js"

const componentCss = readFileSync(new URL("./styles.css", import.meta.url), "utf8")

export const defaultOptions = Object.freeze({
  hideWhenEmpty: false,
  title: "Related Notes",
  incomingLabel: "Links to this note",
  outgoingLabel: "Links from this note",
  emptyText: "No related notes yet.",
})

// Quartz slugs and links are already slugified strings; only index pages need folding.
function normalizedSlug(slug) {
  const simplified = simplifySlug(slug)
  return simplified === "/" ? simplified : simplified.replace(/\/+$/, "")
}

function compareText(left, right) {
  return String(left).localeCompare(String(right), "en", {
    numeric: true,
    sensitivity: "base",
  })
}

function fallbackTitle(slug) {
  if (slug === "/") return "Home"
  return slug
    .split("/")
    .at(-1)
    .replace(/[-_]+/g, " ")
    .replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase("en"))
}

export function resolveNoteTitle(file) {
  return file.frontmatter.title?.trim() || fallbackTitle(normalizedSlug(file.slug))
}

// Virtual tag/folder pages have no source `filePath`, so they never count as notes.
export function isPublishedContentNote(file) {
  return Boolean(file.filePath) && file.unlisted !== true
}

function compareFiles(left, right) {
  return (
    compareText(normalizedSlug(left.slug), normalizedSlug(right.slug)) ||
    compareText(resolveNoteTitle(left), resolveNoteTitle(right)) ||
    compareText(left.filePath, right.filePath)
  )
}

/**
 * Index only real, published Markdown pages. Sorting before insertion makes
 * duplicate simplified slugs resolve deterministically.
 */
export function indexPublishedNotes(allFiles = []) {
  const index = new Map()
  const candidates = allFiles.filter(isPublishedContentNote).sort(compareFiles)

  // Canonical slugs are registered first so an alias can never shadow a real page.
  for (const file of candidates) {
    const slug = normalizedSlug(file.slug)
    if (!index.has(slug)) index.set(slug, file)
  }

  for (const file of candidates) {
    for (const alias of normalizedAliases(file)) {
      if (!index.has(alias)) index.set(alias, file)
    }
  }

  return index
}

function normalizedLinks(file) {
  return new Set((file.links ?? []).map(normalizedSlug))
}

function normalizedAliases(file) {
  return new Set((file.aliases ?? []).map(normalizedSlug))
}

function noteRelation(currentSlug, file) {
  return {
    slug: file.slug,
    title: resolveNoteTitle(file),
    href: resolveRelative(currentSlug, file.slug),
  }
}

function compareRelations(left, right) {
  return compareText(left.title, right.title) || compareText(left.slug, right.slug)
}

/** Select deduplicated incoming and outgoing published notes for one page. */
export function selectRelatedNotes(fileData, allFiles = []) {
  const currentSlug = normalizedSlug(fileData.slug)
  const noteIndex = indexPublishedNotes(allFiles)
  const currentIdentities = new Set([currentSlug, ...normalizedAliases(fileData)])
  const incoming = []
  const outgoing = []
  const seenIncoming = new Set()
  const seenOutgoing = new Set()

  for (const file of noteIndex.values()) {
    const slug = normalizedSlug(file.slug)
    if (slug === currentSlug || seenIncoming.has(slug)) continue
    seenIncoming.add(slug)
    if ([...normalizedLinks(file)].some((link) => currentIdentities.has(link))) {
      incoming.push(noteRelation(fileData.slug, file))
    }
  }

  for (const slug of normalizedLinks(fileData)) {
    const target = noteIndex.get(slug)
    if (!target) continue
    const targetSlug = normalizedSlug(target.slug)
    if (targetSlug === currentSlug || seenOutgoing.has(targetSlug)) continue
    seenOutgoing.add(targetSlug)
    outgoing.push(noteRelation(fileData.slug, target))
  }

  incoming.sort(compareRelations)
  outgoing.sort(compareRelations)
  return { incoming, outgoing }
}

function countLabel(count) {
  return `${count} ${count === 1 ? "note" : "notes"}`
}

function RelationSection({ id, label, notes, relation }) {
  return h(
    "section",
    {
      class: `related-notes__section related-notes__section--${relation}`,
      "aria-labelledby": id,
    },
    h(
      "h4",
      { class: "related-notes__section-heading", id },
      h("span", null, label),
      h(
        "span",
        {
          class: "related-notes__count",
          "aria-label": countLabel(notes.length),
        },
        notes.length,
      ),
    ),
    h(
      "ul",
      { class: "related-notes__list" },
      notes.map((note) =>
        h(
          "li",
          { class: "related-notes__item", key: note.slug },
          h(
            "a",
            {
              class: "internal related-notes__link",
              href: note.href,
              "data-slug": note.slug,
            },
            note.title,
          ),
        ),
      ),
    ),
  )
}

export function RelatedNotes(userOptions = {}) {
  const options = { ...defaultOptions, ...userOptions }

  const Component = ({ fileData, allFiles, displayClass }) => {
    const { incoming, outgoing } = selectRelatedNotes(fileData, allFiles)
    const isEmpty = incoming.length === 0 && outgoing.length === 0
    if (isEmpty && options.hideWhenEmpty) return null

    const titleId = "related-notes-title"
    return h(
      "aside",
      {
        class: [displayClass, "related-notes"].filter(Boolean).join(" "),
        "aria-labelledby": titleId,
      },
      h(
        "h3",
        { class: "related-notes__title", id: titleId },
        h(Network, lucideProps(16, "related-notes__title-icon")),
        h("span", null, options.title),
      ),
      incoming.length > 0 &&
        h(RelationSection, {
          id: "related-notes-incoming-title",
          label: options.incomingLabel,
          notes: incoming,
          relation: "incoming",
        }),
      outgoing.length > 0 &&
        h(RelationSection, {
          id: "related-notes-outgoing-title",
          label: options.outgoingLabel,
          notes: outgoing,
          relation: "outgoing",
        }),
      isEmpty && h("p", { class: "related-notes__empty" }, options.emptyText),
    )
  }

  Component.displayName = "RelatedNotes"
  Component.css = componentCss
  return Component
}

export default RelatedNotes
