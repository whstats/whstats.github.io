# Notes on Statistics

A small public notebook for advanced statistics, built with [Quartz 5](https://quartz.jzhao.xyz/).

## Local development

Requirements:

- Node.js 22 or later
- npm 10.9.2 or later
- Git

Install dependencies and Quartz plugins:

```bash
npm ci
npx quartz plugin install --from-config
```

Start the local site:

```bash
npx quartz build --serve
```

The site is available at [http://localhost:8080](http://localhost:8080).

## Content

- `content/index.md` — home page
- `content/topics/` — published statistics notes
- `content/reference/` — shared notation and conventions
- `content/templates/` — unpublished authoring templates

Copy `content/templates/statistics-note.md` when starting a new note. The template is excluded from the generated site.

Math can use either delimiter style:

- Inline: `$x+y$` or `\(x+y\)`
- Display: `$$` fences on separate lines, or `\[x+y\]`

Copying a rendered formula places its original TeX source on the clipboard,
using `\(...\)` for inline mathematics and `\[...\]` for display mathematics.

The interface follows Quartz's native three-column documentation layout. The
right rail contains the table of contents and the incoming/outgoing **Related
Notes** lists. **Reader mode** is available in the left toolbar and keeps the
article measure stable while the sidebars are visually hidden. **Reading
settings** in the same toolbar persist body size, mathematics scale, reading
width, line spacing, and motion preferences in the current browser. The
**Markdown** menu on published notes can copy or download the exact source file,
including frontmatter.

## Checks

```bash
npm run check
npm test
npx quartz build
```

## Deployment

Pushes to `main` are built and published automatically with GitHub Pages.
The public site is available at [https://whstats.github.io](https://whstats.github.io).
