---
title: "Sub-Gaussian Tails"
description: Starting from the sample mean, understand sub-Gaussian tails, maxima, suprema, and unified random error control in high-dimensional statistics.
tags:
  - probability
  - concentration
  - high-dimensional-statistics
lang: en
---

> [!remark] 0. Reading Guide
>
> Sub-Gaussian tails can be understood through the following chain:
>
> $$
> \boxed{
> \text{sample mean}
> \longrightarrow
> \text{single random error}
> \longrightarrow
> \text{sum of independent random variables}
> \longrightarrow
> \text{maximum}
> \longrightarrow
> \text{supremum}
> \longrightarrow
> \text{high-dimensional statistics and empirical processes}
> }
> $$
>
> The discussion centers on two questions:
>
> 1. How small is the probability that a random error deviates far from zero?
> 2. When many random errors must be controlled at once, what price do we pay for the complexity of the index set?
>
> These questions correspond to **tail behavior** and **complexity**. Many error bounds in modern statistics combine the two, together with a deterministic stability condition for the model.

---

## Origin of the Problem: How Accurate Is the Sample Mean?

Let $X_1,\dots,X_n$ be independent and identically distributed, with

$$
\mathbb E X_i=\mu.
$$

We estimate the population mean $\mu$ with the sample mean

$$
\bar X=\frac1n\sum_{i=1}^nX_i
$$

Unbiasedness

$$
\mathbb E\bar X=\mu
$$

describes only the average behavior under repeated sampling. In a single finite-sample experiment, the relevant question is how small

$$
\Pr\bigl(|\bar X-\mu|\ge t\bigr)
$$

actually is. This probability determines the finite-sample error, the width of a confidence interval, the sample size needed for a given accuracy, and whether many parameters can be estimated accurately at the same time.

### What Can Finite Variance Alone Give Us?

Suppose we know only that

$$
\operatorname{Var}(X_i)=v^2<\infty,
$$

Chebyshev's inequality gives

$$
\Pr\bigl(|\bar X-\mu|\ge t\bigr)
\le
\frac{v^2}{nt^2}.
$$

This bound decays polynomially in $t$. Requiring the right-hand side to be at most $\delta$ gives

$$
|\bar X-\mu|
\le
\frac{v}{\sqrt{n\delta}}
$$

with probability at least $1-\delta$. Raising the confidence level from a constant to a value close to one costs a factor of $\delta^{-1/2}$.

### What Does the Sub-Gaussian Assumption Improve?

Suppose in addition that every centered variable $X_i-\mu$ satisfies

$$
\mathbb E\exp\bigl(\lambda(X_i-\mu)\bigr)
\le
\exp\left(\frac{\sigma^2\lambda^2}{2}\right),
\qquad \lambda\in\mathbb R.
$$

Here $\sigma^2$ is a variance proxy and usually differs from the true variance $v^2$. Under this condition,

$$
\Pr\bigl(|\bar X-\mu|\ge t\bigr)
\le
2\exp\left(-\frac{nt^2}{2\sigma^2}\right).
$$

Requiring the right-hand side to be at most $\delta$ yields the following bound. With probability at least $1-\delta$,

$$
\boxed{
|\bar X-\mu|
\le
\sigma\sqrt{\frac{2\log(2/\delta)}{n}}
}.
$$

The confidence cost improves from $\delta^{-1/2}$ in the Chebyshev bound to

$$
\sqrt{\log(1/\delta)}.
$$

If the failure probability for $|\bar X-\mu|\le\varepsilon$ must be at most $\delta$, a sufficient condition is

$$
\boxed{
n
\ge
\frac{2\sigma^2}{\varepsilon^2}
\log\frac{2}{\delta}
}.
$$

This derivation gives the direct statistical motivation for studying tail probabilities:

$$
\boxed{
\text{tail bound}
\Longrightarrow
\text{high-probability error bound}
\Longrightarrow
\text{sample complexity}
}.
$$

---

## First Abstraction: From the Sample Mean to a General Random Error

Abstract the specific error $\bar X-\mu$ as

$$
Z=\widehat\theta-\theta.
$$

