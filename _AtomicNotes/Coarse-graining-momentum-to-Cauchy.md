---
modified: 2025-10-30T11:19:19+00:00
date: 2025-10-29
status: done ✅
publish: true
---
# Coarse-Graining the Momentum Flux to Derive Cauchy's Equation

## Executive summary (one-page take-home)

* Microscopic fields are "spiky." Mass and momentum live on particles. We introduce a coarse-graining (ensemble or local spatial average) to obtain differentiable fields.
* Microscopic momentum flux: Write $\boldsymbol{\Pi} = \boldsymbol{K} + \boldsymbol{C}$, with kinetic/convective
  $$K_{ij}(\boldsymbol{r},t) = \sum_n m_n v_{n,i}v_{n,j}\,\delta(\boldsymbol{r}-\boldsymbol{r}_n)$$ and configurational/force-transport
  $$C_{ij}(\boldsymbol{r},t) = \tfrac{1}{2}\sum_{n\neq m} r_{nm,j}F_{nm,i}\int_0^1\delta[\boldsymbol{r}-(\boldsymbol{r}_n+s\boldsymbol{r}_{nm})]\,ds$$ components.
* Averaging and decomposition: After smoothing,
  $$\overline{\boldsymbol{\Pi}} = \rho\,\boldsymbol{v}\boldsymbol{v} - \boldsymbol{\sigma},\qquad
  \boldsymbol{\sigma} = \underbrace{-\rho\,\langle\boldsymbol{c}\,\boldsymbol{c}\rangle}_{\text{kinetic (fluctuation)}} + \underbrace{\boldsymbol{\sigma}_{\text{config}}}_{\text{from interparticle forces}},$$
  where $\boldsymbol{v}$ is the mean velocity and $\boldsymbol{c}$ the peculiar fluctuation.

* Meaning of $\langle\boldsymbol{K}\rangle = \rho\,\boldsymbol{v}\boldsymbol{v}$. This is not just a definition; it encodes a closure: macroscopic transport $= \rho\,\boldsymbol{v}\boldsymbol{v}$; microscopic agitation $\to$ stress. The fluctuation term $\rho\langle\boldsymbol{c}\boldsymbol{c}\rangle$ is absorbed into $\boldsymbol{\sigma}$.

* Meaning of $\boldsymbol{C}$: The line-integral representation is the minimal local encoding of Newton's third law, ensuring local momentum conservation, symmetry of stress, and correct torques. Upon averaging, $\langle\boldsymbol{C}\rangle = -\boldsymbol{\sigma}_{\text{config}}$.

* Cauchy momentum equation. With continuity,
  $$\partial_t(\rho\boldsymbol{v}) + \nabla\cdot(\rho\,\boldsymbol{v}\boldsymbol{v}-\boldsymbol{\sigma}) = \rho\,\boldsymbol{b}
  \quad\Longrightarrow\quad
  \rho\,\frac{D\boldsymbol{v}}{Dt} = \nabla\cdot\boldsymbol{\sigma} + \rho\,\boldsymbol{b}.$$

---

## 1. Why coarse-grain? From spiky to smooth fields

Microscopic fields. For point particles $\{m_n,\boldsymbol{r}_n(t),\boldsymbol{v}_n(t)\}$,
$$\rho_{\text{mic}}(\boldsymbol{r},t) = \sum_n m_n\,\delta(\boldsymbol{r}-\boldsymbol{r}_n),\qquad
(\rho\boldsymbol{v})_{\text{mic}} = \sum_n m_n\boldsymbol{v}_n\,\delta(\boldsymbol{r}-\boldsymbol{r}_n).$$
These are distributions—ill-suited to differentiation on continuum scales.

Coarse-graining. Introduce either (i) ensemble averaging $\langle\cdot\rangle$ or (ii) spatial filtering with a smooth kernel $W_\ell(\boldsymbol{r})$ of width $\ell$ (the averaging cell):
$$\overline{A}(\boldsymbol{r},t) = \int W_\ell(\boldsymbol{r}-\boldsymbol{r}')\,A_{\text{mic}}(\boldsymbol{r}',t)\,d\boldsymbol{r}'\quad\text{or}\quad \langle A\rangle.$$
Assume the scale separation $a \ll \ell \ll L$ (particle size $a$, continuum scale $L$), so that gradients of the coarse-grained fields are defined and microscale noise is washed out.

> [!note]
> Any physical probe averages in space/time; coarse-graining mirrors measurement and yields differentiable fields for continuum mechanics.

---

## 2. Microscopic momentum balance and the momentum flux tensor

