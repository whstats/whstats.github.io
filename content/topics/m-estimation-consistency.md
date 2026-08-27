---
title: M-Estimation Consistency
description: A reusable consistency theorem based on uniform convergence, separated identification, and approximate optimization.
tags:
  - asymptotic-statistics
  - estimation
  - empirical-processes
---

## Core Insight

An M-estimator is consistent when the sample objective is uniformly close to a population objective whose optimum is isolated. Uniformity matters because the estimator is data-dependent and can otherwise chase random peaks that move with the sample.

## Logic Map

1. **Uniform convergence** transfers one error bound to every candidate parameter simultaneously.
2. **Well-separated identification** creates a fixed population gap outside each neighborhood of the target.
3. **Gap transfer** preserves that separation in the sample objective with high probability.
4. **Approximate maximization** prevents the estimator from remaining on the wrong side of the sample gap.
5. **Shrink the neighborhood** to conclude $\hat\theta_n\xrightarrow{p}\theta_0$.

## Setup

Let $(\Theta,d)$ be a metric parameter space, let $W_1,\ldots,W_n$ be the observations, and let $W$ denote a generic observation from the population of interest. For each $\theta\in\Theta$, let $m_\theta(W)$ be a criterion function, and define

$$
M_n(\theta)=\frac1n\sum_{i=1}^n m_\theta(W_i),
\qquad
M(\theta)=\mathbb E[m_\theta(W)].
$$

The target $\theta_0$ maximizes $M$. An approximate M-estimator need not find the exact sample maximum: for some nonnegative $\eta_n=o_p(1)$, it satisfies

$$
M_n(\hat\theta_n)
\ge \sup_{\theta\in\Theta}M_n(\theta)-\eta_n.
$$

For minimization problems, reverse the inequalities or maximize the negative loss.

## Main Result

> [!theorem] Basic consistency theorem for M-estimators
> Assume:
>
> 1. **Uniform convergence:**
>    $$
>    \sup_{\theta\in\Theta}|M_n(\theta)-M(\theta)|\xrightarrow{p}0.
>    $$
> 2. **Well-separated identification:** for every $\varepsilon>0$,
>    $$
>    M(\theta_0)
>    >\sup_{d(\theta,\theta_0)\ge\varepsilon}M(\theta).
>    $$
> 3. **Approximate maximization:** $\eta_n=o_p(1)$ in the display above.
>
> Then $d(\hat\theta_n,\theta_0)\xrightarrow{p}0$.

Compactness of $\Theta$, continuity of $M$, and a unique maximizer are a common sufficient route to the separation condition. They are not required when separation can be verified directly.

## Proof Sketch

Fix $\varepsilon>0$ and define the positive population gap

$$
\delta_\varepsilon
=M(\theta_0)-
  \sup_{d(\theta,\theta_0)\ge\varepsilon}M(\theta)
>0.
$$

Let $U_n=\sup_{\theta\in\Theta}|M_n(\theta)-M(\theta)|$. On the event $U_n<\delta_\varepsilon/3$, every parameter outside the $\varepsilon$-ball satisfies

$$
M_n(\theta)
\le M(\theta_0)-\delta_\varepsilon+U_n,
$$

while $M_n(\theta_0)\ge M(\theta_0)-U_n$. Thus the sample objective at any outside point is more than $\delta_\varepsilon/3$ below the sample supremum. If also $\eta_n<\delta_\varepsilon/3$, an approximate maximizer cannot be outside. Consequently,

$$
\Pr\bigl(d(\hat\theta_n,\theta_0)\ge\varepsilon\bigr)
\le
\Pr\left(U_n\ge\frac{\delta_\varepsilon}{3}\right)
+\Pr\left(\eta_n\ge\frac{\delta_\varepsilon}{3}\right)
\longrightarrow0.
$$

### Why a pointwise law of large numbers is not enough

Pointwise convergence controls $M_n(\theta)$ only for each fixed $\theta$; it says nothing directly about the random choice $\hat\theta_n$. A moving-spike example makes the failure explicit. Let $\Theta=\{0,1,2,\ldots\}$ with the discrete metric, set $M(0)=0$ and $M(k)=-1$ for $k\ge1$, and define $M_n(n)=1$ while $M_n(k)=M(k)$ for $k\ne n$. Then $M_n(k)\to M(k)$ for every fixed $k$, and $0$ is well separated, yet the exact maximizer is $\hat\theta_n=n$. Uniform convergence rules out precisely this moving peak.

## Example

Let $Y_1,\ldots,Y_n$ be i.i.d. with $\mathbb E[Y^2]<\infty$, let $\mu=\mathbb E[Y]$, and take $\Theta=[-B,B]$ with $\mu$ in its interior. For least squares, maximize

$$
M_n(\theta)=-\frac1n\sum_{i=1}^n(Y_i-\theta)^2.
$$

Its population counterpart satisfies

$$
M(\mu)-M(\theta)=(\theta-\mu)^2,
$$

so the population optimum is separated by at least $\varepsilon^2$ outside an $\varepsilon$-neighborhood of $\mu$. Moreover,

$$
\sup_{|\theta|\le B}|M_n(\theta)-M(\theta)|
\le
\left|\frac1n\sum_{i=1}^nY_i^2-\mathbb E[Y^2]\right|
+2B\left|\bar Y_n-\mu\right|
\xrightarrow{p}0
$$

by the law of large numbers. Therefore the least-squares M-estimator is consistent for $\mu$.

## Connections

- [[symmetrization-and-rademacher-complexity|Symmetrization and Rademacher complexity]] provide tools for proving a uniform law of large numbers over rich function classes.
- [[sub-gaussian-tail-bounds|Sub-Gaussian tail bounds]] can strengthen uniform convergence into explicit high-probability bounds when the criterion has suitable tails.
- After consistency localizes the estimator, an asymptotic linear expansion and [[the-delta-method|the delta method]] support inference for smooth functions of the target.

## Pitfalls

- A pointwise law of large numbers cannot generally be substituted for uniform convergence because $\hat\theta_n$ is random.
- A unique maximizer alone need not be well separated on a noncompact parameter space; verify a positive gap outside every fixed neighborhood.
- An $o_p(1)$ optimization error is enough for consistency, but sharper distributional results usually require the error to vanish at a faster scale.
- With multiple population maximizers, the conclusion is normally convergence to the maximizer set, not to one selected point.
- For expanding or data-dependent parameter spaces, establish uniform control and separation on the relevant sequence of sets rather than invoking the fixed-space theorem unchanged.
