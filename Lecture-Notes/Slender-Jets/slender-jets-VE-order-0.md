---
status: done ✅
publish: true
---
# Viscoelastic Slender Jets

<!-- BLOG-PDF-LINK-START -->
<!-- PDF-EXPORT-IGNORE-START -->
> [!pdf] PDF version
> [[_Media/PDF/Lecture-Notes/Slender-Jets/slender-jets-VE-order-0.pdf|Download this page as PDF]]
<!-- PDF-EXPORT-IGNORE-END -->
<!-- BLOG-PDF-LINK-END -->

Consider an axisymmetric liquid jet whose radius changes slowly along its length. As the jet stretches, incompressibility couples the axial velocity to the radial motion of its surface. We use this constraint to reduce the momentum equation to a balance between axial inertia, capillarity, solvent viscosity and polymer stress.

## 1. Set up the expansion

The free surface is $r=h(z,t)$, with no azimuthal flow. The liquid has density $\rho$, solvent viscosity $\eta>0$ and constant surface tension $\gamma$. We neglect gravity and the stress in the surrounding gas, and measure pressure relative to the uniform gas pressure. Primes denote $\partial_z$.

Let $\ell_r$ and $L$ be the radial and axial length scales, respectively, with $\varepsilon=\ell_r/L\ll1$. We retain dimensional coordinates throughout. Thus, $r/L=O(\varepsilon)$, $h'=O(\varepsilon)$ and $Lh''=O(\varepsilon)$. The powers of $r$ already carry the radial ordering; we do not multiply them by additional powers of $\varepsilon$.

Smoothness at the axis requires the axial velocity and pressure to be even in $r$, and the radial velocity to be odd. Expanding the axial velocity and pressure gives

$$
v_z(r,z,t)=v_0(z,t)+r^2v_2(z,t)+\cdots,
\qquad
p(r,z,t)=p_0(z,t)+r^2p_2(z,t)+\cdots.
$$

Here, $v_0$ is the centreline axial velocity. We assume $r^2v_2/v_0=O(\varepsilon^2)$ on the characteristic velocity scale. Continuity,

$$
\frac{1}{r}\partial_r(rv_r)+\partial_zv_z=0,
$$

then determines the radial velocity. Integrating from the axis and requiring regularity gives

$$
v_r=-\frac{r}{2}v_0'-\frac{r^3}{4}v_2'+\cdots.
$$

The details of this integration are in [[continuity-slender-jet|the continuity note]].

The Cauchy stress is

$$
\boldsymbol\sigma=-p\boldsymbol I+2\eta\boldsymbol D+\boldsymbol\sigma_p,
\qquad
\boldsymbol D=\frac{\nabla\boldsymbol v+(\nabla\boldsymbol v)^{\mathsf T}}{2},
$$

where $\boldsymbol\sigma_p$ is the polymer extra stress. Its regular expansion has the form

$$
\sigma_{p,zz}=\Sigma_{zz}+O(r^2),\qquad
\sigma_{p,rr}=\Sigma_{rr}+O(r^2),\qquad
\sigma_{p,rz}=rS+O(r^3).
$$

Axis regularity also requires $\Sigma_{\theta\theta}=\Sigma_{rr}$; see [[polymeric-stress-regularity-slender-jet|polymer stress regularity]]. We define the polymer normal-stress difference as

$$
\Delta\Sigma=\Sigma_{zz}-\Sigma_{rr}.
$$

## 2. Find the axial momentum balance

The axial component of the polymer-stress divergence is

$$
(\nabla\cdot\boldsymbol\sigma_p)_z
=\partial_z\sigma_{p,zz}+\frac{1}{r}\partial_r(r\sigma_{p,rz}).
$$

Since $\sigma_{p,rz}=rS+\cdots$, its radial contribution at the axis is

$$
\frac{1}{r}\partial_r(r^2S)=2S.
$$

Similarly, the radial part of the axial viscous Laplacian gives $4v_2$. The $r^0$ coefficient of axial momentum is therefore

