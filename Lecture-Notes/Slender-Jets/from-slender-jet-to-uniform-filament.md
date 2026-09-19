---
status: done ✅
publish: true
aliases:
  - From the slender-jet hierarchy to a uniform-filament force balance
  - Lecture-Notes/Slender-Jets/from-slender-jet-to-uniform-filament
---
# From the slender-jet hierarchy to a uniform-filament force balance

<!-- BLOG-PDF-LINK-START -->
<!-- PDF-EXPORT-IGNORE-START -->
> [!pdf] PDF version
> [[_Media/PDF/Lecture-Notes/Slender-Jets/from-slender-jet-to-uniform-filament.pdf|Download this page as PDF]]
<!-- PDF-EXPORT-IGNORE-END -->
<!-- BLOG-PDF-LINK-END -->

Consider a cylindrical liquid filament that stretches while its radius decreases. Its axial force depends on the pressure averaged over a cross-section. The surface condition fixes the pressure at the interface, so we first need to find how the radial acceleration changes the pressure between the axis and the surface.

We start from [[slender-jets-VE-order-0|the leading-order slender-jet equations]] and [[slender-jets-VE-order-2|their second-order expansion]]. As in those notes, $r$ and $h$ are dimensional, $\eta$ is the solvent viscosity, and pressure is measured relative to a uniform surrounding gas pressure. We neglect gravity and gas stresses. Primes denote $\partial_z$ and dots denote time derivatives.

## 1. Specify the local extension

Let the radius be $h(t)$ and choose the origin at the stagnation plane of a homogeneous extensional flow. The velocity is

$$
v_z=-2\frac{\dot h}{h}z,
\qquad
v_r=\frac{\dot h}{h}r,
$$

with axial strain rate

$$
\dot\epsilon\equiv\partial_zv_z=-2\frac{\dot h}{h}.
$$

The radial velocity follows from continuity and is regular at the axis. At the surface, $v_r(h)=\dot h$, so the kinematic condition is satisfied exactly:

$$
\partial_t(h^2)+\partial_z(h^2v_z)
=2h\dot h-2h\dot h=0.
$$

We also assume spatially uniform, diagonal polymer stress. Thus, $S=S_3=0$ and $\Sigma_{zz,2}=\Sigma_{rr,2}=\Theta_2=0$ in the notation of the previous note. The homogeneous velocity profile has $v_2=v_4=0$ and satisfies both tangential-traction conditions. These statements establish the kinematics and shear-free surface; we check axial momentum separately below.

## 2. Calculate the radial acceleration

For this velocity field, $\partial_zv_r=0$. The radial acceleration is

$$
\begin{aligned}
a_r&=\partial_tv_r+v_r\partial_rv_r\\
&=\left(\frac{\ddot h}{h}-\frac{\dot h^2}{h^2}\right)r
+\frac{\dot h^2}{h^2}r
=\frac{\ddot h}{h}r.
\end{aligned}
$$

The two $\dot h^2$ contributions cancel. The vector Laplacian of this radial velocity vanishes, as does the radial divergence of the uniform polymer stress. Radial momentum therefore gives

$$
\partial_rp=-\rho\frac{\ddot h}{h}r,
$$

and integration from the axis gives

$$
\boxed{p(r,t)=p_0(t)-\frac{\rho}{2}\frac{\ddot h}{h}r^2.}
$$

The same result follows from (R) in the second-order hierarchy:

$$
\frac{\rho}{4}\partial_tv_0'
=-\frac{\rho}{2}\left(\frac{\ddot h}{h}-\frac{\dot h^2}{h^2}\right),
\qquad
-\frac{\rho}{8}(v_0')^2=-\frac{\rho}{2}\frac{\dot h^2}{h^2},
$$

so

$$
p_2=-\frac{\rho}{2}\frac{\ddot h}{h},
\qquad
\mathcal B=-h^2p_2=\frac{\rho}{2}h\ddot h.
$$

Keeping only the convective radial acceleration would instead give $p_2=-\rho\dot h^2/(2h^2)$. That expression omits the local acceleration and does not follow from the time-dependent ansatz above. A velocity-squared correction would require its own approximation and definition of the pressure being used.

## 3. Distinguish the three pressures

Write $p_0$ for the centreline pressure, $p_h$ for the surface pressure and $\bar p$ for the cross-sectional mean. The parabola gives

$$
p_h=p_0-\frac{\rho}{2}h\ddot h,
$$

$$
\bar p=\frac{1}{\pi h^2}\int_0^h p\,2\pi r\,\mathrm dr
=p_0-\frac{\rho}{4}h\ddot h.
$$

Eliminating $p_0$, we obtain

$$
\boxed{\bar p=p_h+\frac{\rho}{4}h\ddot h.}
$$

The traction condition determines $p_h$. The axial force requires $\bar p$. Replacing one by the other would lose the radial-inertia contribution.

## 4. Integrate the axial force

For a cylinder, $\boldsymbol n=\boldsymbol e_r$ and $\kappa=1/h$. Normal traction gives

$$
-p_h+2\eta\frac{\dot h}{h}+\Sigma_{rr}=-\frac{\gamma}{h},
$$

so

$$
p_h=\frac{\gamma}{h}+2\eta\frac{\dot h}{h}+\Sigma_{rr}.
$$

Define $F_z$ as the total tensile force transmitted through a section, including the surface-tension line force at its circumference. With tension taken positive,

$$
\begin{aligned}
F_z
&=\int_{\mathcal S}\left(-p+2\eta\partial_zv_z+\sigma_{p,zz}\right)\mathrm dS
+2\pi\gamma h\\
&=\pi h^2\left(-\bar p-4\eta\frac{\dot h}{h}+\Sigma_{zz}\right)+2\pi\gamma h.
\end{aligned}
$$

Substituting the mean pressure gives

$$
\boxed{
\frac{F_z}{\pi h^2}
=\frac{\gamma}{h}-6\eta\frac{\dot h}{h}
+\Delta\Sigma-\frac{\rho}{4}h\ddot h,
\qquad
\Delta\Sigma=\Sigma_{zz}-\Sigma_{rr}.
}
$$

The capillary contribution is $2\gamma/h$ from the circumference minus $\gamma/h$ from the surface pressure. The solvent contribution is $3\eta\dot\epsilon$, and the polymer contributes its normal-stress difference. The final term comes from averaging the radial pressure profile. Its sign depends on $\ddot h$; it is an inertial contribution, not a viscous resistance.

## 5. Check axial momentum before using the force balance

The force expression follows from radial momentum, normal traction and the imposed kinematics. A solution of the full problem must also satisfy axial momentum. For the same ansatz,

$$
\partial_tv_z+v_z\partial_zv_z
=\left(-2\frac{\ddot h}{h}+6\frac{\dot h^2}{h^2}\right)z.
$$

If $h$ and the polymer stresses are spatially uniform, normal traction makes the pressure independent of $z$. The right-hand side of the axial momentum equation then vanishes. At finite density, the ansatz can satisfy that equation everywhere only if

$$
h\ddot h=3\dot h^2.
$$

An exponentially thinning radius does not satisfy this condition. Also, although $\mathcal B\ne0$, both $\partial_z\mathcal B$ and $\mathcal T_2$ vanish here. The surviving radial pressure correction therefore cannot supply the missing axial force gradient.

For a nonuniform filament, axial inertia is supplied by the variation of transmitted force along its length. A local model replaces that spatial problem by a prescribed or matched $F_z(t)$ and must justify the treatment of axial inertia. In a regime where inertia is negligible, the tensile force is approximately uniform in $z$, and matching to the end regions can determine its value. Prescribing the force alone does not turn the homogeneous ansatz into an exact inertial solution.

Under the slender ordering, the radial-inertia correction is a relative $O(\varepsilon^2)$ contribution. If it becomes dynamically important, its use in a radius-only model requires an axial-inertia estimate as well. The force identity supplies the local stress relation; the surrounding flow supplies the additional dynamics.

## 6. Evolve the polymer stretch

For an Oldroyd-B liquid,

$$
\boldsymbol\sigma_p=G(\boldsymbol A-\boldsymbol I),
$$

where $G$ is the elastic modulus, $\boldsymbol A$ is the conformation tensor and $\lambda$ is the relaxation time. Homogeneous extension gives

$$
\frac{\mathrm dA_{zz}}{\mathrm dt}
=2\dot\epsilon A_{zz}-\frac{A_{zz}-1}{\lambda}
=-4\frac{\dot h}{h}A_{zz}-\frac{A_{zz}-1}{\lambda}.
$$

To see what is lost in a strong-stretch approximation, start from $A_{zz}(0)=1$ and $h(0)=h_0$. Define

$$
q(t)=\left(\frac{h_0}{h(t)}\right)^4e^{-t/\lambda}.
$$

The exact integrating-factor solution is

$$
A_{zz}(t)=q(t)\left[1+\frac{1}{\lambda}\int_0^t\frac{\mathrm ds}{q(s)}\right].
$$

Thus, $A_{zz}\simeq(h_0/h)^4e^{-t/\lambda}$ additionally assumes that the source integral is negligible. Strong stretch at a later time does not by itself establish that assumption for the earlier history.

Within an interval where $A_{zz}\gg1$, we can neglect $1/\lambda$ relative to $A_{zz}/\lambda$ in the differential equation. Starting that interval at $t_*$, with radius $h_*$ and conformation $A_*=A_{zz}(t_*)$, gives

$$
A_{zz}\simeq A_*\left(\frac{h_*}{h}\right)^4e^{-(t-t_*)/\lambda}.
$$

If $A_{zz}\gg A_{rr}$ as well, then $\Delta\Sigma=G(A_{zz}-A_{rr})\simeq GA_{zz}$. The local force relation becomes

$$
\frac{F_z}{\pi h^2}
\simeq\frac{\gamma}{h}-6\eta\frac{\dot h}{h}
-\frac{\rho}{4}h\ddot h
+GA_*\left(\frac{h_*}{h}\right)^4e^{-(t-t_*)/\lambda}.
$$

## 7. Compare the two thinning laws

First consider an elastocapillary interval in which polymer stress is proportional to capillary pressure, while solvent and inertial stresses are smaller:

$$
\Delta\Sigma\simeq c\frac{\gamma}{h},\qquad c>0.
$$

Here, $c$ is constant in the asymptotic regime and is set by matching to the rest of the filament. Using the strong-stretch expression gives

$$
GA_*h_*^4h^{-4}e^{-(t-t_*)/\lambda}\simeq c\gamma h^{-1},
$$

and hence

$$
h^3\propto e^{-(t-t_*)/\lambda},
\qquad
\boxed{h\propto e^{-(t-t_*)/(3\lambda)}.}
$$

This is the classical elastocapillary thinning rate described by [Entov and Hinch (1997)](https://doi.org/10.1016/S0377-0257(97)00022-0). The tension is of order $\gamma h$: the force relation gives $F_z\simeq\pi(1+c)\gamma h$. The role of matching the thread to its end regions is developed by [Clasen et al. (2006)](https://doi.org/10.1017/S0022112006009633). With the present definition of total tensile force, taking $F_z/(\pi h^2)\ll\gamma/h$ would instead require cancellation between positive capillary and tensile polymer stresses, so it cannot describe this balance.

Now impose a positive force $F_z=F_*$ that is constant in time, and suppose the polymer supplies the dominant tensile stress. Then

$$
F_*\simeq\pi h^2GA_*\left(\frac{h_*}{h}\right)^4e^{-(t-t_*)/\lambda},
$$

which gives

$$
h^2\propto e^{-(t-t_*)/\lambda},
\qquad
\boxed{h\propto e^{-(t-t_*)/(2\lambda)}.}
$$

The distinction is the force condition: $F_z\propto h$ in the elastocapillary balance, whereas $F_z$ is constant in the second calculation. A force that is merely uniform along the filament need not be constant in time. The effect of different tension conditions on CaBER and ROJER thinning is discussed by [Mathues et al. (2018)](https://doi.org/10.1122/1.5021834).

Finally, take $h\propto e^{-t/(m\lambda)}$, with $m=3$ or $2$. The magnitude of the radial-inertia term is

$$
\frac{\rho}{4}h\ddot h=\frac{\rho h^2}{4m^2\lambda^2},
$$

and its ratio to capillary pressure is

$$
\frac{\rho h^3}{4m^2\gamma\lambda^2}\longrightarrow0
\qquad\text{as}\qquad h\longrightarrow0.
$$

Radial inertia therefore becomes small in these exponential thinning limits. During a transient, its size must be assessed from the actual $h\ddot h$, together with the axial-inertia constraint above. The application to transient elastocapillary Worthington jets is discussed in Sen, Sanjay et al. (in preparation).

## Related calculations

- [[slender-jets-VE-order-0|Viscoelastic slender jets at leading order]]
- [[slender-jets-VE-order-2|The second-order slender-jet hierarchy]]
- [[continuity-slender-jet|Continuity in a slender jet]]
- [[dynamic-BC-slender-jet|Free-surface stress balance]]
