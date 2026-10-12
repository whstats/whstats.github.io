---
title: Kullback–Leibler Divergence
order: 2
description: A systematic account of KL divergence as expected log-likelihood evidence, its structural properties, local Fisher geometry, and statistical uses.
aliases:
  - KL Divergence
  - Relative Entropy
tags:
  - information-theory
  - statistical-inference
  - divergence
lang: en
---

## Conceptual Preview

The central question is how to quantify the statistical consequence of describing data generated from one probability law $P$ by another law $Q$. A pointwise likelihood ratio, $dP/dQ$, says how strongly one observation favors $P$ over $Q$. Independent observations multiply likelihood ratios, so their logarithms add. Averaging the log-likelihood ratio under the law that actually generates the data gives the Kullback–Leibler divergence

$$
D(P\|Q)
=
\mathbb E_P\!\left[\log\frac{dP}{dQ}\right].
$$

This formula already contains the main architecture of the subject. The expectation under $P$ makes the quantity directed: it assesses the use of $Q$ when outcomes follow $P$. Normalization of probability forces $D(P\|Q)\ge 0$, with equality exactly when $P=Q$. Product structure gives

$$
D(P^{\otimes n}\|Q^{\otimes n})=nD(P\|Q),
$$

so KL divergence is the average rate at which evidence accumulates across independent observations. Conditioning yields a chain rule, from which data processing follows: replacing the full observation by a statistic cannot increase KL divergence. In a smooth parametric model, the local expansion

$$
D(P_\theta\|P_{\theta+h})
=
\frac12 h^\mathsf T I(\theta)h+o(\|h\|^2)
$$

shows that Fisher information is the quadratic, locally symmetric part of KL divergence.

These mechanisms explain why KL divergence appears in likelihood theory, asymptotic testing, information projection, variational Bayes, and large-deviation theory. The exposition below develops the likelihood-ratio origin first, establishes the measure-theoretic definition and central identities, derives the Fisher-information expansion, and then follows the same quantity into representative statistical applications.

## Why a Directed Discrepancy Arises

Suppose a statistician must distinguish two simple hypotheses. Under $H_P$, an observation $X$ has law $P$; under $H_Q$, it has law $Q$. In a dominated setting with densities $p$ and $q$, the likelihood ratio $p(X)/q(X)$ compares how well the observed value is explained by the two hypotheses. The log-likelihood ratio

$$
\ell_{P,Q}(X)=\log\frac{p(X)}{q(X)}
$$

is the natural evidence scale because independent evidence becomes additive. For independent observations $X_1,\ldots,X_n$,

$$
\log\frac{\prod_{i=1}^n p(X_i)}{\prod_{i=1}^n q(X_i)}
=
\sum_{i=1}^n \log\frac{p(X_i)}{q(X_i)}.
$$

If $P$ generates the data and the log ratio is integrable, the law of large numbers gives

$$
\frac1n\sum_{i=1}^n\log\frac{p(X_i)}{q(X_i)}
\xrightarrow{P}
\mathbb E_P\!\left[\log\frac{p(X)}{q(X)}\right].
$$

The limit is therefore the long-run log-evidence per observation in favor of $P$ against $Q$, when $P$ is true. Reversing the data-generating law changes the relevant average to $\mathbb E_Q[\log(q/p)]$. The two questions differ, so symmetry has no intrinsic role at this stage.

This discrimination problem is the statistical origin of KL divergence. Shannon's 1948 theory had established entropy as an average logarithmic measure of uncertainty in communication.[^shannon1948] Kullback and Leibler's 1951 paper transferred the logarithmic information calculus directly to comparison of statistical hypotheses and studied how that information behaves under sufficient statistics.[^kl1951] They called the directed quantity the mean information for discrimination and reserved “divergence” for its symmetrized sum. Modern usage generally calls the directed quantity KL divergence or relative entropy.

A second route reaches exactly the same functional through predictive scoring. Assume $P$ and $Q$ have densities $p$ and $q$ relative to a common measure. A probabilistic forecast $q$ receives logarithmic loss $-\log q(X)$. Its risk under $P$ is the cross-entropy

$$
R_P(q)=\mathbb E_P[-\log q(X)].
$$

The ideal forecast $p$ has risk $R_P(p)=\mathbb E_P[-\log p(X)]$, whenever the two expectations are meaningful. Their difference is

$$
\begin{aligned}
R_P(q)-R_P(p)
&=\mathbb E_P\!\left[-\log q(X)+\log p(X)\right]\\
&=\mathbb E_P\!\left[\log\frac{p(X)}{q(X)}\right]\\
&=D(P\|Q).
\end{aligned}
$$

Thus KL divergence is the excess expected logarithmic loss caused by using $Q$ to predict observations from $P$. The same algebra underlies the coding interpretation: ideal code lengths are proportional to negative log probabilities, so KL is the expected excess description length under a code adapted to $Q$ rather than $P$. The likelihood, scoring, and coding interpretations are three forms of one mechanism: probabilities multiply, logarithms convert products into sums, and expectation supplies a per-observation average.

These interpretations also identify the support condition that the theory must respect. If $P$ assigns positive probability to an event that $Q$ declares impossible, then an observation in that event gives infinite log evidence against $Q$ and infinite logarithmic loss. A rigorous definition therefore has to allow the value $+\infty$ and has to make the direction $P\|Q$ explicit.

