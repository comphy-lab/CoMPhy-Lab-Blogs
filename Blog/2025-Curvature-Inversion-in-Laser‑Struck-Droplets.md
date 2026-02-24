---
status: done ✅
publish: true
tags:
  - laser-droplet
  - EUV-lithography
  - tin
  - curvature
---
# Curvature Inversion in Laser‑Struck Droplets

> [!cite] 
> H. França, H. Schubert, O. Versolato & M. Jalaal, Laser-Induced Droplet Deformation: Curvature Inversion Explained from Instantaneous Pressure Impulse, J. Fluid Mech., 1020, A21 (2025). [DOI (OA): 10.1017/jfm.2025.10665](https://doi.org/10.1017/jfm.2025.10665)

## Context

Extreme‑ultraviolet (EUV) nanolithography relies on shaping a liquid tin microdroplet into a thin sheet with a nanosecond “prepulse”, then ablating that sheet with a second pulse to create the EUV‑emitting plasma. The fluid dynamics between those two laser hits matter: sheet curvature, thickness, and expansion rate all feed directly into plasma formation and light yield. A persistent puzzle has been that many experiments produce _forward‑bending_ sheets (curving away from the incoming beam), whereas standard theories—driven by Gaussian pressure impulses—predicted the opposite. A recent JFM paper by França _et al._ resolves this discrepancy by introducing a _raised‑cosine_ pressure impulse and a single width parameter that governs when the sheet flips from backward to forward curvature.

> [!summary] At a glance
> 
> - Key idea: The _kurtosis_ of the instantaneous pressure impulse controls the sign of the tin sheet’s curvature. Low‑kurtosis (raised‑cosine) impulses can bend the sheet forward; Gaussian impulses cannot.
>     
> - Switching knob: A dimensionless width (W) of the pressure impulse: curvature flips sign near ($W \approx 2$).
>     
> - Practical proxy: ($W$) correlates with the beam‑to‑drop size ratio ($d/D_0$); curvature inversion occurs experimentally at ($d/D_0 \approx 0.55$).
>     


## What’s new?

A one‑parameter impulse that explains both curvature regimes. The authors propose a raised‑cosine surface‑pressure impulse ($f(\theta)$) (truncated by a Heaviside function), tuned by a width ($W$). Unlike a Gaussian, the raised cosine is _platykurtic_ (negative excess kurtosis, about ($-0.59$)), i.e., a broad peak with short tails. That shape places momentum where it matters—wide enough to avoid over‑focusing at the pole, but not so wide that the impulse wraps the entire sphere and stalls expansion. With this single control (W), the simulations produce both backward (negative) and forward (positive) curvature and predict a sign change at ($W \simeq 2$).

A predictive diagnostic from the initial velocity field. By solving Laplace’s equation for the instantaneous pressure inside the drop and extracting the initial velocity via a Legendre‑series construction, the team shows that the _angle of maximum radial velocity_ ($\theta_\text{max}$) at ($t=0$) forecasts curvature: ($\theta_\text{max}<\pi/2$) → negative curvature; ($\theta_\text{max}>\pi/2$) → positive curvature. Gaussian impulses never push ($\theta_\text{max}$) beyond ($\pi/2$); raised‑cosine impulses do when ($W$) is large enough. This “early‑time” test lets practitioners vet a pressure impulse _without_ running a full DNS.


## How did they show it?

Direct numerical simulations with experimental anchoring. Using a VOF solver ([Basilisk C](http://basilisk.fr)) at very high resolution (quadtree level 14; minimum cell ($\Delta = 0.0012 R_0$), i.e., $\approx 833$ cells per radius), the authors integrate the incompressible two‑phase Navier–Stokes equations with surface tension, initializing the droplet with the instantaneous velocity field implied by the chosen impulse. They keep effective Reynolds and Weber numbers large (based on the expansion velocity) to focus on inertial sheet formation; the surrounding gas is modeled at a small density/viscosity ratio for numerical stability. The simulated morphologies are compared side‑by‑side with stroboscopic shadowgraphs of tin droplets under vacuum, across a sweep of beam sizes.

Mapping ($W$) to the lab’s beam‑to‑drop ratio. To connect simulation to experiment, they correlate the impulse width with the optical focusing parameter. The sheet curvature measured in experiments varies monotonically with ($d/D_0$) and flips sign near ($d/D_0 \approx 0.575$). A simple linear map, ($W \approx 4.4(d/D_0) - 0.5$), aligns the numerical and experimental curvature trends over the tested range; within that map, the curvature sign change at ($W \approx 2$) corresponds to ($d/D_0 \approx 0.55$). 


## Why does the raised cosine work?

The curvature outcome is set by _where_ the impulse deposits momentum:

- Gaussian (mesokurtic): widening the peak also lengthens the tails; the pressure effectively “wraps” the drop, leaving the region of strongest radial push _behind_ the equator ($\theta_{\max}<\pi/2$). Sheets bend back toward the source.
    
- Raised cosine (platykurtic): broad peak, short tails. For sufficiently large ($W$), the direction of maximum radial expansion shifts _beyond_ the equator ($\theta_{\max}>\pi/2$), driving the rim forward and producing positive curvature. The sign flip emerges around ($W \approx 2$). (See table 1 and the ($\theta_{\max}$) analysis.)
    

> [!note] Kurtosis as a design heuristic  
> Seeking forward curvature? Favor _low‑kurtosis_ impulses that are wide‑peaked but short‑tailed. The raised cosine is one smooth, tunable option—but other low‑kurtosis shapes should behave similarly.


## What does this mean for EUV source design?

- A controllable knob for sheet morphology. Because ($W$) correlates with optical focusing, curvature can be selected via the beam diameter relative to the droplet, with the transition near ($d/D_0 \approx 0.55$). This provides a practical handle to realize forward‑bending sheets—beneficial for subsequent plasma shaping and possibly for more uniform ablation by the second pulse. (See the regime map and time‑lapse comparisons.)
    
- Thickness distribution matters. Simulations indicate that larger ($W$) (unfocused, low‑kurtosis impulses) yield sheets with more uniform thickness across the span—attractive for even energy deposition. (Snapshots in figure 6 show this trend.)
    

> [!tip] Quick‑design recipe (from the paper’s workflow)
> 
> 1. Choose an impulse with _low kurtosis_ (e.g., raised cosine) and estimate ($W$) from the intended ($d/D_0$) using ($W \approx 4.4(d/D_0) - 0.5$).
>     
> 2. Compute the ($t=0$) velocity field and locate ($\theta_{\max}$).  
>      • If ($\theta_{\max}>\pi/2$) → expect forward curvature.  
>      • If ($\theta_{\max}<\pi/2$) → expect backward curvature.
>     
> 3. Only then run full DNS to refine thickness and late‑time rim dynamics.
>     


## Caveats and open questions

Despite the strong agreement on curvature, two gaps remain—useful pointers for future work:

1. Expansion vs. propulsion speed. In the simulations, positive‑curvature cases (large (W)) systematically produce low expansion‑to‑propulsion ratios ($\dot{R}_0/U_z<1$), whereas experiments sometimes show fast expansion _and_ positive curvature. Closing this gap likely requires more faithful modeling of the laser–plasma drive (e.g., via radiation‑hydrodynamics) or impulse shapes beyond the pure raised cosine.
    
2. Ambient medium and late‑time rims. Numerically, the surrounding “vacuum” must be given a tiny but finite density (e.g., $10^{-4}\rho_d$), which introduces slight drag and affects rim formation at late times; sensitivity sweeps suggest curvature trends are robust, but detailed rim physics—and any 3D asymmetries—are outside the axisymmetric model.
    

> [!warning] Outstanding physics to nail down
> 
> - Direct experimental inference of the instantaneous impulse profile (ion/charge diagnostics, angular momentum flux).
>     
> - Multi‑physics coupling (plasma expansion + incompressible hydrodynamics) to reconcile ($\dot{R}_0/U_z$) in the forward‑curvature regime.
>     
> - Fully 3D effects and fragmentation (beyond axisymmetry) at the sheet edge.
>     


## Perspective

França _et al._ put curvature control on a firm mechanistic footing: it is the _spatial statistics_ of the impulse—not merely its magnitude—that sets the sheet’s sign and shape. For engineers, the message is actionable: choose beam sizes (and therefore impulses) that place the maximum radial push beyond the equator; for theorists, the link between kurtosis and morphology suggests a compact language to classify laser–droplet interactions across materials and scales. The raised‑cosine model is not the final word on the impulse, but it provides a powerful organizing principle and a practical design rule for EUV source optimization.

---

> [!info] footnote
> Useful quantities and timescales: ( $\tau_p \sim 10,\mathrm{ns}$ ), ( $\tau_i = R_0/\dot{R}_0 \sim 100,\mathrm{ns}$ ), ( $\tau_c = \sqrt{\rho R_0^3/\gamma} \sim 10,\mu\mathrm{s}$ ) for tin; typical ($U_z$) and ($\dot{R}_0$) are ($\mathcal{O}(10^2),\mathrm{m,s^{-1}}$).

> [!cite] Source  
> H. França, H. Schubert, O. Versolato & M. Jalaal, Laser-Induced Droplet Deformation: Curvature Inversion Explained from Instantaneous Pressure Impulse, J. Fluid Mech., 1020, A21 (2025). [DOI (OA): 10.1017/jfm.2025.10665](https://doi.org/10.1017/jfm.2025.10665) Key details on the impulse definition, ($\theta_{\max}$) diagnostic, ($W \leftrightarrow d/D_0$) map, timescales, numerical setup, and limitations are summarized above; see in particular the introduction and figures 1–8, Appendix B (ambient effects), and Appendix E (velocity ratio).

--- 

> [!significance]- Metadata
> Author:: [Vatsal Sanjay](https://comphy-lab.org/VatsalSy)<br>
> Date published:: Oct 6, 2025

> [!meta] Back to main website
> [Home](https://comphy-lab.org/), [Team](https://comphy-lab.org/team), [Research](https://comphy-lab.org/research), [Github](https://github.com/comphy-lab), [Blogs](https://blogs.comphy-lab.org)
>
> 📝 [Edit this page on GitHub](https://github.com/comphy-lab/CoMPhy-Lab-Blogs/blob/main/Blog/2025-Curvature-Inversion-in-Laser‑Struck-Droplets.md)