---
date: 2026-11-25
status: done ✅
publish: true
---
# A Primer on the Ising Model

## Executive summary

* On a square lattice of $N$ sites, spins $s_i = \pm 1$ couple to their $q = 4$ nearest neighbours through $E = -J\sum_{\langle ij\rangle} s_i s_j - H\sum_i s_i$ ($J > 0$). Flipping one spin changes the energy by $\Delta E = 2 s_i (J\sum_j s_j + H)$.
* High temperature favours disorder because disordered configurations vastly outnumber aligned ones. At $H = 0$, both fully aligned configurations still have the lowest energy and highest single-state Boltzmann weight; with $H \neq 0$, only the state aligned with the bias has the lowest energy.
* On any finite lattice with spin-flip-symmetric boundaries (such as periodic ones) at $H = 0$, global spin-flip symmetry forces $\langle m \rangle = 0$ at all temperatures. Low-temperature order appears in $\langle m^2 \rangle$ or within one selected phase.
* On the square lattice at $H = 0$, Weiss mean field gives $k_B T_c/J = 4$ and $\beta = 1/2$, whereas the exact infinite 2D solution gives $k_B T_c/J = 2/\ln(1 + \sqrt{2}) \approx 2.269$ and $\beta = 1/8$.

---

## 1. Lattice, energy and flip costs

The Ising model is the simplest lattice model of a cooperative phase transition. Each of the $N$ sites on a square lattice with periodic boundaries carries $s_i = \pm 1$, so every site has $q = 4$ nearest neighbours and global spin-flip symmetry ($s_i \to -s_i$) holds at $H = 0$. The energy of a configuration $\{s_i\}$ is

$$E = -J\sum_{\langle ij\rangle} s_i s_j - H\sum_i s_i,$$

where $J > 0$ favours alignment, $H$ is an energy bias favouring $s_i = +1$ when $H > 0$, and the first sum counts each nearest-neighbour pair $\langle ij\rangle$ once. The magnetization per site is

$$m = \frac{1}{N}\sum_{i=1}^{N} s_i,$$

running from $-1$ to $+1$. Mappings from this energy to the lattice gas and binary mixtures are given in [[Lecture-Notes/Intro-Soft-Matter/Singularities|Singularities]].

Aligned pairs ($s_i s_j = +1$) contribute $-J$ and misaligned pairs ($s_i s_j = -1$) contribute $+J$, so breaking one bond costs $2J$. Flipping $s_i \to -s_i$ changes only its four incident bonds and field energy:

$$\Delta E = 2 s_i \left( J\sum_{j \in \mathcal{N}(i)} s_j + H \right),$$

where $\mathcal{N}(i)$ denotes the four neighbours of site $i$. At $H = 0$, $\Delta E = 2 J s_i \sum_{j \in \mathcal{N}(i)} s_j$:

* **Three aligned, one opposed** ($s_i \sum_j s_j = 2$): flipping breaks three bonds and heals one, costing $\Delta E = 4J$.
* **Four aligned** ($s_i \sum_j s_j = 4$, inside a uniform domain): flipping breaks all four bonds and costs $\Delta E = 8J$, matching [[Lecture-Notes/Intro-Soft-Matter/Singularities|Singularities]].
* **Two aligned, two opposed** ($s_i \sum_j s_j = 0$): the broken-bond count stays fixed, so $\Delta E = 0$.

---

## 2. Boltzmann weights and multiplicity

At temperature $T$, each configuration occurs with Boltzmann probability

$$P(\{s_i\}) = \frac{1}{Z}\,e^{-E(\{s_i\})/k_B T}, \qquad Z = \sum_{\{s_i\}} e^{-E(\{s_i\})/k_B T}.$$

At $H = 0$ and every $T > 0$, the two fully aligned ground states ($m = \pm 1$) individually carry the highest probability of any single configuration (for $H > 0$, the all-up state alone). High temperature does not lower the energy of disordered states.

Disorder wins by counting. Grouping configurations by energy $E$ weights each level by its multiplicity $\Omega(E)$ times its Boltzmann factor:

$$P(E) = \frac{1}{Z}\,\Omega(E)\,e^{-E/k_B T} = \frac{1}{Z}\,\exp\!\left(-\frac{E - T S(E)}{k_B T}\right), \qquad S(E) = k_B \ln \Omega(E).$$

