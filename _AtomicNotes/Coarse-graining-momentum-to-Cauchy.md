---
date: 2025-10-29
status: done ✅
publish: true
---
# Coarse-Graining the Momentum Flux to Derive Cauchy's Equation

Microscopic mass and momentum sit on discrete particles as singular distributions. Coarse-graining converts the microscopic balance into a balance for smooth continuum fields without approximation: $\overline{\boldsymbol{K}}$ splits into bulk advection $\rho\,\boldsymbol{v}\otimes\boldsymbol{v}$ and the fluctuation flux $-\boldsymbol{\sigma}_{\text{kin}}$, while pair forces localize into $\boldsymbol{\sigma}_{\text{config}} = -\overline{\boldsymbol{C}}$ via the Irving–Kirkwood bond integral. Central forces make each bond dyad symmetric and each pair torque zero. Combining both stresses with continuity gives Cauchy's equation, $\rho\,D\boldsymbol{v}/Dt = \nabla\cdot\boldsymbol{\sigma} + \rho\,\boldsymbol{b}$.

---

## 1. Why coarse-grain? From spiky to smooth fields

Microscopic fields. For point particles $\{m_n,\boldsymbol{r}_n(t),\boldsymbol{v}_n(t)\}$,
$$
\rho_{\text{mic}}(\boldsymbol{r},t) = \sum_n m_n\,\delta(\boldsymbol{r}-\boldsymbol{r}_n),\qquad
\boldsymbol{g}_{\text{mic}}(\boldsymbol{r},t) = (\rho\boldsymbol{v})_{\text{mic}} = \sum_n m_n\boldsymbol{v}_n\,\delta(\boldsymbol{r}-\boldsymbol{r}_n).
$$
These are distributions—ill-suited to differentiation on continuum scales.

Coarse-graining. Introduce either (i) convolution with a fixed smooth kernel $W_\ell(\boldsymbol{r})$ of width $\ell$, normalized so $\int W_\ell\,dV = 1$, or (ii) ensemble averaging $\langle\cdot\rangle$:
$$\overline{A}(\boldsymbol{r},t) = \int W_\ell(\boldsymbol{r}-\boldsymbol{r}')\,A_{\text{mic}}(\boldsymbol{r}',t)\,d\boldsymbol{r}'\quad\text{or}\quad \langle A\rangle.$$
A smooth spatial convolution gives spatial regularity and commutes with $\partial_t$ and $\nabla$, yielding an exact averaged balance; an ensemble average needs regular averaged moments and derivative interchange. Scale separation $a \ll \ell \ll L$ (interparticle spacing $a$, continuum scale $L$) is needed for the continuum interpretation and closure.

> [!note]
> Any physical probe averages in space/time; coarse-graining mirrors measurement and yields differentiable fields for continuum mechanics.

---

## 2. Microscopic momentum balance and the momentum flux tensor

Consider particles obeying Newton's laws with pair forces $\boldsymbol{f}_{nm}$ (force exerted by $m$ on $n$, $\boldsymbol{f}_{nm} = -\boldsymbol{f}_{mn}$) and external force density $\boldsymbol{q}_{\text{ext}} = \sum_n \boldsymbol{F}_n^{\text{ext}}\delta_n$, where $\delta_n = \delta(\boldsymbol{r}-\boldsymbol{r}_n)$ and $\boldsymbol{q}_{\text{ext}} = \rho_{\text{mic}}\boldsymbol{b}_{\text{ext}}$ for a prescribed acceleration field. Differentiating $\boldsymbol{g}_{\text{mic}}$ gives $\partial_t\boldsymbol{g}_{\text{mic}} + \nabla\cdot\boldsymbol{K}_{\text{mic}} = \boldsymbol{q}_{\text{ext}} + \boldsymbol{q}_{\text{pair}}$, where $\boldsymbol{q}_{\text{pair}}$ is the pair-force density (§2.2). Writing $\boldsymbol{q}_{\text{pair}} = -\nabla\cdot\boldsymbol{C}_{\text{mic}}$ (Irving–Kirkwood construction) gives the microscopic local momentum balance
$$\frac{\partial \boldsymbol{g}_{\text{mic}}}{\partial t} + \nabla\cdot\boldsymbol{\Pi}_{\text{mic}} = \boldsymbol{q}_{\text{ext}},$$
where the momentum flux tensor is
$$\boldsymbol{\Pi}_{\text{mic}} = \underbrace{\boldsymbol{K}_{\text{mic}}}_{\text{kinetic}} + \underbrace{\boldsymbol{C}_{\text{mic}}}_{\text{configurational}}.$$

