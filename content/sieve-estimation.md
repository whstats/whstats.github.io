---
title: Sieve Estimation
description: A systematic account of why sieve estimators arise, how approximation and stochastic complexity determine their behavior, and how the method operates in nonparametric and semiparametric statistics.
aliases:
  - Method of Sieves
  - Sieve Estimators
tags:
  - nonparametric-statistics
  - semiparametric-statistics
  - series-estimation
  - empirical-processes
lang: en
---

## Content breakdown

The central question is how to estimate an unknown function, distribution, or other infinite-dimensional object by optimizing a sample criterion without allowing the sample optimization to become ill posed. The explanation proceeds in the order forced by that question.

First, we examine a representative nonparametric regression problem and a density-estimation problem in which the population criterion identifies the target, yet unrestricted empirical optimization overfits or has no maximizer. This separates the statistical difficulty from identification at the population level. Second, we introduce a sieve as a sample-size-dependent approximation space and define the resulting sieve extremum estimator. At that stage the key objects are the *population sieve target*, which records deterministic approximation error, and the empirical optimizer around that target, which records stochastic error.

Third, we derive the generic rate mechanism. Local curvature of the population criterion converts excess criterion value into distance from the target, while the local empirical-process modulus measures how much random fluctuation is available to defeat that curvature. In a regular $K$-dimensional sieve, this produces the familiar stochastic scale $\sqrt{K/n}$. Combining it with an approximation error of order $K^{-s/d}$ explains the nonparametric rate $n^{-s/(2s+d)}$ and the curse of dimensionality. Fourth, we prove this mechanism in full for series least squares. The proof uses an exact projection identity, sample Gram-matrix stability, and a variance calculation showing why $K/n$ is the squared estimation error.

The remaining sections show how the same logic changes across statistical problems. A sieve maximum-likelihood estimator for a density replaces an unbounded unrestricted likelihood by a growing exponential family. A partially linear model shows how a finite-dimensional parameter can remain root-$n$ estimable even when its nuisance function is estimated much more slowly. A nonparametric instrumental-variables problem shows what changes when the criterion controls only a weakened, indirect image of the target: an inverse-operator factor amplifies the stochastic error. The final sections discuss tuning, assumptions, counterexamples, and the conceptual synthesis tying these cases together.

## The problem that creates the method

### Population identification does not guarantee a usable empirical optimizer

Consider independent observations $Z_i=(Y_i,X_i)$, $i=1,\ldots,n$, satisfying

$$
Y_i=g_0(X_i)+\varepsilon_i,
\qquad
\mathbb E[\varepsilon_i\mid X_i]=0,
$$

where $X_i\in[0,1]^d$ and the conditional mean function $g_0$ is unknown. Suppose the inferential target is the entire function $g_0$, measured in the population norm

$$
\|g\|_{L^2(P_X)}^2=\mathbb E[g(X)^2].
$$

The natural population least-squares criterion is

$$
Q(g)=\mathbb E[(Y-g(X))^2].
$$

Its role follows directly from the conditional-mean assumption. Expanding around $g_0$ gives

$$
\begin{aligned}
Q(g)-Q(g_0)
&=\mathbb E\big[(g(X)-g_0(X))^2\big]
  -2\mathbb E\big[\varepsilon\{g(X)-g_0(X)\}\big]\\
&=\|g-g_0\|_{L^2(P_X)}^2,
\end{aligned}
$$

because the cross term is zero after conditioning on $X$. Thus $g_0$ is uniquely identified in $L^2(P_X)$ by minimizing $Q$. At the population level, the problem appears completely regular: excess risk equals squared distance from the truth.

The empirical analogue is

$$
Q_n(g)=\frac1n\sum_{i=1}^n\{Y_i-g(X_i)\}^2.
$$

If one minimizes $Q_n$ over all measurable functions, the problem becomes meaningless. When the observed $X_i$ are distinct, one can choose a function satisfying $g(X_i)=Y_i$ for every $i$, with arbitrary values elsewhere. Then $Q_n(g)=0$. There are infinitely many such empirical minimizers, and the data impose no restrictions on their behavior away from the observed design points. Population identification remains intact. The empirical class fails because an infinite number of effective degrees of freedom can respond to a sample containing only $n$ locations.

This example exposes the basic tension. A fixed parametric model, such as $g(x)=\beta_0+\beta_1x$, supplies enough restrictions to make empirical estimation stable, but it can retain nonvanishing approximation bias when $g_0$ is nonlinear. An unrestricted function class eliminates parametric approximation bias in principle, yet its empirical optimizer can interpolate noise. A useful procedure needs a restriction strong enough for the current sample and weak enough to disappear as information accumulates.

Density estimation gives an even sharper version of the same problem. Let $X_1,\ldots,X_n$ have an unknown density $f_0$ on $\mathbb R^d$. The population negative log-likelihood is

$$
Q(f)=-\mathbb E_{f_0}[\log f(X)],
$$

and

$$
Q(f)-Q(f_0)=\int f_0(x)\log\frac{f_0(x)}{f(x)}\,dx
=\operatorname{KL}(f_0\|f),
$$

so the population criterion again identifies the target. The unrestricted sample likelihood, however, is unbounded over all densities. To see the mechanism, take a bounded, nonnegative density kernel $K$ with $K(0)>0$ and define

$$
f_h(x)=\frac1n\sum_{i=1}^n h^{-d}K\!\left(\frac{x-X_i}{h}\right).
$$

For sufficiently small $h$, each observation receives a contribution of order $h^{-d}/n$ from the bump centered at itself. Consequently,

$$
\prod_{i=1}^n f_h(X_i)
\gtrsim \left(\frac{K(0)}{nh^d}\right)^n,
$$

which diverges as $h\downarrow0$. The empirical likelihood rewards arbitrarily narrow spikes at the data. A formal maximum-likelihood principle therefore supplies no estimator unless the admissible density class is regularized.

These two examples explain why the method of sieves arises. The target belongs to a large, often infinite-dimensional parameter space because a fixed low-dimensional model is scientifically inadequate. Direct empirical optimization over that space has too much local freedom for a finite sample. The remedy is to replace the full parameter space by a restricted approximation space whose complexity is indexed by sample size.

### The sieve idea and its historical origin

Let $\mathcal G_1,\mathcal G_2,\ldots$ be increasingly rich classes of functions. A simple example is a sequence of linear spans,

