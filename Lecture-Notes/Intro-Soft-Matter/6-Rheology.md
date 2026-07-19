---
modified: 2026-07-19T12:41:45+01:00
tags:
  - lecture
  - soft-matter
  - rheology
  - measurement
  - characterization
lecture-number: 6
date: 2025-11-19
status: done ✅
publish: true
---

<!-- PDF-EXPORT-IGNORE-START -->
> [!info] 📄 PDF Version
> [Download PDF](./6-Rheology.pdf)
<!-- PDF-EXPORT-IGNORE-END -->

# Lecture 6: Rheology – Measuring "Softness" and Time-Dependent Response

## Key Topics

### What is Rheology?

**Definition:** The study of flow and deformation of matter

**Central Question:** How do we quantify the softness or flow behavior of a material?

**Focus:**
- Experimental rheology
- Storage and loss moduli (G', G")
- Viscosity as function of shear rate or frequency
- Relaxation timescales

## Storage and Loss Moduli

### Linear Viscoelastic Characterization

**Method:** Small oscillatory deformations

**Apply oscillating strain:**
$$\gamma(t) = \gamma_0 \sin(\omega t)$$

**Measure resulting stress:**
$$\sigma(t) = \gamma_0 [G' \sin(\omega t) + G" \cos(\omega t)]$$

### Storage Modulus (G')

**Physical Meaning:**
- **In-phase** stress response
- Energy **stored** like a spring
- Measure of material **stiffness**
- Elastic component

**When G' dominates:**
- Material behaves solid-like
- Most energy stored and recovered
- Little energy dissipation

### Loss Modulus (G")

**Physical Meaning:**
- **Out-of-phase** stress response
- Energy **dissipated** as heat like a dashpot
- Viscous component
- Energy lost per cycle

**When G" dominates:**
- Material behaves fluid-like
- Energy dissipated as heat
- Flow-dominated behavior

### Phase Angle and Loss Tangent

**Phase Angle (δ):**
- Lag between stress and strain
- δ = 0° → Purely elastic (all energy stored)
- δ = 90° → Purely viscous (all energy lost)

**Loss Tangent:**
$$\tan \delta = \frac{G"}{G'}$$

**Interpretation:**
- tan δ >> 1: Very damped, fluid-like
- tan δ << 1: Elastic, solid-like
- tan δ ~ 1: Balanced viscoelastic behavior

## Rheometry Techniques

### 1. Rotational (Shear) Rheometer

**Common Configuration:**
- Material sandwiched between plates
- Or cone-and-plate geometry
- Apply controlled strain or stress

**Measurements:**

**Steady Shear:**
- Measure viscosity: η = (shear stress)/(strain rate)
- Flow curves
- Shear-thinning or thickening behavior

**Oscillatory Shear:**
- Measure G' and G"
- Frequency sweeps
- Amplitude sweeps

**Cone-Plate Geometry:**
- Advantage: Uniform shear across radius
- Precise measurements
- Common in research

### 2. Creep Test

**Procedure:**
1. Apply constant stress
2. Watch strain vs time

**Results by Material Type:**

**Elastic Solid:**
- Immediate strain
- Then no further creep
- Constant strain (if truly Hookean)

**Viscous Fluid:**
- Strain increases linearly forever
- No asymptote
- Slope = 1/η

**Viscoelastic Material:**
- **Kelvin-Voigt behavior:** Immediate elastic jump + slow creep → asymptote
- **Maxwell behavior:** Indefinite creep (has liquid component)

**Information Gained:**
- Directly measures compliance (how "soft")
- Time-dependent response
- Viscosity at long times

### 3. Stress Relaxation Test

**Procedure:**
1. Apply quick fixed strain
2. Hold constant
3. Measure stress decay over time

**Results by Material Type:**

**Purely Elastic:**
- Constant stress (no decay)

**Viscoelastic:**
- **Maxwell fluid:** Decays to zero eventually
  $$\sigma(t) = \sigma_0 e^{-t/\tau}$$
- **With permanent network:** Decays to plateau

**Information Gained:**
- Relaxation time τ
- Material's internal timescale
- Separates elastic (short-term) and viscous (long-term)

### 4. Dynamic Mechanical Analysis (DMA)

**Application:** Solid samples (polymer bars, films)

**Method:**
- Oscillatory loading
- Often in tension or bending
- Similar concept to rotational rheometry

**Advantages:**
- For materials that can't flow into gap
- Temperature sweeps
- Glass transition measurements

### 5. Other Methods

**Capillary Viscometers:**
- For simple fluids
- Measure flow through tube
- Use Poiseuille's law
- Older method but still useful

## Interpreting G' and G"

### Practical Meanings

**G' >> G" (Storage dominates):**
- Material is **gel-like** or **solid-like**
- Can support deforming load elastically
- Barely flows
- Example: Firm gel, rubber

**G" >> G' (Loss dominates):**
- Material is **liquid-like**
- Will flow and not hold shape
- Most energy dissipated
- Example: Viscous liquid, honey

**G' ≈ G" (Crossover):**
- **Critical point**
- Marks characteristic timescale
- Material transitions from solid to liquid behavior
- Important for gel point determination

### Frequency Dependence

**Many Soft Materials:**
- G' < G" at **low frequencies** (fluid-like, long times)
- G' > G" at **high frequencies** (solid-like, short times)
- Crossover at ω ≈ 1/τ (relaxation time)

**Physical Interpretation:**
- High frequency (fast deformation): No time to relax → solid
- Low frequency (slow deformation): Plenty of time to relax → liquid

**Example Plot:**
- X-axis: Frequency (ω)
- Y-axis: G', G" (log scale)
- Show crossover point
- Identify relaxation time from crossover

## Quantifying Softness

### For Solids: Modulus

**Young's Modulus or Shear Modulus:**

**Measure of Stiffness:**
- High modulus → stiff → "hard"
- Low modulus → compliant → "soft"

**Examples:**
- Hard plastic: E ~ 3 GPa
- Rubber: E ~ 1 MPa (1000× softer)
- Soft silicone gel: E ~ 50 kPa (60× softer than rubber)
- Brain tissue: E ~ 1 kPa (extremely soft)

**Biological Relevance:**
- Tissue engineering cares deeply about modulus
- Cells respond to substrate stiffness
- Preview of Engler et al. paper (Lectures 7-8)

### For Fluids: Viscosity

**Measure of Flow Resistance:**
- Low viscosity → flows easily
- High viscosity → flows slowly

**Examples (at room temperature):**
- Water: η ~ 1 mPa·s (very fluid)
- Blood: η ~ 3-4 mPa·s
- Olive oil: η ~ 100 mPa·s
- Honey: η ~ 10,000 mPa·s = 10 Pa·s
- Glycerol: η ~ 1000 mPa·s = 1 Pa·s

### Non-Newtonian Behavior

**Shear-Thinning:**
- Viscosity **decreases** with shear rate
- Common in polymer solutions, paints
- Example: Ketchup (shaking lowers viscosity)

**Shear-Thickening:**
- Viscosity **increases** with shear rate
- Example: Cornstarch suspension (oobleck)
- Acts solid under impact
- Preview of Waitukaitis & Jaeger paper

**Rheometer Detection:**
- Flow curve: Stress vs shear rate
- Slope changes reveal non-Newtonian behavior

### Frequency-Dependent Softness

**Key Insight:**
Softness can depend on measurement frequency!

**Example: Silly Putty**
- Measured slowly (low ω): Low effective modulus (soft, flows)
- Measured quickly (high ω): High effective modulus (stiff, bounces)

**Practical Implication:**
Must specify conditions when reporting "softness"

## Examples and Case Studies

### Laboratory Demonstration

**Rheometer Reading:**
- Show real data from rheometer
- Oscillatory test on known material
- Point out G', G" values
- Discuss crossover frequency

**Tabletop Viscoelastic:**
- Gelatin dessert
- Quick oscillation (tapping) vs slow deformation (letting sag)
- Relate to G' and G"

### Jello vs Silly Putty

**Jello at Room Temperature:**
- Jiggles (G' low, near solid/liquid boundary)
- Breaks if strained too far
- Gel with low modulus
- G' > G" but both relatively small

**Silly Putty:**
- Frequency-dependent as discussed previously
- Classic example of viscoelasticity

### Polymer Dynamic Mechanical Analysis

**Example: Polyvinyl chloride (PVC)**

**Below Glass Transition (~60°C):**
- G' >> G" (glassy solid)
- Very stiff
- Brittle

**Above Glass Transition:**
- G" >> G' (rubbery flow)
- Much softer
- Can flow

**Demonstrates:**
- Temperature plays similar role to frequency
- Time-temperature superposition

### Data Example: Frequency Sweep

**Generic Polymer Melt or Colloidal Paste:**

**Low ω:**
- G" > G' (fluid-like)
- Material has time to flow

**High ω:**
- G' > G" (solid-like)
- No time to relax

**Crossover at ω₀:**
- Mark: ω₀ = 1/τ
- Identifies relaxation time

### Shear-Thinning Example

**Ketchup Viscosity:**
- High viscosity at low shear (doesn't flow from bottle)
- Low viscosity at high shear (flows when shaken/squeezed)
- Flow curve shows decreasing viscosity with shear rate

**Why:** Structure breaks down under shear

## Discussion Questions

### 1. Making Measurements

**Scenario:** New synthesized hydrogel

**Question:** Want to know if it's solid-like or liquid-like. What experiment?

**Answer:**
- Oscillatory shear test at relevant frequency
- Or simple poke test: rebounds (elastic) vs slowly indents (viscous)
- Look at G' vs G"

### 2. Interpreting Moduli

**Data:** Material has G' = 1000 Pa, G" = 200 Pa at 1 Hz

**Question:** How would it behave if deformed rhythmically at 1 Hz?

**Answer:**
- Mostly elastic response
- Will return ~80% of energy
- Only 20% lost
- Will hold shape and only slowly relax

**Follow-up:** What if frequency increases where G" rises and G' drops?

### 3. Measuring Viscosity Without High-End Rheometer

**Question:** How to measure honey viscosity?

**Possible Answers:**
- Timed flow experiment (drip and use gravity + Poiseuille's law)
- Falling ball viscometer (Stoke's law)
  - Drop marble in honey
  - Measure terminal speed
  - Compute viscosity

**Engages:** Creative thinking about measurements

### 4. Relaxation Time Thought Experiment

**Comparison:** Cold honey vs warm honey

**Question:** How would relaxation times differ?

**Answer:**
- Warm honey: Lower viscosity → faster relaxation (low τ)
- Cold honey: Higher viscosity → slower relaxation (high τ)
- At room temp: Flows quickly
- At fridge temp: Almost solid-like (τ very long)

**Insight:** "Colder = more solid-like" because molecular motion slows

### 5. Rheology in Everyday Life

**Ketchup Question:**
Why does shaking bottle make it easier to pour?

**Answer:**
- Shear-thinning behavior
- Structure breaks down
- Viscosity decreases
- Easier flow

**Milkshake Question:**
Why add polymers (like carboxymethyl cellulose) to make thicker?

**Answer:**
- Increase zero-shear viscosity
- Suspension stays uniform (slower creaming)
- Gives smoother "body"
- Better mouthfeel

## Key Concepts Summary

### Rheological Properties

| Property | Symbol | Units | Meaning |
|----------|--------|-------|---------|
| **Storage Modulus** | G' | Pa | Elastic stiffness, energy stored |
| **Loss Modulus** | G" | Pa | Viscous dissipation, energy lost |
| **Complex Modulus** | G* | Pa | $\|G^*\| = \sqrt{G'^2 + G"^2}$ |
| **Loss Tangent** | tan δ | - | G"/G' (damping ratio) |
| **Viscosity** | η | Pa·s | Flow resistance |

### Experimental Methods Summary

| Method | Measures | Best For |
|--------|----------|----------|
| **Oscillatory Shear** | G', G" | Viscoelastic characterization |
| **Steady Shear** | η(γ̇) | Flow curves, non-Newtonian |
| **Creep** | J(t) | Compliance, long-time behavior |
| **Stress Relaxation** | G(t) | Relaxation time, memory |
| **DMA** | E', E" | Solid samples, temperature sweeps |

## Practical Insights

### Why Rheological Properties Matter

**Material Processing:**
- Polymer melt needs right viscosity to mold
- Cured rubber needs right modulus for application

**Formulation Stability:**
- Mayonnaise with higher G' holds shape on sandwich
- Paint with proper shear-thinning flows on brush but not off wall

**Product Performance:**
- Tire rubber needs damping (G") for ride comfort
- But stiffness (G') for handling

**Biological Systems:**
- Mucus rheology affects clearance
- Blood viscosity affects circulation
- Cell mechanics affect function

### Connecting Lab Numbers to Tactile Impressions

**Why peanut butter doesn't flow from jar:**
- High zero-shear viscosity
- Often has yield stress
- Requires finite stress to initiate flow

**Why shampoo thins when squeezed:**
- Shear-thinning behavior
- Polymer network breaks down temporarily

## Preparation for Next Lecture

Next lectures: **Student Presentations** (Lectures 7-8, 2-hour session)

**Prepare:**
- Read selected paper carefully
- Understand key concepts and methods
- Prepare 10-12 minute presentation
- Be ready for questions from peers

**Papers span:**
- Historical foundations (Einstein, Onsager, de Gennes)
- Novel materials (auxetics, soft robots)
- Phase transitions (jamming, active matter)
- Applications (mechanobiology, shear thickening)

## References

1. "Storage modulus (G') and loss modulus (G") for beginners" - Rheology Lab
2. "Basics of Dynamic Mechanical Analysis (DMA)" - Anton Paar Wiki
3. Macosko, C.W. "Rheology: Principles, Measurements, and Applications" (1994)
4. Barnes, H.A. "A Handbook of Elementary Rheology" (2000)

---

**Previous Lecture:** [[5-Viscoelasticity|Lecture 5: Elastic vs Viscous vs Viscoelastic]]
**Next Lecture:** [[7-8-Student-Presentations|Lectures 7-8: Student Presentations]]
**Course Home:** [[0-README|Course Overview]]

> [!significance]- Metadata
> Author:: [Vatsal Sanjay](https://vatsalsanjay.com)<br>
> Date published:: Jul 19, 2026<br>
> Date modified:: Jul 19, 2026

> [!link] Back to main website
> [Home](https://comphy-lab.org/), [Team](https://comphy-lab.org/team), [Research](https://comphy-lab.org/research), [Github](https://github.com/comphy-lab)
>
> 📝 [Edit this page on GitHub](https://github.com/comphy-lab/CoMPhy-Lab-Blogs/blob/main/Lecture-Notes/Intro-Soft-Matter/6-Rheology.md)
