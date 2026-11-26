---
date: 2026-11-25
status: done ✅
publish: true
---
# Mean Field Versus Coarse-Graining

## Executive summary

* **Coarse-graining** changes spatial resolution. Averaging microscopic variables over local volumes produces a smooth field, such as a fluid velocity $\boldsymbol{u}(\boldsymbol{x})$ or local magnetization $m(\boldsymbol{x})$, while keeping domains, walls and correlations on resolved scales.
* **Mean field** is a statistical approximation. It replaces a spin's fluctuating local environment with an average field, discarding correlations between neighbours.
* Because $\tanh$ is nonlinear, $\langle \tanh(h_i/k_B T) \rangle$ and $\tanh(\langle h_i \rangle / k_B T)$ differ in general. When local fields stay non-negative (where $\tanh$ is concave, as in the $2J/0$ example), moving the average inside $\tanh$ overestimates alignment.
* In a Landau–Ginzburg free energy $F[m]$, defining $m(\boldsymbol{x})$ is coarse-graining. Minimizing $F[m]$ without counting thermal fluctuations about the minimum is mean field, even for a spatially varying domain wall.

---

## 1. Coarse-graining changes resolution

In a liquid, molecules sit a fraction of a nanometre apart. As developed in [[Coarse-graining-momentum-to-Cauchy]], averaging molecular velocities over a cell of width $\ell$, much larger than the molecular spacing and much smaller than the flow scale $L$, defines a continuum velocity field $\boldsymbol{u}(\boldsymbol{x})$. This operation does not replace the fluid with one uniform velocity. Eddies, shear layers and other structures well above the cell width $\ell$ remain.

The same step applies to Ising spins on a lattice (see [[Ising-model-primer]] and [[Lecture-Notes/Intro-Soft-Matter/Singularities|Singularities]]). Each site carries $s_i = \pm 1$. Averaging the spins in a local block $B_\ell(\boldsymbol{x})$ of linear size $\ell$ with $a_0 \ll \ell \ll L$ ($a_0$ the lattice spacing and $L$ the system size) gives a local magnetization field,

$$m(\boldsymbol{x}) = \frac{1}{N_\ell}\sum_{i \in B_\ell(\boldsymbol{x})} s_i,$$

with $N_\ell$ sites per block. On scales well above the block size $\ell$, domains of opposite sign remain separate and domain walls stay visible. The *connected* block correlations within a selected phase depend on block separation and decay over the correlation length $\xi$. Coarse-graining shifts the description to a coarser scale. It does not assert that fluctuations above $\ell$ vanish.

---

## 2. Weiss mean field freezes the local environment

Weiss mean-field theory is a different operation.[^weiss1907] On the square lattice ($q = 4$), the Ising energy is

$$E = -J\sum_{\langle ij\rangle} s_i s_j - H\sum_i s_i, \qquad J > 0,$$

with each nearest-neighbour bond counted once and energy bias $H$. At $H = 0$, the terms involving a single spin $s_i$ are

$$E_i = -s_i h_i, \qquad h_i = J\sum_{j \in \mathcal{N}(i)} s_j,$$

where $\mathcal{N}(i)$ denotes the four nearest neighbours of site $i$. The local field $h_i$ varies across the lattice and fluctuates as neighbouring spins flip. A spin with three up neighbours and one down neighbour feels $h_i = 2J$. A spin with two up neighbours and two down feels $h_i = 0$.

Uniform Weiss theory replaces every local field $h_i$ by a single deterministic value set by the mean magnetization $m$ (the average of $s_i$ within one phase):

$$h_i \;\longrightarrow\; h_{\text{MF}} = q J m = 4 J m.$$

The focal spin $s_i$ still fluctuates thermally between $+1$ and $-1$ in contact with the heat bath, so the self-consistent mean spin satisfies $m = \langle s_i \rangle = \tanh(h_{\text{MF}}/k_B T)$. What stops fluctuating is its local field. Both the $2J$ site and the $0$ site are treated as feeling the same static field $4Jm$. Statistically, Weiss theory decouples neighbouring spins by setting $\langle s_i s_j \rangle \approx \langle s_i \rangle \langle s_j \rangle$. That factorization is a statistical approximation, not a change of resolution.