$$
\mathcal G_K
=
\left\{x\mapsto p_K(x)'\beta:\beta\in\mathbb R^K\right\},
$$

where $p_K=(p_{1K},\ldots,p_{KK})'$ contains $K$ basis functions. For sample size $n$, choose a dimension $K_n$ and minimize the empirical criterion over $\mathcal G_{K_n}$. The two asymptotic requirements point in opposite directions:

$$
K_n\longrightarrow\infty
\quad\text{and}\quad
K_n\ \text{must grow slowly relative to }n.
$$

The first condition allows the approximation bias to vanish. The second prevents stochastic error and numerical instability from overwhelming the estimate. The estimator therefore follows a *double progression*: more data are collected while the admissible model becomes more complex.

The explicit statistical formulation of the “method of sieves” is associated with Ulf Grenander's 1981 monograph *Abstract Inference*.[^grenander] Geman and Hwang subsequently developed an early general consistency treatment for nonparametric maximum likelihood, emphasizing that ordinary likelihood can fail in infinite-dimensional spaces and that optimization over a growing sequence of approximating spaces restores a usable procedure.[^geman-hwang] The underlying mathematical devices—series truncation, splines, finite partitions, and spectral cutoffs—predate this terminology. The sieve viewpoint supplied a common inferential architecture for them.

The word *sieve* describes what the approximation space does. At a small sample size, only coarse features pass through: low-frequency series terms, a small number of spline pieces, a shallow network, or a mixture with few components. As $n$ increases, the mesh is refined, higher frequencies are admitted, or more components are allowed. The restriction is intentionally temporary. A fixed finite-dimensional model declares that the truth has a permanent finite representation; a sieve declares only that finite resolution is appropriate at the current information level.

This viewpoint is broader than linear series regression. A sieve can consist of splines with an increasing number of knots, wavelets up to a growing resolution level, histograms on increasingly fine partitions, finite mixtures with a growing support bound, neural networks with growing width or depth, or shape-constrained functions represented by an increasing number of coefficients. Linearity is convenient because it yields transparent algebra. The defining feature is controlled approximation by a sequence of statistically manageable spaces.

## From approximation spaces to sieve estimators

### General extremum formulation

Let $Z_1,\ldots,Z_n$ be observations from a distribution $P$, and let the parameter $\theta$ lie in a possibly infinite-dimensional space $\Theta$. Write

$$
Q(\theta)=P\ell_\theta=\mathbb E[\ell_\theta(Z)]
$$

for a population criterion minimized at $\theta_0$, and

$$
Q_n(\theta)=P_n\ell_\theta
=\frac1n\sum_{i=1}^n\ell_\theta(Z_i)
$$

for its empirical version. Maximum likelihood fits this notation by taking $\ell_\theta=-\log p_\theta$. Least squares uses $\ell_g(y,x)=(y-g(x))^2$. Generalized method of moments and minimum-distance procedures use a criterion built from sample moments.

A sieve is a sequence $\Theta_n\subseteq\Theta$ whose complexity may increase with $n$ and whose union approximates the relevant part of $\Theta$. Given a metric or semimetric $d$, the basic approximation requirement at the truth is

$$
\inf_{\theta\in\Theta_n}d(\theta,\theta_0)\longrightarrow0.
$$

Nestedness, $\Theta_n\subseteq\Theta_{n+1}$, is conceptually convenient and common, though it is not logically necessary. Some references reserve *sieve* for finite-dimensional or compact sets. General asymptotic theory only needs an approximation sequence whose stochastic complexity can be controlled. A finite-dimensional set can still be noncompact or admit no optimizer, so coefficient bounds, closure, or a penalty may also be required.

> [!definition] Sieve extremum estimator
> Let $\Theta_n$ be a sieve and let $\eta_n\ge0$ be an optimization tolerance. A sieve extremum estimator is any measurable $\widehat\theta_n\in\Theta_n$ satisfying
>
> $$
> Q_n(\widehat\theta_n)
> \le
> \inf_{\theta\in\Theta_n}Q_n(\theta)+\eta_n.
> $$
>
> For consistency one usually requires $\eta_n=o_p(1)$. For a convergence rate $r_n$, the optimization error generally has to be negligible relative to the criterion scale associated with $r_n$, often $\eta_n=o_p(r_n^2)$ under quadratic curvature.

Allowing approximate minimizers is substantive. Nonlinear sieve optimization may be solved only up to numerical tolerance, and an exact minimizer need not exist. The asymptotic theory should state how accurately the optimization problem must be solved. A silent exact-computation assumption can misstate the estimator being analyzed.

### The population sieve target

The truth may not belong to $\Theta_n$. Consequently, the correct population comparison point is not automatically $\theta_0$. Define a population sieve target by

$$
\theta_{0,n}\in\arg\min_{\theta\in\Theta_n}Q(\theta),
$$

or use an approximate minimizer if the infimum is not attained. This object answers a deterministic question: which member of the current approximation space is best according to the statistical criterion?

The distinction between $\theta_{0,n}$ and a metric projection is essential. In least-squares regression, the population criterion difference is exactly an $L^2(P_X)$ distance, so $\theta_{0,n}$ is an $L^2$ projection. In likelihood estimation, $\theta_{0,n}$ is a Kullback–Leibler projection. In a conditional-moment problem, it may minimize a norm of moment violations. Different criteria can therefore select different approximants from the same sieve.

The total error has the elementary decomposition

$$
d(\widehat\theta_n,\theta_0)
\le
d(\widehat\theta_n,\theta_{0,n})
+
 d(\theta_{0,n},\theta_0).
$$

The second term is deterministic approximation error, often called *sieve bias*. The first is estimation error within the current sieve. Nearly every sieve convergence argument is a refined version of this decomposition. The approximation term decreases as the sieve expands; the estimation term usually increases because a richer empirical optimization problem has more directions in which noise can move the solution.

It is useful to distinguish two approximation quantities:

$$
a_n=d(\theta_{0,n},\theta_0),
\qquad
b_n^2=Q(\theta_{0,n})-Q(\theta_0).
$$

They coincide in scale only when the criterion has suitable curvature in the metric $d$. In direct least squares, $b_n^2=a_n^2$. In an inverse problem, the criterion gap can be much smaller than the structural distance because the data see only a smoothed image of the parameter. This difference will generate the ill-posedness factor in the instrumental-variables application.

### Constructing useful sieves

For a scalar or vector-valued function $h$, the most common linear sieve has the form

$$
\mathcal H_K
=
\{h_\beta:h_\beta(x)=p_K(x)'\beta,\ \beta\in B_K\}.
$$

The basis $p_K$ is chosen to make three properties compatible. First, its span must approximate the expected smoothness or structure of $h_0$. Second, the sample Gram matrix must remain stable as $K$ grows. Third, the basis should make optimization and constraints computationally tractable.

Splines and compactly supported wavelets are local: changing one coefficient affects only a restricted region, which usually improves numerical conditioning and uniform-norm behavior. Trigonometric and orthogonal-polynomial bases are global: they can be natural for periodic or spectrally smooth functions but may have high leverage near boundaries. Tensor products approximate multivariate functions, although the number of basis terms grows rapidly with dimension. Additive, single-index, or low-rank sieves encode structural restrictions that can reduce this dimensional burden.

Basis normalization deserves attention. If $A_K$ is nonsingular, replacing $p_K(x)$ by $A_Kp_K(x)$ leaves the linear span unchanged. In exact unpenalized optimization, it therefore leaves the fitted function unchanged while changing the coefficient vector. The normalization strongly affects the condition number of the design matrix, numerical error, and any coefficient penalty. Statistical statements should consequently use function norms or basis-invariant matrices. Statements in raw coefficient norms require an explicit normalization.

Nonlinear sieves are also common. A neural-network sieve can bound width, depth, and parameter magnitudes as functions of $n$. A finite-mixture sieve can restrict the mixing distribution to at most $K$ support points. A monotone or convex spline sieve imposes linear inequalities on coefficients. For density estimation, a transformed sieve such as

$$
f_\beta(x)
=
\frac{\exp\{p_K(x)'\beta\}}
{\int\exp\{p_K(u)'\beta\}\,du}
$$

builds positivity and unit integral into the parameterization. These examples establish finite-dimensional series as one major implementation. The defining object is a sequence of controlled approximation spaces.

### Hard restrictions and penalties

A sieve is a form of regularization because it removes directions that a finite sample cannot estimate reliably. Penalization retains those directions and assigns them a complexity cost. Let $J(h)$ measure roughness or complexity. The constrained and penalized problems are

$$
\widehat h_R
\in
\arg\min_{J(h)\le R_n}Q_n(h),
$$

and

$$
\widehat h_\lambda
\in
\arg\min_h\{Q_n(h)+\lambda_n J(h)^2\}.
$$

Under convexity and suitable constraint qualification, a Lagrange multiplier links a constrained solution to a penalized solution. Their statistical behavior can nevertheless differ because a hard sieve truncates directions while a penalty shrinks them continuously. In an orthogonal sequence model, retaining the first $K$ coordinates is a hard spectral cutoff; ridge or Tikhonov regularization attenuates all coordinates according to their signal-to-noise ratios. A *penalized sieve estimator* combines both devices by optimizing over a finite but growing approximation space with an additional penalty.[^shen-penalization]

### Why consistency requires a uniform law

Pointwise convergence $Q_n(\theta)\to Q(\theta)$ for every fixed $\theta$ is insufficient because $\widehat\theta_n$ is selected after observing the same empirical fluctuations. The required control is uniform over the growing sieve.

> [!theorem] Prototype consistency theorem for sieve extremum estimators
> Suppose the following conditions hold for a metric $d$.
>
> 1. **Approximation:** there are $\theta_{0,n}\in\Theta_n$ such that $d(\theta_{0,n},\theta_0)\to0$ and $Q(\theta_{0,n})\to Q(\theta_0)$.
> 2. **Uniform stochastic approximation:** $\sup_{\theta\in\Theta_n}|Q_n(\theta)-Q(\theta)|=o_p(1)$.
> 3. **Identification on the sieves:** for every $\epsilon>0$,
>    $$
>    \liminf_{n\to\infty}
>    \inf_{\substack{\theta\in\Theta_n\\ d(\theta,\theta_0)\ge\epsilon}}
>    \{Q(\theta)-Q(\theta_0)\}>0.
>    $$
> 4. **Approximate optimization:** $Q_n(\widehat\theta_n)\le Q_n(\theta_{0,n})+o_p(1)$.
>
> Then $d(\widehat\theta_n,\theta_0)\to_p0$.


> [!proof]+ Proof
> Let $\Delta_n=\sup_{\theta\in\Theta_n}|Q_n(\theta)-Q(\theta)|$. The approximate minimizing property gives
>
> $$
> \begin{aligned}
> Q(\widehat\theta_n)
> &\le Q_n(\widehat\theta_n)+\Delta_n\\
> &\le Q_n(\theta_{0,n})+o_p(1)+\Delta_n\\
> &\le Q(\theta_{0,n})+2\Delta_n+o_p(1).
> \end{aligned}
> $$
>
> By approximation and the uniform law, the right-hand side is $Q(\theta_0)+o_p(1)$. If $d(\widehat\theta_n,\theta_0)\ge\epsilon$, the identification condition forces $Q(\widehat\theta_n)-Q(\theta_0)$ to exceed a fixed positive number for all sufficiently large $n$. The preceding inequality makes that event have probability tending to zero. This holds for every $\epsilon>0$, proving consistency.

The theorem isolates the central stochastic restriction. As $\Theta_n$ expands, a uniform law becomes harder to obtain. In a $K_n$-dimensional smooth class, covering numbers typically grow exponentially in $K_n$. If $K_n$ increases too quickly, the empirical criterion can fluctuate substantially somewhere in the sieve even though it converges at every fixed parameter. The growth restriction on the sieve is therefore an inferential condition as well as a computational constraint.

## Why convergence rates have their form

### Curvature converts criterion error into parameter error

Consistency only says that the estimator enters every fixed neighborhood of the truth. A rate requires a local comparison between deterministic curvature and stochastic fluctuation. Define the excess criterion

$$
\mathcal E(\theta)=Q(\theta)-Q(\theta_0).
$$

In a regular direct problem, the criterion has local quadratic growth:

$$
\mathcal E(\theta)
\ge c\,d(\theta,\theta_0)^2
$$

for $\theta$ near $\theta_0$ and some $c>0$. Least-squares regression has this property with equality and $c=1$ in $L^2(P_X)$. A smooth likelihood has an analogous local expansion in a Fisher-information or Hellinger metric. The condition matters because an empirical criterion can be close to its minimum while its argument remains far from the truth when the population surface is flat.

Let $\theta_{0,n}$ be the population sieve target. The basic inequality from empirical minimization is

$$
Q_n(\widehat\theta_n)
\le
Q_n(\theta_{0,n})+\eta_n.
$$

Adding and subtracting population criteria yields

$$
Q(\widehat\theta_n)-Q(\theta_{0,n})
\le
-(P_n-P)(\ell_{\widehat\theta_n}-\ell_{\theta_{0,n}})
+\eta_n.
$$

This inequality is the engine of the rate analysis. The left side is deterministic curvature evaluated at the random estimator. The right side is a centered empirical-process increment plus optimization error. A rate is obtained by finding a radius at which curvature is too large to be overcome by the largest empirical fluctuation available in that neighborhood.

Write $\mathbb G_n=\sqrt n(P_n-P)$ and suppose that, for a local ball of radius $\delta$ in the sieve,

$$
\sup_{\substack{\theta\in\Theta_n\\d(\theta,\theta_{0,n})\le\delta}}
|\mathbb G_n(\ell_\theta-\ell_{\theta_{0,n}})|
=O_p\{\phi_n(\delta)\}.
$$

If the criterion grows quadratically, the deterministic term at distance $\delta$ has order $\delta^2$, while the stochastic term has order $\phi_n(\delta)/\sqrt n$. The critical radius therefore solves the fixed-point relation

$$
\delta_n^2
\asymp
\frac{\phi_n(\delta_n)}{\sqrt n}.
$$

A rigorous proof localizes the estimator and applies this comparison on dyadic shells: $\delta_n<d\le2\delta_n$, $2\delta_n<d\le4\delta_n$, and so on. On each shell, curvature grows like the square of the radius. Under an appropriate maximal inequality, the probability that the empirical process exceeds that curvature decays across shells. The resulting conclusion has the schematic form

$$
d(\widehat\theta_n,\theta_0)
=O_p(a_n+\delta_n),
$$

where $a_n=d(\theta_{0,n},\theta_0)$ is approximation error. Shen and Wong developed a general version of this rate argument for sieve estimates and related extremum estimators.[^shen-wong]

### Why a regular $K$-dimensional sieve contributes $\sqrt{K/n}$

Suppose the local sieve can be parameterized by a $K$-dimensional Euclidean vector and the loss increment is locally Lipschitz in that vector. A ball of radius $\delta$ has covering numbers of the form

$$
\log N(\epsilon,B_K(\delta),\|\cdot\|_2)
\lesssim
K\log\left(\frac{C\delta}{\epsilon}\right).
$$

The logarithm appears because roughly $(C\delta/\epsilon)^K$ Euclidean balls of radius $\epsilon$ are required to cover a $K$-dimensional ball of radius $\delta$. Integrating the square root of this entropy gives

$$
\int_0^\delta
\sqrt{K\log\left(\frac{C\delta}{\epsilon}\right)}\,d\epsilon
\asymp
\delta\sqrt K.
$$

Thus the local empirical fluctuation is typically

$$
\frac{\phi_n(\delta)}{\sqrt n}
\asymp
\delta\sqrt{\frac Kn}.
$$

Balancing it with quadratic curvature gives

$$
\delta^2
\asymp
\delta\sqrt{\frac Kn},
\qquad\text{hence}\qquad
\delta\asymp\sqrt{\frac Kn}.
$$

The interpretation is direct. The sieve contains $K$ locally estimable coordinates. Each regular coordinate has a noise scale of order $n^{-1/2}$. Aggregating their squared errors produces $K/n$, and taking a norm produces $\sqrt{K/n}$. This is the nonparametric analogue of the Euclidean error of a $K$-parameter estimator, except that $K=K_n$ diverges.

This formula requires qualification. Nonsmooth losses can have a different local modulus. Unbounded envelopes, dependence, high-leverage bases, and uniform-loss objectives can introduce additional factors beyond those arising under integrated loss. The core relation remains the same: the rate is determined by the radius where deterministic separation dominates the supremum of stochastic increments.

### Approximation error and the origin of the nonparametric rate

Suppose $g_0$ is $s$-smooth on $[0,1]^d$, in a Sobolev or Hölder sense appropriate to the chosen loss, and a spline or wavelet sieve uses resolution $J$ in each coordinate. Standard approximation theory gives an error of order

$$
J^{-s}.
$$

A $d$-dimensional tensor-product space at resolution $J$ contains approximately

$$
K\asymp J^d
$$

basis functions. Eliminating $J$ yields

$$
a_K\asymp K^{-s/d}.
$$

This relation explains where dimension enters. To halve the mesh width in every coordinate requires multiplying the number of cells or local basis functions by approximately $2^d$. Smoothness determines how rapidly error decreases with mesh width; dimension determines how expensive that refinement is in coefficients.

For a regular direct problem with squared $L^2$ loss, the total squared error has the prototype form

$$
R_n(K)
\asymp
\underbrace{K^{-2s/d}}_{\text{squared approximation error}}
+
\underbrace{\frac Kn}_{\text{estimation error}}.
$$

The first term decreases with $K$ and the second increases. At the rate-optimal scale they have the same order:

$$
K^{-2s/d}\asymp\frac Kn.
$$

Solving gives

$$
K^{1+2s/d}\asymp n,
\qquad
K\asymp n^{d/(2s+d)}.
$$

Substitution then yields

$$
R_n(K)\asymp n^{-2s/(2s+d)},
$$

or, in $L^2$ norm,

$$
\|\widehat g-g_0\|_{L^2(P_X)}
=O_p\left(n^{-s/(2s+d)}\right).
$$

This is the standard minimax scale for estimating an $s$-smooth $d$-dimensional regression function under regular conditions.[^stone] Its exponent is generated by two mechanisms only: approximation requires $K\asymp J^d$ coefficients, and estimating $K$ regular coefficients costs $K/n$ in squared error. The curse of dimensionality is therefore an approximation-complexity phenomenon. It can be weakened only by stronger smoothness, more data, a weaker target, or structural restrictions such as additivity, sparsity, low rank, or a low-dimensional manifold.

For uniform loss, stochastic fluctuations must be controlled simultaneously over $x$. With local spline or wavelet bases, a representative bound is

$$
\|\widehat g-g_K\|_\infty
=O_p\left(\sqrt{\frac{K\log n}{n}}\right),
$$

while approximation remains $K^{-s/d}$. Balancing these terms gives the scale

$$
\|\widehat g-g_0\|_\infty
=O_p\left\{\left(\frac n{\log n}\right)^{-s/(2s+d)}\right\}
$$

under suitable local-basis and tail conditions. Global bases may carry a larger basis-envelope factor. Modern series theory makes these distinctions explicit through leverage and Lebesgue-factor bounds.[^belloni-series]

### Likelihood rates and Hellinger entropy

For density estimation, the geometry is often expressed in Hellinger distance. Using the convention

$$
h^2(f,g)
=\frac12\int(\sqrt f-\sqrt g)^2,
$$

the expected log-likelihood ratio has quadratic behavior in $h(f,f_0)$ under local regularity. Different references omit the factor $1/2$; this changes constants and no rate statements.

The stochastic size of a density class is commonly measured by bracketing entropy. Let $N_{[]}(\epsilon,\mathcal F,h)$ be the minimum number of Hellinger brackets of radius $\epsilon$ needed to cover $\mathcal F$, and define an entropy integral schematically by

$$
J_{[]}(\delta,\mathcal F,h)
=
\int_0^\delta
\sqrt{1+\log N_{[]}(\epsilon,\mathcal F,h)}\,d\epsilon.
$$

Likelihood theory compares this integral with the deterministic likelihood curvature. A representative critical-radius condition is

$$
J_{[]}(\delta_n,\mathcal F_n,h)
\lesssim
\sqrt n\,\delta_n^2.
$$

The right side is the accumulated deterministic log-likelihood loss at Hellinger distance $\delta_n$; the left side controls the largest random likelihood fluctuation over the local class. Subject to approximation in Kullback–Leibler divergence and suitable envelope conditions, a sieve MLE then has Hellinger error of order the larger of its approximation radius and $\delta_n$. Wong and Shen established influential likelihood-ratio inequalities of this form for sieve maximum-likelihood estimators.[^wong-shen]

The entropy formulation and the $\sqrt{K/n}$ calculation describe the same mechanism at different levels of generality. For a regular finite-dimensional local model, entropy is proportional to $K$, and the critical radius reduces to the parametric aggregate scale. The entropy machinery becomes necessary when the sieve is nonlinear, the loss is likelihood-based, or no convenient normal-equation representation is available.

## Series least squares: a full derivation

The abstract curvature argument becomes particularly transparent in series least squares because the population projection creates an exact orthogonal decomposition. This section derives the $K/n$ estimation term directly from the normal equations and a score-variance calculation.

### Setup and the population projection

Assume $(Y_i,X_i)$ are independent and identically distributed and

$$
Y_i=g_0(X_i)+\varepsilon_i,
\qquad
\mathbb E[\varepsilon_i\mid X_i]=0.
$$

For each $K$, let $p_K(x)=(p_{1K}(x),\ldots,p_{KK}(x))'$ and define the linear sieve

$$
\mathcal G_K=\{x\mapsto p_K(x)'\beta:\beta\in\mathbb R^K\}.
$$

Let

$$
Q_K=\mathbb E[p_K(X)p_K(X)']
$$

be nonsingular. The best $L^2(P_X)$ approximation to $g_0$ in $\mathcal G_K$ is

$$
g_K(x)=p_K(x)'\beta_K,
\qquad
\beta_K
=\arg\min_{\beta\in\mathbb R^K}
\mathbb E\{g_0(X)-p_K(X)'\beta\}^2.
$$

Differentiating the quadratic objective gives the population normal equations

$$
\mathbb E\left[p_K(X)\{g_0(X)-p_K(X)'\beta_K\}\right]=0,
$$

and hence

$$
\beta_K=Q_K^{-1}\mathbb E[p_K(X)g_0(X)].
$$

Define the approximation residual

$$
r_K(x)=g_0(x)-g_K(x).
$$

The normal equations state that $r_K$ is orthogonal to the entire sieve:

$$
\mathbb E[p_K(X)r_K(X)]=0.
$$

This orthogonality will remove the cross term between approximation error and estimation error. It is the special Hilbert-space structure that makes least-squares sieves unusually easy to analyze.

The series least-squares estimator is

$$
\widehat\beta_K
=
\arg\min_{\beta\in\mathbb R^K}
\frac1n\sum_{i=1}^n\{Y_i-p_K(X_i)'\beta\}^2,
$$

so, whenever the sample Gram matrix is invertible,

$$
\widehat\beta_K
=
\left\{P_n[p_Kp_K']\right\}^{-1}P_n[p_KY],
\qquad
\widehat g_K(x)=p_K(x)'\widehat\beta_K.
$$

At a computational level this is ordinary least squares with an expanding set of regressors. Its nonparametric character comes from the fact that $K=K_n\to\infty$ and the span becomes dense in the function class of interest.

### Normalization and Gram-matrix stability

The algebra is clearest after population orthonormalization. Define

$$
b_K(x)=Q_K^{-1/2}p_K(x).
$$

Then

$$
\mathbb E[b_K(X)b_K(X)']=I_K.
$$

The transformed basis spans exactly the same function space. Write

$$
g_K(x)=b_K(x)'\gamma_K,
\qquad
\widehat g_K(x)=b_K(x)'\widehat\gamma_K,
$$

where $\gamma_K=Q_K^{1/2}\beta_K$ and $\widehat\gamma_K=Q_K^{1/2}\widehat\beta_K$. Let

$$
\widehat G_K=P_n[b_Kb_K'].
$$

The sample normal equations become

$$
\widehat G_K\widehat\gamma_K=P_n[b_KY].
$$

Population normalization does not make the sample Gram matrix equal to the identity. It identifies the stochastic event needed for stable estimation:

$$
\|\widehat G_K-I_K\|_{\mathrm{op}}=o_p(1).
$$

On this event, every eigenvalue of $\widehat G_K$ lies near one, so $\widehat G_K$ is invertible and

$$
\|\widehat G_K^{-1}\|_{\mathrm{op}}=O_p(1).
$$

A useful sufficient condition can be stated through the normalized basis envelope

$$
\zeta_K=\sup_x\|b_K(x)\|_2.
$$

For independent observations and bounded basis vectors, matrix concentration typically gives

$$
\|\widehat G_K-I_K\|_{\mathrm{op}}
=
O_p\left(
\sqrt{\frac{\zeta_K^2\log K}{n}}
+
\frac{\zeta_K^2\log K}{n}
\right).
$$

Thus $\zeta_K^2\log K/n\to0$ is a convenient sufficient condition. For many normalized spline, wavelet, and trigonometric systems, $\zeta_K^2\lesssim K$, leading to a condition close to $K\log K/n\to0$. Some global polynomial bases have larger boundary leverage and require slower growth or a different normalization. The condition is doing concrete statistical work: it prevents the empirical design from developing nearly unobserved coefficient directions.

### Exact stochastic representation

Define the residual relative to the population sieve target,

$$
u_{iK}=Y_i-g_K(X_i)
=\varepsilon_i+r_K(X_i).
$$

The notation $u_{iK}$ is useful because this residual includes both observational noise and the part of $g_0$ omitted by the current sieve. By conditional mean zero and projection orthogonality,

$$
\mathbb E[b_K(X)u_K]
=
\mathbb E[b_K(X)\varepsilon]
+
\mathbb E[b_K(X)r_K(X)]
=0.
$$

Using $Y_i=b_K(X_i)'\gamma_K+u_{iK}$ in the sample normal equations yields the exact identity

$$
\widehat\gamma_K-\gamma_K
=
\widehat G_K^{-1}P_n[b_Ku_K].
$$

This formula isolates the two ingredients of estimation error. The vector $P_n[b_Ku_K]$ is the empirical score at the population projection. The inverse Gram matrix translates that score into coefficient error. Stable design makes the second factor bounded; the dimension dependence comes from the first.

Assume, uniformly over the relevant values of $K$, that

$$
\mathbb E\left[u_K^2\|b_K(X)\|_2^2\right]\le CK.
$$

A bounded conditional second moment for $u_K$ is sufficient because $\mathbb E\|b_K(X)\|_2^2=\operatorname{tr}(I_K)=K$. Independence and the mean-zero score imply

$$
\begin{aligned}
\mathbb E\left\|P_n[b_Ku_K]\right\|_2^2
&=
\mathbb E\left\|
\frac1n\sum_{i=1}^n b_K(X_i)u_{iK}
\right\|_2^2\\
&=
\frac1n\mathbb E[u_K^2\|b_K(X)\|_2^2]\\
&\le \frac{CK}{n}.
\end{aligned}
$$

The cross terms vanish because the summands are independent and have mean zero. Markov's inequality therefore gives

$$
\left\|P_n[b_Ku_K]\right\|_2
=O_p\left(\sqrt{\frac Kn}\right).
$$

Combining this with Gram-matrix stability yields

$$
\|\widehat\gamma_K-\gamma_K\|_2
=O_p\left(\sqrt{\frac Kn}\right).
$$

Because the basis has been normalized in population,

$$
\begin{aligned}
\|\widehat g_K-g_K\|_{L^2(P_X)}^2
&=\mathbb E\left[
\{b_K(X)'(\widehat\gamma_K-\gamma_K)\}^2
\right]\\
&=(\widehat\gamma_K-\gamma_K)'
\mathbb E[b_Kb_K']
(\widehat\gamma_K-\gamma_K)\\
&=\|\widehat\gamma_K-\gamma_K\|_2^2.
\end{aligned}
$$

The stochastic function error is consequently $O_p(K/n)$ in squared $L^2$ norm. No generic entropy calculation is needed: the normal equations and a second-moment identity reveal the same dimension factor directly.

> [!theorem] $L^2$ rate for series least squares
> Let $K=K_n\to\infty$. Suppose:
>
> 1. $(Y_i,X_i)$ are i.i.d., $g_0(X)=\mathbb E[Y\mid X]$, and the population Gram matrix $Q_K$ is nonsingular;
> 2. for $b_K=Q_K^{-1/2}p_K$, $\|P_n[b_Kb_K']-I_K\|_{\mathrm{op}}=o_p(1)$;
> 3. with $g_K$ the $L^2(P_X)$ projection of $g_0$ onto $\mathcal G_K$ and $u_K=Y-g_K(X)$,
>    $$
>    \mathbb E[u_K^2\|b_K(X)\|_2^2]\le CK.
>    $$
>
> Then
>
> $$
> \|\widehat g_K-g_0\|_{L^2(P_X)}^2
> =
> O_p\left(\frac Kn\right)
> +
> \|g_K-g_0\|_{L^2(P_X)}^2.
> $$
>
> In particular, if
>
> $$
> a_K=
> \inf_{g\in\mathcal G_K}\|g-g_0\|_{L^2(P_X)},
> $$
>
> then
>
> $$
> \|\widehat g_K-g_0\|_{L^2(P_X)}
> =O_p\left(\sqrt{\frac Kn}+a_K\right).
> $$


> [!proof]+ Proof
> The preceding score calculation gives
>
> $$
> \|\widehat g_K-g_K\|_{L^2(P_X)}^2=O_p(K/n).
> $$
>
> Since $g_K$ is the $L^2(P_X)$ projection and $\widehat g_K-g_K\in\mathcal G_K$, projection orthogonality gives the exact Pythagorean identity
>
> $$
> \|\widehat g_K-g_0\|_{L^2(P_X)}^2
> =
> \|\widehat g_K-g_K\|_{L^2(P_X)}^2
> +
> \|g_K-g_0\|_{L^2(P_X)}^2.
> $$
>
> Substitution proves the squared-error statement. Taking square roots and using $\sqrt{a+b}\le\sqrt a+\sqrt b$ gives the norm rate.

The theorem is an $O_p$ statement. Expected-risk bounds of the same order require moment control for the inverse sample Gram matrix in addition to convergence in probability. This distinction is often suppressed in informal presentations.

### Smoothness, dimension, and the optimal sieve size

Suppose $g_0$ belongs to a Sobolev ball of smoothness $s$ on $[0,1]^d$, and the spline or wavelet sieve has approximation order

$$
a_K\lesssim K^{-s/d}.
$$

The theorem gives

$$
\|\widehat g_K-g_0\|_{L^2(P_X)}^2
=O_p\left(\frac Kn+K^{-2s/d}\right).
$$

Choosing

$$
K\asymp n^{d/(2s+d)}
$$

balances the two terms and gives

$$
\|\widehat g_K-g_0\|_{L^2(P_X)}
=O_p\left(n^{-s/(2s+d)}\right).
$$

The proof shows exactly what produces each component. Approximation theory contributes $K^{-s/d}$. The score vector has $K$ coordinates, producing $K/n$. Gram stability ensures that solving the normal equations does not amplify the score. Projection orthogonality allows the two squared errors to add without a cross term.

A fixed $K$ would give a regular $n^{-1/2}$ estimation rate around $g_K$ but leave $\|g_K-g_0\|$ nonzero. Letting $K$ grow removes that bias and slows estimation of the whole function. This is why “finite-dimensional optimization at each $n$” does not imply a parametric rate for an infinite-dimensional target.

### Pointwise inference and the bias problem

For a fixed location $x$, the exact representation is

$$
\widehat g_K(x)-g_K(x)
=
b_K(x)'\widehat G_K^{-1}P_n[b_Ku_K].
$$

If $\widehat G_K^{-1}$ can be replaced by $I_K$ at the relevant scale, the leading term is

$$
\frac1n\sum_{i=1}^n
b_K(x)'b_K(X_i)u_{iK}.
$$

Its variance is $V_K(x)/n$, where

$$
V_K(x)
=
\mathbb E\left[
 u_K^2\{b_K(x)'b_K(X)\}^2
\right].
$$

Under a triangular-array Lindeberg condition, leverage control, and a sufficiently small Gram-matrix remainder,

$$
\frac{\widehat g_K(x)-g_K(x)}{\sqrt{V_K(x)/n}}
\xrightarrow{d}\mathcal N(0,1).
$$

The normal approximation centers on $g_K(x)$. Inference on the actual regression function requires the decomposition

$$
\widehat g_K(x)-g_0(x)
=
\{\widehat g_K(x)-g_K(x)\}
+
\{g_K(x)-g_0(x)\}.
$$

A conventional centered normal approximation requires

$$
\frac{|g_K(x)-g_0(x)|}{\sqrt{V_K(x)/n}}
\longrightarrow0.
$$

At a mean-square-optimal $K$, approximation bias and standard error are commonly of the same order. A confidence interval that ignores bias can then have persistent undercoverage even though the estimator is rate optimal. One response is *undersmoothing*: choose a larger $K$ than the recovery-optimal value, reducing approximation bias at the cost of increased variance. The terminology refers to imposing less smoothing, hence using more basis functions. Other responses include explicit bias correction, robust bias-aware critical values, or honest confidence sets over a smoothness class.

> [!warning] Recovery-optimal tuning and inference-optimal tuning differ
> Minimizing estimated prediction error or integrated mean squared error does not generally make sieve bias negligible relative to a pointwise standard error. A valid inferential argument must analyze the target functional's bias on its own scale.

This issue also clarifies why asymptotic normality can hold for some functionals of $g_0$ even when it fails pointwise under the same tuning. Integration or orthogonality can average out approximation error, making a functional smoother than point evaluation. The partially linear example below makes this phenomenon explicit.

## Likelihood, semiparametric, and inverse-problem applications

The previous derivation concerned a direct regression problem with quadratic loss. The same sieve architecture persists when the criterion, the target, and the geometry change. The applications below are selected to display three distinct mechanisms: likelihood geometry, orthogonality for a regular finite-dimensional functional, and instability of an inverse operator.

### Sieve maximum likelihood for an unknown density

Return to the density problem in which unrestricted likelihood is unbounded. Assume for simplicity that the support is a compact set $\mathcal X$ and choose basis functions $p_K(x)$. Define the exponential-series sieve

$$
f_{\beta,K}(x)
=
\exp\{p_K(x)'\beta-c_K(\beta)\},
$$

where

$$
c_K(\beta)
=
\log\int_{\mathcal X}\exp\{p_K(u)'\beta\}\,du.
$$

The log normalizer $c_K(\beta)$ is introduced because a linear series for a density can become negative and need not integrate to one. Exponentiation enforces positivity; subtracting $c_K(\beta)$ enforces unit integral. If the basis contains a constant, its coefficient is not separately identified because adding a constant to $p_K'\beta$ is canceled by the normalizer. One therefore omits that coefficient or fixes it by convention.

The average negative log-likelihood is

$$
Q_n(\beta)
=
c_K(\beta)-\beta'P_n[p_K(X)].
$$

Differentiating the normalizer gives

$$
\nabla c_K(\beta)
=
\int p_K(x)f_{\beta,K}(x)\,dx
=\mathbb E_{f_{\beta,K}}[p_K(X)].
$$

Hence an interior sieve MLE satisfies

$$
\mathbb E_{f_{\widehat\beta,K}}[p_K(X)]
=
P_n[p_K(X)].
$$

The fitted density matches the empirical basis moments. The Hessian is

$$
\nabla^2 c_K(\beta)
=
\operatorname{Var}_{f_{\beta,K}}\{p_K(X)\},
$$

which supplies the local curvature when the sufficient statistics are nondegenerate. Thus the same matrix that represents information also controls numerical conditioning.

At the population level,

$$
\mathbb E_{f_0}[-\log f_{\beta,K}(X)]
-
\mathbb E_{f_0}[-\log f_0(X)]
=
\operatorname{KL}(f_0\|f_{\beta,K}).
$$

The population sieve target is therefore the Kullback–Leibler projection of $f_0$ onto the exponential family. If $\log f_0$ is sufficiently smooth and bounded, splines, trigonometric series, or other bases can approximate it, and local equivalence among Kullback–Leibler, Hellinger, and squared $L^2$ distances converts approximation of the log density into approximation of the density. Under regularity conditions, the stochastic likelihood term is again of order $K/n$ in squared local distance, while the approximation term depends on the smoothness of $\log f_0$. Balancing them gives the same direct-problem scale $n^{-s/(2s+d)}$ for Hellinger or comparable norms. Barron and Sheu developed this approximation-by-exponential-families program, while log-spline models provide an important spline implementation.[^barron-sheu]

This construction solves the original likelihood pathology in a precise way. For every fixed $K$, the model cannot form arbitrarily narrow, independently placed spikes because only $K$ coordinated sufficient statistics are available. As $K$ increases, finer density features become representable. The dimension therefore regulates both existence and statistical variability.

The assumptions also show the limits of this particular sieve. If $f_0$ has zeros, then $\log f_0$ is unbounded below, so a theorem based on uniform approximation of the log density does not apply directly. The method may still be consistent in a weaker geometry, or a different density sieve—such as mixtures, positive splines, or partition models—may be more appropriate. Density positivity alone does not select a universal sieve.

### A partially linear model and root-$n$ estimation

Consider the semiparametric model

$$
Y=D'\beta_0+g_0(X)+\varepsilon,
\qquad
\mathbb E[\varepsilon\mid D,X]=0,
$$

where $\beta_0\in\mathbb R^q$ is the finite-dimensional parameter of interest and $g_0$ is an unknown nuisance function. A fixed parametric specification for $g_0$ can bias $\widehat\beta$, because nonlinear dependence on $X$ may be falsely attributed to $D$. Fully nonparametric estimation of the joint regression function discards the scientifically meaningful linear structure in $D$. A product sieve

$$
\Theta_K
=
\mathbb R^q\times\mathcal G_K
$$

allows the parametric and nonparametric parts to be estimated simultaneously.

Let $P$ denote the $n\times K$ matrix with rows $p_K(X_i)'$, let $D$ be the $n\times q$ matrix of linear regressors, and define the residual-maker

$$
M_P=I_n-P(P'P)^{-1}P'.
$$

Joint least squares over $(\beta,\gamma)$ and the Frisch–Waugh–Lovell identity give

$$
\widehat\beta
=(D'M_PD)^{-1}D'M_PY.
$$

Thus the sieve first removes from $Y$ and $D$ the components explained by the basis in $X$, then regresses the residualized outcome on the residualized treatment or regressor.

The population analogue reveals the estimand. Let

$$
m_0(X)=\mathbb E[D\mid X],
\qquad
V=D-m_0(X).
$$

Taking conditional expectations in the model gives

$$
\mathbb E[Y\mid X]
=m_0(X)'\beta_0+g_0(X).
$$

Subtracting this equation from the original model yields

$$
Y-\mathbb E[Y\mid X]
=V'\beta_0+\varepsilon.
$$

Since $\mathbb E[V\mid X]=0$, the matrix

$$
A=\mathbb E[VV']
$$

identifies $\beta_0$ when it is nonsingular. The efficient information about $\beta_0$ comes from variation in $D$ that remains after conditioning on $X$.

To see why a slowly estimated nuisance need not determine the rate of $\widehat\beta$, let $g_K$ approximate $g_0$ and $m_K$ approximate $m_0$ in the same or compatible sieves. Substituting the model into the residualized estimator gives

$$
\widehat\beta-\beta_0
=(D'M_PD)^{-1}D'M_P\varepsilon
+
(D'M_PD)^{-1}D'M_Pg_0.
$$

Because $M_Pg_K=0$, the second term depends only on the approximation residual $g_0-g_K$. Likewise, the residualized $D$ behaves like $V$ plus the approximation residual $m_0-m_K$ and sample projection error. Products of the two approximation errors enter because

$$
\mathbb E[V\,a(X)]=0
$$

for every square-integrable function $a(X)$. A first-order nuisance error is orthogonal to the score for $\beta_0$; only second-order interactions remain.

Under regularity conditions including stable sample projections, finite moments, a dimension restriction strong enough to make in-sample projection remainders negligible, and a product-bias condition of the representative form

$$
\sqrt n\,
\|g_0-g_K\|_{L^2(P_X)}
\|m_0-m_K\|_{L^2(P_X)}
\longrightarrow0,
$$

one obtains the asymptotic linear expansion. Classical same-sample series proofs often use a condition stronger than $K/n\to0$—for example a basis-specific variant of $K^2/n\to0$—because the fitted projection and the estimating equation use the same observations. Cross-fitting can remove some of these own-observation terms, though it does not remove approximation bias or weak design.


$$
\sqrt n(\widehat\beta-\beta_0)
=
A^{-1}\frac1{\sqrt n}
\sum_{i=1}^n V_i\varepsilon_i
+o_p(1).
$$

Consequently,

$$
\sqrt n(\widehat\beta-\beta_0)
\xrightarrow{d}
\mathcal N(0,A^{-1}BA^{-1}),
$$

where

$$
B=\mathbb E[VV'\varepsilon^2].
$$

Under conditional homoskedasticity this unweighted residualized least-squares estimator has the usual semiparametric efficiency interpretation; under heteroskedasticity, efficient weighting may improve it. Robinson's partially linear estimator and subsequent series-functional theory formalize this root-$n$ phenomenon.[^robinson][^newey-functionals]

The statistical lesson is structural. The entire function $g_0$ may converge at $n^{-s/(2s+d)}$, much slower than $n^{-1/2}$. The finite-dimensional parameter can still be root-$n$ estimable because its score is orthogonal to first-order perturbations of the nuisance. Sieve estimation supplies a flexible nuisance approximation; orthogonality determines whether nuisance error enters linearly or only through a product. This distinction is central in modern semiparametric inference.

### Nonparametric instrumental variables and ill-posed inversion

Now consider

$$
Y=h_0(X)+u,
\qquad
\mathbb E[u\mid W]=0,
$$

where $X$ is endogenous, so $\mathbb E[u\mid X]$ need not vanish, and $W$ is an instrument. Define the conditional-expectation operator

$$
(Th)(w)=\mathbb E[h(X)\mid W=w]
$$

and the reduced-form regression

$$
m(w)=\mathbb E[Y\mid W=w].
$$

The conditional moment restriction implies the operator equation

$$
Th_0=m.
$$

Identification requires that $T$ be injective on the parameter class. In econometrics this condition is often expressed through completeness. Even when $T$ is injective, its inverse is generally discontinuous: conditional expectation smooths functions, so distinct high-frequency functions of $X$ can have nearly identical conditional expectations given $W$. Recovering $h_0$ from $Th_0$ is then an ill-posed inverse problem.[^newey-powell]

Choose a structural sieve $\mathcal H_K$ for $h$ and an instrument basis $q_J(W)$. A series two-stage least-squares estimator minimizes a sample analogue of the conditional-moment norm. In matrix notation, with $P$ containing $p_K(X_i)'$ and $Q$ containing $q_J(W_i)'$, a basic form is

$$
\widehat\beta
=
\{P'Q(Q'Q)^{-1}Q'P\}^{-1}
P'Q(Q'Q)^{-1}Q'Y,
$$

and $\widehat h_K(x)=p_K(x)'\widehat\beta$. This is a sieve estimator because both the structural function and the conditional moments are represented in growing finite-dimensional spaces.

The decisive difference from ordinary regression lies in curvature. The population minimum-distance criterion is proportional to

$$
\|T(h-h_0)\|_{L^2(P_W)}^2,
$$

so it controls the *image norm* of the error. The desired structural loss is $\|h-h_0\|_{L^2(P_X)}$. On the sieve define the measure of ill-posedness

$$
\tau_K
=
\sup_{\substack{h\in\mathcal H_K\\h\ne0}}
\frac{\|h\|_{L^2(P_X)}}
{\|Th\|_{L^2(P_W)}}.
$$

This is the operator norm of the inverse restricted to the current sieve. If the smallest singular value of $T$ on $\mathcal H_K$ is small, $\tau_K$ is large. A moment error of size $\delta$ can then correspond to a structural error as large as $\tau_K\delta$.

Ignoring secondary projection and first-stage terms, the direct-problem stochastic scale $\sqrt{K/n}$ occurs in the estimated moment equation. Inverting it gives the structural rate

$$
\|\widehat h_K-h_0\|_{L^2(P_X)}
=O_p\left(
\underbrace{a_K}_{\text{approximation}}
+
\underbrace{\tau_K\sqrt{\frac Kn}}_{\text{noise amplified by inversion}}
\right).
$$

The factor $\tau_K$ is generated by weakened curvature. The criterion separates parameters in the image norm, and translating that separation to the structural norm requires an inverse inequality. In finite-dimensional IV language, $\tau_K$ is the analogue of the reciprocal of a weak first-stage singular value. As the sieve expands, it admits finer directions that the instrument predicts less strongly, so $\tau_K$ generally diverges.

Suppose a resolution-$J$ sieve in $d$ dimensions has $K\asymp J^d$, approximation error $a_K\asymp K^{-s/d}$, and mildly ill-posed singular values that imply

$$
\tau_K\asymp K^{\alpha/d}
$$

for some $\alpha>0$. The total norm error is then

$$
K^{-s/d}
+
K^{\alpha/d}\sqrt{\frac Kn}.
$$

Balancing the terms gives

$$
K\asymp n^{d/(2s+2\alpha+d)}
$$

and

$$
\|\widehat h_K-h_0\|_{L^2(P_X)}
=O_p\left(n^{-s/(2s+2\alpha+d)}\right).
$$

Compared with direct regression, the denominator of the exponent contains the extra $2\alpha$. This is the statistical cost of inversion.

In a severely ill-posed problem, singular values can decay exponentially with resolution, giving $\tau_K$ of exponential order. Balancing exponential noise amplification against polynomial approximation then yields logarithmic rates, typically of the form

$$
(\log n)^{-s/\alpha}
$$

up to model-specific logarithmic factors. No choice of a very large sieve can overcome this information loss. Increasing $K$ too aggressively includes directions that are nearly annihilated by $T$ and causes explosive variance. Sieve truncation is therefore simultaneously an approximation device and an inverse-problem regularizer. Results for sieve NPIV estimators make this rate structure precise and establish optimality under spline or wavelet approximation in important settings.[^chen-christensen]

## Tuning, assumptions, and failure modes

### Choosing the sieve dimension

The sieve dimension is the regularization parameter. Its theoretical role is easiest to state through an oracle criterion. In a direct regular problem under squared loss, an ideal dimension minimizes

$$
K_n^\star
\in
\arg\min_K
\left\{
 a_K^2+\frac{\mathsf C_K}{n}
\right\},
$$

where $a_K$ is approximation error and $\mathsf C_K$ is effective stochastic complexity. For a well-conditioned linear sieve, $\mathsf C_K\asymp K$. In an inverse problem, the corresponding term is often $\mathsf C_K\asymp\tau_K^2K$. For uniform loss, the complexity can include $\log n$ and a basis-envelope factor. Writing the criterion this way prevents the phrase “choose $K$ to balance bias and variance” from concealing what the variance actually is in the problem at hand.

The oracle dimension depends on unknown features of the truth, especially smoothness. Data-driven procedures try to approximate the oracle tradeoff. Cross-validation estimates out-of-sample prediction risk and is natural when prediction or integrated loss is the objective. Penalized empirical criteria add a complexity charge, for example

$$
Q_n(\widehat\theta_K)+\operatorname{pen}_n(K),
$$

with a penalty calibrated to the optimism created by fitting $K$ coordinates. Mallows-type and Akaike-type penalties have this interpretation in regular least squares and likelihood models. Lepski-type methods compare estimators across resolutions and select the finest one whose differences from coarser estimators remain compatible with stochastic error. Holdout selection, information criteria, and bootstrap calibration are further implementations of the same comparison.

A data-driven $\widehat K$ changes the proof because the estimator is now selected over a union of models. It is insufficient to prove a rate separately for each deterministic $K$ and then substitute a random value. One needs simultaneous concentration over the candidate set, an oracle inequality, or sample splitting that makes the selection stage conditionally independent of the final estimation stage. The cost of adaptation may be a logarithmic factor, although in some models sharp adaptation is possible.

The appropriate $K$ also depends on the inferential target. Prediction-optimal selection balances function bias and variance. Pointwise inference needs approximation bias small relative to a pointwise standard error. Estimation of an integral, average derivative, or finite-dimensional coefficient can tolerate a larger nuisance-function error when the functional is smooth or its score is orthogonal. In an inverse problem, a nonlinear functional may be regular even when the whole function is estimated at a logarithmic rate, or it may be more irregular than the function norm suggests. Tuning therefore belongs to the pair *(model, target loss)*.

### Which assumptions are essential, and where they enter

**Identification.** A sieve cannot recover information absent from the population model. The consistency proof uses a positive criterion gap away from $\theta_0$. If two parameters generate the same distribution or the same conditional moments, that gap is zero. In NPIV, failure of completeness means that a nonzero function $h$ can satisfy $Th=0$; then $h_0$ and $h_0+h$ are observationally equivalent. Expanding the sieve cannot select the scientifically correct member without an additional restriction.

**Approximation.** The union of the sieves must approximate the target in a norm relevant to the criterion and the desired loss. A polynomial sieve on a compact interval can approximate continuous functions, yet a low-degree polynomial basis may be inefficient for spatially inhomogeneous smoothness or discontinuities. A tensor-product smooth sieve can approximate a discontinuous target only slowly and may exhibit boundary or ringing artifacts. If

$$
\liminf_{n\to\infty}
\inf_{\theta\in\Theta_n}d(\theta,\theta_0)>0,
$$

then the estimator can converge only to a pseudo-true approximation. Increasing sample size reduces stochastic error around that approximation and does not remove the structural bias.

**Uniform stochastic control.** The consistency proof requires a uniform law over the selected sieve; the rate proof requires a local maximal inequality. Moment assumptions, tail behavior, dependence, and the basis envelope enter here. With heavy-tailed errors, the score vector may not have the second moments used in the least-squares derivation. With dependent observations, cross terms no longer vanish automatically and an effective sample size or mixing inequality replaces the i.i.d. calculation. Sieve extremum theory extends to weakly dependent data, but the admissible growth of $K_n$ depends on the dependence and tail conditions.[^chen-shen]

**Curvature or a modulus of identification.** A small criterion gap must imply closeness in the target metric. Strong quadratic curvature gives a regular rate. A criterion behaving like $d(\theta,\theta_0)^\kappa$ with $\kappa\ne2$ changes the fixed point. Boundary parameters, nonsmooth losses, and shape constraints can produce nonquadratic local behavior and non-Gaussian limits. Inverse problems replace strong curvature in the structural norm by the sieve-dependent inequality involving $\tau_K$. A proof that controls only criterion error and then asserts structural convergence without such a link has a missing step.

**Stable finite-dimensional representation.** In series estimation, the sample Gram matrix or information matrix must be well conditioned. Population nonsingularity for every fixed $K$ does not imply uniform stability as $K\to\infty$. High leverage, sparse support in some basis regions, nearly collinear functions, or weak instruments can drive the smallest empirical eigenvalue toward zero. The inverse matrix then magnifies the score beyond $\sqrt{K/n}$. Orthonormalizing the basis can improve conditioning but cannot create information in regions with little design probability.

**Existence and optimization accuracy.** Finite dimensionality alone does not guarantee that the sample criterion attains its optimum. Logistic-type likelihoods can diverge under separation; mixture likelihoods can retain singularities; an open coefficient set has no reason to contain its infimum. Compact coefficient restrictions, coercive penalties, or an explicit approximate-minimizer condition are needed. For a nonconvex neural-network or mixture sieve, statistical theory about the global optimizer does not automatically describe a local optimizer returned by an algorithm. The optimization error must be bounded on the same criterion scale used in the statistical rate.

**A compatible metric.** Consistency in one norm does not imply consistency in a stronger norm. $L^2(P_X)$ convergence permits large errors on small-probability regions and does not yield uniform convergence without smoothness and design conditions. Hellinger convergence of densities does not automatically control derivatives or tail quantiles. A sieve theorem should name the metric generated by the criterion, the metric desired for the target, and the inequality connecting them.

### Misspecification, constraints, and boundary geometry

Sieve estimation does not by itself make the statistical model correct. Suppose the data distribution does not belong to the family indexed by $\Theta$, or the conditional moment restriction is false. The population criterion then selects a pseudo-true parameter

$$
\theta^\star\in\arg\min_{\theta\in\Theta}Q(\theta),
$$

and the population sieve target approximates $\theta^\star$. In this setting, $\theta^\star$ is the criterion-specific pseudo-truth because the maintained model contains no data-generating truth. Consistency can still be defined and proved for $\theta^\star$, but its scientific interpretation depends on the criterion. Least squares produces an $L^2$ projection, likelihood produces a Kullback–Leibler projection, and weighted minimum distance produces a projection determined by the chosen weighting operator. Changing the criterion can therefore change the pseudo-true estimand even when the same sieve is used.

Constraints modify both approximation and local geometry. Monotonicity, convexity, nonnegativity, and adding-up restrictions can be encoded through coefficient inequalities or specialized bases. They may reduce stochastic complexity and protect against implausible estimates, but they also redefine the parameter space. If the actual target violates the restriction, the estimator converges to a constrained projection. If the target lies on the boundary of the constrained class, the local parameter set is a cone, which changes the linear-space geometry used by routine asymptotic expansions. The limiting distribution can then be a projection of a Gaussian process, a mixture distribution, or another nonstandard law. A routine inverse-Hessian normal approximation is generally unjustified at an active inequality constraint.

Shape restrictions can also change rates. At a strictly interior smooth point, a constrained estimator may behave locally like an unconstrained estimator. At a kink, flat region, or boundary, the effective local complexity and curvature can change, producing cube-root or other nonstandard scales in some models. These phenomena do not contradict the sieve mechanism. They change the local empirical modulus and the deterministic separation used in the fixed-point calculation.

Random and adaptive sieves create a related issue. Knot locations, tree partitions, network architectures, or mixture supports may be selected from the data. Their approximation can be substantially better than that of a fixed dictionary, especially for spatially inhomogeneous targets. The stochastic analysis must then include the complexity of choosing the architecture as well as fitting coefficients within it. Conditioning on the selected architecture after using the same data does not erase selection error. Oracle inequalities, complexity penalties, or sample splitting are the standard ways to account for this extra search.

### Concrete failure modes and counterexamples

A few examples show why the preceding assumptions cannot be replaced by the single statement that the sieve union is dense.

**The sieve grows too quickly.** In series least squares, take $K_n\ge n$ and a design matrix with row rank $n$. The fitted values can interpolate $Y_1,\ldots,Y_n$, making empirical residual sum of squares zero. Density of the union is irrelevant; the current sieve has enough freedom to reproduce noise. Even with $K_n<n$, a ratio $K_n/n$ bounded away from zero can keep aggregate variance from vanishing, and a poorly behaved basis can make the Gram matrix unstable much earlier.

**The sieve remains fixed.** If $K_n=K$ for all $n$, then $\widehat g_K$ can converge at a parametric rate to $g_K$, while

$$
\|\widehat g_K-g_0\|
\longrightarrow
\|g_K-g_0\|>0.
$$

Excellent standard errors around the wrong finite-dimensional target do not constitute nonparametric consistency. This is the sieve analogue of parametric misspecification.

**The criterion is weak in the desired norm.** In NPIV, suppose a unit-norm sequence $h_j$ satisfies $\|Th_j\|\to0$. An arbitrarily small perturbation of the estimated conditional moment can then correspond to an order-one perturbation in the structural function. Minimizing moment error accurately does not solve the inverse problem unless $K$ truncates these unstable directions or another regularizer controls them.

**The model is not identified.** If $Th=0$ for a nonzero $h$, the population criterion is exactly equal at $h_0$ and $h_0+h$. No rate argument can choose between them. A claimed convergence theorem that assumes only sieve approximation and empirical convergence, with no separation or injectivity condition, cannot be correct for the structural parameter.

**The approximation parameterization excludes relevant boundary behavior.** An exponential log-density sieve represents strictly positive densities. A target density that is exactly zero on an interval cannot be uniformly approximated in log density. One may still obtain Hellinger approximation by allowing the log density to become very negative, but coefficient bounds and entropy calculations must then change. The convenient bounded-log-density theorem does not cover the case.

**The target functional is too irregular for root-$n$ inference.** Point evaluation of a nonparametric regression function is typically irregular: its variance grows with $K$, and its bias is local. An average such as $\int g(x)w(x)\,dx$ can be regular because integration smooths high-frequency directions. Treating all plug-in functionals as root-$n$ estimable ignores this difference. The local Riesz representer or influence function determines whether the functional amplifies or suppresses hard-to-estimate directions.

**The empirical optimizer is numerically unstable.** Two bases spanning the same sieve are statistically equivalent in exact unpenalized arithmetic, yet one can produce a design matrix with a huge condition number. Floating-point error then acts like an unreported regularizer or can dominate sampling error. With coefficient penalties, rescaling the basis changes the penalty itself, so the fitted function is no longer invariant. Numerical conditioning is part of the estimator's definition once finite precision and penalties are present.

### Common misconceptions

| Misconception | Correct statement | Mechanism that matters |
| :-- | :-- | :-- |
| A sieve estimator is polynomial regression. | Polynomial series are one sieve; splines, wavelets, partitions, mixtures, neural networks, and constrained approximations also qualify. | Growing controlled approximation spaces. |
| Universal approximation implies consistency. | Approximation addresses only sieve bias. Consistency also needs identification, uniform stochastic control, and a suitable growth rate. | Approximation plus estimation. |
| Every fixed-$n$ problem is finite dimensional, so the estimator is root-$n$. | The dimension $K_n$ diverges, and aggregate stochastic error is usually $\sqrt{K_n/n}$. | Increasing parameter dimension. |
| Adding basis functions always improves the estimator. | Empirical fit weakly improves, while population risk can increase because variance and instability grow. | Bias–variance tradeoff. |
| A dense sieve can be expanded as fast as desired. | Excessive growth destroys uniform laws, Gram stability, or inverse regularization. | Complexity relative to information. |
| Sieve and penalized estimators are competing categories. | Hard truncation and continuous shrinkage are complementary regularization devices and are often combined. | Spectral cutoff versus shrinkage. |
| The covariate dimension $d$ and sieve dimension $K$ are interchangeable. | $d$ describes the domain; $K$ is the number of approximation coordinates. The relation $K\asymp J^d$ creates the curse of dimensionality. | Geometry of approximation. |
| Rate-optimal estimation automatically gives valid confidence intervals. | Recovery-optimal bias is often comparable to standard error. Inference needs undersmoothing, bias correction, or bias-aware procedures. | Target-specific bias scale. |
| A small sample criterion value proves closeness to the target. | This conclusion needs curvature or an identification modulus in the desired metric. | Deterministic separation. |

The method's scope is broad because the architecture does not depend on a particular basis or criterion. It applies to i.i.d. and weakly dependent data, likelihood and moment models, censored-data problems, time series, shape restrictions, and semiparametric models with several nuisance functions. The assumptions must be rebuilt for each setting. A general label such as “sieve M-estimator” identifies the design pattern; it does not supply the entropy bound, curvature inequality, approximation theorem, or influence-function calculation required by a concrete model.

## Intuitive synthesis

Sieve estimation begins with a mismatch between the scientific target and finite-sample optimization. The target is an infinite-dimensional object because a fixed parametric family would impose persistent and potentially consequential specification error. The empirical criterion observes only finitely many random constraints. Optimizing it over the full function space can interpolate noise, produce an unbounded likelihood, or make an inverse problem violently unstable. The sieve inserts a sample-size-dependent resolution between these extremes.

At sample size $n$, the estimator solves a conventional finite or controlled-complexity extremum problem over $\Theta_n$. Its population counterpart is $\theta_{0,n}$, the best element of that sieve according to the criterion. This immediately creates two errors:

$$
\text{total error}
\quad\approx\quad
\text{approximation error}
+
\text{estimation error within the sieve}.
$$

Approximation error is deterministic. It asks how much of the truth is lost at the current resolution. Estimation error is stochastic. It asks how far random fluctuations move the empirical optimizer from the population sieve target. Increasing the sieve dimension reduces the first and enlarges the second.

The rate proof has a corresponding two-part mechanism. Population curvature makes moving a distance $\delta$ costly in expected criterion value. Empirical-process complexity measures the largest random criterion gain available over parameters at that distance. The estimator cannot remain outside the radius where curvature dominates random gain. With quadratic curvature and a regular $K$-dimensional local model,

$$
\underbrace{\delta^2}_{\text{population separation}}
\quad\text{balances}\quad
\underbrace{\delta\sqrt{K/n}}_{\text{local empirical fluctuation}},
$$

which gives $\delta\asymp\sqrt{K/n}$. Approximation theory then supplies the other scale. For an $s$-smooth function of $d$ variables, $K$ coefficients give error $K^{-s/d}$. Balancing

$$
K^{-s/d}
\quad\text{with}\quad
\sqrt{K/n}
$$

generates $K\asymp n^{d/(2s+d)}$ and the direct nonparametric rate $n^{-s/(2s+d)}$.

Series least squares displays this argument in exact algebra. The population projection makes approximation residuals orthogonal to the sieve. The empirical normal equations express coefficient error as an inverse Gram matrix times a $K$-dimensional sample score. Gram stability keeps the inverse bounded; the score has squared norm of order $K/n$. Pythagorean orthogonality then adds estimation and approximation errors exactly in squared $L^2$ norm. The generic “complexity term” is therefore the accumulated variance of $K$ estimable coordinates.

Likelihood changes the criterion but preserves the architecture. An exponential-series density sieve makes positivity and normalization automatic, turns the population target into a Kullback–Leibler projection, and replaces unrestricted spiking by a controlled number of sufficient statistics. Hellinger curvature and bracketing entropy play the roles occupied by the quadratic identity and Gram-matrix calculation in least squares.

Semiparametric estimation adds a distinction between estimating the whole nuisance and estimating a functional of it. In the partially linear model, the nuisance function can converge slowly while $\beta_0$ is root-$n$ estimable. Residualization creates a score orthogonal to first-order nuisance perturbations, so nuisance approximation errors enter through products. The convergence rate of an infinite-dimensional object does not by itself determine the rate of every functional of that object.

Inverse problems alter the curvature side of the balance. The NPIV criterion controls $T(h-h_0)$, a smoothed image of structural error. Returning to the structural norm multiplies stochastic error by the restricted inverse norm $\tau_K$. The direct variance term $\sqrt{K/n}$ becomes $\tau_K\sqrt{K/n}$, and aggressive sieve growth admits directions that are increasingly weakly identified. The sieve is then regularization in a stronger sense: it excludes directions whose inverse-noise amplification exceeds the information in the sample.

The dependencies can be summarized compactly.

| Component | Mathematical object | Question it answers | Consequence when it deteriorates |
| :-- | :-- | :-- | :-- |
| Population identification | Separation of $Q(\theta)$ from $Q(\theta_0)$ | Does the model distinguish the target? | Consistency is impossible. |
| Sieve approximation | $a_K=\inf_{\theta\in\Theta_K}d(\theta,\theta_0)$ | What deterministic detail is omitted? | Persistent or slowly vanishing bias. |
| Local curvature | Excess criterion versus $d^2$ or another modulus | How strongly does the criterion penalize error? | Slower or nonstandard rates. |
| Stochastic complexity | Entropy, score dimension, leverage | How much can sample noise improve the criterion? | Larger variance and stricter growth limits. |
| Numerical or design stability | Gram, information, or singular values | Can empirical equations be inverted safely? | Noise amplification or nonexistence. |
| Functional regularity | Influence function or Riesz representer | How does nuisance error affect the target functional? | Root-$n$, slower, or impossible inference. |
| Tuning | Choice of $K$, constraints, and penalties | Which directions are estimable at sample size $n$? | Overfitting, oversmoothing, or invalid inference. |

A coherent analysis of a new sieve estimator should therefore proceed in a fixed logical order. Identify the population target and the metric of interest. Specify a sieve that approximates the target and respects model constraints. Define the population sieve target under the actual criterion. Establish uniform empirical control and local curvature. Derive the stochastic radius, then combine it with approximation error. For inference, use a target-specific analysis of bias and influence; the whole-function rate alone is insufficient. For inverse or weakly identified models, insert the modulus that translates criterion error into structural error. Every major formula in sieve theory belongs to one of these steps.

The method's enduring value lies in this separation of tasks. Approximation theory describes what a finite representation can express. Probability controls what random data can estimate within that representation. Optimization computes the restricted extremum. Semiparametric geometry determines which functionals remain regular. Sieve estimation is the framework that makes these components interact at a resolution chosen to increase with information.

### References

The references below are the principal sources underlying the historical and theoretical discussion. The derivations in the text use a simplified common notation; individual papers impose model-specific conditions and sometimes use different normalizations of entropy, Hellinger distance, and sieve dimension.

[^grenander]: Ulf Grenander, *Abstract Inference*, Wiley, 1981. The modern statistical terminology “method of sieves” is traced to this monograph.

[^geman-hwang]: Stuart Geman and Chii-Ruey Hwang, [“Nonparametric Maximum Likelihood Estimation by the Method of Sieves”](https://doi.org/10.1214/aos/1176345782), *The Annals of Statistics* 10(2), 401–414, 1982.

[^shen-wong]: Xiaotong Shen and Wing Hung Wong, [“Convergence Rate of Sieve Estimates”](https://doi.org/10.1214/aos/1176325486), *The Annals of Statistics* 22(2), 580–615, 1994.

[^wong-shen]: Wing Hung Wong and Xiaotong Shen, [“Probability Inequalities for Likelihood Ratios and Convergence Rates of Sieve MLEs”](https://doi.org/10.1214/aos/1176324524), *The Annals of Statistics* 23(2), 339–362, 1995.

[^shen-penalization]: Xiaotong Shen, [“On Methods of Sieves and Penalization”](https://doi.org/10.1214/aos/1030741085), *The Annals of Statistics* 25(6), 2555–2591, 1997.

[^stone]: Charles J. Stone, [“Optimal Global Rates of Convergence for Nonparametric Regression”](https://doi.org/10.1214/aos/1176345969), *The Annals of Statistics* 10(4), 1040–1053, 1982.

[^belloni-series]: Alexandre Belloni, Victor Chernozhukov, Denis Chetverikov, and Kengo Kato, [“Some New Asymptotic Theory for Least Squares Series: Pointwise and Uniform Results”](https://doi.org/10.1016/j.jeconom.2015.02.014), *Journal of Econometrics* 186(2), 345–366, 2015.

[^barron-sheu]: Andrew R. Barron and Chyong-Hwa Sheu, [“Approximation of Density Functions by Sequences of Exponential Families”](https://doi.org/10.1214/aos/1176348252), *The Annals of Statistics* 19(3), 1347–1369, 1991. See also Charles J. Stone, [“Large-Sample Inference for Log-Spline Models”](https://doi.org/10.1214/aos/1176347622), *The Annals of Statistics* 18(2), 717–741, 1990.

[^robinson]: Peter M. Robinson, [“Root-$N$-Consistent Semiparametric Regression”](https://doi.org/10.2307/1912705), *Econometrica* 56(4), 931–954, 1988.

[^newey-functionals]: Whitney K. Newey, [“Series Estimation of Regression Functionals”](https://doi.org/10.1017/S0266466600008203), *Econometric Theory* 10(1), 1–28, 1994; and [“Convergence Rates and Asymptotic Normality for Series Estimators”](https://doi.org/10.1016/S0304-4076(97)00011-0), *Journal of Econometrics* 79(1), 147–168, 1997.

[^newey-powell]: Whitney K. Newey and James L. Powell, [“Instrumental Variable Estimation of Nonparametric Models”](https://doi.org/10.1111/1468-0262.00459), *Econometrica* 71(5), 1565–1578, 2003.

[^chen-christensen]: Xiaohong Chen and Timothy M. Christensen, [“Optimal Sup-Norm Rates and Uniform Inference on Nonlinear Functionals of Nonparametric IV Regression”](https://doi.org/10.3982/QE722), *Quantitative Economics* 9(1), 39–84, 2018.

[^chen-shen]: Xiaohong Chen and Xiaotong Shen, [“Sieve Extremum Estimates for Weakly Dependent Data”](https://doi.org/10.2307/2998559), *Econometrica* 66(2), 289–314, 1998.

A broad synthesis of consistency, rates, asymptotic normality, efficiency, constraints, and semi-nonparametric applications is Xiaohong Chen, “Large Sample Sieve Estimation of Semi-Nonparametric Models,” in *Handbook of Econometrics*, volume 6B, 5549–5632, Elsevier, 2007.[^chen-handbook]

[^chen-handbook]: Xiaohong Chen, [“Large Sample Sieve Estimation of Semi-Nonparametric Models”](https://doi.org/10.1016/S1573-4412(07)06076-X), in James J. Heckman and Edward E. Leamer, eds., *Handbook of Econometrics*, volume 6B, Elsevier, 2007.
