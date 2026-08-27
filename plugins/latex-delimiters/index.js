import { readFileSync } from "node:fs"

/**
 * Native micromark syntax for LaTeX-style math delimiters.
 *
 * This deliberately extends Markdown parsing instead of rewriting source text.
 * As a result, Markdown constructs that own their contents (notably code spans
 * and fenced/indented code blocks) keep literal `\\(` and `\\[` sequences.
 */

const copyMathSourceScript = readFileSync(
  new URL("./copy-math-source.inline.js", import.meta.url),
  "utf8",
)

const backslash = 92
const leftParenthesis = 40
const rightParenthesis = 41
const leftSquareBracket = 91
const rightSquareBracket = 93
const space = 32

const inlineToken = "latexInlineMath"
const inlineSequence = "latexInlineMathSequence"
const inlineData = "latexInlineMathData"
const displayToken = "latexDisplayMath"
const displaySequence = "latexDisplayMathSequence"
const displayData = "latexDisplayMathData"

function isLineEnding(code) {
  return code !== null && code < -2
}

/**
 * Create a text-level micromark construct for a two-character opening and
 * closing delimiter. Both constructs are tried before Markdown's normal
 * character-escape construct for a backslash.
 */
function createDelimitedMath({ openingCode, closingCode, tokenType, sequenceType, dataType }) {
  return {
    name: tokenType,
    tokenize(effects, ok, nok) {
      let potentialClose

      return start

      function start(code) {
        if (code !== backslash) return nok(code)

        effects.enter(tokenType)
        effects.enter(sequenceType)
        effects.consume(code)
        return openingMarker
      }

      function openingMarker(code) {
        if (code !== openingCode) return nok(code)

        effects.consume(code)
        effects.exit(sequenceType)
        return between
      }

      function between(code) {
        if (code === null) return nok(code)

        if (code === backslash) {
          potentialClose = effects.enter(sequenceType)
          effects.consume(code)
          return closingMarker
        }

        if (code === space) {
          effects.enter("space")
          effects.consume(code)
          effects.exit("space")
          return between
        }

        if (isLineEnding(code)) {
          effects.enter("lineEnding")
          effects.consume(code)
          effects.exit("lineEnding")
          return between
        }

        effects.enter(dataType)
        return data(code)
      }

      function data(code) {
        if (code === null || code === backslash || code === space || isLineEnding(code)) {
          effects.exit(dataType)
          return between(code)
        }

        effects.consume(code)
        return data
      }

      function closingMarker(code) {
        if (code === closingCode) {
          effects.consume(code)
          effects.exit(sequenceType)
          effects.exit(tokenType)
          return ok
        }

        // A normal TeX command such as `\\frac` started with the same
        // backslash as a closing delimiter. Reclassify it as math data.
        potentialClose.type = dataType
        return data(code)
      }
    },
    resolve(events) {
      return resolveDelimitedMath(events, dataType)
    },
    previous(code) {
      const previousEvent = this.events[this.events.length - 1]
      return code !== backslash || previousEvent?.[1].type === "characterEscape"
    },
  }
}

/**
 * Normalize whitespace events the same way remark-math normalizes `$...$`.
 * This ensures the from-Markdown data handler receives spaces and soft line
 * endings as part of the formula value, but not the delimiter sequences.
 */
function resolveDelimitedMath(events, dataType) {
  let tailExitIndex = events.length - 4
  let headEnterIndex = 3
  let index
  let enterIndex

  const headType = events[headEnterIndex]?.[1].type
  const tailType = events[tailExitIndex]?.[1].type
  if (
    (headType === "lineEnding" || headType === "space") &&
    (tailType === "lineEnding" || tailType === "space")
  ) {
    index = headEnterIndex
    while (++index < tailExitIndex) {
      if (events[index][1].type === dataType) {
        events[tailExitIndex][1].type = `${dataType}Padding`
        events[headEnterIndex][1].type = `${dataType}Padding`
        headEnterIndex += 2
        tailExitIndex -= 2
        break
      }
    }
  }

  index = headEnterIndex - 1
  tailExitIndex++
  while (++index <= tailExitIndex) {
    if (enterIndex === undefined) {
      if (index !== tailExitIndex && events[index][1].type !== "lineEnding") {
        enterIndex = index
      }
    } else if (index === tailExitIndex || events[index][1].type === "lineEnding") {
      events[enterIndex][1].type = dataType
      if (index !== enterIndex + 2) {
        events[enterIndex][1].end = events[index - 1][1].end
        events.splice(enterIndex + 2, index - enterIndex - 2)
        tailExitIndex -= index - enterIndex - 2
        index = enterIndex + 2
      }
      enterIndex = undefined
    }
  }

  return events
}

