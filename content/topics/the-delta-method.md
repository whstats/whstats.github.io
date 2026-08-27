---
title: The Delta Method
description: How smooth transformations carry asymptotic distributions, including the vector form and the zero-derivative exception.
tags:
  - asymptotic-statistics
  - limit-theorems
  - inference
---

## Core Insight

The delta method transfers a limit theorem through a smooth map by replacing that map with its local linear approximation. For a vector parameter, the Jacobian transports both the limiting random vector and its covariance.

## Logic Map

1. **Start with a limit law:** $\sqrt n(\hat\theta_n-\theta)$ has a stable asymptotic distribution.
2. **Linearize the transformation:** differentiability gives $g(\theta+h)\approx g(\theta)+Dg(\theta)h$ for small $h$.
3. **Control the remainder:** root-$n$ consistency makes the Taylor remainder $o_p(n^{-1/2})$.
4. **Pass to the limit:** Slutsky's theorem leaves only the Jacobian applied to the original limit.

## Setup

Let $\hat\theta_n\in\mathbb R^k$ estimate $\theta\in\mathbb R^k$, and suppose

$$
\sqrt n(\hat\theta_n-\theta)\ \xrightarrow{d}\ Z.
$$

Let $g:\mathbb R^k\to\mathbb R^m$ be totally differentiable at $\theta$. Its Jacobian is the $m\times k$ matrix

$$
G=Dg(\theta),
\qquad
G_{ij}=\frac{\partial g_i}{\partial \theta_j}(\theta).
$$

Total differentiability means that, as $h\to0$,

$$
g(\theta+h)=g(\theta)+Gh+r(h),
\qquad
\frac{\lVert r(h)\rVert}{\lVert h\rVert}\to0.
$$

## Main Result

> [!theorem] Vector delta method
> Under the setup above,
>
> $$
> \sqrt n\bigl(g(\hat\theta_n)-g(\theta)\bigr)
> \xrightarrow{d}GZ.
> $$
>
> In particular, if $Z\sim N_k(0,\Sigma)$, then
>
> $$
> \sqrt n\bigl(g(\hat\theta_n)-g(\theta)\bigr)
> \xrightarrow{d}N_m\bigl(0,G\Sigma G^\top\bigr).
> $$

The same statement holds with any deterministic rate $a_n\to\infty$: if $a_n(\hat\theta_n-\theta)\xrightarrow{d}Z$, then $a_n(g(\hat\theta_n)-g(\theta))\xrightarrow{d}GZ$.

> [!warning] A zero Jacobian changes the useful scale
> If $G=0$, the first-order theorem only gives a degenerate limit at zero. For scalar $g$ that is twice continuously differentiable near $\theta$, with $\nabla g(\theta)=0$, the second-order expansion gives
>
> $$
> n\bigl(g(\hat\theta_n)-g(\theta)\bigr)
> \xrightarrow{d}\frac12 Z^\top \nabla^2g(\theta)Z.
> $$
>
> This is generally a quadratic-form distribution, not a normal distribution.

## Proof Sketch

Write $h_n=\hat\theta_n-\theta$. The assumed limit implies $\sqrt n h_n=O_p(1)$, hence $h_n\xrightarrow{p}0$. Differentiability gives

$$
\sqrt n\bigl(g(\hat\theta_n)-g(\theta)\bigr)
=G\sqrt n h_n+\sqrt n\,r(h_n).
$$

The remainder is negligible because

$$
\sqrt n\lVert r(h_n)\rVert
=\frac{\lVert r(h_n)\rVert}{\lVert h_n\rVert}
  \sqrt n\lVert h_n\rVert
=o_p(1)\,O_p(1)
=o_p(1).
$$

Therefore the transformed statistic equals $G\sqrt n h_n+o_p(1)$, and Slutsky's theorem yields the result.

## Example

Suppose $Y_1,\ldots,Y_n$ are i.i.d., strictly positive, with mean $\mu>0$ and variance $\sigma^2<\infty$. The central limit theorem and $g(x)=\log x$, whose derivative at $\mu$ is $1/\mu$, give

$$
\sqrt n\bigl(\log \bar Y_n-\log\mu\bigr)
\xrightarrow{d}N\left(0,\frac{\sigma^2}{\mu^2}\right).
$$

For the zero-derivative case, suppose instead that $\sqrt n\hat\theta_n\xrightarrow{d}N(0,\tau^2)$ and take $g(x)=x^2$ at $\theta=0$. The first-order limit is zero, but the second-order scale is informative:

$$
n\hat\theta_n^2\xrightarrow{d}\tau^2\chi_1^2.
$$

## Connections

- [[m-estimation-consistency|M-estimation consistency]] supplies convergence to the population target; an additional asymptotic linear expansion can then feed the delta method.
- [[sub-gaussian-tail-bounds|Sub-Gaussian tail bounds]] give finite-sample deviation control, whereas the delta method describes a local asymptotic distribution.
- Wald standard errors use a consistent estimate of $G\Sigma G^\top$ to turn the vector limit into approximate confidence regions.

## Pitfalls

- Use the Jacobian at the true parameter. A plug-in Jacobian is valid for standard errors only after establishing its consistency.
- Preserve matrix order: the transformed covariance is $G\Sigma G^\top$, not $G^\top\Sigma G$.
- A zero gradient does not mean “no uncertainty”; it usually signals a faster scale and a higher-order expansion.
- Nondifferentiable maps such as $x\mapsto |x|$ at zero require a directional delta method and may have nonnormal limits.
- If the true parameter lies on a boundary, the estimator's original limit may already be nonnormal; the delta method transports that limit but does not repair it.
