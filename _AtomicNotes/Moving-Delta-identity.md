---
modified: 2025-10-30T11:37:37+00:00
type: atomic note
status: done ✅
publish: true
---
# The Moving Delta Identity

## The Key Formula

$$\boxed{\partial_t \delta_i(\boldsymbol{r}, t) = -\dot{\boldsymbol{r}}_i(t) \cdot \nabla_{\boldsymbol{r}} \delta(\boldsymbol{r} - \boldsymbol{r}_i(t)) = -\boldsymbol{v}_i \cdot \nabla_{\boldsymbol{r}} \delta_i}$$

> [!tldr] Advection of spikes
> The time rate of change of a delta spike (at a fixed observation point $\boldsymbol{r}$) equals minus the spatial gradient of the spike, weighted by the spike's velocity.

---

## Why This Matters

This identity is the entire bridge from particle dynamics to continuum field equations. When you have microscopic density $\rho = \sum_i m_i \delta_i$ and momentum $\boldsymbol{g} = \sum_i m_i \boldsymbol{v}_i \delta_i$, the moving delta identity lets you convert time derivatives into spatial divergences—exactly what you need for PDEs.

---

## Three Ways to Justify It

### (1) Chain Rule Picture — The Physicist's Proof

Setup: Let $\boldsymbol{s}(\boldsymbol{r}, t) = \boldsymbol{r} - \boldsymbol{r}_i(t)$ be the vector from the particle to the observation point.

Key observation: The delta is a function of $\boldsymbol{s}$, not explicitly of $\boldsymbol{r}$ or $t$ separately:
$$\delta_i(\boldsymbol{r}, t) = \delta(\boldsymbol{s}(\boldsymbol{r}, t)) = \delta(\boldsymbol{r} - \boldsymbol{r}_i(t))$$

Apply chain rule:
$$\partial_t \delta_i = \nabla_{\boldsymbol{s}} \delta(\boldsymbol{s}) \cdot \partial_t \boldsymbol{s}$$

Compute the time derivative of $\boldsymbol{s}$:
$$\partial_t \boldsymbol{s} = \partial_t(\boldsymbol{r} - \boldsymbol{r}_i(t)) = 0 - \dot{\boldsymbol{r}}_i(t) = -\boldsymbol{v}_i(t)$$

(The gradient $\nabla_{\boldsymbol{r}}$ has no time dependence; only the position $\boldsymbol{r}_i(t)$ changes.)

Substitute:
$$\partial_t \delta_i = \nabla_{\boldsymbol{s}} \delta(\boldsymbol{s}) \cdot (-\boldsymbol{v}_i) = -\boldsymbol{v}_i \cdot \nabla_{\boldsymbol{r}} \delta(\boldsymbol{r} - \boldsymbol{r}_i)$$

The intuition: It's just the chain rule. The only time-dependence in the delta is through the particle position $\boldsymbol{r}_i(t)$, so $\partial_t \delta$ picks up the rate at which that argument is changing.

---

### (2) Distribution / Test-Function Proof — The Rigorous Way

For a Dirac delta to be well-defined, we test it against smooth functions. For any smooth function $\varphi(\boldsymbol{r})$:

$$\int_{\text{all space}} \varphi(\boldsymbol{r}) \, \partial_t \delta_i(\boldsymbol{r}, t) \, d^3\boldsymbol{r} = ?$$

Apply the definition of $\partial_t \delta_i$:
$$= \frac{d}{dt} \int \varphi(\boldsymbol{r}) \, \delta_i(\boldsymbol{r}, t) \, d^3\boldsymbol{r} = \frac{d}{dt} \varphi(\boldsymbol{r}_i(t))$$

Use the chain rule on the RHS:
$$\frac{d}{dt} \varphi(\boldsymbol{r}_i(t)) = \nabla \varphi(\boldsymbol{r}_i) \cdot \dot{\boldsymbol{r}}_i = \boldsymbol{v}_i \cdot \nabla \varphi(\boldsymbol{r}_i)$$

Use integration by parts on $\int \varphi \, (-\boldsymbol{v}_i \cdot \nabla \delta_i)$ (assuming no boundary terms):
$$\int \varphi \, (-\boldsymbol{v}_i \cdot \nabla \delta_i) \, d^3\boldsymbol{r} = -\int (\boldsymbol{v}_i \cdot \nabla \varphi) \, \delta_i \, d^3\boldsymbol{r} = -\boldsymbol{v}_i \cdot \nabla \varphi(\boldsymbol{r}_i)$$

Compare: Both sides give the same result for any test function $\varphi$. Therefore, as distributions:
$$\partial_t \delta_i = -\boldsymbol{v}_i \cdot \nabla \delta_i$$

