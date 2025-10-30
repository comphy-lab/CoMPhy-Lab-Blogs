---
modified: 2025-10-30T11:17:18+00:00
created: 2025-03-12T01:24:38+01:00
---
# Non-Newtonian flows with Basilisk

> [!tldr] TL;DR 
> This assignment explores computational approaches to viscoelastic fluid dynamics using Basilisk. We investigate four advanced multiphase flow phenomena involving complex rheology: bursting bubbles in polymer solutions, viscoplastic drop impact, soft material impacts, and Taylor-Culick retraction of viscoelastic filaments. Each simulation incorporates non-Newtonian behavior characterized by dimensionless parameters including Weissenberg, Deborah, Ohnesorge, and elasto-capillary numbers. Through these simulations, we develop practical skills in implementing log-conformation formulations for numerical stability, handling complex interfaces with adaptive mesh refinement, and visualizing rheologically complex flows. This assignment represents the culmination of our computational fluid dynamics progression, building on earlier work with heat conduction, single-phase flows, and simple multiphase systems.

## Introduction

In this final assignment, we explore the fascinating world of viscoelastic fluid dynamics using computational simulations. Viscoelastic materials—from polymer solutions to biological fluids, food products, and advanced materials—exhibit both viscous (fluid-like) and elastic (solid-like) properties, leading to complex and often counterintuitive behaviors. Understanding these behaviors is crucial for applications ranging from inkjet printing and food processing to biological systems and advanced manufacturing.

Building on our previous work with heat conduction ([[1st-workingAssignment]]), single-phase flows ([[2nd-workingAssignment]]), and simple multiphase flows ([[3rd-workingAssignment]]), we now tackle the additional complexity introduced by non-Newtonian rheology, viscoelasticity, and viscoplasticity. These phenomena represent some of the most challenging aspects of computational fluid dynamics, requiring specialized numerical techniques for stable and accurate simulations.

> [!info] Learning Objectives
> 
> - Understand key mathematical models for viscoelastic and viscoplastic fluid behavior
> - Implement log-conformation formulations for numerical stability in viscoelastic simulations
> - Analyze how elasticity affects interfacial dynamics in multiphase flows
> - Apply adaptive mesh refinement strategies to resolve complex interface evolution
> - Develop skills in visualizing and interpreting non-Newtonian flow phenomena
> - Relate dimensionless parameters to physical behaviors in complex fluids

Throughout this assignment, we'll explore four complex multiphase flow simulations:

1. Bursting bubbles in viscoelastic media
2. Viscoplastic drop impact on a solid surface
3. Soft impact dynamics with viscoelastic fluids
4. Taylor-Culick retraction of viscoelastic filaments

Each case presents unique physical phenomena and numerical challenges, providing a comprehensive overview of computational approaches to viscoelastic fluid dynamics.

## Part 1: Viscoelastic Fluid Fundamentals

Before diving into specific simulations, let's establish the mathematical framework for understanding viscoelastic fluid behavior.

### 1.1 Constitutive Equations for Complex Fluids

Traditional Newtonian fluids are characterized by a linear relationship between stress and strain rate, governed by a constant viscosity:

$$\boldsymbol{\tau} = \mu \dot{\boldsymbol{\gamma}}$$

where $\boldsymbol{\tau}$ is the stress tensor, $\mu$ is the viscosity, and $\dot{\boldsymbol{\gamma}}$ is the strain rate tensor.

For non-Newtonian fluids, this relationship becomes more complex:

1. Viscoplastic fluids (e.g., Bingham plastics, Herschel-Bulkley fluids) exhibit a yield stress $\tau_y$ that must be exceeded before flow occurs:

$$\boldsymbol{\tau} = \begin{cases} \tau_{y}\frac{\dot{\boldsymbol{\gamma}}}{|\dot{\boldsymbol{\gamma}}|} + K|\dot{\boldsymbol{\gamma}}|^{n-1}\dot{\boldsymbol{\gamma}}, & \text{if } |\boldsymbol{\tau}| > \tau_y \ \dot{\boldsymbol{\gamma}} = 0, & \text{if } |\boldsymbol{\tau}| \leq \tau_y \end{cases} $$

