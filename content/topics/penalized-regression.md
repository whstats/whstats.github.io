---
title: "Penalized Regression"
description: A unified treatment of ridge regression, the lasso, regularized M-estimation, dual-norm control, restricted curvature, and structured high-dimensional error rates.
tags:
  - statistics
  - penalized-regression
  - high-dimensional-statistics
  - regularization
lang: en
---

## Roadmap

Penalized regression begins with a simple instability: least squares attempts to invert the empirical Gram matrix \(X^\top X/n\), and this inversion amplifies random error along directions with small eigenvalues. A penalty modifies the inverse problem by assigning different costs to different parameter configurations. The resulting estimator balances empirical fit against structural complexity.

The main line of reasoning will be

$$
\boxed{
\text{ill-conditioned estimation}
\;\longrightarrow\;
\text{penalty geometry}
\;\longrightarrow\;
\text{stochastic score}
\;\longrightarrow\;
\text{dual-norm control}
\;\longrightarrow\;
\text{restricted curvature}
\;\longrightarrow\;
\text{error rate}.
}
$$

We first formulate a fixed-design linear model and identify the probability statement that an estimator should satisfy. Ridge regression will then show, by exact spectral calculations, how penalization trades variance for bias. The lasso will show how nonsmooth penalty geometry creates exact zeros. A complete nonasymptotic lasso derivation will isolate the two essential ingredients: control of the random score and invertibility of the loss over a restricted error set. These ingredients will subsequently be abstracted into the theory of regularized \(M\)-estimators using dual norms, decomposability, and restricted strong convexity. The final sections map the framework to dense correlated regression, sparse high-dimensional regression, and group-sparse logistic regression, followed by computation, tuning, counterexamples, and a transferable analysis template.

Throughout, the primary normalization is

$$
\mathcal L_n(\beta)
=
\frac{1}{2n}\|Y-X\beta\|_2^2.
$$

Consequently, all penalty levels \(\lambda\) below correspond to an empirical-average loss. A source using \(\|Y-X\beta\|_2^2/2\) will have a penalty parameter larger by a factor of \(n\).

---

## What statistical problem forces us to penalize regression?

### The seed model

Consider the fixed-design linear model

$$
Y=X\beta^*+\varepsilon,
$$

where \(Y\in\mathbb R^n\) is observed, \(X\in\mathbb R^{n\times p}\) is known, \(\beta^*\in\mathbb R^p\) is the unknown regression vector, and \(\varepsilon\in\mathbb R^n\) is random noise. Initially, suppose

$$
\mathbb E(\varepsilon\mid X)=0,
\qquad
\operatorname{Cov}(\varepsilon\mid X)=\sigma^2I_n.
$$

Treating \(X\) as fixed isolates the role of response noise. Random-design results can often be obtained later by proving that the required properties of \(X\) hold with high probability.

Write

$$
\|v\|_n=\frac{\|v\|_2}{\sqrt n}.
$$

Three different statistical targets arise:

$$
\|X(\widehat\beta-\beta^*)\|_n,
\qquad
\|\widehat\beta-\beta^*\|_2,
\qquad
\operatorname{supp}(\widehat\beta).
$$

The first is the in-sample prediction norm. It measures error after applying the forward operator \(X\). The second is parameter error and requires enough information to distinguish coefficient vectors that produce similar fitted values. The third is support recovery, meaning identification of exactly which coordinates of \(\beta^*\) are nonzero. These goals require different assumptions.

A useful nonasymptotic formulation is

$$
\mathbb P\left(
\|X(\widehat\beta-\beta^*)\|_n\le r_{\mathrm{pred}},
\;
\|\widehat\beta-\beta^*\|_2\le r_{\mathrm{par}}
\;\middle|\;X
\right)
\ge 1-\delta.
$$

The radii \(r_{\mathrm{pred}}\) and \(r_{\mathrm{par}}\) should display their dependence on \(n\), \(p\), the noise scale, the structural complexity of \(\beta^*\), and the geometry of \(X\). The confidence parameter \(\delta\) makes the probability guarantee explicit.

### Why classical least-squares summaries are insufficient

If \(p<n\) and \(X^\top X\) is invertible, ordinary least squares is

$$
\widehat\beta^{\mathrm{OLS}}
=
(X^\top X)^{-1}X^\top Y,
$$

and hence

$$
\widehat\beta^{\mathrm{OLS}}-\beta^*
=
(X^\top X)^{-1}X^\top\varepsilon.
$$

Conditional unbiasedness,

$$
\mathbb E(\widehat\beta^{\mathrm{OLS}}\mid X)=\beta^*,
$$

does not imply accurate estimation in any realized sample. The covariance is

$$
\operatorname{Cov}(\widehat\beta^{\mathrm{OLS}}\mid X)
=
\sigma^2(X^\top X)^{-1},
$$

so instability is controlled by the small eigenvalues of \(X^\top X\).

Let

$$
\frac{X^\top X}{n}
=
V\operatorname{diag}(\rho_1,\ldots,\rho_p)V^\top,
\qquad
\rho_1\ge\cdots\ge\rho_p>0.
$$

In the direction \(v_k\), the conditional variance of the OLS coefficient is

$$
\operatorname{Var}\left(
v_k^\top\widehat\beta^{\mathrm{OLS}}\mid X
\right)
=
\frac{\sigma^2}{n\rho_k}.
$$

Thus a small \(\rho_k\) amplifies noise by \(1/\rho_k\). A variance formula reveals this mechanism, though it gives no simultaneous high-probability bound when \(p\) grows. Coordinatewise asymptotic normality has the same limitation: controlling one fixed coordinate does not control the largest error among \(p\) coordinates.

The deficiencies become structural when \(p\ge n\). Since \(\operatorname{rank}(X)\le n\), the Gram matrix is singular. If \(h\in\ker(X)\), then

$$
X(\beta^*+h)=X\beta^*.
$$

The distributions generated by \(\beta^*\) and \(\beta^*+h\) are identical. Full coefficient recovery is therefore impossible without an additional structural restriction. This is an identifiability statement, independent of computational power.

Several further weaknesses of low-dimensional summaries become important in penalized problems:

1. A penalty introduces bias, so unbiasedness ceases to be a useful organizing principle.
2. Model selection is discontinuous; small perturbations can change the selected support.
3. When \(p=p_n\) grows, fixed-\(p\) asymptotics need not be uniform over coordinates or parameter classes.
4. Expected risk can conceal rare but severe instabilities.
5. The relevant error set is often a structured subset of \(\mathbb R^p\), rather than the whole parameter space.

The mathematical idea of stabilizing an ill-posed inverse problem by adding a regularization term appeared in Tikhonov’s work in the early 1960s. Hoerl and Kennard developed ridge regression as a statistical method for nonorthogonal regression in 1970. The broader shrinkage principle was also supported by James–Stein theory, which showed that deliberate bias can reduce total squared-error risk in multivariate normal mean estimation. ([Math-Net][1])

### The first abstraction: estimation error

For any estimator \(\widehat\theta\) of a parameter \(\theta^*\), define

$$
\Delta=\widehat\theta-\theta^*.
$$

This elementary abstraction separates the proof from the estimator’s explicit form. The analysis becomes a question about where \(\Delta\) can lie and how large it can be.

In least squares, the loss difference admits the exact expansion

$$
\mathcal L_n(\beta^*+\Delta)-\mathcal L_n(\beta^*)
=
-\left\langle \frac{X^\top\varepsilon}{n},\Delta\right\rangle
+
\frac12\|X\Delta\|_n^2.
$$

The first term is random and linear in \(\Delta\); the second is deterministic conditional on \(X\) and quadratic in \(\Delta\). This decomposition already contains the core proof mechanism of penalized regression.

Define the score at the true parameter by

$$
Z
=
-\nabla\mathcal L_n(\beta^*)
=
\frac{X^\top\varepsilon}{n}.
$$

For an \(\ell_1\)-penalized estimator, the random linear term is bounded by

$$
|\langle Z,\Delta\rangle|
\le
\|Z\|_\infty\|\Delta\|_1,
$$

where

$$
\|Z\|_\infty=\max_{j\le p}|Z_j|.
$$

The need to control a single coordinate has now become the need to control a maximum over \(p\) coordinates. This transition generates the \(\log p\) factor that appears throughout sparse high-dimensional regression.

For a general penalty norm \(\mathcal R\), the corresponding random quantity is

$$
\mathcal R^*(Z)
=
\sup_{\mathcal R(u)\le 1}
|\langle Z,u\rangle|,
$$

where \(\mathcal R^*\) is the dual norm. For an infinite-dimensional parameter or function class, this becomes a stochastic-process supremum,

$$
\sup_{t\in T}|Z_t|.
$$

The sequence

$$
\widehat\theta-\theta^*,
\qquad
\max_{j\le p}|Z_j|,
\qquad
\sup_{t\in T}|Z_t|
$$

is therefore a natural progression. Each abstraction is forced by the previous problem: one error vector leads to simultaneous coordinate control, and a finite coordinate collection leads to a general indexed process.

---

## What exactly does a penalty change?

### Penalized \(M\)-estimation

A penalized estimator has the form

$$
\widehat\theta_\lambda
\in
\arg\min_{\theta\in\Theta}
\left\{
\mathcal L_n(\theta)+\lambda\mathcal R(\theta)
\right\}.
$$

Here:

* \(\mathcal L_n\) is the empirical loss, such as least squares or negative log-likelihood;
* \(\mathcal R\) is the regularizer, a function assigning greater cost to parameter configurations viewed as more complex;
* \(\lambda\ge0\) is the regularization parameter;
* \(\Theta\) is the parameter space.

The term **shrinkage** refers to movement of the estimator toward low-penalty regions. The term **selection** refers to exact structural simplification, such as zero coordinates or zero groups. A smooth quadratic penalty usually shrinks without producing exact zeros. A nonsmooth penalty can produce zeros through its subgradient geometry.

The regularizer has at least three interpretations.

First, it stabilizes an inverse problem. Second, it encodes structural information, such as small Euclidean norm, coordinate sparsity, group sparsity, smoothness, or low rank. Third, it controls the size of the random linear term through its dual norm.

### Penalized and constrained formulations

Consider the constrained problem

$$
\widetilde\theta_t
\in
\arg\min_{\theta\in\Theta}
\mathcal L_n(\theta)
\quad\text{subject to}\quad
\mathcal R(\theta)\le t.
$$

If \(\widehat\theta_\lambda\) solves the penalized problem, then it also solves the constrained problem with

$$
t=\mathcal R(\widehat\theta_\lambda).
$$

This statement is exact. If a feasible point had lower loss and no larger regularizer, it would have a lower penalized objective.

Conversely, under convexity and a suitable constraint qualification, a constrained solution admits a Lagrange multiplier \(\lambda\ge0\) and solves a penalized problem. The correspondence between \(t\) and \(\lambda\) can be set-valued. Flat portions of the solution path, inactive constraints, or nonunique minimizers prevent a one-to-one parameterization.

Thus

$$
\min_\theta \mathcal L_n(\theta)+\lambda\mathcal R(\theta)
$$

and

$$
\min_{\mathcal R(\theta)\le t}\mathcal L_n(\theta)
$$

describe closely related optimization problems, though their tuning parameters are not universally interchangeable by a simple formula.

### KKT conditions and the statistical meaning of the score

For an unconstrained convex problem, the Karush–Kuhn–Tucker condition is