### 2.1 Kinetic contribution $\boldsymbol{K}$

$$K_{ij}(\boldsymbol{r},t) = \sum_n m_n v_{n,i}v_{n,j}\,\delta(\boldsymbol{r}-\boldsymbol{r}_n).$$
This is the flux of $i$-momentum across a surface with normal $\boldsymbol{e}_j$ due to particles flying through.

### 2.2 Configurational contribution $\boldsymbol{C}$

With particle labels $n, m$ and Cartesian components $i, j$ (the companion notes [[Virial-identity]] and [[Lecture-Notes/Intro-Soft-Matter/Conservation-Laws|Conservation Laws]] use $i, j$ for particles and $\alpha, \beta$ for components), set $\boldsymbol{r}_{nm} = \boldsymbol{r}_n - \boldsymbol{r}_m$ and let $\boldsymbol{f}_{nm}$ be the force exerted by $m$ on $n$:
$$
B_{nm} = \int_{0}^{1}\delta(\boldsymbol{r}-\boldsymbol{r}_m-s\,\boldsymbol{r}_{nm})\,ds,\qquad
C_{ij}(\boldsymbol{r},t) = \frac{1}{2}\sum_{n\ne m} f_{nm,i}\,r_{nm,j}\,B_{nm},
$$
with $(\nabla\cdot\boldsymbol{C})_i = \partial_j C_{ij}$; the factor $\frac{1}{2}$ compensates for the ordered sum. This bond term attributes momentum transport to interparticle forces acting across an imaginary cut. The line integral distributes the pair's contribution locally along the segment joining $\boldsymbol{r}_m$ to $\boldsymbol{r}_n$.

Why this form?

* Enforces Newton's third law locally: momentum leaving one side enters the other.
* Satisfies the pair-force identity $r_{nm,j}\partial_j B_{nm} = \delta_m - \delta_n$, so
  $$q_{\text{pair},i} = \sum_n\sum_{m\ne n} f_{nm,i}\,\delta_n = \frac{1}{2}\sum_{n\ne m} f_{nm,i}(\delta_n - \delta_m) = -\partial_j C_{ij}.$$
* Yields a symmetric stress when pair forces are central ($\boldsymbol{f}_{nm}\parallel\boldsymbol{r}_{nm}$), because parallel force and bond vectors make each bond dyad $f_{nm,i}r_{nm,j}$ symmetric.

---

## 3. Averaging and the continuum balance

Apply the coarse-graining to obtain smooth fields:
$$\rho = \overline{\rho}_{\text{mic}},\quad \rho\boldsymbol{v} = \overline{\boldsymbol{g}}_{\text{mic}},\quad \rho\boldsymbol{b} = \overline{\boldsymbol{q}}_{\text{ext}},\quad \overline{\boldsymbol{\Pi}} = \overline{\boldsymbol{\Pi}}_{\text{mic}}.$$
We get the exact coarse-grained local balance:
$$\frac{\partial}{\partial t}(\rho\boldsymbol{v}) + \nabla\cdot\overline{\boldsymbol{\Pi}} = \rho\,\boldsymbol{b}.$$

### 3.1 Decomposing $\overline{\boldsymbol{\Pi}}$: convective vs non-convective

