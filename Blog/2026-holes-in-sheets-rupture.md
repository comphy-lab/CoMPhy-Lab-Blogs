---
status: Working 🏗️
publish: false
tags:
  - Sheets
  - Rupture
  - Soft-matter-singularities
  - Fluid-dynamics
  - Basilisk
---

# When a Sheet Decides to Tear: The Double Threshold

A soap bubble, stretched thin by drainage, suddenly sprouts a hole that races outward in a fraction of a second. A cough sends a mucus film billowing into a bag-like sheet that shatters into virus-laden droplets. Rain strikes a lake and a crown of liquid, stretched impossibly thin, perforates before your eye can follow. These events share a deceptively simple question: **what makes a thin liquid film decide to break rather than heal?**

The classical answer invokes molecular forces — van der Waals attractions reaching across the last few nanometres of film. But here is the puzzle: experiments consistently show that films rupture at *micrometre* thicknesses, orders of magnitude before nanoscale forces should matter. Something else is doing the deciding.

> [!abstract] TL;DR
> - Micrometer-thick liquid sheets perforate via a **deterministic double threshold** — *not* through random molecular fluctuations
> - Rupture requires two conditions simultaneously: strong enough outward driving AND a sufficiently distorted defect (entrained air bubble)
> - Below either threshold, surface tension heals the cavity and the sheet reseals
> - The healing timescale is set by the inertia–viscosity balance: fast ($t_c \sim \tau_\gamma$) at low viscosity, slow ($t_c \sim \tau_\gamma \, Oh$) at high viscosity
> - This framework predicts and controls breakup in spray formation, wave breaking, and respiratory film fragmentation

## The Mechanism That Was Missing

Holes in real films nucleate at *defects* — entrained air bubbles, oil droplets, impurities. This has been observed for decades in Savart sheets, in splash crowns, in respiratory films. But how exactly does a bubble trigger irreversible rupture rather than a momentary dimple that closes back? The pathway was unresolved because nucleation events are extraordinarily fast and difficult to isolate experimentally.

We tackled this computationally. Using direct numerical simulations with [[Basilisk C]], we modelled a radially draining liquid sheet of thickness $h_0$ with an entrained air bubble of radius $R_0$ at its centre. The drainage velocity $u(r) = \omega r$ mimics both external-airflow forcing (as in bag breakup during a cough) and inertia-driven drainage (as after drop impact on a liquid pool). Three dimensionless numbers govern the problem:

$$Oh = \frac{\eta}{\sqrt{\rho \gamma R_0}}, \quad Bo = \frac{\rho \omega^2 R_0^3}{\gamma}, \quad \frac{\chi}{R_0}$$

where $Oh$ is the Ohnesorge number (viscosity vs. inertio-capillary forces), $Bo$ is the Bond number (drainage driving vs. surface tension), and $\chi/R_0$ is the bubble offset. An additional parameter $\theta$ — the opening angle of the initial cavity — encodes delayed nucleation from chemical or thermal heterogeneity.

## A Phase Boundary With Two Keys

As the sheet thins, its top and bottom interfaces converge at the bubble poles and form a through-cavity. What happens next?

- 🔑 **Key finding 1 — Healing or opening?** Capillary waves invert the cavity. Then two outcomes: rims retract outward and the hole expands irreversibly, *or* capillarity drives the rims back together and the sheet heals. The outcome is **not random** — it is deterministic.

- 🔬 **Key finding 2 — The double threshold.** A sharp transition curve divides the $(Oh, Bo)$ space:
  - For **low viscosity** ($Oh \ll 1$): rupture requires $Bo \gtrsim Bo_c = \mathcal{O}(1)$. Surface tension and inertia balance at the inertio-capillary timescale $\tau_\gamma = \sqrt{\rho R_0^3 / \gamma}$.
  - For **high viscosity** ($Oh \gg 1$): the boundary shifts as $Bo_c \sim Oh^{-2}$, or equivalently $Oh \sim Bo^{-1/2}$. Here healing is governed by the visco-capillary timescale $\tau_\gamma \, Oh$.

- 💡 **Key finding 3 — Geometry as a second key.** The opening angle $\theta$ of the initial cavity introduces a *second* independent threshold. Even if driving is strong, a nearly-closed cavity will heal. Only when both $Bo > Bo_c(Oh)$ AND $\theta > \theta_c(Oh)$ does rupture proceed irreversibly. This is the **double threshold**.

