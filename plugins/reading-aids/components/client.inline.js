;(() => {
  const prefersReducedMotion = () =>
    document.documentElement.hasAttribute("data-reduce-motion") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // Remembers the last section read on each page so a returning reader can pick up there.
  const positionsKey = "notes-reading-positions"
  const maxSavedPages = 50
  const minimumProgress = 0.15
  const finishedProgress = 0.95
  const saveDelay = 400
  const headingSelector = ".center > article h2[id], .center > article h3[id]"

  const readPositions = () => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(positionsKey) ?? "{}")
      return parsed && typeof parsed === "object" ? parsed : {}
    } catch {
      return {}
    }
  }

  const updatePosition = (slug, position) => {
    const positions = readPositions()
    if (position) positions[slug] = position
    else delete positions[slug]
    const recent = Object.entries(positions)
      .sort(([, left], [, right]) => right.savedAt - left.savedAt)
      .slice(0, maxSavedPages)
    try {
      window.localStorage.setItem(positionsKey, JSON.stringify(Object.fromEntries(recent)))
    } catch {}
  }

  const scrollProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    return scrollable > 0 ? window.scrollY / scrollable : 1
  }

  const currentHeading = (headings) => {
    const readingLine = window.innerHeight * 0.25
    let current = null
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top > readingLine) break
      current = heading
    }
    return current
  }

  // Copies the rendered heading (including any math) without its permalink icon.
  const headingContent = (heading) =>
    Array.from(heading.cloneNode(true).childNodes).filter(
      (node) => !(node instanceof Element && node.matches('a[role="anchor"]')),
    )

  const initializeResume = (listen, cleanup) => {
    const resume = document.querySelector(".reading-aids__resume")
    const slug = document.body.dataset.slug
    if (!resume || !slug) return

    const link = resume.querySelector(".reading-aids__resume-link")
    const saved = readPositions()[slug]
    const target = saved && document.getElementById(saved.id)
    if (target && !window.location.hash && window.scrollY < window.innerHeight) {
      resume
        .querySelector(".reading-aids__resume-heading")
        .replaceChildren(...headingContent(target))
      link.href = `#${target.id}`
      resume.hidden = false
    }

    const headings = Array.from(document.querySelectorAll(headingSelector))
    let saveTimer = 0
    const save = () => {
      saveTimer = 0
      const progress = scrollProgress()
      if (progress >= finishedProgress) {
        updatePosition(slug, null)
        return
      }
      if (progress < minimumProgress) return
      const heading = currentHeading(headings)
      if (heading) updatePosition(slug, { id: heading.id, savedAt: Date.now() })
    }

    listen(
      window,
      "scroll",
      () => {
        window.clearTimeout(saveTimer)
        saveTimer = window.setTimeout(save, saveDelay)
      },
      { passive: true },
    )
    cleanup.push(() => window.clearTimeout(saveTimer))
    listen(link, "click", () => {
      resume.hidden = true
    })
    listen(resume.querySelector(".reading-aids__resume-dismiss"), "click", () => {
      resume.hidden = true
      updatePosition(slug, null)
    })
  }

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

    initializeResume(listen, cleanup)

    window.addCleanup?.(() => cleanup.forEach((remove) => remove()))
  }

  document.addEventListener("nav", initializeReadingAids)
})()