Centre fluctuations at the observation point $(\boldsymbol{r},t)$ rather than at $\boldsymbol{r}_n$. With weights $w_n = m_n W_\ell(\boldsymbol{r}-\boldsymbol{r}_n)$,
$$\rho = \sum_n w_n,\qquad \boldsymbol{v} = \frac{1}{\rho}\sum_n w_n\boldsymbol{v}_n,\qquad \boldsymbol{c}_n = \boldsymbol{v}_n - \boldsymbol{v}(\boldsymbol{r},t),\qquad \langle a\rangle_\rho = \frac{1}{\rho}\sum_n w_n a_n$$
(ensemble averaging: replace $W_\ell$ by $\delta_n$ and average each sum before dividing). Here $\boldsymbol{v}$ is the mass-weighted mean velocity, $\boldsymbol{c}_n$ the peculiar velocity and $\langle\cdot\rangle_\rho$ the mass-weighted average. Then $\langle\boldsymbol{c}\rangle_\rho = \boldsymbol{0}$ and, with the outer product $(\boldsymbol{a}\otimes\boldsymbol{b})_{ij} = a_i b_j$,
$$\overline{\boldsymbol{K}} = \rho\,\boldsymbol{v}\otimes\boldsymbol{v} + \rho\,\langle\boldsymbol{c}\otimes\boldsymbol{c}\rangle_\rho \qquad (\overline{K}_{ij} = \rho\,v_i v_j + \rho\,\langle c_i c_j\rangle_\rho).$$
Interpretation.

* $\rho\,\boldsymbol{v}\otimes\boldsymbol{v}$: organized (bulk) transport of momentum.
* $\rho\,\langle\boldsymbol{c}\otimes\boldsymbol{c}\rangle_\rho$: momentum flux from velocity fluctuations within the averaging window (it includes unresolved flow variation, such as a linear shear across the window, not only thermal motion).

Assigning the fluctuation and configurational fluxes to the stress defines
$$\boxed{\overline{\boldsymbol{\Pi}} = \rho\,\boldsymbol{v}\otimes\boldsymbol{v} - \boldsymbol{\sigma}}$$
with the Cauchy stress tensor
$$\boxed{\boldsymbol{\sigma} = \underbrace{-\rho\,\langle\boldsymbol{c}\otimes\boldsymbol{c}\rangle_\rho}_{\boldsymbol{\sigma}_{\text{kin}}} + \underbrace{\boldsymbol{\sigma}_{\text{config}}}_{\text{from forces, see below}}}.$$
This split is exact relative to the chosen filter—a definition, not an approximation.

### 3.2 Configurational part and stress

Averaging $\boldsymbol{C}$ (for a fixed spatial filter, replacing $\delta$ by $W_\ell$ in $B_{nm}$) yields the configurational stress:
$$\overline{\boldsymbol{C}} = -\boldsymbol{\sigma}_{\text{config}},$$
so that the total stress is
$$\boldsymbol{\sigma} = \boldsymbol{\sigma}_{\text{config}} - \rho\,\langle\boldsymbol{c}\otimes\boldsymbol{c}\rangle_\rho.$$
Reversing pair labels flips both $\boldsymbol{f}_{nm}$ and $\boldsymbol{r}_{nm}$, so the two ordered terms add; label reversal does not imply tensor symmetry. Instead,
$$C_{ij} - C_{ji} = \frac{1}{2}\sum_{n\neq m} (f_{nm,i}\,r_{nm,j} - f_{nm,j}\,r_{nm,i})\,B_{nm},$$
with pair torque $\boldsymbol{\tau}_{nm} = \boldsymbol{r}_{nm}\times\boldsymbol{f}_{nm}$. Central forces make each bond dyad symmetric and each pair torque zero. With non-central forces, $\boldsymbol{\sigma}$ is symmetric only where their antisymmetric parts cancel pointwise in the averaged tensor; zero total torque alone does not ensure this. If an antisymmetric stress survives in an angular-momentum-conserving model, the balance must account for exchange with internal spin, couple stresses, or other compensating torques (as in Cosserat/micropolar continua).

---

## 4. From momentum flux to the Cauchy equation