For particles obeying Newton's laws with pair forces $\boldsymbol{f}_{nm} = -\boldsymbol{f}_{mn}$ and body force per mass $\boldsymbol{b}$, we can show (Irving–Kirkwood construction) that the microscopic local momentum balance reads
$$\frac{\partial}{\partial t}(\rho\boldsymbol{v})_{\text{mic}} + \nabla\cdot\boldsymbol{\Pi}_{\text{mic}} = \rho_{\text{mic}}\boldsymbol{b},$$
where the momentum flux tensor is
$$\boldsymbol{\Pi}_{\text{mic}} = \underbrace{\boldsymbol{K}_{\text{mic}}}_{\text{kinetic}} + \underbrace{\boldsymbol{C}_{\text{mic}}}_{\text{configurational}}.$$

### 2.1 Kinetic contribution $\boldsymbol{K}$

$$K_{ij}(\boldsymbol{r},t) = \sum_n m_n v_{n,i}v_{n,j}\,\delta(\boldsymbol{r}-\boldsymbol{r}_n).$$
This is the flux of $i$-momentum across a surface with normal $\boldsymbol{e}_j$ due to particles flying through.

### 2.2 Configurational contribution $\boldsymbol{C}$

$$C_{ij}(\boldsymbol{r},t) = \frac{1}{2}\sum_{n\ne m} r_{nm,j}F_{nm,i}\int_{0}^{1}
\delta\left[\boldsymbol{r}-(\boldsymbol{r}_n+s\,\boldsymbol{r}_{nm})\right]ds,\qquad \boldsymbol{r}_{nm} = \boldsymbol{r}_m - \boldsymbol{r}_n.$$
This bond term attributes momentum transport to interparticle forces acting across an imaginary cut. The line integral distributes the pair's contribution locally along the segment joining the particles.

Why this form?

* Enforces Newton's third law locally: momentum leaving one side enters the other.
* Guarantees $\boldsymbol{\Pi}$ is in divergence form so that its divergence equals local force density.
* Yields a symmetric stress (angular momentum is conserved; no spurious torques).

---

## 3. Averaging and the continuum balance

Apply the coarse-graining to obtain smooth fields:
$$\overline{\rho},\quad \overline{\rho\boldsymbol{v}},\quad \overline{\boldsymbol{\Pi}} = \langle\boldsymbol{\Pi}_{\text{mic}}\rangle.$$
We get the continuum-level local balance:
$$\frac{\partial}{\partial t}(\rho\boldsymbol{v}) + \nabla\cdot\overline{\boldsymbol{\Pi}} = \rho\,\boldsymbol{b}.$$

### 3.1 Decomposing $\overline{\boldsymbol{\Pi}}$: convective vs non-convective

Write each particle velocity as mean + fluctuation at its location,
$$\boldsymbol{v}_n = \boldsymbol{v}(\boldsymbol{r}_n,t) + \boldsymbol{c}_n,\qquad \langle \boldsymbol{c}_n\rangle = \boldsymbol{0}.$$
Then
$$\langle K_{ij}\rangle = \rho\,v_i v_j + \rho\,\langle c_i c_j\rangle.$$
Interpretation.

* $\rho\,\boldsymbol{v}\boldsymbol{v}$: organized (bulk) transport of momentum.
* $\rho\langle\boldsymbol{c}\boldsymbol{c}\rangle$: flux from microscopic agitation.

At continuum level, we assign the fluctuation flux together with the configurational flux to the stress. That is, we define
$$\boxed{\overline{\boldsymbol{\Pi}} = \rho\,\boldsymbol{v}\boldsymbol{v} - \boldsymbol{\sigma}}$$
with the Cauchy stress tensor
$$\boxed{\boldsymbol{\sigma} = \underbrace{-\rho\,\langle\boldsymbol{c}\,\boldsymbol{c}\rangle}_{\boldsymbol{\sigma}_{\text{kin}}} + \underbrace{\boldsymbol{\sigma}_{\text{config}}}_{\text{from forces, see below}}}.$$
This is a philosophical split: macroscopic convective transport vs microscopic agitation + interparticle interactions.

> Key point: Saying $\langle\boldsymbol{K}\rangle = \rho\,\boldsymbol{v}\boldsymbol{v}$ is not a mere definition; it encodes a closure: we place $\rho\langle\boldsymbol{c}\boldsymbol{c}\rangle$ into $\boldsymbol{\sigma}$, i.e. we declare it part of the non-convective transport.

### 3.2 Configurational part and stress

