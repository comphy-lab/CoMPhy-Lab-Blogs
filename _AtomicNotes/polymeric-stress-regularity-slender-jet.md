---
modified: 2026-02-16T20:36:34+00:00
created: 2026-02-16T19:54:28+00:00
---
# Polymeric Stress Regularity in a Slender Jet

Axis-regularity constraints on $\boldsymbol{\sigma}_p$ used in [[polymeric-stress-regularity-slender-jet|Slender jet momentum equations]].

Use axisymmetric cylindrical coordinates $(r,\theta,z)$ with no swirl ($\partial_\theta() = 0$).
## 1) Axis regularity and rotational invariance

At $r=0$, the transverse plane is rotationally symmetric. A physical tensor field must have a unique, direction-independent limit at the axis.

For the polymer stress components in the $(r,\theta)$ plane, this implies
$$
\sigma_{p,rr}(0,z,t)=\sigma_{p,\theta\theta}(0,z,t),
\qquad
\sigma_{p,r\theta}(0,z,t)=0.
$$

So there is no preferred transverse direction at the axis.

## 2) Why $\sigma_{p,rr}-\sigma_{p,\theta\theta}=O(r^2)$

The radial divergence contains
$$
(\nabla\cdot\boldsymbol{\sigma}_p)_r
=\partial_r\sigma_{p,rr}+\frac{\sigma_{p,rr}-\sigma_{p,\theta\theta}}{r}+\partial_z\sigma_{p,rz}.
$$

To avoid a singular $1/r$ forcing at $r=0$, the difference
$$
\Delta_\perp\equiv\sigma_{p,rr}-\sigma_{p,\theta\theta}
$$
must vanish at least as $O(r)$, and axis smoothness with Taylor-expandable fields gives the stronger form ([[r-2-parity|why?]])
$$
\Delta_\perp=O(r^2).
$$

Hence
$$
\sigma_{p,rr}(0,z,t)=\sigma_{p,\theta\theta}(0,z,t),
\qquad
\sigma_{p,rr}-\sigma_{p,\theta\theta}=O(r^2).
$$

Equivalent decomposition near the axis:
$$
\Sigma_\perp\equiv\frac{\sigma_{p,rr}+\sigma_{p,\theta\theta}}{2}
=\Sigma_{\perp,0}(z,t)+\Sigma_{\perp,2}(z,t)r^2+\cdots,
$$
$$
\Delta_\perp\equiv\frac{\sigma_{p,rr}-\sigma_{p,\theta\theta}}{2}
=\Delta_{\perp,2}(z,t)r^2+\cdots.
$$

## 3) Why $\sigma_{p,rz}=r\,S+O(r^3)$

The axial divergence contains
$$
(\nabla\cdot\boldsymbol{\sigma}_p)_z
=\partial_z\sigma_{p,zz}+\frac{1}{r}\partial_r(r\sigma_{p,rz}).
$$

If $\sigma_{p,rz}\to c\neq0$ as $r\to0$, then
$$
\frac{1}{r}\partial_r(r\sigma_{p,rz})\sim\frac{c}{r},
$$
which is singular. Therefore boundedness requires
$$
\sigma_{p,rz}=O(r).
$$

With smooth odd parity in $r$,
$$
\sigma_{p,rz}(r,z,t)=r\,S(z,t)+O(r^3).
$$

## 4) Leading-order form used in slender-jet reduction

A consistent regular expansion is
$$
\sigma_{p,zz}(r,z,t)=\Sigma_{zz}(z,t)+O(\varepsilon^2 r^2),
$$
$$
\sigma_{p,rr}(r,z,t)=\Sigma_{rr}(z,t)+O(\varepsilon^2 r^2),
$$
$$
\sigma_{p,\theta\theta}(r,z,t)=\Sigma_{\theta\theta}(z,t)+O(\varepsilon^2 r^2),
$$
$$
\sigma_{p,rz}(r,z,t)=r\,S(z,t)+O(\varepsilon^2 r^3),
$$
with
$$
\Sigma_{rr}=\Sigma_{\theta\theta}
\quad\text{at leading order.}
$$

So the independent leading-order polymer contribution in the axial 1D model is the axial-radial normal-stress difference
$$
\Delta\Sigma\equiv\Sigma_{zz}-\Sigma_{rr},
$$
while hoop stress is not an additional independent leading-order degree of freedom.
