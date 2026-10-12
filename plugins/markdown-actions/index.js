import fs from "node:fs/promises"
import path from "node:path"
import { isInside, publicSourcePath, safeSlugSegments } from "./paths.js"

export { safeSlugSegments }

const ASSET_SEGMENTS = ["static", "markdown"]
const MANIFEST_NAME = ".markdown-actions-manifest.json"

function assetRelativePath(slug) {
  const segments = safeSlugSegments(slug)
  if (!segments) return null
  const lastIndex = segments.length - 1
  segments[lastIndex] = `${segments[lastIndex]}.md`
  return path.join(...segments)
}

function manifestPath(assetRoot) {
  return path.join(assetRoot, MANIFEST_NAME)
}

async function readPreviousManifest(assetRoot) {
  try {
    const parsed = JSON.parse(await fs.readFile(manifestPath(assetRoot), "utf8"))
    return Array.isArray(parsed.files)
      ? parsed.files.filter((entry) => typeof entry === "string")
      : []
  } catch {
    return []
  }
}

async function removeStaleAssets(assetRoot, previousFiles, currentFiles) {
  await Promise.all(
    previousFiles.map(async (relativePath) => {
      if (currentFiles.has(relativePath)) return

      // The manifest is read back from disk, so bound deletions to Markdown inside the asset root.
      const candidate = path.resolve(assetRoot, relativePath)
      if (path.extname(candidate).toLowerCase() !== ".md" || !isInside(assetRoot, candidate)) return
      await fs.unlink(candidate).catch((error) => {
        if (error?.code !== "ENOENT") throw error
      })
    }),
  )
}

/**
 * Mirror only the already-filtered Quartz content set. The caller passes the
 * same published content used by the page emitter, so drafts and ignored files
 * never enter this function. A realpath boundary check also rejects symlinks
 * that escape the configured content directory.
 */
export async function emitMarkdownSources(ctx, content) {
  const outputRoot = path.resolve(ctx.argv.output)
  const assetRoot = path.join(outputRoot, ...ASSET_SEGMENTS)
  const previousFiles = await readPreviousManifest(assetRoot)
  const currentFiles = new Set()
  const emittedFiles = []

  for (const [, file] of content) {
    const relativeAssetPath = assetRelativePath(file.data.slug)
    if (!relativeAssetPath) continue

    const sourcePath = publicSourcePath(ctx.argv.directory, file.data.filePath)
    if (!sourcePath) continue

    const outputPath = path.join(assetRoot, relativeAssetPath)

    const source = await fs.readFile(sourcePath)
    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, source)
    currentFiles.add(relativeAssetPath)
    emittedFiles.push(outputPath)
  }

  await removeStaleAssets(assetRoot, previousFiles, currentFiles)
  await fs.mkdir(assetRoot, { recursive: true })
  const manifest = `${JSON.stringify({ files: [...currentFiles].sort() }, null, 2)}\n`
  const outputManifestPath = manifestPath(assetRoot)
  await fs.writeFile(outputManifestPath, manifest, "utf8")
  emittedFiles.push(outputManifestPath)

  return emittedFiles
}

export function MarkdownActionsEmitter() {
  return {
    name: "MarkdownActions",
    emit: emitMarkdownSources,
    partialEmit: emitMarkdownSources,
  }
}

MarkdownActionsEmitter.quartzCategory = "emitter"

export default MarkdownActionsEmitter
