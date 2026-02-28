---
status: Working 🏗️
publish: false
tags:
  - Fluid-dynamics
  - Jets
  - Drops
  - Surface-tension
  - Instability
  - Basilisk
---

# Why Every Dripping Tap Chooses the Same Drop Size

A kitchen tap drips. A spider's web beads with morning dew. Ink fired from a nozzle at ten thousand drops per second. A stream of urine — yes, physicists have studied this — disintegrates into droplets about fifteen centimetres from its source. These are not random. They are all the same phenomenon, governed by the same number, discovered independently by two nineteenth-century physicists a decade apart.

This is the story of the **Plateau–Rayleigh instability**: why a cylindrical column of liquid can never survive intact, and why it always breaks up the same way.

> [!abstract] TL;DR
> - A liquid jet is always unstable to long-wavelength perturbations — surface tension drives breakup, not viscosity or gravity
> - The dominant breakup wavelength is set by a single condition: $kR_0 \approx 0.697$, independent of material properties (for inviscid jets)
> - Plateau found the threshold experimentally in 1873; Rayleigh proved it theoretically — and the threshold is exactly $\pi$
> - The same physics controls inkjet printing, rain formation, spider silk beading, and atmospheric aerosols
> - Viscosity and elasticity shift *how fast* and *at what scale* breakup happens — but cannot prevent it

## The Question That Looks Obvious

Why does a water jet break into drops?

The naive answer — "gravity pulls it down and it falls apart" — is wrong. Gravity sets the *speed*, but jets break up even in zero-gravity, even horizontally, even in microgravity experiments aboard the ISS. The real driver is **surface tension**, and it acts in a counterintuitive direction: it wants to *reduce surface area*, and a series of spherical drops has less surface area than a cylinder of the same volume.

That last point deserves emphasis. Take a cylinder of liquid, radius $R_0$ and length $L = 2\pi/k$ (one wavelength of a perturbation). Now redistribute that same volume into a sphere. The sphere wins — it has less surface area. Surface tension is literally trying to turn every jet into drops, all the time.

The question isn't *whether* it happens. The question is *which wavelengths win*.

## Plateau Counts the Drops (1873)

Joseph Plateau was a Belgian physicist who, having blinded himself by staring at the sun to study afterimages, spent the rest of his career doing beautiful experiments — by feel, by assistants' descriptions, by careful design. Among his many contributions: he dropped streams of water into oil (to cancel gravity's effect), measured when the stream broke up, and found a remarkable threshold.

A cylindrical liquid column is stable if its length is less than about **3.13 to 3.18 times its diameter**. He noted, almost as an aside, that this number is suspiciously close to $\pi \approx 3.14159\ldots$.

It wasn't a coincidence.

## Rayleigh Explains Why (1879)

Lord Rayleigh took Plateau's observation and turned it into a stability analysis. Perturb the cylinder's radius sinusoidally:

$$R(z) = R_0 + A_k \cos(kz)$$

where $k$ is the wavenumber. For each $k$, compute whether the perturbation grows or decays. The result:

- **Stable** ($kR_0 > 1$): the curvature of the wave itself provides restoring pressure — the jet heals
- **Unstable** ($kR_0 < 1$): the curvature of the jet's cross-section wins — the jet breaks

The stability boundary is $kR_0 = 1$, which means the wavelength at the boundary is $\lambda = 2\pi R_0$ — exactly the circumference of the jet. Plateau's $\pi \times \text{diameter}$ threshold was exact, not approximate.

But stability boundary ≠ preferred breakup scale. Among all unstable modes ($kR_0 < 1$), which grows fastest?

## The Magic Number: 0.697

Maximising the growth rate over all unstable wavenumbers gives:

$$kR_0 \approx 0.697$$

This is not 1 (the boundary). It's not 0 (the longest-wavelength limit). It's a specific value, set by the competition between two pressure contributions from the Young–Laplace equation:

1. **Azimuthal curvature** ($\sim 1/R$): pressure is higher where the jet is thinner. This drives flow *into* the thicker regions — destabilising.
2. **Axial curvature** ($\sim k^2$): the wave itself curves in the other direction. This resists growth — stabilising.

At $kR_0 \approx 0.697$, the azimuthal effect maximally dominates without the axial curvature killing it. This is the number that controls your drop size, worldwide, forever.

Drop diameter from a jet of radius $R_0$: roughly $d \approx 1.89 \times (2R_0)$ — nearly twice the jet diameter. Every time.

## Why the Urination Section Exists

Wikipedia's article on Plateau–Rayleigh instability includes, in full seriousness, a section on urination. It turns out that a urine stream breaks into droplets after roughly 15 cm — exactly when $kR_0 \approx 0.697$ is satisfied for typical flow rates and surface tensions. Once it breaks into droplets instead of a coherent stream, splash-back on the target surface becomes dramatically worse.

The SplashLab at BYU published a fluid dynamics paper on this. It is peer-reviewed. The physics is right.

## Where It Gets More Interesting: Viscosity and Elasticity

Rayleigh's analysis assumed an inviscid jet. Real fluids aren't. What changes?

**Viscosity** (Ohnesorge number $Oh = \mu/\sqrt{\rho \sigma R_0}$):
- Damps growth rates uniformly — breakup takes longer
- Shifts the fastest-growing mode to slightly longer wavelengths (smaller $k$)
- At high $Oh$, the pinch-off profile becomes self-similar and viscosity-dominated — a long thin thread before the final breakup

**Elasticity** (polymer solutions, mucus, blood):
- Elastic stresses resist thinning — jet survives *much* longer
- Produces the notorious "beads on a string" morphology: drops connected by thin filaments that never pinch off cleanly
- The Oldroyd-B model captures this qualitatively; real polymer solutions do stranger things at high extension rates

This is directly relevant to respiratory aerosol generation (mucus films, coughs), inkjet printing of biological inks, and microfluidic drop-making.

## The Basilisk Connection

The Gerris/Basilisk ecosystem has a canonical example of the Savart–Plateau–Rayleigh instability — a numerical simulation of jet breakup that reproduces the $kR_0 \approx 0.697$ mode selection with striking accuracy. It's one of the cleaner validations of the VOF method for free-surface flows.

For non-Newtonian variants — viscoelastic jets, shear-thinning droplets — the instability is an active area where our group has contributed. The beads-on-a-string morphology in viscoelastic Worthington jets is a direct descendant of the same physics: surface tension still wants to break the cylinder; elasticity fights it; the result is a zoo of morphologies depending on $De$, $Oh$, and $We$.

## The Deeper Point

The Plateau–Rayleigh instability is one of those results that feels like it should be obvious in retrospect, but wasn't. The insight is that **even a cylinder that is "held together" by surface tension is actually being destroyed by it** — because spheres beat cylinders in the surface-area game.

It is, in a precise sense, a geometric inevitability. The only question is the timescale and the preferred length scale. Those are determined by $kR_0 \approx 0.697$, a number that Plateau guessed and Rayleigh proved, and that shows up every time water drips from a tap anywhere on Earth.

---

*Further reading:* Eggers (1997), *Rev. Mod. Phys.* 69, 865 — the definitive review of free-surface flow breakup. For viscoelastic variants: Bhat et al. (2010), and our own work on viscoelastic Worthington jets.
