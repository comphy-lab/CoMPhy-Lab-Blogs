---
modified: 2026-07-19T12:41:45+01:00
tags:
  - lecture
  - soft-matter
  - viscoelasticity
  - rheology
  - material-behavior
lecture-number: 5
date: 2025-11-12
status: done ✅
publish: true
---

<!-- PDF-EXPORT-IGNORE-START -->
> [!info] 📄 PDF Version
> [Download PDF](./5-Viscoelasticity.pdf)
<!-- PDF-EXPORT-IGNORE-END -->

# Lecture 5: Elastic vs Viscous vs Viscoelastic Behavior

## Key Topics

### How Materials Deform

Contrasting three fundamental behaviors:
1. **Elastic Solids** - Store energy, recover shape
2. **Viscous Fluids** - Dissipate energy, flow continuously
3. **Viscoelastic Materials** - Combine both behaviors

## 1. Elastic (Hookean) Behavior

### Defining Characteristics

**Hooke's Law:**
$$\sigma = E \cdot \varepsilon$$

Where:
- σ = stress (force per unit area)
- E = Young's modulus (material stiffness)
- ε = strain (fractional deformation)

**Key Properties:**
- Stress proportional to **strain** (not rate)
- Deform under load but **store energy**
- **Recover original shape** when load removed
- Energy stored elastically (like a spring)

### Examples
- Spring
- Rubber band (small extension)
- Steel beam (small deformations)
- Hard plastic below glass transition temperature

### Stress-Strain Curves

**Linear Elastic Regime:**
- Straight line
- Slope = Young's modulus E
- Higher E → more stress needed for same strain (stiffer)

**Shear Modulus:**
- For shear deformations: τ = G·γ
- G = shear modulus
- Similar concept, different geometry

### Typical Moduli Values
- **Steel:** E ~ 200 GPa (very stiff)
- **Rubber:** E ~ 1 MPa (soft)
- **Silicone gel:** E ~ 50 kPa (very soft)
- **Brain tissue:** E ~ 1 kPa (extremely soft)

## 2. Viscous (Newtonian) Behavior

### Defining Characteristics

**Newton's Law of Viscosity:**
$$\tau = \eta \cdot \dot{\gamma}$$

Where:
- τ = shear stress
- η = viscosity (Pa·s)
- $\dot{\gamma}$ = shear rate (strain rate)

**Key Properties:**
- Stress proportional to **strain rate** (not strain itself)
- Flows continuously under any applied stress
- **Dissipates energy** as heat (irreversible)
- No shape recovery when stress removed

### Examples
- Water (η ≈ 1 mPa·s)
- Honey (η ≈ 10 Pa·s, ~10,000× water)
- Glycerol (η ≈ 1 Pa·s)
- Motor oil

### Dimensional Analogy

| Property | Elastic | Viscous |
|----------|---------|---------|
| **Relation** | σ = E·ε | τ = η·$\dot{\gamma}$ |
| **Units** | Pa = N/m² | Pa·s |
| **Response to** | Strain | Strain rate |
| **Energy** | Stored | Dissipated |

### Behavior Under Load
- If you stop applying stress to viscous fluid:
  - Deformation continues until stress is zero
  - No recovery
  - Fluid remains in deformed state

## 3. Viscoelastic Behavior

### Combined Characteristics

**Definition:** Materials exhibiting **both** elastic and viscous behaviors
- Deform like elastic solid on **short timescales**
- Flow like viscous fluid over **long times**
- Behavior depends on observation timescale

### Common Viscoelastic Materials
- Polymers (quintessential examples)
- Biological tissues (cartilage, muscle, skin)
- Gels
- Silly putty (classic demo material)
- Many food products (dough, cheese, etc.)

## Spring-Dashpot Models

### Maxwell Model

**Configuration:** Spring and dashpot in **series**

**Represents:** Fluid with memory

**Behavior:**
- Can relax stress over time
- If sudden strain applied and held:
  - Initially: High stress (spring compressed)
  - Over time: Stress gradually decays (dashpot flows)
  - Eventually: Stress → 0 (full relaxation)

**Equation:**
$$\dot{\varepsilon} = \frac{\dot{\sigma}}{E} + \frac{\sigma}{\eta}$$

**Relaxation Time:**
$$\tau_M = \frac{\eta}{E}$$

### Kelvin-Voigt Model

**Configuration:** Spring and dashpot in **parallel**

**Represents:** Solid that creeps under load

**Behavior:**
- Under sudden load:
  - No instantaneous elastic jump (dashpot resists)
  - Gradual spring deformation (creep)
  - Approaches equilibrium asymptotically
