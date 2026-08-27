---
title: "B-Splines in Statistics"
description: From local approximation and spline-space geometry to regression splines, penalized estimation, probability bounds, and statistical applications.
tags:
  - statistics
  - nonparametric-regression
  - splines
  - regularization
lang: en
---

## Roadmap

We begin with the simplest nonparametric regression problem: noisy observations of an unknown curve. A piecewise linear estimator reveals the two competing forces that govern spline methods—local approximation error and stochastic estimation error. This motivates the abstract spline space, where piecewise polynomials are joined through smoothness constraints. We then define the B-spline basis, derive its local support, partition-of-unity, stability, and differentiation properties, and explain why these properties matter statistically. The central derivation is an exact risk decomposition for least-squares regression splines, followed by pointwise and uniform probability bounds. Penalized B-splines are then derived as a regularized optimization problem whose generalized eigenvalues determine effective complexity. The final sections develop three applications—univariate regression, generalized additive models, and tensor-product surfaces—and examine failure modes involving fixed-dimensional bias, irregular knots, discontinuities, heavy-tailed errors, boundary behavior, and invalid inference.

Throughout, $A\lesssim B$ means $A\leq CB$, where the constant $C$ does not depend on the sample size $n$, the number of basis functions $J$, or the mesh width $h$. It may depend on fixed quantities such as spline degree, the mesh-ratio bound, and upper and lower bounds on the design density. The notation $A\asymp B$ means both $A\lesssim B$ and $B\lesssim A$.

---

## The originating statistical problem

Consider fixed-design nonparametric regression on $[0,1]$:

$$
Y_i=f_0(x_i)+\varepsilon_i,\qquad i=1,\ldots,n,
$$

where $x_i\in[0,1]$ are known design points, $f_0$ is an unknown regression function, and

$$
\mathbb E(\varepsilon_i\mid x_1,\ldots,x_n)=0,
\qquad
\operatorname{Var}(\varepsilon_i\mid x_1,\ldots,x_n)=\sigma^2.
$$

The statistical target is the entire function $f_0$. Typical probability questions include

$$
\Pr\!\left(\left|\widehat f(x_0)-f_0(x_0)\right|>t\right)
$$

at a fixed location $x_0$, and

$$
\Pr\!\left(
\sup_{x\in[0,1]}
\left|\widehat f(x)-f_0(x)\right|>t
\right),
$$

which concerns simultaneous accuracy over the whole curve.

Several weaker descriptions are inadequate. The expectation $\mathbb E\widehat f(x)$ only identifies bias and gives no control over realized fluctuations. Pointwise variance ignores approximation bias. A central limit theorem at one fixed $x_0$ does not imply a simultaneous confidence band. A fixed-dimensional asymptotic distribution can also be misleading when the number of basis functions increases with $n$, as it must for consistent estimation of an unrestricted smooth function.