The general goal is to find a confidence radius $r(\delta)$ such that

$$
\Pr\bigl(|Z|\le r(\delta)\bigr)
\ge
1-\delta.
$$

If

$$
\Pr(|Z|\ge t)
\le
2\exp\left(-\frac{t^2}{2s^2}\right),
\qquad t\ge0,
$$

then direct inversion gives

$$
r(\delta)
=
s\sqrt{2\log(2/\delta)}.
$$

Here:

- $s$ describes the basic fluctuation scale of the random error;
- $\sqrt{\log(1/\delta)}$ describes the price of increasing the confidence level.

Many sources instead use

$$
\Pr(|Z|\ge t)
\le
C\exp\left(-c\frac{t^2}{K^2}\right)
$$

to express a sub-Gaussian tail, where $C,c>0$ are absolute constants. The exact constants depend on the parameterization. The stable feature is the quadratic term in the exponent,

$$
-\frac{t^2}{K^2}.
$$

The term “sub-Gaussian” describes the order of tail decay. It does not require the random variable to have a Gaussian distribution.

---

## Definitions and Equivalent Characterizations of Sub-Gaussianity

### MGF Definition

We use the centered convention. Suppose a random variable $X$ satisfies $\mathbb EX=0$, and suppose there is some $\sigma>0$ such that, for every $\lambda\in\mathbb R$,

$$
\mathbb E e^{\lambda X}
\le
\exp\left(\frac{\sigma^2\lambda^2}{2}\right),
$$

then $X$ is sub-Gaussian with parameter $\sigma$. For a general random variable, we usually study $X-\mathbb EX$.

The right-hand side is exactly the moment generating function of $N(0,\sigma^2)$. From the MGF perspective, the condition says that the fluctuations of $X$ are no larger than those of some Gaussian random variable.

The quantity $\sigma^2$ is often called a variance proxy. Expanding the MGF near the origin gives

$$
\operatorname{Var}(X)
\le
\sigma^2,
$$

but equality need not hold.

### Four Common Characterizations

For a centered random variable, the following properties are equivalent up to absolute constants.

#### MGF Control

$$
\mathbb E e^{\lambda X}
\le
e^{C\lambda^2K^2},
\qquad \lambda\in\mathbb R.
$$

#### Tail Control

$$
\Pr(|X|\ge t)
\le
2e^{-ct^2/K^2},
\qquad t\ge0.
$$

#### Moment Growth

$$
\bigl(\mathbb E|X|^q\bigr)^{1/q}
\le
CK\sqrt q,
\qquad q\ge1.
$$

#### Finite Orlicz $\psi_2$ Norm

$$
\|X\|_{\psi_2}
:=
\inf\left\{
s>0:
\mathbb E\exp\left(\frac{X^2}{s^2}\right)\le2
\right\}
<\infty.
$$

“Equivalent” means that each characterization implies the others, with parameters that may differ by absolute constants. The tail parameter, the MGF parameter, and the $\psi_2$ norm should not be treated as numerically identical quantities.

### Why Do Sub-Gaussian Moments Grow as $\sqrt q$?

The tail integration formula gives

$$
\mathbb E|X|^q
=
q\int_0^\infty
t^{q-1}\Pr(|X|\ge t)\,dt.
$$

If $\Pr(|X|\ge t)\le2e^{-ct^2/K^2}$, substitution and a change of variables give

$$
\mathbb E|X|^q
\le
(CK\sqrt q)^q.
$$

Therefore,

$$
\|X\|_{L_q}
\lesssim
K\sqrt q.
$$

Gaussian-type tails and $\sqrt q$ moment growth are two descriptions of the same phenomenon.

---

## Why Does an MGF Bound Imply a Gaussian-Type Tail?

Let $X$ be centered and satisfy

$$
\mathbb E e^{\lambda X}
\le
e^{\sigma^2\lambda^2/2}.
$$

For any $\lambda>0$, Markov's inequality gives

