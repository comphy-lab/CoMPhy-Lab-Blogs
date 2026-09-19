# Viscous stress in the Slender-Jet Axial Equation

The first radial correction to axial velocity is small, but its viscous contribution need not be. Two radial derivatives of $r^2v_2$ leave the finite term $4v_2$. We derive this term and the next coefficient using the same dimensional coordinates as [[slender-jets-VE-order-0|the leading-order slender-jet equation]].

For an incompressible liquid with constant solvent viscosity $\eta$, the axial component of the solvent-stress divergence is $\eta\nabla^2v_z$. In axisymmetric cylindrical coordinates,

$$
\nabla^2v_z=\partial_{rr}v_z+\frac{1}{r}\partial_rv_z+\partial_{zz}v_z.
$$

The axial component has the scalar Laplacian shown here. The radial component of the vector Laplacian has an additional $-v_r/r^2$ term.

## 1. Differentiate the radial expansion

Write

$$
v_z=v_0+r^2v_2+r^4v_4+O(r^6),
$$

with coefficients depending on $z$ and $t$. Primes denote $\partial_z$. Then

$$
\partial_rv_z=2rv_2+4r^3v_4+O(r^5),
$$

$$
\partial_{rr}v_z=2v_2+12r^2v_4+O(r^4),
\qquad
\frac{1}{r}\partial_rv_z=2v_2+4r^2v_4+O(r^4).
$$

Adding gives

$$
\left(\partial_{rr}+\frac{1}{r}\partial_r\right)v_z
=4v_2+16r^2v_4+O(r^4).
$$

The apparent $1/r$ singularity is removable because $\partial_rv_z$ vanishes linearly at the axis. More generally, for $n\geq1$,

$$
\left(\partial_{rr}+\frac{1}{r}\partial_r\right)r^{2n}
=4n^2r^{2n-2}.
$$

## 2. Add the axial derivatives

The axial part is

$$
\partial_{zz}v_z=v_0''+r^2v_2''+O(r^4).
$$

Hence

$$
\boxed{\nabla^2v_z=4v_2+v_0''+r^2\left(16v_4+v_2''\right)+O(r^4).}
$$

For a Newtonian liquid, combining the $r^0$ coefficient with [[LHS-slender-jet|the axial acceleration]] gives

$$
\rho\left(\partial_tv_0+v_0v_0'\right)
=-p_0'+\eta\left(4v_2+v_0''\right).
$$

Polymer stress adds $\Sigma_{zz}'+2S$ to this coefficient equation; it is separate from the solvent contribution derived here. At the next radial order, the solvent term is $\eta(16v_4+v_2'')$. The full equations are given in [[slender-jets-VE-order-2|the second-order hierarchy]].

## 3. Check the length scales

Let the axial velocity scale be $U$, with radial scale $\ell_r=\varepsilon L$. In the regular slender expansion, $v_2=O(U/L^2)$, so

$$
\ell_r^2v_2=O(\varepsilon^2U),
\qquad
4v_2=O(U/L^2),
\qquad
v_0''=O(U/L^2).
$$

Thus, the small correction to the axial velocity profile and the leading axial velocity contribute at the same order after viscous differentiation. The surface traction must determine $v_2$ before we eliminate it from the leading momentum balance.

If instead we introduce scaled coordinates $R=r/\ell_r$ and $Z=z/L$, the dimensional operator becomes

$$
\nabla^2=\frac{1}{L^2}\left[
\frac{1}{\varepsilon^2}\left(\partial_{RR}+\frac{1}{R}\partial_R\right)+\partial_{ZZ}
\right].
$$

This is the origin of the $1/\varepsilon^2$ factor in the scaled equation. It belongs to derivatives with respect to $R$, not to the dimensional operator used above.