At $H = 0$, a configuration with $B$ broken bonds carries Boltzmann weight $e^{-2JB/(k_B T)}$ relative to either ground state. At fixed $N$, as $T \to 0$ every configuration with $B > 0$ is suppressed and the two ground states dominate; as $T \to \infty$, $e^{-2JB/(k_B T)} \to 1$ so all $2^N$ configurations become equally likely. Counting by magnetization makes the same point: for even $N$, only two states have $m = \pm 1$, whereas $\binom{N}{N/2} \sim 2^N / \sqrt{\pi N/2}$ states have $m = 0$ (about $10^{299}$ states for $N = 1000$), so when all configurations carry nearly equal weight, nearly all probability concentrates around $m = 0$.

---

## 3. Regimes across $T_c$ and finite-size symmetry

At $H = 0$, the equilibrium structure changes sharply across $T_c$:

* **Above $T_c$:** Spin correlations are short-ranged, decaying over a finite correlation length $\xi$ (a lattice spacing or two far from $T_c$).
* **At $T_c$:** Aligned clusters span every scale from one lattice spacing to the box size, $\xi$ diverges in the infinite-lattice limit, and spin correlations decay algebraically (as a power of distance).
* **Below $T_c$:** Two symmetry-related ordered phases coexist at $H = 0$, with magnetizations $+m^*$ and $-m^*$ and small minority islands fluctuating inside each phase; the two-point spin correlation function $\langle s_i s_j \rangle$ tends to $(m^*)^2$ at large separation.

On any finite lattice with spin-flip-symmetric boundaries (such as periodic ones) at $H = 0$, inverting every spin ($s_i \to -s_i$) preserves $E$ while sending $m \to -m$. Both states have identical Boltzmann weight, so the exact zero-field ensemble average vanishes at all temperatures:

$$\langle m \rangle = 0 \qquad \text{for all } T > 0.$$

In sufficiently large systems below $T_c$, the distribution of $m$ splits into two resolved peaks near $+m^*$ and $-m^*$ that cancel in $\langle m \rangle$. Order appears in an even observable such as $\langle m^2 \rangle$ (or $\langle |m| \rangle$), or within one selected phase obtained by taking $N \to \infty$ at small $H > 0$ before letting $H \to 0^+$.

---

## 4. Weiss mean field and the Landau landscape

Replacing the fluctuating neighbour sum by its mean, $J\sum_{j \in \mathcal{N}(i)} s_j \to qJm$, puts one spin in an effective field $qJm + H$.[^weiss1907] Self-consistency gives

$$m = \tanh\!\left(\frac{qJm + H}{k_B T}\right).$$

See [[Mean-field-versus-coarse-graining]] for why this statistical approximation differs from coarse-graining. At $H = 0$, expanding $\tanh x = x - x^3/3 + O(x^5)$ shows that non-zero solutions appear once $qJ/k_B T > 1$, setting $k_B T_c^{\text{MF}} = qJ$.

Equivalently, independent spins with average $m$ have mean-field free energy per spin at $H = 0$:

$$f_{\text{MF}}(m) = -\frac{1}{2}qJm^2 + k_B T\left[\frac{1+m}{2}\ln\frac{1+m}{2} + \frac{1-m}{2}\ln\frac{1-m}{2}\right],$$

whose stationarity $\partial f_{\text{MF}}/\partial m = 0$ reproduces $m = \tanh(qJm/k_B T)$. Expanding for small $m$ near $T_c^{\text{MF}}$ (dropping $-k_B T\ln 2$) gives the Landau form,

$$f(m) = a(T - T_c^{\text{MF}})m^2 + b m^4, \qquad a, b > 0,$$

with $a = k_B/2$ and $b \approx k_B T_c^{\text{MF}}/12$ (strictly $k_B T/12$, evaluated near the transition). An applied field adds $-Hm$ to $f(m)$. At $H = 0$, $f(m)$ has one minimum at $m = 0$ above $T_c^{\text{MF}}$, a flat quartic minimum $f(m) = bm^4$ at $T_c^{\text{MF}}$, and two minima at $m^* = \pm\sqrt{a(T_c^{\text{MF}} - T)/(2b)}$ below $T_c^{\text{MF}}$, giving $\beta = 1/2$. In the continuum functional of [[Mean-field-versus-coarse-graining]], the mean-field transition temperature $T_0$ plays the role of $T_c^{\text{MF}}$ here.

---

## 5. Exact 2D benchmarks versus Weiss theory

Ising proved in 1925 that the 1D nearest-neighbour chain has no phase transition at $T > 0$.[^ising1925] For the infinite 2D square lattice at $H = 0$, Onsager solved the free energy and $T_c$ exactly in 1944,[^onsager1944] and Yang derived the spontaneous magnetization in 1952.[^yang1952]