2. Viscoelastic fluids exhibit memory effects, with stress depending on the deformation history. A common model is the Oldroyd-B model:

$$\boldsymbol{\tau} + \lambda \overset{\nabla}{\boldsymbol{\tau}} = \mu \left( \dot{\boldsymbol{\gamma}} + \lambda_r \overset{\nabla}{\dot{\boldsymbol{\gamma}}} \right)$$

where $\lambda$ is the relaxation time, $\lambda_r$ is the retardation time, and $\overset{\nabla}{\boldsymbol{\tau}}$ denotes the upper-convected derivative of the stress tensor.

### 1.2 Key Dimensionless Parameters

Several dimensionless parameters characterize the behavior of complex fluids:

1. Weissenberg number (Wi): Ratio of elastic to viscous forces $$\text{Wi} = \lambda \dot{\gamma}$$ where $\lambda$ is the relaxation time and $\dot{\gamma}$ is a characteristic strain rate
    
2. Deborah number (De): Ratio of material relaxation time to observation time $$\text{De} = \frac{\lambda}{t_{\text{obs}}}$$
    
3. Elasticity number (El): Ratio of elastic to inertial effects $$\text{El} = \frac{\text{Wi}}{\text{Re}} = \frac{\lambda \mu}{\rho L^2}$$
    
4. Ohnesorge number (Oh): Ratio of viscous forces to inertial and surface tension forces $$\text{Oh} = \frac{\mu}{\sqrt{\rho \sigma L}}$$
    
5. Plasto-capillary number (J): Ratio of yield stress to capillary pressure $$\mathcal{J} = \frac{\tau_y R_0}{\sigma}$$
    

> [!note] Numerical Challenge Simulating viscoelastic flows presents significant numerical challenges, particularly at high Weissenberg numbers (known as the "high Weissenberg number problem"). Traditional numerical methods often fail due to the loss of positive-definiteness of the conformation tensor. The log-conformation approach we'll use in these simulations addresses this issue by working with the logarithm of the conformation tensor, ensuring numerical stability.

### 1.3 The Log-Conformation Approach

In our simulations, we employ the log-conformation approach, which transforms the conformation tensor $\mathbf{A}$ logarithmically:

$$\mathbf{\Psi} = \log(\mathbf{A})$$

The evolution equation is then solved for $\mathbf{\Psi}$ rather than directly for $\mathbf{A}$, which ensures that the reconstructed conformation tensor remains positive-definite. This approach significantly improves numerical stability, especially for high Weissenberg number flows.

The total stress in the fluid is the sum of the Newtonian solvent contribution and the polymer stress:

$$\boldsymbol{\tau} = \mu_s (\nabla \mathbf{u} + \nabla \mathbf{u}^T) + \mathbf{G}(\mathbf{A} - \mathbf{I})$$

where $\mu_s$ is the solvent viscosity, $\mathbf{G}$ is the elastic modulus, and $\mathbf{I}$ is the identity tensor.

## Part 2: Bursting Bubbles in Viscoelastic Media

Our first simulation explores the dynamics of bubble bursting in viscoelastic fluids, a phenomenon that differs significantly from the Newtonian case due to elastic memory effects.

### 2.1 Physical Description

When a bubble reaches a free surface, the thin film separating it from the surrounding atmosphere eventually ruptures. This triggers a series of events:

1. Capillary waves travel along the interface
2. The bubble cavity collapses
3. A central jet may form and rise upward (Worthington jet)
4. Depending on conditions, the jet may break into droplets

In viscoelastic fluids, elastic stresses dramatically alter these dynamics, often leading to enhanced jet formation and reduced droplet breakup due to elastic resistance to extensional deformation.