Insert $\overline{\boldsymbol{\Pi}} = \rho\,\boldsymbol{v}\otimes\boldsymbol{v} - \boldsymbol{\sigma}$ into the averaged conservation law:
$$\partial_t(\rho\boldsymbol{v}) + \nabla\cdot(\rho\,\boldsymbol{v}\otimes\boldsymbol{v}-\boldsymbol{\sigma}) = \rho\,\boldsymbol{b}.$$
Use the identity
$$
\partial_t(\rho\boldsymbol{v}) + \nabla\cdot(\rho\,\boldsymbol{v}\otimes\boldsymbol{v})
= \rho\,\frac{D\boldsymbol{v}}{Dt} + \boldsymbol{v}\,[\partial_t\rho + \nabla\cdot(\rho\boldsymbol{v})]
$$
and the continuity equation $\partial_t\rho + \nabla\cdot(\rho\boldsymbol{v}) = 0$. We obtain the Cauchy momentum equation
$$\boxed{\rho\,\frac{D\boldsymbol{v}}{Dt} = \nabla\cdot\boldsymbol{\sigma} + \rho\,\boldsymbol{b}.}$$
Sign convention. We choose $\overline{\boldsymbol{\Pi}} = \rho\,\boldsymbol{v}\otimes\boldsymbol{v} - \boldsymbol{\sigma}$ so that internal stresses enter as $+\nabla\cdot\boldsymbol{\sigma}$. Here $\nabla\cdot\boldsymbol{\sigma} = \overline{\boldsymbol{q}}_{\text{pair}} + \nabla\cdot\boldsymbol{\sigma}_{\text{kin}}$ is the net force per unit volume exerted by stresses in the coarse-grained balance, with $\overline{\boldsymbol{q}}_{\text{pair}} = \nabla\cdot\boldsymbol{\sigma}_{\text{config}}$. For an incompressible Newtonian fluid ($\nabla\cdot\boldsymbol{v} = 0$), $\boldsymbol{\sigma} = -p\boldsymbol{I} + 2\mu\boldsymbol{D}$ and $\nabla\cdot\boldsymbol{\sigma} = -\nabla p + \nabla\cdot(2\mu\boldsymbol{D})$.

---

## 5. Physical interpretation and materials examples

### 5.1 Kinetic vs configurational dominance

* Dilute gases. Intermolecular forces act mainly as brief collisions; the kinetic part dominates:
  $\boldsymbol{\sigma} \approx -\rho\,\langle\boldsymbol{c}\otimes\boldsymbol{c}\rangle_\rho = -p_{\text{kin}}\boldsymbol{I} - \rho\,\langle\boldsymbol{c}\otimes\boldsymbol{c} - \tfrac{1}{3}c^2\boldsymbol{I}\rangle_\rho$, where $p_{\text{kin}} = \tfrac{1}{3}\rho\langle c^2\rangle_\rho$ is exact for the kinetic part and the kinetic deviator $-\rho\,\langle\boldsymbol{c}\otimes\boldsymbol{c} - \tfrac{1}{3}c^2\boldsymbol{I}\rangle_\rho$ is small compared with $p_{\text{kin}}$ when velocity fluctuations are nearly isotropic (short mean free path compared with $L$, and the window resolves the flow).
* Dense liquids/solids. Persistent interactions; configurational stresses typically dominate the shear and often much of the pressure—this is the virial viewpoint.

| Quantity                                                                                         | Mathematical role    | Physical content                             |
| ------------------------------------------------------------------------------------------------ | -------------------- | -------------------------------------------- |
| $\rho\,\boldsymbol{v}\otimes\boldsymbol{v}$                                                      | mean/convective flux | organized motion                             |
| $-\boldsymbol{\sigma} = \overline{\boldsymbol{\Pi}} - \rho\,\boldsymbol{v}\otimes\boldsymbol{v}$ | non-convective flux  | velocity fluctuations + interparticle forces |

### 5.2 Constitutive closure (beyond kinematics)

The derivation above defines $\boldsymbol{\sigma}$ kinematically. To close the equations we need a constitutive relation:

* Newtonian fluid: $\boldsymbol{\sigma} = -p\boldsymbol{I} + 2\mu[\boldsymbol{D} - \tfrac{1}{3}(\nabla\cdot\boldsymbol{v})\boldsymbol{I}] + \lambda_b(\nabla\cdot\boldsymbol{v})\boldsymbol{I}$, where $\boldsymbol{D} = \tfrac{1}{2}(\nabla\boldsymbol{v} + \nabla\boldsymbol{v}^\top)$ and $\lambda_b$ is the bulk viscosity (incompressible: $\nabla\cdot\boldsymbol{v} = 0$, $\boldsymbol{\sigma} = -p\boldsymbol{I} + 2\mu\boldsymbol{D}$).
* Non-Newtonian (Oldroyd-B example): In this constitutive model, the conformation tensor $\boldsymbol{A}$ evolves as $\overset{\triangledown}{\boldsymbol{A}} = -(\boldsymbol{A} - \boldsymbol{I})/\lambda$, where the upper-convected derivative carries transport and deformation and the right-hand side relaxes $\boldsymbol{A}$ towards $\boldsymbol{I}$; the polymer stress is $\boldsymbol{\sigma}_{\text{poly}} = G(\boldsymbol{A} - \boldsymbol{I})$, giving the full incompressible Oldroyd-B stress $\boldsymbol{\sigma} = -p\boldsymbol{I} + 2\eta_s\boldsymbol{D} + G(\boldsymbol{A} - \boldsymbol{I})$.
* Solids: In hyperelastic solids $\boldsymbol{\sigma}$ derives from a strain energy; at finite temperature, atomistic solid stress includes both configurational and kinetic contributions.

---

## 6. Splitting $\overline{\boldsymbol{K}}$: convective part and kinetic stress

Because $\rho\,\langle c_i c_j\rangle_\rho$ is non-zero in general, the flux split keeps coherent bulk transport on one side and places all non-convective momentum transport—kinetic and configurational—into $-\boldsymbol{\sigma}$:
$$\underbrace{\rho\,v_i v_j}_{\text{coherent bulk}} \quad\Big|\quad \underbrace{\rho\,\langle c_i c_j\rangle_\rho + \overline{C}_{ij}}_{\text{non-convective, define as } -\sigma_{ij}}.$$
Turbulence uses the same exact split: for unfiltered continuum fields $\rho_0, \boldsymbol{u}$ with $\tilde{\boldsymbol{u}} = \overline{\rho_0\boldsymbol{u}}/\overline{\rho}_0$, the unresolved flux $\boldsymbol{\tau}^{\text{(Re)}} = \overline{\rho_0\boldsymbol{u}\otimes\boldsymbol{u}} - \overline{\rho}_0\,\tilde{\boldsymbol{u}}\otimes\tilde{\boldsymbol{u}}$ contributes $-\boldsymbol{\tau}^{\text{(Re)}}$ to the effective Cauchy stress.

---

## 7. Anatomy of $\boldsymbol{C}$: localizing Newton's third law

Although internal forces cancel globally, they do not vanish locally when evaluating the flux across a cut. The Irving–Kirkwood line integral (§2.2) localizes pair momentum transfer along each bond, giving $\overline{\boldsymbol{q}}_{\text{pair}} = \nabla\cdot\boldsymbol{\sigma}_{\text{config}}$ and a symmetric stress for central forces.

Many-body potentials or constraints need a pairwise decomposition with action–reaction ($\sum_{m\neq n}\boldsymbol{f}_{nm} = \boldsymbol{F}_n^{\text{int}}$, $\boldsymbol{f}_{nm} = -\boldsymbol{f}_{mn}$) before this construction applies; hard-sphere collisions add impulsive, localizable contributions.

---

## 8. Boundaries, tractions, and jump conditions

With the sign convention above, the material on the side towards which the unit normal $\boldsymbol{n}$ points exerts traction $\boldsymbol{t} = \boldsymbol{\sigma}\cdot\boldsymbol{n}$ on the material on the opposite side. Across a material interface carrying isotropic surface tension $\gamma$ as its only surface stress and negligible surface inertia, take $\boldsymbol{n}$ from $-$ to $+$, $[\![\boldsymbol{\sigma}]\!] = \boldsymbol{\sigma}_+ - \boldsymbol{\sigma}_-$, and $\kappa = \nabla_s\cdot\boldsymbol{n}$:
$$[\![\boldsymbol{\sigma}]\!]\cdot\boldsymbol{n} = \gamma\,\kappa\,\boldsymbol{n} - \nabla_s\gamma.$$
The normal component gives the Laplace jump. With this normal, the tangential bulk-traction jump $-\nabla_s\gamma$ balances the surface-tension force, so $+\nabla_s\gamma$ is the net tangential force per unit area that the interface exerts on the adjoining fluids, towards higher $\gamma$. The jump alone does not fix the traction on either fluid separately. This is consistent with the configurational origin of capillary stresses in a molecular picture (Korteweg and phase-field models build the capillary stress from local fields and their gradients).