$$
0
\in
\nabla\mathcal L_n(\widehat\theta_\lambda)
+
\lambda\,\partial\mathcal R(\widehat\theta_\lambda),
$$

where \(\partial\mathcal R\) denotes the subdifferential. This condition describes the balance between empirical fit and penalty geometry.

To analyze the estimator around \(\theta^*\), write

$$
\mathcal L_n(\theta^*+\Delta)
-
\mathcal L_n(\theta^*)
=
\langle\nabla\mathcal L_n(\theta^*),\Delta\rangle
+
D_{\mathcal L_n}(\theta^*+\Delta,\theta^*),
$$

where

$$
D_{\mathcal L_n}(\theta^*+\Delta,\theta^*)
=
\mathcal L_n(\theta^*+\Delta)
-
\mathcal L_n(\theta^*)
-
\langle\nabla\mathcal L_n(\theta^*),\Delta\rangle
$$

is the Bregman remainder. For a differentiable convex loss, this remainder is nonnegative. For least squares,

$$
D_{\mathcal L_n}(\beta^*+\Delta,\beta^*)
=
\frac12\|X\Delta\|_n^2.
$$

The empirical score \(\nabla\mathcal L_n(\theta^*)\) is the first-order random perturbation. Duality gives

$$
\left|
\langle\nabla\mathcal L_n(\theta^*),\Delta\rangle
\right|
\le
\mathcal R^*\!\left(\nabla\mathcal L_n(\theta^*)\right)
\mathcal R(\Delta).
$$

This inequality explains the theoretical tuning rule:

$$
\lambda
\gtrsim
\mathcal R^*\!\left(\nabla\mathcal L_n(\theta^*)\right).
$$

The penalty must be strong enough to dominate random first-order fluctuations. Excessively large \(\lambda\) increases shrinkage bias; excessively small \(\lambda\) allows noise to imitate signal.

### Conventions for constants and tail parameters

We will use

$$
a\lesssim b
$$

to mean that \(a\le Cb\) for a constant \(C\) independent of the main asymptotic quantities \(n,p,s\). The constant can depend on fixed distributional parameters, such as a bounded sub-Gaussian norm, or on a fixed curvature lower bound. This notation never asserts exact equality.

Similarly,

$$
a\asymp b
$$

means \(a\lesssim b\) and \(b\lesssim a\).

A centered random variable \(W\) is called \(\sigma\)-sub-Gaussian under the moment-generating-function convention if

$$
\mathbb E e^{tW}
\le
\exp\left(\frac{\sigma^2t^2}{2}\right)
\qquad
\text{for every }t\in\mathbb R.
$$

The parameter \(\sigma\) is a variance proxy. It need not equal the standard deviation, although \(\operatorname{Var}(W)\le\sigma^2\). Definitions based on the Orlicz norm \(\|W\|_{\psi_2}\) are equivalent up to absolute constants, not by exact equality.

### A limited Bayesian correspondence

Under Gaussian noise,

$$
Y\mid\beta\sim N(X\beta,\sigma^2I_n),
$$

and a Gaussian prior

$$
\beta\sim N(0,\tau^2I_p)
$$

produces a posterior mode, and also a posterior mean, equal to the ridge estimator with

$$
\lambda=\frac{\sigma^2}{n\tau^2}
$$

under our loss normalization.

A product Laplace prior,

$$
\pi(\beta)
\propto
\exp\left(-\frac{\|\beta\|_1}{b}\right),
$$

produces the lasso as a posterior mode with

$$
\lambda=\frac{\sigma^2}{nb}.
$$

The posterior mean under a continuous Laplace prior generally differs from the lasso and does not produce exact zeros. Consequently, “penalty equals negative log-prior” is a statement about the posterior mode under a particular likelihood and scaling. Frequentist oracle inequalities rely on score concentration and design geometry instead.

---

## How does ridge regression stabilize least squares?

### Exact solution

Ridge regression solves

$$
\widehat\beta_\lambda^{\mathrm{ridge}}
=
\arg\min_{\beta\in\mathbb R^p}
\left\{
\frac{1}{2n}\|Y-X\beta\|_2^2
+
\frac{\lambda}{2}\|\beta\|_2^2
\right\},
\qquad
\lambda>0.
$$

Differentiating gives

$$
-\frac{X^\top(Y-X\beta)}{n}+\lambda\beta=0.
$$

Therefore,

$$
\widehat\beta_\lambda^{\mathrm{ridge}}
=
\left(\frac{X^\top X}{n}+\lambda I_p\right)^{-1}
\frac{X^\top Y}{n}
=
(X^\top X+n\lambda I_p)^{-1}X^\top Y.
$$

The matrix \(X^\top X/n+\lambda I_p\) is positive definite for every \(\lambda>0\), so the ridge coefficient vector is unique even when \(p>n\).

### Spectral filtering

Let the rank-\(r\) singular value decomposition be

$$
X
=
U\operatorname{diag}(\sqrt{n\rho_1},\ldots,\sqrt{n\rho_r})V^\top,
$$

where \(\rho_k>0\) are the nonzero eigenvalues of \(X^\top X/n\). Extend \(V\) to an orthogonal basis of \(\mathbb R^p\), and write

$$
\beta^*=\sum_{k=1}^p b_kv_k.
$$

For \(k\le r\),

$$
v_k^\top\widehat\beta_\lambda^{\mathrm{ridge}}
=
\frac{\rho_k}{\rho_k+\lambda}b_k
+
\frac{\sqrt{\rho_k/n}}{\rho_k+\lambda}\,u_k^\top\varepsilon.
$$

The factor

$$
s_k(\lambda)
=
\frac{\rho_k}{\rho_k+\lambda}
$$

is the spectral shrinkage factor. If \(\rho_k\gg\lambda\), then \(s_k(\lambda)\approx1\), so the direction is mostly retained. If \(\rho_k\ll\lambda\), then \(s_k(\lambda)\approx\rho_k/\lambda\), so the unstable direction is strongly attenuated.

Ridge is therefore a spectral filter. It replaces inversion by the regularized inverse

$$
\frac{1}{\rho_k}
\quad\longmapsto\quad
\frac{1}{\rho_k+\lambda}.
$$

### Exact bias–variance decomposition

Assume for this calculation that

$$
\varepsilon\sim N(0,\sigma^2I_n).
$$

For \(k\le r\),

$$
\mathbb E_\varepsilon
\left[
\left(
v_k^\top\widehat\beta_\lambda^{\mathrm{ridge}}
-b_k
\right)^2
\middle|X
\right]
=
\frac{\lambda^2b_k^2}{(\rho_k+\lambda)^2}
+
\frac{\sigma^2\rho_k}{n(\rho_k+\lambda)^2}.
$$

The first term is squared shrinkage bias. The second is variance.

Summing over all coefficient directions yields

$$
\mathbb E_\varepsilon
\left[
\|\widehat\beta_\lambda^{\mathrm{ridge}}-\beta^*\|_2^2
\middle|X
\right]
=
\sum_{k=1}^r
\frac{\lambda^2b_k^2}{(\rho_k+\lambda)^2}
+
\frac{\sigma^2}{n}
\sum_{k=1}^r
\frac{\rho_k}{(\rho_k+\lambda)^2}
+
\sum_{k=r+1}^p b_k^2.
$$

The final term is the squared component of \(\beta^*\) in \(\ker(X)\). No estimator based only on \(Y\) and \(X\) can recover this component without additional assumptions.

For prediction,

$$
\|X(\widehat\beta-\beta^*)\|_n^2
=
\sum_{k=1}^r
\rho_k
\left(
v_k^\top(\widehat\beta-\beta^*)
\right)^2.
$$

Hence

$$
\mathbb E_\varepsilon
\left[
\|X(\widehat\beta_\lambda^{\mathrm{ridge}}-\beta^*)\|_n^2
\middle|X
\right]
=
\sum_{k=1}^r
\frac{\lambda^2\rho_kb_k^2}{(\rho_k+\lambda)^2}
+
\frac{\sigma^2}{n}
\sum_{k=1}^r
\left(
\frac{\rho_k}{\rho_k+\lambda}
\right)^2.
$$

This formula gives the statistical reason ridge works. OLS has coefficient variance \(\sigma^2/(n\rho_k)\), which diverges as \(\rho_k\downarrow0\). Ridge replaces it by

$$
\frac{\sigma^2\rho_k}{n(\rho_k+\lambda)^2}.
$$

Since

$$
\sup_{\rho\ge0}
\frac{\rho}{(\rho+\lambda)^2}
=
\frac{1}{4\lambda},
$$

ridge caps the variance contribution of every spectral direction. The price is the bias term \(\lambda^2b_k^2/(\rho_k+\lambda)^2\).

### Effective dimension

The fitted value is linear in \(Y\):

$$
\widehat Y_\lambda
=
H_\lambda Y,
$$

where

$$
H_\lambda
=
X(X^\top X+n\lambda I_p)^{-1}X^\top.
$$

The trace

$$
d_{\mathrm{eff}}(\lambda)
=
\operatorname{tr}(H_\lambda)
=
\sum_{k=1}^r
\frac{\rho_k}{\rho_k+\lambda}
$$

is commonly called the effective degrees of freedom or effective dimension of the ridge fit. It interpolates between \(r\) as \(\lambda\downarrow0\) and \(0\) as \(\lambda\uparrow\infty\).

The variance term in prediction involves

$$
v_{\mathrm{eff}}(\lambda)
=
\sum_{k=1}^r
\left(
\frac{\rho_k}{\rho_k+\lambda}
\right)^2.
$$

Some sources use “effective dimension” for \(d_{\mathrm{eff}}\), while others use closely related spectral quantities such as \(v_{\mathrm{eff}}\). These quantities are comparable in many regimes but are not identical.

Ridge was introduced in statistics by Hoerl and Kennard to stabilize nonorthogonal regression. The same quadratic regularization mechanism belongs to the broader theory of Tikhonov regularization for ill-posed inverse problems. ([JSTOR][2])

### What ridge cannot identify

Ridge produces a unique numerical answer when \(p>n\), yet uniqueness of the optimizer does not create identifiability. If \(h\in\ker(X)\), the data cannot distinguish \(\beta^*\) from \(\beta^*+h\). The ridge penalty selects a small-\(\ell_2\)-norm representative among observationally equivalent vectors.

As \(\lambda\downarrow0\), ridge converges to the minimum-Euclidean-norm least-squares solution. This limit is determined by the penalty geometry. It need not converge to a particular data-generating coefficient vector when that vector contains an unidentified null-space component.

---

## Why does the lasso produce exact zeros?

### The lasso objective

The lasso, short for **least absolute shrinkage and selection operator**, solves

$$
\widehat\beta_\lambda
\in
\arg\min_{\beta\in\mathbb R^p}
\left\{
\frac{1}{2n}\|Y-X\beta\|_2^2
+
\lambda\|\beta\|_1
\right\}.
$$

The \(\ell_1\) norm is

$$
\|\beta\|_1=\sum_{j=1}^p|\beta_j|.
$$

Its unit ball has corners aligned with coordinate subspaces. Those corners create exact zero coefficients when a smooth loss contour contacts the constraint boundary. Tibshirani’s original lasso paper emphasized the combination of continuous shrinkage and interpretable sparse models. ([Royal Statistical Society][3])

### Orthogonal design and soft thresholding

Assume

