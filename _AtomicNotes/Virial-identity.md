---
modified: 2025-10-30T11:15:33+00:00
type: atomic note
status: done ✅
---
# The Virial Identity: Pairwise Forces → Divergence of Stress

## The Goal

Show that the internal forces (pairwise interactions) can be written as a divergence of a tensor:

$$\boxed{\sum_i \sum_{j \ne i} \boldsymbol{f}_{ij} \, \delta_i = -\nabla \cdot \boldsymbol{C}}$$

where $\boldsymbol{C}$ is the configurational (virial) momentum-flux tensor:

$$\boldsymbol{C}(\boldsymbol{r}, t) = \frac{1}{2} \sum_{i \ne j} \boldsymbol{r}_{ij} \, \boldsymbol{f}_{ij} \int_0^1 \delta(\boldsymbol{r} - \boldsymbol{r}_j - s \boldsymbol{r}_{ij}) \, ds$$

This is the non-obvious bridge from particles to continuum stress.

---

## Why This Matters

In Newton's second law for particle $i$:
$$m_i \dot{\boldsymbol{v}}_i = \boldsymbol{f}_i^{\rm ext} + \sum_{j \ne i} \boldsymbol{f}_{ij}$$

When we sum over all particles and convert to fields, the external forces become $\rho \boldsymbol{b}$ (body force per volume). But what about the internal forces? If we naively write $\sum_i \sum_{j \ne i} \boldsymbol{f}_{ij} \delta_i$, it's a sum of point forces at each particle location—not a divergence of anything.

The miracle: Newton's third law ($\boldsymbol{f}_{ij} = -\boldsymbol{f}_{ji}$) and clever algebra turn this into $-\nabla \cdot \boldsymbol{C}$. This is how internal forces become stress tensors in the continuum description.

---

## The Derivation

### Step 1: Symmetrize the Pair Sum Using Action–Reaction

Start with:
$$\sum_i \sum_{j \ne i} \boldsymbol{f}_{ij} \, \delta_i$$

Rewrite as a sum over *unordered pairs* $(i, j)$ with $i \ne j$:

$$\sum_i \sum_{j \ne i} \boldsymbol{f}_{ij} \, \delta_i = \frac{1}{2} \sum_{i \ne j} \left( \boldsymbol{f}_{ij} \delta_i + \boldsymbol{f}_{ji} \delta_j \right)$$