$$
\begin{aligned}
\Pr(X\ge t)
&=
\Pr(e^{\lambda X}\ge e^{\lambda t})\\
&\le
e^{-\lambda t}\mathbb E e^{\lambda X}\\
&\le
\exp\left(-\lambda t+\frac{\sigma^2\lambda^2}{2}\right).
\end{aligned}
$$

The right-hand side is minimized over $\lambda$ at

$$
\lambda^*=\frac{t}{\sigma^2}.
$$

Substitution gives

$$
\Pr(X\ge t)
\le
\exp\left(-\frac{t^2}{2\sigma^2}\right).
$$

Applying the same argument to $-X$ and then using the union bound gives

$$
\boxed{
\Pr(|X|\ge t)
\le
2\exp\left(-\frac{t^2}{2\sigma^2}\right)
}.
$$

This is the Chernoff method. The quadratic decay in the exponent comes from taking the convex conjugate of the following quadratic log-MGF bound:

$$
\log\mathbb E e^{\lambda X}
\lesssim
\lambda^2\sigma^2
$$

More generally, the growth rate of the log-MGF determines the form of the tail exponent.

---

## Why Are Sub-Gaussian Variables So Common in Statistics?

Statistical errors often take the form of weighted sums of random perturbations. The sub-Gaussian class is stable under independent summation.

Let $X_1,\dots,X_n$ be independent and centered, and let $X_i$ be sub-Gaussian with parameter $\sigma_i$. Then

$$
\begin{aligned}
\mathbb E\exp\left(\lambda\sum_{i=1}^nX_i\right)
&=
\prod_{i=1}^n\mathbb E e^{\lambda X_i}\\
&\le
\prod_{i=1}^n
\exp\left(\frac{\sigma_i^2\lambda^2}{2}\right)\\
&=
\exp\left(
\frac{\lambda^2}{2}
\sum_{i=1}^n\sigma_i^2
\right).
\end{aligned}
$$

Thus,

$$
\sum_{i=1}^nX_i
$$

is sub-Gaussian with the following parameter:

$$
\left(\sum_{i=1}^n\sigma_i^2\right)^{1/2}
$$

More generally, for deterministic weights $a_1,\dots,a_n$, the weighted sum

$$
\sum_{i=1}^na_iX_i
$$

has sub-Gaussian parameter at most

$$
\left(\sum_{i=1}^na_i^2\sigma_i^2\right)^{1/2}.
$$

If the variables $X_i-\mu$ are independent and all have parameter $\sigma$, then

$$
\bar X-\mu
=
\frac1n\sum_{i=1}^n(X_i-\mu)
$$

has parameter $\sigma/\sqrt n$. Therefore,

$$
\Pr\bigl(|\bar X-\mu|\ge t\bigr)
\le
2\exp\left(-\frac{nt^2}{2\sigma^2}\right).
$$

This is the nonasymptotic source of the $n^{-1/2}$ error scale for the sample mean.

Independence is essential to the MGF factorization above. Under dependence, one needs martingale concentration, mixing conditions, dependency graphs, or another substitute for independence.

---

## Standard Examples and Counterexamples

### Gaussian Random Variables

If $X\sim N(0,\tau^2)$, then

$$
\mathbb E e^{\lambda X}
=
e^{\tau^2\lambda^2/2}.
$$

Thus $X$ is sub-Gaussian with parameter $\tau$. This is the reference model for the definition.

### Rademacher Random Variables

If

$$
\Pr(X=1)=\Pr(X=-1)=\frac12,
$$

then

$$
\mathbb E e^{\lambda X}
=
\cosh(\lambda)
\le
e^{\lambda^2/2}.
$$

A Rademacher random variable is therefore sub-Gaussian with parameter $1$. Its distribution is discrete, yet it has Gaussian-type concentration.

### Bounded Random Variables

If $X\in[a,b]$ almost surely, Hoeffding's lemma gives

$$
\mathbb E\exp\bigl(\lambda(X-\mathbb EX)\bigr)
\le
\exp\left(\frac{\lambda^2(b-a)^2}{8}\right).
$$

Comparison with the standard MGF definition shows that $X-\mathbb EX$ may be assigned the sub-Gaussian parameter