> [!tldr] Problem Statement Simulate the bursting of a bubble at the interface between a viscoelastic fluid and air, examining how elasticity affects the jet dynamics and potential droplet formation. Key dimensionless parameters include:
> 
> - Deborah number (De): Ratio of relaxation time to flow time scale
> - Elasto-capillary number (Ec): Ratio of elastic forces to surface tension
> - Ohnesorge number (Oh): Ratio of viscous forces to inertial and capillary forces
> - Bond number (Bond): Ratio of gravitational forces to surface tension

### 2.2 Implementation Details

The simulation uses Basilisk's axisymmetric framework with a log-conformation approach for viscoelasticity:

```c
#include "axi.h"                  // Axisymmetric coordinates
#include "navier-stokes/centered.h"  // Main Navier-Stokes solver

// Viscoelastic model implementation
#if !_SCALAR
#include "log-conform-viscoelastic.h"  // Tensor implementation
#else 
#include "log-conform-viscoelastic-scalar-2D.h"  // Scalar implementation
#endif

#define FILTERED                           // Smear density and viscosity jumps
#include "two-phaseVE.h"                   // Two-phase flow with viscoelasticity
#include "navier-stokes/conserving.h"      // Conservative momentum advection
#include "tension.h"                       // Surface tension forces
```

The bubble is initialized using a pre-calculated equilibrium shape that balances surface tension and gravitational forces:

```c
event init (t = 0) {
  if (!restore (file = dumpFile)){
    // Read initial shape from data file
    char filename[60];
    sprintf(filename,"Bo%5.4f.dat",Bond);
    FILE * fp = fopen(filename,"rb");
    
    // Generate distance field from shape coordinates
    coord* InitialShape;
    InitialShape = input_xy(fp);
    fclose (fp);
    
    // Compute signed distance function
    scalar d[];
    distance (d, InitialShape);
    
    // Refine mesh based on distance function
    while (adapt_wavelet ((scalar *){f, d}, (double[]){1e-8, 1e-8}, MAXlevel).nf);
    
    // Convert distance function to volume fraction
    vertex scalar phi[];
    foreach_vertex(){
      phi[] = -(d[] + d[-1] + d[0,-1] + d[-1,-1])/4.;
    }
    fractions (phi, f);
  }
}
```

Physical properties are specified based on the dimensionless parameters:

```c
// Density ratio (liquid : gas = 1000:1)
rho1 = 1., rho2 = 1e-3;
  
// Gas phase Ohnesorge number
Oha = 2e-2 * Oh;
  
// Viscosity from Ohnesorge numbers
mu1 = Oh, mu2 = Oha;
  
// Polymer relaxation time (liquid has elasticity, gas does not)
lambda1 = De; lambda2 = 0.;
  
// Elastic modulus (liquid is viscoelastic, gas is not)
G1 = Ec; G2 = 0.;

// Surface tension coefficient
f.sigma = 1.0;
```

> [!important] Adaptive Mesh Refinement The simulation uses multiple criteria for mesh refinement to accurately resolve the interface dynamics:
> 
> ```c
> event adapt(i++){
>   // Calculate interface curvature for refinement criterion
>   scalar KAPPA[];
>   curvature(f, KAPPA);
>   
>   // Adapt mesh based on multiple criteria
>   adapt_wavelet ((scalar *){f, u.x, u.y, conform_p.x.x, conform_p.y.y, 
>      conform_p.y.x, conform_qq, KAPPA},
>      (double[]){fErr, VelErr, VelErr, AErr, AErr, AErr, AErr, KErr},
>      MAXlevel, MAXlevel-6);
> }
> ```
> 
> This adaptive approach concentrates computational resources where they're needed most: at the interface, in regions of high curvature, areas with significant velocity gradients, and regions with rapidly varying conformation tensor components.

### 2.3 Expected Results

For Newtonian fluids (De = 0), bubble bursting typically results in:

1. Rapid retraction of the film
2. Formation of capillary waves
3. Collapse of the cavity
4. Potential formation of a Worthington jet
5. Possible droplet pinch-off from the jet

For viscoelastic fluids (De > 0), we expect to observe:

1. Enhanced jet formation due to elastic stresses
2. Delayed or suppressed droplet pinch-off
3. Longer and thinner jets at high Deborah numbers
4. Beads-on-a-string morphology for moderate elasticity

> [!task] Exercise: Investigating Deborah Number Effects
> 
> Modify the bubble bursting simulation to explore different Deborah numbers:
> 
> 1. Run simulations with De = 0 (Newtonian), De = 1 (moderate elasticity), and De = 10 (high elasticity), keeping other parameters constant
> 2. Track and compare:
>     - Maximum jet height
>     - Time to first droplet pinch-off (if it occurs)
>     - Jet morphology (thickness, length, shape)
> 3. Explain the physical mechanisms behind the observed differences
> 
> This exercise will help you understand how elastic memory affects interfacial dynamics.

## Part 3: Viscoplastic Drop Impact

Our second simulation investigates the dynamics of a viscoplastic (yield-stress fluid) drop impacting a solid surface.

### 3.1 Physical Background

When a viscoplastic drop impacts a surface, its behavior differs significantly from Newtonian drops due to the yield stress, which creates unyielded (solid-like) regions within the fluid. Key features include:

1. Initial deformation driven by inertia
2. Formation of unyielded regions where stress falls below the yield stress
3. Limited spreading compared to Newtonian drops
4. Potential formation of a solid-like cap at the drop apex
5. Asymmetric retractions and frozen interfaces after impact

> [!tldr] Problem Statement Simulate the axisymmetric impact of a viscoplastic drop onto a solid surface. Key dimensionless parameters include:
> 
> - Weber number (We): $\text{We} = \frac{\rho U^2 D}{\sigma}$ Ratio of inertial to surface tension forces
> - Ohnesorge number (Oh): $\text{Oh} = \frac{\mu}{\sqrt{\rho \sigma D}}$ Ratio of viscous to inertial and surface tension forces
> - Plasto-capillary number (J): $\mathcal{J} = \frac{\tau_yR_0}{\sigma}$ Ratio of yield stress to capillary pressure

### 3.2 Mathematical Formulation

For the viscoplastic fluid, we employ the Herschel-Bulkley model with regularization:

$$ \boldsymbol{\tau} = 2\biggl[\frac{\mathcal{J}}{2|\boldsymbol{\mathcal{D}}|+\epsilon} + \mathcal{O}h (2|\boldsymbol{\mathcal{D}}|+\epsilon)^{n-1}\biggr]\boldsymbol{\mathcal{D}} $$

where:

- $\boldsymbol{\mathcal{D}}$ is the deformation rate tensor
- $|\boldsymbol{\mathcal{D}}|$ is its second invariant
- $\epsilon$ is a regularization parameter
- $n$ is the power law index (n = 1 for Bingham model)
- $\mathcal{J}$ is the dimensionless yield stress
- $\mathcal{O}h$ is the Ohnesorge number

The regularization ensures numerical stability by avoiding the mathematical singularity at zero deformation rate.

### 3.3 Implementation Details

The simulation leverages a modified two-phase flow solver for viscoplastic fluids:

```c
#include "axi.h"
#include "navier-stokes/centered.h"
#define FILTERED // Smear density and viscosity jumps
#include "two-phaseVP-HB.h"
#include "navier-stokes/conserving.h"
#include "tension.h"
#include "reduced.h"
```

Boundary conditions specify a solid wall at the left boundary:

```c
// Left boundary: solid wall (no-slip and no flux)
u.t[left] = dirichlet(0.0);  // Tangential velocity = 0 (no-slip)
f[left] = dirichlet(0.0);    // Volume fraction = 0 (solid wall)
```

The drop is initialized with a downward velocity and positioned slightly above the wall:

```c
event init (t = 0) {
  if (!restore (file = dumpFile)){
    refine((R2Drop(x, y) < 1.05) && (level < MAXlevel));
    fraction(f, 1. - R2Drop(x, y));
    foreach() {
      u.x[] = -1.0 * f[];  // Initial velocity in x-direction (toward wall)
      u.y[] = 0.0;         // No initial velocity in y-direction
    }
  }
}
```