## From Likelihood Ratios to Relative Entropy

Let $(\mathcal X,\mathcal A)$ be a measurable space and let $P$ and $Q$ be probability measures on it. The condition $P\ll Q$ means that every $Q$-null event is also $P$-null. Under this condition the Radon–Nikodym derivative

$$
Z=\frac{dP}{dQ}
$$

exists, is nonnegative, and satisfies $\int Z\,dQ=1$. The measure-theoretically robust definition is

$$
D(P\|Q)
=
\begin{cases}
\displaystyle \int Z\log Z\,dQ, & P\ll Q,\\[6pt]
+\infty, & P\not\ll Q,
\end{cases}
$$

with $0\log 0=0$. The integral is well defined as an extended real number because $z\log z$ is bounded below on $[0,\infty)$. Its negative part is integrable automatically, since $-z\log z\le e^{-1}$ for $0<z\le1$. The change-of-measure identity therefore gives the extended expectation

$$
D(P\|Q)=\int \log Z\,dP
=\mathbb E_P\!\left[\log\frac{dP}{dQ}\right].
$$

Natural logarithms are used throughout, so divergence is measured in nats. Replacing $\log$ by $\log_b$ multiplies every value by $1/\log b$; base two gives bits.

For discrete distributions on a countable set,

$$
D(P\|Q)=\sum_x p(x)\log\frac{p(x)}{q(x)},
$$

where a term with $p(x)>0$ and $q(x)=0$ makes the sum infinite. For densities $p$ and $q$ relative to a common dominating measure $\mu$,

$$
D(P\|Q)=\int p(x)\log\frac{p(x)}{q(x)}\,d\mu(x).
$$

The value does not depend on the particular dominating measure. If a measurable bijection with measurable inverse is applied to the sample space, the KL divergence between the two pushforward laws is unchanged. In smooth density coordinates, this follows because the Jacobian factors cancel inside the density ratio. This invariance distinguishes KL from differential entropy, whose numerical value changes with coordinates.

The first structural question is whether the expected log advantage of the data-generating law can ever be negative. Define

$$
h(z)=z\log z-z+1,
\qquad z\ge 0.
$$

Since $h''(z)=1/z>0$ for $z>0$, the function is strictly convex there; its unique minimum occurs at $z=1$, where $h(1)=0$. Hence $h(z)\ge 0$. If $P\ll Q$, normalization of $Z=dP/dQ$ gives

$$
\begin{aligned}
D(P\|Q)
&=\int Z\log Z\,dQ\\
&=\int \{Z\log Z-Z+1\}\,dQ
   +\int (Z-1)\,dQ\\
&=\int h(Z)\,dQ\\
&\ge 0.
\end{aligned}
$$

Equality requires $h(Z)=0$ $Q$-almost surely, hence $Z=1$ $Q$-almost surely and $P=Q$. Together with the convention $D(P\|Q)=\infty$ when absolute continuity fails, this proves

$$
D(P\|Q)\ge 0,
\qquad
D(P\|Q)=0 \Longleftrightarrow P=Q.
$$

This argument reveals the source of nonnegativity. It is a consequence of convexity plus the probability constraint $\mathbb E_Q[Z]=1$. No metric geometry is needed. The equality condition also establishes identification whenever a statistical objective differs from KL divergence by a constant.

The Bernoulli family provides a compact illustration of direction, curvature, and boundary behavior. For $P=\operatorname{Bernoulli}(p)$ and $Q=\operatorname{Bernoulli}(q)$ with $p,q\in(0,1)$,

$$
D(P\|Q)
=
p\log\frac pq+(1-p)\log\frac{1-p}{1-q}.
$$

Holding $p$ fixed and treating $q$ as an approximation parameter,

$$
\frac{\partial}{\partial q}D(P\|Q)
=
\frac{q-p}{q(1-q)}.
$$

The derivative vanishes only at $q=p$, is negative for $q<p$, and is positive for $q>p$, directly confirming the unique minimum. A second differentiation at the minimum gives

$$
\left.\frac{\partial^2}{\partial q^2}D(P\|Q)\right|_{q=p}
=
\frac{1}{p(1-p)}.
$$

Consequently, for a small perturbation $q=p+\delta$,

$$
D(\operatorname{Bern}(p)\|\operatorname{Bern}(p+\delta))
=
\frac{\delta^2}{2p(1-p)}+o(\delta^2).
$$

The coefficient is the Fisher information for the Bernoulli probability parameter. Near $p=0$ or $p=1$, the curvature becomes large because a small absolute probability error can create a severe relative error for a rare outcome. At the boundary, assigning $q=0$ when $p>0$ makes the divergence infinite. This elementary example anticipates both the local Fisher geometry and the global support sensitivity developed later.

A related variational identity makes the role of exponential tilting explicit. Let $f$ be measurable with $0<\mathbb E_Q[e^f]<\infty$, and define the tilted probability measure $Q_f$ by

$$
\frac{dQ_f}{dQ}
=
\frac{e^f}{\mathbb E_Q[e^f]}.
$$

This construction is admissible because the displayed derivative is nonnegative and integrates to one. If $P\ll Q$ and the relevant expectations exist, then

$$
\begin{aligned}
D(P\|Q_f)
&=\mathbb E_P\!\left[
\log\frac{dP}{dQ}
-
\log\frac{dQ_f}{dQ}
\right]\\
&=D(P\|Q)-\mathbb E_P[f]+\log\mathbb E_Q[e^f].
\end{aligned}
$$

