---
modified: 2025-02-26T11:43:14+01:00
created: 2025-02-23T13:33:34+01:00
tags:
  - arrowhead
  - narwhal
  - Coherent
  - Elastoinertial
  - Turbulence
status: done ✅
---
# Reflections about arrowhead (narwhals) Structures in Elastoinertial Turbulence

## Executive Summary
Arrowhead structures, nicknamed "narwhals," were initially discovered as coherent patterns in elastoinertial turbulence (EIT) simulations. While these structures provided valuable insights into polymer-flow interactions $-$ they can be the pathway to explain elastoinertial turbulence $-$ recent research reveals they might be artifacts of 2D simulations that become unstable in realistic 3D flows. 

> [!abstract] Key Points Overview
> - Coherent structures could explain the pathway to elastoinertial turbulence. 
> - Arrowhead (one such traveling wave coherent solution of viscoelastic channel flow) structures are unstable in 3D flows
> - Lack of experimental validation.
> - Numerical artifacts play significant role $-$ presence or lack of polymeric diffusion.
> - Transient appearances may still influence flow dynamics. 

## Problem Statement
- **Central Issue:** The existence and significance of arrowhead structures in elastoinertial turbulence. 
- **Importance:** Understanding these structures could reveal fundamental mechanisms of polymer-flow interactions and turbulence development.

## Historical note

The two Phys. Rev. Lett. outline the exact traveling wave solutions $-$ now commonly called arrowheads or narwhals. 

