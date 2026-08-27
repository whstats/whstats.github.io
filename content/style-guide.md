---
title: Style Guide
description: An authoring reference for typography, links, mathematics, callouts, code, tables, media, and metadata in notebook content files.
aliases:
  - Visual Style Guide
  - Component Showcase
tags:
  - style-guide
  - demonstration
  - mathematics
lang: en
---

This page shows the Markdown syntax and semantic blocks available to files under `content/`. Use it as an authoring reference for notes in Notes on Statistics.

## Heading hierarchy

The frontmatter title supplies the only level-one heading. Start body sections with level two and nest lower levels in order.

### Level three heading

Level three introduces a substantial subsection.

#### Level four heading

Level four groups details within a subsection.

##### Level five heading

Level five is useful for a compact local division.

###### Level six heading

Level six is the smallest heading in the hierarchy.

## Prose and emphasis

This is ordinary body text. It can include _italic emphasis_, **strong emphasis**, _**strong italic emphasis**_, ~~deleted text~~, and ==highlighted text==. Superscripts such as $n^2$ and subscripts such as $X_i$ are best written as mathematics when they carry mathematical meaning.

Use standard Markdown for an [external link to the Quartz documentation](https://quartz.jzhao.xyz/). Use wikilinks for a note such as [[topics/sub-gaussian-tail-bounds|Sub-Gaussian Tails]] or a generated page such as the [[topics|Topics index]]. A fragment link can point to [the wide-formula example](#deliberately-wide-formula) on the same page. Link labels should describe their destination.

## Monospace and code

Use inline monospace for short identifiers such as `sample_mean`, commands such as `npm run check`, and literal values such as `confidence = 0.95`.

An indented code block is also valid:

    estimate = sum(observations) / len(observations)

A fenced block with a language name adds syntax highlighting. Long lines scroll within the code block.

```python
from statistics import fmean


def centered_mean(observations: list[float], center: float = 0.0) -> float:
    """Return the sample mean after subtracting a fixed center."""
    return fmean(x - center for x in observations)


values = [1.2, 0.8, 1.1, 0.9]
print(centered_mean(values, center=1.0))
summary = {"estimator": "sample mean", "assumptions": ["independent", "identically distributed", "finite variance"], "variance": "sigma squared divided by n"}
```

## Lists and tasks

An unordered list can express parallel ideas:

- State the random object.
- Record the assumptions.
- Separate the deterministic and stochastic steps.
  - A nested item adds a local qualification.
  - A second nested item confirms the indentation style.

An ordered list is useful for a sequence:

1. Define the estimator.
2. Establish concentration or convergence.
3. Translate the bound into the quantity of interest.

A task list can track editorial work:

- [x] State the main result.
- [x] Check the notation.
- [ ] Add a second worked example.

## Quotation

> Mathematics is clearest when notation serves the argument rather than replacing it.
>
> A longer quotation may continue in a second paragraph and can contain **emphasis**, `inline code`, or a citation.[^quotation]

## Semantic callouts

Use callout types to state the role of a block. Add `+` after the type to make a callout collapsible and open by default. Use `-` when it should start collapsed.

> [!definition] Sample mean
> For observations $X_1,\ldots,X_n$, the **sample mean** is
>
> $$
> \overline X_n=\frac{1}{n}\sum_{i=1}^n X_i.
> $$

> [!theorem] Mean and variance of the sample mean
> Let $X_1,\ldots,X_n$ be independent and identically distributed random variables with $\mathbb E[X_i]=\mu$ and $\operatorname{Var}(X_i)=\sigma^2<\infty$. Then
>
> $$
> \mathbb E[\overline X_n]=\mu,
> \qquad
> \operatorname{Var}(\overline X_n)=\frac{\sigma^2}{n}.
> $$

> [!proof]+ Proof
> Linearity of expectation gives
> $\mathbb E[\overline X_n]=n^{-1}\sum_{i=1}^n\mathbb E[X_i]=\mu$.
> Independence makes the cross-covariances vanish, so
>
> $$
> \operatorname{Var}(\overline X_n)
> =\frac{1}{n^2}\sum_{i=1}^n\operatorname{Var}(X_i)
> =\frac{\sigma^2}{n}.
> $$

> [!example] Bernoulli observations
> If $X_i\sim\operatorname{Bernoulli}(p)$ independently, then $\overline X_n$ is the observed proportion of successes, with mean $p$ and variance $p(1-p)/n$.

> [!remark] Interpretation
> Averaging preserves the population mean while reducing variance at rate $n^{-1}$. The standard deviation therefore decreases at rate $n^{-1/2}$.

> [!warning] Independence matters
> Identical marginal distributions alone do not imply $\operatorname{Var}(\overline X_n)=\sigma^2/n$. Positive dependence can make the variance substantially larger because covariance terms remain.

## Mathematics

Both common delimiter styles are supported. Inline mathematics can use $\mathbb E[X]=\mu$ or \(\operatorname{Var}(X)=\sigma^2\). Display mathematics can use double dollar signs:

### Mathematics in a heading \(n^{-1/2}\)

Use mathematics in a heading only when the notation is part of its name. It inherits the heading's type scale.

$$
\frac{\overline X_n-\mu}{\sigma/\sqrt n}
\xrightarrow{d}\mathcal N(0,1),
$$

or bracket delimiters:

\[
e^{i\pi}+1=0.
\]

### Deliberately wide formula

The following identity is intentionally wider than a typical article column. Its horizontal scrollbar should stay inside the formula container without covering adjacent prose.

\[
\displaystyle \mathbb E\!\left[\left(\sum_{j=1}^{p}a_jX_j-\sum_{k=1}^{q}b_kY_k\right)^2\right]=\sum_{j=1}^{p}\sum_{\ell=1}^{p}a_ja_\ell\,\mathbb E[X_jX_\ell]-2\sum_{j=1}^{p}\sum_{k=1}^{q}a_jb_k\,\mathbb E[X_jY_k]+\sum_{k=1}^{q}\sum_{r=1}^{q}b_kb_r\,\mathbb E[Y_kY_r]=\sum_{j=1}^{p}\sum_{\ell=1}^{p}a_ja_\ell\,\operatorname{Cov}(X_j,X_\ell)-2\sum_{j=1}^{p}\sum_{k=1}^{q}a_jb_k\,\operatorname{Cov}(X_j,Y_k)+\sum_{k=1}^{q}\sum_{r=1}^{q}b_kb_r\,\operatorname{Cov}(Y_k,Y_r)+\left(\sum_{j=1}^{p}a_j\mathbb E[X_j]-\sum_{k=1}^{q}b_k\mathbb E[Y_k]\right)^2.
\]

## Table

| Object           |      Notation      |      Typical role |
| :--------------- | :----------------: | ----------------: |
| Population mean  | $\mu=\mathbb E[X]$ |            Target |
| Sample mean      |  $\overline X_n$   |         Estimator |
| Standard error   |  $\sigma/\sqrt n$  | Uncertainty scale |
| Confidence level |     $1-\alpha$     |   Coverage target |

## Media

The image below uses descriptive alternative text. It also demonstrates how a wide media asset scales to the article column.

<figure class="media-figure">
  <img src="/static/og-image.png" alt="Geometric line artwork used as the notebook's social preview image.">
  <figcaption>Figure 1. Geometric line artwork used as the notebook's social preview image.</figcaption>
</figure>

---

## Frontmatter and tags

This page uses a title, description, aliases, tags, and a language code in its YAML frontmatter. The source follows this pattern:

```yaml
---
title: Style Guide
description: A visual reference for the notebook.
aliases:
  - Visual Style Guide
tags:
  - style-guide
  - demonstration
  - mathematics
lang: en
---
```

The title and description supply page metadata. Tags connect the page to generated indexes, aliases provide alternative internal-link targets, and `lang` records the content language.

## Footnote references

A footnote keeps a qualification close to the text without interrupting the main argument.[^finite-variance] Multiple references can share the same compact visual treatment.[^quotation]

[^quotation]: This sentence is original and is included only to demonstrate a source-style note.

[^finite-variance]: Finite variance is sufficient for the variance calculation above; stronger tail assumptions are needed for sharper nonasymptotic concentration bounds.
