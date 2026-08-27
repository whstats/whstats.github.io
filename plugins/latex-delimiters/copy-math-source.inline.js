;(() => {
  const selector = "[data-math-tex]"
  const marker = "data-math-copy-ready"

  if (document.documentElement.hasAttribute(marker)) return
  document.documentElement.setAttribute(marker, "true")

  const sourceContainer = (node) => {
    const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement
    return element?.closest?.(selector) ?? null
  }

  const latexFor = (element) => {
    const source = (element.getAttribute("data-math-tex") ?? "").trim()
    return element.getAttribute("data-math-display") === "true"
      ? `\\[\n${source}\n\\]`
      : `\\(${source}\\)`
  }

  const replaceMath = (fragment) => {
    const formulas = [...fragment.querySelectorAll(selector)]
    for (const formula of formulas) formula.replaceWith(document.createTextNode(latexFor(formula)))
  }

  document.addEventListener(
    "copy",
    (event) => {
      const selection = window.getSelection()
      if (
        !event.clipboardData ||
        !selection ||
        selection.isCollapsed ||
        selection.rangeCount === 0
      ) {
        return
      }

      const range = selection.getRangeAt(0).cloneRange()
      const startFormula = sourceContainer(range.startContainer)
      const endFormula = sourceContainer(range.endContainer)
      if (startFormula) range.setStartBefore(startFormula)
      if (endFormula) range.setEndAfter(endFormula)

      const fragment = range.cloneContents()
      if (!fragment.querySelector(selector)) return

      replaceMath(fragment)
      const container = document.createElement("div")
      container.append(fragment.cloneNode(true))

      event.clipboardData.setData("text/plain", fragment.textContent ?? "")
      event.clipboardData.setData("text/html", container.innerHTML)
      event.preventDefault()
      event.stopImmediatePropagation()
    },
    true,
  )
})()
