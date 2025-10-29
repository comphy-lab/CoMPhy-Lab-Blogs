---
created: 2025-10-29T00:00:00+00:00
modified: 2025-10-29T19:36:02+00:00
tags:
  - lecture
  - soft-matter
  - viscosity
  - momentum-diffusion
  - kinetic-theory
  - rheology
  - no-slip-condition
lecture-number: 2
date: 2025-10-29
status: done ✅
publish: false
---
# Lecture 2: Viscosity and Momentum Diffusion

Understanding viscosity as an emergent property arising from molecular collisions and free flights—the diffusion of tangential momentum through a fluid. This lecture bridges [[1.5-Taylor-Culick-Paradox|Lecture 1.5]]'s resolution of the Taylor–Culick paradox with the continuum mechanics framework needed to model soft matter flows.

---

## Learning Goals:

Have students understand these five core ideas by the end of the lecture:

1. **What viscosity is:** a coefficient quantifying the *diffusion of tangential momentum*
2. **Where it comes from (kinetics):** molecular collisions + free flights over the mean free path $\lambda$
3. **Why no-slip is natural:** collisions at a wall randomize tangential momentum → momentum sink → velocity gradient forms
4. **Two key scalings:**
   - $\eta \sim \frac{1}{3}\rho \bar{c} \lambda$ (viscosity; depends on density, speed, path length)
   - $\nu = \eta/\rho \sim \frac{\bar{c}\lambda}{3}$ (kinematic viscosity = momentum diffusivity)
5. **Later connections:** Newtonian stress law in continuum mechanics; relaxation-function picture in rheology

---

## Part A: Empirical Starting Point — Newton's Law

### Opening: Write on board

$$\boxed{\tau_{xy} = \eta \dot{\gamma} = \eta \frac{\partial u_x}{\partial y}}$$

This is the **foundational definition** of a Newtonian fluid. Shear stress is proportional to shear rate, with a constant of proportionality—the viscosity $\eta$ (eta)—that depends on the material and temperature, but *not* on how fast you shear it.

![](../../_Media/2-What-is-Viscosity-1761738216814.png)

### Define the terms aloud and on the board

- **Shear stress** $\tau_{xy}$ (Pa = N/m$^2$): force per unit area acting tangentially on a fluid layer
- **Shear rate** $\dot{\gamma} = \partial u_x / \partial y$ (s$^{-1}$): the spatial gradient of velocity; how quickly the velocity changes across the fluid
- **Viscosity** $\eta$ (Pa$\cdot$s): the coupling; higher $\eta$ means stickier fluid
- **Kinematic viscosity** $\nu = \eta/\rho$ (m$^2$/s): the "speed" at which momentum diffuses through the fluid

![](../../_Media/2-What-is-Viscosity-1761738244038.png)

> [!important] Distinguish Newtonian vs. Non-Newtonian
>
> Many students conflate "viscosity" with "thickness." Clarify: A Newtonian fluid has **constant $\eta$ at fixed T**—it doesn't matter if you shear slowly or fast. Ketchup, blood, and polymer solutions are *non-Newtonian* ($\eta$ changes with $\dot{\gamma}$); we'll encounter that in Lecture 4.

**One-liner for intuition:** "Viscosity is like internal friction: it's the resistance of the fluid to shearing."

---

## Part B: First Principles — Kinetic Theory Derivation

### The Big Idea (Say This Twice)

**[Emphasis 1: Foundational]** Viscosity emerges because **molecules carry momentum across planes** during free flights between collisions. When the flow has a shear (velocity gradient), molecules from fast and slow regions mix, and this **diffuses momentum down the gradient.**

---

### Setup: Simple Couette Flow

![](../../_Media/2-What-is-Viscosity-1761738283101.png)

- Steady shear: $u_x(y) = \dot{\gamma} \cdot y$ (velocity grows linearly with height)
- Mean free path: $\lambda$
- Mean speed of molecules: $\bar{c} = \sqrt{8 k_B T / (\pi m)}$ (monatomic gas)
- Number density: $n$