---

## 3. The mean of tanh is not tanh of the mean

Holding the four neighbours of site $i$ fixed at $H = 0$, the conditional thermal average of $s_i$ is exact:

$$\langle s_i \mid h_i \rangle = \frac{e^{h_i/k_B T} - e^{-h_i/k_B T}}{e^{h_i/k_B T} + e^{-h_i/k_B T}} = \tanh\!\left(\frac{h_i}{k_B T}\right).$$

Averaging over all equilibrium neighbour configurations gives the exact identity

$$\langle s_i \rangle = \left\langle \tanh\!\left(\frac{h_i}{k_B T}\right) \right\rangle.$$

Weiss theory moves the average inside the nonlinear function, replacing $\langle \tanh(h_i/k_B T) \rangle$ with $\tanh(\langle h_i \rangle / k_B T)$. At $H = 0$ in a finite symmetric ensemble, both averages vanish by symmetry; the comparison applies within a single ordered phase.

An illustrative distribution over the $2J$ and $0$ neighbour environments shows why these two averages differ. Take equal weights on $h_i = 2J$ (three up, one down) and $h_i = 0$ (two up, two down). The mean local field is $\langle h_i \rangle = \frac{1}{2}(2J) + \frac{1}{2}(0) = J$. Averaging $\tanh$ of the actual local fields gives

$$\left\langle \tanh\!\left(\frac{h_i}{k_B T}\right) \right\rangle = \frac{1}{2}\tanh\!\left(\frac{2J}{k_B T}\right) + \frac{1}{2}\tanh(0) = \frac{1}{2}\tanh\!\left(\frac{2J}{k_B T}\right).$$

Evaluating $\tanh$ at the mean field gives $\tanh(J/k_B T)$. Writing $K = J/(k_B T) > 0$ and using $\tanh(2K) = 2\tanh K / (1 + \tanh^2 K)$ yields

$$\frac{1}{2}\tanh(2K) = \frac{\tanh K}{1 + \tanh^2 K} < \tanh K.$$

At $k_B T = 2J$ ($K = 1/2$), the average of $\tanh$ is $\frac{1}{2}\tanh(1) \approx 0.381$, whereas $\tanh(0.5) \approx 0.462$. In this $2J/0$ distribution, every local field is non-negative. Because $\tanh$ is concave for non-negative arguments, replacing that fluctuating field by its mean overestimates alignment. Sites at a local tie ($h_i = 0$) add no bias, while sites with $h_i = 2J$ already saturate toward $+1$ and cannot compensate.

When local fields take both signs, the comparison can go either way. Replacing the spread of local fields by its mean ignores how the neighbours fluctuate. Four neighbours are too few for their average to be sharp, and near $T_c$ they fluctuate together in patches (see [[Lecture-Notes/Intro-Soft-Matter/Singularities|Singularities]]). Ignoring those fluctuations is why Weiss theory overestimates $T_c$ on the square lattice ($k_B T_c^{\text{MF}} = 4J$ against the exact $k_B T_c \approx 2.269J$; see [[Ising-model-primer]]).

---

## 4. Coarse-graining without mean field, and mean field with space

Uniform Weiss theory uses one number $m$, which makes mean field look synonymous with spatial uniformity and coarse-graining look exact. A spatial Landau–Ginzburg free-energy functional separates the two steps directly.[^chaikin1995]

Keep the leading terms allowed by $m \to -m$ symmetry at $H = 0$ and the lowest-order gradient cost. The result is a truncated effective free energy for the block field in 2D:

$$F[m] = \int \left[ f(m) - \frac{H}{a_0^2} m + \frac{\kappa}{2}|\nabla m|^2 \right] d^2x, \qquad f(m) = a(T - T_0)m^2 + b m^4,$$

with $a, b, \kappa > 0$. Here $f(m)$ is a 2D free-energy density (energy per unit area), $-Hm/a_0^2$ is the bias density for $1/a_0^2$ sites per unit area, and $\kappa$ penalizes spatial gradients of $m(\boldsymbol{x})$. The quadratic term changes sign at $T_0$, the mean-field transition temperature of this functional.

