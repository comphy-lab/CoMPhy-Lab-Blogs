---
modified: 2025-02-11T00:42:51+01:00
created: 2025-02-11T00:42:20+01:00
---
# Bursting Bubbles: From Champagne to Complex Fluids
## Introduction
Bubble bursting at the liquid–air interface is a ubiquitous phenomenon. Whether in a glass of champagne, a carbonated beverage, or a natural setting (e.g., mudpots, ocean spray), bubbles rise due to buoyancy and eventually rupture at the free surface. Upon bursting, the cavity created in the free surface collapses, generating jets and ejected droplets. These droplets play important roles in:
- **Aromatic transport** in champagne and sparkling beverages.
- **Pathogen and aerosol spread** in contaminated water or biological fluids (coughing, sneezing).
- **Cloud formation** through sea spray in the atmosphere.
- **Geophysical processes**, such as mudpots or volcanic lakes involving complex rheology.

## The Phenomenon
When the bubble film ruptures, a “hole” forms in the thin liquid interface. Surface tension drives capillary waves that converge at the bottom of the cavity, shooting liquid upward in a narrow jet. This jet eventually breaks into droplets, as observed in:
- **Champagne**: Enhancing aroma and flavor perception.
- **Contaminated water**: Ejecting micro-droplets that can carry pathogens.
- **Viscoplastic mud**: Where the yield stress of the medium significantly alters jet formation and droplet size.
- **Viscoelastic fluids**: Such as mucosalivary fluids during sneezing or coughing.

Extensive studies have addressed bubble bursting in Newtonian fluids (e.g., water). However, **non-Newtonian media**—including **viscoplastic** (mud, clay suspensions) and **viscoelastic** (polymeric solutions, mucosal fluids)—pose open research questions due to their complex rheological behavior.

## Proposed Approach
This combined proposal integrates numerical simulations with potential experimental validation to capture the entire process:

1. **Fundamental Two-Phase Flow**  
   - Implement and validate two-phase flow simulations (e.g., in [Basilisk C](http://basilisk.fr)) for bubble dynamics, jet formation, and droplet ejection in Newtonian fluids.

2. **Non-Newtonian Rheology**  
   - Extend the code to handle **generalized Newtonian** and **viscoelastic** models.  
   - Explore how capillary waves and cavity collapse are altered by viscoplastic or viscoelastic effects.

3. **Comparison & Validation**  
   - Compare numerical results against known scaling laws [e.g., Duchemin et al. (2002), Walls et al. (2015), Deike et al. (2018)] and experimental data from ongoing parallel experiments.

4. **Applications & Implications**  
   - Relate findings to **aroma transport** in champagne, **aerosol generation** in pathogen-laden fluids, and **cloud formation** via marine aerosol.  
   - Draw analogies to droplet formation in **coughing/sneezing**, focusing on the role of viscoelasticity in droplet sizes and distribution.

## Skills & What You Will Learn
- **Fluid Dynamics Fundamentals**  
  Develop an in-depth understanding of multiphase flows, capillary-driven phenomena, and wave–interface interactions.
- **Rheology**  
  Learn how non-Newtonian properties (viscoplasticity, viscoelasticity) influence flow and droplet formation.
- **Computational Techniques**  
  Gain experience using open-source codes (e.g., Basilisk C) for high-resolution simulations, parameter sweeps, and data analysis.
- **Collaboration**  
  Work alongside experimentalists, compare numerical and laboratory results, and interact with theorists modeling related flows.

## Supervision
| **Supervisor**              | **Email**                                   | **Office**                |
|-----------------------------|---------------------------------------------|---------------------------|
| **Ayush Dixit**             | [a.k.dixit@utwente.nl](mailto:a.k.dixit@utwente.nl) | Meander 250              |
| **Coen Verschuur**          | [c.i.verschuur@utwente.nl](mailto:c.i.verschuur@utwente.nl) | Meander 114B             |
| **Dr. Vatsal Sanjay**       | [vatsalsanjay@gmail.com](mailto:vatsalsanjay@gmail.com)       | Meander 246B             |
| **Dr. Alexandros Oratis**   | [a.t.oratis@utwente.nl](mailto:a.t.oratis@utwente.nl)          | TU Delft                 |
| **Assis. Prof. Dr. Maziyar (Mazi) Jalaal** | [m.jalaal@uva.nl](mailto:m.jalaal@uva.nl) | University of Amsterdam  |
| **Prof. Dr. Detlef Lohse**  | [d.lohse@utwente.nl](mailto:d.lohse@utwente.nl)                | Meander 261              |

Feel free to reach out to any of the listed supervisors for more details.

## Key References
- Deike, L., et al. (2018). *Dynamics of jets produced by bursting bubbles.*  
- Duchemin, L., et al. (2002). *Jet formation in bubble bursting.*  
- Ghabache, E., et al. (2016). *Evaporation of droplets from bursting bubbles.*  
- Gordillo, J. M. (2019). *Capillary waves and jet formation in bubble collapse.*  
- Lhuissier, H., & Villermaux, E. (2012). *Bursting bubble film droplets.*  
- Walls, P. L. L., et al. (2015). *Jet drops from bursting bubbles: How gravity and viscosity couple to inhibit droplet production.*  
- Walls, A. C., et al. (2017). *Viscoelastic effects in droplet formation.*  
- Bourouiba, L. (2021). *Fluid dynamics of disease transmission.*  
- Sanjay, V., Lohse, D., & Jalaal, M. (2021). *Non-Newtonian bubble collapse in mudpots.*  