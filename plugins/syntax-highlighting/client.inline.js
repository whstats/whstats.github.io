const boundClipboardButtons = new WeakSet()

function clipboardSource(code) {
  if (!code.dataset.clipboard) return code.innerText.replace(/\n\n/g, "\n")

  try {
    return String(JSON.parse(code.dataset.clipboard)).replace(/\n\n/g, "\n")
  } catch {
    return code.innerText.replace(/\n\n/g, "\n")
  }
}

function setupClipboardButtons() {
  for (const button of document.querySelectorAll("pre > .clipboard-button")) {
    if (boundClipboardButtons.has(button)) continue

    const code = button.parentElement?.querySelector("code")
    if (!code) continue

    const source = clipboardSource(code)
    let resetTimer
    const reset = () => {
      button.classList.remove("is-copied")
      button.setAttribute("aria-label", "Copy source")
    }
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(source)
        button.blur()
        button.classList.add("is-copied")
        button.setAttribute("aria-label", "Copied")
        window.clearTimeout(resetTimer)
        resetTimer = window.setTimeout(reset, 2000)
      } catch (error) {
        console.error(error)
      }
    }

    button.addEventListener("click", copy)
    boundClipboardButtons.add(button)
    window.addCleanup(() => {
      window.clearTimeout(resetTimer)
      button.removeEventListener("click", copy)
      boundClipboardButtons.delete(button)
    })
  }
}

document.addEventListener("nav", setupClipboardButtons)
document.addEventListener("render", setupClipboardButtons)