**Narration:** "In this geometry, molecules at height $y$ have average $x$-velocity $u_x(y)$. But they only came to height $y$ after traveling a distance $\sim \lambda$ through the fluid. So the $x$-momentum they carry reflects the conditions they saw $\sim \lambda$ away. That's where the gradient matters."

---

### Step 1: How many molecules cross a plane per unit area per unit time?

**Write:**

$$\text{Number flux} \quad J = \frac{1}{4} n \bar{c}$$

**Derivation sketch (choose one approach for your cohort):**

#### Quick Route (1 minute)

"For an isotropic gas, **half** the molecules move upward and **half** downward (factor 1/2). Of those moving upward, the average normal component of velocity is $\bar{c}/2$ (because the mean direction makes a ~60° angle to the normal). So $\langle v_y^+ \rangle = (1/2) \times (1/2) \bar{c} = \bar{c}/4$. Thus $J = n \bar{c}/4$."

#### Integral Route (if your class likes to see the math)

For a fixed speed c, integrate over the hemisphere of upward directions:

$$\langle v_y^+ \rangle_{\text{dir}} = \frac{1}{4\pi} \int_{\text{hemisphere}} c \cos\theta \, d\Omega = \frac{1}{4\pi} \int_0^{2\pi} d\phi \int_0^{\pi/2} c\cos\theta \sin\theta \, d\theta = \frac{c}{4}$$

Average over speeds (use $\bar{c}$ for a Maxwellian): $J = n \bar{c}/4$.

![](../../_Media/2-What-is-Viscosity-1761738310141.png)

---

### Step 2: What momentum do these molecules *carry*?

**Narration:** "A molecule crossing the plane upward was last hit $\sim \lambda$ below, so it carries the mean x-momentum from around $y-\lambda$. A molecule crossing downward carries momentum from around $y+\lambda$."

---

### Step 3: Calculate the net *downward* flux of x-momentum

Write step-by-step:

Downward momentum flux (from above):
$$\Phi_{x}^{\text{down}} \approx \frac{n\bar{c}}{4} \cdot m \cdot u_x(y+\lambda)$$

Upward momentum flux (from below):
$$\Phi_{x}^{\text{up}} \approx \frac{n\bar{c}}{4} \cdot m \cdot u_x(y-\lambda)$$

Net downward flux (down minus up):
$$\Phi_{x}^{\text{net}} = \frac{nm\bar{c}}{4}\left[ u_x(y+\lambda) - u_x(y-\lambda) \right]$$

**Now linearize:** For small $\lambda$,
$$u_x(y\pm\lambda) \approx u_x(y) \pm \lambda \frac{\partial u_x}{\partial y}$$

So:
$$u_x(y+\lambda) - u_x(y-\lambda) \approx 2\lambda \frac{\partial u_x}{\partial y}$$

**Substitute:**
$$\boxed{\Phi_{x}^{\text{net}} \approx \frac{nm\bar{c}}{4} \cdot 2\lambda \frac{\partial u_x}{\partial y} = \frac{1}{2} \rho \bar{c} \lambda \frac{\partial u_x}{\partial y}}$$

where we used $\rho = nm$ (mass density).

---

### Step 4: **Identify shear stress and extract viscosity**

**Critical definition (say with emphasis):**

**[Emphasis 2]** "The *shear stress* in the continuum description is **minus** the downward flux of x-momentum (the minus sign accounts for the direction convention). The physics is: if molecules are flowing momentum downward (from fast to slow regions), that's a **stress** acting downward."

**Write:**

$$\tau_{xy} = -\Phi_{x}^{\text{net}} = -\frac{1}{2} \rho \bar{c} \lambda \frac{\partial u_x}{\partial y}$$

Compare with Newton's law:
$$\tau_{xy} = -\eta \frac{\partial u_x}{\partial y}$$

**Therefore:**

$$\boxed{\eta \sim C \, \rho \, \bar{c} \, \lambda, \quad\text{where } C = \mathcal{O}(1)}$$

