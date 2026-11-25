---
status: done ✅
publish: true
unlisted: true
---

# Conservation Laws: Questions and Answers

<!-- BLOG-PDF-LINK-START -->
<!-- PDF-EXPORT-IGNORE-START -->
> [!pdf] PDF version
> [[_Media/PDF/Lecture-Notes/Intro-Soft-Matter/Conservation-Laws-Questions-Answers.pdf|Download this page as PDF]]
<!-- PDF-EXPORT-IGNORE-END -->
<!-- BLOG-PDF-LINK-END -->

## Question 1: Coarse-Graining in Practice

Question: Explain what "coarse-graining" means and why it lets us treat soft matter as a continuum. Pick one system (foam, polymer solution, emulsion) and say when this breaks down (give a specific length scale or condition).

Answer:

Coarse-graining means averaging over many microscopic constituents (molecules, droplets, bubbles, chains) to define smooth, space- and time-dependent fields such as density, velocity and stress. When the averaging volume is large compared with the microstructure, local fluctuations average out and the material can be modelled as a continuous medium obeying conservation laws.

**Example (emulsion):** If droplets have diameter $d \sim 10\,\mu\text{m}$, a pipe flow whose fields vary over millimetres contains thousands of droplets per fluid element, so a single-phase continuum with effective properties is accurate.

The approximation **breaks down** when:
1. The observation or gradient length $\ell$ becomes $O(d)$ or smaller (e.g., microfluidic channels, thin gaps, near interfaces)
2. Timescales approach droplet rearrangement or coalescence times
3. In these regimes, discrete structure, interfacial forces and nonlocal effects cannot be neglected

Continuum descriptions require scale separation: the microstructural length must be much smaller than the length scale over which the macroscopic fields vary.

---

## Question 2: Continuity in a Nozzle

Question: You squeeze shampoo through a pump and narrow outlet at steady rate. Using only words, explain why the fluid speeds up in the narrow section and name the conservation law you're invoking. Give one case where this reasoning would fail.

Answer:

In steady flow, what enters must leave: the same **mass per unit time** passes every cross-section. Because shampoo is nearly incompressible (constant density), the volume flow rate is also fixed across every cross-section. Where the passage narrows, the fluid must therefore move faster through the smaller area—this is **conservation of mass** (the continuity principle) in words.

Mathematical statement: In steady one-dimensional flow, the mass flow rate $\rho A v$ is constant. For an incompressible fluid ($\rho = \text{constant}$), the volume flow rate $A v$ is constant, so $v \propto 1/A$: if the cross-sectional area $A$ decreases, the mean velocity $v$ increases inversely with $A$.

This reasoning **fails** when:

1. **Density changes significantly**: In a compressible or bubbly shampoo (with entrained air) undergoing a strong pressure drop, the mass flow rate stays fixed while the density drops, so the constant-density assumption fails and the *volume* flow rate and speed no longer obey $v \propto 1/A$

2. **Unsteady flow**: "Squeeze-and-release" strokes where fluid is temporarily stored in a compliant pump chamber violate the steady-state assumption, so the outflow rate no longer equals the inflow rate

Related caveat (not a failure of continuity): At high shear rates in a suspension, shear-induced migration can create non-uniform particle concentrations across the channel. The cross-sectional volume balance still holds if the phases are incompressible, but the velocity profile is reshaped (and when the phases differ in density, the local density varies across the cross-section).

---

## Question 3: Momentum Balance Around a Bend

Question: Water flows steadily through a pipe that turns 90°. Describe which forces turn the flow (pressure differences versus wall shear) and how the picture changes for very slow flows (creeping) versus very fast flows (inertial).

Answer:

In an inertial flow along a curved streamline, a cross-stream **pressure difference** provides the centripetal force that turns the fluid, whereas in creeping flow inertia is negligible and pressure gradients balance viscous forces directly; **wall shear** resists motion, sets the velocity profile and dissipates mechanical energy.