Nonnegativity of $D(P\|Q_f)$ therefore yields

$$
\mathbb E_P[f]-\log\mathbb E_Q[e^f]
\le D(P\|Q).
$$

Taking the supremum over bounded measurable $f$ gives the Donsker–Varadhan representation

$$
D(P\|Q)
=
\sup_f\left\{\mathbb E_P[f]-\log\mathbb E_Q[e^f]\right\}.
$$

If $\log(dP/dQ)$ is bounded, equality follows by choosing $f=\log(dP/dQ)$. In general, truncated versions of this logarithm recover the supremum. This identity says that KL divergence is the convex dual penalty associated with the log moment-generating functional.[^donskervaradhan] It also explains why exponential families and exponential concentration bounds repeatedly meet relative entropy: exponential tilting is the optimizer that converts a moment-generating function into a changed probability law.

## Accumulation, Conditioning, and Data Reduction

The likelihood-ratio origin predicts additivity across independent observations. If $P=P_1\otimes P_2$ and $Q=Q_1\otimes Q_2$, with $P_j\ll Q_j$, then

$$
\frac{dP}{dQ}(x_1,x_2)
=
\frac{dP_1}{dQ_1}(x_1)
\frac{dP_2}{dQ_2}(x_2).
$$

Taking logarithms and integrating under $P_1\otimes P_2$ gives

$$
D(P_1\otimes P_2\|Q_1\otimes Q_2)
=
D(P_1\|Q_1)+D(P_2\|Q_2).
$$

Iteration yields $D(P^{\otimes n}\|Q^{\otimes n})=nD(P\|Q)$. This exact linear scaling is the deterministic counterpart of the law-of-large-numbers statement for accumulated log evidence.

The more general organizing identity is the chain rule. Let $P_{XY}$ and $Q_{XY}$ be probability laws on a product of standard Borel spaces, so regular conditional distributions exist. Assume the relevant absolute-continuity conditions. The joint likelihood ratio factorizes into a marginal and a conditional part:

$$
\frac{dP_{XY}}{dQ_{XY}}(x,y)
=
\frac{dP_X}{dQ_X}(x)
\frac{dP_{Y\mid X=x}}{dQ_{Y\mid X=x}}(y)
$$

for $P_X$-almost every $x$. The logarithm converts this factorization into a sum. Integrating the first term under $P_{XY}$ gives $D(P_X\|Q_X)$; disintegration of the second term gives the conditional average. Consequently,

$$
D(P_{XY}\|Q_{XY})
=
D(P_X\|Q_X)
+
\mathbb E_{P_X}\!\left[
D(P_{Y\mid X}\|Q_{Y\mid X})
\right].
$$

Each term has a direct evidential meaning. The marginal divergence is the expected evidence available from observing $X$. After $X$ is known, the conditional divergence is the remaining expected evidence in $Y$. The chain rule states that total evidence decomposes into evidence revealed at successive stages.

Now let $T=t(X)$ be a statistic. Treating $X$ as the pair $(T,X)$ and applying the chain rule gives

$$
D(P_X\|Q_X)
=
D(P_T\|Q_T)
+
\mathbb E_{P_T}\!\left[
D(P_{X\mid T}\|Q_{X\mid T})
\right].
$$

Nonnegativity of the conditional term produces the data-processing inequality

$$
D(P_T\|Q_T)\le D(P_X\|Q_X).
$$

A statistic can merge sample points and discard distinctions; it cannot create additional average log evidence. The same conclusion holds for randomized transformations represented by Markov kernels.

The equality condition is statistically important. Equality holds exactly when

$$
P_{X\mid T}=Q_{X\mid T}
\quad P_T\text{-almost surely},
$$

subject to the usual common-support qualifications. Equivalently, the likelihood ratio $dP/dQ$ is measurable with respect to $T$. In a dominated parametric experiment $\{P_\theta:\theta\in\Theta\}$, a statistic $T$ is sufficient when the conditional distribution of the full data given $T$ does not depend on $\theta$. Write $P_\theta^T$ for the law of $T$ under $P_\theta$. Then, for any two parameter values,

$$
D(P_{\theta_1}^T\|P_{\theta_2}^T)
=
D(P_{\theta_1}\|P_{\theta_2}).
$$

Sufficiency can therefore be read as exact preservation of pairwise discrimination information. This is the connection highlighted in the original Kullback–Leibler paper: a sufficient reduction discards sample-level detail while retaining every likelihood ratio relevant to the experiment.[^kl1951]

The chain rule also clarifies mutual information. For a joint law $P_{XY}$, define

$$
I(X;Y)=D(P_{XY}\|P_X\otimes P_Y).
$$

It vanishes exactly under independence. Applying the chain rule gives

$$
I(X;Y)
=
\mathbb E_{P_X}\!\left[D(P_{Y\mid X}\|P_Y)\right],
$$

so mutual information is the expected change in the distribution of $Y$ after learning $X$. This special case is useful because it shows how a dependence functional inherits positivity and data processing from KL divergence without requiring separate proofs.

## Local Geometry and Fisher Information

