function setStatus(root, message, kind = "success") {
  const status = root.querySelector(".markdown-actions-status")
  if (!status) return
  status.textContent = message
  status.dataset.kind = kind
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.inset = "-100vh auto auto -100vw"
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand("copy")
  textarea.remove()
  if (!copied) throw new Error("The browser did not grant clipboard access.")
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // The Clipboard API can be unavailable on non-secure static hosts.
    }
  }
  fallbackCopy(text)
}

function menuItems(root) {
  return Array.from(root.querySelectorAll('[role="menuitem"]'))
}

function initializeMarkdownActions() {
  for (const root of document.querySelectorAll("details.markdown-actions")) {
    if (root.dataset.markdownInitialized === "true") continue
    root.dataset.markdownInitialized = "true"

    const trigger = root.querySelector("summary")
    const copyButton = root.querySelector('[data-markdown-action="copy"]')
    const downloadLink = root.querySelector('[data-markdown-action="download"]')
    const sourceUrl = root.dataset.markdownSource
    const cleanup = []

    const listen = (target, event, handler) => {
      target?.addEventListener(event, handler)
      cleanup.push(() => target?.removeEventListener(event, handler))
    }

    const close = () => {
      root.open = false
      trigger?.focus()
    }

    const onDocumentClick = (event) => {
      if (root.open && !root.contains(event.target)) root.open = false
    }

    const onKeydown = (event) => {
      if (!root.open) return
      if (event.key === "Escape") {
        event.preventDefault()
        close()
        return
      }

      const items = menuItems(root)
      const currentIndex = items.indexOf(document.activeElement)
      let nextIndex = null
      if (event.key === "ArrowDown")
        nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length
      if (event.key === "ArrowUp")
        nextIndex =
          currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length
      if (event.key === "Home") nextIndex = 0
      if (event.key === "End") nextIndex = items.length - 1
      if (nextIndex !== null) {
        event.preventDefault()
        items[nextIndex]?.focus()
      }
    }

    const onCopy = async () => {
      if (!sourceUrl || !copyButton) return
      copyButton.disabled = true
      copyButton.setAttribute("aria-busy", "true")
      setStatus(root, "Reading Markdown…", "pending")

      try {
        const response = await fetch(sourceUrl, {
          cache: "no-store",
          credentials: "same-origin",
          headers: { Accept: "text/markdown, text/plain;q=0.9" },
        })
        if (!response.ok) throw new Error(`Markdown request failed with status ${response.status}.`)
        await copyText(await response.text())
        setStatus(root, "Copied to clipboard.")
      } catch {
        setStatus(root, "Could not copy Markdown. Try Download .md instead.", "error")
      } finally {
        copyButton.disabled = false
        copyButton.removeAttribute("aria-busy")
      }
    }

    const onDownload = () => {
      setStatus(root, "Markdown download started.")
      window.setTimeout(() => {
        root.open = false
      }, 120)
    }

    const onToggle = () => {
      if (!root.open) setStatus(root, "", "success")
    }

    listen(document, "click", onDocumentClick)
    listen(root, "keydown", onKeydown)
    listen(root, "toggle", onToggle)
    listen(copyButton, "click", onCopy)
    listen(downloadLink, "click", onDownload)

    window.addCleanup?.(() => {
      cleanup.forEach((remove) => remove())
      delete root.dataset.markdownInitialized
    })
  }
}

document.addEventListener("nav", initializeMarkdownActions)
document.addEventListener("render", initializeMarkdownActions)
