---
modified: 2025-01-28T20:26:03+01:00
created: 2025-01-11T13:58:29+00:00
tags:
  - bubbles
  - capillary-waves
alias: Features-of-capillary-waves-during-asymmetric-bubble-coalescence
status: done ✅
---
# Features of capillary waves during asymmetric bubble coalescence
> [!tldr] TL;DR
> During the coalescence of bubbles with different sizes, the **speed** of the ensuing capillary waves remains almost unchanged and scales with the inertio‐capillary velocity. However, the strength (or curvature) of these waves depends on the bubble size ratio. In the equal‐sized case, the wave curvature diminishes and then plateaus, whereas for highly asymmetric (large vs. tiny) bubbles, the curvature initially decreases but then rebounds sharply due to the changing geometry. Two **approximate** scaling laws emerge for the strongest wave curvature: ￼ in the low‐viscosity limit and ￼ in the moderate‐to‐higher viscosity regime. Experimental data diverge somewhat from these simple power laws, indicating a need for refined models to explain the distinct curvature behavior at low Ohnesorge numbers.

![Fig-1_schematic](_Media/20250112214056729_Features-of-capillary-waves-during-asymmetric-bubble-coalescence.png)
Figure 1. Schematic of asymmetric coalescence of bubbles. Following the coalescnece, train of capillary waves travel on the surface of both bubbles. 

### Control parameters

**Ohnesorge number** (ratio of the inertio-capillary and inertio-viscous timescales)

$$
Oh = \frac{\eta_l}{\sqrt{\rho_l\gamma R_0}}
$$

**Asymmetry parameter** (ratio of the radii of the two bubbles)

$$
\chi = \frac{R}{r}
$$


## A typical coalescence events 

### Coalescence of equal sized bubbles ($R = r$)

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;">
    <iframe 
        style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
        src="https://www.youtube.com/embed/Bm4qC0BSGkc"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
    </iframe>
</div>

