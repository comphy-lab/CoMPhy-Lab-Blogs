---
modified: 2025-10-30T11:38:30+00:00
created: 2025-05-06T11:33:34+02:00
status: Working 🏗️
publish: false
tags:
  - burstingBubbles
  - WorthingtonJets
---
# Viscoelastic Worthington Jets & Droplets: Breaking the Surface of Bubble Physics

> [!abstract] TL;DR 
> When bubbles burst at a liquid surface, they create jets and droplets through a fascinating physical process. Our research reveals how adding polymers to the liquid dramatically changes this behavior, creating three distinct regimes depending on elasticity and relaxation time. These findings have implications for everything from oceanic aerosols to biomedical applications and industrial processes.

Have you ever watched a bubble pop at the surface of your sparkling water or champagne? This seemingly simple event $-$ a bubble bursting $-$ conceals rich physics that connects to remarkably diverse phenomena, from ocean spray formation to pathogen transmission in respiratory droplets.

As a fluid dynamicist studying interfacial phenomena, I've long been fascinated by what happens in the fleeting moments after a bubble bursts. When a bubble at a liquid–air interface bursts, it often shoots out a thin, fast jet of liquid – a striking phenomenon known as a _Worthington jet_. This process isn’t just a neat visual; it plays a role in everything from ocean spray to the fizz in a glass of champagne. In a typical Newtonian fluid like water (where the liquid’s viscosity is constant), a bursting bubble leads to an upward jet driven by surface tension. As the jet rises, it can break up into one or multiple tiny droplets due to the Rayleigh–Plateau instability (the same mechanism that causes a stream of water to form droplets). This is the classic picture that decades of research established for bursting bubbles in simple liquids. But what happens if the liquid is not so simple – say it contains a bit of polymer or has elastic properties? It turns out the story of bubble bursting gets a lot more interesting, which is what our study explores.

## The Phenomenon: More Than Just a Pop

When a bubble bursts at a liquid surface, it doesn't simply disappear. Instead, a complex sequence unfolds in milliseconds:

1. The bubble's thin film ruptures[^1][^2]
2. Capillary waves travel along the cavity surface[^3]
3. These waves converge at the bottom of the cavity
4. This convergence creates a focused flow that forms an upward-shooting "Worthington jet" [^4][^5][^6]
5. This jet may break into droplets that escape into the air

While this process is relatively well-understood for simple liquids like water (Newtonian fluids), many real-world scenarios involve liquids containing polymers—from biological fluids to industrial solutions. Our research investigated how these polymers fundamentally alter the bubble bursting dynamics. See [[2025-History-Worthington-jets-from-bursting-bubbles]] for historical context. 

## The Physics at Play: A Dance of Forces

> [!note] What makes a fluid viscoelastic? 
> Viscoelastic fluids contain polymers—long molecular chains that introduce elastic behavior. Unlike ordinary liquids that simply flow, these fluids partially "remember" their shape when deformed, similar to a memory foam mattress, but in liquid form!

The addition of polymers introduces two key parameters beyond the conventional Ohnesorge number (which relates viscous forces to inertial and surface tension forces):

1. Elastocapillary number $Ec$: The ratio of elastic modulus to Laplace pressure, measuring the strength of elastic effects.
   $$Ec = \frac{GR_0}{\gamma} $$
2. Deborah number $De$: The ratio of relaxation time to process time, measuring the fluid's "memory".
   $$De = \frac{\lambda}{\sqrt{\rho R_0^3/\gamma}}$$

> [!note] Note:
> - Higher $Ec$ means stronger elastic effects
> - Higher $De$ means the fluid "remembers" deformations longer

## Key Discoveries: Three Distinct Regimes

Our most fascinating finding was the emergence of three distinct regimes:

> [!important] The Three Regimes
> 
> 1. Jets forming droplets: At low elasticity or fast relaxation times, similar to Newtonian behavior but with modified dynamics
> 2. Jets without droplet formation: At intermediate elasticity, where polymeric stresses suppress droplet breakup
> 3. Complete jet suppression: At high elasticity, where polymer stresses prevent jet formation entirely

What's particularly interesting is how these regimes depend on the Deborah number. For high De (approaching infinity), the viscoelastic medium preserves memory of deformations, and transitions occur at sharp Ec thresholds. For low De (approaching zero), the system behaves more like a Newtonian fluid with enhanced effective viscosity.

The critical thresholds we identified provide fundamental insights into when and how polymers influence Worthington jets and droplets. Remarkably, while viscoelasticity significantly alters the jet dynamics, it doesn't affect the capillary wave speed!

## Implementation Details: ElastoFlow Framework