$$
\frac{X^\top X}{n}=I_p.
$$

Define

$$
z=\frac{X^\top Y}{n}.
$$

Expanding the squared loss gives

$$
\frac{1}{2n}\|Y-X\beta\|_2^2
=
C(Y)
+
\frac12\|\beta-z\|_2^2,
$$

where \(C(Y)\) does not depend on \(\beta\). The lasso problem separates coordinatewise:

$$
\widehat\beta_j
=
\arg\min_{b\in\mathbb R}
\left\{
\frac12(b-z_j)^2+\lambda|b|
\right\}.
$$

The subgradient condition is

$$
0\in b-z_j+\lambda\,\partial|b|.
$$

There are three cases.

If \(b>0\), then \(\partial|b|=\{1\}\), so \(b=z_j-\lambda\), which is valid when \(z_j>\lambda\).

If \(b<0\), then \(\partial|b|=\{-1\}\), so \(b=z_j+\lambda\), which is valid when \(z_j<-\lambda\).

If \(b=0\), then \(\partial|b|=[-1,1]\), and the condition holds precisely when \(|z_j|\le\lambda\).

Consequently,

$$
\widehat\beta_j
=
\mathsf{ST}_\lambda(z_j)
=
\operatorname{sign}(z_j)(|z_j|-\lambda)_+.
$$

This is the soft-thresholding operator. Values inside \([-\lambda,\lambda]\) are sent exactly to zero. Values outside this interval are moved toward zero by \(\lambda\).

For comparison, under the same orthogonal design:

$$
\widehat\beta_j^{\mathrm{ridge}}
=
\frac{z_j}{1+\lambda},
$$

which is continuous and generally nonzero, while an \(\ell_0\)-penalized estimator solves

$$
\min_b\left\{\frac12(b-z_j)^2+\lambda_0\,1\{b\ne0\}\right\}
$$

and yields hard thresholding,

$$
\widehat\beta_j^{\ell_0}
=
z_j\,1\{|z_j|>\sqrt{2\lambda_0}\}.
$$

Soft thresholding is continuous but biased for large coefficients. Hard thresholding leaves selected coefficients unchanged but is discontinuous at the threshold.

### Why \(\log p\) appears

Under the linear model,

$$
z_j
=
\beta_j^*
+
\frac{X_j^\top\varepsilon}{n}.
$$

Let

$$
\xi_j=\frac{X_j^\top\varepsilon}{n}.
$$

If \(\varepsilon\sim N(0,\sigma^2I_n)\) and \(X^\top X/n=I_p\), then

$$
\xi_j\sim N\left(0,\frac{\sigma^2}{n}\right).
$$

For any \(t>0\),

$$
\mathbb P(|\xi_j|>t)
\le
2\exp\left(-\frac{nt^2}{2\sigma^2}\right).
$$

A union bound gives

$$
\mathbb P\left(
\max_{j\le p}|\xi_j|>t
\right)
\le
2p\exp\left(-\frac{nt^2}{2\sigma^2}\right).
$$

Setting

$$
t
=
\sigma
\sqrt{
\frac{2\log(2p/\delta)}{n}
}
$$

yields

$$
\mathbb P\left(
\max_{j\le p}|\xi_j|
\le
\sigma
\sqrt{
\frac{2\log(2p/\delta)}{n}
}
\right)
\ge
1-\delta.
$$

The \(\sqrt{\log p}\) factor is the price of simultaneous control over \(p\) possible noise correlations. Independence among the \(\xi_j\) is unnecessary for this union-bound argument. Only the marginal tail bounds are used.

On the event \(\max_j|\xi_j|\le\lambda\), every truly null coefficient satisfies

$$
\beta_j^*=0
\quad\Longrightarrow\quad
\widehat\beta_j=0.
$$

For an active coordinate, if

$$
|\beta_j^*|>2\lambda,
$$

then \(\widehat\beta_j\) has the correct sign and

$$
|\widehat\beta_j-\beta_j^*|\le2\lambda.
$$

This orthogonal calculation displays three distinct requirements:

* noise control determines the threshold scale;
* a minimum-signal condition determines whether active coordinates survive thresholding;
* the lasso introduces shrinkage bias of order \(\lambda\).

Correlated designs preserve this general structure, though soft thresholding is no longer coordinatewise and support recovery requires additional design assumptions.

---

## How is a high-probability lasso bound actually derived?

This section gives a complete representative derivation. The argument has four steps:

$$
\text{MGF bound}
\;\to\;
\text{basic inequality}
\;\to\;
\text{cone condition}
\;\to\;
\text{restricted invertibility}.
$$

### Assumptions

Assume:

1. The model is

   $$
   Y=X\beta^*+\varepsilon.
   $$

2. Conditional on \(X\), the variables \(\varepsilon_1,\ldots,\varepsilon_n\) are independent, centered, and satisfy

   $$
   \mathbb E\left[
   e^{t\varepsilon_i}\mid X
   \right]
   \le
   e^{\sigma^2t^2/2}
   \qquad
   \text{for all }t\in\mathbb R.
   $$

3. The columns are normalized:

   $$
   \frac{\|X_j\|_2^2}{n}\le1,
   \qquad j=1,\ldots,p.
   $$

4. The true support is

   $$
   S=\operatorname{supp}(\beta^*),
   \qquad |S|=s.
   $$

5. The compatibility constant

   $$
   \phi^2(S,3)
   =
   \inf_{\substack{\Delta\ne0\\
   \|\Delta_{S^c}\|_1\le3\|\Delta_S\|_1}}
   \frac{s\|X\Delta\|_n^2}{\|\Delta_S\|_1^2}
   $$

   is strictly positive.

The compatibility condition states that an error vector concentrated mainly on \(S\) cannot have a large active-set \(\ell_1\) norm while producing an arbitrarily small fitted perturbation \(X\Delta\). It is weaker than requiring \(X^\top X/n\) to be positive definite on all of \(\mathbb R^p\), which is impossible when \(p>n\).

Define

$$
\widehat\beta
\in
\arg\min_{\beta\in\mathbb R^p}
\left\{
\frac{1}{2n}\|Y-X\beta\|_2^2
+
\lambda\|\beta\|_1
\right\}.
$$

### A theorem with explicit constants

For \(\delta\in(0,1)\), choose

$$
\lambda
=
2\sigma
\sqrt{
\frac{2\log(2p/\delta)}{n}
}.
$$

Then, with conditional probability at least \(1-\delta\),

$$
\boxed{
\|X(\widehat\beta-\beta^*)\|_n^2
\le
\frac{9s\lambda^2}{\phi^2(S,3)}
}
$$

and

$$
\boxed{
\|\widehat\beta-\beta^*\|_1
\le
\frac{12s\lambda}{\phi^2(S,3)}.
}
$$

Substituting the displayed value of \(\lambda\), the prediction bound becomes

$$
\|X(\widehat\beta-\beta^*)\|_n^2
\le
\frac{
72\sigma^2s\log(2p/\delta)
}{
n\phi^2(S,3)
}.
$$

The rate has four interpretable factors:

$$
\frac{\sigma^2}{n}
\times
s
\times
\log p
\times
\frac{1}{\phi^2}.
$$

They correspond respectively to noise averaging, sparsity, simultaneous search over coordinates, and design ill-conditioning on the relevant cone.

Oracle inequalities of this general form are central to the nonasymptotic lasso literature. Bickel, Ritov, and Tsybakov developed parallel prediction and parameter bounds for the lasso and Dantzig selector under restricted eigenvalue-type conditions. ([arXiv][4])

### Step 1: control the score by an MGF argument

Let

$$
Z
=
\frac{X^\top\varepsilon}{n},
\qquad
Z_j
=
\frac1n\sum_{i=1}^n x_{ij}\varepsilon_i.
$$

Conditional independence and the sub-Gaussian MGF assumption give

$$
\begin{aligned}
\mathbb E\left[
e^{tZ_j}\mid X
\right]
&=
\prod_{i=1}^n
\mathbb E\left[
\exp\left(
\frac{tx_{ij}\varepsilon_i}{n}
\right)
\middle|X
\right]
\\
&\le
\prod_{i=1}^n
\exp\left(
\frac{\sigma^2t^2x_{ij}^2}{2n^2}
\right)
\\
&=
\exp\left(
\frac{\sigma^2t^2\|X_j\|_2^2}{2n^2}
\right)
\\
&\le
\exp\left(
\frac{\sigma^2t^2}{2n}
\right).
\end{aligned}
$$

Thus \(Z_j\) is conditionally \(\sigma/\sqrt n\)-sub-Gaussian. Chernoff’s method yields

$$
\mathbb P(|Z_j|>u\mid X)
\le
2\exp\left(
-\frac{nu^2}{2\sigma^2}
\right).
$$

Applying the union bound,

$$
\mathbb P(\|Z\|_\infty>u\mid X)
\le
2p\exp\left(
-\frac{nu^2}{2\sigma^2}
\right).
$$

Set

$$
u
=
\sigma
\sqrt{
\frac{2\log(2p/\delta)}{n}
}.
$$

Then

$$
\mathbb P\left(
\left\|
\frac{X^\top\varepsilon}{n}
\right\|_\infty
\le
\frac{\lambda}{2}
\middle|X
\right)
\ge
1-\delta.
$$

Call this event \(\mathcal E_\lambda\). Its statistical meaning is direct: none of the \(p\) predictors has an empirical correlation with pure noise exceeding \(\lambda/2\).

### Step 2: derive the basic inequality

Let

$$
\Delta=\widehat\beta-\beta^*.
$$

Optimality of \(\widehat\beta\) implies

$$
\frac{1}{2n}\|Y-X\widehat\beta\|_2^2
+
\lambda\|\widehat\beta\|_1
\le
\frac{1}{2n}\|Y-X\beta^*\|_2^2
+
\lambda\|\beta^*\|_1.
$$

Since \(Y=X\beta^*+\varepsilon\),

$$
Y-X\widehat\beta
=
\varepsilon-X\Delta.
$$

Expanding the square,

$$
\|\varepsilon-X\Delta\|_2^2
=
\|\varepsilon\|_2^2
-
2\varepsilon^\top X\Delta
+
\|X\Delta\|_2^2.
$$

After cancellation,

$$
\frac12\|X\Delta\|_n^2
\le
\left\langle
\frac{X^\top\varepsilon}{n},\Delta
\right\rangle
+
\lambda
\left(
\|\beta^*\|_1-\|\beta^*+\Delta\|_1
\right).
$$

This is the basic inequality. It converts the optimization statement into an inequality involving estimation error.

On \(\mathcal E_\lambda\), Hölder duality gives

$$
\left\langle
\frac{X^\top\varepsilon}{n},\Delta
\right\rangle
\le
\frac{\lambda}{2}\|\Delta\|_1.
$$

The random term has now been absorbed into the penalty scale.

### Step 3: use decomposability to obtain the cone

Because \(\beta^*_{S^c}=0\),

$$
\begin{aligned}
\|\beta^*\|_1-\|\beta^*+\Delta\|_1
&=
\|\beta_S^*\|_1
-
\|\beta_S^*+\Delta_S\|_1
-
\|\Delta_{S^c}\|_1
\\
&\le
\|\Delta_S\|_1-\|\Delta_{S^c}\|_1.
\end{aligned}
$$

The inequality follows from the reverse triangle inequality,