The two operations act in sequence:

1. **Coarse-graining produces $F[m]$.** Summing out spins below scale $\ell$ yields the field $m(\boldsymbol{x})$ and functional $F[m]$. Weighting all field configurations by $e^{-F[m]/k_B T}$ retains long-wavelength fluctuations, which lower the true $T_c$ below $T_0$ and fix the true critical exponents.
2. **Mean field minimizes $F[m]$.** Keeping only the profile that minimizes $F[m]$ under the imposed boundary conditions discards thermal fluctuations about the minimum. Stationarity ($\delta F / \delta m = 0$) also admits unstable profiles (below the transition, the uniform $m = 0$ solution is stationary), and at $H = 0$ the two ordered minima are degenerate.

Minimizing $F[m]$ remains mean field even when $m(\boldsymbol{x})$ varies in space. Consider a flat domain wall below $T_0$ at $H = 0$, where $m = m(x)$ connects the two uniform bulk minima $m(\pm\infty) = \pm m^*$. Setting $f'(m^*) = 0$ fixes the bulk value:

$$(m^*)^2 = \frac{a(T_0 - T)}{2b}.$$

The Euler–Lagrange condition $\delta F/\delta m = 0$ gives

$$\kappa \frac{d^2 m}{dx^2} = f'(m) = -2a(T_0 - T)m + 4b m^3 = 4b m\left[m^2 - (m^*)^2\right].$$

Multiplying by $dm/dx$ and integrating from $x \to -\infty$ (where $m = -m^*$ and $dm/dx = 0$) yields the first integral

$$\frac{\kappa}{2}\left(\frac{dm}{dx}\right)^2 = f(m) - f(m^*) = b\left[m^2 - (m^*)^2\right]^2.$$

Try the wall profile $m(x) = m^*\tanh(x/w)$ with width $w > 0$. One derivative gives

$$\frac{dm}{dx} = \frac{m^*}{w}\operatorname{sech}^2\!\left(\frac{x}{w}\right) = \frac{(m^*)^2 - m^2}{w m^*}.$$

Substituting into $\frac{\kappa}{2}(dm/dx)^2 = b[m^2 - (m^*)^2]^2$ cancels $[m^2 - (m^*)^2]^2$ identically and sets the width:

$$w^2 = \frac{\kappa}{2b(m^*)^2} = \frac{\kappa}{a(T_0 - T)} \quad \Longrightarrow \quad w = \sqrt{\frac{\kappa}{a(T_0 - T)}}.$$

This kink profile varies smoothly in space, and its width $w \propto (T_0 - T)^{-1/2}$ is the mean-field model result (diverging as $T \to T_0^-$). It remains a mean-field solution because it minimizes $F[m]$ subject to $m(\pm\infty) = \pm m^*$ and omits both capillary wandering of the wall and bulk spin fluctuations about $m(x)$.

---

## 5. Two different steps

| Step | What it is | What it keeps | What it discards | Example |
|---|---|---|---|---|
| **Coarse-graining** | Change of resolution (local average over scale $\ell$) | Spatially varying fields, domains, walls and correlations above $\ell$ | Microscopic detail and fluctuations below $\ell$ | Velocity field $\boldsymbol{u}(\boldsymbol{x})$; block field $m(\boldsymbol{x})$ with weight $e^{-F[m]/k_B T}$ |
| **Mean field** | Statistical approximation (decoupling / saddle point) | Response to an average field or a minimizing profile | Local-field fluctuations and fluctuations around the minimum | Weiss $h_i \to 4Jm$; domain wall $m(x) = m^*\tanh(x/w)$ from $\delta F/\delta m = 0$ |

[^weiss1907]: P. Weiss, L'hypothèse du champ moléculaire et la propriété ferromagnétique, J. Phys. Théor. Appl., 6, 661–690 (1907). DOI: [10.1051/jphystap:019070060066100](https://doi.org/10.1051/jphystap:019070060066100).

[^chaikin1995]: P. M. Chaikin & T. C. Lubensky, *Principles of Condensed Matter Physics*, Cambridge University Press (1995). DOI: [10.1017/CBO9780511813467](https://doi.org/10.1017/CBO9780511813467).
