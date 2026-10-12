---
title: Gaussian Processes
order: 7
description: A systematic statistical account of Gaussian processes, from finite-dimensional consistency and covariance kernels to conditioning, RKHS geometry, inference, applications, and computation.
aliases:
  - Gaussian Process
  - Gaussian Random Functions
tags:
  - gaussian-processes
  - stochastic-processes
  - bayesian-nonparametrics
  - spatial-statistics
  - kernel-methods
lang: en
---

## Conceptual preview

The central statistical problem is to learn an unknown function from finitely many, often noisy, evaluations while preserving a coherent account of dependence and uncertainty over an entire input domain. Suppose that

$$
y_i=f(x_i)+\varepsilon_i,\qquad i=1,\ldots,n,
$$

where the inputs $x_i$ lie in a set $\mathcal X$, the function $f:\mathcal X\to\mathbb R$ is unknown, and the errors may be Gaussian. A finite-dimensional regression model represents $f$ through a parameter vector. A Gaussian process represents the function directly as a random object whose values at every finite collection of inputs have a joint multivariate Gaussian distribution. Its law is determined by a mean function $m$ and a covariance kernel $k$:

$$
f\sim \operatorname{GP}(m,k),\qquad
m(x)=\mathbb E[f(x)],\qquad
k(x,x')=\operatorname{Cov}\{f(x),f(x')\}.
$$

The kernel is the main structural component. It specifies which function values move together, which directions in the input space are relevant, how rapidly dependence decays, and what forms of roughness or smoothness the model assigns appreciable probability. The requirement that every covariance matrix be positive semidefinite is the mathematical condition that makes these local specifications compatible with a global stochastic process.

For Gaussian observation noise with covariance matrix $\Sigma$, let $X=(x_1,\ldots,x_n)$, let $K_X=(k(x_i,x_j))_{i,j=1}^n$, let $m_X=(m(x_1),\ldots,m(x_n))^\top$, and define

$$
k_X(x)=\bigl(k(x_1,x),\ldots,k(x_n,x)\bigr)^\top.
$$

Gaussian conditioning then gives another Gaussian process,

$$
f\mid y\sim \operatorname{GP}(m_n,k_n),
$$

with

