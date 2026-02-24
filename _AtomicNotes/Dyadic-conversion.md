---
type: atomic note
status: done ✅
publish: true
---
# Converting Velocity-Delta Products to Divergences of Dyads

## The Problem

When we compute $\partial_t \boldsymbol{g}$ (the time derivative of momentum density), we get:

$$\partial_t \boldsymbol{g} = \sum_i m_i \, \dot{\boldsymbol{v}}_i \, \delta_i + \sum_i m_i \, \boldsymbol{v}_i \, \partial_t \delta_i$$

The first term is easy (acceleration). The second term involves $\boldsymbol{v}_i \, \partial_t \delta_i$, which looks messy. This note shows how to turn it into a clean divergence of a dyadic tensor.

---

## The Goal

Show that:
$$\boxed{\sum_i m_i \, \boldsymbol{v}_i \, \partial_t \delta_i = -\nabla \cdot \sum_i m_i \, \boldsymbol{v}_i \boldsymbol{v}_i \, \delta_i}$$

where $\boldsymbol{v}_i \boldsymbol{v}_i$ is the outer product (dyad): in components, $(\boldsymbol{v}_i \boldsymbol{v}_i)_{\alpha\beta} = v_{i\alpha} v_{i\beta}$.

---

## The Derivation — Three Steps

### Step 1: Use the moving delta identity

From [[Moving-Delta-identity|The moving delta identity]], we have:
$$\partial_t \delta_i = -\boldsymbol{v}_i \cdot \nabla_{\boldsymbol{r}} \delta_i$$

Substitute:
$$\sum_i m_i \, \boldsymbol{v}_i \, \partial_t \delta_i = -\sum_i m_i \, \boldsymbol{v}_i \, (\boldsymbol{v}_i \cdot \nabla_{\boldsymbol{r}} \delta_i)$$

---

### Step 2: The Key Insight — $\nabla_{\boldsymbol{r}}$ Does Not Act on $\boldsymbol{v}_i$

This is crucial: When we write $\nabla_{\boldsymbol{r}}$, we mean the gradient with respect to the *field coordinate* $\boldsymbol{r}$ (the spatial point where we observe the field).

- $\boldsymbol{v}_i(t) = \dot{\boldsymbol{r}}_i(t)$ is the Lagrangian velocity of particle $i$. It depends on the particle index $i$ and time $t$, but *not* on the field coordinate $\boldsymbol{r}$.
- When we take $\nabla_{\boldsymbol{r}}$ of something, we differentiate only w.r.t. $\boldsymbol{r}$.
- Therefore: $\nabla_{\boldsymbol{r}} \boldsymbol{v}_i = 0$.

> [!tldr] TL;DR
> Treat $\boldsymbol{v}_i(t)$ as a *constant vector* when we're doing spatial derivatives. The only spatial dependence is in the delta spikes.

---

### Step 3: Convert to Divergence of Dyad

Use the vector identity: For any constant vector $\boldsymbol{c}$ and any scalar field $f(\boldsymbol{r})$:
$$\boldsymbol{c} (\boldsymbol{c} \cdot \nabla f) = \nabla \cdot (\boldsymbol{c} \boldsymbol{c} \, f)$$

Why? Use the product rule on the RHS:
$$\nabla \cdot (\boldsymbol{c} \boldsymbol{c} \, f) = (\nabla \cdot \boldsymbol{c} \boldsymbol{c}) f + \boldsymbol{c} \boldsymbol{c} : \nabla f$$

The first term vanishes (the divergence of a constant dyad is zero), so:
$$\nabla \cdot (\boldsymbol{c} \boldsymbol{c} \, f) = \boldsymbol{c} \boldsymbol{c} : \nabla f = \boldsymbol{c}(\boldsymbol{c} \cdot \nabla f)$$

(Here $:$ denotes the double-dot product: $\boldsymbol{A} : \nabla f = A_{\alpha\beta} \partial_\beta f$ summed over $\alpha, \beta$.)

Apply with $\boldsymbol{c} = \boldsymbol{v}_i$ and $f = \delta_i$:
$$\boldsymbol{v}_i (\boldsymbol{v}_i \cdot \nabla \delta_i) = \nabla \cdot (\boldsymbol{v}_i \boldsymbol{v}_i \, \delta_i)$$

Substitute back:
$$\sum_i m_i \, \boldsymbol{v}_i \, \partial_t \delta_i = -\sum_i m_i \, \nabla \cdot (\boldsymbol{v}_i \boldsymbol{v}_i \, \delta_i) = -\nabla \cdot \sum_i m_i \, \boldsymbol{v}_i \boldsymbol{v}_i \, \delta_i$$

---

## Component View (for those who prefer indices)

In index notation: Let $\delta_i = \delta(\boldsymbol{r} - \boldsymbol{r}_i)$. Then:

