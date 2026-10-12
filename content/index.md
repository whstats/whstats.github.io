---
title: Notes on Statistics
description: A public notebook on concentration, information, regularization, and nonparametric estimation.
---

A public notebook for a small set of ideas that recur across modern statistics. Each note begins with the controlling intuition, then makes the assumptions, result, and proof mechanism explicit.

> [!remark] The working principle
> Definitions should explain what is controlled. Theorems should explain why that control is useful. Proofs should reveal the one step that does the real work.

## Start here

**Probability and information** — the tools that control random error.

1. [[sub-gaussian-tail-bounds|Sub-Gaussian Tails]] — turn moment-generating-function control into exponentially small tail probabilities.
2. [[kullback_leibler_divergence|Kullback–Leibler Divergence]] — read divergence as expected log-likelihood evidence, with local Fisher geometry.

**Regularization and approximation** — how to estimate when the model is large.

3. [[penalized-regression|Penalized Regression]] — ridge, the lasso, and why restricted curvature yields high-dimensional error rates.
4. [[b-splines-in-statistics|B-Splines in Statistics]] — local polynomial bases, spline-space geometry, and penalized smoothing.
5. [[sieve-estimation|Sieve Estimation]] — balance approximation error against stochastic complexity as the model grows with the sample.

**Function estimation** — structured models for unknown functions.

6. [[additive-models|Additive Models]] — projection geometry, backfitting, and rates that escape the curse of dimensionality.
7. [[gaussian-processes|Gaussian Processes]] — covariance kernels, conditioning, and RKHS geometry for Bayesian function estimation.

## What lives here

The notes are concise rather than encyclopedic. Every page separates the core idea from the technical setup, states the assumptions next to the step that needs them, and records the common convention traps.

Browse all seven notes, with summaries and reading times, in [[topics|Topics]].

## Status

This is a living public notebook. Statements are written to be self-contained, but individual pages may be refined as their connections become clearer.