Averaging $\boldsymbol{C}$ yields the configurational stress:
$$\langle \boldsymbol{C}\rangle = -\boldsymbol{\sigma}_{\text{config}},$$
so that the total stress is
$$\boldsymbol{\sigma} = \boldsymbol{\sigma}_{\text{config}} - \rho\,\langle\boldsymbol{c}\,\boldsymbol{c}\rangle.$$
The symmetry of $\boldsymbol{\sigma}$ follows from the pair symmetry in $\boldsymbol{C}$ and guarantees angular-momentum conservation.

---

## 4. From momentum flux to the Cauchy equation

Insert $\overline{\boldsymbol{\Pi}} = \rho\,\boldsymbol{v}\boldsymbol{v} - \boldsymbol{\sigma}$ into the averaged conservation law:
$$\partial_t(\rho\boldsymbol{v}) + \nabla\cdot(\rho\,\boldsymbol{v}\boldsymbol{v}-\boldsymbol{\sigma}) = \rho\,\boldsymbol{b}.$$
Use the identity
$$\partial_t(\rho\boldsymbol{v}) + \nabla\cdot(\rho\boldsymbol{v}\boldsymbol{v})
= \rho\,\frac{D\boldsymbol{v}}{Dt} + \boldsymbol{v}\,[\partial_t\rho + \nabla\cdot(\rho\boldsymbol{v})]$$
and the continuity equation $\partial_t\rho + \nabla\cdot(\rho\boldsymbol{v}) = 0$. We obtain the Cauchy momentum equation
$$\boxed{\rho\,\frac{D\boldsymbol{v}}{Dt} = \nabla\cdot\boldsymbol{\sigma} + \rho\,\boldsymbol{b}.}$$
Sign convention. Here $\nabla\cdot\boldsymbol{\sigma}$ is the internal force density on the material (e.g. for a Newtonian fluid, $\boldsymbol{\sigma} = -p\boldsymbol{I} + 2\mu\boldsymbol{D}$ so $\nabla\cdot\boldsymbol{\sigma} = -\nabla p + \nabla\cdot(2\mu\boldsymbol{D})$).

---

## 5. Physical interpretation and materials examples

### 5.1 Kinetic vs configurational dominance

* Dilute gases. Intermolecular forces act mainly as brief collisions; kinetic part dominates:
  $\boldsymbol{\sigma} \approx -\rho\,\langle\boldsymbol{c}\,\boldsymbol{c}\rangle = -p\boldsymbol{I} + \text{small shear}$, with $p = (1/3)\rho\langle c^2\rangle$.
* Dense liquids/solids. Persistent interactions; configurational part dominates the shear and often much of the pressure—this is the virial viewpoint.

| Quantity                                                                                  | Mathematical role    | Physical content                             |
| ----------------------------------------------------------------------------------------- | -------------------- | -------------------------------------------- |
| $\rho\,\boldsymbol{v}\boldsymbol{v}$                                                      | mean/convective flux | organized motion                             |
| $-\boldsymbol{\sigma} = \overline{\boldsymbol{\Pi}} - \rho\,\boldsymbol{v}\boldsymbol{v}$ | non-convective flux  | microscopic agitation + interparticle forces |

### 5.2 Constitutive closure (beyond kinematics)

The derivation above defines $\boldsymbol{\sigma}$ kinematically. To close the equations we need a constitutive relation:

* Newtonian fluid: $\boldsymbol{\sigma} = -p\boldsymbol{I} + 2\mu\boldsymbol{D} + \lambda_b(\nabla\cdot\boldsymbol{v})\boldsymbol{I}$, where $\boldsymbol{D} = \tfrac{1}{2}(\nabla\boldsymbol{v} + \nabla\boldsymbol{v}^\top)$.
* Non-Newtonian (example). Oldroyd-B/polymeric fluids emerge when the configurational stress is tied to a conformation tensor $\boldsymbol{A}$: $\boldsymbol{\sigma}_{\text{poly}} = G(\boldsymbol{A} - \boldsymbol{I})$ with an upper-convected Maxwell evolution $\overset{\triangledown}{\boldsymbol{A}} = -(1/\lambda)(\boldsymbol{A} - \boldsymbol{I})$. This is precisely a continuum encoding of microscopic elastic memory contained in $\boldsymbol{C}$.
* Solids: In elastic solids $\boldsymbol{\sigma}$ derives from a strain energy; in the atomistic limit the configurational part reproduces Cauchy stress from interatomic potentials.

---

## 6. Why $\langle\boldsymbol{K}\rangle = \rho\,\boldsymbol{v}\boldsymbol{v}$ is a closure, not a tautology