$$
\sigma=\frac{b-a}{2}.
$$

Boundedness is therefore a sufficient condition for sub-Gaussianity. This parameter need not be optimal.

### Counterexamples

A centered exponential random variable has a right tail of order $e^{-ct}$, which decays more slowly than $e^{-ct^2}$. It usually belongs to the sub-exponential class.

Polynomial-tailed distributions such as Student's $t$ generally have no finite MGF and do not satisfy the sub-Gaussian condition.

Finite variance alone does not imply a sub-Gaussian tail. The central limit theorem describes the asymptotic distribution after suitable standardization. It does not automatically provide a Gaussian-type tail bound that holds for every finite sample size and every deviation level.

---

## From One Random Error to Many

Suppose $Z_1,\dots,Z_p$ satisfy the uniform tail bound

$$
\Pr(|Z_j|\ge t)
\le
2\exp\left(-\frac{t^2}{2s^2}\right),
\qquad j=1,\dots,p.
$$

Even if these random variables are dependent, the union bound gives

$$
\begin{aligned}
\Pr\left(\max_{1\le j\le p}|Z_j|\ge t\right)
&\le
\sum_{j=1}^p\Pr(|Z_j|\ge t)\\
&\le
2p\exp\left(-\frac{t^2}{2s^2}\right).
\end{aligned}
$$

Requiring the right-hand side to be at most $\delta$ gives the following bound. With probability at least $1-\delta$,

$$
\boxed{
\max_{1\le j\le p}|Z_j|
\le
s\sqrt{2\log\frac{2p}{\delta}}
}.
$$

Moving from one error to the simultaneous control of $p$ errors produces the characteristic

$$
\sqrt{\log p}
$$

complexity penalty:

$$
\boxed{
\text{single-error scale }s
+
\text{number of comparisons }p
\Longrightarrow
s\sqrt{\log p}
}.
$$

Integrating the tail also gives

$$
\mathbb E\max_{1\le j\le p}|Z_j|
\lesssim
s\sqrt{\log(2p)}.
$$

When the $Z_j$ are strongly correlated, the union bound may be loose because the effective complexity can be much smaller than $p$. This observation leads naturally to covering numbers and chaining.

---

## Example: Simultaneous Mean Estimation

Let

$$
X_i=(X_{i1},\dots,X_{ip})^\top,
$$

and use

$$
\bar X_j=\frac1n\sum_{i=1}^nX_{ij}
$$

to estimate

$$
\mu_j=\mathbb EX_{ij}.
$$

Assume the samples are independent across $i$. For every coordinate $j$, assume that $X_{ij}-\mu_j$ is sub-Gaussian with parameter at most $\sigma$. The coordinates may be dependent.

For a fixed $j$,

$$
\bar X_j-\mu_j
$$

has sub-Gaussian parameter at most $\sigma/\sqrt n$. The maximum bound from the previous section therefore gives the following result. With probability at least $1-\delta$,

$$
\boxed{
\max_{1\le j\le p}|\bar X_j-\mu_j|
\le
\sigma
\sqrt{
\frac{2\log(2p/\delta)}{n}
}
}.
$$

This is the familiar

$$
\sqrt{\frac{\log p}{n}}
$$

scale in high-dimensional mean estimation. The factor $n^{-1/2}$ comes from concentration of a single sample mean, while $\sqrt{\log p}$ comes from simultaneous control.

---

## Example: The Random Gradient Term in Lasso

Consider the linear model

$$
y=X\beta^*+\varepsilon,
$$

and the standard Lasso objective

$$
\widehat\beta
\in
\arg\min_{\beta\in\mathbb R^p}
\left\{
\frac{1}{2n}\|y-X\beta\|_2^2
+
\lambda\|\beta\|_1
\right\}.
$$

The random term in the basic inequality is

$$
\frac1nX^\top\varepsilon.
$$

A standard proof usually requires the tuning parameter to satisfy

$$
\lambda
\ge
2\left\|\frac1nX^\top\varepsilon\right\|_\infty.
$$

We therefore need to control