$$
\|\beta_S^*\|_1-\|\beta_S^*+\Delta_S\|_1
\le
\|\Delta_S\|_1.
$$

Substituting this and

$$
\|\Delta\|_1
=
\|\Delta_S\|_1+\|\Delta_{S^c}\|_1
$$

into the basic inequality gives

$$
\frac12\|X\Delta\|_n^2
+
\frac{\lambda}{2}\|\Delta_{S^c}\|_1
\le
\frac{3\lambda}{2}\|\Delta_S\|_1.
$$

Since the prediction term is nonnegative,

$$
\|\Delta_{S^c}\|_1
\le
3\|\Delta_S\|_1.
$$

Thus \(\Delta\) lies in the cone

$$
\mathcal C(S,3)
=
\left\{
u\in\mathbb R^p:
\|u_{S^c}\|_1\le3\|u_S\|_1
\right\}.
$$

This is a decisive step. The loss need not be invertible over all of \(\mathbb R^p\). It only needs sufficient curvature over the cone in which the estimator’s error is forced to lie.

The cone comes from two ingredients:

1. the penalty is additive across \(S\) and \(S^c\);
2. \(\lambda\) dominates the stochastic score.

### Step 4: convert prediction geometry into a rate

By the definition of the compatibility constant,

$$
\|\Delta_S\|_1
\le
\frac{\sqrt s}{\phi(S,3)}
\|X\Delta\|_n.
$$

Discarding the nonnegative off-support term in the earlier inequality gives

$$
\frac12\|X\Delta\|_n^2
\le
\frac{3\lambda}{2}\|\Delta_S\|_1.
$$

Therefore,

$$
\frac12\|X\Delta\|_n^2
\le
\frac{3\lambda\sqrt s}{2\phi(S,3)}
\|X\Delta\|_n.
$$

If \(\|X\Delta\|_n>0\), cancellation yields

$$
\|X\Delta\|_n
\le
\frac{3\lambda\sqrt s}{\phi(S,3)}.
$$

Squaring proves

$$
\|X\Delta\|_n^2
\le
\frac{9s\lambda^2}{\phi^2(S,3)}.
$$

For the \(\ell_1\) error, the cone condition gives

$$
\|\Delta\|_1
\le
4\|\Delta_S\|_1.
$$

Hence

$$
\|\Delta\|_1
\le
\frac{4\sqrt s}{\phi(S,3)}
\|X\Delta\|_n
\le
\frac{12s\lambda}{\phi^2(S,3)}.
$$

Every constant in the theorem has now been accounted for.

### Restricted eigenvalues and \(\ell_2\) error

Define the restricted eigenvalue

$$
\kappa(S,3)
=
\inf_{\substack{\Delta\ne0\\
\|\Delta_{S^c}\|_1\le3\|\Delta_S\|_1}}
\frac{\|X\Delta\|_n}{\|\Delta\|_2}.
$$

This definition uses the total \(\ell_2\) norm in the denominator. Some sources use \(\|\Delta_S\|_2\), so constants and powers of the reported restricted eigenvalue can differ across references.

If \(\kappa(S,3)>0\), then

$$
\|X\Delta\|_n
\ge
\kappa(S,3)\|\Delta\|_2.
$$

Using \(\|\Delta_S\|_1\le\sqrt s\|\Delta\|_2\), the basic inequality gives

$$
\frac12\|X\Delta\|_n^2
\le
\frac{3\lambda\sqrt s}{2}\|\Delta\|_2
\le
\frac{3\lambda\sqrt s}{2\kappa(S,3)}
\|X\Delta\|_n.
$$

Consequently,

$$
\|X\Delta\|_n
\le
\frac{3\lambda\sqrt s}{\kappa(S,3)}
$$

and

$$
\boxed{
\|\widehat\beta-\beta^*\|_2
\le
\frac{3\lambda\sqrt s}{\kappa^2(S,3)}.
}
$$

The appearance of \(\kappa^2\) follows from the chosen definition. If a source defines the restricted eigenvalue as a squared ratio, its displayed bound will contain one power of that constant.

### Where the two logarithmic complexities arise

The score bound uses a maximum over \(p\) coordinates, producing \(\log p\).

The restricted eigenvalue must often hold uniformly over many approximately sparse directions. Suppose the rows of \(X\) are independent sub-Gaussian vectors. To control all \(s\)-sparse unit vectors, one considers:

* approximately \(\binom ps\) possible supports;
* a finite \(\epsilon\)-net of the unit sphere on each support.

Since

$$
\log\binom ps
\le
s\log\left(\frac{ep}{s}\right),
$$

and an \(\epsilon\)-net in \(s\) dimensions has logarithmic size of order \(s\), the total complexity is

$$
s\log\left(\frac{ep}{s}\right).
$$

Concentration for each fixed vector, followed by a union bound over the net and a continuity argument, yields restricted norm preservation when

$$
n
\gtrsim
s\log\left(\frac{ep}{s}\right),
$$

up to constants depending on the row distribution and population restricted eigenvalues.

Thus two distinct complexity terms enter:

$$
\log p
\quad\text{from score control},
$$

and

$$
s\log(ep/s)
\quad\text{from uniform restricted curvature}.
$$

They arise at different proof stages and should not be conflated.

Under suitable design conditions, sparse linear regression has minimax prediction and parameter rates with the same sparsity–logarithm structure, up to choices such as \(\log p\) versus the refined \(\log(ep/s)\). Raskutti, Wainwright, and Yu established minimax rates over \(\ell_q\)-balls and compared them with computationally tractable \(\ell_1\) procedures. ([arXiv][5])

---

## What is the reusable theory behind the lasso proof?

### General regularized \(M\)-estimation

Consider

$$
\widehat\theta
\in
\arg\min_{\theta\in\Theta}
\left\{
\mathcal L_n(\theta)+\lambda\mathcal R(\theta)
\right\},
$$

where \(\mathcal L_n\) is convex and differentiable and \(\mathcal R\) is a norm.

Let

$$
\Delta=\widehat\theta-\theta^*,
\qquad
g=\nabla\mathcal L_n(\theta^*).
$$

Optimality gives

$$
D_{\mathcal L_n}(\theta^*+\Delta,\theta^*)
\le
-\langle g,\Delta\rangle
+
\lambda
\left[
\mathcal R(\theta^*)
-
\mathcal R(\theta^*+\Delta)
\right].
$$

Duality controls the stochastic term:

$$
-\langle g,\Delta\rangle
\le
\mathcal R^*(g)\mathcal R(\Delta).
$$

This is the general version of

$$
\left\langle\frac{X^\top\varepsilon}{n},\Delta\right\rangle
\le
\left\|\frac{X^\top\varepsilon}{n}\right\|_\infty
\|\Delta\|_1.
$$

### Decomposability

Let \(\mathcal M\subseteq\overline{\mathcal M}\) be linear subspaces. A norm \(\mathcal R\) is decomposable with respect to \((\mathcal M,\overline{\mathcal M}^{\perp})\) if

$$
\mathcal R(u+v)
=
\mathcal R(u)+\mathcal R(v)
$$

for every \(u\in\mathcal M\) and \(v\in\overline{\mathcal M}^{\perp}\).

For coordinate sparsity, take

$$
\mathcal M(S)
=
\{u:u_{S^c}=0\}.
$$

Then \(\ell_1\) decomposability is the identity

$$
\|u_S+v_{S^c}\|_1
=
\|u_S\|_1+\|v_{S^c}\|_1.
$$

For disjoint groups \(G_1,\ldots,G_m\), the group norm

$$
\mathcal R(\beta)
=
\sum_{g=1}^m\|\beta_{G_g}\|_2
$$

is decomposable across active and inactive groups.

For low-rank matrices, the nuclear norm is decomposable relative to suitable row and column tangent spaces. This shows that the same proof architecture extends beyond ordinary regression vectors.

The squared Euclidean penalty \(\|\theta\|_2^2\) is two-homogeneous rather than a norm. The decomposable-norm theorem below therefore describes lasso-type regularizers more directly than ridge. Ridge is better analyzed through strong convexity and spectral filtering, or by treating its quadratic term as additional curvature.

### Subspace compatibility

For a structural subspace \(\overline{\mathcal M}\), define

$$
\Psi(\overline{\mathcal M})
=
\sup_{u\in\overline{\mathcal M}\setminus\{0\}}
\frac{\mathcal R(u)}{\|u\|},
$$

where \(\|\cdot\|\) is the error norm of interest, usually Euclidean or Frobenius.

For the \(\ell_1\) norm on an \(s\)-coordinate subspace,

$$
\Psi(\mathcal M(S))
=
\sqrt s,
$$

because

$$
\|u\|_1\le\sqrt s\,\|u\|_2.
$$

For group lasso with \(s_g\) active groups and an unweighted sum of group \(\ell_2\) norms,

$$
\Psi
=
\sqrt{s_g}.
$$

This factor converts structural complexity into an estimation rate.

### Restricted strong convexity

A loss satisfies restricted strong convexity, abbreviated RSC, if its Bregman remainder obeys

$$
D_{\mathcal L_n}(\theta^*+\Delta,\theta^*)
\ge
\frac{\kappa}{2}\|\Delta\|^2
$$

for all \(\Delta\) in the relevant error cone.

Global strong convexity requires the inequality over the whole parameter space. RSC requires curvature only along errors compatible with the assumed structure. In high dimensions, this distinction is essential.

For least squares,

$$
D_{\mathcal L_n}(\beta^*+\Delta,\beta^*)
=
\frac12\|X\Delta\|_n^2.
$$

Thus least-squares RSC is a restricted eigenvalue condition on \(X\).

For nonlinear likelihoods, RSC is usually local. It may hold only within a neighborhood of \(\theta^*\), and the proof must show that the estimator remains in that neighborhood.

### A master theorem

Assume:

1. \(\mathcal L_n\) is convex and differentiable.
2. \(\mathcal R\) is a decomposable norm with respect to \((\mathcal M,\overline{\mathcal M}^{\perp})\).
3. The target satisfies \(\theta^*\in\mathcal M\).
4. The penalty obeys

   $$
   \lambda
   \ge
   2\mathcal R^*
   \left(
   \nabla\mathcal L_n(\theta^*)
   \right).
   $$
5. RSC with curvature \(\kappa>0\) holds on

   $$
   \mathcal C
   =
   \left\{
   \Delta:
   \mathcal R(\Delta_{\overline{\mathcal M}^{\perp}})
   \le
   3\mathcal R(\Delta_{\overline{\mathcal M}})
   \right\}.
   $$

Then

$$
\boxed{
\|\widehat\theta-\theta^*\|
\le
\frac{
3\lambda\Psi(\overline{\mathcal M})
}{\kappa}.
}
$$

Moreover,

$$
D_{\mathcal L_n}(\widehat\theta,\theta^*)
\le
\frac{
9\lambda^2\Psi^2(\overline{\mathcal M})
}{
2\kappa
},
$$

and

$$
\mathcal R(\widehat\theta-\theta^*)
\le
\frac{
12\lambda\Psi^2(\overline{\mathcal M})
}{\kappa}.
$$

The constants correspond to the stated normalization of RSC and the factor \(2\) in the score-dominating condition.

### Proof of the master theorem

Start from the basic inequality:

$$
D_{\mathcal L_n}(\theta^*+\Delta,\theta^*)
\le
-\langle g,\Delta\rangle
+
\lambda
\left[
\mathcal R(\theta^*)-\mathcal R(\theta^*+\Delta)
\right].
$$

