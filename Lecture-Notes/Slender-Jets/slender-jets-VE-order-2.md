---
status: done ✅
publish: true
aliases:
  - Viscoelastic slender jets at second order
  - Lecture-Notes/Slender-Jets/slender-jets-VE-order-2
---
# Viscoelastic slender jets at $O(\varepsilon^2)$

<!-- BLOG-PDF-LINK-START -->
<!-- PDF-EXPORT-IGNORE-START -->
> [!pdf] PDF version
> [[_Media/PDF/Lecture-Notes/Slender-Jets/slender-jets-VE-order-2.pdf|Download this page as PDF]]
<!-- PDF-EXPORT-IGNORE-END -->
<!-- BLOG-PDF-LINK-END -->

A thinning jet has a radial acceleration. Its pressure therefore varies across a section, even when the leading axial velocity is uniform in $r$. We now retain this pressure variation, together with the velocity and polymer-stress corrections required by the surface conditions.

The starting point is [[slender-jets-VE-order-0|the leading-order derivation]]. We keep the same assumptions: an incompressible, axisymmetric liquid with no swirl, constant density $\rho$, solvent viscosity $\eta>0$ and surface tension $\gamma$, negligible gas stress and no body force. Pressure is measured relative to the gas. Primes denote $\partial_z$ and dots denote $\partial_t$.

## 1. Keep the radial ordering explicit

Let $\varepsilon=\ell_r/L\ll1$, where $\ell_r$ and $L$ are the radial and axial length scales. We use dimensional $r$ and $h$ throughout, with

$$
\frac{r}{L}=O(\varepsilon),\qquad h'=O(\varepsilon),\qquad Lh''=O(\varepsilon).
$$

The Taylor coefficients vary on the axial scale. Thus, $r^2v_2$ and $r^4v_4$ are successive relative $O(\varepsilon^2)$ corrections to the axial velocity. There are no additional $\varepsilon$ factors multiplying the dimensional powers of $r$.

Smoothness at the axis gives

$$
v_z=v_0+r^2v_2+r^4v_4+\cdots,
\qquad
p=p_0+r^2p_2+r^4p_4+\cdots,
$$

and [[continuity-slender-jet|continuity]] gives

$$
v_r=-\frac{r}{2}v_0'-\frac{r^3}{4}v_2'-\frac{r^5}{6}v_4'+\cdots.
$$

The polymer stresses have the corresponding expansion

$$
\begin{aligned}
\sigma_{p,zz}&=\Sigma_{zz}+r^2\Sigma_{zz,2}+\cdots,\\
\sigma_{p,rr}&=\Sigma_{rr}+r^2\Sigma_{rr,2}+\cdots,\\
\sigma_{p,\theta\theta}&=\Sigma_{rr}+r^2\Theta_2+\cdots,\\
\sigma_{p,rz}&=rS+r^3S_3+\cdots.
\end{aligned}
$$

The equality of the leading radial and hoop stresses follows from [[polymeric-stress-regularity-slender-jet|axis regularity]]. Their $r^2$ coefficients need not be equal. We continue to write $\Delta\Sigma=\Sigma_{zz}-\Sigma_{rr}$.

The even and odd powers follow from [[r-2-parity|the parity of the fields]]. Under this regular slender expansion, the first relative correction to the leading equations is $O(\varepsilon^2)$. All surface and reduced equations below are truncated at that accuracy unless identified as exact.

## 2. Collect the bulk equations

The $r^0$ and $r^2$ coefficients of axial momentum are