$$
\left\|\frac1nX^\top\varepsilon\right\|_\infty
=
\max_{1\le j\le p}
\left|
\frac1nX_j^\top\varepsilon
\right|.
$$

Define

$$
Z_j
=
\frac1nX_j^\top\varepsilon
=
\frac1n\sum_{i=1}^nX_{ij}\varepsilon_i.
$$

Assume the design matrix $X$ is fixed, the variables $\varepsilon_i$ are independent, centered, and sub-Gaussian with parameter $\sigma$, and the columns satisfy

$$
\|X_j\|_2\le\sqrt n.
$$

By stability under weighted sums, conditional on $X$, the sub-Gaussian parameter of $Z_j$ is at most

$$
\frac{\sigma\|X_j\|_2}{n}
\le
\frac{\sigma}{\sqrt n}.
$$

Thus, with probability at least $1-\delta$,

$$
\boxed{
\left\|\frac1nX^\top\varepsilon\right\|_\infty
\le
\sigma
\sqrt{
\frac{2\log(2p/\delta)}{n}
}
}.
$$

The Lasso tuning parameter is therefore usually chosen as

$$
\lambda
\asymp
\sigma\sqrt{\frac{\log p}{n}},
$$

where the constant must account for the target probability and the coefficient in the basic inequality.

This scale follows from the explicit correspondence

$$
Z_j=\frac1nX_j^\top\varepsilon,
\qquad
\left\|\frac1nX^\top\varepsilon\right\|_\infty
=
\max_{j\le p}|Z_j|.
$$

Concentration controls the random score. A restricted eigenvalue condition, compatibility condition, or another deterministic condition then converts the score bound into prediction and coefficient error bounds.

---

## Second Abstraction: From a Maximum to a Supremum

The maximum of finitely many random variables can be written as

$$
\max_{j\le p}|Z_j|
=
\sup_{t\in T}|Z_t|,
\qquad
T=\{1,\dots,p\}.
$$

The more general problem is therefore to study the random process

$$
\{Z_t:t\in T\}
$$

through its supremum,

$$
\sup_{t\in T}|Z_t|.
$$

### Sub-Gaussian Increments

Suppose the process satisfies

$$
\mathbb E\exp\bigl(\lambda(Z_t-Z_s)\bigr)
\le
\exp\left(\frac{\lambda^2d(s,t)^2}{2}\right),
\qquad s,t\in T,
$$

then its increments are called sub-Gaussian with respect to the semimetric $d$. The quantity $d(s,t)$ describes the stochastic distance between the random variables associated with the two indices.

For fixed $s,t$, the Chernoff method gives

$$
\Pr\bigl(|Z_t-Z_s|\ge u\bigr)
\le
2\exp\left(-\frac{u^2}{2d(s,t)^2}\right).
$$

### From Cardinality to Geometric Complexity

For a finite set, the union bound uses mainly $|T|$. For a continuous or highly correlated index set, the relevant quantity is the geometric complexity of $T$ under the metric $d$.

Under standard separability conditions, Dudley's entropy bound has the form

$$
\mathbb E\sup_{t\in T}(Z_t-Z_{t_0})
\lesssim
\int_0^{\operatorname{diam}(T)}
\sqrt{\log N(T,d,\varepsilon)}\,d\varepsilon,
$$

where $N(T,d,\varepsilon)$ is the covering number.

For a general index set, multiscale metric entropy replaces the $\log|T|$ term for a finite set. Generic chaining describes this multiscale complexity through $\gamma_2(T,d)$ and is often more precise than a union bound at a single scale.

This gives a unified framework:

$$
\boxed{
\text{increment tail behavior}
+
\text{geometry of the index set}
\Longrightarrow
\text{uniform stochastic error}
}.
$$

---

## How Does the Supremum Framework Unify Common Statistical Problems?

### Norms of Random Vectors

For any $z\in\mathbb R^p$,

$$
\|z\|_2
=
\sup_{u\in S^{p-1}}\langle u,z\rangle.
$$

Controlling the Euclidean norm of a random vector $Z$ is therefore equivalent to controlling the process indexed by the unit sphere $S^{p-1}$,

