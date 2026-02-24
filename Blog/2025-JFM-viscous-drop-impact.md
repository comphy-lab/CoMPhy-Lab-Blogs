---
status: done ✅
publish: true
tags:
  - dropImpact
  - viscous
  - WorthingtonJets
---
# The role of viscosity on drop impact forces on non-wetting surfaces: From Raindrops to Inkjet Printing

When a liquid drop hits a surface, the impact creates fascinating fluid dynamics that are crucial for applications ranging from inkjet printing to agricultural sprays. In this work, we uncover how a liquid's viscosity dramatically affects the forces generated during these impacts. Let's explore the key findings.

![[_Media/JFM-viscous-drop-impact-blog-1740211822831.png]]

> [!tldr] TL;DR
> Viscosity alters the forces a liquid drop exerts when it strikes a non-wetting surface, shifting the balance from inertia-dominated (like water) to enhanced viscous effects (like honey). Two force peaks arise: one at the initial impact and another tied to the Worthington jet just before bounce. Dimensionless numbers (Weber and Ohnesorge) govern these regimes, showing why higher-viscosity drops can yield unexpectedly large forces. The findings unify scaling laws across viscosities, guiding applications in printing, agriculture, and beyond, and pointing to future inquiries on soft surfaces and non-Newtonian fluids.

## The Basics: What Happens When a Drop Hits a Surface?

> [!note] Key Point
> On a non-wetting surface, a drop goes through distinct phases: impact, spreading, retracting, and sometimes bouncing off. During this process, the surface experiences varying forces that can now be precisely measured and predicted.

The impact process reveals two distinct force peaks:
1. An initial peak when the drop first hits
2. A second peak just before the drop potentially bounces off

What makes this especially interesting is how these forces change based on two key properties:
- Weber number ($We = \rho V_0^2D_0/\gamma$): Measures the dimensionless kinetic energy of the impacting drop.
- Ohnesorge number ($Oh = \eta/\sqrt{\rho\gamma D_0}$): Represents the dimensionless viscosity of the impacting drop.

## The First Impact: A Tale of Two Regimes

> [!important] First Peak Findings
> The study reveals that the first impact force follows distinctly different patterns depending on the liquid's viscosity:
> - For low viscosity liquids (like water), the force mainly depends on inertia
> - For high viscosity liquids (like honey), viscous effects create stronger forces than expected

### Low Viscosity Behavior
For liquids with low viscosity ($Oh < 0.1$), the first impact force ($F_1$) scales with the inertial force:

$$
F_1 \sim \rho V_0^2D_0^2
$$

where $\rho$ is density, $V_0$ is impact velocity, and $D_0$ is drop diameter. This relationship holds remarkably well for viscosities up to 100 times that of water!
### High Viscosity Surprises
When viscosity becomes significant ($Oh > 0.1$), the force increases beyond what inertia alone would predict:

$$
F_1 \sim \rho V_0^2D_0^2\sqrt{Oh}
$$

This enhancement occurs because viscous forces resist the drop's deformation, leading to higher impact pressures.

## The Second Peak: Worthington Jets and Bouncing

> [!note] Worthington Jet
> The second force peak coincides with a fascinating phenomenon called a Worthington jet - a thin liquid column that can shoot upward just before the drop bounces off.

The second peak reveals an intricate balance between different forces:
- For low viscosity and high speed impacts: Force scales with inertia
- For low speed impacts: Surface tension dominates
- At a special condition ($We \approx 9$, $Oh < 0.01$): A `singular` jet forms with surprisingly high forces

![[_Media/JFM-viscous-drop-impact-blog-1740211923766.png]]
## Practical Implications

> [!important] Applications
> These findings have direct applications in:
> - Inkjet printing: Controlling droplet behavior
> - Agricultural sprays: Optimizing pesticide application
> - Respiratory disease transmission: Understanding droplet impacts
> - Industrial cooling: Enhancing heat transfer through controlled droplet impacts

## Future Research Directions

This work opens several interesting avenues for future investigation:
- Unifying theories for maximum spread diameter across all viscosities
- Understanding impact forces on soft or compliant surfaces
- Extending findings to non-Newtonian fluids like polymer solutions

## Technical Significance

> [!note] For the technically inclined
> The study provides a comprehensive framework for predicting impact forces through dimensionless numbers and scaling laws.

For researchers working in this field, the paper presents new scaling laws that unify previous observations and provide a foundation for future work. The careful experimental validation combined with theoretical analysis makes this a significant contribution to our understanding of drop impact dynamics.

> [!faq] Original Paper
> V. Sanjay, B. Zhang, C. Lv & D. Lohse, The role of viscosity on drop impact forces, J. Fluid Mech., 1004, A6 (2025) [Open Access](https://doi.org/10.1017/jfm.2024.982). 

## Cover of J. Fluid Mech. vol 1004

![[_Media/JFM-viscous-drop-impact-blog-1740211513533.jpg]]

## Videos

<div style="text-align: center;">
    <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/videoseries?si=QMxaPdi_C66h2dC4&amp;list=PLf5C5HCrvhLH8BwyeMSusdvyFmQYGP2qt" 
        title="YouTube video player" frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
    </iframe>
</div>

---

> [!significance]- Metadata
> Author:: [Vatsal Sanjay](https://vatsalsanjay.com)
> Date published:: Feb 22, 2025

> [!meta] Back to main website
> [Home](https://comphy-lab.org/), [Team](https://comphy-lab.org/team), [Research](https://comphy-lab.org/research), [Github](https://github.com/comphy-lab), [Blogs](https://blogs.comphy-lab.org)
>
> 📝 [Edit this page on GitHub](https://github.com/comphy-lab/CoMPhy-Lab-Blogs/blob/main/Blog/2025-JFM-viscous-drop-impact.md)