[Open on YouTube](https://youtu.be/Bm4qC0BSGkc)


### Coalescence of tiny bubbles with extremely large ones ($R \gg r$)

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;">
    <iframe 
        style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
        src="https://www.youtube.com/embed/QbQ4wrTjTks"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
    </iframe>
</div>

[Open on YouTube](https://youtu.be/QbQ4wrTjTks)


## Looking at the speed of the capillary waves

> [!important]
> The velocity of this capillary waves still scales with the inertio-capillary velocity!

![Fig-2_waveTrajectory](_Media/20250112214130458_Features-of-capillary-waves-during-asymmetric-bubble-coalescence.png)
Figure 2. Trajectory of the capillary waves during coalescence of same sized bubbles ($R = r$). Different colors represent different Ohnesorge numbers $Oh$. 

![Fig-3_waveSpeed](_Media/20250112214151030_Features-of-capillary-waves-during-asymmetric-bubble-coalescence.png)
Figure 3. Trajectory of the capillary waves during coalescence of same unequal sized bubbles with $R \gg r$. Different colors represent different Ohnesorge numbers $Oh$.  

> [!note]
> Infact the velocity hardly changes from $R = r$ to $R \gg r$


## Strength of capillary waves for $R = r$

Although the speed of capillary waves remain the same. There can be differences in the strength of the waves. 

![Fig-4_capillary-waves-Same-sized](_Media/20250112214226072_Features-of-capillary-waves-during-asymmetric-bubble-coalescence.png)
Figure 4. The curvature of the strongest capillary wave decreases in time and then saturates to a constant value. 

This is different from what happens at $R \gg r$, 

![Fig-5_capillary-waves-champagne-bubbles](_Media/20250112214243110_Features-of-capillary-waves-during-asymmetric-bubble-coalescence.png)
Figure 5. The curvature of the strongest capillary wave decreases in time, reaches a minima, and then increases sharply as the bubble cavity configuration changes (see video above, and also see [1]).

## Can we understand this change in curvature?

Given the asymmetry at $R \gg r$, the waves have this feature to come back up and the curvature increases whereas for $R = r$ symmetry of the problem results in no significant geometry change following flow focussing and the curvature does not further increase. 

Looking at the balance between the kinetic energy (generated immediately following the coalescence event), 

$$
\frac{d}{d\tau}\int_{\Omega_\kappa}\frac{\rho V^2}{2}d\Omega_\kappa \sim 2\eta\int_{\Omega_\eta}\left(\boldsymbol{\mathcal{D}:\mathcal{D}}\right)d\Omega_\eta
$$

**Note:** Here, we balance the kinetic energy of the capillary waves (across volume $\Omega_\kappa$) with viscous dissipation across the bulk volume $\Omega_\eta$ where velocity gradients are non-zero. 

Consequently, the volume scale associated with the kinetic energy carried by the waves is $\Omega_\kappa \sim R\kappa^{-2}$ and the dissipation volume scales as $\Omega_\eta \sim R\delta_\eta^2$ where $\delta_\eta$ is the viscous boundary layer attached to the free-surface where velocity gradients are highest (see the videos above, the dark regions in visocus dissipation function characterize $\Omega_\eta$ and high velocity regions indicate $\Omega_\kappa$)

$$
\frac{1}{\tau}\rho V^2 R\kappa^{-2} \sim \eta\left(\frac{V}{\kappa^{-1}}\right)^2R\delta^2
$$

Rearranging the above equation, we can find the time scale associated with this transfer process:

$$
\tau \sim \frac{\rho}{\eta}\frac{\kappa^{-4}}{\delta^2}
$$

#### Rearranging the expression and substituting inertio-capillary timescale

$$
\kappa^4\delta^2 \sim \frac{\rho}{\eta}\sqrt{\frac{\gamma}{\rho R^3}}
$$

Normalize both sides by $R^2$, 

$$
\tilde{\kappa}^4\tilde{\delta}^2 \sim \frac{\sqrt{\rho\gamma R}}{\eta}
$$

#### In the low viscosity limit,

$\delta \sim \kappa^{-1}$, which giving


$$
\tilde{\kappa} \sim Oh^{-1/2}
$$



#### In moderate high viscosity limit,

$$
\delta \sim \sqrt{\frac{\eta}{\rho}t} = \sqrt{\frac{\eta}{\rho}\left(\frac{\rho\kappa^{-3}}{\gamma}\right)^{1/2}}
$$
**Rearranging the expression and filling in the general equation relating $\kappa$ and $\delta$ gives** 

$$
\tilde{\kappa}^{5/2} \sim \frac{\rho\gamma R}{\eta^2}
$$
or, 

$$
\tilde{\kappa} \sim Oh^{-4/5}
$$

![Fig-6_curvatureAndOh-R](_Media/20250112214304930_Features-of-capillary-waves-during-asymmetric-bubble-coalescence.png)
Figure 6. Minumum curvature of the strongest capillary wave as a function of the Ohnesorge number and the radii ratio of the two bubbles. The two scaling relations developed above are reasonable but the deviations observed in the data leave room for improvement.

> [!cite] Note:
> The scaling laws developed here are also described in detail in [2]

So, why does the radii ratio influence the curvature strongly but not the wave speed? **Unfortunately,** this is still an open question. The hand-wavy argument is given in this document (including the geometric and asymmetry arguments) but the scaling laws developed here only work approximately and clearly the data for $Oh \to 0$ shows deviation in curvature. #foodForThought 


### More resources
| [GitHub](https://github.com/VatsalSy/Asymmetries-in-coalescence) | [License](https://github.com/VatsalSy/Asymmetries-in-coalescence/blob/main/LICENSE) | [Latest Changes](https://github.com/VatsalSy/Asymmetries-in-coalescence/commits/main) | [[Features-of-capillary-waves-during-asymmetric-bubble-coalescence.pdf\|pdf]] |
| :--------------------------------------------------------------: | :---------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: | ----------------------------------------------------------------------------- |

[1] V. Sanjay, D. Lohse, and M. Jalaal, “Bursting bubble in a viscoplastic medium,” _J. Fluid Mech._, vol. 922, p. A2, 2021.

[2] J. M. Gordillo and J. Rodríguez-Rodríguez, “Capillary waves control the ejection of bubble bursting jets,” _J. Fluid Mech._, vol. 867, pp. 556–571, May 2019, doi: [10.1017/jfm.2019.161](https://doi.org/10.1017/jfm.2019.161).

> [!significance]- Metadata
> Author:: [Vatsal Sanjay](https://vatsalsanjay.com)
> Date published:: Jan 12, 2025<br>
> Date modified:: Jan 26, 2025 at 11:50 CET

> [!meta] Back to main website
> [Home](https://comphy-lab.org/), [Team](https://comphy-lab.org/team), [Research](https://comphy-lab.org/research), [Github](https://github.com/comphy-lab)