$$
\rho\left(\partial_tv_0+v_0v_0'\right)
=-p_0'+\eta\left(4v_2+v_0''\right)+\Sigma_{zz}'+2S,
\tag{M0}
$$

$$
\rho\left(\partial_tv_2+v_0v_2'\right)
=-p_2'+\eta\left(16v_4+v_2''\right)+\Sigma_{zz,2}'+4S_3.
\tag{M2}
$$

The radial Laplacian maps $r^2$ to $4$ and $r^4$ to $16r^2$. This is why $v_4$ enters (M2), even though its contribution to the velocity is fourth order. In the acceleration, the $r^2v_2v_0'$ term from $v_z\partial_zv_z$ cancels the $-r^2v_0'v_2$ term from $v_r\partial_rv_z$. The remaining material derivative in (M2) therefore has the form shown above. The radial derivatives are worked out in [[Laplacian-in-axisymmetric-slender-jet|the Laplacian note]].

To determine $p_2$, we use the coefficient of $r$ in radial momentum. The radial acceleration at this order is

$$
\partial_tv_r+v_r\partial_rv_r+v_z\partial_zv_r
=r\left[-\frac{1}{2}\left(\partial_tv_0'+v_0v_0''\right)
+\frac{1}{4}(v_0')^2\right]+\cdots.
$$

The polymer contribution is

$$
(\nabla\cdot\boldsymbol\sigma_p)_r
=\partial_r\sigma_{p,rr}
+\frac{\sigma_{p,rr}-\sigma_{p,\theta\theta}}{r}
+\partial_z\sigma_{p,rz}
=r\left(3\Sigma_{rr,2}-\Theta_2+S'\right)+\cdots.
$$

Balancing these terms with pressure and solvent viscosity gives

$$
\boxed{
p_2=\frac{\rho}{4}\left(\partial_tv_0'+v_0v_0''\right)
-\frac{\rho}{8}(v_0')^2
-\eta\left(v_2'+\frac{1}{4}v_0'''\right)
+\frac{3\Sigma_{rr,2}-\Theta_2+S'}{2}.
}
\tag{R}
$$

Both the local and convective radial accelerations contribute. Dropping $\partial_tv_0'$ requires a separate time-scale argument; slenderness alone does not remove it.

## 3. Retain the correction to the volume flux

At $r=h$, the kinematic condition is

$$
\dot h+\left(v_0+h^2v_2\right)h'
=-\frac{h}{2}v_0'-\frac{h^3}{4}v_2'.
$$

Multiplying by $2h$ gives

$$
\boxed{\partial_t(h^2)+\partial_z\left(h^2v_0+\frac{h^4}{2}v_2\right)=0.}
\tag{C}
$$

The same flux follows by integrating $v_z$ over the cross-section:

$$
Q=2\pi\int_0^h v_zr\,\mathrm dr
=\pi\left(h^2v_0+\frac{h^4}{2}v_2\right)+\cdots.
$$

Thus, the centreline velocity $v_0$ and the mean velocity $Q/(\pi h^2)$ differ at second order.

## 4. Expand both surface tractions

The exact unit normal, tangent and curvature are

$$
\boldsymbol n=\frac{\boldsymbol e_r-h'\boldsymbol e_z}{\sqrt{1+h'^2}},
\qquad
\boldsymbol t=\frac{h'\boldsymbol e_r+\boldsymbol e_z}{\sqrt{1+h'^2}},
$$

$$
\kappa=\frac{1}{h\sqrt{1+h'^2}}
-\frac{h''}{(1+h'^2)^{3/2}}.
$$

With this sign convention, a sphere $h=\sqrt{a^2-z^2}$ has $\kappa=2/a$. Expanding for small slope gives

$$
\kappa=\frac{1}{h}-h''-\frac{h'^2}{2h}+\cdots.
$$

The last two terms are relative $O(\varepsilon^2)$ corrections to $1/h$. The exact traction conditions are derived in [[dynamic-BC-slender-jet|the surface-stress note]].

### Normal traction

Solving $\boldsymbol n\cdot\boldsymbol\sigma\cdot\boldsymbol n=-\gamma\kappa$ for the centreline pressure gives

$$
p_0=\frac{\gamma}{h}-\eta v_0'+\Sigma_{rr}+\mathcal B,
\tag{N}
$$

where

$$
\begin{aligned}
\mathcal B={}&-\gamma\left(h''+\frac{h'^2}{2h}\right)-h^2p_2\\
&-\eta\left(\frac{3}{2}h^2v_2'+4hh'v_2-hh'v_0''-3h'^2v_0'\right)\\
&+\Delta\Sigma h'^2-2hh'S+h^2\Sigma_{rr,2}.
\end{aligned}
\tag{B}
$$

The first line accounts for curvature and the pressure difference between the axis and the surface. The second line is the solvent normal traction, including the change in the surface normal. The last line contains the three polymer corrections: the projection of the normal-stress difference, the projection of shear stress and the radial variation of $\sigma_{p,rr}$.

### Tangential traction

Multiplying $\boldsymbol t\cdot\boldsymbol\sigma\cdot\boldsymbol n=0$ by $1+h'^2$ gives the exact surface condition

$$
h'(\sigma_{rr}-\sigma_{zz})+(1-h'^2)\sigma_{rz}=0.
$$

Let $\mathcal T_0$ denote its leading contribution,

$$
\mathcal T_0=
\eta\left(-3h'v_0'-\frac{h}{2}v_0''+2hv_2\right)
+hS-\Delta\Sigma h',
\tag{T0}
$$

and $\mathcal T_2$ the contribution smaller by two powers of slenderness,

$$
\begin{aligned}
\mathcal T_2={}&\eta\left(4h^3v_4-\frac{h^3}{4}v_2''
-\frac{7}{2}h^2h'v_2'-2hh'^2v_2+\frac{1}{2}hh'^2v_0''\right)\\
&+h^3S_3+h^2h'(\Sigma_{rr,2}-\Sigma_{zz,2})-hh'^2S.
\end{aligned}
\tag{T2}
$$

At leading order we use $\mathcal T_0=0$. At second order, the condition is

$$
\boxed{\mathcal T_0+\mathcal T_2=0.}
\tag{T}
$$

This distinction determines the accuracy of the axial equation. In a perturbation expansion, the second-order correction to $v_2$ enters through $\mathcal T_0$ and balances $\mathcal T_2$ evaluated with the leading coefficients. Setting the two contributions to zero separately would remove that correction.

An alternative expression follows by using the leading condition to eliminate $hS-\Delta\Sigma h'$. The equivalent cubic contribution is

$$
\begin{aligned}
\widetilde{\mathcal T}_2={}&\eta\left(4h^3v_4-\frac{h^3}{4}v_2''
-\frac{7}{2}h^2h'v_2'-3h'^3v_0'\right)\\
&+h^3S_3+h^2h'(\Sigma_{rr,2}-\Sigma_{zz,2})-\Delta\Sigma h'^3.
\end{aligned}
$$

Indeed, $\widetilde{\mathcal T}_2=\mathcal T_2+h'^2\mathcal T_0$. Their difference is beyond the retained order when (T) holds. The direct form (T2) avoids making this substitution.

## 5. Obtain the corrected axial equation

Using (T) to rearrange the viscous term in (M0) gives

$$
4\eta v_2
=6\eta\frac{h'}{h}v_0'+\eta v_0''-2S
+2\Delta\Sigma\frac{h'}{h}-\frac{2\mathcal T_2}{h}.
$$

Now substitute this expression and (N) into (M0). The explicit $2S$ again cancels, leaving

$$
\boxed{
\begin{aligned}
\rho\left(\partial_tv_0+v_0v_0'\right)
={}&-\left(\frac{\gamma}{h}\right)'
+3\eta\frac{(h^2v_0')'}{h^2}
+\frac{(h^2\Delta\Sigma)'}{h^2}\\
&-\partial_z\mathcal B-\frac{2\mathcal T_2}{h}.
\end{aligned}
}
\tag{E2}
$$

Both final terms are second-order corrections. The pressure correction $\mathcal B$ comes from normal traction, while $\mathcal T_2$ changes the radial velocity profile through tangential traction. Polymer shear can still enter these corrections even though its explicit leading-order contribution has cancelled.

To use this hierarchy, retain (C), (M0), (M2), (R), (N) and (T), or replace (M0) and (N) by the equivalent equation (E2). In particular, (M2) supplies

$$
16\eta v_4
=\rho(\partial_tv_2+v_0v_2')+p_2'
-\eta v_2''-\Sigma_{zz,2}'-4S_3.
$$

Substituting this into (T2) removes $v_4$ as an independent unknown. It does not remove its contribution to the second-order balance. The polymer coefficients must be supplied by a constitutive equation expanded to the same accuracy, together with the appropriate initial and boundary conditions. The four leading closures alone do not constitute a complete second-order model.

## 6. Test a uniform filament

Take $h=h(t)$ and impose homogeneous extension,

$$
v_0=-2\frac{\dot h}{h}z.
$$

Assume spatially uniform, diagonal polymer stress, so all radial polymer coefficients and shear stresses vanish. The homogeneous velocity profile has $v_2=v_4=0$, and (C) is satisfied exactly. Equation (R) gives

$$
p_2=-\frac{\rho}{2}\frac{\ddot h}{h},
\qquad
\mathcal B=-h^2p_2=\frac{\rho}{2}h\ddot h,
\qquad
\mathcal T_2=0.
$$

The $\dot h^2$ terms from local and convective radial acceleration cancel. A radial pressure variation survives, but it has no axial gradient in this homogeneous ansatz. Consequently, it does not by itself balance axial acceleration: (M0) also requires $h\ddot h=3\dot h^2$ if the stresses are spatially uniform and inertia is retained.

The same pressure variation does contribute to the force integrated over a section. We calculate that force, and the additional assumptions needed to use it as a local thinning model, in [[from-slender-jet-to-uniform-filament|the next note]].

## Related calculations

- [[slender-jets-VE-order-0|Viscoelastic slender jets at leading order]]
- [[from-slender-jet-to-uniform-filament|Uniform-filament force balance]]
- [[r-2-parity|Parity of the radial expansion]]
- [[polymeric-stress-regularity-slender-jet|Polymer stress regularity]]
- [[dynamic-BC-slender-jet|Free-surface stress balance]]
