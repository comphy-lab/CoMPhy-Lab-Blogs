---
modified: 2025-10-30T11:14:42+00:00
---
# Coarse-Grained Continuum Mechanics – Conservation Laws

> Here, we only consider the continuum picture. <br>
> See [[2.5-Conservation-Laws]] for first principle derivations

## Key Topics

### Bridging Microscopic to Continuum Description

Introduction to Coarse-Graining:
- How we average over many atoms/molecules to treat a material as continuous fields
- Density, velocity, etc. on scales large compared to molecular size
- Motivation for continuum view in soft matter
- Example: A polymer solution or foam modeled as a continuous medium despite discrete entities

### Fundamental Conservation Laws

Derived via coarse-graining:

1. Conservation of Mass (continuity equation)
2. Conservation of Momentum (Newton's second law in continuum form → Euler or Navier-Stokes equations)
3. Conservation of Energy (first law of thermodynamics in continuum form)

### Physical Meaning of Conservation Laws

Integral Form:
- What goes in minus what goes out = accumulation

Differential Form:
- Local divergence form
- Changes at a point due to flows or sources at that point

### The Continuum Hypothesis

Assumptions:
- Material properties vary smoothly
- Can be defined at a "point" much larger than molecular scale
- Point must be small compared to system size
- Scales much larger than the mean free path of the molecules $\lambda$. 

### Field Variables

Result of coarse-graining:
- Velocity field: $\boldsymbol{v}(\boldsymbol{r}, t)$
- Pressure: $p(\boldsymbol{r}, t)$
- Density: $\rho(\boldsymbol{r}, t)$
- etc.

## Learning Outcomes

1. State the three main conservation laws
   - Mass, momentum, energy in words
   - Recognize their mathematical forms

1. Derive a basic continuity equation
   - Starting from a small fixed volume
   - Show that mass change = (mass in) – (mass out)
   - Translate to: $\frac{\partial \rho}{\partial t} + \nabla\cdot(\rho \boldsymbol{v}) = 0$

1. Identify terms in momentum equation
   - Understand: $\rho \frac{D\boldsymbol{v}}{Dt} = \nabla\cdot \boldsymbol{\sigma} + \boldsymbol{f}_{\text{ext}}$
   - In words: mass×acceleration = forces from stress gradient + external forces
   - Grasp where inertia, pressure, and viscosity enter

1. Connect to physical reasoning
   - Apply conservation laws to simple scenarios
   - Example: Squeezing toothpaste tube (mass conservation + incompressibility)
   - Example: Fluid speeding up in narrow pipe (continuity with constant flow rate)
   - Articulate local vs global conservation (nothing "teleports")

## Conservation Law Details

### 1. Conservation of Mass

Physical Statement:
Mass cannot be created or destroyed (for systems without nuclear reactions or relativistic effects).

Integral Form:
$$\frac{d}{dt}\int_V \rho \, dV = -\int_S \rho \boldsymbol{v} \cdot \boldsymbol{n} \, dS$$

Differential Form (Continuity Equation):
$$\frac{\partial \rho}{\partial t} + \nabla\cdot(\rho \boldsymbol{v}) = 0$$

For incompressible fluids (constant density):
$$\nabla\cdot\boldsymbol{v} = 0$$

### 2. Conservation of Momentum

Physical Statement:
Newton's second law applied to a fluid element: Rate of change of momentum equals sum of forces.

Differential Form:
$$\rho \frac{D\boldsymbol{v}}{Dt} = \nabla\cdot \boldsymbol{\sigma} + \boldsymbol{f}_{\text{ext}}$$

Where:
- $\frac{D}{Dt}$ = material derivative (following fluid parcel)
- $\boldsymbol{\sigma}$ = stress tensor
- $\boldsymbol{f}_{\text{ext}}$ = external body forces (e.g., gravity)

For Newtonian fluids (Navier-Stokes):
$$\rho \left(\frac{\partial \boldsymbol{v}}{\partial t} + \boldsymbol{v}\cdot\nabla\boldsymbol{v}\right) = -\nabla p + \eta \nabla^2 \boldsymbol{v} + \boldsymbol{f}_{\text{ext}}$$

### 3. Conservation of Energy

Physical Statement:
First law of thermodynamics: Change in energy equals heat added plus work done.

Differential Form:
$$\rho \frac{De}{Dt} = -\nabla\cdot\boldsymbol{q} + \boldsymbol{\sigma}:\nabla\boldsymbol{v}$$

Where:
- $e$ = specific internal energy
- $\boldsymbol{q}$ = heat flux
- $\boldsymbol{\sigma}:\nabla\boldsymbol{v}$ = viscous dissipation term

## Examples and Case Studies

### Mass Conservation Example

Pipe Flow:
- Water flowing through a pipe that splits into two branches
- If 2 L/min enters, sum out of branches must be 2 L/min (steady state, incompressible)
- Illustrates: $\dot{m}_{\text{in}} = \dot{m}_{\text{out}}$

Variable Cross-Section:
- If one branch is partially closed, water velocity increases there
- Smaller area → higher speed to satisfy continuity
- Analogous to blood flow speeding up in a narrowed artery

### Momentum Conservation Example

Soft Gel in Slingshot:
- When stretched and released, momentum is transferred to the gel
- Causes it to fly
- Continuum terms: Internal elastic forces (stress) accelerated the gel's mass

Stone in Pond:
- Dropping a stone in a pond
- Momentum from gravity and impact is redistributed via:
  - Pressure waves (sound)
  - Fluid motion
- Violating momentum conservation locally leads to observable flows

### Energy Conservation Example

Silly Putty Ball:
- Dropped from height, deforms and warms slightly on impact
- Potential energy → deformation work + heat
- Illustrates energy bookkeeping

Mixing Fluids:
- Slow mixing of glycerol and water
- Mechanical work (stirring) dissipated as heat via viscous stress
- Internal energy increase consistent with energy conservation


## Key Equations Summary

| Conservation Law | Differential Form | Key Insight |
|-----------------|-------------------|-------------|
| Mass | $\frac{\partial \rho}{\partial t} + \nabla\cdot(\rho \boldsymbol{v}) = 0$ | Local density change = net flux |
| Momentum | $\rho \frac{D\boldsymbol{v}}{Dt} = \nabla\cdot \boldsymbol{\sigma} + \boldsymbol{f}_{\text{ext}}$ | Acceleration from stress + body forces |
| Energy | $\rho \frac{De}{Dt} = -\nabla\cdot\boldsymbol{q} + \boldsymbol{\sigma}:\nabla\boldsymbol{v}$ | Energy change = heat flux + work |

## Key Concepts to Remember

- Coarse-graining: Averaging microscopic behavior to obtain continuum fields
- Field variables: Density, velocity, pressure as functions of position and time
- Local conservation: Changes at a point due to local fluxes/sources only
- Continuum hypothesis: Valid when system >> molecular scale
- Incompressibility: Common assumption for liquids ($\nabla\cdot\boldsymbol{v} = 0$)

## References

1. Continuity equation - Wikipedia: https://en.wikipedia.org/wiki/Continuity_equation
2. Batchelor, G.K. "An Introduction to Fluid Dynamics" (1967)
3. Landau & Lifshitz "Fluid Mechanics" (1987)

---