### Very slow (creeping, low Reynolds number):

$$\text{Re} = \frac{\rho v D}{\eta} \ll 1$$

1. Inertia is negligible, so the momentum equation reduces to a balance between pressure gradients and viscous stresses: $\nabla p \approx \eta \nabla^2 \boldsymbol{v}$
2. The flow follows the bend smoothly with no separation
3. Viscous stresses balance the pressure gradient throughout the cross-section
4. In a gently curved pipe (bend radius much larger than the pipe diameter), the velocity profile stays nearly parabolic (Poiseuille-like)

### Very fast (inertial, high Reynolds number):

$$\text{Re} = \frac{\rho v D}{\eta} \gg 1$$

1. Fluid parcels resist turning because of inertia
2. A higher pressure develops on the *outer* wall than on the *inner* wall, so $\nabla p$ has an outward cross-stream component and the pressure force an inward one, $(-\nabla p)_\perp$, which supplies the centripetal acceleration
3. While the flow remains attached, viscous effects are confined to thin boundary layers near the walls
4. Secondary motions (Dean vortices) and flow separation can appear
5. Pressure forces do most of the turning; viscous shear mainly dissipates energy in the boundary layers (and in any separated wake)

Both limits follow from the continuum momentum equation $\rho \frac{D\boldsymbol{v}}{Dt} = \nabla \cdot \boldsymbol{\sigma} + \rho \boldsymbol{b}$, with the dominant balance shifting from viscous to inertial as $\text{Re}$ increases.

---

## Question 4: Where Does the Work Go?

Question: You slide two plates with glycerol between them at constant speed. Explain where the mechanical power you input ends up inside the fluid, name the phenomenon responsible (in words), and give a one-sentence microscopic picture for it.

Answer:

The mechanical power supplied at the plates is converted into **heat inside the liquid** by **viscous dissipation** (internal friction): shear stresses acting across velocity gradients irreversibly turn organized motion into thermal energy.

### Energy transformation:

Power input:
$$P_{\text{in}} = F \cdot v = \tau A \cdot v$$

where $\tau$ is the shear stress, $A$ is the plate area, and $v$ is the sliding velocity.

For a Newtonian fluid with viscosity $\eta$ and gap $h$:
$$\tau = \eta \frac{v}{h}$$

So:
$$P_{\text{in}} = \eta \frac{v^2}{h} A = \eta \left(\frac{v}{h}\right)^2 A h$$

This power equals the local viscous dissipation rate per unit volume, $\eta (v/h)^2$, multiplied by the fluid volume $A h$. It heats the liquid and, at thermal steady state with isothermal boundaries, leaves as heat across the walls at the same rate.

### Microscopic picture:

Molecules in faster layers transfer momentum to slower layers through collisions and intermolecular interactions, randomizing directed motion into thermal agitation—seen macroscopically as heating unless heat is removed.

Connection to lecture: This is the continuum consequence of the momentum diffusion derived from kinetic theory. The shear stress $\tau = \eta \frac{\partial v}{\partial y}$ times the shear rate $\frac{\partial v}{\partial y}$ dissipates mechanical power at rate $\tau \frac{\partial v}{\partial y} = \eta (\frac{\partial v}{\partial y})^2$ per unit volume. Under the lecture's sign convention, this shear stress corresponds to a non-convective momentum flux $-\tau$ in the $+y$ direction.

---

> [!significance]- Metadata
> Author:: [Vatsal Sanjay](https://vatsalsanjay.com)<br>

> [!link] Back to main website
> [Home](https://comphy-lab.org/), [Team](https://comphy-lab.org/team), [Research](https://comphy-lab.org/research), [Github](https://github.com/comphy-lab)
>
> 📝 [Edit this page on GitHub](https://github.com/comphy-lab/CoMPhy-Lab-Blogs/blob/main/Lecture-Notes/Intro-Soft-Matter/Conservation-Laws-Questions-Answers.md)