A more careful Chapman-Enskog theory gives $C \approx 1/3$ for a monatomic gas, but the **scaling is what matters**.

---

### Step 5: Understand kinematic viscosity as a diffusivity

**Write:**

$$\nu = \frac{\eta}{\rho} \sim C \, \bar{c} \, \lambda$$

**Say:** "The kinematic viscosity $\nu$ is the **diffusivity** for momentum. Just like thermal diffusivity ($\alpha$) tells you how fast heat diffuses, $\nu$ tells you how fast shear (tangential momentum) spreads. Dimension check: $[\bar{c}][\lambda] = \text{m/s} \times \text{m} = \text{m}^2/\text{s}$. ✓"

---

## Part C: Boundary Condition — Where Does No-Slip Come From?

### The Wall Picture

Draw on the board:

```
                     GAS INTERIOR (u_x varies with y)
  =====================================================
  incoming molecule    hits wall    re-emitted molecule
  (carries tangential  (wall         (carries zero mean
   momentum u_x,local) thermalizes   u_x in wall frame)
                       tangential
                       motion)
  =====================================================
                      WALL (stationary: u_wall = 0)
```

### What's happening physically

**[Emphasis 3: This is crucial]** "When a gas molecule collides with a stationary wall, the wall **randomizes** (thermalizes) its tangential velocity component. The molecule re-emits with **zero mean tangential velocity in the wall frame.** This is called **diffuse reflection with full tangential momentum accommodation.**"

**Say:** "Think of the wall as a **sink of x-momentum.** Every molecule that hits the wall loses its tangential velocity. Just outside the wall, there's therefore a **deficit** in mean $u_x$ compared to the interior."

---

### How does the interior respond?

**Write the momentum balance:**

In steady state, the **viscous flux from the interior** must feed the **momentum sink at the wall**.

Rate at which wall removes x-momentum (per unit area):
$$\text{Removal rate} \sim \underbrace{\left(\frac{1}{4}n\bar{c}\right)}_{\text{collision rate}} \times \underbrace{m u_x(0^+)}_{\text{momentum per molecule}}$$

where $u_x(0^+)$ is the fluid velocity just outside the wall.

Rate at which interior supplies x-momentum via viscous diffusion:
$$\text{Supply rate} = -\tau_{xy}\big|_{\text{wall}} = \eta \frac{\partial u_x}{\partial y}\bigg|_{\text{wall}}$$

**In steady shear:**
$$\eta \frac{\partial u_x}{\partial y}\bigg|_{\text{wall}} \sim \frac{1}{4}n\bar{c} \, m \, u_x(0^+)$$

For small $u_x(0^+)$ relative to the bulk (or if the wall is perfectly accommodating), this forces $u_x(0^+) \to u_{\text{wall}} = 0$.

**Result:**

$$\boxed{u_{\text{fluid}}(\text{wall}) = u_{\text{wall}} \quad\text{(no-slip condition)}}$$

---

### When does slip appear?

**Say:** "No-slip is the **continuum limit.** It works perfectly when the mean free path $\lambda$ is much smaller than any relevant geometric length (Knudsen number $\text{Kn} = \lambda/L \ll 1$)."

**For rarefied gases or special surfaces (non-accommodating):**

The wall doesn't fully thermalize the tangential momentum. Instead, we get **partial slip**:

$$u_{\text{slip}} = u_{\text{fluid}}(0) - u_{\text{wall}} = b \frac{\partial u_x}{\partial y}\bigg|_{\text{wall}}$$

where the **slip length** is $b \sim \mathcal{O}(\lambda)$ (modulated by an accommodation coefficient).

**Maxwell slip law:**

$$\boxed{b \approx C_{\text{acc}} \lambda, \quad C_{\text{acc}} \approx 1\text{--}2}$$

---

### Connecting bulk viscosity to wall shear

**Key insight (write as a box):**

$$\boxed{\text{The same } \eta \text{ that represents bulk momentum diffusion also sets the wall shear rate:}}$$
$$\boxed{\tau_{\text{wall}} = \eta \frac{\partial u_x}{\partial y}\bigg|_{\text{wall}} = \text{rate at which wall removes x-momentum}}$$

