;(() => {
  const prefersReducedMotion = () =>
    document.documentElement.hasAttribute("data-reduce-motion") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const initializeReadingAids = () => {
    const cleanup = []
    const listen = (target, type, handler, options) => {
      target.addEventListener(type, handler, options)
      cleanup.push(() => target.removeEventListener(type, handler, options))
    }

    const topButton = document.querySelector(".reading-aids__top")
    if (topButton) {
      const update = () => {
        const hidden = window.scrollY < window.innerHeight * 1.5
        if (topButton.hidden !== hidden) topButton.hidden = hidden
      }
      listen(window, "scroll", update, { passive: true })
      listen(topButton, "click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })
      })
      update()
    }

    const contents = document.querySelector(".reading-aids__contents")
    if (contents) {
      listen(contents, "click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) contents.open = false
      })
    }

    window.addCleanup?.(() => cleanup.forEach((remove) => remove()))
  }

  document.addEventListener("nav", initializeReadingAids)
})()
