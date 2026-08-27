import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { render } from "preact-render-to-string"
import { MarkdownActions, markdownDownloadName, markdownSourceHref } from "./index.js"

test("builds deployment-safe relative source URLs", () => {
  assert.equal(markdownSourceHref("index"), "./static/markdown/index.md")
  assert.equal(
    markdownSourceHref("topics/sub-gaussian-tail-bounds"),
    "../static/markdown/topics/sub-gaussian-tail-bounds.md",
  )
  assert.equal(
    markdownSourceHref("courses/advanced/note one"),
    "../../static/markdown/courses/advanced/note%20one.md",
  )
  assert.equal(markdownSourceHref("../private"), null)
})

test("preserves the original Markdown filename for downloads", () => {
  assert.equal(markdownDownloadName("topics/My Note.md", "topics/my-note"), "My Note.md")
  assert.equal(markdownDownloadName(undefined, "topics/my-note"), "my-note.md")
})

test("renders an accessible menu only for a real source inside content", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "markdown-actions-component-"))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const contentDir = path.join(root, "content")
  const sourcePath = path.join(contentDir, "topics", "note.md")
  await fs.mkdir(path.dirname(sourcePath), { recursive: true })
  await fs.writeFile(sourcePath, "# Note\n")

  const Component = MarkdownActions()
  const html = render(
    Component({
      ctx: { argv: { directory: contentDir } },
      fileData: {
        slug: "topics/note",
        filePath: sourcePath,
        relativePath: "topics/note.md",
      },
    }),
  )

  assert.match(html, /aria-label="Markdown actions"/)
  assert.match(html, /data-markdown-action="copy"/)
  assert.match(html, /data-markdown-action="download"/)
  assert.match(html, /data-router-ignore/)
  assert.match(html, /download="note.md"/)
  assert.match(html, /role="status"/)

  const virtualHtml = render(
    Component({
      ctx: { argv: { directory: contentDir } },
      fileData: { slug: "tags/statistics" },
    }),
  )
  assert.equal(virtualHtml, "")
})