> [!important] Adaptive Refinement Strategy The simulation employs a sophisticated adaptive refinement strategy that changes based on the simulation stage:
> 
> ```c
> event adapt(i++){
>   if (t < 1e-2){
>     // Early impact phase: focus on interface and velocity fields
>     adapt_wavelet ((scalar *){f, u.x, u.y},
>     (double[]){fErr, VelErr, VelErr},
>     MAXlevel);
>   } else {
>     // Later stages: add refinement based on curvature and deformation
>     scalar KAPPA[], D2c[];
>     curvature(f, KAPPA);
>     foreach() {
>       // Calculate deformation tensor components
>       double D11 = (u.y[0,1] - u.y[0,-1])/(2*Delta);
>       double D22 = (u.y[]/y);
>       double D33 = (u.x[1,0] - u.x[-1,0])/(2*Delta);
>       double D13 = 0.5*((u.y[1,0] - u.y[-1,0] + u.x[0,1] - u.x[0,-1])/(2*Delta));
>       double D2 = (sq(D11)+sq(D22)+sq(D33)+2.0*sq(D13));
>       D2c[] = f[]*(D2);  // Deformation rate in the drop phase
>     }
>     adapt_wavelet ((scalar *){f, u.x, u.y, KAPPA, D2c},
>     (double[]){fErr, VelErr, VelErr, KAPPAErr, D2Err},
>     MAXlevel);
>   }
> }
> ```
> 
> This strategy ensures fine resolution near the interface and in regions of high deformation, which is critical for accurately capturing the yield surfaces where the stress transitions across the yield threshold.

### 3.4 Expected Results

For viscoplastic drops, the impact dynamics depend strongly on the plasto-capillary number J:

1. Low J (J << 1): Behavior approaches Newtonian drops with nearly complete spreading
2. Moderate J (J ~ 0.1-1): Limited spreading with formation of unyielded regions
3. High J (J > 1): Minimal deformation, approaching solid-like behavior

A key feature to observe is the formation of unyielded regions where the stress falls below the yield stress. These regions behave as solid-like domains embedded within the flowing fluid.

> [!task] Exercise: Non-Newtonian Impact Dynamics
> 
> Compare viscoplastic drop impact with Newtonian drop impact:
> 
> 1. Run simulations with J = 0 (Newtonian), J = 0.1 (moderate yield stress), and J = 0.5 (high yield stress)
> 2. Compare:
>     - Maximum spread factor (ratio of maximum diameter to initial diameter)
>     - Final equilibrium shape
>     - Locations of unyielded regions (where applicable)
> 3. Plot the spread factor vs. time for each case on a single graph
> 4. Explain how yield stress affects the impact dynamics
> 
> This exercise will help you understand how yield stress modifies impact behavior compared to Newtonian fluids.

## Part 4: Soft Impact Dynamics with Viscoelastic Fluids

Our third simulation explores the dynamics of viscoelastic drop impact, focusing on the effects of elasticity on the impact behavior.

### 4.1 Physical Background

When a viscoelastic drop impacts a surface, elastic stresses can lead to behaviors not seen in Newtonian impacts:

1. Enhanced rebound due to elastic energy storage and recovery
2. Suppression of satellite droplet formation
3. Extended filament formation during rebound
4. Complex fingering patterns during spreading
5. Beads-on-a-string morphology in retracting filaments

> [!tldr] Problem Statement Simulate the impact of a viscoelastic drop on a solid surface, examining how elasticity affects the impact dynamics. Key dimensionless parameters include:
> 
> - Weber number (We): Ratio of inertial to surface tension forces
> - Ohnesorge number (Oh): Ratio of viscous to inertial and surface tension forces
> - Weissenberg number (Wi): Ratio of elastic to viscous forces
> - Elasticity number (El): Ratio of elastic to inertial effects
> - Bond number (Bo): Ratio of gravitational to surface tension forces

### 4.2 Implementation Details