Global KL divergence is asymmetric and can be infinite. Smooth parametric models reveal a simpler local structure. Let $\{P_\theta:\theta\in\Theta\subset\mathbb R^d\}$ have densities $p_\theta$ relative to a common measure, with $\Theta$ open. Assume that $\log p_\theta(x)$ is twice differentiable near the point of interest, differentiation can be interchanged with integration, the support is locally stable, and the Taylor remainder is integrable uniformly enough to pass through expectation. These are standard regularity conditions; differentiability in quadratic mean provides a more invariant formulation.

Define the score and Fisher information by

$$
s_\theta(X)=\nabla_\theta\log p_\theta(X),
\qquad
I(\theta)=\mathbb E_\theta[s_\theta s_\theta^\mathsf T].
$$

Differentiating $\int p_\theta\,d\mu=1$ gives

$$
\mathbb E_\theta[s_\theta]
=
\int \nabla_\theta p_\theta\,d\mu
=0.
$$

Differentiating this identity once more, or differentiating the normalization twice, yields the information identity

$$
-\mathbb E_\theta[\nabla_\theta^2\log p_\theta(X)]
=I(\theta).
$$

Now consider the divergence from $P_\theta$ to the nearby model $P_{\theta+h}$:

$$
D(P_\theta\|P_{\theta+h})
=
\mathbb E_\theta[
\log p_\theta(X)-\log p_{\theta+h}(X)
].
$$

A second-order Taylor expansion of the second log density around $\theta$ gives

$$
\log p_{\theta+h}(X)
=
\log p_\theta(X)
+h^\mathsf T s_\theta(X)
+
\frac12 h^\mathsf T
\nabla_\theta^2\log p_\theta(X)h
+r_h(X),
$$

where $\mathbb E_\theta|r_h(X)|=o(\|h\|^2)$ under the stated regularity. Substitution into the divergence produces

$$
\begin{aligned}
D(P_\theta\|P_{\theta+h})
&=-h^\mathsf T\mathbb E_\theta[s_\theta]
-
\frac12 h^\mathsf T
\mathbb E_\theta[\nabla_\theta^2\log p_\theta(X)]h
+o(\|h\|^2)\\
&=\frac12 h^\mathsf T I(\theta)h+o(\|h\|^2).
\end{aligned}
$$

The linear term vanishes because a normalized model has mean-zero score. The quadratic term is Fisher information because curvature of expected log likelihood equals score variance. These two normalization identities generate the entire local result.

The same second-order term appears after reversing the divergence:

$$
D(P_{\theta+h}\|P_\theta)
=
\frac12 h^\mathsf T I(\theta)h+o(\|h\|^2).
$$

Hence KL asymmetry can first appear at third order in a regular model. Fisher information acts as a Riemannian metric tensor because it is the common local Hessian of many smooth statistical divergences. If $I(\theta)$ is singular, some parameter directions are locally unidentified and the quadratic form vanishes along them.

For a concrete exact case, let $P_\mu=\mathcal N(\mu,\sigma^2)$ with known $\sigma^2$. Direct integration gives

$$
D(P_\mu\|P_{\mu+\delta})
=
\frac{\delta^2}{2\sigma^2}.
$$

Here $I(\mu)=1/\sigma^2$, so the local quadratic formula is exact for every $\delta$. The Gaussian location family has no higher-order asymmetry in its mean parameter.

The $n^{-1/2}$ scale of regular asymptotic statistics follows immediately from tensorization. For local alternatives $\theta+h/\sqrt n$,

$$
\begin{aligned}
D(P_\theta^{\otimes n}\|P_{\theta+h/\sqrt n}^{\otimes n})
&=nD(P_\theta\|P_{\theta+h/\sqrt n})\\
&\longrightarrow \frac12 h^\mathsf T I(\theta)h.
\end{aligned}
$$

Thus alternatives separated by $n^{-1/2}$ carry a finite amount of asymptotic discrimination information. Larger separations produce diverging evidence; smaller separations become asymptotically indistinguishable at first order. Under local asymptotic normality, the random log-likelihood ratio has the expansion

$$
\log\frac{dP_{\theta+h/\sqrt n}^{\otimes n}}
{dP_\theta^{\otimes n}}
=
h^\mathsf T\Delta_n
-
\frac12h^\mathsf T I(\theta)h
+o_{P_\theta}(1),
$$

where $\Delta_n=n^{-1/2}\sum_{i=1}^n s_\theta(X_i)\Rightarrow\mathcal N(0,I(\theta))$. The deterministic drift is minus the local KL divergence to second order, while the random term is score fluctuation. This places Fisher information, contiguity, local power, and asymptotic normality within the same likelihood-ratio geometry.

## Statistical Applications

### Maximum likelihood as KL projection

Let observations be i.i.d. from an unknown law $P_0$ with density $p_0$, and let $\{Q_\theta:\theta\in\Theta\}$ be a working model with densities $q_\theta$. The population log-likelihood criterion is

$$
M(\theta)=\mathbb E_0[\log q_\theta(X)].
$$

Whenever the relevant expectations are finite,

$$
D(P_0\|Q_\theta)
=
\mathbb E_0[\log p_0(X)]-M(\theta).
$$

The first term does not depend on $\theta$. Therefore the population maximizers of $M$ are exactly the KL minimizers:

$$
\theta^*
\in
\arg\max_{\theta\in\Theta}M(\theta)
=
\arg\min_{\theta\in\Theta}D(P_0\|Q_\theta).
$$