- When load removed:
  - Slow recovery back to original shape

**Equation:**
$$\sigma = E\varepsilon + \eta\dot{\varepsilon}$$

**Retardation Time:**
$$\tau_K = \frac{\eta}{E}$$

## Stress Relaxation and Creep

### Stress Relaxation

**Experiment:**
1. Apply sudden fixed strain
2. Hold constant
3. Measure stress vs time

**Results:**
- **Elastic material:** Constant stress (no decay)
- **Viscoelastic (Maxwell):** Stress decays exponentially
  $$\sigma(t) = \sigma_0 e^{-t/\tau_M}$$
- **Time constant τ_M** = relaxation time

### Creep

**Experiment:**
1. Apply constant stress
2. Measure strain vs time

**Results:**
- **Elastic:** Immediate strain, then constant
- **Viscous:** Strain increases linearly forever
- **Viscoelastic (Kelvin-Voigt):**
  - Immediate dashpot resistance
  - Gradual approach to equilibrium
  - $$\varepsilon(t) = \frac{\sigma_0}{E}(1 - e^{-t/\tau_K})$$

## Relaxation Time Concept

### Definition

**Relaxation Time (τ):** Characteristic time for material to transition from elastic to viscous response

**Physical Meaning:**
- Maxwell time: τ = η/E
- Time for stress to decay to 1/e of initial value
- Separates elastic (short-term) and viscous (long-term) regimes

### Time-Scale Dependence

