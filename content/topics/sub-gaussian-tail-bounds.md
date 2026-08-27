---
title: Sub-Gaussian Tail Bounds
description: A compact guide to moment-generating-function control, Chernoff bounds, and concentration for independent sums.
tags:
  - probability
  - concentration
  - high-dimensional-statistics
---

## Core Insight

A centered random variable is sub-Gaussian when its moment-generating function is no larger than that of a Gaussian at every scale. Through Chernoff's method, this comparison produces Gaussian-shaped tail decay: deviations of size $t$ cost roughly $e^{-t^2/(2\sigma^2)}$.

The parameter $\sigma^2$ is a **variance proxy**, not necessarily the actual variance. It controls concentration and, under the definition below, satisfies $\operatorname{Var}(X)\leq \sigma^2$.

## Logic Map

$$
\text{MGF control}
\longrightarrow \text{exponential Markov inequality}
\longrightarrow \text{optimize the tilt}
\longrightarrow \text{Gaussian tail bound}.
$$

1. Center the variable so the MGF measures fluctuations rather than its mean.
2. Exponentiate the bad event and apply Markov's inequality.
3. Balance the linear penalty $-\lambda t$ against the quadratic MGF cost $\sigma^2\lambda^2/2$.
4. Apply the same argument to $-X$, then use a union bound for a two-sided statement.

## Setup

> [!definition] Sub-Gaussian random variable
> For $\sigma>0$, a random variable $X$ with $\mathbb E X=0$ is **$\sigma^2$-sub-Gaussian** if, for every $\lambda\in\mathbb R$,
>
> $$
> \mathbb E e^{\lambda X}\leq \exp\!\left(\frac{\sigma^2\lambda^2}{2}\right).
> $$

For an uncentered variable $Y$, the intended condition is on $Y-\mathbb EY$. Writing the definition directly for $Y$ is generally false unless its mean is zero.

If independent centered variables $X_1,\ldots,X_n$ have variance proxies $\sigma_1^2,\ldots,\sigma_n^2$, then the weighted sum $S=\sum_{i=1}^n a_iX_i$ has variance proxy

$$
v^2=\sum_{i=1}^n a_i^2\sigma_i^2.
$$

This closure property is why the squared scale, rather than the scale itself, is the natural bookkeeping quantity.

## Main Result

> [!theorem] Sub-Gaussian concentration
> If $X$ is centered and $\sigma^2$-sub-Gaussian, then for every $t\geq 0$,
>
> $$
> \mathbb P(X\geq t)\leq e^{-t^2/(2\sigma^2)},
> \qquad
> \mathbb P(|X|\geq t)\leq 2e^{-t^2/(2\sigma^2)}.
> $$
>
> More generally, for independent centered $X_i$ as above,
>
> $$
> \mathbb P\!\left(\left|\sum_{i=1}^n a_iX_i\right|\geq t\right)
> \leq 2\exp\!\left(-\frac{t^2}{2\sum_{i=1}^n a_i^2\sigma_i^2}\right).
> $$

In particular, if the $X_i$ share proxy $\sigma^2$, then

$$
\mathbb P\!\left(\left|\frac1n\sum_{i=1}^n X_i\right|\geq t\right)
\leq 2\exp\!\left(-\frac{nt^2}{2\sigma^2}\right).
$$

## Proof Sketch

For any $\lambda>0$, exponential Markov inequality gives

$$
\mathbb P(X\geq t)
=\mathbb P(e^{\lambda X}\geq e^{\lambda t})
\leq e^{-\lambda t}\mathbb E e^{\lambda X}
\leq \exp\!\left(-\lambda t+\frac{\sigma^2\lambda^2}{2}\right).
$$

The exponent is minimized at $\lambda=t/\sigma^2$, producing $e^{-t^2/(2\sigma^2)}$. Since $-X$ has the same variance proxy, the lower-tail bound is identical; the union bound contributes the factor $2$ in the two-sided inequality.

For a weighted independent sum, factorization of the MGF yields

$$
\mathbb E e^{\lambda\sum_i a_iX_i}
=\prod_i \mathbb E e^{\lambda a_iX_i}
\leq \exp\!\left(\frac{\lambda^2}{2}\sum_i a_i^2\sigma_i^2\right),
$$

so the same argument applies with proxy $\sum_i a_i^2\sigma_i^2$.

## Example

If $X\sim N(0,\tau^2)$, then

$$
\mathbb E e^{\lambda X}=e^{\tau^2\lambda^2/2},
$$

so $X$ is $\tau^2$-sub-Gaussian with equality in the MGF comparison.

For a bounded variable $Y\in[a,b]$ almost surely, Hoeffding's lemma states

$$
\mathbb E e^{\lambda(Y-\mathbb EY)}
\leq \exp\!\left(\frac{\lambda^2(b-a)^2}{8}\right).
$$

Thus $Y-\mathbb EY$ has variance proxy $(b-a)^2/4$. For independent $Y_i\in[a,b]$,

$$
\mathbb P\!\left(\left|\frac1n\sum_{i=1}^n(Y_i-\mathbb EY_i)\right|\geq t\right)
\leq 2\exp\!\left(-\frac{2nt^2}{(b-a)^2}\right).
$$

## Connections

- [[symmetrization-and-rademacher-complexity|Symmetrization & Rademacher Complexity]] reduces uniform empirical deviations to random signed sums, whose behavior is driven by the same concentration ideas.
- [[m-estimation-consistency|M-Estimation Consistency]] often uses concentration to upgrade pointwise control of an objective into uniform control.
- [[the-delta-method|The Delta Method]] describes asymptotic transformations after an estimator's stochastic fluctuations have been controlled.

## Pitfalls

- **Forgetting centering.** Apply the definition and tail bound to $Y-\mathbb EY$, not automatically to $Y$.
- **Dropping the two-sided factor.** A one-sided tail has no leading $2$; bounding $|X|$ by two one-sided events introduces it.
- **Equating proxy and variance.** The proxy may be strictly larger than $\operatorname{Var}(X)$; it is an MGF-control parameter.
- **Ignoring independence.** The simple sum rule uses MGF factorization and therefore independence.
- **Mixing conventions.** Some authors call $\sigma$, rather than $\sigma^2$, the sub-Gaussian parameter. Always inspect the defining MGF inequality.
