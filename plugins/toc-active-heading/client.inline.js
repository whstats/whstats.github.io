;(() => {
  const tocLinkSelector = "ul.toc-content a[data-for]"
  const headingSelector = [1, 2, 3, 4, 5, 6]
    .map((level) => `.center > article h${level}[id]`)
    .join(",")
  let animationFrame = 0

  const updateCurrentHeading = () => {
    animationFrame = 0

    const links = Array.from(document.querySelectorAll(tocLinkSelector))
    const linkedIds = new Set(links.map((link) => link.dataset.for).filter(Boolean))
    const headings = Array.from(document.querySelectorAll(headingSelector)).filter((heading) =>
      linkedIds.has(heading.id),
    )

    if (links.length === 0 || headings.length === 0) return

    const scrollPadding = Number.parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    )
    const readingLine = Number.isFinite(scrollPadding) ? scrollPadding : 0
    const pageBottom = Math.ceil(window.scrollY + window.innerHeight)
    const atPageEnd = pageBottom >= document.documentElement.scrollHeight - 1
    let current = headings[0]

    if (atPageEnd) {
      current = headings[headings.length - 1]
    } else {
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > readingLine + 1) break
        current = heading
      }
    }

    for (const link of links) {
      const isCurrent = link.dataset.for === current.id
      link.classList.toggle("toc-current", isCurrent)
      if (isCurrent) link.setAttribute("aria-current", "location")
      else link.removeAttribute("aria-current")
    }
  }

  const scheduleUpdate = () => {
    if (animationFrame !== 0) return
    animationFrame = window.requestAnimationFrame(updateCurrentHeading)
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true })
  window.addEventListener("resize", scheduleUpdate)
  document.addEventListener("nav", scheduleUpdate)
  document.addEventListener("render", scheduleUpdate)
  scheduleUpdate()
})()
