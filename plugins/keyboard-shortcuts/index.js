import { readFileSync } from "node:fs"

export function KeyboardShortcuts() {
  return {
    name: "KeyboardShortcuts",
    markdownPlugins() {
      return []
    },
    externalResources() {
      const clientScript = readFileSync(new URL("./client.inline.js", import.meta.url), "utf8")
      const bookmarkCss = readFileSync(new URL("./styles.css", import.meta.url), "utf8")

      return {
        css: [{ content: bookmarkCss, inline: true }],
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

export default KeyboardShortcuts