$$
Z_u=\langle u,Z\rangle.
$$

If the coordinates of $Z$ are independent and centered, with $\|Z_j\|_{\psi_2}\le K$, then every linear projection $\langle u,Z\rangle$ has a uniform sub-Gaussian bound. A covering argument for the sphere gives the typical high-probability bound

$$
\|Z\|_2
\lesssim
K\left(
\sqrt p+
\sqrt{\log(1/\delta)}
\right)
$$

with probability at least $1-\delta$. The factor $\sqrt p$ comes from the geometric complexity of the unit sphere.

### Sample Covariance and Operator Norm

The sample covariance matrix

$$
\widehat\Sigma
=
\frac1n\sum_{i=1}^nX_iX_i^\top
$$

satisfies

$$
\begin{aligned}
\|\widehat\Sigma-\Sigma\|_{\mathrm{op}}
&=
\sup_{u\in S^{p-1}}
\left|u^\top(\widehat\Sigma-\Sigma)u\right|\\
&=
\sup_{u\in S^{p-1}}
\left|
\frac1n\sum_{i=1}^n
\left[
(u^\top X_i)^2-
\mathbb E(u^\top X_i)^2
\right]
\right|.
\end{aligned}
$$

The index set is again $S^{p-1}$. A key change now occurs. If $u^\top X_i$ is sub-Gaussian, then

$$
(u^\top X_i)^2-
\mathbb E(u^\top X_i)^2
$$

is typically sub-exponential. Covariance estimation therefore combines Bernstein-type concentration with a covering argument for the sphere or a more refined empirical-process method.

Under independent, isotropic sub-Gaussian designs and standard regularity conditions, a typical high-probability error bound has the form

$$
\|\widehat\Sigma-I\|_{\mathrm{op}}
\lesssim
K^2
\left[
\sqrt{\frac{p+\log(1/\delta)}{n}}
+
\frac{p+\log(1/\delta)}{n}
\right],
$$

where $K$ controls the $\psi_2$ norm of one-dimensional projections. The absolute constant depends on the normalization.

The bound contains two components:

- $p$ comes from the complexity of the sphere;
- the quadratic statistic produces the two-regime error structure associated with sub-exponential tails.

### Empirical Processes

For a function class $\mathcal F$, empirical-process theory studies

$$
\sup_{f\in\mathcal F}|(P_n-P)f|
=
\sup_{f\in\mathcal F}
\left|
\frac1n\sum_{i=1}^n
\bigl(f(X_i)-\mathbb Ef(X_i)\bigr)
\right|.
$$

This has the same structure as a finite-dimensional maximum, except that the index set changes from $[p]$ to the function class $\mathcal F$.

A typical analysis has three steps:

1. For a fixed $f$, control the tail of $(P_n-P)f$;
2. use symmetrization to turn the empirical process into a Rademacher process;
3. control the supremum over the function class with covering numbers, Rademacher complexity, Gaussian complexity, or chaining.

The same general rule applies:

$$
\text{random fluctuation of one function}
+
\text{complexity of the function class}
\Longrightarrow
\text{uniform generalization error}.
$$

---

## Limits of the Sub-Gaussian Framework

The sub-Gaussian assumption gives strong control of large deviations, but many statistics fall into other tail regimes.

### Sub-Gaussian Regime

The typical form is

$$
\Pr(|X|\ge t)
\lesssim
\exp\left(-c\frac{t^2}{K^2}\right).
$$

Common tools include Hoeffding's inequality, Gaussian concentration, and sub-Gaussian process theory.

### Sub-Exponential Regime

The typical form is

$$
\Pr(|X|\ge t)
\lesssim
\exp\left[
-c\min\left(
\frac{t^2}{\nu^2},
\frac{t}{b}
\right)
\right].
$$

The small-deviation region is approximately Gaussian, while the large-deviation region decays at an exponential rate. Bernstein's inequality is the standard tool.

The product of two sub-Gaussian random variables and the centered square of a sub-Gaussian random variable usually belong to this class. This is why sample covariance analysis requires Bernstein-type tools.

### Heavy-Tailed Regime