To conduct these simulations, we developed a framework we call "ElastoFlow" for the Basilisk C environment. The implementation handles the complex interplay between viscoelasticity, surface tension, and inertia through:

- Volume of Fluid (VoF) method for interface tracking
- Log-conformation approach for numerical stability with viscoelastic constitutive models
- Adaptive Mesh Refinement for efficiently capturing multiscale dynamics

> [!tip] Technical Deep Dive Our computational approach overcomes the notorious "high Weissenberg number problem" that has historically plagued viscoelastic simulations. The log-conformation formulation we employed maintains the positive-definiteness of the conformation tensor, enabling stable simulations even in highly elastic regimes.

## Broader Implications: Beyond the Laboratory

This research has implications across several domains:

- Oceanic aerosol formation: Understanding how polymers in seawater affect bubble bursting could improve climate models
- Biomedical applications: Insights into how biological fluids produce droplets could help control pathogen transmission
- Industrial processes: Better design of polymer-containing sprays and foams

The ability to predict and potentially control droplet formation by adjusting polymer properties opens new avenues for engineering applications.

## For Fellow Researchers

If you're interested in exploring this topic further, our simulation code is available on GitHub. We've designed ElastoFlow to be extensible and adaptable to various viscoelastic problems beyond bubble bursting.

The framework includes:

- Comprehensive implementation of the Oldroyd-B model
- Adaptable boundary conditions
- Detailed error controls for fluid properties
- Streamlined workflows for high-performance computing environments

We're continuing to develop this research direction, and we welcome collaborations and extensions of this work.

## Final Thoughts

What I find most fascinating about this study is how the addition of polymers—molecular chains that introduce elasticity—can fundamentally transform fluid behavior in ways that aren't immediately intuitive. A small amount of polymer can completely suppress droplet formation, or in some regimes, enhance it.

This work highlights the rich interplay between elasticity, viscosity, and surface tension at fluid interfaces. Each time I watch a bubble burst in slow motion with our simulations, I'm reminded of how complex and beautiful fluid dynamics can be, even in seemingly simple phenomena we observe every day.

For those interested in the technical details, please check out our paper and the available code repositories. And as always, I welcome questions and discussions about this fascinating corner of fluid dynamics!

> [!faq] Original Paper
> A. Dixit, A. Oratis, K. Zinelis, D. Lohse & V. Sanjay, Viscoelastic Worthington jets and droplets produced by bursting bubbles, J. Fluid Mech., 1010, A2 (2025) [Open Access](https://doi.org/10.1017/jfm.2025.237). 

## Videos

<div style="text-align: center;">
    <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/videoseries?si=dMVXF3a7R11NPZ6i&amp;list=PLf5C5HCrvhLEOMH9JaHJg67G5nx5ffiuN" 
        title="YouTube video player" frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
    </iframe>
</div>

---

[^1]: V. Sanjay, U. Sen, P. Kant & D. Lohse, Taylor--Culick retractions and the influence of the surroundings, J. Fluid Mech., 948, A14 (2022), [doi: 10.1017/jfm.2022.671](https://doi.org/10.1017/jfm.2022.671)

[^2]: E. Villermaux, Fragmentation versus cohesion, J. Fluid Mech., 898, P1 (2020), [doi: 10.1017/jfm.2020.366](https://doi.org/10.1017/jfm.2020.366)

[^3]: V. Sanjay, D. Lohse & M. Jalaal, Bursting bubble in a viscoplastic medium, J. Fluid Mech., 922, A2 (2021), [doi: 10.1017/jfm.2021.489](https://doi.org/10.1017/jfm.2021.489)

[^4]: A. M. Worthington, On the forms assumed by drops of liquids falling vertically on a horizontal plate, Proc. R. Soc. London A, 25, 261-272 (1877), [doi: 10.1098/rspl.1876.0048](https://doi.org/10.1098/rspl.1876.0048)

[^5]: A. M. Worthington, A second paper on the forms assumed by drops of liquids falling vertically on a horizontal plate, Proc. R. Soc. London, 25, 498-503 (1877), [doi: 10.1098/rspl.1876.0073](https://doi.org/10.1098/rspl.1876.0073)

[^6]: A. M. Worthington, A study of splashes, London: Longman, Green and Co (1908), [link](https://bit.ly/Worthington-splash-book)

---

> [!significance]- Metadata
> Author:: [Vatsal Sanjay](https://vatsalsanjay.com)
> Date published:: May 6, 2025

> [!meta] Back to main website
> [Home](https://comphy-lab.org/), [Team](https://comphy-lab.org/team), [Research](https://comphy-lab.org/research), [Github](https://github.com/comphy-lab), [Blogs](https://blogs.comphy-lab.org)