| Benchmark (2D square lattice, $q = 4$, $H = 0$) | Weiss mean field | Exact infinite 2D lattice |
|---|---|---|
| Critical temperature $k_B T_c / J$ | $4$ | $2/\ln(1 + \sqrt{2}) \approx 2.269$ |
| Magnetization exponent $\beta$ in $m^* \propto (T_c - T)^\beta$ | $1/2$ | $1/8$ |

Weiss theory predicts the transition qualitatively but misses both $T_c$ and $\beta$.[^chaikin1995][^yeomans1992] Replacing the fluctuating local field by its mean suppresses both the spread from having only four neighbours and their correlations. Keeping the field distribution of four independent neighbours of mean $m$ already lowers $k_B T_c/J$ from Weiss's $4$ to about $3.09$, the root of $\tanh(2J/k_B T_c) + \frac{1}{2}\tanh(4J/k_B T_c) = 1$, but still gives $\beta = 1/2$. The exact $k_B T_c/J \approx 2.269$ and $\beta = 1/8$ come from the full square-lattice solution, in which correlations extend over all scales at $T_c$.

---

## 6. Domain walls and line tension

Below $T_c$, $+m^*$ and $-m^*$ domains meet at a domain wall. At $T = 0$, a straight wall along a lattice axis crosses one broken bond per lattice spacing. Each broken bond costs $2J$, so the wall energy is $2J$ per lattice spacing ($2JL/a_0$ for a wall of length $L$, with $a_0$ the lattice spacing).

At finite temperature ($0 < T < T_c$), the controlling quantity is the **line tension**, the excess free energy per unit length $\sigma = \Delta F/L$. Thermal kinks let the wall wander; the entropy they add lowers $\sigma$ below its $T = 0$ value $2J/a_0$. In the mean-field model of [[Mean-field-versus-coarse-graining]], the kink width diverges as $T \to T_0^-$; in the exact Ising model, the macroscopic line tension $\sigma$ vanishes at the physical $T_c$, where walls proliferate freely and end long-range order.

---

## 7. Sampling with Metropolis Monte Carlo

For cases without exact solutions, equilibrium averages are commonly sampled with the Metropolis algorithm.[^metropolis1953] Pick a site $i$ uniformly at random, compute $\Delta E = 2 s_i (J\sum_{j \in \mathcal{N}(i)} s_j + H)$ for flipping $s_i \to -s_i$, and accept the flip with probability $\min(1, e^{-\Delta E/k_B T})$. One sweep is $N$ attempted flips.

Monte Carlo sweeps are not physical time. The Ising energy defines no microscopic equations of motion; the Metropolis rule builds a Markov chain whose detailed-balance condition makes the Boltzmann distribution $e^{-E/k_B T}/Z$ stationary. Single-flip dynamics still show critical slowing down, as in [[Lecture-Notes/Intro-Soft-Matter/Singularities|Singularities]].

[^ising1925]: E. Ising, Beitrag zur Theorie des Ferromagnetismus, Z. Phys., 31, 253–258 (1925). DOI: [10.1007/BF02980577](https://doi.org/10.1007/BF02980577).

[^weiss1907]: P. Weiss, L'hypothèse du champ moléculaire et la propriété ferromagnétique, J. Phys. Théor. Appl., 6, 661–690 (1907). DOI: [10.1051/jphystap:019070060066100](https://doi.org/10.1051/jphystap:019070060066100).

[^onsager1944]: L. Onsager, Crystal statistics. I. A two-dimensional model with an order-disorder transition, Phys. Rev., 65, 117–149 (1944). DOI: [10.1103/PhysRev.65.117](https://doi.org/10.1103/PhysRev.65.117).

[^yang1952]: C. N. Yang, The spontaneous magnetization of a two-dimensional Ising model, Phys. Rev., 85, 808–816 (1952). DOI: [10.1103/PhysRev.85.808](https://doi.org/10.1103/PhysRev.85.808).

[^metropolis1953]: N. Metropolis, A. W. Rosenbluth, M. N. Rosenbluth, A. H. Teller & E. Teller, Equation of state calculations by fast computing machines, J. Chem. Phys., 21, 1087–1092 (1953). DOI: [10.1063/1.1699114](https://doi.org/10.1063/1.1699114).

[^chaikin1995]: P. M. Chaikin & T. C. Lubensky, *Principles of Condensed Matter Physics*, Cambridge University Press (1995). DOI: [10.1017/CBO9780511813467](https://doi.org/10.1017/CBO9780511813467).

[^yeomans1992]: J. M. Yeomans, *Statistical Mechanics of Phase Transitions*, Oxford University Press (1992). DOI: [10.1093/oso/9780198517290.001.0001](https://doi.org/10.1093/oso/9780198517290.001.0001).
