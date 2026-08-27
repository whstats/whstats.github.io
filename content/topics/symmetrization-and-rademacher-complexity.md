---
title: Symmetrization & Rademacher Complexity
description: How ghost samples and random signs convert uniform generalization error into a complexity that can be bounded.
tags:
  - empirical-processes
  - learning-theory
  - statistics
---

## Core Insight

Uniform deviations are hard because the same sample is used both to choose a function and to evaluate it. Symmetrization introduces an independent **ghost sample**, replaces the unknown population mean by a second empirical mean, and then uses random signs to expose the size of the function class.

The result is a clean principle: expected uniform error is at most twice the Rademacher complexity, and uniform boundedness turns this expectation bound into a high-probability bound.

## Logic Map

$$
\text{population mean}
\longrightarrow \text{ghost empirical mean}
\longrightarrow \text{Rademacher signs}
\longrightarrow \text{class complexity}
\longrightarrow \text{high-probability control}.
$$

1. Replace $Pf$ by the conditional expectation of an independent empirical mean.
2. Use Jensen's inequality to move that expectation outside the supremum.
3. Randomly swap each observation with its ghost copy; Rademacher signs encode these swaps without changing the distribution.
4. Split the signed difference into two signed empirical processes, producing the factor $2$.
5. Under a uniform bounded-range condition, apply bounded differences to concentrate around the expectation.

## Setup

Let $X_1,\ldots,X_n\overset{\mathrm{iid}}{\sim}P$, let $\mathcal F$ be a class of measurable, $P$-integrable real-valued functions, and write

$$
P_nf=\frac1n\sum_{i=1}^n f(X_i),
\qquad
Pf=\mathbb E[f(X)].
$$

Assume the relevant suprema are measurable. The uniform deviation is

$$
Z_{\mathcal F}=\sup_{f\in\mathcal F}|(P_n-P)f|.
$$

Let $\varepsilon_1,\ldots,\varepsilon_n$ be independent Rademacher signs, independent of the sample, with $\mathbb P(\varepsilon_i=1)=\mathbb P(\varepsilon_i=-1)=1/2$.

> [!definition] Absolute empirical Rademacher complexity
> This note uses the explicit absolute-value convention
>
> $$
> \widehat{\mathfrak R}^{\mathrm{abs}}_n(\mathcal F;X_{1:n})
> =\mathbb E_{\varepsilon}\!\left[
> \left.\sup_{f\in\mathcal F}
> \left|\frac1n\sum_{i=1}^n\varepsilon_i f(X_i)\right|
> \right|X_{1:n}\right].
> $$
>
> Its population version is
> $\mathfrak R^{\mathrm{abs}}_n(\mathcal F)
> =\mathbb E_X\widehat{\mathfrak R}^{\mathrm{abs}}_n(\mathcal F;X_{1:n})$.

A **ghost sample** $X_1',\ldots,X_n'$ is an independent copy of the original sample, with empirical measure $P_n'$.

## Main Result

> [!theorem] Symmetrization and bounded high-probability control
> For any class $\mathcal F$ as above,
>
> $$
> \mathbb E Z_{\mathcal F}
> \leq 2\mathfrak R^{\mathrm{abs}}_n(\mathcal F).
> $$
>
> If fixed constants $L<U$ satisfy $f(x)\in[L,U]$ for every $f\in\mathcal F$ and every $x$ in the support of $P$, then for every $\delta\in(0,1)$, with probability at least $1-\delta$,
>
> $$
> Z_{\mathcal F}
> \leq 2\mathfrak R^{\mathrm{abs}}_n(\mathcal F)
> +(U-L)\sqrt{\frac{\log(1/\delta)}{2n}}.
> $$

The first statement is an expectation comparison. The second needs the additional bounded-range condition; it does not follow from symmetrization alone.

## Proof Sketch