$$
\rho\left(\partial_tv_0+v_0v_0'\right)
=-p_0'+\eta\left(4v_2+v_0''\right)+\Sigma_{zz}'+2S.
\tag{M0}
$$

Although $r^2v_2$ is a small velocity correction, two radial derivatives bring $v_2$ into this balance. We must determine it from the surface traction before discarding the radial structure. See [[Laplacian-in-axisymmetric-slender-jet|the Laplacian calculation]] and [[LHS-slender-jet|the acceleration calculation]] for the intermediate steps.

## 3. Apply the surface conditions

The surface moves with the liquid. At leading order,

$$
\partial_th+v_0h'=-\frac{h}{2}v_0',
$$

which gives conservation of cross-sectional area,

$$
\partial_t(h^2)+\partial_z(h^2v_0)=0.
$$

The leading normal traction fixes the centreline pressure,

$$
p_0=\frac{\gamma}{h}-\eta v_0'+\Sigma_{rr}.
$$

The first nonzero tangential-traction balance is

$$
\eta\left(-3h'v_0'-\frac{h}{2}v_0''+2hv_2\right)
+hS-\Delta\Sigma h'=0.
\tag{T0}
$$

The terms proportional to $h'$ arise because the surface normal is tilted relative to the radial direction. These include the projection of the polymer normal-stress difference, so they must be retained alongside the shear stress. The full geometry is given in [[dynamic-BC-slender-jet|the free-surface stress balance]].

Solving (T0) for $v_2$ gives

$$
2\eta hv_2
=3\eta h'v_0'+\frac{\eta h}{2}v_0''-hS+\Delta\Sigma h'.
$$

Differentiating the normal-traction condition gives

$$
p_0'=\left(\frac{\gamma}{h}\right)'-\eta v_0''+\Sigma_{rr}'.
$$

Substituting both expressions into (M0), we obtain

$$
\boxed{
\rho\left(\partial_tv_0+v_0v_0'\right)
=-\left(\frac{\gamma}{h}\right)'
+3\eta\frac{(h^2v_0')'}{h^2}
+\frac{(h^2\Delta\Sigma)'}{h^2}.
}
$$

The polymer shear stress cancels: the $2S$ in the bulk equation is removed by the $-2S$ supplied through $4\eta v_2$. This cancellation does not require $S=0$. The factor three multiplying the solvent contribution is the Trouton ratio for uniaxial extension.

## 4. Write momentum in conservative form

Multiplying by $h^2$ and using $h^2(1/h)'=-h'$ gives

$$
\rho h^2\left(\partial_tv_0+v_0v_0'\right)
=\left(\gamma h+3\eta h^2v_0'+h^2\Delta\Sigma\right)'.
$$

Continuity converts the left-hand side into a momentum density and flux, since

$$
\partial_t(h^2v_0)+\partial_z(h^2v_0^2)
=h^2\left(\partial_tv_0+v_0v_0'\right)
+v_0\left[\partial_t(h^2)+\partial_z(h^2v_0)\right].
$$

The term in square brackets vanishes. The leading-order equations are therefore

$$
\boxed{\partial_t(h^2)+\partial_z(h^2v_0)=0,}
$$

$$
\boxed{
\rho\left[\partial_t(h^2v_0)+\partial_z(h^2v_0^2)\right]
=\partial_z\left[\gamma h+3\eta h^2\partial_zv_0+h^2\Delta\Sigma\right].
}
$$

Multiplying the quantity in the final square brackets by $\pi$ gives the leading axial tensile force. Its variation along the jet changes the axial momentum. A constitutive equation for the polymer stress is still needed to close the dynamics.

These equations neglect relative $O(\varepsilon^2)$ corrections under the stated slender ordering. In particular, the pressure is uniform across a section only at leading order. The next calculation retains its radial variation and the corresponding corrections to both surface tractions.

## Continue reading

- [[slender-jets-VE-order-2|Viscoelastic slender jets at $O(\varepsilon^2)$]]
- [[from-slender-jet-to-uniform-filament|From the slender-jet hierarchy to a uniform-filament force balance]]
