---
tags:
  - Fluid-dynamics
  - Bubbles
  - Pinch-off
  - Viscoelasticity
  - Polymers
  - Basilisk
publish: false
status: Working 🏗️
aliases:
  - Elastic Bubble Pinch-Off
  - Blog/How Elasticity Affects Bubble Pinch-Off
---

# Why Dilute Polymers Arrest a Pinching Drop but Not a Bubble

Add a minute amount of long polymer to water and a pinching drop stops behaving like water. The liquid neck refuses to snap, leaving a thin filament that can survive long enough to form the familiar beads-on-a-string structure. A dilute bubble neck looks like the same problem with air and liquid exchanged, yet it still collapses almost as if the polymers were absent.

That difference is the subject of our recent paper with Coen Verschuur, Alexandros Oratis and Jacco Snoeijer, [*How elasticity affects bubble pinch-off*](https://arxiv.org/abs/2511.20075v1). The experiments, Basilisk simulations and theory point to one mechanism: polymers are stretched in different directions around a drop and a bubble. The resulting elastic stresses diverge at different rates.

> [!abstract] TL;DR
> - Dilute polymers arrest drop pinch-off but do not arrest bubble pinch-off.
> - In a liquid thread, axial polymer stress grows as $G(h_0/h)^4$ and overtakes capillarity.
> - Around a collapsing air neck, radial polymer stress grows only as $G(h_0/h)^2$, the same rate as the inertial stress.
> - Visible air threads appear only near and above polymer overlap, where their lifetime and breakup depend strongly on needle diameter.
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

The difference becomes decisive once the liquid contains polymers.

## The Stress Race

In a thinning liquid thread, material elements are stretched along the axis. An Oldroyd-B description gives the dominant polymeric tensile stress as

$$
\sigma_{zz}\sim G\left(\frac{h_0}{h}\right)^4,
$$

where $G$ is the polymer elastic modulus and $h_0$ is the initial neck radius. Capillary stress grows only as $\gamma/h$. The elastic stress therefore catches and overtakes capillarity, arresting the Newtonian singularity at a filament radius

$$
h_{\min}\sim h_0\left(\frac{Gh_0}{\gamma}\right)^{1/3}.
$$

Stress relaxation subsequently allows this filament to thin exponentially on the polymer relaxation time.

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

*Drop versus bubble pinch-off, adapted from our broader review of singularities in soft matter. The upper rows compare Newtonian and elastic simulations; the lower panels show why polymer stress overtakes capillarity in a drop but remains a fixed ratio below inertia in a bubble. Colour indicates velocity magnitude.*

This is the useful singularity viewpoint. A diverging stress need not control the dynamics. Its direction, amplification exponent and competitor matter more than the word “divergent”.

## What the Camera Saw

The experimental campaign at Twente used aqueous polyethylene-oxide solutions with molecular weights $2.0\times10^6$ and $4.0\times10^6\,\mathrm{g\,mol^{-1}}$. Polymer concentration ranged from $0$ to $1\,\mathrm{wt.\%}$ and the needle diameter from $0.41$ to $1.54\,\mathrm{mm}$. Bubble necks were recorded at $400{,}000$ frames per second with a spatial resolution of $1.0\,\mu\mathrm{m/pixel}$.

The initial collapse changed little when polymer was added. Differences appeared only near the time at which a Newtonian neck would have pinched. At high concentrations, the collapsing neck left a very thin air thread. In the dilute regime, no thread could be resolved.

The contrast with drop pinch-off is stark:

- The initial liquid thread is about one tenth of the needle width; the air thread is closer to one hundredth.
- A $1/32\,\mathrm{wt.\%}$ solution of the $4.0\times10^6\,\mathrm{g\,mol^{-1}}$ PEO produced no visible bubble thread, while drop pinch-off responds at concentrations as small as $1/100\,\mathrm{wt.\%}$.
- Bubble threads are much shorter-lived than liquid threads.

The $1\,\mu\mathrm{m}$ optical resolution cannot rule out an even finer dilute air thread. That is why the numerical and analytical parts of the paper matter: both recover the absence of elastic arrest without relying on whether a camera can see the last micron.

## Needle Size Changes the Ending

At high polymer concentration, the air thread is not governed by one universal exponential thinning law. The outer geometry remains visible in the dynamics.

With the largest needle, $d=1.54\,\mathrm{mm}$, the thread rebounds during the Newtonian-to-viscoelastic transition and fragments into satellite bubbles over roughly $400\,\mu\mathrm{s}$. The rapid widening locally compresses the air thread and appears to trigger the instability.

With the smallest needle, $d=0.41\,\mathrm{mm}$, this compression is absent. The thread persists for milliseconds, ruptures near the needle and retracts upwards towards the parent bubble. Increasing concentration lengthens the thread lifetime for the $0.41$ and $0.51\,\mathrm{mm}$ needles, but shortens it for the $0.85$ and $1.54\,\mathrm{mm}$ needles.

This sensitivity is not a minor correction. It prevents the bubble thread from serving as a dilute-solution relaxation-time measurement by simply borrowing the exponential law used for liquid filaments.

## A Deliberately Unfair Test of Elasticity

The simulations make the comparison as favourable to elasticity as possible. They solve the Oldroyd-B equations in the limit $De\to\infty$, so the polymers never relax and retain perfect memory of the deformation. The air and liquid necks begin as sinusoidally perturbed cylinders in axisymmetric periodic domains, with a volume-of-fluid interface and adaptive refinement down to $h_0/2048$.

Even under this maximum-memory test, the elastic bubble pinches almost like the Newtonian bubble. The equivalent elastic drop arrests into a stationary filament.

The analytical cavity model explains the numerical result without adjustable parameters. Radial and azimuthal stresses from the model agree with the full axisymmetric simulations, while the axial stress remains subdominant. The weak influence of elasticity is therefore not a numerical failure to generate polymer stress; it is the consequence of how the bubble flow stretches the polymers.

## What Remains Open

The dilute problem is now reasonably clean. Oldroyd-B, Basilisk and the cylindrical-cavity theory agree that polymer stress remains below inertia throughout bubble collapse.

The visible air threads belong to a different regime. They appear when polymer coils begin to overlap, outside the dilute assumptions of Oldroyd-B, and their breakup remembers the needle size. A predictive description will need a constitutive model that can represent concentrated solutions, finite extensibility and the flow history imposed by the complete needle-fed geometry.

That makes bubble pinch-off a poor copy of dilute filament-stretching rheometry, but potentially a useful probe of more concentrated polymer solutions. The difficult part is also the interesting part: once overlap is reached, the thread carries both material memory and geometric memory.

## A Broader Singularity Lesson

Drop and bubble pinch-off perform the same topological act while selecting different mechanics. In the drop, axial stretching amplifies polymer stress faster than capillarity and the singularity is arrested. In the bubble, radial stretching amplifies elastic and inertial stresses together, so their hierarchy is preserved all the way down.

The local neck shape alone does not identify the controlling physics. One must ask which phase carries the inertia, which way material elements stretch, and which stress grows fastest as $h\to0$. That is why exchanging “liquid” and “air” changes the answer.

## Paper and Code

- C. I. Verschuur, A. T. Oratis, V. Sanjay & J. H. Snoeijer, [*How elasticity affects bubble pinch-off*](https://arxiv.org/abs/2511.20075v1), arXiv:2511.20075v1.
- Open Basilisk implementation: [comphy-lab/ElasticPinchOff](https://github.com/comphy-lab/ElasticPinchOff).