The key insight: A delta's 'value' is defined by how it acts on test functions. When you test both sides against $\varphi$, you get the same answer—so the distributions are equal.

---

### (3) One-Dimensional Sanity Check

Consider a 1D moving spike: $\rho(x, t) = \delta(x - x_i(t))$ with $x_i(t) = vt$ (constant velocity).

Sketch it:
```
t = 0:        t = Δt:       t = 2Δt:
    ↓             ↓             ↓
    |             |             |
    x = 0         x = vΔt       x = 2vΔt
```

What you observe at a fixed point $x$:
- If the spike hasn't arrived yet ($x < vt$): $\rho(x, t) = 0$ and $\partial_t \rho(x, t) = 0$.
- Just *before* the spike arrives: the slope of $\delta$ is *negative* (falling off to the left), so $-v \partial_x \delta > 0$. And you're about to see the spike, so $\partial_t \rho > 0$. [OK]
- Just *after* the spike passes: the slope is *positive* (rising to the right, but the spike has moved past), so $-v \partial_x \delta < 0$. And the spike is gone, so $\partial_t \rho < 0$. [OK]

The sign checks out: $\partial_t \delta = -v \partial_x \delta$.

The physical picture: At a fixed $x$, the spike moves past you. The time change you see is opposite to the spatial slope it leaves behind. A negative slope means the spike is moving away (future: negative change). A positive slope means it's approaching (future: positive change).

---

## Common Pitfalls & Clarifications

### Pitfall 1: "Why the minus sign?"

The question: Why isn't it just $\partial_t \delta_i = \boldsymbol{v}_i \cdot \nabla \delta_i$?

The answer: Because $\partial_t(\boldsymbol{r} - \boldsymbol{r}_i) = -\dot{\boldsymbol{r}}_i$. The argument of the delta is *position relative to the particle*, so when the particle moves forward, the argument moves backward. The minus sign accounts for this reversal.

---

### Pitfall 2: "Shouldn't $\nabla$ act on $\boldsymbol{v}_i$ too?"

The question: When you write $\partial_t \delta_i = -\boldsymbol{v}_i \cdot \nabla \delta_i$, why doesn't the gradient hit the velocity?

The answer: $\nabla$ is the Eulerian gradient—it differentiates w.r.t. the field coordinate $\boldsymbol{r}$, not w.r.t. the particle position $\boldsymbol{r}_i$. The velocity $\boldsymbol{v}_i = \dot{\boldsymbol{r}}_i(t)$ is a *Lagrangian* quantity (it depends on $t$ and the particle index $i$, not on the field point $\boldsymbol{r}$). So $\nabla_{\boldsymbol{r}} \boldsymbol{v}_i = 0$. See [[Lecture2-DyadicConversion|the dyadic note]] for more on this distinction.

---

### Pitfall 3: "This is just kinematics, right?"

Yes! This identity has nothing to do with physics—it's pure mathematics. It holds for *any* moving spike, whether the particle is a gas molecule, a dust grain, or a labeled point in a flow. The physics comes in when you specify what equation the particle obeys (Newton's law, Langevin equation, etc.).

---

## Using the Identity: Example — Mass Continuity

Given:
$$\rho(\boldsymbol{r}, t) = \sum_i m_i \, \delta_i(\boldsymbol{r}, t), \quad \boldsymbol{g}(\boldsymbol{r}, t) = \sum_i m_i \, \boldsymbol{v}_i(t) \, \delta_i(\boldsymbol{r}, t)$$

Compute $\partial_t \rho$:
$$\partial_t \rho = \sum_i m_i \, \partial_t \delta_i = -\sum_i m_i \, \boldsymbol{v}_i \cdot \nabla \delta_i$$

Factor out the gradient (it's linear and acts only on $\boldsymbol{r}$):
$$\partial_t \rho = -\nabla \cdot \sum_i m_i \, \boldsymbol{v}_i \, \delta_i = -\nabla \cdot \boldsymbol{g}$$

Result:
$$\boxed{\partial_t \rho + \nabla \cdot \boldsymbol{g} = 0}$$

This is the microscopic continuity equation. No approximation—it's exact for point particles. The moving delta identity is the entire algebra.

---

## Summary: Comparison of the Three Approaches

| Approach | Benefits | Trade-offs |
|---|---|---|
| Chain rule (physicists) | Intuitive, fast, gets the sign right | Glosses over distribution theory |
| Test function (rigorous) | Mathematically airtight, generalizes to broader contexts | More abstract, harder to visualize |
| 1D sketch (pedagogical) | Great for intuition, builds confidence | Only works in 1D; requires careful visualization |

For deep understanding: Work through all three approaches. The chain rule provides speed and intuition, the test function approach ensures mathematical rigor, and the 1D sketch offers a concrete gut check.

---
