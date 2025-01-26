---
modified: 2025-01-26T11:54:13+01:00
created: 2025-01-26T11:17:08+01:00
aliases:
  - Relationship between rate of change of a physical quantity and its divergence
---
# Relationship between rate of change of a physical quantity and its divergence

For a conserved quantity (like mass, momentum, or energy), the local rate of change within a volume is directly linked to the divergence of its flux. In particular, conservation laws often take the form:

$$\frac{\partial \phi}{\partial t} + \nabla \cdot \mathbf{J} = 0$$

where $\phi$ is the density of the conserved quantity and $\mathbf{J}$ is its flux. Integrating over a volume and applying the divergence theorem:

$$\int_V \frac{\partial \phi}{\partial t} \, dV + \oint_{\partial V} \mathbf{J}\cdot d\mathbf{A} = 0$$

shows that the rate of change of $\phi$ in that volume (the first term) is exactly balanced by the net flux across the boundary (the second term). Thus, $\nabla \cdot \mathbf{J}$ encapsulates the `source` or `sink` behavior within the volume and is intimately connected to how $\phi$ changes over time.