(We're summing each pair twice, so we divide by 2.)

Use $\boldsymbol{f}_{ij} = -\boldsymbol{f}_{ji}$ (Newton's third law):

$$= \frac{1}{2} \sum_{i \ne j} \boldsymbol{f}_{ij} (\delta_i - \delta_j)$$

> [!tldr] TL;DR
> Each pair force appears twice in the full double sum. We can collect them into a symmetric form: one force acting at particle $i$'s location and its reaction at particle $j$. This is where Newton's third law becomes crucial.

---

### Step 2: The Key Identity — Difference of Deltas as a Divergence

Here's the non-obvious step. For any pair $(i, j)$ with $\boldsymbol{r}_{ij} = \boldsymbol{r}_i - \boldsymbol{r}_j$:

$$\boxed{\delta_i - \delta_j = -\nabla_{\boldsymbol{r}} \cdot \int_0^1 \boldsymbol{r}_{ij} \, \delta(\boldsymbol{r} - \boldsymbol{r}_j - s \boldsymbol{r}_{ij}) \, ds}$$

This is the core identity of this note. Let's prove it.

---

#### Proof of the Key Identity

Define a "path" from particle $j$ to particle $i$:
$$\boldsymbol{R}(s) = \boldsymbol{r}_j + s \boldsymbol{r}_{ij} = \boldsymbol{r}_j + s(\boldsymbol{r}_i - \boldsymbol{r}_j)$$

At $s = 0$: $\boldsymbol{R}(0) = \boldsymbol{r}_j$ (particle $j$).
At $s = 1$: $\boldsymbol{R}(1) = \boldsymbol{r}_i$ (particle $i$).

Define:
$$F(s) = \delta(\boldsymbol{r} - \boldsymbol{R}(s)) = \delta(\boldsymbol{r} - \boldsymbol{r}_j - s \boldsymbol{r}_{ij})$$

Take the derivative w.r.t. $s$:
$$\frac{dF}{ds} = -\boldsymbol{r}_{ij} \cdot \nabla_{\boldsymbol{r}} \delta(\boldsymbol{r} - \boldsymbol{r}_j - s \boldsymbol{r}_{ij})$$

(Using the chain rule: the only $s$-dependence is in the argument of the delta.)

Integrate from $s = 0$ to $s = 1$:
$$\int_0^1 \frac{dF}{ds} \, ds = F(1) - F(0) = \delta_i - \delta_j$$

Substitute the expression for $dF/ds$:
$$\delta_i - \delta_j = -\int_0^1 \boldsymbol{r}_{ij} \cdot \nabla_{\boldsymbol{r}} \delta(\boldsymbol{r} - \boldsymbol{r}_j - s \boldsymbol{r}_{ij}) \, ds$$

Convert to a divergence. Using the vector identity $\boldsymbol{a} \cdot (\nabla f) = \nabla \cdot (\boldsymbol{a} f)$ (when $\boldsymbol{a}$ is constant):
$$\boldsymbol{r}_{ij} \cdot \nabla \delta(\cdots) = \nabla \cdot (\boldsymbol{r}_{ij} \, \delta(\cdots))$$

Therefore:
$$\delta_i - \delta_j = -\nabla \cdot \int_0^1 \boldsymbol{r}_{ij} \, \delta(\boldsymbol{r} - \boldsymbol{r}_j - s \boldsymbol{r}_{ij}) \, ds$$

> [!tldr] TL;DR
> This is the fundamental theorem of calculus applied to deltas along a line segment. We integrate $\frac{dF}{ds}$ from one particle to the other and use the divergence identity to convert the integrand. Out pops a divergence—which is exactly what we need.

---

### Step 3: Apply to Pair Forces

Substitute the identity into the symmetrized sum:
$$\sum_i \sum_{j \ne i} \boldsymbol{f}_{ij} \, \delta_i = \frac{1}{2} \sum_{i \ne j} \boldsymbol{f}_{ij} (\delta_i - \delta_j)$$

$$= -\frac{1}{2} \sum_{i \ne j} \boldsymbol{f}_{ij} \, \nabla \cdot \int_0^1 \boldsymbol{r}_{ij} \, \delta(\boldsymbol{r} - \boldsymbol{r}_j - s \boldsymbol{r}_{ij}) \, ds$$

Factor out the divergence:
$$= -\nabla \cdot \left[ \frac{1}{2} \sum_{i \ne j} \boldsymbol{r}_{ij} \, \boldsymbol{f}_{ij} \int_0^1 \delta(\boldsymbol{r} - \boldsymbol{r}_j - s \boldsymbol{r}_{ij}) \, ds \right]$$

Define the virial tensor:
$$\boxed{\boldsymbol{C}(\boldsymbol{r}, t) = \frac{1}{2} \sum_{i \ne j} \boldsymbol{r}_{ij} \, \boldsymbol{f}_{ij} \int_0^1 \delta(\boldsymbol{r} - \boldsymbol{r}_j - s \boldsymbol{r}_{ij}) \, ds}$$

Result:
$$\boxed{\sum_i \sum_{j \ne i} \boldsymbol{f}_{ij} \, \delta_i = -\nabla \cdot \boldsymbol{C}}$$

---

> [!summary] Take-home message
> Newton's third law says $\boldsymbol{f}_{ij} = -\boldsymbol{f}_{ji}$. So we can pair up forces: $\boldsymbol{f}_{ij}(\delta_i - \delta_j)$ is a force at $i$ minus its reaction at $j$. Now, the difference of two deltas can be written as a divergence along the bond connecting them—that's the calculus step. When we take a divergence, we 'smear' the pair force uniformly along the bond, and the divergence recovers the point forces at the ends. This is how pair forces become components of a stress tensor.

---

## Physical Interpretation: Bonds Carry Stress

Imagine a microscopic 'bond' connecting particles $i$ and $j$:

$$\text{Force on bond} = \boldsymbol{f}_{ij}$$

$$\text{Distance along bond} = \boldsymbol{r}_{ij}$$

The virial tensor $\boldsymbol{C}$ represents this:
- Each bond contributes a dyadic product $\boldsymbol{r}_{ij} \boldsymbol{f}_{ij}$ (position times force).
- The integral $\int_0^1 \delta(\boldsymbol{r} - \boldsymbol{r}_j - s\boldsymbol{r}_{ij}) ds$ "smears" this contribution uniformly along the bond.
- When we take a divergence, we recover the traction (force per unit area) on surfaces within the fluid.

Example: Central forces. If $\boldsymbol{f}_{ij} \parallel \boldsymbol{r}_{ij}$ (force along the line connecting the particles), then $\boldsymbol{r}_{ij} \boldsymbol{f}_{ij}$ is a symmetric dyad, and the virial tensor contributes to an *isotropic* stress (like pressure).

Non-central forces (with components perpendicular to the bond) contribute to *anisotropic* stresses, including shear.

---

## Component Form

In index notation, the pair force contribution to the momentum balance is:
$$f_\alpha^{(\text{int})} = -\partial_\beta C_{\alpha\beta}$$

where
$$C_{\alpha\beta} = \frac{1}{2} \sum_{i \ne j} r_{ij,\alpha} \, f_{ij,\beta} \int_0^1 \delta(\boldsymbol{r} - \boldsymbol{r}_j - s\boldsymbol{r}_{ij}) \, ds$$

This is the configurational part of the stress tensor. Together with the kinetic part ($\boldsymbol{K}$ from [[Dyadic-conversion]]), it forms the total microscopic stress $\boldsymbol{\Pi} = \boldsymbol{K} + \boldsymbol{C}$.

---

## Symmetry of the Stress Tensor

Theorem: If all forces are central (i.e., $\boldsymbol{f}_{ij} \parallel \boldsymbol{r}_{ij}$), then the Cauchy stress tensor $\boldsymbol{\sigma}$ is symmetric: $\sigma_{\alpha\beta} = \sigma_{\beta\alpha}$.

Proof sketch: For central forces, $\boldsymbol{r}_{ij} \boldsymbol{f}_{ij}$ is symmetric (the outer product of two parallel vectors). The kinetic part $\boldsymbol{K}$ is automatically symmetric (it's $m v_\alpha v_\beta$). So $\boldsymbol{\Pi} = \boldsymbol{K} + \boldsymbol{C}$ is symmetric, and hence $\boldsymbol{\sigma}$ is symmetric.

Why it matters: Symmetric stress is a consequence of angular momentum conservation. If the stress weren't symmetric, rotational torques wouldn't be balanced.

---

## Summary: The Bridge from Particles to Continuum

| Level | Quantity | Equation |
|---|---|---|
| Particles | Force on particle $i$ | $m_i \dot{\boldsymbol{v}}_i = \boldsymbol{f}_i^{\rm ext} + \sum_{j \ne i} \boldsymbol{f}_{ij}$ |
| Fields (microscopic) | Momentum density | $\partial_t \boldsymbol{g} + \nabla \cdot \boldsymbol{\Pi} = \rho \boldsymbol{b}$ |
| | | where $\boldsymbol{\Pi} = \boldsymbol{K} + \boldsymbol{C}$ |
| Fields (coarse-grained) | Momentum per volume | $\rho \frac{D\boldsymbol{v}}{Dt} = \nabla \cdot \boldsymbol{\sigma} + \rho \boldsymbol{b}$ |
| | | where $\boldsymbol{\sigma} = -(\overline{\boldsymbol{K}} - \rho \boldsymbol{v}\boldsymbol{v}) - \overline{\boldsymbol{C}}$ |

The virial identity is the mathematical machinery that takes us from discrete pair forces to a continuous stress field.

---

## Derivation Summary

1. Symmetrize the pair force sum using $\boldsymbol{f}_{ij} = -\boldsymbol{f}_{ji}$.
2. Use the key identity: $\delta_i - \delta_j = -\nabla \cdot \int \boldsymbol{r}_{ij} \delta(\cdots) ds$ (follows from FTC).
3. Recognize as a divergence: $\sum_i \sum_{j \ne i} \boldsymbol{f}_{ij} \delta_i = -\nabla \cdot \boldsymbol{C}$.

Each step is mathematically rigorous and physically motivated. No approximations until we ensemble-average.

---
