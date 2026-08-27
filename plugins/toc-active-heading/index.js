import { readFileSync } from "node:fs"

const clientScript = readFileSync(new URL("./client.inline.js", import.meta.url), "utf8")

export function TocActiveHeading() {
  return {
    name: "TocActiveHeading",
    markdownPlugins() {
      return []
    },
    externalResources() {
      return {
        js: [
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: clientScript,
          },
        ],
      }
    },
  }
}

export default TocActiveHeading