This identity supplies the population target of likelihood estimation. Under correct specification, $P_0=Q_{\theta_0}$, nonnegativity and identification imply that $\theta^*=\theta_0$. Under misspecification, $\theta^*$ is the KL projection of the data-generating law onto the model family. Its interpretation remains precise even though no parameter value generates the data.

The empirical criterion is

$$
M_n(\theta)=\frac1n\sum_{i=1}^n\log q_\theta(X_i),
$$

and an exact maximum likelihood estimator satisfies $\widehat\theta_n\in\arg\max_\theta M_n(\theta)$. More generally, allow approximate maximization through

$$
M_n(\widehat\theta_n)
\ge \sup_{\theta\in\Theta}M_n(\theta)-o_P(1).
$$

Consistency for $\theta^*$ requires an approximation step that KL geometry alone does not provide. Assume a uniform law of large numbers,

$$
\sup_{\theta\in\Theta}|M_n(\theta)-M(\theta)|\xrightarrow{P}0,
$$

and the separation condition that, for every $\varepsilon>0$,

$$
\sup_{\|\theta-\theta^*\|\ge\varepsilon}M(\theta)<M(\theta^*).
$$

These conditions, together with approximate maximization, imply $\widehat\theta_n\xrightarrow{P}\theta^*$. This is the rigorous relation between empirical likelihood optimization and population KL minimization. Compactness, coercivity, or model-specific arguments are typical ways to establish the required uniformity and separation.

Under differentiability and nonsingularity conditions, let

$$
A=-\mathbb E_0[\nabla_\theta^2\log q_{\theta^*}(X)],
\qquad
B=\mathbb E_0[
\nabla_\theta\log q_{\theta^*}(X)
\nabla_\theta\log q_{\theta^*}(X)^\mathsf T
].
$$

A Taylor expansion of the empirical score around $\theta^*$ and a multivariate central limit theorem yield

$$
\sqrt n(\widehat\theta_n-\theta^*)
\Rightarrow
\mathcal N(0,A^{-1}BA^{-1}).
$$

Under correct specification, the information identity gives $A=B=I(\theta_0)$, recovering inverse Fisher information. Under misspecification, curvature $A$ and score variance $B$ differ, which produces the sandwich covariance. White's systematic theory of misspecified maximum likelihood formalized this KL-projection target and its robust asymptotic distribution.[^white1982]

A subtle point concerns the phrase “MLE minimizes empirical KL divergence.” For continuous models, the empirical measure $P_n=n^{-1}\sum_i\delta_{X_i}$ is usually singular relative to every continuous $Q_\theta$, so $D(P_n\|Q_\theta)=\infty$. The finite empirical objective is the cross-entropy term $-\int\log q_\theta\,dP_n$. It estimates the corresponding population cross-entropy, whose difference from population KL is an unknown constant in $\theta$. This distinction prevents an invalid measure-theoretic identification while preserving the correct optimization argument.

### Hypothesis testing and error exponents

Consider testing the simple null $H_0:P$ against the alternative $H_1:Q$ from $n$ i.i.d. observations. Let $A_n$ be the acceptance region for $P$. The type-I and type-II errors are

$$
\alpha_n=P^{\otimes n}(A_n^c),
\qquad
\beta_n=Q^{\otimes n}(A_n).
$$

Define the log-likelihood ratio favoring $P$ by

$$
S_n
=
\log\frac{dP^{\otimes n}}{dQ^{\otimes n}}
=
\sum_{i=1}^n\log\frac{dP}{dQ}(X_i).
$$

Assume $D(P\|Q)<\infty$ and enough integrability for the law of large numbers. Under $P$,

$$
\frac{S_n}{n}\xrightarrow{P}D(P\|Q).
$$

Fix $\delta>0$ and accept $P$ on

$$
A_n=\{S_n\ge n(D(P\|Q)-\delta)\}.
$$

The type-I error tends to zero. On $A_n$, the change-of-measure factor satisfies $dQ^{\otimes n}/dP^{\otimes n}=e^{-S_n}\le e^{-n(D-\delta)}$, so

$$
\begin{aligned}
\beta_n
&=\int_{A_n}dQ^{\otimes n}\\
&=\int_{A_n}e^{-S_n}\,dP^{\otimes n}\\
&\le e^{-n(D(P\|Q)-\delta)}.
\end{aligned}
$$

Hence a type-II error exponent arbitrarily close to $D(P\|Q)$ is achievable while the type-I error vanishes.

The converse uses the same likelihood ratio in the opposite direction. Let

$$
B_n=\{S_n\le n(D(P\|Q)+\delta)\}.
$$

Then $P^{\otimes n}(B_n)\to1$. For any test with $P^{\otimes n}(A_n)\ge1-\varepsilon$,

$$
P^{\otimes n}(A_n\cap B_n)
\ge 1-\varepsilon-o(1).
$$

On $B_n$, $dP^{\otimes n}/dQ^{\otimes n}=e^{S_n}\le e^{n(D+\delta)}$. Therefore

$$
\begin{aligned}
\beta_n
=Q^{\otimes n}(A_n)
&\ge Q^{\otimes n}(A_n\cap B_n)\\
&\ge e^{-n(D(P\|Q)+\delta)}
P^{\otimes n}(A_n\cap B_n).
\end{aligned}
$$

The final probability stays bounded away from zero. No test whose type-I error is uniformly bounded above by some $\varepsilon<1$ can make $\beta_n$ decay with an exponent exceeding $D(P\|Q)$. Letting $\delta\downarrow0$ yields Stein's asymptotic testing law:

$$
\lim_{n\to\infty}
-\frac{1}{n}\log\inf_{\alpha_n\le\varepsilon}\beta_n
=D(P\|Q),
\qquad 0<\varepsilon<1.
$$

KL divergence has therefore acquired an operational meaning: it is the optimal exponential rate for suppressing one error while controlling the other. The direction matches the protected hypothesis. Symmetric Bayesian testing has a different exponent, the Chernoff information, because it optimizes a different error criterion.[^chernoff1952]

### Empirical distributions and large deviations

KL divergence also governs the probability that an empirical distribution looks systematically different from its sampling law. The finite-alphabet case shows the mechanism with little technical overhead. Let $X_1,\ldots,X_n$ be i.i.d. from $Q=(q_1,\ldots,q_k)$ on $\{1,\ldots,k\}$, and define the empirical distribution

$$
\widehat P_n(j)=\frac1n\sum_{i=1}^n\mathbf 1\{X_i=j\}.
$$

Fix a probability vector $r=(r_1,\ldots,r_k)$ such that every $nr_j$ is an integer. The event $\widehat P_n=r$ contains all sequences with exactly $nr_j$ occurrences of symbol $j$. Its probability is multinomial:

$$
Q^{\otimes n}(\widehat P_n=r)
=
\frac{n!}{\prod_{j=1}^k (nr_j)!}
\prod_{j=1}^k q_j^{nr_j}.
$$

The combinatorial factor counts the sequences having type $r$. For fixed $k$, Stirling's formula gives uniformly over all types, with $0\log0=0$,

$$
\log\frac{n!}{\prod_j(nr_j)!}
=
nH(r)+O(\log n),
$$

where $H(r)=-\sum_j r_j\log r_j$. Substituting this approximation into the log probability yields

$$
\begin{aligned}
\frac1n\log Q^{\otimes n}(\widehat P_n=r)
&=H(r)+\sum_{j=1}^k r_j\log q_j
+O\!\left(\frac{\log n}{n}\right)\\
&=-D(r\|Q)
+O\!\left(\frac{\log n}{n}\right).
\end{aligned}
$$

Equivalently,

$$
Q^{\otimes n}(\widehat P_n=r)
=
\exp\{-nD(r\|Q)+O(\log n)\}.
$$

The two components of KL have acquired a transparent combinatorial meaning. The entropy term $H(r)$ measures the exponential number of sequences with empirical composition $r$. The cross-entropy term $-\sum_jr_j\log q_j$ measures the probability cost of each such sequence under $Q$. Their difference is the net exponential cost. If $r_j>0$ while $q_j=0$, the type is impossible and the cost is infinite, exactly as the support convention for KL requires.

For a set $\Gamma$ of empirical distributions, there are at most $(n+1)^k$ possible types. This count is polynomial in $n$, so it does not affect an exponential rate. Summing the type probabilities therefore makes the least costly distribution in $\Gamma$ dominate. The precise finite-alphabet large-deviation statement is

$$
-\inf_{R\in\Gamma^\circ}D(R\|Q)
\le
\liminf_{n\to\infty}\frac1n\log Q^{\otimes n}(\widehat P_n\in\Gamma)
\le
\limsup_{n\to\infty}\frac1n\log Q^{\otimes n}(\widehat P_n\in\Gamma)
\le
-\inf_{R\in\overline\Gamma}D(R\|Q).
$$

Here the interior and closure are taken in the probability simplex. When the two infima agree, the logarithmic probability has the exact rate $-\inf_{R\in\Gamma}D(R\|Q)$. Sanov's theorem extends the same upper-and-lower-bound structure to empirical measures on Polish spaces under the weak topology.[^sanov1957]

This result supplies another operational interpretation. Among all empirical laws satisfying an atypical constraint, the one with smallest $D(R\|Q)$ is the most probable way for the deviation to occur. Constrained KL minimization consequently appears in goodness-of-fit testing, conditional limit theory, exponential tilting, and maximum-entropy calculations. The testing exponent derived above is a closely related change-of-measure phenomenon: rare acceptance regions under one law are priced by the relative entropy needed to make them typical under another.

### Variational inference and information projection

Let $x$ be observed data, $z$ a latent variable, and $p(x,z)$ a joint density. The posterior is $\pi(z)=p(z\mid x)=p(x,z)/p(x)$. Exact posterior calculations may be infeasible, so variational inference chooses an approximation $q$ from a tractable class $\mathcal Q$ by minimizing $D(q\|\pi)$. Expanding this objective gives

$$
\begin{aligned}
D(q\|\pi)
&=\mathbb E_q\!\left[\log q(z)-\log p(z\mid x)\right]\\
&=\mathbb E_q\!\left[\log q(z)-\log p(x,z)\right]+\log p(x).
\end{aligned}
$$

Rearranging produces the exact decomposition

$$
\log p(x)
=
\underbrace{\mathbb E_q[\log p(x,z)-\log q(z)]}_{\operatorname{ELBO}(q)}
+
D(q\|\pi).
$$

Since the left side does not depend on $q$ and KL divergence is nonnegative, maximizing the evidence lower bound is equivalent to minimizing $D(q\|\pi)$. The lower-bound property and the optimization criterion come from the same equality; no separate approximation argument is needed. Variational methods for graphical models developed this principle into computational schemes based on restricted families and coordinate optimization.[^jordan1999]