The simulation uses a similar framework to the bubble bursting case, with axisymmetric formulation and log-conformation approach:

```c
#include "axi.h"                  // Axisymmetric coordinates
#include "navier-stokes/centered.h"  // Main Navier-Stokes solver

// Viscoelastic model implementation
#if !_SCALAR
#include "log-conform-viscoelastic.h"  // Tensor implementation
#else 
#include "log-conform-viscoelastic-scalar-2D.h"  // Scalar implementation
#endif

#define FILTERED                           // Smear density and viscosity jumps
#include "two-phaseVE.h"                   // Two-phase flow with viscoelasticity
#include "navier-stokes/conserving.h"      // Conservative momentum advection
#include "tension.h"                       // Surface tension implementation
```

The drop is initialized as a sphere approaching the axis of symmetry (which represents the impact surface in the axisymmetric formulation):

```c
event init (t = 0) {
  if (!restore (file = dumpFile)){
    // Refine mesh around interface
    refine((R2Drop(x, y) < 1.05) && (level < MAXlevel));
    
    // Initialize volume fraction
    fraction(f, 1. - R2Drop(x, y));
    
    // Set initial velocity field
    foreach() {
      u.x[] = -1.0 * f[];  // Droplet moves left with velocity -1.0
      u.y[] = 0.0;         // No vertical motion initially
    }
  }
}
```

Physical properties are specified based on the dimensionless parameters:

```c
// Density ratio (liquid : gas = 1000:1)
rho1 = 1., rho2 = 1e-3;
  
// Gas phase Ohnesorge number
Oha = 2e-2 * Oh;
  
// Viscosity from Ohnesorge numbers
mu1 = Oh/sqrt(We), mu2 = Oha/sqrt(We);
  
// Polymer relaxation time (liquid has elasticity, gas does not)
lambda1 = Wi; lambda2 = 0.;
  
// Elastic modulus (liquid is viscoelastic, gas is not)
G1 = El; G2 = 0.;

// Surface tension coefficient
f.sigma = 1.0/We;
```

> [!note] Scalar vs. Tensor Implementation The code provides two options for implementing viscoelasticity:
> 
> 1. Tensor Implementation: Full anisotropic stresses, physically accurate but computationally intensive
> 2. Scalar Implementation: Simplified model, faster but less accurate for complex flows
> 
> The tensor implementation tracks the full conformation tensor, while the scalar implementation uses a simplified approach that captures the main features while being computationally more efficient.

### 4.3 Expected Results

Viscoelastic drop impact exhibits several distinctive behaviors compared to Newtonian impact:

1. Weissenberg = 0 (Newtonian): Standard impact dynamics with spreading, potential rebound depending on Oh and We
2. Low Weissenberg: Enhanced rebound due to elastic recovery
3. Moderate Weissenberg: Formation of extended filaments during rebound
4. High Weissenberg: Dramatic enhancement of rebound with possible beads-on-a-string formation in filaments

> [!task] Exercise: Elasticity Effects on Impact
> 
> Investigate how elasticity affects drop impact behavior:
> 
> 1. Run simulations with Wi = 0 (Newtonian), Wi = 1 (moderate elasticity), and Wi = 10 (high elasticity)
> 2. For each case, track:
>     - Maximum spread factor
>     - Rebound height (if applicable)
>     - Time evolution of kinetic and elastic energy
> 3. Visualize the stress distribution during impact for different Wi values
> 4. Explain the physical mechanisms behind the observed differences
> 
> This exercise will help you understand how elasticity modifies impact dynamics through storage and recovery of elastic energy.

## Part 5: Taylor-Culick Viscoelastic Retraction

Our final simulation explores the capillary-driven retraction of a viscoelastic fluid filament, known as Taylor-Culick flow.

### 5.1 Physical Background

When a cylindrical fluid filament with a free surface is suddenly released, surface tension causes it to retract. For Newtonian fluids, the retraction velocity reaches a constant value known as the Taylor-Culick velocity:

$$v_{TC} = \sqrt{\frac{2\sigma}{\rho h}}$$

where $\sigma$ is the surface tension, $\rho$ is the density, and $h$ is the filament thickness.

For viscoelastic fluids, the retraction dynamics are more complex due to elastic effects:

1. Initial acceleration phase similar to Newtonian fluids
2. Development of a bulbous end that grows as it collects fluid
3. Formation of a neck behind the bulbous end
4. Potential development of beads-on-a-string morphology
5. Modified retraction velocity due to elastic stresses

> [!tldr] Problem Statement Simulate the retraction of a viscoelastic fluid filament under capillary action, examining how elasticity affects the retraction dynamics. Key dimensionless parameters include:
> 
> - Deborah number (De): Ratio of relaxation time to capillary time
> - Ohnesorge number (Oh): Ratio of viscous to inertial and capillary forces
> - Elasticity number (El): Ratio of elastic to inertial effects

### 5.2 Implementation Details

The simulation uses the axisymmetric framework with log-conformation approach for viscoelasticity:

```c
#include "axi.h"                  // Axisymmetric coordinates
#include "navier-stokes/centered.h"  // Main Navier-Stokes solver

// Viscoelastic model implementation
#if !_SCALAR
#include "log-conform-viscoelastic.h"  // Tensor implementation
#else 
#include "log-conform-viscoelastic-scalar-2D.h"  // Scalar implementation
#endif

#define FILTERED                           // Smear density and viscosity jumps
#include "two-phaseVE.h"                   // Two-phase flow with viscoelasticity
#include "navier-stokes/conserving.h"      // Conservative momentum advection
#include "tension.h"                       // Surface tension implementation
```

The initial configuration consists of a cylindrical filament with a hemispherical cap:

```c
event init(t = 0){
  if(!restore (file = dumpFile)){
    // Refine grid near the interface
    refine(x<(h0/2.0)+0.025 && y < hole0+(h0/2.0)+0.025 && level<MAXlevel);
    
    // Initialize the interface geometry (cylindrical filament with cap)
    fraction(f, y < hole0+(h0/2.0) ? 
        sq(h0/2.0)-(sq(x)+sq(y-(h0/2.0)-hole0)) : (h0/2.0)-x);
  }
}
```

> [!important] Length Scales In this simulation, there are two important length scales:
> 
> 1. `h0`: The filament thickness, set to 1.0 (the characteristic length)
> 2. `hole0`: The initial distance of the hemispherical cap from the origin, also set to 1.0
> 
> These dimensions determine the initial geometry of the filament, which affects the subsequent retraction dynamics.

### 5.3 Expected Results

The retraction dynamics of viscoelastic filaments show distinctive behaviors:

1. Newtonian (De = 0): Formation of a bulbous end with diameter approximately twice the filament thickness, constant retraction velocity
    
2. Low Deborah Number: Similar to Newtonian but with slightly modified bulbous end shape and retraction velocity
    
3. Moderate Deborah Number: Formation of a neck behind the bulbous end, potential development of beads-on-a-string morphology
    
4. High Deborah Number: Dramatic modification of retraction dynamics, with strong elastic resistance to extensional deformation in the neck region
    

> [!task] Exercise: Viscoelastic Filament Retraction
> 
> Investigate how viscoelasticity affects filament retraction:
> 
> 1. Run simulations with De = 0 (Newtonian), De = 1 (moderate elasticity), and De = 10 (high elasticity)
> 2. For each case, track:
>     - Retraction velocity over time
>     - Bulbous end diameter
>     - Neck formation and evolution (where applicable)
> 3. Compare the observed retraction velocity with the theoretical Taylor-Culick velocity
> 4. Explain how elasticity modifies the retraction dynamics through extensional rheology
> 
> This exercise will help you understand how elasticity affects capillary-driven flows, particularly through resistance to extensional deformation.

## Part 6: Numerical Considerations for Viscoelastic Simulations

Simulating viscoelastic flows presents unique numerical challenges that require special attention:

### 6.1 The High Weissenberg Number Problem