$$\partial_t g_\alpha = \sum_i m_i \, \dot{v}_{i\alpha} \delta_i + \sum_i m_i \, v_{i\alpha} \, \partial_t \delta_i$$

Use $\partial_t \delta_i = -v_{i\beta} \partial_\beta \delta_i$:

$$\sum_i m_i \, v_{i\alpha} \, \partial_t \delta_i = -\sum_i m_i \, v_{i\alpha} v_{i\beta} \, \partial_\beta \delta_i = -\partial_\beta \left( \sum_i m_i \, v_{i\alpha} v_{i\beta} \, \delta_i \right)$$

Define the kinetic momentum-flux tensor (as a matrix):
$$K_{\alpha\beta}(\boldsymbol{r}, t) = \sum_i m_i \, v_{i\alpha} v_{i\beta} \, \delta_i$$

Then:
$$\partial_t g_\alpha + \partial_\beta K_{\alpha\beta} = \sum_i m_i \, \dot{v}_{i\alpha} \, \delta_i$$

Or in vector form:
$$\partial_t \boldsymbol{g} + \nabla \cdot \boldsymbol{K} = \sum_i m_i \, \dot{\boldsymbol{v}}_i \, \delta_i$$

---

## Interpretation: What is the Kinetic Momentum Flux?

$$\boldsymbol{K}_{\alpha\beta} = \sum_i m_i \, v_{i\alpha} v_{i\beta} \, \delta_i$$

Physical meaning: This tensor describes the *transport of momentum* due to particle motion.

- Diagonal component $K_{xx}$ = flux of $x$-momentum in the $x$-direction (normal stress)
- Off-diagonal component $K_{xy}$ = flux of $x$-momentum in the $y$-direction (shear)

When particles move with velocity $\boldsymbol{v}$, they carry momentum $m\boldsymbol{v}$ with them. If the velocity varies from point to point (e.g., shear flow), then momentum fluxes arise—and those are captured by $\boldsymbol{K}$.

Example (1D, shear flow):
If $v_x(y) = \dot{\gamma} y$ (linear shear), then:
- Particles at height $y$ move faster than particles at height $y - \lambda$.
- Fast particles carry momentum downward and slow particles carry momentum upward.
- The net *transport* of $x$-momentum in the $y$-direction is $\boldsymbol{K}_{xy}$.
- This is exactly where viscosity comes from! (See [[2-What-is-Viscosity]].)

---

## Common Confusion: Why Is This a Dyad, Not a Vector?

Question: $\boldsymbol{v}_i$ is a vector. Why does $\boldsymbol{v}_i \boldsymbol{v}_i$ (the outer product) give a tensor?

Answer: When we write $\boldsymbol{v}_i \boldsymbol{v}_i$ in bold, it's shorthand for the outer product. The component form makes it clear:
$$(\boldsymbol{v}_i \boldsymbol{v}_i)_{\alpha\beta} = v_{i\alpha} \, v_{i\beta}$$

This is a 3×3 matrix (or 2×2 in 2D). When we take the divergence $\nabla \cdot \boldsymbol{K}$, we get:
$$(\nabla \cdot \boldsymbol{K})_\alpha = \partial_\beta K_{\alpha\beta} = \partial_\beta \left( \sum_i m_i v_{i\alpha} v_{i\beta} \delta_i \right)$$

which is a vector (summing over the second index).

---

## Summary

| Term | Type | Meaning |
|---|---|---|
| $\boldsymbol{v}_i(t)$ | Vector | Particle velocity (doesn't depend on field point $\boldsymbol{r}$) |
| $\nabla_{\boldsymbol{r}}$ | Operator | Gradient w.r.t. field coordinate $\boldsymbol{r}$ |
| $\boldsymbol{v}_i \boldsymbol{v}_i$ | Dyad (tensor) | Outer product; components $(v_{i\alpha} v_{i\beta})$ |
| $\boldsymbol{K} = \sum_i m_i \boldsymbol{v}_i \boldsymbol{v}_i \delta_i$ | Tensor field | Kinetic momentum-flux density |
| $\nabla \cdot \boldsymbol{K}$ | Vector field | Momentum transport due to bulk and thermal motion |

---

## The Takeaway

> [!tldr] Summary
> The key algebraic move is recognizing that $\boldsymbol{v}_i (\boldsymbol{v}_i \cdot \nabla \delta_i)$ can be rewritten as $\nabla \cdot (\boldsymbol{v}_i \boldsymbol{v}_i \delta_i)$ because $\boldsymbol{v}_i$ is constant w.r.t. the field gradient $\nabla_{\boldsymbol{r}}$.
> 
> This gives the microscopic momentum-flux tensor $\boldsymbol{K}$, which—when averaged—contains both thermal and bulk contributions to stress.

---