The direction $D(q\|\pi)$ determines the approximation behavior. It strongly penalizes placing $q$-mass where the posterior density is very small, while posterior regions receiving zero $q$-mass contribute nothing directly to the expectation. Under restrictive families, this often favors concentration on one posterior mode and can understate tail mass or dependence. These are tendencies induced by support and averaging direction; they are not universal theorems for every variational family.

Forward information projection, $\min_{Q\in\mathcal Q}D(P\|Q)$, has a different structure. Suppose $\mathcal Q$ is a regular exponential family

$$
q_\eta(x)
=
h(x)\exp\{\eta^\mathsf T T(x)-A(\eta)\},
$$

where $\eta$ is the natural parameter, $T$ is the sufficient-statistic vector, and $A$ is the log-partition function.

For a fixed target $P$, terms independent of $\eta$ can be removed from the objective:

$$
D(P\|Q_\eta)
=
\text{constant}
-
\eta^\mathsf T\mathbb E_P[T(X)]
+
A(\eta).
$$

Differentiation gives

$$
\nabla_\eta D(P\|Q_\eta)
=
-\mathbb E_P[T(X)]+\nabla A(\eta).
$$

Since $\nabla A(\eta)=\mathbb E_{Q_\eta}[T(X)]$, an interior minimizer satisfies the moment-matching equations

$$
\mathbb E_{Q_{\eta^*}}[T(X)]
=
\mathbb E_P[T(X)].
$$

Thus the forward KL projection onto an exponential family preserves the expectations of its sufficient statistics. The moment equations also produce an exact Pythagorean identity. Let $Q_{\eta^*}$ be an interior projection satisfying $\mathbb E_P[T]=\mathbb E_{Q_{\eta^*}}[T]$. For any other family member $Q_\eta$,

$$
\begin{aligned}
D(P\|Q_\eta)-D(P\|Q_{\eta^*})
&=\mathbb E_P\!\left[\log\frac{q_{\eta^*}(X)}{q_\eta(X)}\right]\\
&=(\eta^*-\eta)^\mathsf T\mathbb E_P[T]
-A(\eta^*)+A(\eta)\\
&=(\eta^*-\eta)^\mathsf T\mathbb E_{Q_{\eta^*}}[T]
-A(\eta^*)+A(\eta)\\
&=D(Q_{\eta^*}\|Q_\eta).
\end{aligned}
$$

Therefore

$$
D(P\|Q_\eta)
=
D(P\|Q_{\eta^*})+D(Q_{\eta^*}\|Q_\eta).
$$

Every departure from the projection incurs an additional nonnegative divergence measured from the projected law. If the exponential family is minimal, $A$ is strictly convex, so the moment-matching solution and the KL projection are unique whenever they exist in the interior. The identity gives precise content to the geometric language of projection and connects likelihood fitting, maximum entropy, and information geometry through one convex objective.

## Scope, Limitations, and Misconceptions

KL divergence is directed. Consider $P=\delta_0$ and $Q=(1-\varepsilon)\delta_0+\varepsilon\delta_1$. Then

$$
D(P\|Q)=-\log(1-\varepsilon),
\qquad
D(Q\|P)=+\infty.
$$

Using $Q$ when $P$ generates data incurs a small penalty for small $\varepsilon$. Using $P$ when $Q$ generates data assigns zero probability to a possible outcome, which creates infinite loss. The asymmetry records a genuine difference between the two prediction problems.

KL divergence does not satisfy the triangle inequality and is not a metric. Symmetrization by $D(P\|Q)+D(Q\|P)$ removes direction, yet it still generally lacks the triangle inequality. When a decision problem requires a bounded symmetric discrepancy, total variation, Hellinger distance, Jensen–Shannon divergence, or another functional may align more closely with the loss being studied.

Small KL divergence controls total variation through Pinsker's inequality,

$$
\|P-Q\|_{\mathrm{TV}}
\le
\sqrt{\frac12D(P\|Q)}.
$$

The reverse implication fails without additional assumptions. Let

$$
P_\varepsilon=(1-\varepsilon,\varepsilon),
\qquad
Q_\varepsilon=(1-\varepsilon e^{-1/\varepsilon^2},
\varepsilon e^{-1/\varepsilon^2}).
$$

Then $\|P_\varepsilon-Q_\varepsilon\|_{\mathrm{TV}}\to0$, while the second coordinate contributes

$$
\varepsilon\log\frac{\varepsilon}
{\varepsilon e^{-1/\varepsilon^2}}
=\frac1\varepsilon
$$

to $D(P_\varepsilon\|Q_\varepsilon)$, so the divergence tends to infinity. Total variation sees the small amount of moved mass; logarithmic loss also sees how severely $Q_\varepsilon$ underestimates that mass.

Finiteness requires more than matching topological supports. Even when $q(x)>0$ wherever $p(x)>0$, the expectation of $\log(p/q)$ may diverge because of tail behavior. Conversely, $D(P\|Q)<\infty$ says little about $D(Q\|P)$. Any argument that differentiates KL, exchanges limits and expectations, or forms local Taylor expansions needs explicit domination, smoothness, and integrability conditions.

