---
modified: 2025-10-07T10:03:14+01:00
created: 2024-12-31T12:12:38+01:00
tags:
  - non-Newtonian
  - Herschel-Bulkley-model
aliases:
  - Herschel–Bulkley-formulation
  - Herschel–Bulkley formulation
  - "Code-Documentations/Herschel–Bulkley formulation"
  - Herschel–Bulkley
status: done ✅
---
# Herschel–Bulkley formulation for non-Newtonian flows
> [!tldr] TL;DR
> The **Herschel–Bulkley** model unifies Newtonian, Bingham, and power-law fluids via a yield stress and a strain-rate-dependent viscosity. An ￼$\epsilon$-regularization ensures stable computations and recovers simpler models (Newtonian, Bingham) by tuning model parameters. Dimensionless groups (e.g., the plasto-capillary number ￼ and the effective Ohnesorge) capture the interplay of fluid rheology, capillarity, and flow scales. Implementation details are provided, along with references, open-source code, and demonstrations of bubble-burst simulations in viscoplastic media.
## Features:
* Yield stress $\tau_y$
* Power law dependance on the strain rate
	* Shear thinning for $n < 1$. 
	* Shear thickening for $n > 1$. 
* Bingham model for $n = 1$. 
* Newtonian fluid for $n = 1$ and $\tau_y = 0$. 

## $\varepsilon$-formulation
$$
\boldsymbol{\tau} = 
\tau_{y}\,\boldsymbol{\mathcal{I}} \;+\; K\left(2\boldsymbol{\mathcal{D}}\right)^{n}
=
2\biggl[\frac{\tau_{y}}{2\|\boldsymbol{\mathcal{D}}\|+\varepsilon}\,\boldsymbol{\mathcal{I}}
+
K\,\bigl(2\|\boldsymbol{\mathcal{D}}\|+\epsilon\bigr)^{n-1}
\biggr]\boldsymbol{\mathcal{D}}.
$$
Normalizing stresses with $\gamma/R_0$, length with $R_0$, and velocity with $\sqrt{\gamma/\rho_lR_0}$...


$$
\boldsymbol{\tilde{\tau}} =
2\biggl[\frac{\mathcal{J}}{2\|\boldsymbol{\tilde{\mathcal{D}}}\|+\varepsilon}\,\boldsymbol{\mathcal{I}}
+
Oh_K\,\bigl(2\|\boldsymbol{\tilde{\mathcal{D}}}\|+\epsilon\bigr)^{n-1}
\biggr]\boldsymbol{\tilde{\mathcal{D}}}.
$$

Here, the effective Ohnesorge is

$$
Oh_K = \frac{K}{\sqrt{\rho_l^n\gamma^{2-n}R_0^{3n-2}}}
$$

The plasto-capillary number $\mathcal{J}$ is
$$\mathcal{J} = \frac{\tau_yR_0}{\gamma}$$

One can easily see that putting $n = 1$ recovers the Bingham model with $Oh = \eta_l/\sqrt{\rho_l\gamma R_0}$. Additionally, with $n = 1$ & $\mathcal{J}$ = 0, the model will give a `Newtonian` response. 

## More details on the implementation

### Calculate the norm of the deformation tensor $\boldsymbol{\mathcal{D}}$:
$$\mathcal{D}_{11} = \frac{\partial u_r}{\partial r}$$
$$\mathcal{D}_{22} = \frac{u_r}{r}$$
$$\mathcal{D}_{13} = \frac{1}{2}\left( \frac{\partial u_r}{\partial z}+ \frac{\partial u_z}{\partial r}\right)$$$$\mathcal{D}_{31} = \frac{1}{2}\left( \frac{\partial u_z}{\partial r}+ \frac{\partial u_r}{\partial z}\right)$$
$$\mathcal{D}_{33} = \frac{\partial u_z}{\partial z}$$
$$\mathcal{D}_{12} = \mathcal{D}_{23} = 0.$$
The second invariant is $\mathcal{D}_2=\sqrt{\mathcal{D}_{ij}\mathcal{D}_{ij}}$ (this is the Frobenius norm)

