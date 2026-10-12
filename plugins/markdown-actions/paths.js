import { realpathSync, statSync } from "node:fs"
import path from "node:path"

/** Split a Quartz slug into path segments, rejecting anything that could leave its folder. */
export function safeSlugSegments(slug) {
  if (typeof slug !== "string" || slug.length === 0 || slug.includes("\\") || slug.includes("\0")) {
    return null
  }

  const segments = slug.split("/")
  return segments.some((segment) => segment.length === 0 || segment === "." || segment === "..")
    ? null
    : segments
}

export function isInside(root, candidate) {
  const relative = path.relative(root, candidate)
  return (
    relative === "" ||
    (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))
  )
}

/**
 * The real path of a published Markdown source, or null when the page has none
 * (virtual pages) or it resolves outside the content directory (e.g. via a symlink).
 */
export function publicSourcePath(contentRoot, filePath) {
  if (typeof filePath !== "string" || path.extname(filePath).toLowerCase() !== ".md") return null

  try {
    const realRoot = realpathSync(path.resolve(contentRoot))
    const realSource = realpathSync(path.resolve(filePath))
    return isInside(realRoot, realSource) && statSync(realSource).isFile() ? realSource : null
  } catch {
    return null
  }
}
