import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { emitMarkdownSources, safeSlugSegments } from "./index.js"

async function fixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "markdown-actions-"))
  const content = path.join(root, "content")
  const output = path.join(root, "public")
  await fs.mkdir(content, { recursive: true })
  return {
    root,
    content,
    output,
    ctx: { argv: { directory: content, output } },
  }
}

function processed(filePath, slug) {
  return [{ type: "root", children: [] }, { data: { filePath, slug } }]
}

test("emits the exact source bytes, including frontmatter", async (t) => {
  const fx = await fixture()
  t.after(() => fs.rm(fx.root, { recursive: true, force: true }))
  const sourcePath = path.join(fx.content, "topics", "exact.md")
  const source = Buffer.from("---\r\ntitle: Exact\r\ntags: [proof]\r\n---\r\n\r\n# Exact\r\n")
  await fs.mkdir(path.dirname(sourcePath), { recursive: true })
  await fs.writeFile(sourcePath, source)

  await emitMarkdownSources(fx.ctx, [processed(sourcePath, "topics/exact")])

  const emitted = await fs.readFile(
    path.join(fx.output, "static", "markdown", "topics", "exact.md"),
  )
  assert.deepEqual(emitted, source)
})

test("does not emit virtual pages or source files outside the content directory", async (t) => {
  const fx = await fixture()
  t.after(() => fs.rm(fx.root, { recursive: true, force: true }))
  const outsidePath = path.join(fx.root, "private.md")
  const escapedSymlink = path.join(fx.content, "escaped.md")
  await fs.writeFile(outsidePath, "private")
  await fs.symlink(outsidePath, escapedSymlink)

  await emitMarkdownSources(fx.ctx, [
    processed(outsidePath, "private"),
    processed(escapedSymlink, "escaped"),
    [{ type: "root", children: [] }, { data: { slug: "tags/statistics" } }],
  ])

  await assert.rejects(fs.access(path.join(fx.output, "static", "markdown", "private.md")))
  await assert.rejects(fs.access(path.join(fx.output, "static", "markdown", "escaped.md")))
  await assert.rejects(
    fs.access(path.join(fx.output, "static", "markdown", "tags", "statistics.md")),
  )
})

test("removes a previously published asset when it leaves the filtered content set", async (t) => {
  const fx = await fixture()
  t.after(() => fs.rm(fx.root, { recursive: true, force: true }))
  const sourcePath = path.join(fx.content, "draftable.md")
  await fs.writeFile(sourcePath, "---\ndraft: false\n---\n")
  const outputPath = path.join(fx.output, "static", "markdown", "draftable.md")

  await emitMarkdownSources(fx.ctx, [processed(sourcePath, "draftable")])
  await fs.access(outputPath)
  await emitMarkdownSources(fx.ctx, [])

  await assert.rejects(fs.access(outputPath))
})

test("rejects path traversal and malformed slugs", () => {
  assert.equal(safeSlugSegments("../private"), null)
  assert.equal(safeSlugSegments("notes/../../private"), null)
  assert.equal(safeSlugSegments("notes\\private"), null)
  assert.equal(safeSlugSegments("notes//private"), null)
  assert.deepEqual(safeSlugSegments("topics/concentration"), ["topics", "concentration"])
})
