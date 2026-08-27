import assert from "node:assert/strict"
import test from "node:test"
import { Latex } from "@quartz-community/latex"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import { formatMathSource, LatexDelimiters, preserveMathSource } from "./index.js"

function addPluggables(processor, pluggables) {
  for (const pluggable of pluggables) {
    if (Array.isArray(pluggable)) {
      processor.use(pluggable[0], pluggable[1])
    } else {
      processor.use(pluggable)
    }
  }
  return processor
}

function markdownProcessor() {
  const processor = unified().use(remarkParse)
  addPluggables(processor, LatexDelimiters().markdownPlugins())
  addPluggables(processor, Latex({ renderEngine: "katex" }).markdownPlugins())
  return processor
}

async function parseMarkdown(source) {
  const processor = markdownProcessor()
  return processor.run(processor.parse(source))
}

function descendants(node) {
  const result = [node]
  for (const child of node.children ?? []) result.push(...descendants(child))
  return result
}

test("parses LaTeX-style inline and display delimiters", async () => {
  const tree = await parseMarkdown("Inline \\(x+y\\).\n\n\\[x+y\\]")
  const math = descendants(tree).filter((node) => node.type === "inlineMath")

  assert.equal(math.length, 2)
  assert.equal(math[0].value, "x+y")
  assert.deepEqual(math[0].data.hProperties.className, ["language-math", "math-inline"])
  assert.equal(math[1].value, "x+y")
  assert.deepEqual(math[1].data.hProperties.className, ["language-math", "math-display"])
})

test("supports multiline display math and TeX commands", async () => {
  const tree = await parseMarkdown("\\[\n  \\frac{x_1}{2} + y\n\\]")
  const math = descendants(tree).filter((node) => node.type === "inlineMath")

  assert.equal(math.length, 1)
  assert.match(math[0].value, /\\frac\{x_1\}\{2\} \+ y/)
  assert.deepEqual(math[0].data.hProperties.className, ["language-math", "math-display"])
})

test("leaves delimiters literal in inline and block code", async () => {
  const source = [
    "`\\(inline code\\)`",
    "",
    "```text",
    "\\[block code\\]",
    "```",
    "",
    "    \\(indented code\\)",
  ].join("\n")
  const tree = await parseMarkdown(source)
  const nodes = descendants(tree)

  assert.equal(nodes.filter((node) => node.type === "inlineMath").length, 0)
  assert.equal(nodes.find((node) => node.type === "inlineCode").value, "\\(inline code\\)")
  assert.equal(nodes.filter((node) => node.type === "code").length, 2)
  assert.equal(nodes.filter((node) => node.type === "code")[0].value, "\\[block code\\]")
  assert.equal(nodes.filter((node) => node.type === "code")[1].value, "\\(indented code\\)")
})

test("does not reinterpret escaped backslashes and keeps dollar delimiters working", async () => {
  const tree = await parseMarkdown(String.raw`Escaped \\(not math\\); existing $x+y$ and $$z$$.`)
  const math = descendants(tree).filter(
    (node) => node.type === "inlineMath" || node.type === "math",
  )

  assert.equal(math.length, 2)
  assert.deepEqual(
    math.map((node) => node.value),
    ["x+y", "z"],
  )
})

test("keeps same-line display math inside blockquotes and lists", async () => {
  const tree = await parseMarkdown("> \\[x+y\\]\n\n- \\[z^2\\]")
  const [blockquote, list] = tree.children
  const quotedMath = descendants(blockquote).find((node) => node.type === "inlineMath")
  const listedMath = descendants(list).find((node) => node.type === "inlineMath")

  assert.deepEqual(quotedMath.data.hProperties.className, ["language-math", "math-display"])
  assert.deepEqual(listedMath.data.hProperties.className, ["language-math", "math-display"])
})

test("renders bracket delimiters through KaTeX in display mode", async () => {
  const processor = markdownProcessor().use(remarkRehype, { allowDangerousHtml: true })
  addPluggables(processor, LatexDelimiters().htmlPlugins())
  addPluggables(processor, Latex({ renderEngine: "katex" }).htmlPlugins())
  const tree = await processor.run(processor.parse("\\[x+y\\]"))
  const katexDisplay = descendants(tree).find(
    (node) =>
      node.type === "element" &&
      Array.isArray(node.properties?.className) &&
      node.properties.className.includes("katex-display"),
  )

  assert.ok(katexDisplay)
})

test("preserves TeX source around inline and display render targets", () => {
  const inline = {
    type: "element",
    tagName: "code",
    properties: { className: ["language-math", "math-inline"] },
    children: [{ type: "text", value: String.raw`e^{i\pi}+1=0` }],
  }
  const display = {
    type: "element",
    tagName: "pre",
    properties: {},
    children: [
      {
        type: "element",
        tagName: "code",
        properties: { className: ["language-math", "math-display"] },
        children: [{ type: "text", value: String.raw`\frac{x}{y}` }],
      },
    ],
  }
  const tree = {
    type: "root",
    children: [{ type: "element", tagName: "p", properties: {}, children: [inline] }, display],
  }

  preserveMathSource(tree)

  const inlineWrapper = tree.children[0].children[0]
  const displayWrapper = tree.children[1]
  assert.deepEqual(inlineWrapper.properties, {
    className: ["math-source"],
    "data-math-tex": String.raw`e^{i\pi}+1=0`,
    "data-math-display": "false",
  })
  assert.deepEqual(displayWrapper.properties, {
    className: ["math-source"],
    "data-math-tex": String.raw`\frac{x}{y}`,
    "data-math-display": "true",
  })
  assert.equal(displayWrapper.children[0], display)
})

test("formats copied formulas with LaTeX delimiters", () => {
  assert.equal(formatMathSource(String.raw` e^{i\pi}+1=0. `, false), String.raw`\(e^{i\pi}+1=0.\)`)
  assert.equal(formatMathSource(String.raw` \frac{x}{y} `, true), "\\[\n\\frac{x}{y}\n\\]")
})

test("ships a local capture-phase formula copy handler", () => {
  const resources = LatexDelimiters().externalResources()
  assert.equal(resources.js.length, 1)
  assert.equal(resources.js[0].contentType, "inline")
  assert.match(resources.js[0].script, /data-math-tex/)
  assert.match(resources.js[0].script, /stopImmediatePropagation/)
  assert.deepEqual(resources.css, [{ content: ".math-source{display:contents}", inline: true }])
})