const displayMath = createDelimitedMath({
  openingCode: leftSquareBracket,
  closingCode: rightSquareBracket,
  tokenType: displayToken,
  sequenceType: displaySequence,
  dataType: displayData,
})

const inlineMath = createDelimitedMath({
  openingCode: leftParenthesis,
  closingCode: rightParenthesis,
  tokenType: inlineToken,
  sequenceType: inlineSequence,
  dataType: inlineData,
})

function enterMath(token, display) {
  this.enter(
    {
      type: "inlineMath",
      value: "",
      data: {
        hName: "code",
        hProperties: {
          className: ["language-math", display ? "math-display" : "math-inline"],
        },
        hChildren: [],
      },
    },
    token,
  )
  this.buffer()
}

function enterInlineMath(token) {
  enterMath.call(this, token, false)
}

function enterDisplayMath(token) {
  enterMath.call(this, token, true)
}

function exitMath(token) {
  const value = this.resume()
  const node = this.stack[this.stack.length - 1]
  this.exit(token)
  node.value = value
  node.data.hChildren.push({ type: "text", value })
}

function exitMathData(token) {
  this.config.enter.data.call(this, token)
  this.config.exit.data.call(this, token)
}

function latexDelimiterFromMarkdown() {
  return {
    enter: {
      [inlineToken]: enterInlineMath,
      [displayToken]: enterDisplayMath,
    },
    exit: {
      [inlineToken]: exitMath,
      [displayToken]: exitMath,
      [inlineData]: exitMathData,
      [displayData]: exitMathData,
    },
  }
}

function remarkLatexDelimiters() {
  const data = this.data()
  const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = [])
  const fromMarkdownExtensions = data.fromMarkdownExtensions || (data.fromMarkdownExtensions = [])

  micromarkExtensions.push({
    text: {
      [backslash]: [displayMath, inlineMath],
    },
  })
  fromMarkdownExtensions.push(latexDelimiterFromMarkdown())
}

function classNames(node) {
  return Array.isArray(node?.properties?.className) ? node.properties.className : []
}

function isMathElement(node) {
  const classes = classNames(node)
  return (
    node?.type === "element" &&
    (classes.includes("language-math") ||
      classes.includes("math-inline") ||
      classes.includes("math-display"))
  )
}

function textValue(node) {
  if (node?.type === "text") return node.value
  return (node?.children ?? []).map(textValue).join("")
}

export function formatMathSource(source, display) {
  const tex = String(source).trim()
  return display ? `\\[\n${tex}\n\\]` : `\\(${tex}\\)`
}

function sourceWrapper(node, source, display) {
  return {
    type: "element",
    tagName: "span",
    properties: {
      className: ["math-source"],
      "data-math-tex": source,
      "data-math-display": display ? "true" : "false",
    },
    children: [node],
  }
}

export function preserveMathSource(parent) {
  if (!Array.isArray(parent?.children)) return

  for (let index = 0; index < parent.children.length; index++) {
    const child = parent.children[index]
    if (child?.type !== "element") continue

    if (child.tagName === "pre") {
      const code = child.children?.find(
        (candidate) => candidate?.type === "element" && candidate.tagName === "code",
      )
      if (isMathElement(code)) {
        parent.children[index] = sourceWrapper(child, textValue(code), true)
        continue
      }
    }

    if (isMathElement(child)) {
      parent.children[index] = sourceWrapper(
        child,
        textValue(child),
        classNames(child).includes("math-display"),
      )
      continue
    }

    preserveMathSource(child)
  }
}

function rehypePreserveMathSource() {
  return preserveMathSource
}

export function LatexDelimiters() {
  return {
    name: "LatexDelimiters",
    markdownPlugins() {
      return [remarkLatexDelimiters]
    },
    htmlPlugins() {
      return [rehypePreserveMathSource]
    },
    externalResources() {
      return {
        css: [{ content: ".math-source{display:contents}", inline: true }],
        js: [
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: copyMathSourceScript,
          },
        ],
        additionalHead: [],
      }
    },
  }
}

export default LatexDelimiters