The geometric origin of splines already contains the statistical idea. A physical drafting spline is a flexible strip constrained at selected locations; its shape is globally smooth while each constraint has primarily local influence. Schoenberg’s 1946 work placed the modern mathematical problem in the setting of smoothing and interpolation of equidistant data. B-splines later supplied local basis coordinates for the corresponding piecewise-polynomial spaces. [American Mathematical Society](https://pubs.ams.org/journals/qam/1946-04-01/S0033-569X-1946-15914-5)

### The first estimator: piecewise linear interpolation

Choose knots

$$
0=\kappa_0<\kappa_1<\cdots<\kappa_L<\kappa_{L+1}=1.
$$

For an interior knot $\kappa_j$, define the hat function

$$
H_j(x)=
\begin{cases}
\dfrac{x-\kappa_{j-1}}{\kappa_j-\kappa_{j-1}},
& \kappa_{j-1}\leq x<\kappa_j,\\[1.2ex]
\dfrac{\kappa_{j+1}-x}{\kappa_{j+1}-\kappa_j},
& \kappa_j\leq x<\kappa_{j+1},\\[1.2ex]
0,&\text{otherwise}.
\end{cases}
$$

The boundary functions have analogous one-sided definitions. A piecewise linear function can be written as

$$
s(x)=\sum_{j=0}^{L+1}\beta_jH_j(x).
$$

At every non-knot point, exactly two basis functions are nonzero, both are nonnegative, and their sum is one. Consequently, $s(x)$ is a local convex combination of two neighboring coefficients. In this linear case,

$$
s(\kappa_j)=\beta_j.
$$

This representation already exhibits the central advantage of splines. Increasing the number of knots increases resolution, while changing $\beta_j$ affects only the two intervals adjacent to $\kappa_j$. A high-degree global polynomial has no comparable locality: every coefficient influences the fitted function over the whole interval.

Piecewise linear functions are often too rough because their first derivatives jump at the knots. The natural next step is to retain piecewise-polynomial flexibility while imposing derivative-matching conditions. This leads to spline spaces.

---

## From hat functions to spline spaces

Let

$$
a=\kappa_0<\kappa_1<\cdots<\kappa_L<\kappa_{L+1}=b
$$

be distinct breakpoints, and let $\Pi_q$ denote the polynomials of degree at most $q$. The maximally smooth spline space of degree $q$ is

$$
\mathcal S_{q,\kappa}
=
\left\{
s:
s|_{[\kappa_\ell,\kappa_{\ell+1})}\in\Pi_q
\ \text{for every }\ell,
\quad
s\in C^{q-1}[a,b]
\right\}.
$$

Thus a degree-$q$ spline is polynomial on each knot interval and has continuous derivatives through order $q-1$ at each simple interior knot.

There are $L+1$ polynomial pieces, each initially carrying $q+1$ coefficients. At every one of the $L$ interior knots, continuity of derivatives of orders $0,\ldots,q-1$ supplies $q$ linear restrictions. Hence

$$
\dim(\mathcal S_{q,\kappa})
=
(L+1)(q+1)-Lq
=
L+q+1.
$$

The quantity

$$
J=L+q+1
$$

is therefore the number of basis functions and the nominal statistical dimension.

### A first equivalent representation

For simple interior knots and maximal $C^{q-1}$ smoothness,

$$
\mathcal S_{q,\kappa}
=
\operatorname{span}
\left\{
1,x,\ldots,x^q,
(x-\kappa_1)_+^q,\ldots,(x-\kappa_L)_+^q
\right\},
$$

where $u_+=\max(u,0)$. Equivalently, every spline has the exact representation

$$
s(x)
=
\sum_{r=0}^{q}a_rx^r
+
\sum_{\ell=1}^{L}c_\ell(x-\kappa_\ell)_+^q.
$$

The truncated-power term $(x-\kappa_\ell)_+^q$ changes the polynomial expression after $\kappa_\ell$. Its derivatives through order $q-1$ remain continuous there, while its $q$th derivative has a jump.

This basis establishes the spline space directly, although it is often unsatisfactory computationally. The polynomial terms are global, and the truncated-power columns can become highly correlated. A B-spline basis spans the same space using compactly supported coordinates.

### Knot multiplicity and smoothness

A general knot sequence may repeat an interior knot $\xi$. If $\xi$ has multiplicity $m$, a degree-$q$ spline is generally $C^{q-m}$ there. The conventions are:

- $m=1$: continuity through derivative order $q-1$;
- $m=q$: continuity of the function only;
- $m=q+1$: a jump is allowed.

The formal notation $C^{-1}$ is sometimes used for the last case. Knot multiplicity is therefore a modeling parameter controlling structural smoothness. It is distinct from the amount of smoothing imposed by a statistical penalty.

---

## The B-spline basis

### Degree, order, and augmented knots

Two indexing conventions are common:

$$
\text{degree}=q,
\qquad
\text{order}=m=q+1.
$$

A cubic spline has degree $3$ and order $4$. Many approximation-theory texts index B-splines by order, while statistical software usually asks for degree.

For $J$ degree-$q$ basis functions, let

$$
\tau_1\leq\tau_2\leq\cdots\leq\tau_{J+q+1}
$$

be a nondecreasing augmented knot vector. An open, or clamped, knot vector on $[a,b]$ repeats the endpoints $q+1$ times:

$$
\tau_1=\cdots=\tau_{q+1}=a,
\qquad
\tau_{J+1}=\cdots=\tau_{J+q+1}=b.
$$

With $L$ simple interior knots, this gives $J=L+q+1$.

### Cox–de Boor recursion

The degree-zero basis functions are

$$
B_{j,0}(x)
=
\mathbf 1\{\tau_j\leq x<\tau_{j+1}\}.
$$

For $r=1,\ldots,q$, recursively define

$$
B_{j,r}(x)
=
\frac{x-\tau_j}{\tau_{j+r}-\tau_j}B_{j,r-1}(x)
+
\frac{\tau_{j+r+1}-x}
{\tau_{j+r+1}-\tau_{j+1}}
B_{j+1,r-1}(x).
$$

A fraction with zero denominator is defined to be zero. At the right endpoint $x=b$, one usually sets the final basis function equal to one and all others equal to zero.

This recurrence was developed in numerical form independently by Cox and de Boor in work published in 1972. Its importance comes from reducing the construction and evaluation of higher-degree B-splines to repeated local linear interpolation. [BibBase](https://bibbase.org/network/publication/cox-thenumericalevaluationofbsplines-1972)

A spline is represented as

$$
s(x)=\sum_{j=1}^{J}\beta_jB_{j,q}(x)
=\mathbf b(x)^\top\boldsymbol\beta,
$$

where

$$
\mathbf b(x)=
\bigl(B_{1,q}(x),\ldots,B_{J,q}(x)\bigr)^\top.
$$

The coefficients $\beta_j$ are local coordinates. For degree $q\geq2$, they generally differ from $s(\tau_j)$ and from the function values at the knots.

### Local support and nonnegativity

The recursion implies

$$
\operatorname{supp}(B_{j,q})
\subseteq
[\tau_j,\tau_{j+q+1}].
$$

This follows by induction. At degree zero, $B_{j,0}$ is supported on one knot interval. Each recursion combines $B_{j,r-1}$ and $B_{j+1,r-1}$, so the support expands by at most one adjacent interval.

The multipliers in the recursion are nonnegative wherever their corresponding lower-degree basis functions are nonzero. Hence

$$
B_{j,q}(x)\geq0.
$$

At a generic $x$, at most $q+1$ B-splines are nonzero. Consequently, evaluating $s(x)$ uses a fixed number of coefficients when $q$ is fixed, regardless of $J$.

### Partition of unity

The B-spline basis satisfies the exact identity

$$
\sum_{j=1}^{J}B_{j,q}(x)=1,
\qquad x\in[a,b].
$$

The mechanism can be seen directly from the recursion. Suppose the degree-$(r-1)$ basis sums to one. Summing the degree-$r$ recursion and reindexing its second term gives, for each $B_{j,r-1}$, the combined coefficient

$$
\frac{x-\tau_j}{\tau_{j+r}-\tau_j}
+
\frac{\tau_{j+r}-x}{\tau_{j+r}-\tau_j}
=1.
$$

Therefore

$$
\sum_jB_{j,r}(x)
=
\sum_jB_{j,r-1}(x)
=1.
$$

The degree-zero statement follows because the indicators partition the interval. This proves the result by induction.

It follows that

$$
s(x)=\sum_j\beta_jB_{j,q}(x)
$$

is a convex combination of its locally active coefficients. In particular,

$$
\min_{j:B_{j,q}(x)>0}\beta_j
\leq
s(x)
\leq
\max_{j:B_{j,q}(x)>0}\beta_j
$$

and, globally,

$$
\|s\|_\infty\leq\|\boldsymbol\beta\|_\infty.
$$

The latter inequality is exact. A reverse inequality

$$
\|\boldsymbol\beta\|_\infty
\lesssim
\|s\|_\infty
$$

also holds under standard stability conditions, with a constant depending on the degree and knot geometry. These positive, local, stable-basis properties are central features of B-splines. De Boor also records that the letter “B” was used for “basis” or “basic.” [UW Computer Sciences](https://pages.cs.wisc.edu/~deboor/514/8apr.pdf)

### Basis characterization of the spline space

Assume that every final-degree B-spline is nonzero, equivalently

$$
\tau_j<\tau_{j+q+1}
$$

for every admissible $j$. Then the functions $B_{1,q},\ldots,B_{J,q}$ are linearly independent and span the corresponding degree-$q$ spline space. The space can therefore be characterized in two equivalent ways:

$$
\mathcal S_{q,\tau}
=
\left\{
\text{piecewise degree-\(q\) functions with knot-determined continuity}
\right\},
$$

and

$$
\mathcal S_{q,\tau}
=
\operatorname{span}\{B_{1,q},\ldots,B_{J,q}\}.
$$

At an interior knot of multiplicity $m$, the space has continuity $C^{q-m}$. These piecewise-polynomial and B-spline-span characterizations describe exactly the same functions. [UW Computer Sciences](https://pages.cs.wisc.edu/~deboor/514/8apr.pdf)

### $L_2$ stability

Suppose the distinct knots are quasi-uniform:

$$
h=\max_\ell(\kappa_{\ell+1}-\kappa_\ell),
\qquad
\underline h=\min_\ell(\kappa_{\ell+1}-\kappa_\ell),
\qquad
\frac{h}{\underline h}\leq C_{\mathrm{mesh}}.
$$

Suppose also that a design density $g$ satisfies

$$
0<c_g\leq g(x)\leq C_g<\infty.
$$

Then, for fixed degree $q$,

$$
c\,h\|\boldsymbol\beta\|_2^2
\leq
\int_a^b
\left\{\sum_{j=1}^{J}\beta_jB_{j,q}(x)\right\}^2
g(x)\,dx
\leq
C\,h\|\boldsymbol\beta\|_2^2.
$$

Since $h\asymp J^{-1}$, coefficient norm and function norm differ by a factor of order $J^{-1/2}$:

$$
\|s\|_{L_2(g)}
\asymp
J^{-1/2}\|\boldsymbol\beta\|_2.
$$

This is a Riesz-basis property. The B-splines are stable local coordinates, although they are not orthonormal coordinates.

### Differentiation and coefficient differences

Differentiating the recursion gives

$$
B'_{j,q}(x)
=
\frac{q}{\tau_{j+q}-\tau_j}B_{j,q-1}(x)
-
\frac{q}{\tau_{j+q+1}-\tau_{j+1}}B_{j+1,q-1}(x).
$$

Consequently,

$$
\begin{aligned}
s'(x)
&=
\sum_j\beta_jB'_{j,q}(x)\\
&=
\sum_j
\frac{q(\beta_j-\beta_{j-1})}
{\tau_{j+q}-\tau_j}
B_{j,q-1}(x).
\end{aligned}
$$

Thus derivatives of the spline are represented by scaled differences of neighboring coefficients. This identity is exact, subject to the usual convention that zero B-splines accompanying zero denominators are omitted. [UW Computer Sciences](https://pages.cs.wisc.edu/~deboor/514/8apr.pdf)

For equally spaced interior knots with spacing $h$, repeated differentiation gives, away from boundary modifications,

$$
s^{(r)}(x)
=
h^{-r}
\sum_j
\Delta^r\beta_j
B_{j,q-r}(x),
$$

where

$$
\Delta\beta_j=\beta_j-\beta_{j-1}.
$$

Since the lower-degree B-splines are stable and each has support of length $O(h)$,

$$
\int_a^b\{s^{(r)}(x)\}^2\,dx
\asymp
h^{1-2r}
\sum_j(\Delta^r\beta_j)^2.
$$

This relation explains why difference penalties on B-spline coefficients act as discrete roughness penalties.

---

## Approximation: where the bias rate comes from

Before introducing randomness, one must determine how well a $J$-dimensional spline space can approximate $f_0$.

### A complete degree-one calculation

Let $f_0\in C^2[a,b]$, and consider one interval $[\kappa_\ell,\kappa_{\ell+1}]$ of width $h_\ell$. Let $I_\ell f_0$ be the line joining the two endpoint values. The interpolation remainder gives, for each $x$ in this interval,

$$
f_0(x)-I_\ell f_0(x)
=
\frac{f_0''(\xi_x)}{2}
(x-\kappa_\ell)(x-\kappa_{\ell+1})
$$

for some $\xi_x\in(\kappa_\ell,\kappa_{\ell+1})$. Since

$$
\max_{x\in[\kappa_\ell,\kappa_{\ell+1}]}
\left|
(x-\kappa_\ell)(x-\kappa_{\ell+1})
\right|
=
\frac{h_\ell^2}{4},
$$

we obtain

$$
\|f_0-I_\ell f_0\|_{\infty,[\kappa_\ell,\kappa_{\ell+1}]}
\leq
\frac{h_\ell^2}{8}\|f_0''\|_\infty.
$$

Over the full mesh,

$$
\|f_0-I f_0\|_\infty
\leq
\frac{h^2}{8}\|f_0''\|_\infty.
$$

The statistical meaning is direct: halving the knot spacing reduces the deterministic linear-spline error by approximately a factor of four when $f_0$ has two derivatives.

### General approximation order

Assume:

1. the spline degree $q$ is fixed;
2. the knot sequence is quasi-uniform with $h\asymp J^{-1}$;
3. $f_0$ belongs to a Hölder class $C^s[a,b]$, with $0<s\leq q+1$.

Then there exists $s_J\in\mathcal S_{q,\tau}$ such that

$$
\|f_0-s_J\|_\infty
\leq
C h^s\|f_0\|_{C^s}
\lesssim
J^{-s}.
$$

For Sobolev smoothness $f_0\in W^{s,2}$, an analogous result is

$$
\inf_{s_J\in\mathcal S_{q,\tau}}
\|f_0-s_J\|_{L_2}
\lesssim
J^{-s}\|f_0\|_{W^{s,2}},
\qquad s\leq q+1.
$$

The mechanism is local polynomial reproduction. A Taylor polynomial of degree at most $q$ approximates $f_0$ on an interval of width $h$ with error $O(h^s)$. A stable local quasi-interpolation operator combines these local approximations while preserving the required knot smoothness. Polynomial spline regression theory formalizes these local approximation and projection properties. [Project Euclid](https://projecteuclid.org/journals/annals-of-statistics/volume-31/issue-5/Local-asymptotics-for-polynomial-spline-regression/10.1214/aos/1065705120.pdf)

Increasing $q$ beyond the actual smoothness of $f_0$ does not improve the power $s$. The approximation order is limited by

$$
\min(s,q+1).
$$

---

## Least-squares regression splines

Let

$$
\mathbf b(x)
=
(B_{1,q}(x),\ldots,B_{J,q}(x))^\top
$$

and define the $n\times J$ design matrix

$$
B=
\begin{pmatrix}
\mathbf b(x_1)^\top\\
\vdots\\
\mathbf b(x_n)^\top
\end{pmatrix}.
$$

Assume $B$ has full column rank and $J<n$. The regression-spline estimator is

$$
\widehat{\boldsymbol\beta}
=
(B^\top B)^{-1}B^\top\mathbf Y,
\qquad
\widehat f(x)
=
\mathbf b(x)^\top\widehat{\boldsymbol\beta}.
$$

The estimator is linear in the observations. This gives a particularly transparent error decomposition.

### Exact empirical risk decomposition

Let

$$
\mathbf f_0
=
(f_0(x_1),\ldots,f_0(x_n))^\top
$$

and define

$$
P_B=B(B^\top B)^{-1}B^\top.
$$

Then $P_B$ is the Euclidean orthogonal projection onto the column space of $B$, and the vector of fitted values is

$$
\widehat{\mathbf f}=P_B\mathbf Y.
$$

Since $\mathbf Y=\mathbf f_0+\boldsymbol\varepsilon$,

$$
\widehat{\mathbf f}-\mathbf f_0
=
-(I-P_B)\mathbf f_0
+
P_B\boldsymbol\varepsilon.
$$

The two terms are orthogonal for every realization of $\boldsymbol\varepsilon$: the first lies in the orthogonal complement of $\operatorname{col}(B)$, while the second lies in $\operatorname{col}(B)$. Therefore,

$$
\|\widehat{\mathbf f}-\mathbf f_0\|_2^2
=
\|(I-P_B)\mathbf f_0\|_2^2
+
\|P_B\boldsymbol\varepsilon\|_2^2.
$$

Assume, conditionally on the design,

$$
\mathbb E(\boldsymbol\varepsilon)=0,
\qquad
\operatorname{Cov}(\boldsymbol\varepsilon)=\sigma^2I_n.
$$

Taking expectations and using $P_B^2=P_B=P_B^\top$,

$$
\begin{aligned}
\mathbb E\!\left[
\|\widehat f-f_0\|_n^2
\,\middle|\,x_1,\ldots,x_n
\right]
&=
\frac1n\|(I-P_B)\mathbf f_0\|_2^2
+
\frac{\sigma^2}{n}\operatorname{tr}(P_B)\\
&=
\inf_{s\in\mathcal S_{q,\tau}}
\|s-f_0\|_n^2
+
\frac{\sigma^2J}{n},
\end{aligned}
$$

where

$$
\|g\|_n^2=\frac1n\sum_{i=1}^ng(x_i)^2.
$$

This identity is exact. Gaussian errors are unnecessary; the covariance assumption is sufficient.

The first term is approximation bias squared. The second is estimation variance. Every estimated spline coordinate contributes one unit of projection rank, producing the factor $J/n$.

### The nonparametric rate

Under the approximation assumptions in Section 4,

$$
\inf_{s\in\mathcal S_{q,\tau}}
\|s-f_0\|_n^2
\lesssim
J^{-2s}.
$$

Hence

$$
\mathbb E\|\widehat f-f_0\|_n^2
\lesssim
J^{-2s}
+
\frac{\sigma^2J}{n}.
$$

Balancing the two terms gives

$$
J^{-2s}\asymp\frac{J}{n},
$$

and therefore

$$
J\asymp n^{1/(2s+1)}.
$$

At this choice,

$$
\mathbb E\|\widehat f-f_0\|_n^2
\lesssim
n^{-2s/(2s+1)},
$$

while the root mean squared error has order

$$
n^{-s/(2s+1)}.
$$

The exponent comes from a simple dimensional balance:

$$
\underbrace{J^{-2s}}_{\text{squared approximation error}}
\quad\text{versus}\quad
\underbrace{J/n}_{\text{estimated dimension per observation}}.
$$

Under standard smoothness classes this agrees with the one-dimensional optimal global nonparametric rate. Establishing optimality also requires a lower-bound argument, which is separate from the upper-bound calculation above. Stone’s work gives the classical minimax global-rate theory. [Project Euclid](https://projecteuclid.org/journals/annals-of-statistics/volume-10/issue-4/Optimal-global-rates-of-convergence-for-nonparametric-regression/10.1214/aos/1176345969.full)

### Pointwise variance and the Gram matrix

At a point $x$,

$$
\widehat f(x)-\mathbb E\{\widehat f(x)\mid B\}
=
\mathbf b(x)^\top(B^\top B)^{-1}B^\top\boldsymbol\varepsilon.
$$

Thus

$$
\operatorname{Var}\{\widehat f(x)\mid B\}
=
\sigma^2
\mathbf b(x)^\top(B^\top B)^{-1}\mathbf b(x).
$$

Let

$$
G_n=\frac1nB^\top B.
$$

For a regular design and quasi-uniform knots, spline stability yields

$$
c h I_J\preceq G_n\preceq C h I_J.
$$

Because $h\asymp J^{-1}$,

$$
\|G_n^{-1}\|_{\mathrm{op}}\lesssim J.
$$

Only $q+1$ entries of $\mathbf b(x)$ are nonzero and $\|\mathbf b(x)\|_2\lesssim1$, so

$$
\operatorname{Var}\{\widehat f(x)\mid B\}
=
\frac{\sigma^2}{n}
\mathbf b(x)^\top G_n^{-1}\mathbf b(x)
\lesssim
\frac{\sigma^2J}{n}.
$$

The pointwise standard deviation is therefore of order

$$
\sqrt{\frac{J}{n}}.
$$

Local asymptotic normality requires additional leverage, moment, and bias conditions when $J\to\infty$; it cannot be inferred solely from ordinary fixed-$J$ linear regression asymptotics. [Project Euclid](https://projecteuclid.org/journals/annals-of-statistics/volume-31/issue-5/Local-asymptotics-for-polynomial-spline-regression/10.1214/aos/1065705120.pdf)

---

## From one point to uniform control

The centered estimation error is a stochastic process indexed by $x$:

$$
Z_x
=
\widehat f(x)
-
\mathbb E\{\widehat f(x)\mid B\}.
$$

The successive abstractions are

$$
Z_{x_0},
\qquad
\max_{1\leq j\leq J}|\delta_j|,
\qquad
\sup_{x\in[a,b]}|Z_x|,
$$

where

$$
\boldsymbol\delta
=
\widehat{\boldsymbol\beta}
-
\mathbb E(\widehat{\boldsymbol\beta}\mid B).
$$

The B-spline partition-of-unity property links the continuum supremum to the finite coefficient maximum.

### A pointwise MGF calculation

Assume the errors are conditionally independent and $K_\varepsilon$-sub-Gaussian:

$$
\mathbb E\!\left[
e^{t\varepsilon_i}\mid B
\right]
\leq
\exp\left(\frac{K_\varepsilon^2t^2}{2}\right)
\quad
\text{for every }t\in\mathbb R.
$$

Write

$$
Z_x=\mathbf w(x)^\top\boldsymbol\varepsilon,
\qquad
\mathbf w(x)
=
B(B^\top B)^{-1}\mathbf b(x).
$$

By independence,

$$
\begin{aligned}
\mathbb E\!\left[e^{tZ_x}\mid B\right]
&=
\prod_{i=1}^n
\mathbb E\!\left[
e^{t w_i(x)\varepsilon_i}\mid B
\right]\\
&\leq
\prod_{i=1}^n
\exp\left(
\frac{K_\varepsilon^2t^2w_i(x)^2}{2}
\right)\\
&=
\exp\left(
\frac{K_\varepsilon^2t^2\|\mathbf w(x)\|_2^2}{2}
\right).
\end{aligned}
$$

Chernoff’s method now gives

$$
\Pr(Z_x\geq u\mid B)
\leq
\inf_{t>0}
\exp\left\{
-tu+
\frac{K_\varepsilon^2t^2\|\mathbf w(x)\|_2^2}{2}
\right\}.
$$

The minimizing value is

$$
t=
\frac{u}
{K_\varepsilon^2\|\mathbf w(x)\|_2^2},
$$

which yields

$$
\Pr(|Z_x|>u\mid B)
\leq
2\exp\left\{
-\frac{u^2}
{2K_\varepsilon^2\|\mathbf w(x)\|_2^2}
\right\}.
$$

Furthermore,

$$
\|\mathbf w(x)\|_2^2
=
\mathbf b(x)^\top(B^\top B)^{-1}\mathbf b(x)
\lesssim
\frac{J}{n},
$$

so

$$
\Pr(|Z_x|>u\mid B)
\leq
2\exp\left(
-\frac{cnu^2}{K_\varepsilon^2J}
\right).
$$

This is the pointwise sub-Gaussian tail at the natural variance scale $J/n$.

### The coefficient maximum

Each coordinate

$$
\delta_j
=
\mathbf e_j^\top(B^\top B)^{-1}B^\top\boldsymbol\varepsilon
$$

is sub-Gaussian. Its variance proxy is bounded by

$$
K_\varepsilon^2
\left\{
(B^\top B)^{-1}
\right\}_{jj}
\lesssim
K_\varepsilon^2\frac{J}{n}.
$$

A union bound therefore gives

$$
\Pr\left(
\max_{1\leq j\leq J}|\delta_j|>u
\,\middle|\,B
\right)
\leq
2J\exp\left(
-\frac{cnu^2}{K_\varepsilon^2J}
\right).
$$

Taking

$$
u\asymp
K_\varepsilon
\sqrt{\frac{J\log J}{n}}
$$

makes the right-hand side small. Hence

$$
\|\boldsymbol\delta\|_\infty
=
O_p\left(
K_\varepsilon
\sqrt{\frac{J\log J}{n}}
\right).
$$

The $\log J$ term is the complexity cost of simultaneously controlling $J$ correlated coefficient errors.

### The continuum supremum

Because the basis is nonnegative and sums to one,

$$
\begin{aligned}
|Z_x|
&=
\left|
\sum_{j=1}^{J}B_{j,q}(x)\delta_j
\right|\\
&\leq
\sum_{j=1}^{J}
B_{j,q}(x)|\delta_j|\\
&\leq
\max_{1\leq j\leq J}|\delta_j|.
\end{aligned}
$$

Therefore the exact deterministic inequality

$$
\sup_{x\in[a,b]}|Z_x|
\leq
\|\boldsymbol\delta\|_\infty
$$

converts a continuum supremum into a finite maximum. It follows that

$$
\sup_x|Z_x|
=
O_p\left(
K_\varepsilon
\sqrt{\frac{J\log J}{n}}
\right).
$$

This reduction is unusually clean. For a generic basis or a generic process $Z_t$, one usually introduces the intrinsic semimetric

$$
d(s,t)^2
=
\mathbb E\{(Z_s-Z_t)^2\mid B\}
$$

and controls the process through covering numbers

$$
N(T,d,\epsilon)
$$

or entropy integrals. The positive partition-of-unity structure of B-splines supplies a sharper direct route for the function itself.

### Uniform bias and the final sup-norm rate

Assume additionally:

1. $f_0\in C^s[a,b]$, with $0<s\leq q+1$;
2. the empirical spline projection is stable from the sup norm to the sup norm;
3. the design is regular and the knots are quasi-uniform;
4. $J\log J/n\to0$.

Let $\Pi_{J,n}$ denote the empirical least-squares projection evaluated on $[a,b]$. Since $\Pi_{J,n}s=s$ for $s\in\mathcal S_{q,\tau}$,

$$
\begin{aligned}
\|\Pi_{J,n}f_0-f_0\|_\infty
&\leq
\|\Pi_{J,n}(f_0-s_J)\|_\infty
+
\|s_J-f_0\|_\infty\\
&\leq
\left(
1+
\|\Pi_{J,n}\|_{\infty\to\infty}
\right)
\|s_J-f_0\|_\infty\\
&\lesssim
J^{-s}.
\end{aligned}
$$

Combining bias and stochastic error gives

$$
\|\widehat f-f_0\|_\infty
=
O_p\left(
J^{-s}
+
\sqrt{\frac{J\log J}{n}}
\right).
$$

Balancing these terms gives

$$
J
\asymp
\left(\frac{n}{\log n}\right)^{1/(2s+1)}
$$

and

$$
\|\widehat f-f_0\|_\infty
=
O_p\left[
\left(
\frac{\log n}{n}
\right)^{s/(2s+1)}
\right].
$$

The logarithmic factor appears because the whole curve is controlled simultaneously.

Uniform Gaussian approximation and valid confidence bands require more than this rate bound. One must approximate the distribution of the supremum and account for approximation bias. Modern series-estimation theory develops such pointwise and uniform results for spline and related bases. [arXiv](https://arxiv.org/abs/1212.0442)

### Derivatives

For a derivative of order $\nu\leq q$, the coefficient-difference identity gives

$$
\|Z^{(\nu)}\|_\infty
\lesssim
h^{-\nu}\|\boldsymbol\delta\|_\infty.
$$

Since $h^{-1}\asymp J$,

$$
\|Z^{(\nu)}\|_\infty
=
O_p\left(
J^\nu
\sqrt{\frac{J\log J}{n}}
\right).
$$

If $f_0\in C^s$ with $s>\nu$, the derivative approximation bias is $O(J^{-(s-\nu)})$. Thus

$$
\|\widehat f^{(\nu)}-f_0^{(\nu)}\|_\infty
=
O_p\left(
J^{-(s-\nu)}
+
J^\nu\sqrt{\frac{J\log J}{n}}
\right).
$$

Derivative estimation is harder because differentiation amplifies high-frequency coefficient variation by $h^{-\nu}$.

### Multiple curves or components

Suppose $p$ separate spline objects each have $J$ coefficient errors. A direct union bound over all coordinates produces

$$
\max_{1\leq k\leq p}
\|\widehat f_k-\mathbb E\widehat f_k\|_\infty
=
O_p\left(
\sqrt{\frac{J\log(pJ)}{n}}
\right)
$$

under comparable sub-Gaussian and Gram-stability assumptions.

The complexity has increased from $\log J$ to $\log(pJ)$. In joint additive or multivariate models, cross-component dependence and identifiability constraints must also be incorporated, but the counting principle remains informative.

---

## Penalized B-splines

Regression splines control complexity by selecting $J$ and the knot locations. Penalized B-splines allow a relatively rich basis and suppress rough coefficient patterns through regularization.

Eilers and Marx popularized the term P-spline for a B-spline basis combined with a discrete difference penalty. Their construction also extends naturally to non-Gaussian likelihoods. [Project Euclid](https://projecteuclid.org/journals/statistical-science/volume-11/issue-2/Flexible-smoothing-with-B-splines-and-penalties/10.1214/ss/1038425655.full)

### Optimization problem

Let $D_r$ be the matrix computing $r$th-order coefficient differences:

$$
D_r\boldsymbol\beta
=
(\Delta^r\beta_{r+1},\ldots,\Delta^r\beta_J)^\top.
$$

Define

$$
P_r=D_r^\top D_r.
$$

The penalized estimator is

$$
\widehat{\boldsymbol\beta}_\lambda
=
\arg\min_{\boldsymbol\beta}
\left\{
\|\mathbf Y-B\boldsymbol\beta\|_2^2
+
\lambda\boldsymbol\beta^\top P_r\boldsymbol\beta
\right\}.
$$

The first term measures data misfit. The second suppresses large $r$th differences. For $r=2$, it penalizes changes in adjacent slopes of the coefficient sequence.

Differentiating the criterion gives

$$
-2B^\top(\mathbf Y-B\boldsymbol\beta)
+
2\lambda P_r\boldsymbol\beta=0,
$$

so

$$
(B^\top B+\lambda P_r)
\widehat{\boldsymbol\beta}_\lambda
=
B^\top\mathbf Y.
$$

Provided

$$
\operatorname{null}(B)
\cap
\operatorname{null}(D_r)
=
\{0\},
$$

the solution is unique:

$$
\widehat{\boldsymbol\beta}_\lambda
=
(B^\top B+\lambda P_r)^{-1}B^\top\mathbf Y.
$$

The fitted values satisfy

$$
\widehat{\mathbf f}_\lambda
=
S_\lambda\mathbf Y,
$$

where

$$
S_\lambda
=
B(B^\top B+\lambda P_r)^{-1}B^\top
$$

is the smoother matrix.

### Scaling conventions for $\lambda$

Some authors minimize

$$
\frac1n\|\mathbf Y-B\boldsymbol\beta\|_2^2
+
\lambda_{\mathrm{mean}}
\boldsymbol\beta^\top P_r\boldsymbol\beta.
$$

Others use the unscaled residual sum of squares above. The two criteria agree when

$$
\lambda_{\mathrm{sum}}
=
n\lambda_{\mathrm{mean}}.
$$

Numerical values of $\lambda$ are therefore meaningless without the loss-scaling convention. Penalty matrices may also contain powers of the knot spacing, which changes the numerical scale again.

### Spectral mechanism and effective dimension

Assume $B$ has full column rank and write

$$
G=B^\top B,
\qquad
P=P_r.
$$

Consider the positive semidefinite matrix

$$
R=G^{-1/2}PG^{-1/2}.
$$

Let

$$
R=U\operatorname{diag}(\rho_1,\ldots,\rho_J)U^\top.
$$

In the transformed coordinates, the penalized estimator multiplies each unpenalized least-squares coordinate by

$$
a_k(\lambda)
=
\frac{1}{1+\lambda\rho_k}.
$$

These are exact shrinkage factors. Directions with large penalty eigenvalues $\rho_k$ are strongly attenuated. Directions in the null space of $P$ have $\rho_k=0$ and remain unpenalized.

The effective degrees of freedom are

$$
\operatorname{df}(\lambda)
=
\operatorname{tr}(S_\lambda)
=
\sum_{k=1}^{J}
\frac{1}{1+\lambda\rho_k}.
$$

For an $r$th-difference penalty, $\operatorname{null}(D_r)$ has dimension $r$. Consequently,

$$
\lim_{\lambda\to\infty}
\operatorname{df}(\lambda)=r
$$

under the standard full-rank setup. The limiting fit lies in the unpenalized low-order polynomial component represented by the penalty null space.

The stochastic variance of the fitted vector is governed by

$$
\frac{\sigma^2}{n}\operatorname{tr}(S_\lambda^2)
=
\frac{\sigma^2}{n}
\sum_{k=1}^{J}
\frac{1}{(1+\lambda\rho_k)^2}.
$$

Thus $\operatorname{tr}(S_\lambda)$ and $\operatorname{tr}(S_\lambda^2)$ have related yet distinct meanings. The first is a sensitivity or effective-dimension measure. The second enters the average variance. For an unpenalized projection, $S_0^2=S_0$, so both equal $J$.

### Approximation bias and shrinkage bias

Suppose initially that the true fitted-value vector lies exactly in the spline space:

$$
\mathbf f_0=B\boldsymbol\beta_0.
$$

Then

$$
\begin{aligned}
\mathbb E(\widehat{\boldsymbol\beta}_\lambda\mid B)
-\boldsymbol\beta_0
&=
(G+\lambda P)^{-1}G\boldsymbol\beta_0
-\boldsymbol\beta_0\\
&=
-\lambda(G+\lambda P)^{-1}P\boldsymbol\beta_0.
\end{aligned}
$$

This is the exact shrinkage bias. It vanishes for coefficient directions in $\operatorname{null}(P)$.

When $f_0$ is outside the spline space, the total bias has two components:

$$
\text{total bias}
=
\text{spline approximation bias}
+
\text{penalty shrinkage bias}.
$$

These two sources must be separated in asymptotic analysis and inference.

### Why difference penalties measure roughness

For equally spaced knots,

$$
\int\{s^{(r)}(x)\}^2dx
\asymp
h^{1-2r}\|D_r\boldsymbol\beta\|_2^2.
$$

Thus

$$
\|D_r\boldsymbol\beta\|_2^2
\asymp
h^{2r-1}
\int\{s^{(r)}(x)\}^2dx.
$$

The difference penalty is therefore a discrete surrogate for integrated squared derivative roughness. Its scaling with $h$ may be absorbed into $\lambda$, explaining why smoothing parameters from different basis sizes or software conventions cannot be compared directly.

Raw coefficient differences have their clean derivative interpretation for equally spaced knots. With unevenly spaced knots, equal changes in coefficient index correspond to unequal changes in $x$. Scaled difference operators or direct derivative penalties then provide a more coherent physical-space roughness measure. [arXiv](https://arxiv.org/html/2201.06808v2)

### Bayesian and mixed-model interpretation

Under Gaussian errors,

$$
\mathbf Y\mid\boldsymbol\beta
\sim
N(B\boldsymbol\beta,\sigma^2I),
$$

and a Gaussian prior with formal density

$$
\pi(\boldsymbol\beta)
\propto
\exp\left\{
-\frac{1}{2\tau^2}
\boldsymbol\beta^\top P\boldsymbol\beta
\right\}
$$

leads to the posterior criterion

$$
\|\mathbf Y-B\boldsymbol\beta\|_2^2
+
\frac{\sigma^2}{\tau^2}
\boldsymbol\beta^\top P\boldsymbol\beta.
$$

Hence

$$
\lambda=\frac{\sigma^2}{\tau^2}
$$

under this scaling. Because $P$ is usually singular, the prior is improper along its null space. A proper mixed-model formulation separates the null-space coefficients as fixed effects and the penalized coordinates as Gaussian random effects.

### P-splines and smoothing splines

A smoothing spline solves an infinite-dimensional variational problem such as

$$
\min_f
\left\{
\sum_{i=1}^n(Y_i-f(x_i))^2
+
\lambda\int\{f^{(m)}(x)\}^2dx
\right\}.
$$

Its solution is a natural spline of degree $2m-1$ with knots at the distinct design points.

A P-spline uses a chosen finite B-spline basis and a coefficient-difference penalty. The two procedures can become asymptotically similar in suitable regimes. Their behavior depends jointly on the number of knots and the penalty strength: some regimes resemble regression splines, while others resemble smoothing splines or equivalent-kernel estimators. [OUP Academic](https://academic.oup.com/biomet/article-abstract/95/2/415/230334)

---

## Applications

### Application I: univariate Gaussian regression and uncertainty

Suppose the data satisfy

$$
Y_i=f_0(X_i)+\varepsilon_i,
\qquad
\varepsilon_i\overset{\mathrm{iid}}{\sim}N(0,\sigma^2).
$$

A standard construction uses cubic B-splines, $q=3$, and a second-difference penalty, $r=2$:

$$
\widehat{\boldsymbol\beta}
=
(B^\top B+\lambda D_2^\top D_2)^{-1}B^\top\mathbf Y.
$$

The correspondence with the general framework is:

$$
\begin{array}{ccl}
\text{unknown object} &:& f_0,\\
\text{approximation space} &:& \mathcal S_{3,\tau},\\
\text{finite parameter} &:& \boldsymbol\beta\in\mathbb R^J,\\
\text{data fit} &:& \|\mathbf Y-B\boldsymbol\beta\|_2^2,\\
\text{roughness} &:& \|D_2\boldsymbol\beta\|_2^2,\\
\text{complexity} &:& \operatorname{df}(\lambda).
\end{array}
$$

The cubic degree provides continuous second derivatives at simple knots. The second-difference penalty discourages rapidly changing local slopes. The basis dimension determines available spatial resolution, while $\lambda$ determines how much of that resolution is used.

For an unpenalized regression spline,

$$
\widehat{\operatorname{Var}}\{\widehat f(x)\mid B\}
=
\widehat\sigma^2
\mathbf b(x)^\top(B^\top B)^{-1}\mathbf b(x).
$$

For a penalized estimator, let

$$
A_\lambda=B^\top B+\lambda P.
$$

The frequentist conditional variance is

$$
\operatorname{Var}\{\widehat f_\lambda(x)\mid B\}
=
\sigma^2
\mathbf b(x)^\top
A_\lambda^{-1}B^\top B A_\lambda^{-1}
\mathbf b(x).
$$

This formula measures repeated-sampling variation around $\mathbb E\widehat f_\lambda(x)$. A Gaussian posterior covariance based on the penalty prior often contains

$$
\sigma^2\mathbf b(x)^\top A_\lambda^{-1}\mathbf b(x),
$$

which is a different quantity.

A nominal pointwise interval of the form

$$
\widehat f(x)
\pm
z_{1-\alpha/2}
\widehat{\operatorname{se}}\{\widehat f(x)\}
$$

is centered at a biased estimator. Frequentist coverage requires that approximation and shrinkage biases be negligible relative to the standard error, or that they be estimated and corrected. Prediction-optimal smoothing typically leaves bias of the same order as standard deviation. Undersmoothing, explicit bias correction, or a calibrated Bayesian interpretation is therefore required for valid inference.

For simultaneous bands, replacing $z_{1-\alpha/2}$ by a pointwise larger constant is insufficient. One needs the distribution of

$$
\sup_x
\frac{|\widehat f(x)-\mathbb E\widehat f(x)|}
{\operatorname{se}\{\widehat f(x)\}},
$$

usually obtained through Gaussian approximation, multiplier bootstrap, or simulation from the fitted Gaussian process, followed by separate treatment of bias.

---

### Application II: generalized additive models

Let $Y_i$ belong to an exponential family, with conditional mean $\mu_i$. A generalized additive model specifies

$$
g(\mu_i)
=
\alpha
+
\sum_{k=1}^{p}f_k(X_{ik}),
$$

where $g$ is a link function. Expand each component as

$$
f_k(x)
=
\mathbf b_k(x)^\top\boldsymbol\beta_k.
$$

Collecting the bases gives

$$
\eta
=
\alpha\mathbf 1
+
B_1\boldsymbol\beta_1
+\cdots+
B_p\boldsymbol\beta_p.
$$

The penalized likelihood estimator minimizes

$$
-2\ell(\alpha,\boldsymbol\beta_1,\ldots,\boldsymbol\beta_p)
+
\sum_{k=1}^{p}
\lambda_k
\boldsymbol\beta_k^\top P_k\boldsymbol\beta_k.
$$

Every smooth term has its own basis dimension, roughness penalty, and effective degrees of freedom.

#### Identifiability

The decomposition is unchanged if a constant is added to one $f_k$ and subtracted from $\alpha$. A standard constraint is

$$
\sum_{i=1}^{n}f_k(X_{ik})=0
$$

for every component. This centers each smooth over the observed covariate values and makes $\alpha$ identifiable.

#### Penalized iteratively reweighted least squares

At a current parameter value, the log-likelihood is approximated quadratically. Let $\mathbf z$ be the working response and $W$ the diagonal working-weight matrix. Writing the combined design matrix as

$$
\mathcal B=
[\mathbf 1,B_1,\ldots,B_p]
$$

and the block penalty as

$$
P_\lambda
=
\operatorname{blockdiag}
(0,\lambda_1P_1,\ldots,\lambda_pP_p),
$$

one iteration solves

$$
(\mathcal B^\top W\mathcal B+P_\lambda)
\widehat{\boldsymbol\theta}
=
\mathcal B^\top W\mathbf z.
$$

Thus a non-Gaussian additive model repeatedly reduces to a weighted penalized spline problem. The optimization mechanism remains quadratic after local Taylor expansion of the likelihood.

The total nominal dimension is approximately $\sum_kJ_k$, while effective complexity is closer to

$$
\sum_{k=1}^{p}\operatorname{df}_k(\lambda_k),
$$

subject to cross-component dependence. Simultaneous control over all components introduces complexity involving the total number of active coordinates, heuristically $\log(\sum_kJ_k)$ or $\log(pJ)$ when the components have comparable dimensions.

The additive assumption prevents the basis dimension from growing as a product across covariates. It is a structural response to the curse of dimensionality.

---

### Application III: tensor-product spline surfaces

Suppose

$$
Y_i=f_0(X_i,Z_i)+\varepsilon_i
$$

and no additive decomposition is imposed. Let

$$
\{B_j^{(x)}:1\leq j\leq J_x\},
\qquad
\{B_k^{(z)}:1\leq k\leq J_z\}
$$

be univariate B-spline bases. A tensor-product representation is

$$
f(x,z)
=
\sum_{j=1}^{J_x}
\sum_{k=1}^{J_z}
\theta_{jk}
B_j^{(x)}(x)B_k^{(z)}(z).
$$

In vector form,

$$
f(x,z)
=
\left\{
\mathbf b_z(z)\otimes\mathbf b_x(x)
\right\}^\top
\boldsymbol\theta.
$$

The parameter dimension is

$$
J_xJ_z.
$$

At each $(x,z)$, only

$$
(q_x+1)(q_z+1)
$$

basis products are nonzero. Local support therefore keeps the design matrix sparse. The number of coefficients still grows multiplicatively.

An anisotropic penalty can be written as

$$
P_{\lambda}
=
\lambda_x
\left(
I_{J_z}\otimes D_x^\top D_x
\right)
+
\lambda_z
\left(
D_z^\top D_z\otimes I_{J_x}
\right).
$$

The first term penalizes roughness in the $x$-direction and the second in the $z$-direction. Separate smoothing parameters allow different regularity scales along the two axes.

If $f_0$ has anisotropic smoothness $s_x,s_z$, a typical approximation bound is

$$
\inf_f\|f-f_0\|
\lesssim
J_x^{-s_x}+J_z^{-s_z},
$$

while the unpenalized variance scale is

$$
\frac{J_xJ_z}{n}.
$$

In $d$ isotropic dimensions, using $K$ basis functions per coordinate gives total dimension $K^d$ and the schematic integrated-risk bound

$$
K^{-2s}+\frac{K^d}{n}.
$$

Balancing gives

$$
K\asymp n^{1/(2s+d)}
$$

and

$$
\operatorname{MSE}
\asymp
n^{-2s/(2s+d)}.
$$

This is the curse of dimensionality: the denominator $2s+d$ worsens with dimension. Local basis sparsity reduces computational cost, while the statistical information requirement still depends on the total dimension. Stone’s general nonparametric rates exhibit this same dimension-dependent structure. [Project Euclid](https://projecteuclid.org/journals/annals-of-statistics/volume-10/issue-4/Optimal-global-rates-of-convergence-for-nonparametric-regression/10.1214/aos/1176345969.full)

An additive model replaces the product dimension $K^d$ by a sum of univariate dimensions. The improved rate comes from the structural assumption, not from a special numerical property of B-splines.

---

## Boundaries, counterexamples, and common errors

### A fixed number of knots leaves permanent bias

Suppose $J$ remains fixed as $n\to\infty$, while $f_0\notin\mathcal S_{q,\tau}$. The variance term $J/n$ vanishes, but

$$
\inf_{s\in\mathcal S_{q,\tau}}\|s-f_0\|^2
$$

remains positive. The estimator converges to the best projection of $f_0$ onto a fixed finite-dimensional space, not to $f_0$.

Consistency for a general smooth $f_0$ requires an expanding space, typically $J\to\infty$, together with $J/n\to0$ or a related regularized condition.

### Degree, order, knots, and basis dimension are different quantities

For $L$ simple interior knots and degree $q$,

$$
J=L+q+1.
$$

The order is $q+1$. Repeated boundary knots are part of the augmented knot vector and do not count as additional interior breakpoints. Confusing these quantities can lead to incorrect dimension calculations and incompatible software specifications.

### Coefficients are generally not function values

For linear hat functions,

$$
s(\kappa_j)=\beta_j.
$$

For cubic and higher-degree B-splines, this identity generally fails. A coefficient is associated with a local basis function or control location, commonly a Greville abscissa, and is best interpreted as a local coordinate. Pointwise inference about $\beta_j$ is not automatically pointwise inference about $f_0(x)$.

### B-splines, regression splines, natural splines, and P-splines

A B-spline is a basis function, or a representation using that basis. It does not determine how coefficients are estimated.

A regression spline estimates unpenalized coefficients in a chosen finite spline space. A P-spline uses a B-spline basis with a difference penalty. A smoothing spline solves an integrated-derivative variational problem. A natural cubic spline is a cubic spline satisfying boundary restrictions that produce linear tails.

These procedures may span related spaces or have related asymptotics, but their estimators, penalties, boundary conditions, and effective dimensions differ.

### Design gaps can destroy identifiability

Suppose a basis function $B_j$ has support in an interval containing no design points. Then the $j$th column of the design matrix may be zero. The Gram matrix $B^\top B$ is singular, and the associated local feature is unidentified by the data.

More generally, stable estimation requires enough observations in each local support region. For random designs, a density bounded away from zero and a condition such as

$$
\frac{n h}{\log J}\to\infty
$$

ensure that local cells receive sufficient observations with high probability. Closely clustered knots or sparse design regions can invalidate the Gram-matrix bound

$$
G_n\asymp hI.
$$

### Discontinuities invalidate uniform approximation by smooth splines

Consider

$$
f_0(x)=\mathbf 1\{x\geq1/2\}.
$$

Every cubic spline with simple knots is continuous. A sequence of continuous functions cannot converge uniformly to a discontinuous function. Hence

$$
\inf_{s\in\mathcal S_{3,\tau}}
\|s-f_0\|_\infty
\not\to0
$$

for any sequence of simple-knot cubic spline spaces enforcing continuity at $1/2$.

Possible remedies include a repeated knot of multiplicity $q+1$, separate smooths on either side of a known change point, or a loss such as $L_2$ under which approximation near one point can still be accurate globally. Smoothness assumptions are substantive model assumptions.

### Increasing degree does not repair low regularity

If $f_0\in C^s$ and $q+1>s$, the approximation rate remains $J^{-s}$. A very high spline degree may worsen numerical constants and increase support width without changing the asymptotic power. In statistical smoothing, cubic splines are common because they provide two continuous derivatives with compact support over four adjacent knot intervals; they are not universally optimal.

### Boundary behavior is part of the model

Near $a$ and $b$, basis functions are asymmetric and less data are available on one side. Clamped B-splines, natural splines, cyclic splines, and unconstrained regression splines impose different boundary structures.

Extrapolation outside $[a,b]$ is especially fragile. Software may return zero, continue the outer polynomial pieces, or impose natural linear tails. Data inside the interval cannot identify arbitrary behavior outside it. Extrapolation is determined mainly by the boundary convention.

### Uneven knots and raw difference penalties

With equally spaced knots, $\Delta^r\beta_j$ corresponds to an $r$th derivative multiplied by $h^r$. With irregular knots, the physical distances between neighboring coefficient locations vary. The unscaled penalty

$$
\sum_j(\Delta^r\beta_j)^2
$$

then treats equal index increments as equal spatial increments.

Quantile-based knots may improve data allocation under a highly nonuniform design, while simultaneously making an unscaled difference penalty harder to interpret in $x$-space. Scaled divided differences or an integrated derivative penalty resolve this mismatch.

### Smoothing-parameter selection and inference pursue different losses

Cross-validation, generalized cross-validation, marginal likelihood, and restricted maximum likelihood usually target prediction or an integrated fitting criterion. Their selected $\lambda$ does not automatically make shrinkage bias negligible for pointwise or uniform inference.

Ignoring the randomness of $\widehat\lambda$ can also understate uncertainty. In many regular settings its first-order impact is small, although this conclusion requires proof for the particular inferential target.

Data-dependent knot selection creates a further model-selection layer. Standard errors conditional on the selected knots ignore selection uncertainty.

### Heteroscedastic errors change the variance term

If

$$
\operatorname{Cov}(\boldsymbol\varepsilon\mid B)=\Omega,
$$

then for an unpenalized spline,

$$
\operatorname{Var}(\widehat{\boldsymbol\beta}\mid B)
=
(B^\top B)^{-1}B^\top\Omega B(B^\top B)^{-1}.
$$

The exact average variance is no longer $\sigma^2J/n$. Weighted least squares is efficient when $\Omega$ is known up to scale; otherwise a sandwich covariance estimator is needed.

### Heavy tails change the proof tool

The MGF derivation in Section 6 requires sub-Gaussian errors. With only a finite second moment, the estimator can retain an $L_2$ risk of order $J/n$, while exponential tail inequalities generally disappear. Uniform control based on a direct union bound becomes weaker.

Robust alternatives include Huber loss, median-of-means aggregation, truncation, and robust covariance estimation. Under dependence, the factorization

$$
\mathbb E e^{t\sum_iw_i\varepsilon_i}
=
\prod_i\mathbb E e^{tw_i\varepsilon_i}
$$

also fails. Mixing, martingale, or block arguments then replace the independence calculation.

### Squaring changes the tail class

A linear combination of independent sub-Gaussian errors remains sub-Gaussian. Quadratic transformations behave differently. If $Z$ is sub-Gaussian, then

$$
Z^2-\mathbb EZ^2
$$

is generally sub-exponential. Consequently, residual sums of squares, variance estimators, and quadratic forms in spline coefficient errors should be controlled with Bernstein-type or Hanson–Wright inequalities. Applying a sub-Gaussian tail bound directly to these squared quantities gives the wrong tail rate.

### Positivity of the basis does not force positivity of the fitted function

The basis functions satisfy $B_j(x)\geq0$, but negative coefficients can produce a negative fitted function. A sufficient condition for

$$
s(x)\geq0\quad\text{for every }x
$$

is

$$
\beta_j\geq0\quad\text{for every }j.
$$

Likewise, because

$$
s'(x)
=
\sum_j c_jB_{j,q-1}(x),
$$

nonnegative scaled first differences provide a sufficient condition for monotonicity. Such coefficient restrictions turn shape-constrained spline estimation into a quadratic or convex optimization problem.

---

## A transferable analysis template

The following procedure applies to spline regression and, with suitable changes, to other series and sieve estimators.

1. **Define the statistical target and loss.** Specify whether the goal is pointwise estimation, integrated risk, sup-norm control, derivative estimation, prediction, or simultaneous inference.
2. **Specify the approximation space.** Record the degree $q$, interior knots, multiplicities, boundary convention, number of basis functions $J$, and mesh width $h$.
3. **Establish deterministic approximation.** Prove or invoke

    $$
    \inf_{s\in\mathcal S_J}\|f_0-s\|
    \lesssim
    J^{-s}.
    $$

    This identifies the bias scale and the smoothness actually used.
4. **Establish basis and design stability.** Typical conditions are

    $$
    \|s\|_\infty\asymp\|\boldsymbol\beta\|_\infty,
    \qquad
    \|s\|_{L_2}^2\asymp J^{-1}\|\boldsymbol\beta\|_2^2,
    \qquad
    G_n\asymp J^{-1}I.
    $$
5. **Derive the estimator from its optimization problem.** For least squares or penalized likelihood, write the normal equations, smoother matrix, and penalty null space.
6. **Decompose the error.** Separate

    $$
    \widehat f-f_0
    =
    \text{approximation bias}
    +
    \text{regularization bias}
    +
    \text{stochastic error}.
    $$
7. **Identify the relevant complexity.** A single point uses a variance proxy. A maximum over $J$ coefficients introduces $\log J$. Multiple components can introduce $\log(pJ)$. General function classes require covering numbers or entropy.
8. **Balance bias and stochastic error.** For univariate regression splines,

    $$
    J^{-2s}+\frac{J}{n}
    $$

    determines the integrated-risk choice of $J$. Penalized estimators replace $J$ by a spectrum of shrinkage factors.
9. **Separate estimation from inference.** Verify that bias is negligible, corrected, or explicitly incorporated. Pointwise normality does not establish uniform-band validity.
10. **Stress-test the assumptions.** Examine design gaps, knot irregularity, boundaries, discontinuities, heteroscedasticity, dependence, heavy tails, data-dependent tuning, and the distinction between nominal and effective dimension.

The full reasoning chain can be compressed into the following formulaic summary:

$$
Y_i=f_0(X_i)+\varepsilon_i
$$

$$
\Downarrow
$$

$$
f_0(x)
\approx
\mathbf b(x)^\top\boldsymbol\beta,
\qquad
\inf_{s\in\mathcal S_J}\|f_0-s\|
\lesssim
J^{-s}
$$

$$
\Downarrow
$$

$$
\widehat{\boldsymbol\beta}_\lambda
=
(B^\top B+\lambda P)^{-1}B^\top\mathbf Y
$$

$$
\Downarrow
$$

$$
\widehat f-f_0
=
\underbrace{\text{approximation bias}}_{J^{-s}}
+
\underbrace{\text{shrinkage bias}}_{\lambda P}
+
\underbrace{
\mathbf b^\top
(B^\top B+\lambda P)^{-1}B^\top\boldsymbol\varepsilon
}_{\text{random linear term}}
$$

$$
\Downarrow
$$

$$
\text{pointwise stochastic scale}
\asymp
\sqrt{\frac{J}{n}},
\qquad
\text{uniform stochastic scale}
\asymp
\sqrt{\frac{J\log J}{n}}
$$

$$
\Downarrow
$$

$$
\operatorname{MSE}
\lesssim
J^{-2s}+\frac{J}{n},
\qquad
J\asymp n^{1/(2s+1)},
\qquad
\operatorname{MSE}
\asymp
n^{-2s/(2s+1)}.
$$
