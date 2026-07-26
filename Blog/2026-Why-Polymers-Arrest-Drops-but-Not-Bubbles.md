---
tags:
  - Fluid-dynamics
  - Bubbles
  - Pinch-off
  - Viscoelasticity
  - Polymers
  - Basilisk
publish: true
status: Working 🏗️
aliases:
  - Elastic Bubble Pinch-Off
  - Blog/How Elasticity Affects Bubble Pinch-Off
---

# Why Dilute Polymers Arrest a Pinching Drop but Not a Bubble

Add a minute amount of long polymer to water and a pinching drop stops behaving like water. The liquid neck refuses to snap, leaving a thin filament that can survive long enough to form the familiar beads-on-a-string structure. A dilute bubble neck looks like the same problem with air and liquid exchanged, yet it still collapses almost as if the polymers were absent.

Our recent paper with Coen Verschuur, Alexandros Oratis and Jacco Snoeijer, [*How elasticity affects bubble pinch-off*](https://link.aps.org/doi/10.1103/5sp3-k5l2) [(OA)](https://arxiv.org/abs/2511.20075v1) uses experiments, Basilisk simulations and theory to show that when polymers are stretched in different directions around a drop and a bubble, the resulting elastic stresses diverge at different rates.

> [!abstract] TL;DR
> - Dilute polymers arrest drop pinch-off but do not arrest bubble pinch-off in the inertial limit.
> - In a liquid thread, axial polymer stress grows as $G(h_0/h)^4$ and overtakes capillarity.
> - Around a collapsing air neck, radial polymer stress grows only as $G(h_0/h)^2$, the same rate as the inertial stress.
> - The [Basilisk code is openly available](https://github.com/comphy-lab/ElasticPinchOff).

## The Same Outline Hides Two Singularities

Pinch-off drives a neck radius $h(t)$ towards zero at a finite time $t_0$. For an inviscid liquid drop, capillary pressure accelerates liquid out of the neck and inertia resists that motion. The balance gives

$$
h \propto (t_0-t)^{2/3}.
$$

A bubble pinches by a different route. The surrounding liquid rushes radially inwards and collapses the air cavity; surface tension becomes subdominant during the final stage. To leading order,

$$
h \propto (t_0-t)^{1/2},
$$

with logarithmic corrections from the outer liquid flow. Experiments commonly measure effective exponents around $0.56$. The two necks look similar, but the inertia-carrying phase and the dominant direction of motion have changed.

The difference becomes apparent once the liquid contains polymers.

## The Stress Race

In a thinning liquid thread, material elements are stretched along the axis. An Oldroyd-B description gives the dominant polymeric tensile stress as

$$
\sigma_{zz}\sim G\left(\frac{h_0}{h}\right)^4,
$$

where $G$ is the polymer elastic modulus and $h_0$ is the initial neck radius. Capillary stress grows only as $\gamma/h$. The elastic stress therefore catches and overtakes capillarity, arresting the Newtonian singularity at a filament radius

$$
h_{\min}\sim h_0\left(\frac{Gh_0}{\gamma}\right)^{1/3}.
$$

If stress relaxation is introduced, it subsequently allows this filament to thin exponentially on the polymer relaxation time.

The polymers surrounding a bubble are pulled mainly towards the collapsing cavity, in the radial direction. A cylindrical-cavity calculation instead gives

$$
\sigma_{rr}\sim G\left(\frac{h_0}{h}\right)^2.
$$

This stress still diverges. It simply does not win. For inertial bubble collapse, $h\sim(B(t_0-t))^{1/2}$, so

$$
\rho\dot h^2\sim\frac{\rho B^2}{h^2}.
$$

Elastic and inertial stresses grow with the same $1/h^2$ dependence. If elasticity is below inertia when the collapse begins, their ratio stays fixed as the neck shrinks. There is no late-stage crossover analogous to the drop.

![[2026-Elastic-Bubble-Pinchoff-Drop-Bubble-Comparison.png]]

*Drop versus bubble pinch-off. The upper rows compare Newtonian and elastic simulations; the lower panels show why polymer stress overtakes capillarity in a drop but remains a fixed ratio below inertia in a bubble. Colour indicates velocity magnitude.*


## What the Camera Saw

The experimental campaign at Univ. Twente used aqueous polyethylene-oxide solutions with molecular weights $2.0\times10^6$ and $4.0\times10^6\,\mathrm{g\,mol^{-1}}$. Polymer concentration ranged from $0$ to $1\,\mathrm{wt.\%}$ and the needle diameter from $0.41$ to $1.54\,\mathrm{mm}$. Bubble necks were recorded at $400{,}000$ frames per second with a spatial resolution of $1.0\,\mu\mathrm{m/pixel}$.

The initial collapse changed little when polymer was added. Differences appeared only near the time at which a Newtonian neck would have pinched. At high concentrations, the collapsing neck left a very thin air thread. In the dilute regime, no thread could be resolved.

The contrast with drop pinch-off is remarkable:

- The initial liquid thread is about one tenth of the needle width; the air thread is closer to one hundredth.
- A $1/32\,\mathrm{wt.\%}$ solution of the $4.0\times10^6\,\mathrm{g\,mol^{-1}}$ PEO produced no visible bubble thread, while drop pinch-off responds at concentrations as small as $1/100\,\mathrm{wt.\%}$.
- Bubble threads are much shorter-lived than liquid threads.

The $1\,\mu\mathrm{m}$ optical resolution cannot rule out an even finer dilute air thread. That is why the numerical and analytical parts of the paper are crucial as they recover the absence of elastic arrest without relying on whether a camera can see the last micron.

## A Deliberately Unfair Test of Elasticity

The simulations make the comparison as favourable to elasticity as possible. They solve the Oldroyd-B equations in the limit of infinite relaxation times (elastic stresses once developed never relax, $De\to\infty$). That is, the polymers never relax and retain perfect memory of the deformation. The air and liquid necks begin as sinusoidally perturbed cylinders in axisymmetric periodic domains which is assumed to be the `stress-free` configuration.

Even under this maximum-memory test, the elastic bubble pinches almost like the Newtonian bubble. The equivalent elastic drop arrests into a stationary filament.

The analytical cavity model explains the numerical result without adjustable parameters. Radial and azimuthal stresses from the model agree with the full axisymmetric simulations, while the axial stress remains subdominant. The weak influence of elasticity is therefore not a numerical failure to generate polymer stress; it is the consequence of how the bubble flow stretches the polymers.

## Open question

Our analysis is restricted to dilute polymer solutions. In this regime, Oldroyd-B simulations in Basilisk and the cylindrical-cavity theory show that polymer stresses remain subdominant to the inertial stress throughout bubble collapse.

The visible air threads arise only when polymer coils begin to overlap, beyond the dilute regime described by Oldroyd-B. Their lifetime and breakup mode then depend strongly on the needle diameter. Predicting this regime will require a constitutive law for concentrated solutions with finite chain extensibility, coupled to the complete needle-fed geometry that determines the polymer deformation history before and during pinch-off.

The exponential thinning law for liquid filaments therefore cannot be transferred directly to bubble pinch-off. Above the overlap concentration, bubble pinch-off may instead probe concentrated polymer dynamics, provided that the needle diameter and the preceding flow history are treated as control parameters.

## A Broader Singularity Lesson

Drop and bubble pinch-off perform the same topological transformation while selecting different mechanics. In the drop, axial stretching amplifies polymer stress faster than capillarity and the singularity is arrested. In the bubble, radial stretching amplifies elastic and inertial stresses together, so their hierarchy is preserved all the way down.

The same selection principle appears in [self-similar Worthington jets](https://arxiv.org/abs/2607.08972). Capillarity and viscosity determine whether the evolving cavity reaches a geometry capable of singular focusing. Once an inertial similarity window exists, the local collapse forgets how that geometry was prepared and converges to a self-similar Euler solution. This universality is geometry-selected rather than absolute: for a conical cavity, the inherited semiangle $\beta$ fixes the member of the similarity family and therefore its exponent.

The local neck shape alone does not identify the controlling physics. One must ask which phase carries the inertia, which way material elements stretch, and which stress grows fastest as $h\to0$. That is why exchanging “liquid” and “air” changes the answer.

## Paper and Code

- C. I. Verschuur, A. T. Oratis, V. Sanjay & J. H. Snoeijer, *How elasticity affects bubble pinch-off*, [*Physical Review Fluids* **11**, 073302 (2026)](https://link.aps.org/doi/10.1103/5sp3-k5l2). [arXiv:2511.20075v1](https://arxiv.org/abs/2511.20075v1) (open-access version).
- Open Basilisk implementation: [comphy-lab/ElasticPinchOff](https://github.com/comphy-lab/ElasticPinchOff).