![|750](_Media/Arrowheads-in-elastoinertial-turbulence-1740331019797.png)
[J. Page, Y. Dubief & R. R. Kerswell, Phys. Rev. Lett., 125:15, 154501 (2020)](https://doi.org/10.1103/PhysRevLett.125.154501)

![](_Media/Arrowheads-in-elastoinertial-turbulence-1740331094800.png)
[A. Morozov, Phys. Rev. Lett., 129:1, 017801 (2022)](https://doi.org/10.1103/PhysRevLett.129.017801)


## Methodology
The research community has employed multiple approaches to study arrowhead structures:

> [!method] Research Methods
> - 2D and 3D numerical simulations
> - Linear stability analysis
> - Flow visualization experiments
> - Polymer diffusion modeling

### What are arrowheads?

**Elastoinertial turbulence (EIT)** is a chaotic flow state in dilute polymer solutions that arises when fluid inertia and polymer elasticity jointly drive instabilities. In this regime, simulations have revealed distinctive **arrowhead-shaped coherent structures** (nicknamed “narwhal” structures for their horn-like appearance). These are highly organized patterns embedded within the turbulence, consisting of a polymer stress distribution coupled with a vortical flow pattern.

An arrowhead structure has
* **Localized polymer stretch:** a thin sheet of highly stretched polymer (high elastic stress) forming a triangular, arrowhead-like region spanning from the near-wall area to the channel center (symmetric about the mid-plane).
* **Flanking vortices:** a pair of counter-rotating vortices on either side of this polymer sheet. These vortices pull fluid (and polymers) up from the walls toward the center, feeding and elongating the polymer-rich “horn” of the arrowhead.
* **Coherent propagation:** the structure travels downstream as a **traveling wave**, maintaining its shape over time rather than dissipating like a random eddy.

### Why do arrowheads form?

Arrowhead structures emerge from a flow instability driven by polymer elasticity. At high Weissenberg number ($Wi$, dimensionless stress relaxation time $-$ high $Wi$ imply strong elastic effects) and moderate Reynolds number ($Re$), an otherwise laminar channel flow becomes unstable to disturbances at the channel center. This **center-mode instability** begins as a pattern of vortices and polymer stretch in the middle of the channel, which grows and nonlinearly saturates into the arrowhead form. Above a critical $Wi$, the flow spontaneously develops arrowhead patterns; at higher $Wi$, these patterns persist and can dominate as a stable wave. At sufficiently large $Wi$, the chaotic EIT can give way to a single steady arrowhead state, indicating that this coherent structure becomes a stable attractor when elasticity dominates.

**Polymer–flow coupling:** The self-sustaining nature of an arrowhead comes from a feedback loop between polymer stretching and fluid motion. The polymer’s evolution equation captures this interplay:

$$
\frac{D \mathbf{C}}{Dt} = \mathbf{C}\cdot(\nabla \mathbf{u})^T + (\nabla \mathbf{u})\cdot \mathbf{C} - \frac{1}{Wi}(\mathbf{C} - \mathbf{I})
$$
where $C$ is the polymer conformation tensor. In an arrowhead, the vortex pair generates strong shear and extensional flow that continuously amplifies polymer stretch along its arms. Because relaxation is slow at high $Wi$, a persistent high-tension polymer zone forms instead of relaxing away. That stretched-polymer zone exerts elastic stress back on the fluid, reinforcing the vortices that created it. Thus the vortices and polymer sheet sustain each other: the flow keeps the polymers stretched, and the polymer tension keeps the flow organized in the arrowhead pattern.

### Different types of arrowheads

![](_Media/Arrowheads-in-elastoinertial-turbulence-1740342415364.png)
Fig. Different realizations of arrowheads. Figure taken from [Y. Dubief, J. Page, R. R. Kerswell, V. E. Terrapon & V. Steinberg, Phys. Rev. Fluids, 7:7, 073301 (2022)](https://arxiv.org/pdf/2006.06770) 

### Why are arrowheads important?

Identifying arrowhead structures can be pivotal for understanding EIT. They are the viscoelastic analog of coherent structures in Newtonian turbulence (like near-wall streaks and rolls), providing a clear `skeleton` for the turbulence. This shows that EIT is not just random; it is built around repeatable polymer–flow patterns. Arrowhead structures also showcase a new route to sustain turbulence: they show that **elastic forces can maintain complex flow structures even at Reynolds numbers where a Newtonian flow would stay laminar**. Finally, they offer a bridge between regimes, connecting purely elastic turbulence ($Re ≈ 0$) with elastoinertial turbulence at higher $Re$ with $Wi \gg 1$.

## Numerical vs. Experimental Evidence: Do Arrowheads Exist in 3D or in Reality?

A critical question is whether these arrowhead structures are present in **3D flows** and experiments, or if they are artifacts of idealized 2D simulations. It has been claimed – and largely supported by evidence – that a single arrowhead wave _disappears_ in fully 3D simulations and has never been observed in experiments. Recent studies confirm that in a 3D domain, an arrowhead (narwhal) state is **linearly unstable** and quickly breaks down into turbulence. Morozov and co-workers performed a linear stability analysis of the 2D travelling-wave solution and found it unstable to spanwise perturbations when embedded in a 3D domain ([M. Lellep, M. Linkmann & A. Morozov, Proc. Natl. Acad. Sci., 121:9, e2318851121 (2024)](https://doi.org/10.1073/pnas.2318851121)). In other words, _“unlike 2D, in 3D the narwhal in a channel appears to become unstable, leading to chaotic flows”_. This means that a coherent arrowhead structure cannot persist as a steady state in a wide 3D channel; it inevitably triggers its own demise into disordered motion. Indeed, direct 3D simulations of EIT show the flow filled with multiscale, transient structures rather than a single arrowhead. The characteristic structures of 3D EIT are **sheet-like regions of high polymer stretch** and streamwise vortices (often aligned in the spanwise direction) $–$ no long-lived arrowhead pattern is evident. Experimentally, too, **no** arrowhead or narwhal-shaped structures have been directly observed. Laboratory studies (using techniques like flow visualization or velocimetry in polymer solutions) report chaotic fluctuations and elastic “sheets” of polymer stretch, but not a stable arrowhead wave. For example, experimental and high-Reynolds 3D DNS studies show polymers stretched in thin sheets inclined to the flow and emerging vortex tubes, with **no mention of a sustained arrowhead** structure. Recent research largely _supports_ these claims. The consensus is that the arrowhead/narwhal is a **2D artifact** in the sense that it cannot survive the spanwise degrees of freedom of a real 3D flow. Additionally, **no experimental evidence** of arrowheads has emerged, despite the intensive study of EIT in channels and pipes over the past decade – reinforcing the idea that such structures, if they form, are immediately disrupted in real flows. However, recent findings do _nuance_ this picture: even though a **stable** narwhal does not exist in 3D, researchers have noted that **transient** arrowhead-like patterns can _appear fleetingly_ within a 3D turbulent flow. For instance, simulations of low-Re viscoelastic turbulence sometimes display instantaneous polymer-stress contours resembling the arrowhead shape ([J. R. C. King, R. J. Poole, C. P. Fonte & S. J. Lind, arXiv:2501.09421 (2025)](https://arxiv.org/abs/2501.09421)). These transient appearances suggest that the arrowhead solution still exists as an organizing saddle or ephemeral structure in phase space, even if it’s not sustained. In summary, the latest evidence indicates that arrowhead/narwhal structures **do not persist** in fully 3D EIT or experiments – they are replaced by more complex chaotic dynamics – but they may manifest momentarily, hinting that they influence the flow as part of its underlying state space (rather than as an observable steady feature).

## Role of Diffusion, Resolution, and Modeling Choices: Physical Feature or Numerical Artifact?

The formation and persistence of arrowhead structures are highly sensitive to modeling choices like polymer diffusion and domain dimensionality, raising the question of whether these structures are genuine physical features or numerical artifacts. **Polymer stress diffusion** in particular plays a pivotal role. In simulations of viscoelastic fluids (Oldroyd-B or FENE-P models), a small artificial diffusion term is often added to the polymer constitutive equations for numerical stability. Recent work showed that even an _infinitesimal_ polymer diffusion can qualitatively change the flow’s stability characteristics. 

[M. Beneitez, J. Page, Y. Dubief & R. R. Kerswell, J. Fluid Mech., 981, A30 (2024)](https://doi.org/10.1017/jfm.2024.50) discovered a _polymer diffusive instability (PDI)_: with a nonzero diffusion, the laminar flow becomes linearly unstable, producing a small-scale traveling wave at the wall as the primary bifurcation. 
Notably, this instability does _not_ exist when polymer diffusion is strictly zero – the base flow would be linearly stable in the absence of diffusion. 
The implication is that the arrowhead structure in 2D simulations can arise from the PDI – essentially a numerical artifact of including diffusion. The diffusive term “triggers” a finite-amplitude arrowhead-like wave that would not naturally appear at that parameter set without diffusion. In reality, molecular diffusion of polymers is extremely small, so such an instability might never dominate the transition; the flow could bypass it via a subcritical route. Thus, one must be cautious: the beautiful arrowhead patterns seen in some simulations may owe their existence to an unphysically large diffusion or other numerical regularization. In that sense, they are partly a _numerical artifact_.

**Numerical resolution** and dimensionality further affect arrowhead formation. Insufficient resolution can introduce excessive numerical diffusion (smoothing out small scales), potentially _artificially stabilizing_ a large-scale structure like the arrowhead. Likewise, restricting the simulation to 2D (as was done in the initial arrowhead studies) removes the 3D disturbances that would break up the arrowhead. The 2D assumption is a strong modeling simplification that essentially _locks in_ the coherent structure. As [M. Lellep, M. Linkmann & A. Morozov, Proc. Natl. Acad. Sci., 121:9, e2318851121 (2024)](https://doi.org/10.1073/pnas.2318851121) note, one cannot draw reliable conclusions about EIT dynamics from strictly 2D simulations. In 2D, the narwhal is “benign” and can remain as a steady state, but this is sustained only because the normal 3D instability modes are disallowed. In a fully resolved 3D simulation, that arrowhead state sits on a razor’s edge – any slight spanwise perturbation will cause it to oscillate or breakdown. Thus, the arrowhead’s longevity in 2D is not reflective of physical reality; it’s a consequence of an artificially constrained simulation. On the other hand, it’s too strong to dismiss arrowheads entirely as a “mere artifact.” They are _mathematically legitimate_ nonlinear solutions of the viscoelastic flow equations (even if attained under special conditions) and they capture real physics – notably, a mechanism of polymer stretching and feedback. The consensus view is that arrowhead/narwhal structures are **embedded but unstable** features of the real system. They are “real” solutions, but one that the unconstrained system will only transiently visit. Diffusion and other numerical choices can exaggerate their prominence. In summary, high-fidelity simulations indicate that arrowheads do **not** represent a permanent physical flow pattern; rather, they are a byproduct of low-dimensional or diffusive modeling that nonetheless offer insight into the polymer–flow interactions in EIT.

## Conclusion
Recent research converges on a nuanced view of arrowhead (narwhal) structures in EIT. 
They were a landmark discovery as a coherent viscoelastic wave, and they have deepened our insight into polymer–flow interactions. However, both simulations and theory now indicate that they are **transient players** in fully developed 3D turbulence rather than the primary architects of it. In fact, the energy transfer analysis between flow and polymer reveals that both chaotic regimes maintain through the same near-wall mechanism, independent of the weak arrowhead structure. These findings indicate that the arrowhead represents a passive flow structure, detached from the self-sustaining mechanics of elastic turbulence inertia (EIT) ([M. Beneitez, J. Page, Y. Dubief & R. R. Kerswell, J. Fluid Mech., 981, A30 (2024)](https://doi.org/10.1017/jfm.2024.50)). The community’s focus has shifted to how such structures populate the state space and trigger transitions, rather than expecting them to appear as steady patterns in experiments. Ongoing work continues to unravel the multi-stage transition to elastic and elasto-inertial turbulence $–$ with arrowhead/narwhal waves serving as a valuable piece of the puzzle, albeit one with clear limitations. This critical understanding ensures that we appreciate the arrowhead structures for what they are: insightful and pedagogical solutions that illuminate EIT’s mechanics, but ultimately unstable in the wild chaos of real 3D turbulence.

--- 

> [!significance]- Metadata
> Author:: [Vatsal Sanjay](https://vatsalsanjay.com)
> Date published:: Feb 24, 2025

> [!meta] Back to main website
> [Home](https://comphy-lab.org/), [Team](https://comphy-lab.org/team), [Research](https://comphy-lab.org/research), [Github](https://github.com/comphy-lab), [Blogs](https://blogs.comphy-lab.org)