## The Timescale Argument

The healing-to-opening transition has an elegant physical interpretation. After the cavity forms, the two opposing rims race toward each other. We call the time for them to collide the *collision time* $t_c$ — this is the healing time when the sheet successfully reseals.

For **inertia-dominated** sheets ($Oh \ll 0.1$):
$$t_c \sim \tau_\gamma = \sqrt{\frac{\rho R_0^3}{\gamma}}$$

For **viscosity-dominated** sheets ($Oh \gg 0.1$):
$$t_c \sim \frac{\eta R_0}{\gamma} = \tau_\gamma \, Oh$$

The sheet opens when outward radial advection — driven by $\omega$, with timescale $t_\text{adv} \sim 1/\omega$ — is faster than rim closure. Setting $t_c \sim t_\text{adv}$ recovers the two asymptotic scalings exactly. Remarkably, even near the critical $Bo_c$, the healing time itself is insensitive to $Bo$ — the driving decides *whether* the sheet opens, but the healing dynamics are controlled purely by the inertia–viscosity balance.

## What Happens Without Any Driving?

In the limit $Bo \to 0$, the sheet always heals for any finite $Oh$. This recovers the classical Taylor–Michael result[^1]: a circular hole can expand spontaneously only if its outer radius satisfies $R/h_0 > \pi/4$. Our simulations confirm this geometric criterion as the zero-driving baseline.

This is reassuring — it means the double threshold is not a perturbation to existing theory, but rather a natural generalisation that encompasses it.

## Why It Matters

The double-threshold framework offers something classical nucleation theory never could: **practical control handles**.

1. **Driving strength** ($Bo$): reduce the drainage rate to keep $Bo < Bo_c$ and suppress rupture. Relevant for controlling spray formation and wave breaking.
2. **Defect geometry** ($\theta$): engineer surface coatings or film composition to keep bubbles spherical (small $\theta$), preventing the geometric threshold from being crossed.
3. **Viscosity** ($Oh$): increasing viscosity raises $Bo_c$ via $Bo_c \sim Oh^{-2}$, requiring stronger driving to rupture — this is why glycerol-laden films are harder to break.

In the context of respiratory disease transmission, these levers matter directly: the [[non-Newtonian rheology]] of mucus modifies $Oh$ effectively, changing how easily respiratory films fragment during coughing. This connects directly to our ongoing work on [[viscoelastic films and aerosolization]].

## Looking Forward

Two open questions feel particularly sharp to me:

**First**, this study treats the bubble as a passive defect. Real respiratory films carry surfactants, proteins, and viscoelastic networks. How do these modify the threshold scalings? The $Oh$ framework is a starting point, but a truly predictive model of cough aerosolization will need to account for the full constitutive behaviour of mucus.

**Second**, the axisymmetric geometry is a controlled idealisation. Real bag-like sheets in a cough are three-dimensional, with multiple bubbles and spatially varying thickness. Does the double threshold survive in this richer geometry, or does it give way to collective dynamics? We suspect the thresholds will remain local and deterministic — but that is a hypothesis waiting for simulation or experiment.

For now: a sheet doesn't tear because it gets thin enough. It tears because *both* the driving and the defect geometry conspire to push it past two simultaneous thresholds. Once you see it that way, the mystery of micrometer-scale rupture dissolves.

---

[^1]: G. I. Taylor and D. H. Michael, *On making holes in a sheet of fluid*, J. Fluid Mech. **58**, 625 (1973).

## References

- Dixit, A. K., Zhao, C., Zaleski, S., Lohse, D., & Sanjay, V. *Holes in Sheets: Double-Threshold Rupture of Draining Liquid Films.* Phys. Rev. Lett. **136**, 084001 (2026). [DOI](https://doi.org/10.1103/bdpw-7mr5)
- Culick, F. E. C. *Comments on a ruptured soap film.* J. Appl. Phys. **31**, 1128 (1960).
- Taylor, G. I. *The dynamics of thin sheets of fluid III. Disintegration of fluid sheets.* Proc. R. Soc. A **253**, 313 (1959).
- Villermaux, E. & Bossa, B. *Single-drop fragmentation determines size distribution of raindrops.* Nature Phys. **5**, 697 (2009).