---

## Part D: Continuum View — Momentum Diffusion Equation

### Stokes' First Problem (Impulsive Start)

**Setup:** A semi-infinite fluid at rest; suddenly the plate at y=0 moves with velocity U.

**Initial conditions:**
- $u_x(y, 0) = 0$ for all $y > 0$
- $u_x(0, t) = U$ (boundary condition)

**Governing PDE (momentum diffusion):**

$$\boxed{\frac{\partial u_x}{\partial t} = \nu \frac{\partial^2 u_x}{\partial y^2}}$$

where $\nu = \eta/\rho$ is the kinematic viscosity (momentum diffusivity).

**No need to solve—just scale:**

The momentum **penetrates** into the fluid over a diffusion layer of thickness:
$$\delta(t) \sim \sqrt{\nu t}$$

**Say (with emphasis):**

"Look at this equation. It's *exactly* like heat diffusion or dye diffusion. Viscosity $\nu$ plays the role of thermal or mass diffusivity. This confirms our kinetic picture: **viscosity is the diffusivity for momentum.**"

---

### Visual analogy (draw on board or show slide)

```
t = 0:        t = t_1:        t = t_2 > t_1:
|             |               |
U -----       U -----         U -----
              |               |
              | momentum       |  penetrates
              | boundary       |  deeper
              | layer δ(t_1)   | δ(t_2) > δ(t_1)
              |               |
0 -----       0 -----         0 -----
```

---

### Non-Newtonian fluids

The Newtonian law $\tau = \eta \dot{\gamma}$ works when:
- The fluid has **no internal structure** that deforms under shear
- Or the structure **adapts quickly** compared to the flow timescale

For polymer solutions, suspensions, or emulsions:
- Microstructure (chains, particles) **realigns** under shear
- Viscosity becomes a function of shear rate: $\eta(\dot{\gamma})$
- You get phenomena like shear-thinning or shear-thickening

> "Today we derived why Newtonian behavior is natural for a dilute gas. But real soft-matter systems are more interesting because their microstructure evolves. That's where non-Newtonian rheology comes in."

---

### Reynolds number: Viscous vs. inertial

$$\text{Re} = \frac{U L}{\nu}$$

- $U L$: scale of *advection* (inertial effects)
- $\nu$: scale of *momentum diffusion* (viscous effects)

**Say:** "High Re = inertia dominates (turbulence, jets). Low Re = viscosity dominates (creeping flow, microfluidics). The transition is where things get interesting."

---

## Summary: One Slide for Students (Chalkboard Summary)