Since \(\lambda\ge2\mathcal R^*(g)\),

$$
-\langle g,\Delta\rangle
\le
\frac{\lambda}{2}\mathcal R(\Delta).
$$

Decompose

$$
\Delta
=
\Delta_{\overline{\mathcal M}}
+
\Delta_{\overline{\mathcal M}^{\perp}}.
$$

By the triangle inequality,

$$
\mathcal R(\Delta)
\le
\mathcal R(\Delta_{\overline{\mathcal M}})
+
\mathcal R(\Delta_{\overline{\mathcal M}^{\perp}}).
$$

Since \(\theta^*\in\mathcal M\subseteq\overline{\mathcal M}\), decomposability and the reverse triangle inequality imply

$$
\mathcal R(\theta^*)
-
\mathcal R(\theta^*+\Delta)
\le
\mathcal R(\Delta_{\overline{\mathcal M}})
-
\mathcal R(\Delta_{\overline{\mathcal M}^{\perp}}).
$$

Consequently,

$$
D_{\mathcal L_n}
+
\frac{\lambda}{2}
\mathcal R(\Delta_{\overline{\mathcal M}^{\perp}})
\le
\frac{3\lambda}{2}
\mathcal R(\Delta_{\overline{\mathcal M}}).
$$

Because \(D_{\mathcal L_n}\ge0\),

$$
\mathcal R(\Delta_{\overline{\mathcal M}^{\perp}})
\le
3\mathcal R(\Delta_{\overline{\mathcal M}}).
$$

Thus \(\Delta\in\mathcal C\), where RSC applies. We then have

$$
\frac{\kappa}{2}\|\Delta\|^2
\le
D_{\mathcal L_n}
\le
\frac{3\lambda}{2}
\mathcal R(\Delta_{\overline{\mathcal M}}).
$$

By subspace compatibility,

$$
\mathcal R(\Delta_{\overline{\mathcal M}})
\le
\Psi(\overline{\mathcal M})
\|\Delta_{\overline{\mathcal M}}\|
\le
\Psi(\overline{\mathcal M})\|\Delta\|.
$$

Therefore,

$$
\frac{\kappa}{2}\|\Delta\|^2
\le
\frac{3\lambda}{2}
\Psi(\overline{\mathcal M})\|\Delta\|.
$$

Cancellation yields

$$
\|\Delta\|
\le
\frac{3\lambda\Psi(\overline{\mathcal M})}{\kappa}.
$$

The bounds on the loss remainder and regularizer error follow by substitution.

Negahban, Ravikumar, Wainwright, and Yu formalized this combination of decomposability and restricted strong convexity as a unified framework for high-dimensional regularized \(M\)-estimators. ([arXiv][6])

### Approximate structure

Exact sparsity assumes \(\theta^*\in\mathcal M\). A more realistic target may be well approximated by \(\mathcal M\) while having a small residual component.

In that case, the cone becomes

$$
\mathcal R(\Delta_{\overline{\mathcal M}^{\perp}})
\le
3\mathcal R(\Delta_{\overline{\mathcal M}})
+
4\mathcal R(\theta^*_{\mathcal M^\perp}).
$$

The final rate takes the schematic form

$$
\|\widehat\theta-\theta^*\|^2
\lesssim
\frac{\lambda^2\Psi^2(\overline{\mathcal M})}{\kappa^2}
+
\frac{\lambda}{\kappa}
\mathcal R(\theta^*_{\mathcal M^\perp}).
$$

The first term is estimation error inside the model. The second is approximation error from the part of the target outside the chosen structural subspace.

For approximately sparse regression, one may choose a set \(S\) containing the largest coefficients. Increasing \(|S|\) enlarges the estimation term \(s\lambda^2\) and decreases the approximation tail \(\|\beta^*_{S^c}\|_1\). The optimal choice balances these terms. This is the origin of oracle inequalities: the estimator performs nearly as well as the best structural approximation chosen with knowledge of \(\beta^*\).

---

## Where does statistical complexity enter?

### Dual-norm complexity

The first complexity is

$$
\mathcal R^*
\left(
\nabla\mathcal L_n(\theta^*)
\right).
$$

Its form is determined by the penalty.

For the lasso,

$$
\mathcal R(\beta)=\|\beta\|_1,
\qquad
\mathcal R^*(z)=\|z\|_\infty,
$$

so the score complexity is a maximum over \(p\) coordinates:

$$
\|z\|_\infty=\max_{j\le p}|z_j|.
$$

For group lasso,

$$
\mathcal R(\beta)
=
\sum_{g=1}^m w_g\|\beta_{G_g}\|_2,
$$

and

$$
\mathcal R^*(z)
=
\max_{g\le m}
\frac{\|z_{G_g}\|_2}{w_g}.
$$

The score now contains Euclidean fluctuation within each group and a maximum across groups.

For a matrix parameter with nuclear-norm penalty,

$$
\mathcal R(\Theta)=\|\Theta\|_*,
\qquad
\mathcal R^*(Z)=\|Z\|_{\mathrm{op}}.
$$

The stochastic complexity becomes the operator norm of a random matrix.

The penalty therefore determines the stochastic process that must be controlled.

### Gaussian width

For a subset \(T\subseteq\mathbb R^p\), define its Gaussian width by

$$
w(T)
=
\mathbb E
\sup_{u\in T}
\langle g,u\rangle,
\qquad
g\sim N(0,I_p).
$$

For the \(\ell_1\) unit ball,

$$
\sup_{\|u\|_1\le1}\langle g,u\rangle
=
\|g\|_\infty,
$$

so

$$
w(B_1^p)
=
\mathbb E\|g\|_\infty
\asymp
\sqrt{\log p}.
$$

For the set of \(s\)-sparse unit vectors,

$$
T_s
=
\{u:\|u\|_2=1,\ \|u\|_0\le s\},
$$

one has

$$
w^2(T_s)
\asymp
s\log\left(\frac{ep}{s}\right).
$$

The squared Gaussian width often determines the sample size required for restricted curvature or restricted isometry.

### From finite maxima to empirical processes

Suppose the score is indexed by a function class \(\mathcal F\):

$$
Z_f=(P_n-P)f
=
\frac1n\sum_{i=1}^n f(X_i)-\mathbb Ef(X).
$$

To control

$$
\sup_{f\in\mathcal F}|Z_f|,
$$

introduce an independent ghost sample \(X_1',\ldots,X_n'\). Jensen’s inequality gives

$$
\mathbb E
\sup_{f\in\mathcal F}
|(P_n-P)f|
\le
\mathbb E
\sup_{f\in\mathcal F}
|P_nf-P_n'f|.
$$

Let \(\xi_1,\ldots,\xi_n\) be independent Rademacher signs. Conditional symmetry yields