$$\langle K_{ij}\rangle = \rho\,v_i v_j + \rho\,\langle c_i c_j\rangle.$$
The second term is non-zero in general. The coarse-graining philosophy is to assign all non-convective momentum transport—random agitation and interparticle push/pull—to the stress:
$$\underbrace{\rho\,v_i v_j}_{\text{coherent bulk}} \quad\Big|\quad \underbrace{\rho\,\langle c_i c_j\rangle + \text{(configurational)}}_{\text{non-convective, define as } -\sigma_{ij}}.$$
Thus we decide the book keeping that renders the continuum equation local, symmetric, and physically interpretable. This is exactly the Reynolds decomposition idea: for turbulence, $\overline{\rho\,\boldsymbol{v}\boldsymbol{v}} = \rho\,\tilde{\boldsymbol{v}}\tilde{\boldsymbol{v}} + \boldsymbol{\tau}^{\text{(Re)}}$ with the Reynolds stress $\boldsymbol{\tau}^{\text{(Re)}} \equiv \rho\,\widetilde{\boldsymbol{v}'\boldsymbol{v}'}$ absorbed into an effective $\boldsymbol{\sigma}$.

---

## 7. Anatomy of $\boldsymbol{C}$: localizing Newton's third law

Although internal forces cancel globally, they do not vanish locally when evaluating the flux across a cut. The Irving–Kirkwood line integral:

* Counts each pair once (the $1/2$ factor).
* Places the contribution along the bond, ensuring that the two sides of any cut receive equal and opposite momentum transfer.
* Produces a symmetric stress and a clean divergence (so $\nabla\cdot\boldsymbol{\sigma}$ is a genuine local force density).

For many-body potentials or constraints, generalized bond distributions exist that maintain these properties; hard-sphere collisions add impulsive, but still localizable, contributions.

---


## 9. Boundaries, tractions, and jump conditions

With the sign convention above, the traction exerted on a surface with unit normal $\boldsymbol{n}$ is $\boldsymbol{t} = \boldsymbol{\sigma}\cdot\boldsymbol{n}$. Across an interface with surface tension $\gamma$, the jump satisfies
$$[\![\boldsymbol{\sigma}]\!]\cdot\boldsymbol{n} = \gamma\,\kappa\,\boldsymbol{n} + \nabla_s\gamma,$$
consistent with the configurational origin of capillary stresses in a molecular picture (Korteweg/phase-field frameworks render this via a non-local $\boldsymbol{C}$ analogue).

---

## 10. Common pitfalls and sign conventions (quick checklist)

* Where does the minus sign come from? We choose $\overline{\boldsymbol{\Pi}} = \rho\,\boldsymbol{v}\boldsymbol{v} - \boldsymbol{\sigma}$ so that internal stresses enter as $+\nabla\cdot\boldsymbol{\sigma}$ in the equation of motion.
* Is $\langle\boldsymbol{K}\rangle = \rho\boldsymbol{v}\boldsymbol{v}$ exact? No. It is a modeling split: we define the convective part as $\rho\boldsymbol{v}\boldsymbol{v}$ and absorb the fluctuations into $\boldsymbol{\sigma}$.
* Symmetry of stress. Guaranteed by construction of $\boldsymbol{C}$ (plus micro-torque balance). If couple-stresses or micro-rotations are relevant, one must generalize to Cosserat/micropolar continua.

---

## 11. Worked examples

### Example A (ideal gas at equilibrium).

$$\langle\boldsymbol{c}\boldsymbol{c}\rangle = \frac{\langle c^2\rangle}{3}\,\boldsymbol{I},\quad
p = \tfrac{1}{3}\rho\langle c^2\rangle,\quad
\boldsymbol{\sigma} = -p\boldsymbol{I}.$$
Configurational part is negligible (no persistent forces).

### Example B (dense liquid).

Configurational stresses dominate shear. The virial expression relates pressure and shear to ensemble averages of $\boldsymbol{r}_{nm}\otimes\boldsymbol{f}_{nm}$.

### Example C (polymeric liquid—Oldroyd-B).

Configurational part linked to the conformation tensor gives $\boldsymbol{\sigma}_{\text{poly}} = G(\boldsymbol{A} - \boldsymbol{I})$ with $\overset{\triangledown}{\boldsymbol{A}} = -(1/\lambda)(\boldsymbol{A} - \boldsymbol{I})$. Insert in Cauchy to obtain the viscoelastic momentum equation.


---

## 13. Summary box (to remember)

