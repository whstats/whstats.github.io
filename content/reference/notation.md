---
title: Notation
description: Probability, empirical-process, norm, and convergence notation used across the notes.
tags:
  - reference
---

## Probability

For a random variable \(X\),

\[
\mathbb{E}X
\quad\text{and}\quad
\mathbb{P}(A)
\]

denote expectation and the probability of an event $A$. The variance is

$$
\operatorname{Var}(X)
=
\mathbb{E}\left[(X-\mathbb{E}X)^2\right].
$$

Independent copies are usually marked with a prime, such as $Z_i'$. Independent Rademacher signs $\varepsilon_i$ satisfy

$$
\mathbb{P}(\varepsilon_i=1)
=
\mathbb{P}(\varepsilon_i=-1)
=
\frac12.
$$

## Empirical averages

For observations $Z_1,\ldots,Z_n$ and a measurable function $f$,

$$
P_n f
=
\frac1n\sum_{i=1}^n f(Z_i),
\qquad
P f
=
\mathbb{E}f(Z).
$$

Thus $(P_n-P)f$ is the empirical fluctuation of $f$.

## Norms and comparison

The symbol $\lVert x\rVert_2$ denotes the Euclidean norm. For random variables, $\lVert X\rVert_{\psi_2}$ denotes a sub-Gaussian Orlicz norm; its numerical value depends on the normalization convention.

We write $a_n\lesssim b_n$ when $a_n\leq Cb_n$ for a universal constant $C>0$ that does not depend on $n$.

## Convergence

- $X_n\to_p X$: convergence in probability.
- $X_n\Rightarrow X$: convergence in distribution.
- $X_n=o_p(1)$: convergence to zero in probability.
- $X_n=O_p(1)$: boundedness in probability.

The notation $N(\mu,\Sigma)$ denotes a normal distribution with mean $\mu$ and covariance matrix $\Sigma$.