$$\mathcal{D}_2^2= \mathcal{D}_{ij}\mathcal{D}_{ij}= \mathcal{D}_{11}\mathcal{D}_{11} + \mathcal{D}_{22}\mathcal{D}_{22} + \mathcal{D}_{13}\mathcal{D}_{31} + \mathcal{D}_{31}\mathcal{D}_{13} + \mathcal{D}_{33}\mathcal{D}_{33}$$

**Note:** $\|\mathcal{D}\| = D_2/\sqrt{2}$.<br/>

We use the formulation as given in [Balmforth et al. (2013)](https://www.annualreviews.org/doi/pdf/10.1146/annurev-fluid-010313-141424) [1], who use the strain rate tensor $\boldsymbol{\dot{\mathcal{S}}}$ which and its norm $\sqrt{\frac{1}{2}\dot{\mathcal{S}_{ij}}\dot{\mathcal{S}_{ij}}}$. Of course, given $\dot{\mathcal{S}}_{ij}=2 D_{ij}$.

### Calculate the equivalent viscosity

Factorizing with $2 \mathcal{D}_{ij}$ to obtain an equivalent viscosity
$$\eta_{\text{eff}} = \frac{\mathcal{J}}{2\|\boldsymbol{\tilde{\mathcal{D}}}\|+\varepsilon}\,\boldsymbol{\mathcal{I}}
+
Oh_K\,\bigl(2\|\boldsymbol{\tilde{\mathcal{D}}}\|+\epsilon\bigr)^{n-1}
$$

In this formulation, $\varepsilon$ is a small number to ensure numerical stability. 
The term $$\frac{\tau_y}{\varepsilon} + ...$$is equivalent to the $\mu_{max}$ of the previous (v1.0, see: [GitHub](https://github.com/VatsalSy/Bursting-Bubble-In-a-Viscoplastic-Medium)) formulation [2].

  
**Note:** The fluid flows always, it is not a solid, but a very viscous fluid.
 

Reproduced from: [P.-Y. Lagrée's Sandbox](http://basilisk.fr/sandbox/M1EMN/Exemples/bingham_simple.c). Here, we use a face implementation of the regularisation method, described [here](http://basilisk.fr/sandbox/vatsal/GenaralizedNewtonian/Couette_NonNewtonian.c).

---

## Further exploration:

### Video showcasing a typical simulation of bubble bursting in a Herschel–Bulkley fluid medium 

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;">
    <iframe 
        style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
        src="https://www.youtube.com/embed/NmvCVsiEZIA"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
    </iframe>
</div>

[Open on YouTube](https://youtu.be/NmvCVsiEZIA)

### More resources
| [GitHub](https://github.com/comphy-lab/BurstingBubble_Herschel-Bulkley) | [Demo](https://youtu.be/NmvCVsiEZIA) | [License](https://github.com/comphy-lab/BurstingBubble_Herschel-Bulkley/blob/main/LICENSE) | [Latest Changes](https://github.com/comphy-lab/BurstingBubble_Herschel-Bulkley/commits/main) | [[2025-Herschel–Bulkley-formulation.pdf\|pdf]] |
| :---------------------------------------------------------------------: | :----------------------------------: | :----------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: | ----------------------------------------- |

## References

[1] N. J. Balmforth, I. A. Frigaard, and G. Ovarlez, “Yielding to Stress: Recent Developments in Viscoplastic Fluid Mechanics,” _Annu. Rev. Fluid Mech._, vol. 46, pp. 121–146, Jan. 2014, doi: [10.1146/annurev-fluid-010313-141424](https://doi.org/10.1146/annurev-fluid-010313-141424).

[2] V. Sanjay, D. Lohse, and M. Jalaal, “Bursting bubble in a viscoplastic medium,” _J. Fluid Mech._, vol. 922, p. A2, 2021.

> [!significance]- Metadata
> Author:: [Vatsal Sanjay](https://vatsalsanjay.com)
> Date published:: Dec 31, 2024<br>
> Date modified:: Jan 26, 2025 at 11:50 CET

> [!meta] Back to main website
> [Home](https://comphy-lab.org/), [Team](https://comphy-lab.org/team), [Research](https://comphy-lab.org/research), [Github](https://github.com/comphy-lab)