**Fast Observation (t << τ):**
- Material behaves **elastic** (solid-like)
- Dashpot "frozen" (hasn't had time to flow)
- Spring dominates

**Slow Observation (t >> τ):**
- Material behaves **viscous** (liquid-like)
- Spring equilibrated
- Dashpot flows freely

**Application to Silly Putty:**
- τ ~ few seconds
- Quick poke (t << τ): Bounces like ball (elastic)
- Slow pull (t >> τ): Flows like liquid (viscous)

## Examples and Case Studies

### Silly Putty Demonstration

**Classic Demo:**

**Fast Impact (High Strain Rate):**
1. Roll into ball
2. Drop from height
3. **Bounces** like elastic ball
4. Behavior: Solid-like (t << τ)

**Slow Deformation (Low Strain Rate):**
1. Take same putty
2. Slowly pull apart
3. **Flows** and strands out like liquid
4. Can form thin filament that necks
5. Behavior: Liquid-like (t >> τ)

**Very Fast (Brittle Failure):**
- Quick yank → snaps (brittle behavior)
- Elastic domination with insufficient time for viscous flow

### Metal vs Polymer Comparison

**Metal Spring:**
- Apply weight briefly
- Springs back **immediately**
- Pure elastic response
- Negligible viscous component

**Viscoelastic Polymer Strip:**
- Apply same weight
- Might slowly rebound
- Or not fully recover if short time
- Clear viscoelastic behavior

### Pitch Drop Experiment

**Famous Long-Term Experiment:**

**Short Timescale (Impact):**
- Block of pitch (tar)
- Hit with hammer → **shatters**
- Feels solid, elastic

**Long Timescale (Years):**
- Over ~10 years, drops form and fall out
- **Flows** like extremely viscous liquid
- Demonstrates extreme relaxation time (years!)

**Lesson:** Time scale of observation matters!

### Quantitative Example

**Dynamic Testing:**
- **Water:** Phase angle δ ≈ 90° (all viscous, no elastic storage)
- **Rubber:** Phase angle δ ≈ 0° (all elastic storage)
- **Silly putty:** Phase angle δ ≈ 45° at intermediate frequencies (half-half)

**Units Reminder:**
- Elastic modulus: Pa
- Viscosity: Pa·s
- Example values:
  - Rubber E ~ 1 MPa
  - Honey η ~ 10 Pa·s
  - Silly putty τ ~ seconds

## Learning Outcomes

Students will be able to:

1. **Differentiate elastic vs viscous response**
   - State defining constitutive relations (Hooke's law vs Newton's viscosity law)
   - Qualitatively describe behavior under load

2. **Give examples of each type**
   - Elastic: Steel, hard plastic below T_g, rubber (small strains)
   - Viscous: Water, oil, glycerin
   - Viscoelastic: Silly putty, cartilage, polymer melt
   - Justify classifications

3. **Understand viscoelastic models**
   - Maxwell model: Initial stress from spring, then decays as dashpot flows
   - Kelvin-Voigt: Sudden stress → dashpot resistance + gradual spring deformation
   - Conceptual understanding (no ODE solving required)

4. **Interpret storage vs loss qualitatively**
   - Viscoelastic material has:
     - **Storage modulus** (elastic part, energy stored)
     - **Loss modulus** (viscous part, energy dissipated)
   - More elastic → bounces back (stores energy)
   - More viscous → damps motion (loses energy as heat)

5. **Apply time-scale reasoning**
   - Predict material behavior based on deformation rate
   - Quick stretch → stiff (elastic)
   - Slow stretch → soft/flowy (viscous)
   - Articulate relaxation time concept

## Discussion Questions

### 1. Identify Behaviors

**Scenarios to classify:**

- **Bowling ball impacts cement floor and rebounds**
  - Mostly elastic (some energy lost)

- **Person slowly sinking into memory foam mattress**
  - Viscoelastic (slow deformation over time)

- **Toothpaste extruded from tube**
  - Mostly viscous flow (with yield stress)

- **Guitar string vibrating**
  - Elastic

**Task:** Students debate and justify answers

### 2. Spring vs Dashpot Analogy

**Questions:**

- If you stretch Maxwell material (spring+dashpot series) and hold, what happens to stress?
  - Initially: High stress from spring
  - Over time: Gradually decays (dashpot relieves it)
  - **Stress relaxation**

- If suddenly released after long hold, will it return to original length?
  - No – dashpot has flowed (permanent deformation)
  - Only spring part returns
  - Some deformation remains

- How does this differ from Kelvin-Voigt under sudden load?

### 3. Energy Storage vs Loss

**Scenario:**
Two materials feel similarly stiff when tapped, but one gets warm when bent repeatedly, the other doesn't.

**Question:** What does this indicate?
- Warming material: Dissipating energy → higher **loss modulus**
- Non-warming: Stores-returns energy → higher **storage modulus**

**Examples:**
- Rubber bands heating up after stretching
- Car tires heating up (viscoelastic damping)

### 4. Design Considerations

**Shoe Sole for Runners:**
- More elastic or more viscous?
- **Discussion:**
  - Elastic: Returns energy (spring in step)
  - Viscous: Absorbs energy (shock absorption)
  - Likely want mix (viscoelastic)
  - Different answers possible
  - Shows engineering balance

**Seismic Dampers:**
- Should be highly **viscous**
- Dissipate earthquake energy
- Not elastic (would spring back and forth)
- Connects material behavior to function

## Key Concepts to Remember

### Elastic Behavior
- **Relation:** σ = E·ε
- **Energy:** Stored (recoverable)
- **Response:** Immediate
- **Examples:** Springs, metals, rubber (small strain)

### Viscous Behavior
- **Relation:** τ = η·$\dot{\gamma}$
- **Energy:** Dissipated as heat
- **Response:** Continuous flow
- **Examples:** Water, honey, oils

### Viscoelastic Behavior
- **Models:** Maxwell (fluid-like) vs Kelvin-Voigt (solid-like)
- **Key parameter:** Relaxation time τ = η/E
- **Time dependence:** Solid when fast, liquid when slow
- **Examples:** Polymers, silly putty, tissues

### Storage vs Loss
- **Storage modulus (G'):** Elastic energy stored
- **Loss modulus (G"):** Viscous energy dissipated
- **Phase angle (δ):** tan δ = G"/G'
- Sets up next lecture on rheology!

## Preparation for Next Lecture

Next lecture: **Rheology – Measuring "Softness"**

Consider:
- How do we experimentally measure these properties?
- What is a rheometer?
- How do G' and G" relate to oscillatory tests?
- What does "soft" really mean quantitatively?

## References

1. "What is a Viscoelastic material?" - Biolin Scientific
2. Ferry, J.D. "Viscoelastic Properties of Polymers" (1980)
3. Lakes, R.S. "Viscoelastic Materials" (2009)
4. Newtonian fluid - Wikipedia

---

**Previous Lecture:** [[4-Soft-Matter-Singularities|Lecture 4: Finite-Time Singularities]]
**Next Lecture:** [[6-Rheology|Lecture 6: Rheology]]
**Course Home:** [[0-README|Course Overview]]

> [!significance]- Metadata
> Author:: [Vatsal Sanjay](https://vatsalsanjay.com)<br>
> Date published:: Jul 19, 2026<br>
> Date modified:: Jul 19, 2026

> [!link] Back to main website
> [Home](https://comphy-lab.org/), [Team](https://comphy-lab.org/team), [Research](https://comphy-lab.org/research), [Github](https://github.com/comphy-lab)
>
> 📝 [Edit this page on GitHub](https://github.com/comphy-lab/CoMPhy-Lab-Blogs/blob/main/Lecture-Notes/Intro-Soft-Matter/5-Viscoelasticity.md)