---

## 9. Worked examples

### Example A (ideal gas in isotropic ensemble equilibrium).

$$
\langle\boldsymbol{c}\otimes\boldsymbol{c}\rangle_\rho = \frac{\langle c^2\rangle_\rho}{3}\,\boldsymbol{I},\quad
p = p_{\text{kin}} = \tfrac{1}{3}\rho\langle c^2\rangle_\rho,\quad
\boldsymbol{\sigma} = -p\boldsymbol{I}.
$$
With no interparticle forces, $\boldsymbol{C} = \boldsymbol{0}$.

### Example B (dense liquid).

Configurational stresses typically dominate the shear stress. For a homogeneous state, averaging over a volume $V$ that is the whole system or a periodic cell (with each pair interacting through a single image of $m$, and $\boldsymbol{r}_{nm} = \boldsymbol{r}_n - \boldsymbol{r}_m$ measured to that image) gives the unweighted bond sum
$$\boldsymbol{\sigma}_{\text{config}} = -\frac{1}{2V}\sum_{n\neq m}\langle\boldsymbol{f}_{nm}\otimes\boldsymbol{r}_{nm}\rangle,$$
with the force in the momentum index and the bond in the flux index. At equilibrium, $-\tfrac{1}{3}\operatorname{tr}\boldsymbol{\sigma}_{\text{config}}$ is the interaction (virial) term of the pressure in Exercise 5; in steady shear, its off-diagonal part is the configurational contribution to the shear stress.

### Example C (polymeric liquid—Oldroyd-B).

Insert the Oldroyd-B stress of §5.2 into Cauchy's equation to obtain the viscoelastic momentum equation.

---

## 10. Summary box (to remember)

$$
\boxed{
\begin{aligned}
&\text{Microscopic: } \boldsymbol{\Pi} = \boldsymbol{K} + \boldsymbol{C},\quad
K_{ij} = \sum_n m_n v_{n,i} v_{n,j}\,\delta_n,\\[2pt]
&\qquad C_{ij} = \tfrac{1}{2}\sum_{n\neq m} f_{nm,i}\,r_{nm,j}\,B_{nm},\quad
(\nabla\cdot\boldsymbol{C})_i = \partial_j C_{ij},\\[2pt]
&\qquad B_{nm} = \int_0^1 \delta(\boldsymbol{r}-\boldsymbol{r}_m-s\boldsymbol{r}_{nm})\,ds.\\[3pt]
&\text{Coarse-grained: }\overline{\boldsymbol{\Pi}} = \rho\,\boldsymbol{v}\otimes\boldsymbol{v} - \boldsymbol{\sigma}, \quad
\boldsymbol{\sigma} = -\rho\langle\boldsymbol{c}\otimes\boldsymbol{c}\rangle_\rho + \boldsymbol{\sigma}_{\text{config}}.\\[3pt]
&\text{Momentum eq.: }\partial_t(\rho\boldsymbol{v}) + \nabla\cdot(\rho\,\boldsymbol{v}\otimes\boldsymbol{v}-\boldsymbol{\sigma}) = \rho\,\boldsymbol{b}
\ \Rightarrow\
\rho\,\frac{D\boldsymbol{v}}{Dt} = \nabla\cdot\boldsymbol{\sigma} + \rho\,\boldsymbol{b}.
\end{aligned}}
$$

---

## 11. Exercises (with brief guidance)

1. Irving–Kirkwood to pressure (ideal gas). Starting from $\boldsymbol{\sigma} = -\rho\langle\boldsymbol{c}\otimes\boldsymbol{c}\rangle_\rho$, show $p = \tfrac{1}{3}\rho\langle c^2\rangle_\rho$ and derive the ideal-gas law using kinetic theory.

2. Symmetry of $\boldsymbol{\sigma}$. Use $\boldsymbol{f}_{nm}\parallel\boldsymbol{r}_{nm}$ to prove that $\boldsymbol{\sigma}_{\text{config}}$ is symmetric, and use $\boldsymbol{f}_{nm} = -\boldsymbol{f}_{mn}$ to justify the $\tfrac{1}{2}$ ordered-pair count.