$$\boxed{\text{Newton's Law:} \quad \tau_{xy} = \eta \dot{\gamma}}$$

$$\boxed{\text{Kinetic Picture:} \quad \eta \sim \frac{1}{3} \rho \bar{c} \lambda, \quad \nu = \frac{\eta}{\rho} \sim \frac{\bar{c} \lambda}{3}}$$

$$\boxed{\text{Wall Physics (No-Slip):} \quad u_{\text{fluid}}(\text{wall}) = u_{\text{wall}}}$$
(emerges when wall thermalizes momentum; fails at high Kn)

$$\boxed{\text{Continuum Picture:} \quad \frac{\partial u}{\partial t} = \nu \frac{\partial^2 u}{\partial y^2} \quad \Rightarrow \quad \delta(t) \sim \sqrt{\nu t}}$$

---

## Conceptual Takeaway (Read Aloud at End)

> **"Viscosity is to momentum what diffusivity is to dye: it smooths out **gradients** in tangential velocity by spreading momentum from fast to slow regions. At the wall, the same microscopic physics—collisional randomization of tangential momentum—produces the **no-slip condition** in the continuum limit, and **predicts slip** when the mean free path is not tiny."**

---

## Pedagogical Cues & What to Emphasize

### What to say (not write):

1. **On the empirical law:** "Newton's law is **exact for dilute gases and low-Re flows**. It's our baseline for understanding viscosity."

2. **On the kinetic derivation:** "The key insight is that **molecules carry momentum with them** during free flights. Shear exists $\to$ momentum comes from different regions $\to$ **diffusion.**"

3. **On temperature scaling:** "Gases get **stickier** as you heat them (faster molecules move momentum farther). Liquids usually get **less viscous** (cage-breaking dynamics). Watch for this flip!"

4. **On no-slip:** "The wall isn't magic. It's just a **momentum sink.** Molecules bounce off and lose their sideways velocity. The interior has to **feed this sink via a gradient.** Simple kinetics $\to$ macroscopic no-slip."

5. **On continuum diffusion:** "When you see $\partial u/\partial t = \nu \partial^2 u / \partial y^2$, remember: **$\nu$ is a diffusivity.** Shear spreads just like heat."

---

## Common Student Misconceptions & Corrections

| Misconception | Correction |
|---|---|
| "Viscosity = thickness" | Viscosity is internal friction (momentum transport). Tar is thick but has finite viscosity. Silly putty is stiff but has very low steady-state viscosity. |
| "All liquids get more viscous when heated" | **Gases** get more viscous when heated (faster particles → larger $\lambda \times \bar{c}$). **Liquids** usually get less viscous (activation, cage escape). Different mechanisms. |
| "No-slip is a fundamental law" | No-slip is a *consequence* of efficient tangential momentum accommodation at the wall. It fails (partial slip) when Kn is large or the wall doesn't accommodate. |
| "Viscosity depends on shear rate for all fluids" | Only for **non-Newtonian** fluids. Newtonian (simple gases, low-Re oil flows) have constant $\eta$ at fixed T. |
| "The 1/4 in $J = n\bar{c}/4$ is a Maxwellian fact" | No—it's **pure geometry**: (1/2 go upward) × (1/2 average $\cos\theta$ in a hemisphere). Works for *any* isotropic speed distribution. |

---

## Suggested Demos / Thought Experiments

### 1. **Playing-card analogy**

Stack a few cards and try to shear them by hand.
- Pushing one card horizontally: you feel resistance (viscosity).
- That resistance comes from **friction between layers** (like our molecular collisions).
- The more layers (higher density) or faster motion (higher $\bar{c}$), the more resistance.

> *Takeaway:* "Viscosity is the **microscopic friction** that emerges when you try to shear a fluid."

---

### 2. **Food dye in water vs. syrup**

Pour a drop of food dye into a glass of water and a glass of corn syrup at the same temperature.
- **Water:** dye spreads quickly (low $\nu$).
- **Syrup:** dye creeps slowly (high $\nu$).

> *Takeaway:* "High viscosity = slow momentum diffusion. You can *see* the diffusion boundary layer taking its time."

---

### 3. **Thought experiment: rarefied air**

Imagine flying an airplane at sea level vs. at 40 km altitude.
- At sea level: $n$ is high, $\lambda$ is tiny → large $\eta$.
- At 40 km: $n$ is low, $\lambda$ is huge → **but $\eta$ barely changes!** (because the decrease in $n$ and increase in $\lambda$ nearly cancel.)

> *Takeaway:* "Viscosity in gases is **nearly independent of pressure.** That's why airplane altimeters work."

---

## Discussion Questions for Engagement

1. **Why does viscosity increase with T in gases but decrease in liquids?** (Hint: different microscopic mechanisms.)

2. **Estimate the viscosity of air at room temperature.** Use $\rho \approx 1.2$ kg/m³, $\bar{c} \approx 500$ m/s, $\lambda \approx 70$ nm.

3. **What is the "no-slip length"** (slip length $b$) for air at 1 atm and room temperature? How does it compare to typical macroscopic dimensions?

4. **In a microfluidic device** (channels ~10 μm), when would you expect partial slip to become significant? (Consider Kn.)

5. **Sketch** the velocity profile $u_x(y, t)$ for Stokes' first problem at three different times. How does $\nu$ affect the steepness of the profile?

---

## References & Further Reading

### Primary Literature

- **Chapman & Cowling (1970):** *The Mathematical Theory of Non-Uniform Gases.* (Classic kinetic theory; Sections 2–4 for viscosity.)
- **Reif (1965):** *Fundamentals of Statistical and Thermal Physics.* (Clear kinetic-theory chapter.)
- **Bird, Stewart & Lightfoot (2007):** *Transport Phenomena.* (Chapter 1: connection between kinetic theory and continuum viscosity.)
- **Doi & Edwards (1986):** *The Theory of Polymer Dynamics.* (Rheology and the viscosity integral.)

### Supplementary Materials

- [What is Viscosity (PDF)](whatIsViscosity.pdf) — Comprehensive reference document on kinetic theory foundations

---

## Connection to Lecture 3

The viscosity framework we've developed—understanding it as momentum diffusion—directly connects to the **instabilities** and **singularities** that emerge in soft matter flows. In Lecture 3, we will see how surface tension and viscosity compete to either suppress or amplify perturbations at interfaces, leading to phenomena like the Rayleigh–Plateau instability and capillary breakup.

Understanding *why* momentum diffusion acts like a dissipative force (damping) is central to analyzing these instabilities.

---

## Key Takeaways

1. **Viscosity is momentum diffusion.** The same framework that describes heat spreading describes how shear spreads through a fluid.

2. **Kinetics connects to continuum.** A simple kinetic-theory argument ($\eta \sim \rho \bar{c} \lambda$) bridges molecular collisions and macroscopic stress.

3. **No-slip emerges from momentum accommodation.** The wall isn't a boundary condition imposed from above—it's a consequence of efficient tangential momentum randomization at collisions.

4. **Temperature effects differ.** Gases become more viscous when heated (faster molecules); liquids usually become less viscous (cage-breaking). Recognizing this inversion is important for intuition.

5. **Reynolds number quantifies the balance.** Re = (inertial effects) / (viscous effects). High Re: inertia dominates. Low Re: viscosity dominates. The transition is where interesting physics happens.

6. **Continuum equation mirrors diffusion.** The PDE $\partial u/\partial t = \nu \partial^2 u/\partial y^2$ is the Navier–Stokes momentum equation in its simplest form. Recognizing $\nu$ as a diffusivity (not just a material property) unifies understanding.

---

## Further Reading

### Foundational Texts
- **de Gennes, P.-G.** (1979). *Scaling Concepts in Polymer Physics*. Cornell University Press. — Soft matter perspective on viscosity
- **Landau & Lifshitz** (1987). *Fluid Mechanics* (2nd ed.). Pergamon. — Classical continuum mechanics with kinetic theory foundations

### Advanced Topics
- **Evans & Searles** (2002). "The fluctuation theorem." *Advances in Physics*, **51**(7), 1529–1585. — Non-equilibrium statistical mechanics
- **Kremer & Grest** (1990). "Dynamics of entangled linear polymer melts." *The Journal of Chemical Physics*, **92**(8), 5057–5086. — Polymer rheology from kinetic theory

### Application Areas
- **Doi, M. & Edwards, S. F.** (1986). *The Theory of Polymer Dynamics*. Oxford University Press. — Viscoelasticity and non-Newtonian viscosity

---

> [!significance]- Metadata
> Author:: [Vatsal Sanjay](https://vatsalsanjay.com)<br>
> Date published:: Oct 29, 2025<br>
> Date modified:: Oct 29, 2025
>
> Lecture note on viscosity as momentum diffusion, connecting kinetic theory to continuum mechanics and soft matter flows.

> [!link] Back to main website
> [Home](https://comphy-lab.org/), [Team](https://comphy-lab.org/team), [Research](https://comphy-lab.org/research), [Github](https://github.com/comphy-lab)
>
> 📝 [Edit this page on GitHub](https://github.com/comphy-lab/CoMPhy-Lab-Blogs/blob/main/Lecture-Notes/Intro-Soft-Matter/2-What-is-Viscosity.md)
