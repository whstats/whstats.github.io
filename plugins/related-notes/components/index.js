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

function normalizedSlug(value) {
  if (typeof value !== "string" || value.length === 0) return null

  try {
    const simplified = simplifySlug(value)
    return simplified === "/" ? simplified : simplified.replace(/\/+$/, "")
  } catch {
    return null
  }
}

function compareText(left, right) {
  return String(left).localeCompare(String(right), "en", {
    numeric: true,
    sensitivity: "base",
  })
}

function fallbackTitle(slug) {
  if (slug === "/") return "Home"

  const finalSegment = slug.split("/").filter(Boolean).at(-1) ?? "Untitled note"
  let decoded = finalSegment
  try {
    decoded = decodeURIComponent(finalSegment)
  } catch {
    // A malformed escape should not prevent the remaining links from rendering.
  }

  return decoded
    .replace(/[-_]+/g, " ")
    .replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase("en"))
}

export function resolveNoteTitle(file) {
  const candidates = [file?.frontmatter?.title, file?.title]
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim()
    }
  }

  return fallbackTitle(normalizedSlug(file?.slug) ?? "")
}

export function isPublishedContentNote(file) {
  return (
    file !== null &&
    typeof file === "object" &&
    typeof file.slug === "string" &&
    file.slug.length > 0 &&
    typeof file.filePath === "string" &&
    file.filePath.length > 0 &&
    file.unlisted !== true
  )
}

function compareFiles(left, right) {
  return (
    compareText(normalizedSlug(left.slug), normalizedSlug(right.slug)) ||
    compareText(resolveNoteTitle(left), resolveNoteTitle(right)) ||
    compareText(left.filePath, right.filePath)
  )
}

/**
 * Index only real, published Markdown pages. Virtual tag/folder pages do not
 * have a source `filePath`, so they cannot appear as related notes. Sorting
 * before insertion makes duplicate simplified slugs resolve deterministically.
 */
export function indexPublishedNotes(allFiles = []) {
  const index = new Map()
  const candidates = Array.isArray(allFiles)
    ? allFiles.filter(isPublishedContentNote).sort(compareFiles)
    : []

  // Canonical slugs are registered first so an alias can never shadow a real page.
  for (const file of candidates) {
    const slug = normalizedSlug(file.slug)
    if (slug !== null && !index.has(slug)) index.set(slug, file)
  }

  for (const file of candidates) {
    for (const alias of normalizedAliases(file)) {
      if (!index.has(alias)) index.set(alias, file)
    }
  }

  return index
}

function normalizedLinks(file) {
  if (!Array.isArray(file?.links)) return new Set()
  return new Set(file.links.map(normalizedSlug).filter((slug) => slug !== null))
}

function normalizedAliases(file) {
  if (!Array.isArray(file?.aliases)) return new Set()
  return new Set(file.aliases.map(normalizedSlug).filter((slug) => slug !== null))
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
  const currentSlug = normalizedSlug(fileData?.slug)
  if (currentSlug === null) return { incoming: [], outgoing: [] }

  const noteIndex = indexPublishedNotes(allFiles)
  const incoming = []
  const outgoing = []
  const currentIdentities = new Set([currentSlug, ...normalizedAliases(fileData)])
  const seenIncoming = new Set()
  const seenOutgoing = new Set()

  for (const file of noteIndex.values()) {
    const slug = normalizedSlug(file.slug)
    if (slug === null || slug === currentSlug || seenIncoming.has(slug)) continue
    seenIncoming.add(slug)
    if ([...normalizedLinks(file)].some((link) => currentIdentities.has(link))) {
      incoming.push(noteRelation(fileData.slug, file))
    }
  }

  for (const slug of normalizedLinks(fileData)) {
    const target = noteIndex.get(slug)
    const targetSlug = normalizedSlug(target?.slug)
    if (
      target &&
      targetSlug !== null &&
      targetSlug !== currentSlug &&
      !seenOutgoing.has(targetSlug)
    ) {
      seenOutgoing.add(targetSlug)
      outgoing.push(noteRelation(fileData.slug, target))
    }
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