$$
\begin{aligned}
m_n(x)
&=m(x)+k_X(x)^\top(K_X+\Sigma)^{-1}(y-m_X),\\
k_n(x,x')
&=k(x,x')-k_X(x)^\top(K_X+\Sigma)^{-1}k_X(x').
\end{aligned}
$$

These two equations organize most of the subject. The posterior mean adds a covariance-weighted interpolation of the observed residuals to the prior mean. The posterior covariance subtracts the component of prior uncertainty explained by the data. The same algebra appears in Bayesian nonparametric regression, spatial kriging, smoothing splines, computer-model emulation, filtering, probabilistic numerical methods, and kernel regularization.

Three distinct interpretations coexist. In stochastic-process modeling, $f$ may describe a genuinely random temporal or spatial phenomenon. In Bayesian inference, $f$ may be an unknown fixed function and the process distribution expresses epistemic uncertainty. In prediction theory, the mean formula can be characterized as a best linear predictor using only second moments; Gaussianity then strengthens that linear predictor into the exact conditional expectation. Keeping these interpretations separate prevents several common confusions about what the process randomness represents and how its uncertainty should be calibrated.

The mathematical development therefore has a natural sequence. One first asks how a mean and kernel generate a legitimate random function. One then derives the conditioning mechanism that converts the prior process into predictions and uncertainty statements. The kernel is subsequently examined from three complementary viewpoints: covariance structure, spectral content, and reproducing-kernel Hilbert space geometry. Statistical learning enters through the marginal likelihood, regularized estimation, and posterior concentration. Representative applications show how the same core identities solve different substantive problems, while computational approximations reveal which parts of the exact construction become expensive at large sample sizes.

## Motivation and origins

### Why a distribution over functions is needed

Many statistical targets are functions rather than finite vectors. A regression surface, a spatial field, a time-varying trajectory, a dose-response curve, a hazard function, or the output of a deterministic simulator assigns a value to every point in a domain. Data reveal the target only at finitely many locations. The inferential problem therefore contains two linked tasks: reconstruct values between observed inputs and quantify uncertainty about unobserved values or functionals.

A parametric model $f(x)=g(x;\beta)$ resolves the problem by reducing it to inference on $\beta\in\mathbb R^p$. This is effective when scientific structure supplies a credible finite-dimensional family. It becomes restrictive when the main uncertainty concerns the shape of the function itself. Increasing the number of basis functions postpones the restriction, though it leaves open how coefficients should be coupled, how complexity should be controlled, and how uncertainty should propagate to arbitrary evaluation points.

Pointwise modeling also fails. Assigning unrelated distributions to $f(x)$ at each $x$ provides no mechanism for learning $f(x')$ from an observation at a nearby $x$. For an uncountable domain, an arbitrary collection of pointwise distributions need not even define a measurable random function with usable sample paths. A statistical model requires a joint law whose finite restrictions agree with one another and whose dependence reflects the geometry of the input space.

Gaussian processes address this requirement by shifting attention from a finite parameter vector to all finite evaluation vectors

$$
\bigl(f(x_1),\ldots,f(x_r)\bigr)^\top,
$$

for arbitrary $r$ and arbitrary inputs. The model declares each such vector Gaussian and requires consistency when points are reordered or removed. This construction gives exact finite-dimensional calculations while retaining an infinite-dimensional target.

Gaussianity is especially effective for four reasons. First, a Gaussian law is determined by first and second moments, so dependence can be encoded through one kernel. Second, linear transformations preserve Gaussianity, which makes derivatives, integrals, averages, and other linear functionals accessible. Third, conditioning a jointly Gaussian vector produces another Gaussian vector with an explicit Schur-complement covariance. Fourth, many random fields arise as limits or aggregates of numerous small effects, making a Gaussian approximation scientifically plausible in some settings. None of these reasons makes Gaussianity universally adequate. Heavy tails, skewness, discrete latent structure, abrupt regime changes, and nonlinearly constrained processes can require other stochastic-process families.

### Three historical threads

The modern subject combines several lines of development that initially addressed different questions.

The first is the mathematical theory of random functions. Brownian motion supplied the canonical example: a continuous-time process with Gaussian increments and covariance $k(s,t)=\min(s,t)$. Wiener developed a rigorous measure on path space in the 1920s, and the subsequent measure-theoretic theory of stochastic processes clarified how consistent finite-dimensional distributions generate a process. The resulting viewpoint is fundamental for Gaussian processes: the infinite collection is controlled through its finite restrictions, while separate regularity arguments establish continuity or differentiability of sample paths. Wiener’s 1923 paper *Differential-Space* is an early landmark in this development, and Kolmogorov’s extension and continuity theorems later supplied the standard general framework.

The second thread arose in mining and spatial prediction. Ore grades observed at sampled locations had to be used to predict grades at unsampled locations, with a prediction error that reflected spatial dependence. Krige’s work in the early 1950s and Matheron’s formal development of geostatistics in the 1960s led to kriging: linear prediction based on covariance or variogram structure. Under a Gaussian random-field model, the kriging predictor is exactly the conditional mean, and the kriging variance is the conditional variance. This connection explains why spatial statistics and Gaussian-process regression share the same equations while retaining different terminology and modeling traditions.

The third thread came from smoothing and Bayesian nonparametrics. Spline estimators minimize a data-fit term plus a roughness penalty. Kimeldorf and Wahba showed that such estimators can be interpreted through Bayesian estimation with stochastic-process priors, making a precise connection between covariance models and deterministic regularization. O’Hagan developed Gaussian-process ideas for curve fitting and design, and Sacks, Welch, Mitchell, and Wynn established Gaussian-process emulation as a central method for computer experiments. Machine learning later recast the framework as a general probabilistic kernel method, with a unified account given by Rasmussen and Williams.

These histories correspond to different meanings of the same mathematical object. A spatial scientist may regard $f$ as a random field generated by nature. A Bayesian may place a process prior on an unknown deterministic response surface. A numerical analyst may use the same prior as a formal device for assigning uncertainty to an expensive function or an integral. The conditioning formulas agree across these interpretations. Their substantive meaning and calibration requirements differ.

### The unresolved questions carried forward

Introducing a random function creates several mathematical obligations. A proposed covariance formula must generate positive semidefinite matrices at every finite set of inputs. Finite-dimensional distributions must be mutually consistent. If the intended object is a continuous or differentiable function, the covariance must support an appropriate modification. Once observations are introduced, the conditional process must be derived explicitly. When kernel parameters are unknown, one needs likelihood or prior-based learning. Finally, the uncertainty statements remain conditional on the entire modeling specification, so misspecification and parameter uncertainty require separate attention.

The rest of the theory can be read as a sequence of answers to these obligations. The first answer is an existence construction based on positive semidefinite kernels.

## Constructing Gaussian processes

### Definition through finite-dimensional distributions

Let $\mathcal X$ be an arbitrary index set. A real-valued stochastic process on $\mathcal X$ is a collection

$$
f=\{f(x):x\in\mathcal X\}
$$

of random variables defined on a common probability space. The process is Gaussian when every finite linear combination of its coordinates is Gaussian. Equivalently, for every $r\geq 1$ and every $x_1,\ldots,x_r\in\mathcal X$,

$$
f_X=\bigl(f(x_1),\ldots,f(x_r)\bigr)^\top
$$

has a possibly degenerate multivariate normal distribution. If the mean and covariance functions are $m$ and $k$, then

$$
f_X\sim \mathcal N_r(m_X,K_X),
$$

where $(m_X)_i=m(x_i)$ and $(K_X)_{ij}=k(x_i,x_j)$.

The word “possibly degenerate” matters. A kernel matrix can be singular, for example when two inputs coincide or when the process has a finite-rank representation. The corresponding Gaussian law is concentrated on a lower-dimensional affine subspace and remains a valid probability distribution.

The covariance kernel cannot be arbitrary. For any finite inputs $x_1,\ldots,x_r$ and coefficients $a_1,\ldots,a_r$,

$$
\begin{aligned}
\sum_{i=1}^r\sum_{j=1}^r a_i a_j k(x_i,x_j)
&=\operatorname{Var}\!\left(\sum_{i=1}^r a_i f(x_i)\right)\\
&\geq 0.
\end{aligned}
$$

Thus every covariance kernel is symmetric and positive semidefinite: each Gram matrix $K_X$ is positive semidefinite. Strict positive definiteness, meaning $a^\top K_Xa>0$ for every nonzero $a$ at distinct inputs, is useful for invertibility, though it is stronger than validity.

The converse supplies the main existence result. Suppose $m:\mathcal X\to\mathbb R$ is arbitrary and $k:\mathcal X\times\mathcal X\to\mathbb R$ is symmetric and positive semidefinite. For each finite ordered set $X=(x_1,\ldots,x_r)$, define

$$
P_X=\mathcal N_r(m_X,K_X).
$$

These distributions satisfy two consistency properties. Permuting the inputs permutes the coordinates of the Gaussian vector because the corresponding mean vector and covariance matrix are permuted in the same way. Marginalizing over a subset of coordinates yields the Gaussian law constructed directly from that subset because Gaussian marginals retain the relevant subvector and principal covariance submatrix. The Kolmogorov extension theorem therefore yields a probability measure on the product space $\mathbb R^{\mathcal X}$, equipped with its cylinder $\sigma$-field, whose coordinate process has the specified finite-dimensional distributions.

This proves the following basic statement.

> [!theorem] Existence from a kernel
> For any index set $\mathcal X$, any mean function $m$, and any symmetric positive semidefinite kernel $k$, there exists a Gaussian process with mean $m$ and covariance $k$. Its finite-dimensional distributions are uniquely determined by $(m,k)$.

The theorem establishes a stochastic process as a family of coordinates. It does not automatically establish that the sample map $x\mapsto f(x)$ is continuous, bounded, integrable, or measurable with respect to a desired topology on a function space. When $\mathcal X$ is uncountable, the product $\sigma$-field can be substantially coarser than the Borel $\sigma$-field associated with a norm such as $\|\cdot\|_\infty$. Path regularity and function-space measurability require additional conditions. This distinction separates existence of finite-dimensional laws from existence of a version with useful paths.

### Finite and infinite feature constructions

A simple construction begins with Bayesian linear modeling. Let $\phi:\mathcal X\to\mathbb R^p$ be a feature map and let

$$
w\sim\mathcal N_p(b,\Sigma_w).
$$

Define $f(x)=\phi(x)^\top w$. Then every finite vector of evaluations is a linear transformation of $w$, hence Gaussian, with

$$
\begin{aligned}
m(x)&=\phi(x)^\top b,\\
k(x,x')&=\phi(x)^\top\Sigma_w\phi(x').
\end{aligned}
$$

Positive semidefiniteness is immediate:

$$
\sum_{i,j}a_i a_j k(x_i,x_j)
=\left(\sum_i a_i\phi(x_i)\right)^\top
\Sigma_w
\left(\sum_j a_j\phi(x_j)\right)
\geq 0.
$$

This representation shows that a Gaussian process generalizes a Gaussian linear model. A finite-rank kernel corresponds exactly to a finite set of random coefficients. Infinite-rank kernels can often be represented through countably many features,

$$
f(x)=m(x)+\sum_{j=1}^{\infty}\sqrt{\lambda_j}\,Z_j\phi_j(x),
\qquad Z_j\stackrel{\text{iid}}{\sim}\mathcal N(0,1),
$$

provided the series converges in an appropriate sense. The associated covariance is

$$
k(x,x')=\sum_{j=1}^{\infty}\lambda_j\phi_j(x)\phi_j(x').
$$

The infinite expansion is useful for interpretation and approximation, though the kernel definition remains more general and avoids choosing a particular basis.

### Brownian motion as a diagnostic example

For $\mathcal X=[0,\infty)$, consider

$$
k(s,t)=\min(s,t).
$$

Validity follows from the integral representation

$$
\min(s,t)=\int_0^\infty \mathbf 1\{u\leq s\}\mathbf 1\{u\leq t\}\,du.
$$

Indeed,

$$
\sum_{i,j}a_i a_j\min(t_i,t_j)
=
\int_0^\infty
\left(\sum_i a_i\mathbf 1\{u\leq t_i\}\right)^2du
\geq 0.
$$

The centered Gaussian process with this covariance has $B(0)=0$ almost surely and increment variance

$$
\operatorname{Var}\{B(t)-B(s)\}=t-s,
\qquad 0\leq s<t.
$$

For disjoint increments with $0\leq s<t\leq u<v$,

$$
\operatorname{Cov}\{B(t)-B(s),B(v)-B(u)\}=0.
$$

The increments are jointly Gaussian, so zero covariance implies independence. These calculations recover the defining finite-dimensional structure of Brownian motion directly from the kernel.

Continuity still needs proof. For every $p>0$, a centered Gaussian variable $Z$ satisfies $\mathbb E|Z|^p=C_p\{\operatorname{Var}(Z)\}^{p/2}$. Hence

$$
\mathbb E|B(t)-B(s)|^p=C_p|t-s|^{p/2}.
$$

Choosing $p>2$ gives an exponent greater than one in the one-dimensional Kolmogorov continuity criterion, yielding a continuous modification. The kernel generated the finite-dimensional process; an increment moment bound generated continuous paths. Brownian paths are nevertheless almost surely nowhere differentiable, illustrating that continuity and smoothness are separate properties.

White noise provides the complementary warning. A formal covariance $k(s,t)=\delta(s-t)$ describes a generalized Gaussian random distribution. Pointwise values would have infinite variance, so white noise is not an ordinary function-valued Gaussian process. Integrating white noise produces Brownian motion, which has finite pointwise variance and continuous paths.

### Linear functionals and observations beyond point values

The Gaussian property is stable under linear operations. For finite linear combinations, this follows from the definition. More general functionals can be obtained as limits. If $L_1,\ldots,L_q$ are linear operators for which $L_j f$ exists in mean square, then

$$
(L_1f,\ldots,L_qf)^\top
$$

is Gaussian, with

$$
\mathbb E[L_jf]=L_jm,
\qquad
\operatorname{Cov}(L_i f,L_j f)=L_i^{(x)}L_j^{(x')}k(x,x').
$$

The notation means that the first operator acts on the first argument of the kernel and the second operator on the second argument. For example, if $f$ is mean-square differentiable in coordinate $r$, then

$$
\operatorname{Cov}\!\left\{\frac{\partial f(x)}{\partial x_r},f(x')\right\}
=
\frac{\partial}{\partial x_r}k(x,x').
$$

Sufficient conditions can be checked through difference quotients. The derivative $\partial f(x)/\partial x_r$ exists in mean square when the corresponding difference quotients form a Cauchy sequence in $L^2$. Their pairwise second moments are determined by mixed derivatives of $k$, so suitable continuity of $\partial^2 k(x,x')/(\partial x_r\partial x'_r)$ near the diagonal establishes existence.

Similarly, for a deterministic weight $w$ on a measure space, the integral

$$
I=\int_{\mathcal X}w(x)f(x)\,\mu(dx)
$$

is Gaussian whenever the mean-square integral exists, with

$$
\begin{aligned}
\mathbb E[I]
&=\int w(x)m(x)\,\mu(dx),\\
\operatorname{Var}(I)
&=\iint w(x)k(x,x')w(x')\,\mu(dx)\mu(dx').
\end{aligned}
$$

This mechanism permits derivative data, areal averages, line integrals, noisy convolutions, and integral targets to enter the same conditioning framework as point observations. It also explains why Gaussian processes appear in probabilistic quadrature and inverse problems: the forward map is often linear even when the unknown object is infinite-dimensional.

The construction problem is now resolved. A positive semidefinite kernel produces compatible Gaussian finite-dimensional laws, and regularity follows from additional properties of kernel increments or derivatives. The next question is inferential: how do observations alter the entire process?

## Conditioning and prediction

### The observation model and the joint Gaussian law

Let $X=(x_1,\ldots,x_n)$ denote the observed inputs and suppose

$$
y=f_X+\varepsilon,
\qquad
\varepsilon\sim\mathcal N_n(0,\Sigma),
$$

with $\varepsilon$ independent of $f$. The matrix $\Sigma$ may describe independent homoskedastic noise $\sigma^2I_n$, heterogeneous measurement variances, or correlated Gaussian errors. Define

$$
C=K_X+\Sigma.
$$

For a finite collection of prediction inputs $X_*=(x_1^*,\ldots,x_q^*)$, write

$$
K_{**}=k(X_*,X_*),
\qquad
K_{*X}=k(X_*,X),
\qquad
K_{X*}=K_{*X}^\top.
$$

The prior and noise assumptions imply the block Gaussian distribution

$$
\begin{pmatrix}f_*\\y\end{pmatrix}
\sim
\mathcal N\!\left[
\begin{pmatrix}m_*\\m_X\end{pmatrix},
\begin{pmatrix}
K_{**} & K_{*X}\\
K_{X*} & C
\end{pmatrix}
\right].
$$

The covariance between $f_*$ and $y$ equals $K_{*X}$: independent observation noise contributes to the covariance of $y$ with itself and contributes nothing to its covariance with the latent function.

Assume first that $C$ is positive definite. Positive noise variance guarantees this whenever $\Sigma$ is positive definite. Singular cases can be handled by conditioning on the support of the Gaussian law and replacing inverses with appropriate generalized inverses, though the positive-definite case contains the central mechanism.

### Deriving the conditional distribution through an independent residual

The multivariate Gaussian conditioning formula can be derived in a way that exposes its statistical meaning. Construct the residual

$$
r_*=f_*-m_*-K_{*X}C^{-1}(y-m_X).
$$

This is the part of $f_*$ left after subtracting its best linear projection on $y$. Since $(f_*,y)$ is jointly Gaussian, the pair $(r_*,y)$ is jointly Gaussian as well. Its cross-covariance is

$$
\begin{aligned}
\operatorname{Cov}(r_*,y)
&=\operatorname{Cov}(f_*,y)
-K_{*X}C^{-1}\operatorname{Cov}(y,y)\\
&=K_{*X}-K_{*X}C^{-1}C\\
&=0.
\end{aligned}
$$

Jointly Gaussian random vectors with zero cross-covariance are independent. Consequently, $r_*$ is independent of $y$. Its covariance is

$$
\begin{aligned}
\operatorname{Var}(r_*)
&=\operatorname{Var}\{f_*-K_{*X}C^{-1}y\}\\
&=K_{**}-K_{*X}C^{-1}K_{X*}.
\end{aligned}
$$

The omitted mean terms are deterministic and do not affect covariance. Rearranging the definition of $r_*$ gives

$$
f_*=m_*+K_{*X}C^{-1}(y-m_X)+r_*.
$$

Because $r_*$ is independent of $y$, conditioning fixes the first two terms and leaves the residual distribution unchanged.

> [!theorem] Gaussian-process conditioning
> Under the Gaussian-process prior and Gaussian observation model above,
> 
> $$
> f_*\mid y
> \sim
> \mathcal N_q\!\left(
> m_*+K_{*X}C^{-1}(y-m_X),
> K_{**}-K_{*X}C^{-1}K_{X*}
> \right).
> $$

The derivation establishes several facts simultaneously. The matrix $K_{*X}C^{-1}$ contains the linear prediction weights. The conditional covariance is positive semidefinite because it is the covariance of the explicitly constructed residual $r_*$. It is also the Schur complement of $C$ in the joint covariance matrix. The uncertainty reduction depends on locations and covariance parameters, while the observed numerical values affect only the conditional mean when the hyperparameters are fixed.

Since the formula holds for every finite prediction set $X_*$, the conditional finite-dimensional distributions define a posterior Gaussian process. Its mean and covariance functions are

$$
\begin{aligned}
m_n(x)
&=m(x)+k_X(x)^\top C^{-1}(y-m_X),\\
k_n(x,x')
&=k(x,x')-k_X(x)^\top C^{-1}k_X(x').
\end{aligned}
$$

The posterior process is therefore obtained by a deterministic update of the prior mean and kernel. No discretization of the whole input domain is involved.

### Why the mean and covariance have these forms

The posterior mean is a corrected prior mean. The residual vector $y-m_X$ measures disagreement between data and prior expectation. Multiplication by $C^{-1}$ discounts residual directions that are highly variable or redundant under the model. The vector $k_X(x)$ then transports the adjusted residuals from observed inputs to the target $x$ according to prior covariance.

The posterior covariance has an explained-variance form. For a scalar target,

$$
k_n(x,x)=k(x,x)-k_X(x)^\top C^{-1}k_X(x).
$$

The subtracted term is nonnegative. It is large when $f(x)$ is strongly correlated with a well-measured linear combination of the observations and small when $x$ is weakly connected to the design. The formula is conditional on the kernel, mean, and noise parameters. Learning those quantities from the same data introduces additional uncertainty that a plug-in covariance does not include.

For a future noisy response

$$
y_*=f_*+\varepsilon_*,
\qquad
\varepsilon_*\sim\mathcal N(0,\Sigma_*),
$$

independent of all existing variables, the predictive mean remains the same and the predictive covariance becomes

$$
\operatorname{Var}(y_*\mid y)
=
K_{**}-K_{*X}C^{-1}K_{X*}+\Sigma_*.
$$

The distinction between latent-function uncertainty and future-observation uncertainty is substantive. The latter includes irreducible measurement or sampling variation.

### Interpolation and the role of the nugget

Consider independent noise with variance $\sigma^2$. If $\sigma^2>0$, then the posterior mean generally smooths rather than interpolates the data. At a training point $x_i$,

$$
m_n(x_i)=m(x_i)+e_i^\top K_X(K_X+\sigma^2I)^{-1}(y-m_X),
$$

and the multiplier $K_X(K_X+\sigma^2I)^{-1}$ shrinks noisy directions.

In the noise-free case $\Sigma=0$, assume $K_X$ is invertible. Then

$$
\begin{aligned}
m_n(x_i)
&=m(x_i)+e_i^\top K_XK_X^{-1}(y-m_X)\\
&=y_i,
\end{aligned}
$$

and, for every $x$,

$$
k_n(x_i,x)
=k(x_i,x)-e_i^\top K_XK_X^{-1}k_X(x)
=0.
$$

Thus the posterior interpolates each observed latent value and assigns zero conditional variance there. This is a logical consequence of a model in which the observation is exact and the prior covariance is known. It should not be interpreted as an unconditional guarantee that the fitted function equals the real system at that input. Numerical error, data preprocessing, kernel misspecification, and simulator discrepancy can all invalidate the exact-observation premise.

Spatial statistics often calls an independent diagonal variance component a *nugget*. It may represent measurement error, microscale variation, or a numerical stabilization term. These meanings should be distinguished. Adding a tiny “jitter” solely to stabilize a Cholesky factorization changes the computed covariance slightly; treating that value as a scientifically meaningful noise variance would conflate numerical and statistical roles.

### Sequential updating and variance reduction

The conditioning mechanism can be applied recursively. Suppose the data $D_n$ have produced posterior mean $m_n$ and covariance $k_n$. A new observation at $z$ is

$$
y_{n+1}=f(z)+\varepsilon_{n+1},
\qquad
\varepsilon_{n+1}\sim\mathcal N(0,\sigma^2),
$$

conditionally independent given $f$. Under the current posterior, the pair $(f(x),y_{n+1})$ is Gaussian with covariance

$$
\operatorname{Cov}\{f(x),y_{n+1}\mid D_n\}=k_n(x,z)
$$

and variance

$$
\operatorname{Var}(y_{n+1}\mid D_n)=k_n(z,z)+\sigma^2.
$$

A second application of the conditioning formula gives

$$
\begin{aligned}
m_{n+1}(x)
&=m_n(x)
+\frac{k_n(x,z)}{k_n(z,z)+\sigma^2}
\{y_{n+1}-m_n(z)\},\\
k_{n+1}(x,x')
&=k_n(x,x')
-\frac{k_n(x,z)k_n(z,x')}{k_n(z,z)+\sigma^2}.
\end{aligned}
$$

In particular,

$$
k_{n+1}(x,x)
=
k_n(x,x)-
\frac{k_n(x,z)^2}{k_n(z,z)+\sigma^2}
\leq k_n(x,x).
$$

The exact decrease is a squared posterior covariance divided by the predictive variance of the new observation. This identity underlies variance-based experimental design. A candidate point $z$ is informative about a target $x$ when the current posterior couples $f(z)$ strongly to $f(x)$ and when the observation at $z$ is sufficiently precise. For an integrated prediction objective with measure $\mu$, the one-step reduction is

$$
\int_{\mathcal X}
\frac{k_n(x,z)^2}{k_n(z,z)+\sigma^2}
\,\mu(dx).
$$

The data value $y_{n+1}$ changes the posterior mean after sampling; the anticipated covariance reduction can be calculated before observing it. This separation is a special consequence of Gaussian linear updating.

### Information gain and design geometry

The same covariance algebra quantifies how much a design can learn about latent function values. Assume $\Sigma$ is positive definite and consider the latent vector $f_X$. Mutual information is

$$
I(f_X;y)=H(y)-H(y\mid f_X),
$$

where $H$ denotes differential entropy. Since

$$
y\sim\mathcal N(m_X,K_X+\Sigma)
$$

and $y\mid f_X$ has covariance $\Sigma$, the Gaussian entropy formula gives

$$
\begin{aligned}
I(f_X;y)
&=\frac12\log\det(K_X+\Sigma)
-\frac12\log\det\Sigma\\
&=\frac12\log\det\!\left(
I+\Sigma^{-1/2}K_X\Sigma^{-1/2}
\right).
\end{aligned}
$$

Let $\rho_1,\ldots,\rho_n$ be the eigenvalues of the noise-whitened kernel matrix $\Sigma^{-1/2}K_X\Sigma^{-1/2}$. Then

$$
I(f_X;y)=\frac12\sum_{j=1}^n\log(1+\rho_j).
$$

Each eigen-direction contributes according to its signal-to-noise ratio. Highly correlated observations tend to concentrate covariance in a small number of directions, so adding nearby design points can produce little new information even when the sample size increases. Independent noise suppresses directions with small prior variance. This determinant criterion supplies a global counterpart to the pointwise variance-reduction formula.

Information-based design chooses inputs to enlarge this quantity, or its analogue for a target subset or functional. The calculation also explains the log-determinant term in the marginal likelihood from another angle: a covariance model with many high-variance directions has larger potential information capacity and a larger Gaussian volume. The likelihood balances that capacity against the residual actually observed.

### Conditional expectation and best linear prediction

The same mean formula has two levels of justification. Under joint Gaussianity,

$$
m_n(x)=\mathbb E\{f(x)\mid y\}.
$$

It minimizes conditional squared-error loss among all measurable predictors. If only second moments are assumed, consider predictors affine in $y$,

$$
\widehat f(x)=a+b^\top y.
$$

Minimizing $\mathbb E[(f(x)-a-b^\top y)^2]$ first gives $a=m(x)-b^\top m_X$. Differentiation with respect to $b$ then yields

$$
Cb=k_X(x),
\qquad
b=C^{-1}k_X(x).
$$

The resulting best linear predictor is exactly $m_n(x)$. Gaussianity upgrades this second-moment projection to the full conditional expectation and supplies an exact conditional distribution. Kriging often begins from the projection argument, whereas Bayesian Gaussian-process regression begins from conditioning. The algebra coincides because both are solving the same covariance projection problem.

The conditioning formulas are computationally complete once a kernel and its parameters are known. Understanding how those choices determine dependence, smoothness, geometry, and extrapolation requires a deeper study of covariance kernels.

## Covariance kernels, geometry, and regularity

### Kernel construction as model construction

A covariance kernel has to satisfy positive semidefiniteness on every finite design. This global requirement can be difficult to verify from a proposed formula, so kernels are usually built from operations that preserve validity.

If $k_1$ and $k_2$ are positive semidefinite and $a,b\geq 0$, then $ak_1+bk_2$ is positive semidefinite. The sum corresponds to adding independent Gaussian processes. If

$$
f(x)=f_1(x)+f_2(x),
\qquad
f_1\perp f_2,
$$

then $\operatorname{Cov}\{f(x),f(x')\}=k_1(x,x')+k_2(x,x')$. This supports additive decompositions into long-range, short-range, periodic, and covariate-specific components.

The pointwise product $k_1k_2$ is positive semidefinite by the Schur product theorem. Products create interactions: a periodic component multiplied by a decaying stationary component gives locally periodic behavior, for example. If $g:\mathcal X\to\mathcal Z$ and $k_0$ is valid on $\mathcal Z$, then

$$
k(x,x')=k_0\{g(x),g(x')\}
$$

is valid on $\mathcal X$. This pullback construction introduces transformed inputs, anisotropic distances, embeddings, and kernels on structured objects.

A feature representation gives another general route. If $\Phi(x)$ belongs to a Hilbert space $\mathcal F$, then

$$
k(x,x')=\langle \Phi(x),\Phi(x')\rangle_{\mathcal F}
$$

is positive semidefinite. Conversely, every positive semidefinite kernel has such a feature representation. The feature space may be infinite-dimensional and need not be constructed explicitly. This duality explains how Gaussian-process covariance calculations and kernel methods can use the same Gram matrix while starting from different interpretations.

### Stationarity and the spectral mechanism

On $\mathbb R^d$, a process is second-order stationary when its mean is constant and its covariance depends only on displacement:

$$
k(x,x')=\kappa(x-x').
$$

It is isotropic when $\kappa(h)$ depends only on $\|h\|$. Stationarity encodes translation invariance. It is a strong modeling assumption: the same dependence scale and marginal variance apply throughout the domain.

Bochner’s theorem characterizes continuous stationary kernels. A continuous function $\kappa:\mathbb R^d\to\mathbb C$ with $\kappa(0)<\infty$ is positive semidefinite exactly when it can be written as

$$
\kappa(h)=\int_{\mathbb R^d}e^{i\omega^\top h}\,F(d\omega),
$$

where $F$ is a finite nonnegative measure. For a real-valued process, $F$ is symmetric. When $F$ has a density $S$, that density is the spectral density, subject to the chosen Fourier normalization.

This representation gives a direct interpretation. Low frequencies produce broad, slowly varying components. High frequencies permit rapid local variation. Smoothness depends on spectral moments. If

$$
\int_{\mathbb R^d}\|\omega\|^{2q}F(d\omega)<\infty,
$$

then derivatives of total order up to $q$ exist in mean square under standard regularity conditions. Differentiation multiplies the Fourier component $e^{i\omega^\top x}$ by powers of $i\omega$, and the displayed integral is the derivative variance.

The squared-exponential kernel is

$$
k_{\mathrm{SE}}(x,x')
=\tau^2\exp\!\left(-\frac{\|x-x'\|^2}{2\ell^2}\right).
$$

Its spectral density is Gaussian and therefore has moments of every order. The associated process has mean-square derivatives of all orders and admits very smooth sample paths. The length scale $\ell$ determines how rapidly correlation decays in input space, while $\tau^2$ is the marginal variance.

The Matérn family separates variance, range, and smoothness more explicitly. A common parameterization is

$$
k_{\nu,\ell}(x,x')
=
\tau^2\frac{2^{1-\nu}}{\Gamma(\nu)}
\left(\frac{\sqrt{2\nu}\,r}{\ell}\right)^\nu
K_\nu\!\left(\frac{\sqrt{2\nu}\,r}{\ell}\right),
\qquad
r=\|x-x'\|,
$$

where $K_\nu$ is the modified Bessel function of the second kind. Its spectral density has the form

$$
S(\omega)
\propto
\left(\frac{2\nu}{\ell^2}+\|\omega\|^2\right)^{-(\nu+d/2)}.
$$

At high frequency,

$$
S(\omega)\asymp \|\omega\|^{-(2\nu+d)}.
$$

For a derivative of integer order $q$, the relevant spectral moment behaves in polar coordinates like

$$
\int^{\infty} r^{2q}r^{-(2\nu+d)}r^{d-1}\,dr
=
\int^{\infty} r^{2q-2\nu-1}\,dr.
$$

The tail integral is finite exactly when $q<\nu$. Thus a Matérn process is $q$ times mean-square differentiable when $q<\nu$. The parameter $\nu$ controls local roughness through a precise high-frequency mechanism. For $\nu=1/2$, the covariance is exponential and sample paths have the roughness associated with the Ornstein–Uhlenbeck process. As $\nu$ increases, high frequencies are suppressed more strongly. Under the scaling above, the Matérn kernel converges to the squared-exponential kernel as $\nu\to\infty$.

Different references place factors such as $\sqrt{2\nu}$ inside the range parameter or absorb constants into the spectral density. Comparisons of estimated length scales or microergodic parameters must account for these conventions.

Nonstationary structure can be built through spatially varying features, input warping, process convolutions, differential operators, or mixtures of local kernels. A polynomial kernel induces global algebraic behavior. A periodic kernel can be obtained by embedding a scalar input into the unit circle. Additive kernels represent sums of lower-dimensional effects and can mitigate some aspects of high-dimensional input geometry. Each construction changes the prior dependence and therefore changes both interpolation and extrapolation.

### The canonical metric and sample-path regularity

For a centered Gaussian process, kernel increments define the canonical pseudometric

$$
\begin{aligned}
d_k(x,x')^2
&=\mathbb E\{f(x)-f(x')\}^2\\
&=k(x,x)+k(x',x')-2k(x,x').
\end{aligned}
$$

It is a pseudometric because distinct points can have zero distance when the process assigns identical values to them almost surely. This metric measures stochastic distinguishability. Inputs close in Euclidean distance need not be close in $d_k$ when the kernel is nonstationary or anisotropic.

The canonical metric connects covariance behavior near the diagonal to continuity. Suppose $\mathcal X\subset\mathbb R^d$ and, for some $\alpha>0$,

$$
d_k(x,x')\leq C\|x-x'\|^\alpha
$$

locally. For every $p>0$, Gaussian moments give

$$
\mathbb E|f(x)-f(x')|^p
=C_p d_k(x,x')^p
\leq C_pC^p\|x-x'\|^{\alpha p}.
$$

If $\alpha p>d$, the Kolmogorov continuity theorem yields a continuous modification, with a Hölder exponent below $\alpha-d/p$. Taking large $p$ often gives any exponent strictly below $\alpha$. This argument identifies the mechanism: the kernel controls increment variance, Gaussianity converts variance into all moments, and the continuity theorem turns moment decay into path regularity.

On general index sets, metric entropy replaces Euclidean dimension. Bounds involving covering numbers of $(\mathcal X,d_k)$, such as Dudley’s entropy integral, control boundedness and uniform continuity. These results matter when the index set is high-dimensional, functional, or combinatorial. A bounded pointwise variance alone does not ensure bounded sample paths; the number of effectively distinguishable locations also matters.

Mean-square smoothness and almost-sure path smoothness should be distinguished. Mean-square derivatives are limits in $L^2(\Omega)$. Almost-sure differentiability concerns individual sample paths and generally requires stronger arguments. For common Matérn and squared-exponential kernels the two notions align in familiar ways, though the precise path regularity is best stated in Hölder or Sobolev spaces rather than inferred solely from visual smoothness of the covariance function.

### Reproducing-kernel Hilbert space geometry

Every positive semidefinite kernel defines a reproducing-kernel Hilbert space. Begin with finite linear combinations

$$
g(\cdot)=\sum_{i=1}^r a_i k(x_i,\cdot).
$$

For two such functions, define

$$
\left\langle
\sum_i a_i k(x_i,\cdot),
\sum_j b_j k(x'_j,\cdot)
\right\rangle_{\mathcal H_k}
=
\sum_{i,j}a_i b_j k(x_i,x'_j).
$$

Positive semidefiniteness makes this a nonnegative quadratic form. After identifying zero-norm elements and completing the resulting inner-product space, one obtains $\mathcal H_k$. Its defining property is reproduction:

$$
g(x)=\langle g,k(x,\cdot)\rangle_{\mathcal H_k}.
$$

Point evaluation is therefore a continuous linear functional on $\mathcal H_k$. The norm $\|g\|_{\mathcal H_k}$ measures the size of a function in the geometry induced by the kernel. For spline kernels it corresponds to a derivative-based roughness measure after handling a finite-dimensional null space. For stationary kernels it can often be written spectrally as an inverse-density weighted energy,

$$
\|g\|_{\mathcal H_k}^2
\asymp
\int_{\mathbb R^d}
\frac{|\widehat g(\omega)|^2}{S(\omega)}\,d\omega,
$$

for functions and conventions under which the expression is defined. Frequencies assigned small prior spectral density are expensive in RKHS norm. For a Matérn kernel, this RKHS is equivalent on regular bounded domains to a Sobolev space of order $\nu+d/2$, subject to boundary and restriction details.

The RKHS enters Gaussian-process theory in several roles. It is the Cameron–Martin space of the Gaussian measure: shifts by functions in $\mathcal H_k$ have finite Gaussian energy and, under the standard function-space construction, preserve absolute continuity of the shifted measure. It determines the support through its closure in the ambient topology. It also supplies the penalty whose minimizer equals the Gaussian-process posterior mean under Gaussian regression.

A crucial subtlety is that typical Gaussian-process sample paths usually lie outside their own RKHS. This can be seen through a Mercer expansion. Let $\mathcal X$ be compact, let $\mu$ be a finite measure, and let $k$ be continuous. The integral operator

$$
(T_kg)(x)=\int_{\mathcal X}k(x,x')g(x')\,\mu(dx')
$$

is positive and compact under standard conditions. Let $(\lambda_j,\phi_j)$ denote its positive eigenpairs. Then

$$
k(x,x')=\sum_{j=1}^\infty \lambda_j\phi_j(x)\phi_j(x')
$$

in the Mercer sense, and a centered Gaussian process has the Karhunen–Loève representation

$$
f(x)=\sum_{j=1}^\infty \sqrt{\lambda_j}Z_j\phi_j(x)
$$

in $L^2(\mu)$ when the kernel is trace class. A function $g=\sum_j g_j\phi_j$ belongs to the RKHS exactly when

$$
\|g\|_{\mathcal H_k}^2
=
\sum_{j=1}^\infty\frac{g_j^2}{\lambda_j}<\infty.
$$

For the random path, $g_j=\sqrt{\lambda_j}Z_j$, so its formal RKHS norm is

$$
\sum_{j=1}^\infty Z_j^2.
$$

If the kernel has infinite rank, this sum diverges almost surely. Hence

$$
\mathbb P(f\in\mathcal H_k)=0
$$

under these conditions. The RKHS describes directions of controlled shifts, deterministic regularity, and posterior-mean geometry. It does not describe a set containing typical prior draws.

This fact resolves an apparent contradiction. A Matérn kernel with parameter $\nu$ has an RKHS roughly as smooth as Sobolev order $\nu+d/2$, while its sample paths have regularity roughly below order $\nu$. The extra $d/2$ is the gap between square-summable deterministic coefficients and random Gaussian coefficients spread across infinitely many directions.

### Support and approximation

Let the Gaussian process define a tight Gaussian measure $\Pi$ on a separable Banach space $B$, such as $C(\mathcal X)$ under conditions guaranteeing continuous paths. For a centered process, the support of $\Pi$ is

$$
\operatorname{supp}(\Pi)=\overline{\mathcal H_k}^{\|\cdot\|_B}.
$$

Thus an open neighborhood of $f_0$ receives positive prior probability exactly when $f_0$ lies in the Banach-space closure of the RKHS. A universal kernel may have an RKHS dense in $C(\mathcal X)$, giving broad support even though every individual RKHS function can be highly regular. Support alone is qualitative. It says that approximation is possible, without saying how much prior mass lies near the target. Posterior rates depend on that quantitative mass, which leads from kernel geometry to statistical learning.


## Statistical inference and learning

### Learning covariance and mean parameters

In applications, the kernel is usually a family $k_\theta$ indexed by parameters such as marginal variance, length scales, anisotropy coefficients, smoothness, periodicity, and noise variance. Conditional prediction given $\theta$ is explicit. Statistical inference must also determine how the data inform $\theta$.

Under the Gaussian observation model,

$$
f_X\sim\mathcal N(m_X,K_\theta),
\qquad
\varepsilon\sim\mathcal N(0,\Sigma_\theta),
$$

independence implies

$$
y\sim\mathcal N\{m_X,C_\theta\},
\qquad
C_\theta=K_\theta+\Sigma_\theta.
$$

The latent vector has been integrated out exactly because the sum of independent Gaussian vectors is Gaussian. Let $r=y-m_X$. The log marginal likelihood is

$$
\ell(\theta)
=-\frac12r^\top C_\theta^{-1}r
-\frac12\log\det C_\theta
-\frac n2\log(2\pi).
$$

The first term measures fit in the covariance metric. A model can reduce it by increasing variance or creating directions aligned with the residuals. The log-determinant term accounts for the volume of the Gaussian distribution and penalizes diffuse covariance structures. Both terms arise from the same normalized Gaussian density; describing them as an informal fit-versus-complexity trade-off is useful only after recognizing this exact probabilistic origin.

For a parameter $\theta_j$ entering the covariance and a mean independent of $\theta_j$, define

$$
\alpha=C_\theta^{-1}r.
$$

Matrix differential identities give

$$
d(r^\top C^{-1}r)
=-r^\top C^{-1}(dC)C^{-1}r
=-\alpha^\top(dC)\alpha
$$

and

$$
d\log\det C=\operatorname{tr}(C^{-1}dC).
$$

Therefore

$$
\frac{\partial\ell}{\partial\theta_j}
=
\frac12\operatorname{tr}\!\left[
\left(\alpha\alpha^\top-C_\theta^{-1}\right)
\frac{\partial C_\theta}{\partial\theta_j}
\right].
$$

The term $\alpha\alpha^\top$ reflects covariance directions supported by the observed residual, while $C^{-1}$ is the model’s own precision-weighted volume correction. If the mean depends on $\theta_j$, an additional term $(\partial m_X/\partial\theta_j)^\top C^{-1}r$ appears.

Maximizing $\ell(\theta)$ gives an empirical-Bayes or type-II maximum-likelihood estimate. A full Bayesian analysis assigns a prior $p(\theta)$ and averages predictions over

$$
p(\theta\mid y)\propto p(y\mid\theta)p(\theta).
$$

The plug-in approach is computationally simpler and often effective. It conditions uncertainty statements on an estimated hyperparameter value, which can make intervals too narrow when the hyperparameter likelihood is diffuse or multimodal. Full averaging propagates this uncertainty and usually requires numerical integration, Markov chain Monte Carlo, or variational approximation.

A structured mean is often needed because covariance alone should not carry all large-scale behavior. Let

$$
m(x)=h(x)^\top\beta,
$$

where $h(x)\in\mathbb R^p$ contains regressors and $H$ is the $n\times p$ matrix with rows $h(x_i)^\top$. For fixed covariance parameters, generalized least squares gives

$$
\widehat\beta
=(H^\top C^{-1}H)^{-1}H^\top C^{-1}y,
$$

provided $H$ has full column rank in the $C^{-1}$ geometry. One can profile $\beta$, integrate it under a proper prior, or use a restricted likelihood to reduce covariance-parameter bias associated with estimating the mean. Spatial statistics refers to prediction with an unknown regression mean as universal kriging.

### Identifiability depends on the sampling regime

Kernel parameters can be weakly identified even under an exact Gaussian model. Marginal variance and range may compensate for one another over the observed distances. The relevant asymptotics depend on how the design expands.

Under increasing-domain asymptotics, observations cover a growing spatial region and reveal long-range behavior. Under fixed-domain, or infill, asymptotics, increasingly dense observations are collected inside a bounded region. These regimes contain different information. For a Matérn covariance with fixed smoothness $\nu$ on a regular bounded domain in dimensions $d\leq 3$, the standard equivalence result shows that distinct variance and range values can induce equivalent Gaussian measures when the combination

$$
\frac{\tau^2}{\ell^{2\nu}}
$$

is held fixed, up to a constant determined by the chosen Matérn parameterization. This combination is microergodic and can be consistently estimable under infill, while $\tau^2$ and $\ell$ separately need not be. Zhang’s fixed-domain result is a precise counterexample to the belief that denser sampling automatically identifies every covariance parameter.

Prediction can remain asymptotically efficient even when individual covariance parameters are inconsistent, because equivalent measures can generate asymptotically equivalent interpolations. The practical implication is narrower than “kernel parameters do not matter.” Smoothness, nugget structure, nonstationarity, and extrapolation can matter greatly; specific variance-range decompositions may carry limited information under a bounded-domain design.

### Posterior mean as kernel regularization

The connection to deterministic smoothing can be derived exactly. Let the prior be

$$
f\sim\operatorname{GP}(0,\tau^2k)
$$

and suppose

$$
y_i=f(x_i)+\varepsilon_i,
\qquad
\varepsilon_i\stackrel{\text{iid}}{\sim}\mathcal N(0,\sigma^2).
$$

Let $\mathcal H_k$ be the RKHS of the base kernel $k$. Consider the objective

$$
J(g)
=
\frac{1}{2\sigma^2}\sum_{i=1}^n\{y_i-g(x_i)\}^2
+
\frac{1}{2\tau^2}\|g\|_{\mathcal H_k}^2,
\qquad g\in\mathcal H_k.
$$

The first term is the negative Gaussian log-likelihood up to constants when $g$ is treated as a candidate regression function. The second term is the squared Cameron–Martin energy associated with the prior scale. To find the minimizer, define

$$
\mathcal S=\operatorname{span}\{k(x_1,\cdot),\ldots,k(x_n,\cdot)\}.
$$

Every $g\in\mathcal H_k$ has an orthogonal decomposition $g=g_\parallel+g_\perp$ with $g_\parallel\in\mathcal S$ and $g_\perp\perp\mathcal S$. By the reproducing property,

$$
g_\perp(x_i)
=\langle g_\perp,k(x_i,\cdot)\rangle_{\mathcal H_k}
=0.
$$

The data-fit term therefore depends only on $g_\parallel$, while

$$
\|g\|_{\mathcal H_k}^2
=
\|g_\parallel\|_{\mathcal H_k}^2
+
\|g_\perp\|_{\mathcal H_k}^2.
$$

Any nonzero $g_\perp$ increases the objective without changing fitted values. The unique minimizer lies in $\mathcal S$ and has the form

$$
\widehat g(\cdot)=\sum_{j=1}^n a_jk(x_j,\cdot).
$$

Let $K=(k(x_i,x_j))_{i,j=1}^n$. The vector of fitted values is $Ka$, and the RKHS norm is $a^\top Ka$ for this representation. Substitution gives

$$
J(a)
=
\frac{1}{2\sigma^2}\|y-Ka\|^2
+
\frac{1}{2\tau^2}a^\top Ka.
$$

A coefficient vector

$$
a=\left(K+\frac{\sigma^2}{\tau^2}I_n\right)^{-1}y
$$

satisfies the first-order condition and defines the unique minimizing function. Consequently,

$$
\widehat g(x)
=k_X(x)^\top
\left(K+\frac{\sigma^2}{\tau^2}I_n\right)^{-1}y.
$$

The Gaussian-process posterior mean is

$$
\begin{aligned}
\mathbb E\{f(x)\mid y\}
&=\tau^2k_X(x)^\top(\tau^2K+\sigma^2I_n)^{-1}y\\
&=k_X(x)^\top
\left(K+\frac{\sigma^2}{\tau^2}I_n\right)^{-1}y.
\end{aligned}
$$

The two functions are identical. With the normalized objective

$$
\frac1n\sum_{i=1}^n\{y_i-g(x_i)\}^2
+\lambda\|g\|_{\mathcal H_k}^2,
$$

the matching penalty parameter is

$$
\lambda=\frac{\sigma^2}{n\tau^2}.
$$

This normalization explains why different texts report either $\sigma^2/\tau^2$ or $\sigma^2/(n\tau^2)$ as the regularization parameter.

The equivalence concerns the posterior mean. Gaussian-process inference additionally provides a posterior covariance and distributions for linear and nonlinear functionals. Referring to the penalized solution as an ordinary infinite-dimensional posterior mode requires care because a Gaussian measure has no density relative to a translation-invariant measure on function space and typical sample paths lie outside the RKHS. Generalized mode concepts based on small balls or the Onsager–Machlup functional can recover related variational characterizations under suitable conditions.

### Spectral shrinkage and the source of statistical rates

At the observed inputs, the fitted vector is

$$
\widehat f_X
=K(K+\lambda_0I_n)^{-1}y,
\qquad
\lambda_0=\frac{\sigma^2}{\tau^2}.
$$

Let $K=UDU^\top$ with eigenvalues $d_1,\ldots,d_n\geq 0$. Then

$$
\widehat f_X
=U\operatorname{diag}\!\left(
\frac{d_j}{d_j+\lambda_0}
\right)U^\top y.
$$

Each empirical kernel direction is multiplied by a shrinkage factor between zero and one. Directions with $d_j\gg\lambda_0$ are retained, while directions with $d_j\ll\lambda_0$ are strongly attenuated. A common effective-degrees-of-freedom measure is

$$
\operatorname{df}(\lambda_0)
=
\operatorname{tr}\{K(K+\lambda_0I)^{-1}\}
=
\sum_{j=1}^n\frac{d_j}{d_j+\lambda_0}.
$$

This finite-sample decomposition shows how the kernel spectrum and noise-to-signal ratio determine model complexity.

A population analogue clarifies convergence rates. Let $T_k$ be the kernel integral operator with eigenvalues $\mu_j$ and eigenfunctions $\phi_j$, and expand the target as $f_0=\sum_j f_{0j}\phi_j$. In an idealized diagonal sequence approximation, kernel ridge regression applies the filter $\mu_j/(\mu_j+\lambda)$. Its squared bias has the form

$$
B(\lambda)
=
\sum_{j=1}^\infty
\left(\frac{\lambda}{\mu_j+\lambda}\right)^2f_{0j}^2,
$$

while the stochastic contribution is of order

$$
V(\lambda)
\asymp
\frac{\sigma^2}{n}
\sum_{j=1}^\infty
\left(\frac{\mu_j}{\mu_j+\lambda}\right)^2.
$$

The effective dimension

$$
\mathcal N(\lambda)
=
\sum_{j=1}^\infty\frac{\mu_j}{\mu_j+\lambda}
$$

usually has the same order as the variance sum and measures the number of eigen-directions visible above scale $\lambda$. The error decomposition is therefore

$$
\text{risk}
\approx
\text{approximation bias }B(\lambda)
+
\frac{\sigma^2}{n}\mathcal N(\lambda).
$$

Suppose, as a stylized Sobolev example, that $s>d/2$,

$$
\mu_j\asymp j^{-2s/d},
$$

and the truth has smoothness $\alpha\leq s$ in the same eigenbasis. Then

$$
\mathcal N(\lambda)\asymp\lambda^{-d/(2s)},
\qquad
B(\lambda)\asymp\lambda^{\alpha/s}
$$

under the corresponding source conditions. Balancing the two contributions gives

$$
\lambda
\asymp n^{-2s/(2\alpha+d)}
$$

and

$$
\text{mean squared error}
\asymp n^{-2\alpha/(2\alpha+d)}.
$$

The exponent contains two mechanisms. The numerator $2\alpha$ reflects target smoothness and approximation bias. The denominator adds the effective dimension $d$, which determines how rapidly the number of estimable directions grows. These relations are model-dependent asymptotic statements, rather than universal formulas for every kernel, design, and norm. They explain why kernel smoothness, prior scaling, and dimensionality directly affect learning rates.

### Bayesian support and posterior contraction

A Bayesian rate analysis asks how rapidly the posterior mass concentrates around a true function $f_0$. Let a centered Gaussian prior $W$ be a random element of a separable Banach space $(B,\|\cdot\|)$ with RKHS $\mathcal H$. A central quantity is the concentration function

$$
\phi_{f_0}(\varepsilon)
=
\inf_{h\in\mathcal H:\,\|h-f_0\|<\varepsilon}
\frac12\|h\|_{\mathcal H}^2
-
\log\mathbb P(\|W\|<\varepsilon).
$$

Some references omit the factor $1/2$; this changes constants and leaves rates unchanged. The first term is an approximation cost: how much RKHS energy is needed to approach $f_0$ within $\varepsilon$. The second is a centered small-ball cost: how much prior mass the Gaussian process places in an $\varepsilon$-ball around zero. Gaussian shift inequalities connect these two pieces to prior mass near $f_0$.

Across regression, white-noise, density, and classification models, a typical sufficient scale $\varepsilon_n$ satisfies

$$
\phi_{f_0}(\varepsilon_n)
\lesssim n\varepsilon_n^2,
$$

along with model-specific testing and metric conditions. The term $n\varepsilon_n^2$ is the statistical information scale at which likelihood tests can separate alternatives. The concentration function must supply enough prior mass at that scale. Van der Vaart and van Zanten’s theory makes this principle precise for broad classes of Gaussian-process priors.

This formulation reveals why support is insufficient for a rate. The condition $f_0\in\overline{\mathcal H}$ ensures positive mass in every neighborhood, yet the required RKHS norm may grow rapidly as the approximation tolerance shrinks. An excessively smooth prior can approximate a rough truth only through high-energy elements, slowing contraction. A rough prior can spread mass across too many directions for a very smooth truth. Rescaling the input, placing a prior on a length scale, or using hierarchical covariance parameters can improve adaptation, subject to conditions on the hyperprior and the true function.

Posterior contraction also does not guarantee calibrated credible bands. Concentration concerns the diameter of posterior mass around the truth. Frequentist coverage depends on bias, posterior spread, self-similarity or polished-tail conditions, hyperparameter learning, and the type of credible set. Pointwise intervals may behave differently from simultaneous bands. This distinction becomes important whenever Gaussian-process uncertainty is reported as a confidence statement.

### Non-Gaussian likelihoods

The Gaussian process can remain the latent model when observations are non-Gaussian. For binary data one may set

$$
\mathbb P(Y_i=1\mid f)=g\{f(x_i)\},
$$

with a logistic or probit link. Counts can use a log intensity, and survival or point-process models can place a GP on a transformed hazard or intensity. The posterior then has the finite-dimensional form

$$
p(f_X\mid y)
\propto
\left\{\prod_{i=1}^np(y_i\mid f(x_i))\right\}
\mathcal N(f_X;m_X,K_X),
$$

which is generally non-Gaussian. The exact conjugate conditioning formulas no longer apply. Laplace approximation, expectation propagation, data augmentation, Markov chain Monte Carlo, and variational inference replace the closed-form update.

The kernel continues to govern latent dependence and regularity. The likelihood changes how observations inform the latent values and often weakens identifiability in regions with separation, sparse events, or saturation of the link function. Approximation error becomes an additional inferential component, so uncertainty reflects the prior, likelihood, hyperparameter treatment, and numerical inference scheme.

## Applications, computation, and limitations

### Spatial prediction and the kriging equations

Let observations be taken at spatial locations $s_1,\ldots,s_n$ and consider the model

$$
Y(s)=h(s)^\top\beta+Z(s)+\varepsilon(s),
$$

where $Z$ is a centered Gaussian random field with covariance $k$, and measurement errors at sampled sites have covariance matrix $\Sigma$. Write $H$ for the matrix with rows $h(s_i)^\top$, set

$$
C=K+\Sigma,
\qquad
c_0=\bigl(k(s_1,s_0),\ldots,k(s_n,s_0)\bigr)^\top,
\qquad
k_{00}=k(s_0,s_0).
$$

If $\beta$ is known, Gaussian conditioning gives the latent-field predictor

$$
\widehat Y(s_0)
=h(s_0)^\top\beta+c_0^\top C^{-1}(y-H\beta)
$$

and conditional variance

$$
\operatorname{Var}\{Z(s_0)\mid y,\beta\}
=k_{00}-c_0^\top C^{-1}c_0.
$$

This is *simple kriging*. The weights are determined by covariance with the target and by covariance among the observations. A nearby observation can receive a small weight when it is largely redundant with other nearby observations; distance alone does not determine influence.

When $\beta$ is unknown, consider a linear predictor $\lambda^\top y$. Unbiasedness for every $\beta$ requires

$$
H^\top\lambda=h(s_0).
$$

Its mean squared prediction error for the latent response is

$$
R(\lambda)
=k_{00}-2\lambda^\top c_0+\lambda^\top C\lambda.
$$

Minimizing this explicit criterion subject to the unbiasedness constraint gives the universal-kriging weights. Introduce a Lagrange multiplier and solve the first-order equations. The result is

$$
\lambda
=C^{-1}c_0
+C^{-1}H(H^\top C^{-1}H)^{-1}
\{h(s_0)-H^\top C^{-1}c_0\}.
$$

The corresponding minimum prediction variance is

$$
\begin{aligned}
R(\lambda)
&=k_{00}-c_0^\top C^{-1}c_0\\
&\quad+
\{h(s_0)-H^\top C^{-1}c_0\}^\top
(H^\top C^{-1}H)^{-1}
\{h(s_0)-H^\top C^{-1}c_0\}.
\end{aligned}
$$

The first line is the simple-kriging uncertainty with a known mean. The second term is the additional cost of estimating the trend. For an unknown constant mean, $H$ is a column of ones and the method is ordinary kriging.

Under Gaussianity and an appropriate treatment of $\beta$, these predictors coincide with posterior means. Under a second-order random-field model without Gaussian finite-dimensional distributions, they retain the best linear unbiased prediction property. This distinction is useful: kriging requires covariance assumptions for linear optimality, while exact conditional quantiles and Gaussian prediction intervals require a distributional assumption.

For a stationary field, the semivariogram is

$$
\gamma(h)
=\frac12\operatorname{Var}\{Z(s+h)-Z(s)\}
=k(0)-k(h).
$$

The variogram emphasizes increments and is often more natural in spatial applications. Intrinsic geostatistical models can be formulated through valid variograms even when a stationary covariance for levels is unavailable. That framework extends beyond ordinary covariance-based Gaussian processes, although the same projection principles remain visible.

This application also exposes design dependence. Dense sampling in a bounded region improves local interpolation and can identify microergodic covariance combinations. It may provide little information about long-range behavior outside the region. Prediction at an unobserved site inside the sampled domain and extrapolation far beyond it are statistically different tasks, even when both are produced by the same software call.

### Nonparametric regression, splines, and functionals

For one-dimensional curve estimation, suppose

$$
y_i=f(t_i)+\varepsilon_i,
\qquad
\varepsilon_i\sim\mathcal N(0,\sigma_i^2).
$$

A GP prior supplies predictions at irregularly spaced inputs, accommodates unequal error variances through a diagonal $\Sigma$, and yields joint posterior distributions for the curve. The earlier RKHS derivation shows that the posterior mean solves a penalized least-squares problem. Smoothing splines arise when the penalty is

$$
\int_a^b\{g^{(m)}(t)\}^2\,dt.
$$

Its null space consists of polynomials of degree at most $m-1$. The classical smoothing-spline objective is

$$
\frac1n\sum_{i=1}^n\{y_i-g(t_i)\}^2
+
\lambda\int_a^b\{g^{(m)}(t)\}^2\,dt.
$$

The stochastic-process interpretation assigns a Gaussian prior to the penalized component, often through an $m$-fold integrated white-noise process, and treats the polynomial null-space coefficients separately. A diffuse prior on those coefficients leads to an improper prior on the full function while still producing a proper posterior under suitable design conditions. Proper boundary conditions or proper coefficient priors yield a proper Gaussian process. This qualification is essential when stating the Kimeldorf–Wahba correspondence: the Bayesian representation can involve generalized or partially improper process priors, depending on the spline formulation.

The application goes beyond estimating $f(t)$ itself. If the kernel is differentiable enough, the posterior for $f'(t)$ follows by differentiating the posterior mean and kernel. If the target is an average

$$
A=\int_a^b w(t)f(t)\,dt,
$$

then $(A,y)$ is jointly Gaussian. Its posterior mean and variance are obtained by replacing the pointwise covariance vector with

$$
\operatorname{Cov}(y_i,A)
=
\int_a^b k(t_i,t)w(t)\,dt
$$

and the prior variance with

$$
\operatorname{Var}(A)
=
\int_a^b\int_a^b
w(t)k(t,t')w(t')\,dt\,dt'.
$$

Thus uncertainty for slopes, cumulative effects, contrasts, and integrals is propagated from the same joint law. Numerically differentiating a fitted mean and ignoring covariance would lose this coherence.

Pointwise posterior intervals answer a local question at each fixed input. A simultaneous credible band concerns the random variable

$$
\sup_{t\in[a,b]}
\frac{|f(t)-m_n(t)|}{\sqrt{k_n(t,t)}}.
$$

Its quantile depends on the posterior correlation across $t$ and is generally larger than a pointwise Gaussian quantile. Frequentist coverage of either construction depends on smoothing bias, prior regularity, hyperparameter learning, and the truth. A visually narrow band can reflect a confident conditional model even when the chosen kernel excludes relevant shape features.

### Computer experiments and sequential design

Let $\eta(x)$ be the output of a deterministic computer code that is expensive to evaluate. The statistical target is an unknown deterministic response surface, and randomness enters through the prior representation of uncertainty. Given runs $\eta(x_1),\ldots,\eta(x_n)$, a Gaussian-process emulator provides a predictive distribution at untried inputs.

With a zero nugget and an invertible kernel matrix, the posterior mean interpolates the runs and the posterior variance vanishes at design points. This is appropriate when evaluations are numerically exact and repeated runs at the same input agree. A positive nugget may be justified by stochastic simulation error, solver tolerance, unresolved input variation, or deliberate regularization. Its substantive meaning should be stated because it changes both interpolation and design.

The posterior covariance can guide where to run the code next. If $z$ is a candidate input, the integrated reduction in latent variance is

$$
\Delta_n(z)
=
\int_{\mathcal X}
\frac{k_n(x,z)^2}{k_n(z,z)+\sigma^2}
\,\mu(dx).
$$

Choosing $z$ to maximize $\Delta_n(z)$ greedily minimizes the next integrated posterior variance. The numerator rewards a candidate that is correlated with many uncertain targets. The denominator discounts a candidate whose response is already uncertain because of observation noise. Maximum-variance sampling uses $k_n(z,z)$ as a simpler local criterion. Optimization-oriented acquisitions, such as expected improvement, also combine posterior mean and variance, though they target discovery of an optimum rather than global reconstruction.

Emulation separates expensive function evaluation from inexpensive statistical prediction. It does not remove model discrepancy. When a simulator is calibrated to physical data, an additional discrepancy process is often introduced:

$$
y_{\mathrm{physical}}(x)
=\eta(x,\theta)+\delta(x)+\varepsilon(x).
$$

The calibration parameter $\theta$ and discrepancy $\delta$ can be strongly confounded. Flexible discrepancy can explain departures that would otherwise identify $\theta$. This is an identifiability problem in the statistical model, not a numerical defect of Gaussian-process conditioning.

### Exact computation and what makes it expensive

For Gaussian regression, exact computation should use a Cholesky factorization rather than an explicit matrix inverse. Let

$$
C=K_X+\Sigma=LL^\top
$$

with $L$ lower triangular. Solve

$$
Lz=y-m_X,
\qquad
L^\top\alpha=z.
$$

Then $\alpha=C^{-1}(y-m_X)$. For a target $x$, solve

$$
Lv=k_X(x).
$$

The posterior quantities are

$$
\begin{aligned}
m_n(x)&=m(x)+k_X(x)^\top\alpha,\\
k_n(x,x)&=k(x,x)-v^\top v.
\end{aligned}
$$

The log determinant needed for the marginal likelihood is

$$
\log\det C=2\sum_{i=1}^n\log L_{ii}.
$$

Dense Cholesky factorization costs $O(n^3)$ arithmetic and stores $O(n^2)$ numbers. A posterior mean at one test input costs $O(n)$ after factorization, while its variance requires an $O(n^2)$ triangular solve. These costs are acceptable for moderate $n$ and become decisive for large data sets. Poor conditioning can arise from nearly duplicate inputs, very long length scales, or tiny noise variance. Input scaling, stable parameterizations, pivoting in specialized settings, and a clearly documented numerical jitter can be necessary.

Low-rank methods approximate the process through $m\ll n$ inducing variables $u=f(Z)$ at selected inducing inputs $Z$. Define

$$
Q_{nn}=K_{nm}K_{mm}^{-1}K_{mn}.
$$

This is the Nyström covariance explained through the inducing variables. For zero mean and independent noise $\sigma^2I$, a standard variational construction yields the lower bound

$$
\log p(y)
\geq
\log\mathcal N\{y;0,Q_{nn}+\sigma^2I\}
-
\frac{1}{2\sigma^2}
\operatorname{tr}(K_{nn}-Q_{nn}).
$$

The trace term records prior variance discarded by the low-rank representation. Optimizing the bound chooses inducing locations and hyperparameters while controlling the discrepancy from the full covariance. The leading cost is typically $O(nm^2+m^3)$ with $O(nm)$ storage, depending on implementation and likelihood.

Other scalable methods exploit different structure. Vecchia approximations factor the joint density into low-dimensional conditional densities based on selected neighbors, producing sparse precision structure that is especially effective for spatial data. One-dimensional Matérn processes with half-integer smoothness admit finite-dimensional state-space representations, allowing Kalman filtering and smoothing with cost linear in the number of ordered observations for fixed state dimension. Random Fourier features approximate a stationary kernel by a finite feature inner product sampled from its spectral measure, converting the GP into an approximate Bayesian linear model. Each method preserves a different aspect of the exact process: low rank preserves global modes, neighbor factorizations preserve local conditional dependence, state-space methods preserve Markov structure, and random features preserve the stationary spectrum in expectation.

### Limitations and recurrent misconceptions

Gaussian-process uncertainty is conditional on the mean family, kernel family, likelihood, hyperparameters, and approximation method. The posterior variance can be computed exactly under those assumptions and still fail to represent real-world uncertainty under misspecification. This matters most in extrapolation, where the data contribute little and the prior mean and kernel dominate.

A covariance kernel encodes much more than smoothness. It determines stationarity, anisotropy, periodicity, interaction structure, long-range dependence, and the geometry of nearby inputs. Selecting a squared-exponential kernel because it produces visually smooth curves can impose unrealistically rapid spectral decay and overconfident interpolation. Estimating a length scale cannot fully compensate for a wrong smoothness class.

Gaussian finite-dimensional distributions imply elliptical dependence and light conditional tails. Covariance then determines all finite-dimensional dependence. Processes with outliers, asymmetric innovations, random discontinuities, volatility clustering, or regime mixtures may require Student processes, transformed GPs, mixture models, Lévy-driven processes, or robust observation models. A non-Gaussian likelihood handles non-Gaussian observations while leaving the latent process Gaussian; it does not create heavy-tailed latent increments by itself.

The RKHS is frequently misidentified as the space of likely sample paths. In infinite-rank settings, typical draws lie outside the RKHS almost surely. The RKHS controls deterministic interpolation, Cameron–Martin shifts, support, and approximation energy. Sample regularity is governed by the covariance spectrum with a dimension-dependent gap from RKHS smoothness.

Hyperparameter optimization can have local maxima, flat ridges, and boundary solutions. Short length scales can mimic noise; large noise can mask short-scale signal; variance and range can be inseparable under infill. Reporting a single optimizer without likelihood diagnostics or prior sensitivity can conceal these features. Full Bayesian integration addresses some uncertainty and leaves structural nonidentifiability intact.

Posterior credible intervals are not automatically frequentist confidence intervals. Pointwise coverage, simultaneous coverage, and coverage after empirical-Bayes tuning are separate properties. Bias can dominate posterior spread when the prior smoothness or scaling is mismatched. Calibration should be evaluated in the inferential regime relevant to the application rather than inferred from the Gaussian form alone.

Finally, exact GP regression scales cubically in sample size, and non-Gaussian likelihoods remove conjugacy. Approximation introduces a second modeling layer whose error can affect means, variances, marginal likelihoods, and hyperparameter estimates. A scalable method should be selected by the covariance structure and inferential target, with approximation diagnostics tied to quantities that matter for the analysis.

### References

- Adler, R. J., and Taylor, J. E. (2007). *Random Fields and Geometry*. Springer. [DOI](https://doi.org/10.1007/978-0-387-48116-6).
- Aronszajn, N. (1950). “Theory of Reproducing Kernels.” *Transactions of the American Mathematical Society* 68(3), 337–404. [DOI](https://doi.org/10.1090/S0002-9947-1950-0051437-7).
- Kimeldorf, G. S., and Wahba, G. (1970). “A Correspondence Between Bayesian Estimation on Stochastic Processes and Smoothing by Splines.” *Annals of Mathematical Statistics* 41(2), 495–502. [DOI](https://doi.org/10.1214/aoms/1177697089).
- Kolmogorov, A. N. (1950). *Foundations of the Theory of Probability*, second English edition. Chelsea. The original German edition appeared in 1933.
- Krige, D. G. (1951). “A Statistical Approach to Some Basic Mine Valuation Problems on the Witwatersrand.” *Journal of the Chemical, Metallurgical and Mining Society of South Africa* 52, 119–139. [Related thesis repository](https://hdl.handle.net/10539/17975).
- Matheron, G. (1963). “Principles of Geostatistics.” *Economic Geology* 58(8), 1246–1266. [DOI](https://doi.org/10.2113/gsecongeo.58.8.1246).
- O’Hagan, A. (1978). “Curve Fitting and Optimal Design for Prediction.” *Journal of the Royal Statistical Society, Series B* 40(1), 1–24. [DOI](https://doi.org/10.1111/j.2517-6161.1978.tb01643.x).
- Rasmussen, C. E., and Williams, C. K. I. (2006). *Gaussian Processes for Machine Learning*. MIT Press. [Open book site](https://gaussianprocess.org/gpml/).
- Sacks, J., Welch, W. J., Mitchell, T. J., and Wynn, H. P. (1989). “Design and Analysis of Computer Experiments.” *Statistical Science* 4(4), 409–423. [DOI](https://doi.org/10.1214/ss/1177012413).
- Stein, M. L. (1999). *Interpolation of Spatial Data: Some Theory for Kriging*. Springer. [DOI](https://doi.org/10.1007/978-1-4612-1494-6).
- Titsias, M. K. (2009). “Variational Learning of Inducing Variables in Sparse Gaussian Processes.” *Proceedings of Machine Learning Research* 5, 567–574. [Article](https://proceedings.mlr.press/v5/titsias09a.html).
- van der Vaart, A. W., and van Zanten, J. H. (2008). “Rates of Contraction of Posterior Distributions Based on Gaussian Process Priors.” *Annals of Statistics* 36(3), 1435–1463. [DOI](https://doi.org/10.1214/009053607000000613).
- Wahba, G. (1990). *Spline Models for Observational Data*. SIAM. [DOI](https://doi.org/10.1137/1.9781611970128).
- Wiener, N. (1923). “Differential-Space.” *Journal of Mathematics and Physics* 2, 131–174. [DOI](https://doi.org/10.1002/sapm192321131).
- Zhang, H. (2004). “Inconsistent Estimation and Asymptotically Equal Interpolations in Model-Based Geostatistics.” *Journal of the American Statistical Association* 99(465), 250–261. [DOI](https://doi.org/10.1198/016214504000000241).

## Intuitive synthesis

A Gaussian process begins with a finite-data problem and resolves it through an infinite-dimensional probability model. The unknown object is a function $f$, while the observations reveal only finitely many linear or nonlinear aspects of it. The process specification supplies a coherent joint law for every finite collection of function values. Positive semidefiniteness of the kernel is the condition that makes all those local Gaussian laws compatible.

The kernel carries the structure. As a covariance function, it states how information moves from observed inputs to unobserved inputs. As a spectral object, it determines how much variation occurs at each frequency and thereby controls roughness and mean-square differentiability. Through the canonical metric, it controls increment sizes and supports continuity arguments. As an RKHS kernel, it creates a deterministic geometry in which function evaluation is continuous and rough directions have large norm. These views describe the same mathematical object from probabilistic, harmonic, and geometric perspectives.

Gaussian conditioning is the central mechanism. The joint vector of targets and observations can be decomposed into a covariance-weighted projection on the observations plus an independent Gaussian residual. This construction directly yields

$$
\begin{aligned}
m_n(x)
&=m(x)+k_X(x)^\top(K_X+\Sigma)^{-1}(y-m_X),\\
k_n(x,x')
&=k(x,x')-k_X(x)^\top(K_X+\Sigma)^{-1}k_X(x').
\end{aligned}
$$

The first equation propagates observed residuals through prior covariance. The second removes the covariance component explained by the design. Their derivation also proves positivity of the posterior covariance and explains sequential variance reduction. Under Gaussianity, the mean is the exact conditional expectation. Under second-moment assumptions, the same expression is the best linear predictor.

The RKHS connection clarifies why this probabilistic update reproduces familiar smoothers. With Gaussian noise and prior covariance $\tau^2k$, the posterior mean uniquely minimizes

$$
\frac{1}{2\sigma^2}\sum_{i=1}^n\{y_i-g(x_i)\}^2
+
\frac{1}{2\tau^2}\|g\|_{\mathcal H_k}^2.
$$

The representer argument shows that the minimizer lies in the span of kernel sections at the data. Eigenvalue decomposition then reveals direction-specific shrinkage. Statistical rates arise from balancing approximation bias against stochastic variation across the effective number of kernel eigen-directions. Bayesian contraction expresses the same tension through RKHS approximation energy and Gaussian small-ball probability.

The Gaussian process and its RKHS should remain conceptually separate. The RKHS contains controlled deterministic shifts and posterior means. An infinite-rank Gaussian process almost surely generates paths outside that space. The kernel can therefore support broad random variation while the estimator remains in a much smaller, highly regular representer space.

Applications differ mainly in interpretation and observation structure. Spatial kriging treats covariance as a model for geographic dependence and derives best linear prediction. Spline smoothing interprets derivative penalties through integrated Gaussian processes and separates a polynomial null space. Computer experiments use a process prior to quantify uncertainty about an expensive deterministic surface and select new runs through posterior variance reduction. All three rely on the same covariance projection.

The main qualifications follow from the same architecture. Posterior uncertainty is conditional on the kernel, mean, likelihood, hyperparameters, and numerical approximation. Fixed-domain sampling may identify only combinations of covariance parameters. Smoothness misspecification can distort both rates and interval coverage. Gaussian latent structure excludes many tail and regime behaviors. Large data sets force approximations that preserve only selected aspects of the exact covariance.

The durable mental model is therefore compact. A Gaussian process is a consistent family of Gaussian finite-dimensional distributions indexed by inputs. A valid kernel creates that family and determines its geometry. Conditioning projects the prior process onto observed information and leaves an independent residual. Statistical learning chooses or averages over the kernel parameters. Applications differ in what the function represents, while the mathematical engine remains covariance, projection, and Gaussian closure.