A typical polynomial tail has the form

$$
\Pr(|X|\ge t)
\asymp
t^{-\alpha}.
$$

The ordinary sample mean may not have exponential concentration. With only finite variance, one can use truncation, the median-of-means estimator, a Catoni-type estimator, or another robust method.

### Common Misconceptions

1. **Treating the variance proxy as the true variance.** The MGF parameter controls the variance, but the two are usually different.
2. **Forgetting to center the variable.** Imposing a quadratic MGF bound directly on $X$ usually presumes $\mathbb EX=0$.
3. **Treating the tail, MGF, and $\psi_2$ parameters as numerically identical.** They are generally equivalent only up to absolute constants.
4. **Assuming that finite variance implies sub-Gaussian concentration.** Finite variance generally supports only Chebyshev-type control.
5. **Assuming that every function of a sub-Gaussian input remains sub-Gaussian.** Squares and products generally become sub-exponential.
6. **Multiplying MGFs directly for a dependent sum.** MGF factorization requires independence or another conditional structure that can replace it.
7. **Assuming that the $\sqrt{\log p}$ term from a union bound is always exact.** Strong dependence or low-complexity structure can substantially reduce the effective complexity.
8. **Using the central limit theorem in place of nonasymptotic concentration.** Asymptotic normality does not automatically give a finite-sample exponential bound over the full range of deviations.

---

## A Reusable Template for Concentration Analysis

For a new statistical problem, proceed in the following order.

### Step 1: Identify the Random Error

Write the target as

$$
Z=\widehat\theta-\theta
$$

or, more generally, as

$$
\sup_{t\in T}|Z_t|.
$$

### Step 2: Identify the Random Structure

Determine whether $Z$ can be written as an independent sum, weighted sum, martingale, quadratic form, or empirical process.

### Step 3: Determine the Tail Class

Check whether the basic random quantities are sub-Gaussian, sub-exponential, or heavy-tailed, and state the corresponding parameters and normalization.

### Step 4: Control a Pointwise Error or a Process Increment

Use an MGF argument, the Chernoff method, Hoeffding's inequality, Bernstein's inequality, or another concentration inequality.

### Step 5: Pay the Complexity Cost

- A single error has no additional index complexity.
- A finite maximum usually contributes $\sqrt{\log|T|}$.
- A continuous index set calls for covering numbers, an entropy integral, or chaining.
- A quadratic statistic also requires handling a weaker tail regime.

### Step 6: Invert the Tail Bound

Convert

$$
\Pr(|Z|>t)
\le
\delta
$$

into an error bound that holds with probability at least $1-\delta$.

### Step 7: Propagate the Error Through Deterministic Stability

In Lasso, PCA, M-estimation, and related problems, concentration controls the random term. The final parameter error also requires a deterministic condition such as a restricted eigenvalue, strong convexity, identifiability, a margin condition, or perturbation theory.

The procedure can be summarized as

$$
\boxed{
\text{random fluctuation}
+
\text{index-set complexity}
+
\text{deterministic stability}
\Longrightarrow
\text{statistical error bound}
}.
$$

---

## Summary

A sub-Gaussian tail means that large-deviation probabilities decay at the following Gaussian-type rate:

$$
\exp(-ct^2/K^2)
$$

Sub-Gaussian tails appear frequently in statistics for the following reasons:

1. Weighted sums of independent sub-Gaussian random variables remain sub-Gaussian, which makes sample means and linear random errors easy to analyze.
2. A tail bound can be inverted directly into a finite-sample, high-probability error bound.
3. When one error is extended to a maximum or supremum, tail behavior and the complexity of the index set jointly determine the uniform stochastic error.
4. Concentration controls the random component, while deterministic stability conditions convert that control into a parameter error bound.

The main line to retain is

$$
\boxed{
\text{typical statistical problem}
\longrightarrow
\text{random error abstraction}
\longrightarrow
\text{MGF and tail mechanism}
\longrightarrow
\text{maximum / supremum}
\longrightarrow
\text{specific statistical applications}
\longrightarrow
\text{limits of applicability}
}.
$$