$$
\mathbb E
\sup_{f\in\mathcal F}
|P_nf-P_n'f|
=
\mathbb E
\sup_{f\in\mathcal F}
\left|
\frac1n
\sum_{i=1}^n
\xi_i
\{f(X_i)-f(X_i')\}
\right|.
$$

The triangle inequality then gives the symmetrization bound

$$
\boxed{
\mathbb E
\sup_{f\in\mathcal F}
|(P_n-P)f|
\le
2
\mathbb E
\sup_{f\in\mathcal F}
\left|
\frac1n
\sum_{i=1}^n
\xi_i f(X_i)
\right|.
}
$$

The right-hand side is the Rademacher complexity of \(\mathcal F\). Symmetrization replaces a centered empirical process involving the unknown population expectation with a conditionally centered signed process.

For the empirical metric

$$
d_n(f,g)
=
\left[
\frac1n\sum_{i=1}^n
\{f(X_i)-g(X_i)\}^2
\right]^{1/2},
$$

a Dudley-type entropy bound has the form

$$
\mathbb E_\xi
\sup_{f\in\mathcal F}
\left|
\frac1n\sum_{i=1}^n\xi_if(X_i)
\right|
\lesssim
\frac1{\sqrt n}
\int_0^{\operatorname{diam}(\mathcal F,d_n)}
\sqrt{
\log N(\mathcal F,d_n,\epsilon)
}
\,d\epsilon.
$$

Here \(N(\mathcal F,d_n,\epsilon)\) is the covering number: the minimum number of \(d_n\)-balls of radius \(\epsilon\) required to cover \(\mathcal F\).

For a finite class of size \(p\), entropy is \(\log p\). For an infinite class, the entire covering-number function matters. The \(\log p\) term in the lasso is therefore the finite-dictionary version of function-class entropy.

### Effective dimension as spectral complexity

Sparse estimators measure complexity through maxima, widths, or entropy. Ridge measures complexity through a spectrum:

$$
d_{\mathrm{eff}}(\lambda)
=
\sum_k\frac{\rho_k}{\rho_k+\lambda}.
$$

This quantity counts directions according to how strongly they survive regularization. A direction with \(\rho_k\gg\lambda\) contributes almost one; a direction with \(\rho_k\ll\lambda\) contributes little.

These complexity measures answer different questions:

* \(\log p\) measures simultaneous competition among \(p\) coordinates;
* \(s\log(ep/s)\) measures the size of the collection of sparse directions;
* group complexity combines within-group dimension and the number of groups;
* entropy measures the resolution-dependent size of an infinite class;
* effective dimension measures the number of spectrally active directions after smoothing.

There is no universal scalar called “the complexity.” The correct object is dictated by the geometry of the estimator and the stochastic term in its proof.

---

## How does the framework map to statistical applications?

## Application I: dense regression with correlated predictors

Suppose \(p\) is moderate or large, predictors are strongly correlated, and scientific knowledge suggests many small effects rather than a sparse coefficient vector. The main target is prediction.

The least-squares instability is spectral: small \(\rho_k\) produce high variance. Ridge directly addresses this by applying the filter

$$
\frac{\rho_k}{\rho_k+\lambda}.
$$

The relevant complexity is the effective dimension

$$
d_{\mathrm{eff}}(\lambda)
=
\sum_k\frac{\rho_k}{\rho_k+\lambda},
$$

and the relevant structural assumption concerns the alignment of \(\beta^*\) with the eigenspaces of \(X^\top X/n\). Ridge performs well when substantial coefficient energy lies in directions with reasonably large \(\rho_k\), or when the signal in weak directions is small enough that suppressing those directions incurs limited bias.

The exact prediction risk is

$$
\sum_{k=1}^r
\frac{\lambda^2\rho_kb_k^2}{(\rho_k+\lambda)^2}
+
\frac{\sigma^2}{n}
\sum_{k=1}^r
\left(
\frac{\rho_k}{\rho_k+\lambda}
\right)^2.
$$

This formula can guide qualitative tuning. Larger \(\lambda\) reduces the second term and increases the first.

When the signal is expected to be sparse while predictors are highly correlated, the elastic net combines \(\ell_1\) and quadratic penalties:

$$
\widehat\beta
=
\arg\min_\beta
\left\{
\frac1{2n}\|Y-X\beta\|_2^2
+
\lambda
\left[
\alpha\|\beta\|_1
+
\frac{1-\alpha}{2}\|\beta\|_2^2
\right]
\right\},
$$

where \(\alpha\in[0,1]\).

At \(\alpha=1\), this is the lasso. At \(\alpha=0\), it is ridge under the displayed parameterization. When \(1-\alpha>0\), the objective has additional global curvature, which stabilizes coefficient allocation among correlated predictors and generally makes the coefficient solution unique.

The KKT condition is

$$
-\frac{X^\top(Y-X\widehat\beta)}{n}
+
\lambda(1-\alpha)\widehat\beta
+
\lambda\alpha z
=
0,
\qquad
z\in\partial\|\widehat\beta\|_1.
$$

The quadratic term stabilizes correlated directions; the \(\ell_1\) term retains thresholding. Zou and Hastie introduced the elastic net to combine variable selection with a grouping effect for correlated predictors. ([OUP Academic][7])

The principal limitation remains structural: if two columns are observationally indistinguishable, no penalty can identify their separate causal or scientific contributions from the regression data alone.

## Application II: sparse high-dimensional linear regression

Now suppose \(p\gg n\), while

$$
s=\|\beta^*\|_0\ll n.
$$

The lasso framework maps as follows:

$$
\mathcal L_n(\beta)
=
\frac1{2n}\|Y-X\beta\|_2^2,
\qquad
\mathcal R(\beta)=\|\beta\|_1,
$$

$$
\mathcal R^*(z)=\|z\|_\infty,
\qquad
\Psi(\mathcal M(S))=\sqrt s.
$$

The score is

$$
\nabla\mathcal L_n(\beta^*)
=
-\frac{X^\top\varepsilon}{n}.
$$

Under sub-Gaussian noise and normalized columns,

$$
\lambda
\asymp
\sigma
\sqrt{
\frac{\log(p/\delta)}{n}
}
$$

dominates the score with probability at least \(1-\delta\).

If the loss has RSC curvature \(\kappa\) on the lasso cone, then the master theorem gives

$$
\|\widehat\beta-\beta^*\|_2
\lesssim
\frac{\sigma}{\kappa}
\sqrt{
\frac{s\log(p/\delta)}{n}
},
$$

and

$$
\|X(\widehat\beta-\beta^*)\|_n^2
\lesssim
\frac{\sigma^2s\log(p/\delta)}{n\kappa}.
$$

The exact placement of \(\kappa\) depends on whether RSC is written as \(\kappa\|\Delta\|_2^2/2\), whether a squared restricted eigenvalue is used, and whether the conclusion concerns prediction or parameter error.

Under approximate sparsity, choose \(S\) as the coordinates of the largest coefficients. An oracle inequality takes the schematic form

$$
\|X(\widehat\beta-\beta^*)\|_n^2
\lesssim
\inf_{b\in\mathbb R^p}
\left\{
\|X(b-\beta^*)\|_n^2
+
\frac{\lambda^2|\operatorname{supp}(b)|}{\kappa_b}
+
\lambda\|\beta^*_{\operatorname{supp}(b)^c}\|_1
\right\}.
$$

The estimator adapts to a tradeoff between sparse approximation and estimation noise.

If \(\sigma\) is unknown, the ordinary theoretical penalty cannot be calibrated directly. The square-root lasso uses

$$
\widehat\beta^{\mathrm{sqrt}}
\in
\arg\min_\beta
\left\{
\frac{\|Y-X\beta\|_2}{\sqrt n}
+
\lambda\|\beta\|_1
\right\}.
$$

Its score is self-normalized by the residual scale, so the leading theoretical choice of \(\lambda\) can be made independent of \(\sigma\). Under appropriate moment and design conditions, it attains the same principal rate as the lasso with known noise scale. ([arXiv][8])

Prediction consistency and support recovery must be separated. Restricted eigenvalue conditions can be sufficient for prediction and \(\ell_2\) estimation. Exact signed support recovery typically requires:

$$
\min_{j\in S}|\beta_j^*|
\gtrsim \lambda,
$$

together with an irrepresentable condition such as

$$
\left\|
\Sigma_{S^cS}
\Sigma_{SS}^{-1}
\operatorname{sign}(\beta_S^*)
\right\|_\infty
\le
1-\eta
$$

for some \(\eta>0\). This condition restricts how well inactive variables can be represented by active variables. It is substantially stronger than a prediction-oriented restricted eigenvalue condition. Zhao and Yu established the close relation between the irrepresentable condition and lasso model-selection consistency; Wainwright derived sharp support-recovery thresholds for Gaussian ensembles. ([Journal of Machine Learning Research][9])

## Application III: group-sparse logistic regression

This application enlarges both the loss and the structural unit.

Let

$$
Y_i\in\{0,1\},
\qquad
\mathbb P(Y_i=1\mid x_i)
=
\mu(x_i^\top\beta^*),
$$

where

$$
\mu(t)=\frac{e^t}{1+e^t}.
$$

The empirical negative log-likelihood is

$$
\mathcal L_n(\beta)
=
\frac1n
\sum_{i=1}^n
\left[
\log(1+e^{x_i^\top\beta})
-
Y_ix_i^\top\beta
\right].
$$

Suppose the coordinates are partitioned into \(m\) disjoint groups \(G_1,\ldots,G_m\), each of size \(d\) for simplicity. The group lasso estimator is

$$
\widehat\beta
\in
\arg\min_\beta
\left\{
\mathcal L_n(\beta)
+
\lambda
\sum_{g=1}^m
\|\beta_{G_g}\|_2
\right\}.
$$

The group norm and its dual are

$$
\mathcal R(\beta)
=
\sum_{g=1}^m\|\beta_{G_g}\|_2,
$$

$$
\mathcal R^*(z)
=
\max_{g\le m}\|z_{G_g}\|_2.
$$

The gradient at the truth is

$$
\nabla\mathcal L_n(\beta^*)
=
\frac1n
\sum_{i=1}^n
x_i
\{\mu(x_i^\top\beta^*)-Y_i\}.
$$

Conditional on the design, each residual

$$
\mu(x_i^\top\beta^*)-Y_i
$$

has mean zero and is bounded. Under suitable normalization of every design block, concentration gives

$$
\max_{g\le m}
\left\|
\nabla_{G_g}\mathcal L_n(\beta^*)
\right\|_2
\lesssim
\sqrt{
\frac{
d+\log(m/\delta)
}{n}
}
$$

with probability at least \(1-\delta\).

The term \(d\) is the Euclidean fluctuation within one group. The term \(\log m\) is the cost of taking a maximum over groups. For unequal group sizes, weights \(w_g\) are usually introduced, and the exact penalty scale depends on those weights and the block normalization.

If \(s_g\) groups are active, then

$$
\Psi=\sqrt{s_g}.
$$

The Hessian is

$$
\nabla^2\mathcal L_n(\beta)
=
\frac1nX^\top W(\beta)X,
$$

where

$$
W_{ii}(\beta)
=
\mu(x_i^\top\beta)
\{1-\mu(x_i^\top\beta)\}.
$$

If the linear predictors remain in a bounded interval,

$$
|x_i^\top\beta|\le B,
$$

then

$$
W_{ii}(\beta)\ge c_B>0.
$$

In that local region, the logistic loss inherits restricted curvature from \(X^\top X/n\). Assuming group-RSC curvature \(\kappa\),

$$
\boxed{
\|\widehat\beta-\beta^*\|_2
\lesssim
\frac{\sqrt{s_g}}{\kappa}
\sqrt{
\frac{
d+\log(m/\delta)
}{n}
}.
}
$$

The corresponding excess-loss remainder satisfies

$$
D_{\mathcal L_n}(\widehat\beta,\beta^*)
\lesssim
\frac{
s_g\{d+\log(m/\delta)\}
}{
n\kappa
}.
$$

This application extends the sparse linear model in two directions:

1. the loss is nonlinear, so curvature is a local Hessian property;
2. the structural unit is a group, so the dual score is a maximum of Euclidean norms.

Group penalties are appropriate when a factor, categorical predictor, spline basis, or interaction block should enter the model as a unit. If each group is a basis expansion of a function, the group dimension contributes estimation complexity while the basis truncation contributes approximation error.

Yuan and Lin introduced the group lasso for selecting grouped variables in regression. High-dimensional oracle inequalities for generalized linear models with lasso-type penalties were developed by van de Geer and subsequent work. ([Royal Statistical Society][10])

---

## How do optimization and statistical tuning interact?

### KKT conditions for the lasso

For least-squares lasso,

$$
\frac{X^\top(Y-X\widehat\beta)}{n}
=
\lambda z,
$$

where

$$
z_j=
\begin{cases}
\operatorname{sign}(\widehat\beta_j),
& \widehat\beta_j\ne0,\\[4pt]
\text{some value in }[-1,1],
& \widehat\beta_j=0.
\end{cases}
$$

Thus every residual correlation satisfies

$$
\left|
\frac{X_j^\top(Y-X\widehat\beta)}{n}
\right|
\le\lambda.
$$

Active variables attain the boundary with a sign determined by their coefficient. Inactive variables have residual correlation strictly inside or on the boundary.

The all-zero vector is optimal precisely when

$$
\lambda
\ge
\left\|
\frac{X^\top Y}{n}
\right\|_\infty,
$$

assuming the response and predictors have been centered and no intercept is penalized. This gives the largest useful penalty on a regularization path:

$$
\lambda_{\max}
=
\left\|
\frac{X^\top Y}{n}
\right\|_\infty.
$$

For a general norm penalty, the analogous condition is

$$
\lambda_{\max}
=
\mathcal R^*
\left(
\nabla\mathcal L_n(0)
\right).
$$

### Proximal gradient and repeated thresholding

Suppose \(\mathcal L_n\) has a Lipschitz gradient. A proximal-gradient update is

$$
\beta^{(k+1)}
=
\arg\min_u
\left\{
\left\langle
\nabla\mathcal L_n(\beta^{(k)}),
u-\beta^{(k)}
\right\rangle
+
\frac{1}{2\eta}
\|u-\beta^{(k)}\|_2^2
+
\lambda\|u\|_1
\right\}.
$$

Completing the square gives

$$
\beta^{(k+1)}
=
\mathsf{ST}_{\eta\lambda}
\left(
\beta^{(k)}
-
\eta\nabla\mathcal L_n(\beta^{(k)})
\right).
$$

Thus the same soft-thresholding operator derived from the orthogonal statistical model reappears as the proximal operator of the \(\ell_1\) norm. Optimization alternates a gradient step for fit and a thresholding step for structure.

Accelerated proximal methods such as FISTA improve objective convergence while retaining this proximal operation. ([SIAM][11])

### Coordinate descent

For least squares, holding all coordinates except \(j\) fixed gives

$$
\beta_j
\leftarrow
\frac{
\mathsf{ST}_{\lambda}
\left(
X_j^\top r_{-j}/n
\right)
}{
\|X_j\|_2^2/n
},
$$

where

$$
r_{-j}
=
Y-\sum_{k\ne j}X_k\beta_k.
$$

With standardized columns, the denominator is one. Coordinate descent repeatedly applies a one-dimensional soft-thresholding solution to partial residuals. Regularization-path implementations exploit warm starts, using the solution at one \(\lambda\) to initialize the next. Cyclic coordinate descent is a standard computational approach for lasso, ridge, elastic-net, and generalized linear model paths. ([PubMed Central (PMC)][12])

### Statistical and predictive tuning answer different questions

The theoretical choice

$$
\lambda
\gtrsim
\mathcal R^*
\left(
\nabla\mathcal L_n(\theta^*)
\right)
$$

is designed to make a proof event hold with high probability. It protects against noise variables entering through unusually large empirical scores.

Cross-validation estimates out-of-sample predictive performance. Its selected \(\lambda\) may be smaller than a conservative high-probability value and may produce a larger active set. This can be entirely appropriate for prediction. It gives no automatic support-recovery guarantee.

A useful distinction is:

$$
\lambda_{\mathrm{theory}}
\quad\text{controls stochastic fluctuations},
$$

$$
\lambda_{\mathrm{CV}}
\quad\text{targets estimated predictive risk}.
$$

These tuning criteria can coincide in favorable settings, though they solve different optimization problems.

Post-lasso refitting—ordinary least squares on the selected support—can reduce shrinkage bias when the selected model is stable and its size is manageable. It does not remove selection uncertainty or repair omitted active variables.

Numerical accuracy also has a statistical scale. Once optimization error is much smaller than the statistical error \(s\lambda^2\) or \(\lambda\sqrt s\), further optimization changes the estimate by less than the sampling uncertainty. Optimization tolerances should therefore be compared with the target statistical precision.

---

## Where does penalized-regression theory fail or change form?

### A penalty cannot repair nonidentifiability

Suppose \(X_1=X_2\). Then

$$
X(1,0,0,\ldots)^\top
=
X(0,1,0,\ldots)^\top.
$$

No estimator can determine which of the first two coordinates generated the shared effect. For a positive total coefficient \(c\),

$$
\beta_1+\beta_2=c,
\qquad
\beta_1,\beta_2\ge0,
$$

all such coefficient pairs have the same fitted value and the same \(\ell_1\) norm \(c\). The lasso coefficient vector can therefore be nonunique.

The fitted value \(X\widehat\beta\) is often unique under a strictly convex loss in the fitted-value argument, even when \(\widehat\beta\) is nonunique. Coefficient uniqueness, prediction uniqueness, and support uniqueness are separate properties.

In this example, the compatibility or restricted eigenvalue constant vanishes along \((1,-1,0,\ldots)\). The theorem fails for a genuine statistical reason.

### Prediction, estimation, and selection require different geometry

A restricted eigenvalue condition can support prediction and \(\ell_2\) estimation. It allows substantial correlation as long as sparse errors remain distinguishable in prediction norm.

Exact support recovery requires stronger separation. The irrepresentable condition controls leakage from active variables into inactive score equations, and a beta-min condition keeps active coefficients above the stochastic threshold.

A model can therefore have:

* accurate fitted values;
* moderate coefficient error;
* unstable selected support.

This situation is common under strong predictor correlation. Reporting a selected support as if it were an identified scientific structure creates an unwarranted conclusion.

### Heavy tails change the concentration tool

The MGF proof in Section 5 requires sub-Gaussian errors conditional on \(X\). With only finite variance, the bound

$$
\left\|
\frac{X^\top\varepsilon}{n}
\right\|_\infty
\lesssim
\sigma\sqrt{\frac{\log p}{n}}
$$

need not hold at exponentially high probability. A few extreme observations can dominate many score coordinates.

Possible replacements include:

* truncation or winsorization;
* Huberized loss;
* median-of-means procedures;
* robust covariance and score estimators;
* self-normalized inequalities;
* penalty loadings adapted to heterogeneous coordinate variances.

The basic inequality and duality can survive. The score estimator and its concentration argument must change.

Transformations also change tail classes. If \(W\) is sub-Gaussian, then

$$
W^2-\mathbb EW^2
$$

is generally sub-exponential. Likewise, if \(U\) and \(V\) are sub-Gaussian, their product \(UV\) is generally sub-exponential. In Orlicz-norm notation,

$$
\|UV\|_{\psi_1}
\lesssim
\|U\|_{\psi_2}\|V\|_{\psi_2},
$$

and

$$
\|W^2-\mathbb EW^2\|_{\psi_1}
\lesssim
\|W\|_{\psi_2}^2.
$$

For independent centered sub-exponential variables \(Q_i\) with scale \(K\), Bernstein’s inequality has the form

$$
\mathbb P\left(
\left|
\frac1n\sum_{i=1}^nQ_i
\right|>t
\right)
\le
2\exp\left[
-c n
\min\left(
\frac{t^2}{K^2},
\frac{t}{K}
\right)
\right].
$$

The small-deviation regime is Gaussian-like, while the large-deviation regime is exponential. Sample covariance entries involve products and squares, so their analysis typically uses sub-exponential Bernstein bounds rather than a direct sub-Gaussian MGF argument.

### Random design introduces product processes

Under random design,

$$
Z_j
=
\frac1n\sum_{i=1}^nX_{ij}\varepsilon_i.
$$

If the analysis conditions on \(X\), sub-Gaussian noise is enough and the column norms enter the bound. In an unconditional argument, \(X_{ij}\varepsilon_i\) is a product. Even when both factors are sub-Gaussian and independent, the product is generally sub-exponential.

Random design also makes restricted curvature random. A complete proof usually separates two events:

$$
\mathcal E_{\mathrm{score}}
=
\left\{
\mathcal R^*(\nabla\mathcal L_n(\theta^*))
\le\lambda/2
\right\},
$$

and

$$
\mathcal E_{\mathrm{RSC}}
=
\left\{
D_{\mathcal L_n}(\theta^*+\Delta,\theta^*)
\ge
\frac{\kappa}{2}\|\Delta\|^2
\text{ on the cone}
\right\}.
$$

The estimator bound is deterministic on their intersection. Probability theory is then used separately to show that each event is likely.

### Heteroskedasticity and dependence alter \(\lambda\)

If

$$
\operatorname{Var}(\varepsilon_i\mid X)=\sigma_i^2,
$$

different score coordinates can have substantially different variances. A single common penalty may over-penalize some variables and under-penalize others. Weighted lasso uses

$$
\sum_{j=1}^p\lambda_j|\beta_j|
$$

with coordinate-specific loadings based on estimated score variability.

Time-series, spatial, clustered, or repeated-measures data invalidate the independent-product MGF calculation. The score can still be controlled under mixing, martingale, block-dependence, or cluster-level assumptions. The effective sample size and penalty scale then reflect the dependence structure.

### Logistic curvature can disappear

For logistic regression,

$$
W_{ii}(\beta)
=
\mu(x_i^\top\beta)
\{1-\mu(x_i^\top\beta)\}.
$$

As \(|x_i^\top\beta|\to\infty\),

$$
W_{ii}(\beta)\to0.
$$

Thus the loss can become nearly flat along directions that drive fitted probabilities toward zero or one. Complete or near separation is an extreme example. A positive penalty can produce a finite optimizer, yet the statistical RSC constant may be very small.

Logistic-regression bounds therefore require a local curvature condition, a bounded-linear-predictor condition, a margin assumption, or a self-concordant argument controlling the Hessian along the segment from \(\beta^*\) to \(\widehat\beta\).

### The lasso’s bias is structural

Soft thresholding subtracts approximately \(\lambda\) from the magnitude of every selected orthogonal coefficient. In correlated designs, the bias is more complicated but remains tied to the nonzero derivative of the \(\ell_1\) penalty.

Nonconvex penalties such as SCAD and MCP reduce their derivative for large coefficients, aiming to retain thresholding near zero while reducing bias for strong signals. Their objectives can have multiple local minima. Statistical guarantees depend on which stationary point is computed, local curvature, tuning, and minimum-signal conditions.

Fan and Li developed nonconcave penalized likelihood and the SCAD penalty to combine sparsity, continuity, and reduced bias under oracle-property conditions. Those oracle statements are asymptotic results under explicit regularity assumptions; they do not imply universal finite-sample superiority. ([Taylor & Francis Online][13])

### Penalization does not correct endogeneity or target ambiguity

In a random-design linear model, one must define \(\beta^*\). It may be:

* a structural causal coefficient;
* the conditional-mean coefficient under a correct linear model;
* the best linear projection

  $$
  \beta^*
  =
  \arg\min_\beta
  \mathbb E(Y-X^\top\beta)^2;
  $$
* a pseudo-true parameter under misspecification.

The score condition

$$
\mathbb E[X\varepsilon]=0
$$

is essential for the best-linear-projection interpretation. If regressors are endogenous, then the empirical score is centered around a nonzero population quantity. Penalization shrinks the resulting biased estimating equation; it does not remove the bias.

Likewise, a sparse fitted regression does not establish causal sparsity. Confounding, measurement error, selection bias, and omitted variables remain separate identification problems.

### Standardization is part of the model

An \(\ell_1\) penalty applies the same numerical cost to every coefficient. If predictor \(j\) is rescaled to \(aX_j\), the corresponding coefficient is rescaled to \(\beta_j/a\), and its effective penalty changes.

Predictors are therefore commonly centered and standardized so that

$$
\frac{\|X_j\|_2^2}{n}=1.
$$

The intercept is usually left unpenalized. Group penalties require analogous choices of group weights. Different standardizations define different regularized estimators, even when their unpenalized fitted models are algebraically equivalent.

### Penalized estimation is not automatically valid inference

At zero coefficients, the lasso objective is nonsmooth and the estimator has nonstandard local asymptotics. Even under fixed \(p\), lasso-type estimators can have limiting distributions with point masses or threshold-dependent behavior. Knight and Fu gave early asymptotic analyses of such estimators. ([UMich Websites][14])

Ordinary least-squares confidence intervals computed after data-dependent variable selection ignore selection and shrinkage. Valid high-dimensional inference requires additional constructions, such as debiasing, selective inference, sample splitting, or simultaneous testing procedures. These methods impose assumptions beyond those needed for prediction consistency.

---

## A transferable template for other penalized statistical problems

The following sequence can be reused for sparse regression, generalized linear models, matrix estimation, nonparametric series estimation, graphical models, and related structured estimators.

### Step 1: Define the statistical target

Specify the data distribution, parameter, and error metric. Distinguish prediction, parameter estimation, support recovery, and inference.

A generic goal is

$$
\mathbb P_{\theta^*}
\left(
d(\widehat\theta,\theta^*)
\le r_n(\delta)
\right)
\ge1-\delta.
$$

### Step 2: Write the penalized estimator with an explicit normalization

Use

$$
\widehat\theta
\in
\arg\min_\theta
\left\{
\mathcal L_n(\theta)+\lambda\mathcal R(\theta)
\right\}.
$$

Record whether \(\mathcal L_n\) is a sum or an average. Record which components, such as an intercept, are unpenalized.

### Step 3: Expand the loss at the target

Write

$$
\mathcal L_n(\theta^*+\Delta)
-
\mathcal L_n(\theta^*)
=
\langle g,\Delta\rangle
+
D_{\mathcal L_n}(\theta^*+\Delta,\theta^*),
$$

where

$$
g=\nabla\mathcal L_n(\theta^*).
$$

The score \(g\) contains first-order stochastic error. The remainder contains curvature.

### Step 4: Identify the dual stochastic object

Compute

$$
\mathcal R^*(g)
=
\sup_{\mathcal R(u)\le1}
|\langle g,u\rangle|.
$$

Examples are

$$
\|g\|_\infty,
\qquad
\max_g\frac{\|g_{G_g}\|_2}{w_g},
\qquad
\|g\|_{\mathrm{op}},
\qquad
\sup_{f\in\mathcal F}|Z_f|.
$$

This determines whether the complexity is \(\log p\), group dimension plus \(\log m\), Gaussian width, entropy, or an operator-norm scale.

### Step 5: Choose \(\lambda\) to dominate the score

Prove an event of the form

$$
\mathcal E_\lambda
=
\left\{
\mathcal R^*(g)\le\lambda/c
\right\}
$$

with probability at least \(1-\delta\), where \(c>1\) is fixed.

Use the appropriate concentration mechanism:

$$
\text{MGF/Chernoff},
\quad
\text{Bernstein},
\quad
\text{symmetrization},
\quad
\text{chaining},
\quad
\text{self-normalization},
\quad
\text{robustification}.
$$

### Step 6: Derive the basic inequality

Compare the objective at \(\widehat\theta\) and \(\theta^*\):

$$
D_{\mathcal L_n}
\le
-\langle g,\Delta\rangle
+
\lambda
\{\mathcal R(\theta^*)-\mathcal R(\theta^*+\Delta)\}.
$$

This is the deterministic bridge between optimization and probability.

### Step 7: Use penalty geometry to localize the error

Apply decomposability, weak decomposability, tangent-cone geometry, or another structural inequality to prove

$$
\Delta\in\mathcal C.
$$

The cone \(\mathcal C\) describes errors compatible with the penalty and target structure.

### Step 8: Establish curvature on that localized set

Prove

$$
D_{\mathcal L_n}(\theta^*+\Delta,\theta^*)
\ge
\frac{\kappa}{2}\|\Delta\|^2
-
\text{tolerance}
\qquad
\text{for }\Delta\in\mathcal C.
$$

The tolerance term appears in approximate or finite-sample RSC formulations. Covering numbers, Gaussian widths, and small-ball methods often enter here.

### Step 9: Convert structure into dimension

Compute

$$
\Psi(\mathcal M)
=
\sup_{u\in\mathcal M\setminus\{0\}}
\frac{\mathcal R(u)}{\|u\|}.
$$

For coordinate sparsity, \(\Psi=\sqrt s\). For group sparsity, \(\Psi=\sqrt{s_g}\). For rank-\(r\) matrices under nuclear and Frobenius norms, \(\Psi\) is of order \(\sqrt r\), with convention-dependent constants.

### Step 10: Separate estimation, approximation, and identification

The final result should display

$$
\text{estimation error}
+
\text{approximation error}
+
\text{possible nonidentifiability}.
$$

Then ask whether the assumptions support prediction only, coefficient recovery, support recovery, or valid inference.

---

## Formulaized main line

The entire theory can be compressed into the following sequence:

$$
\widehat\theta
\in
\arg\min_\theta
\left\{
\mathcal L_n(\theta)+\lambda\mathcal R(\theta)
\right\},
\qquad
\Delta=\widehat\theta-\theta^*,
$$

$$
\mathcal L_n(\theta^*+\Delta)-\mathcal L_n(\theta^*)
=
\underbrace{
\langle\nabla\mathcal L_n(\theta^*),\Delta\rangle
}_{\text{random score}}
+
\underbrace{
D_{\mathcal L_n}(\theta^*+\Delta,\theta^*)
}_{\text{curvature}},
$$

$$
|\langle\nabla\mathcal L_n(\theta^*),\Delta\rangle|
\le
\underbrace{
\mathcal R^*(\nabla\mathcal L_n(\theta^*))
}_{\text{stochastic complexity}}
\mathcal R(\Delta),
$$

$$
\lambda
\gtrsim
\mathcal R^*(\nabla\mathcal L_n(\theta^*))
\quad\Longrightarrow\quad
\Delta\in\mathcal C,
$$

$$
D_{\mathcal L_n}(\theta^*+\Delta,\theta^*)
\gtrsim
\kappa\|\Delta\|^2
\qquad
\text{on }\mathcal C,
$$

$$
\mathcal R(\Delta_{\mathcal M})
\le
\Psi(\mathcal M)\|\Delta\|,
$$

and therefore

$$
\boxed{
\|\widehat\theta-\theta^*\|
\lesssim
\frac{
\lambda\Psi(\mathcal M)
}{\kappa}
+
\text{approximation term}.
}
$$

For the lasso,

$$
\mathcal R=\|\cdot\|_1,
\qquad
\mathcal R^*=\|\cdot\|_\infty,
\qquad
\lambda\asymp
\sigma\sqrt{\frac{\log p}{n}},
\qquad
\Psi=\sqrt s,
$$

so

$$
\boxed{
\|\widehat\beta-\beta^*\|_2
\lesssim
\frac{\sigma}{\kappa}
\sqrt{
\frac{s\log p}{n}
}.
}
$$

For ridge, the corresponding mechanism is spectral:

$$
\boxed{
\frac1{\rho_k}
\quad\longmapsto\quad
\frac1{\rho_k+\lambda},
\qquad
\text{variance reduction}
\;\leftrightarrow\;
\text{shrinkage bias}.
}
$$

These two formulas capture the main forms of penalized regression. Quadratic penalties regularize unstable spectral inversion. Nonsmooth structured penalties control stochastic scores through duality and restrict the estimator to a low-complexity error cone.

---

## Selected primary references

Tikhonov, A. N. (1963). “On the Regularization of Ill-Posed Problems.” *Doklady Akademii Nauk SSSR*, 153, 49–52. ([Math-Net][1])

James, W., and Stein, C. (1961). “Estimation with Quadratic Loss.” *Proceedings of the Fourth Berkeley Symposium on Mathematical Statistics and Probability*. ([Project Euclid][15])

Hoerl, A. E., and Kennard, R. W. (1970). “Ridge Regression: Biased Estimation for Nonorthogonal Problems.” *Technometrics*, 12, 55–67. ([JSTOR][2])

Tibshirani, R. (1996). “Regression Shrinkage and Selection via the Lasso.” *Journal of the Royal Statistical Society, Series B*, 58, 267–288. ([Royal Statistical Society][3])

Knight, K., and Fu, W. (2000). “Asymptotics for Lasso-Type Estimators.” *Annals of Statistics*, 28, 1356–1378. ([Project Euclid][16])

Fan, J., and Li, R. (2001). “Variable Selection via Nonconcave Penalized Likelihood and Its Oracle Properties.” *Journal of the American Statistical Association*, 96, 1348–1360. ([Taylor & Francis Online][13])

Zou, H., and Hastie, T. (2005). “Regularization and Variable Selection via the Elastic Net.” *Journal of the Royal Statistical Society, Series B*, 67, 301–320. ([OUP Academic][7])

Yuan, M., and Lin, Y. (2006). “Model Selection and Estimation in Regression with Grouped Variables.” *Journal of the Royal Statistical Society, Series B*, 68, 49–67. ([Royal Statistical Society][10])

Zhao, P., and Yu, B. (2006). “On Model Selection Consistency of Lasso.” *Journal of Machine Learning Research*, 7, 2541–2563. ([Journal of Machine Learning Research][9])

van de Geer, S. A. (2008). “High-Dimensional Generalized Linear Models and the Lasso.” *Annals of Statistics*, 36, 614–645. ([Project Euclid][17])

Bickel, P. J., Ritov, Y., and Tsybakov, A. B. (2009). “Simultaneous Analysis of Lasso and Dantzig Selector.” *Annals of Statistics*, 37, 1705–1732. ([Project Euclid][18])

Negahban, S. N., Ravikumar, P., Wainwright, M. J., and Yu, B. (2012). “A Unified Framework for High-Dimensional Analysis of \(M\)-Estimators with Decomposable Regularizers.” *Statistical Science*, 27, 538–557. ([arXiv][6])

Belloni, A., Chernozhukov, V., and Wang, L. (2011). “Square-Root Lasso: Pivotal Recovery of Sparse Signals via Conic Programming.” *Biometrika*, 98, 791–806. ([arXiv][8])

Raskutti, G., Wainwright, M. J., and Yu, B. (2011). “Minimax Rates of Estimation for High-Dimensional Linear Regression over \(\ell_q\)-Balls.” *IEEE Transactions on Information Theory*, 57, 6976–6994.

[1]: https://www.mathnet.ru/eng/dan28764 "https://www.mathnet.ru/eng/dan28764"
[2]: https://www.jstor.org/stable/1267351 "https://www.jstor.org/stable/1267351"
[3]: https://rss.onlinelibrary.wiley.com/doi/pdf/10.1111/j.2517-6161.1996.tb02080.x "https://rss.onlinelibrary.wiley.com/doi/pdf/10.1111/j.2517-6161.1996.tb02080.x"
[4]: https://arxiv.org/abs/0801.1095 "https://arxiv.org/abs/0801.1095"
[5]: https://arxiv.org/abs/0910.2042 "https://arxiv.org/abs/0910.2042"
[6]: https://arxiv.org/abs/1010.2731 "https://arxiv.org/abs/1010.2731"
[7]: https://academic.oup.com/jrsssb/article/67/2/301/7109482 "https://academic.oup.com/jrsssb/article/67/2/301/7109482"
[8]: https://arxiv.org/abs/1009.5689 "https://arxiv.org/abs/1009.5689"
[9]: https://www.jmlr.org/papers/v7/zhao06a.html "https://www.jmlr.org/papers/v7/zhao06a.html"
[10]: https://rss.onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9868.2005.00532.x "https://rss.onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9868.2005.00532.x"
[11]: https://epubs.siam.org/doi/10.1137/080716542 "https://epubs.siam.org/doi/10.1137/080716542"
[12]: https://pmc.ncbi.nlm.nih.gov/articles/PMC2929880/ "https://pmc.ncbi.nlm.nih.gov/articles/PMC2929880/"
[13]: https://www.tandfonline.com/doi/abs/10.1198/016214501753382273 "https://www.tandfonline.com/doi/abs/10.1198/016214501753382273"
[14]: https://websites.umich.edu/~jizhu/jizhu/KnightFu-AoS00.pdf "https://websites.umich.edu/~jizhu/jizhu/KnightFu-AoS00.pdf"
[15]: https://projecteuclid.org/proceedings/berkeley-symposium-on-mathematical-statistics-and-probability/Proceedings-of-the-Fourth-Berkeley-Symposium-on-Mathematical-Statistics-and/Chapter/Estimation-with-Quadratic-Loss/bsmsp/1200512173 "https://projecteuclid.org/proceedings/berkeley-symposium-on-mathematical-statistics-and-probability/Proceedings-of-the-Fourth-Berkeley-Symposium-on-Mathematical-Statistics-and/Chapter/Estimation-with-Quadratic-Loss/bsmsp/1200512173"
[16]: https://projecteuclid.org/journals/annals-of-statistics/volume-28/issue-5/Asymptotics-for-lasso-type-estimators/10.1214/aos/1015957397.full "https://projecteuclid.org/journals/annals-of-statistics/volume-28/issue-5/Asymptotics-for-lasso-type-estimators/10.1214/aos/1015957397.full"
[17]: https://projecteuclid.org/journals/annals-of-statistics/volume-36/issue-2/High-dimensional-generalized-linear-models-and-the-lasso/10.1214/009053607000000929.short "https://projecteuclid.org/journals/annals-of-statistics/volume-36/issue-2/High-dimensional-generalized-linear-models-and-the-lasso/10.1214/009053607000000929.short"
[18]: https://projecteuclid.org/journals/annals-of-statistics/volume-37/issue-4/Simultaneous-analysis-of-Lasso-and-Dantzig-selector/10.1214/08-AOS620.short "https://projecteuclid.org/journals/annals-of-statistics/volume-37/issue-4/Simultaneous-analysis-of-Lasso-and-Dantzig-selector/10.1214/08-AOS620.short"
