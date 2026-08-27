import assert from "node:assert/strict"
import test from "node:test"
import renderToString from "preact-render-to-string"
import {
  RelatedNotes,
  indexPublishedNotes,
  resolveNoteTitle,
  selectRelatedNotes,
} from "./components/index.js"

function note(slug, title, links = [], extra = {}) {
  return {
    slug,
    filePath: `/content/${slug}.md`,
    frontmatter: title === null ? {} : { title },
    links,
    ...extra,
  }
}

test("selects, deduplicates, and deterministically sorts incoming and outgoing notes", () => {
  const current = note("topics/current", "Current", [
    "topics/zeta",
    "topics/alpha",
    "topics/zeta",
    "topics/current",
    "missing",
  ])
  const files = [
    note("topics/zeta", "Zeta", ["topics/current"]),
    current,
    note("topics/alpha", "Alpha", []),
    note("topics/beta", "Beta", ["topics/current", "topics/current"]),
  ]

  const related = selectRelatedNotes(current, files)

  assert.deepEqual(
    related.incoming.map(({ slug, title }) => ({ slug, title })),
    [
      { slug: "topics/beta", title: "Beta" },
      { slug: "topics/zeta", title: "Zeta" },
    ],
  )
  assert.deepEqual(
    related.outgoing.map(({ slug, title }) => ({ slug, title })),
    [
      { slug: "topics/alpha", title: "Alpha" },
      { slug: "topics/zeta", title: "Zeta" },
    ],
  )
  assert.deepEqual(
    related.outgoing.map(({ href }) => href),
    ["../topics/alpha", "../topics/zeta"],
  )
})

test("normalizes index slugs and excludes virtual, unlisted, and broken targets", () => {
  const current = note("reference/index", "Reference", ["/", "hidden", "tags/math"])
  const home = note("index", "Home", ["reference"])
  const hidden = note("hidden", "Hidden", ["reference"], { unlisted: true })
  const virtual = {
    slug: "tags/math",
    frontmatter: { title: "Math" },
    links: ["reference"],
  }

  const related = selectRelatedNotes(current, [current, home, hidden, virtual])

  assert.deepEqual(
    related.incoming.map((entry) => entry.slug),
    ["index"],
  )
  assert.deepEqual(
    related.outgoing.map((entry) => entry.slug),
    ["index"],
  )
  assert.equal(indexPublishedNotes([virtual, hidden]).size, 0)
})

test("resolves alias links to canonical notes without duplicate relations", () => {
  const current = note(
    "topics/current",
    "Current",
    ["legacy-target", "topics/target", "old-current"],
    { aliases: ["old-current"] },
  )
  const target = note("topics/target", "Canonical Target", [], {
    aliases: ["legacy-target"],
  })
  const incoming = note("topics/incoming", "Incoming", ["old-current"])
  const canonicalConflict = note("legacy-target", "Canonical Conflict")

  const related = selectRelatedNotes(current, [current, target, incoming])
  const conflictingIndex = indexPublishedNotes([target, canonicalConflict])

  assert.deepEqual(
    related.incoming.map((entry) => entry.slug),
    ["topics/incoming"],
  )
  assert.deepEqual(
    related.outgoing.map((entry) => entry.slug),
    ["topics/target"],
  )
  assert.equal(conflictingIndex.get("legacy-target"), canonicalConflict)
})

test("resolves source titles with a readable slug fallback", () => {
  assert.equal(resolveNoteTitle(note("topics/trimmed", "  Trimmed title  ")), "Trimmed title")
  assert.equal(resolveNoteTitle(note("topics/sub-gaussian_bounds", null)), "Sub Gaussian Bounds")
  assert.equal(resolveNoteTitle(note("index", null)), "Home")
})

test("renders accessible labelled sections, counts, and Quartz internal links", () => {
  const current = note("topics/current", "Current", ["topics/outgoing"])
  const Component = RelatedNotes()
  const html = renderToString(
    Component({
      fileData: current,
      allFiles: [
        current,
        note("topics/incoming", "Incoming Note", ["topics/current"]),
        note("topics/outgoing", "Outgoing Note"),
      ],
      displayClass: "desktop-only",
    }),
  )

  assert.match(html, /<aside[^>]*class="desktop-only related-notes"/)
  assert.match(html, /aria-labelledby="related-notes-title"/)
  assert.match(html, />Related Notes</)
  assert.match(html, />Links to this note</)
  assert.match(html, />Links from this note</)
  assert.match(html, /aria-label="1 note"/)
  assert.match(html, /class="internal related-notes__link"/)
  assert.match(html, /data-slug="topics\/outgoing"/)
  assert.equal(typeof Component.css, "string")
  assert.match(Component.css, /var\(--secondary\)/)
  assert.match(
    Component.css,
    /\.related-notes a\.related-notes__link \{[\s\S]*?font-family: var\(--bodyFont\);[\s\S]*?font-size: 0\.9rem;/,
  )
})

test("hides empty sections, shows a restrained empty state, or hides the panel by option", () => {
  const current = note("isolated", "Isolated")
  const visible = renderToString(RelatedNotes()({ fileData: current, allFiles: [current] }))
  const hidden = renderToString(
    RelatedNotes({ hideWhenEmpty: true })({ fileData: current, allFiles: [current] }),
  )

  assert.match(visible, />No related notes yet\.</)
  assert.doesNotMatch(visible, /related-notes__section/)
  assert.equal(hidden, "")
})