The decomposition $D(P\|Q)=H(P,Q)-H(P)$, where $H(P,Q)=-\mathbb E_P[\log q(X)]$ and $H(P)=-\mathbb E_P[\log p(X)]$, is safe for discrete distributions with finite terms. For continuous laws, differential entropy can be negative, infinite, or coordinate-dependent, and the two terms may be undefined even when their difference is well defined. The likelihood-ratio definition should be treated as primary. Cross-entropy and entropy decompositions are convenient derived formulas under conditions that make both terms meaningful.

A further misconception concerns choosing the KL direction by convention. Forward KL, reverse KL, symmetrized KL, and related divergences solve different optimization or testing problems. Maximum likelihood uses $D(P_0\|Q_\theta)$ at the population level because expectations are taken under the data-generating law. Standard variational Bayes uses $D(q\|\pi)$ because that direction turns the unknown log evidence into an additive constant and yields a computable lower bound. The correct direction follows from the objective and from which distribution supplies the expectation.

Estimating KL divergence itself can be substantially harder than using it as a theoretical population criterion. The log density ratio is unbounded near support mismatches, and nonparametric density or density-ratio estimation deteriorates with dimension and weak smoothness. Plug-in estimates can have severe bias when estimated probabilities are small. Finite-sample guarantees therefore require assumptions tailored to the estimator—finite alphabets, lower density bounds, smoothness classes, parametric structure, or direct ratio models. The elegant population identities do not remove these statistical difficulties.

## Synthesis

KL divergence begins with a likelihood ratio. A single observation contributes $\log(dP/dQ)$ units of evidence for $P$ against $Q$; expectation under $P$ turns that random evidence into an average rate. The same expectation is the excess logarithmic prediction loss from using $Q$ when $P$ governs outcomes. This origin explains direction, support sensitivity, logarithmic scaling, and additivity before any abstract properties are invoked.

The Radon–Nikodym definition extends the idea to general probability measures and admits infinite values when $Q$ excludes events possible under $P$. Convexity of $z\log z-z+1$, together with normalization of $dP/dQ$, proves nonnegativity and identifies equality with $P=Q$. Exponential tilting then yields the variational representation, showing that KL is the dual cost of changing measure under a log moment-generating functional.

Factorization of likelihood ratios generates the chain rule. The chain rule yields tensorization for independent samples, data processing for statistics and randomized channels, and exact preservation under sufficient statistics. These conclusions all express one principle: KL measures available discrimination information, and a transformation can retain or discard that information according to whether the likelihood ratio remains recoverable.

In smooth parametric families, normalization kills the first-order term of the KL expansion, and the information identity converts second-order curvature into Fisher information. Consequently, KL is locally quadratic, locally symmetric, and scaled by $I(\theta)$. Tensorization makes the $n^{-1/2}$ local-alternative scale inevitable, linking KL to local asymptotic normality and optimal testing.

The statistical applications preserve this same structure. Maximum likelihood estimates the maximizer of expected log score, equivalently the forward-KL projection of the data-generating law onto a model. Under misspecification, the target remains meaningful and the curvature–variance mismatch produces the sandwich covariance. In simple hypothesis testing, the law of large numbers for the accumulated log-likelihood ratio makes $D(P\|Q)$ the optimal one-sided error exponent. For empirical distributions, combinatorial multiplicity and sampling probability combine to make KL the large-deviation rate function. In variational inference, an exact algebraic decomposition turns reverse KL minimization into ELBO maximization, while forward projection onto an exponential family yields moment matching.

The limitations follow from the mechanism as well. Direction matters because expectations are taken under a specified law. Infinite values arise from impossible events or extreme tail mismatch. Metric intuition can mislead because KL records logarithmic predictive consequences, not geometric displacement alone. Population KL identities also need to be separated from empirical criteria and from the statistical difficulty of estimating density ratios. Once these dependencies are kept explicit, KL divergence becomes a coherent organizing quantity: expected log evidence globally, Fisher information locally, and an optimization or error-rate criterion whenever statistical procedures compare probability laws.

[^shannon1948]: C. E. Shannon, “A Mathematical Theory of Communication,” *Bell System Technical Journal* 27 (1948), 379–423 and 623–656.

[^kl1951]: S. Kullback and R. A. Leibler, “On Information and Sufficiency,” *Annals of Mathematical Statistics* 22, no. 1 (1951), 79–86. DOI: 10.1214/aoms/1177729694.

[^donskervaradhan]: M. D. Donsker and S. R. S. Varadhan, “Asymptotic Evaluation of Certain Markov Process Expectations for Large Time. IV,” *Communications on Pure and Applied Mathematics* 36, no. 2 (1983), 183–212. DOI: 10.1002/cpa.3160360204.

[^white1982]: H. White, “Maximum Likelihood Estimation of Misspecified Models,” *Econometrica* 50, no. 1 (1982), 1–25.

[^chernoff1952]: H. Chernoff, “A Measure of Asymptotic Efficiency for Tests of a Hypothesis Based on the Sum of Observations,” *Annals of Mathematical Statistics* 23, no. 4 (1952), 493–507.

[^sanov1957]: I. N. Sanov, “On the Probability of Large Deviations of Random Magnitudes,” *Matematicheskii Sbornik* 42(84), no. 1 (1957), 11–44.

[^jordan1999]: M. I. Jordan, Z. Ghahramani, T. S. Jaakkola, and L. K. Saul, “An Introduction to Variational Methods for Graphical Models,” *Machine Learning* 37 (1999), 183–233.