3. From Cauchy to Navier–Stokes. Assuming constant $\rho$ and $\mu$ (so continuity gives $\nabla\cdot\boldsymbol{v} = 0$), insert the incompressible Newtonian stress $\boldsymbol{\sigma} = -p\boldsymbol{I} + 2\mu\boldsymbol{D}$ into Cauchy to obtain $\rho\,D\boldsymbol{v}/Dt = -\nabla p + \mu\nabla^2\boldsymbol{v} + \rho\boldsymbol{b}$.

4. Reynolds stress as "kinetic stress." For unfiltered continuum fields $\rho_0, \boldsymbol{u}$ with $\tilde{\boldsymbol{u}}(\boldsymbol{r},t) = \overline{\rho_0\boldsymbol{u}}/\overline{\rho}_0$, hold $\tilde{\boldsymbol{u}}$ at the observation point $(\boldsymbol{r},t)$ and show that
   $$\boldsymbol{\tau}^{\text{(Re)}} = \overline{\rho_0(\boldsymbol{u} - \tilde{\boldsymbol{u}})\otimes(\boldsymbol{u} - \tilde{\boldsymbol{u}})} = \overline{\rho_0\,\boldsymbol{u}\otimes\boldsymbol{u}} - \overline{\rho}_0\,\tilde{\boldsymbol{u}}\otimes\tilde{\boldsymbol{u}},$$
   so $\boldsymbol{\tau}^{\text{(Re)}}$ is a density-weighted velocity covariance like $\rho\langle\boldsymbol{c}\otimes\boldsymbol{c}\rangle_\rho$, and $-\boldsymbol{\tau}^{\text{(Re)}}$ enters the effective Cauchy stress as $\boldsymbol{\sigma}_{\text{kin}}$ does.

5. Virial expression (simple liquid). For a 3D classical system of $N$ particles at equilibrium with pairwise potential $U(d)$ ($d = |\boldsymbol{r}_{nm}|$), take the full-volume average over $V$ and use $p = -\tfrac{1}{3}\operatorname{tr}\boldsymbol{\sigma}$ to derive
   $$pV = Nk_BT + \frac{1}{6}\sum_{n\neq m}\langle\boldsymbol{f}_{nm}\cdot\boldsymbol{r}_{nm}\rangle_{\text{eq}} = Nk_BT + \frac{1}{3}\sum_{n<m}\langle\boldsymbol{f}_{nm}\cdot\boldsymbol{r}_{nm}\rangle_{\text{eq}}.$$
   Note that a bond crossing an arbitrary subvolume contributes only its weight inside that subvolume. Show that $\boldsymbol{f}_{nm} = -U'(d)\boldsymbol{r}_{nm}/d$ gives $\boldsymbol{f}_{nm}\cdot\boldsymbol{r}_{nm} = -d\,U'(d)$, which is positive for a repulsive pair ($U' < 0$), so repulsion raises the pressure and attraction lowers it.

---

## 12. Frequently asked questions

* Is the stress uniquely defined? No: $\boldsymbol{\sigma} \to \boldsymbol{\sigma} + \boldsymbol{S}$ leaves the bulk momentum balance unchanged if $\nabla\cdot\boldsymbol{S} = \boldsymbol{0}$, and preserves prescribed boundary tractions if $\boldsymbol{S}\cdot\boldsymbol{n} = \boldsymbol{0}$ on the boundary. Other bond paths give the same $\boldsymbol{q}_{\text{pair}}$ but a different $\boldsymbol{C}$; the Irving–Kirkwood form is the standard local choice.
* What if there are long-range forces (e.g. electrostatics)? One can include Maxwell stresses in $\boldsymbol{\sigma}$; the configurational part then includes field contributions.
* What sets the averaging scale $\ell$? The balance is exact for any fixed normalized kernel $W_\ell$, while finite $\ell$ retains filter-dependent (LES-like subgrid) stresses. Continuum predictions become insensitive to $\ell$ in the scale-separation regime of §1, provided the window samples many effectively independent molecules (suppressing molecular noise) and resolves the flow variation (making subgrid stresses negligible).