Because $Pf=\mathbb E[P_n'f\mid X_{1:n}]$, conditional Jensen gives

$$
\mathbb E_X\sup_{f\in\mathcal F}|P_nf-Pf|
\leq
\mathbb E_{X,X'}\sup_{f\in\mathcal F}|P_nf-P_n'f|.
$$

For every coordinate, the pair $(X_i,X_i')$ has the same distribution after swapping its entries. Independent signs encode these swaps, so

$$
\mathbb E_{X,X'}\sup_f
\left|\frac1n\sum_i(f(X_i)-f(X_i'))\right|
=
\mathbb E_{X,X',\varepsilon}\sup_f
\left|\frac1n\sum_i\varepsilon_i(f(X_i)-f(X_i'))\right|.
$$

The triangle inequality bounds the last supremum by the sum of two absolute signed suprema. The original and ghost samples have the same law, so their expectations are equal, yielding $2\mathfrak R_n^{\mathrm{abs}}(\mathcal F)$.

Under $f\in[L,U]$, changing one observation can change $Z_{\mathcal F}$ by at most $(U-L)/n$. McDiarmid's inequality therefore gives

$$
\mathbb P\!\left(Z_{\mathcal F}\geq \mathbb EZ_{\mathcal F}+t\right)
\leq \exp\!\left(-\frac{2nt^2}{(U-L)^2}\right).
$$

Combining this with the expectation bound and choosing $t=(U-L)\sqrt{\log(1/\delta)/(2n)}$ proves the stated high-probability result.

## Example

Consider the linear class

$$
\mathcal F=\{x\mapsto \langle w,x\rangle:\|w\|_2\leq W\},
$$

and suppose $\|X\|_2\leq R$ almost surely. Conditional on the sample,

$$
\widehat{\mathfrak R}^{\mathrm{abs}}_n(\mathcal F;X_{1:n})
=\frac{W}{n}\mathbb E_\varepsilon
\left\|\sum_{i=1}^n\varepsilon_iX_i\right\|_2
\leq \frac{W}{n}\sqrt{\sum_{i=1}^n\|X_i\|_2^2}
\leq \frac{WR}{\sqrt n}.
$$

Because every $f(X)\in[-WR,WR]$, the theorem implies that, with probability at least $1-\delta$,

$$
\sup_{\|w\|_2\leq W}|(P_n-P)\langle w,\cdot\rangle|
\leq \frac{2WR}{\sqrt n}
+2WR\sqrt{\frac{\log(1/\delta)}{2n}}.
$$

The $n^{-1/2}$ rate comes from cancellation in the random signed sum; the geometry of the class enters through the dual-norm calculation.

## Connections

- [[sub-gaussian-tail-bounds|Sub-Gaussian Tail Bounds]] explains why random signed sums concentrate and how boundedness supplies sub-Gaussian behavior.
- [[m-estimation-consistency|M-Estimation Consistency]] uses bounds on $\sup_f|(P_n-P)f|$ to establish uniform convergence of empirical objectives.
- Covering numbers and contraction inequalities provide further ways to bound $\mathfrak R_n(\mathcal F)$ for structured classes.

## Pitfalls

- **Mixing conventions.** Some texts omit the absolute value in the definition. The two conventions agree for symmetric classes $\mathcal F=-\mathcal F$; otherwise use $\mathcal F\cup(-\mathcal F)$ or keep a one-sided statement.
- **Reusing the data as the ghost sample.** The ghost sample must be independent and identically distributed for the conditional-expectation step.
- **Losing the factor $2$.** It appears when the signed original-minus-ghost process is split into two processes.
- **Claiming high probability from expectation alone.** The displayed high-probability bound requires the uniform condition $f(x)\in[L,U]$. Unbounded classes need different concentration assumptions.
- **Confusing empirical and population complexity.** $\widehat{\mathfrak R}_n$ depends on the realized sample; $\mathfrak R_n$ averages over it.