$$\boxed{
\begin{aligned}
&\text{Microscopic: } \boldsymbol{\Pi} = \boldsymbol{K} + \boldsymbol{C},\quad
K_{ij} = \sum m v_i v_j \delta,\quad
C_{ij} = \tfrac{1}{2}\sum r_j F_i \int_0^1 \delta(\cdots)\, ds.\\[3pt]
&\text{Coarse-grained: }\overline{\boldsymbol{\Pi}} = \rho\,\boldsymbol{v}\boldsymbol{v} - \boldsymbol{\sigma}, \quad
\boldsymbol{\sigma} = -\rho\langle\boldsymbol{c}\,\boldsymbol{c}\rangle + \boldsymbol{\sigma}_{\text{config}}.\\[3pt]
&\text{Momentum eq.: }\partial_t(\rho\boldsymbol{v}) + \nabla\cdot(\rho\,\boldsymbol{v}\boldsymbol{v}-\boldsymbol{\sigma}) = \rho\,\boldsymbol{b}
\ \Rightarrow\
\rho\,\frac{D\boldsymbol{v}}{Dt} = \nabla\cdot\boldsymbol{\sigma} + \rho\,\boldsymbol{b}.\\[3pt]
&\text{Philosophy: }\ \rho\,\boldsymbol{v}\boldsymbol{v} \ \text{(bulk transport)};\
-\boldsymbol{\sigma} \ \text{(microscopic agitation + forces).}
\end{aligned}}$$

---

## 14. Exercises (with brief guidance)

1. Irving–Kirkwood to pressure (ideal gas). Starting from $\boldsymbol{\sigma} = -\rho\langle\boldsymbol{c}\,\boldsymbol{c}\rangle$, show $p = \tfrac{1}{3}\rho\langle c^2\rangle$ and derive the ideal-gas law using kinetic theory.

2. Symmetry of $\boldsymbol{\sigma}$. Use the antisymmetry $\boldsymbol{F}_{nm} = -\boldsymbol{F}_{mn}$ to prove that the configurational stress tensor is symmetric for central forces.

3. From Cauchy to Navier–Stokes. Insert $\boldsymbol{\sigma} = -p\boldsymbol{I} + 2\mu\boldsymbol{D}$ into Cauchy and use continuity to obtain the incompressible Navier–Stokes equations.

4. Reynolds stress as "kinetic stress." Show that filtering the convective flux produces $\overline{\rho\,\boldsymbol{v}\boldsymbol{v}} = \rho\,\boldsymbol{v}\boldsymbol{v} + \boldsymbol{\tau}^{\text{(Re)}}$. Interpret $\boldsymbol{\tau}^{\text{(Re)}}$ alongside $-\rho\langle\boldsymbol{c}\,\boldsymbol{c}\rangle$ in the stress budget.

5. Virial expression (simple liquid). For a pairwise potential $U(r)$, derive the virial formula $pV = Nk_BT - \tfrac{1}{6}\sum\langle \boldsymbol{r}_{nm}\cdot\boldsymbol{F}_{nm}\rangle$ from $\boldsymbol{\sigma}_{\text{config}}$.

---

## 15. Frequently asked questions

* Is the stress uniquely defined? Up to divergence-free "gauge" additions that do not affect $\nabla\cdot\boldsymbol{\sigma}$. The Irving–Kirkwood form is the canonical local choice.
* What if there are long-range forces (e.g. electrostatics)? One can include Maxwell stresses in $\boldsymbol{\sigma}$; the configurational part then includes field contributions.
* What sets the averaging scale $\ell$? Choose $a \ll \ell \ll L$. Predictions become $\ell$-independent in the true continuum regime; at finite $\ell$ one obtains LES-like subgrid stresses.

---

### Final perspective

1. $\langle\boldsymbol{K}\rangle = \rho\,\boldsymbol{v}\boldsymbol{v}$ expresses a scale separation: we keep coherent transport as convective and lump fluctuations into stress—a closure, not a tautology.
2. $\boldsymbol{C}$ localizes Newton's third law so that internal forces become a divergence of a symmetric tensor, producing the right local force and torque balances. Averaging gives $\langle\boldsymbol{C}\rangle = -\boldsymbol{\sigma}_{\text{config}}$.
3. The Cauchy equation then drops out cleanly:
   $$\boxed{\rho\,\frac{D\boldsymbol{v}}{Dt} = \nabla\cdot\boldsymbol{\sigma} + \rho\,\boldsymbol{b},}$$
   with $\boldsymbol{\sigma}$ capturing everything that is not bulk advection—pressure, viscous stresses, polymeric elasticity, capillarity, and turbulent transport—while $\rho\,\boldsymbol{v}\boldsymbol{v}$ accounts only for organized motion of mass.