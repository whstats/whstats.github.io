---
title: Sub-Gaussian Tail Bounds
description: An intuitive introduction to sub-Gaussian tails through large deviations, sample means, and high-dimensional maxima.
tags:
  - probability
  - concentration
  - high-dimensional-statistics
---

The origin of the sub-Gaussian tail can be understood through a concrete question.

Given a random variable $X$, we want to control the large-deviation event

$$
\Pr(|X-\mathbb EX|>t).
$$

The normal distribution provides the classical example of a rapidly decaying tail. If $Z\sim N(0,\sigma^2)$, then

$$
\Pr(|Z|>t)\lesssim \exp\!\left(-\frac{t^2}{2\sigma^2}\right).
$$

Random variables with the same type of quadratic exponential decay,

$$
\boxed{\Pr(|X-\mathbb EX|>t)\le C e^{-c t^2}},
$$

are said to have a **sub-Gaussian tail**. What matters here is the rate at which the tail decays; $X$ itself does not need to follow a normal distribution. Many bounded random variables, including Bernoulli and Rademacher variables, are sub-Gaussian.

Sub-Gaussian tails arise whenever we ask how far a random error can deviate from its mean.

## Sample Means: How Error Shrinks with Sample Size

The sample mean is the most common example. If $X_1,\dots,X_n$ are independent and sub-Gaussian, then typically

$$
\Pr\left(
|\bar X-\mu|>t
\right)
\lesssim
e^{-cnt^2}.
$$

Consequently,

$$
|\bar X-\mu|
=
O_{\mathbb P}\left(\frac1{\sqrt n}\right).
$$

More precisely, with probability at least $1-\delta$,

$$
|\bar X-\mu|
\lesssim
\sqrt{\frac{\log(1/\delta)}{n}}.
$$

This is why sub-Gaussian tails appear naturally in Hoeffding's inequality, Chernoff bounds, and concentration inequalities.

## High-Dimensional Maxima: Why $\sqrt{\log p}$ Appears

Another recurring setting is the maximum of many random errors in high-dimensional statistics. Suppose we estimate $p$ parameters simultaneously and the error in each coordinate is sub-Gaussian:

$$
\Pr(|X_j|>t)\lesssim e^{-ct^2}.
$$

By the union bound,

$$
\Pr\left(\max_{1\le j\le p}|X_j|>t\right)
\lesssim
p e^{-ct^2}.
$$

Choosing $t$ so that the right-hand side is small gives

$$
\boxed{\max_j |X_j|\sim \sqrt{\log p}}.
$$

This explains why the rate

$$
\sqrt{\frac{\log p}{n}}
$$

appears repeatedly in the Lasso, multiple testing, random matrix theory, and high-dimensional regression: its probabilistic origin is often a sub-Gaussian tail bound.

## The Main Thread

The central idea is

$$
\boxed{
\text{Gaussian }e^{-t^2}\text{ tails}
\;\longrightarrow\;
\text{the sub-Gaussian class}
\;\longrightarrow\;
\text{control of random sums, sample means, and high-dimensional maxima}
}.
$$

## What Comes Next

The next question worth understanding is: **Why does an MGF condition automatically imply an $e^{-ct^2}$ tail?** The answer is the Chernoff method, which is the technical engine behind sub-Gaussian theory.