As mentioned earlier, traditional numerical methods often fail at high Weissenberg numbers due to the loss of positive-definiteness of the conformation tensor. This manifests as:

1. Unbounded growth of stress values
2. Numerical instabilities
3. Simulation divergence

The log-conformation approach addresses this by:

1. Working with the logarithm of the conformation tensor
2. Ensuring the reconstructed tensor remains positive-definite
3. Allowing stable simulations at much higher Weissenberg numbers

### 6.2 Adaptive Mesh Refinement Strategies

Effective adaptive mesh refinement is critical for viscoelastic simulations. Key refinement criteria include:

1. Interface location: Captured by volume fraction gradients
2. Velocity gradients: Important for capturing flow features
3. Interface curvature: Critical for surface tension effects
4. Conformation tensor gradients: Essential for capturing elastic stress variations

Balancing these criteria is important for efficiency and accuracy.

### 6.3 Multiphase Interface Treatment

For multiphase viscoelastic simulations, proper treatment of interfaces is crucial:

1. Filtered approach: Smooths property jumps across interfaces for numerical stability
2. Conservative formulation: Ensures momentum conservation during rapid interface deformation
3. Tension model: Accurately captures surface tension forces

### 6.4 Stability Tips

Based on experience with these simulations, here are some tips for ensuring stability:

1. Use a sufficiently small CFL number (typically 0.1 or less)
2. Start with a moderate Weissenberg/Deborah number and gradually increase
3. Ensure sufficient mesh resolution near interfaces and regions of high stress gradients
4. Monitor energy conservation and stress growth for early signs of instability
5. Use the tensor implementation for complex flows, switching to scalar only when necessary for performance

> [!tip] Debugging Strategy If your viscoelastic simulation becomes unstable:
> 
> 1. Check the kinetic energy for exponential growth
> 2. Examine the conformation tensor components for unbounded growth
> 3. Reduce the time step (lower CFL number)
> 4. Increase mesh resolution near problematic regions
> 5. Consider reducing the Weissenberg/Deborah number temporarily
> 6. Ensure boundary conditions are properly implemented

## Conclusion

In this assignment, we've explored the fascinating world of computational viscoelastic fluid dynamics through four complex multiphase flow simulations. These simulations demonstrate the rich and often counterintuitive behaviors that emerge when elastic and viscoplastic effects are introduced into fluid flows.

Key insights from our exploration include:

1. The critical importance of specialized numerical techniques (like the log-conformation approach) for stable viscoelastic simulations
2. The profound impact of elasticity on interfacial dynamics, from enhanced jet formation in bubble bursting to modified retraction behavior in filaments
3. The formation of unyielded regions in viscoplastic flows, creating complex solid-fluid transitions
4. The challenges and strategies for adaptive mesh refinement in flows with multiple time and length scales

These complex fluid simulations represent the culmination of our progression through computational fluid dynamics, building on earlier foundations in heat conduction, single-phase flows, and simple multiphase systems. The techniques and insights gained are applicable to a wide range of real-world phenomena, from polymer processing and food science to biological flows and advanced manufacturing.

> [!question] Further Exploration
> 
> Consider these questions for deeper investigation:
> 
> 1. How would viscoelasticity and viscoplasticity interact in a combined model (e.g., an elasto-viscoplastic fluid)?
> 2. What role does fluid microstructure play in determining macroscopic rheological behavior?
> 3. How could these models be extended to incorporate temperature-dependent properties?
> 4. What experimental techniques could validate the computational predictions made by these simulations?
> 5. How might machine learning approaches be used to develop more accurate constitutive models for complex fluids?

> [!significance]- Metadata Author:: [Vatsal Sanjay](https://vatsalsanjay.com/) Date published:: March 12, 2025<br> Date modified:: March 12, 2025 at 10:15 CET

> [!meta] Back to main website [Home](https://comphy-lab.org/), [Team](https://comphy-lab.org/team), [Research](https://comphy-lab.org/research), [Github](https://github.com/comphy-lab)