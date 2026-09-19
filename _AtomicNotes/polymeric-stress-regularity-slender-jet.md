# Polymeric Stress Regularity in a Slender Jet

The cylindrical basis is undefined at the axis, but the physical polymer stress must remain smooth there. This constrains both its radial dependence and the equality of its transverse components. We derive the expansion used in [[slender-jets-VE-order-0|the leading-order momentum balance]] and identify the additional coefficients needed at second order.

We use dimensional cylindrical coordinates $(r,\theta,z)$ and a smooth, symmetric polymer extra stress. The fields are axisymmetric. For the meridional model, we also assume reflection symmetry through planes containing the axis, so $\sigma_{p,r\theta}=\sigma_{p,\theta z}=0$. This stress symmetry is an additional assumption; a swirl-free velocity alone does not enforce it for arbitrary stress data. Primes denote $\partial_z$.

## 1. Match the transverse stresses at the axis

At $r=0$, rotational invariance leaves no preferred direction in the transverse plane. Therefore,

$$
\sigma_{p,rr}(0,z,t)=\sigma_{p,\theta\theta}(0,z,t),
\qquad
\sigma_{p,r\theta}(0,z,t)=0.
$$

The diagonal stress components have even radial Taylor expansions. As shown in [[r-2-parity|the tensor-parity calculation]], their difference consequently satisfies

$$
\Delta_\perp\equiv\sigma_{p,rr}-\sigma_{p,\theta\theta}=O(r^2).
$$

This also removes the apparent singularity in the radial stress divergence,

$$
(\nabla\cdot\boldsymbol\sigma_p)_r
=\partial_r\sigma_{p,rr}
+\frac{\sigma_{p,rr}-\sigma_{p,\theta\theta}}{r}
+\partial_z\sigma_{p,rz}.
$$

The quotient $\Delta_\perp/r$ is $O(r)$. Boundedness of that quotient alone would allow $\Delta_\perp=O(r)$; the stronger quadratic result comes from Cartesian smoothness and rotational symmetry.

An equivalent decomposition uses the transverse mean and the same full difference,

$$
\Sigma_\perp\equiv\frac{\sigma_{p,rr}+\sigma_{p,\theta\theta}}{2}
=\Sigma_{\perp,0}+r^2\Sigma_{\perp,2}+\cdots,
$$

$$
\Delta_\perp=r^2\Delta_{\perp,2}+\cdots.
$$

Thus, $\sigma_{p,rr}=\Sigma_\perp+\Delta_\perp/2$ and $\sigma_{p,\theta\theta}=\Sigma_\perp-\Delta_\perp/2$. The factors of two follow from separating the mean and the full difference.

## 2. Determine the radial shear stress

The mixed transverse-axial stress changes sign under a rotation by $\pi$ along a signed transverse coordinate. Smoothness therefore gives an odd expansion,

$$
\sigma_{p,rz}=rS+r^3S_3+\cdots.
$$

In particular, $\sigma_{p,rz}$ vanishes at the axis. A nonzero constant limit $c$ would give a singular contribution to axial momentum,

$$
\frac{1}{r}\partial_r(r\sigma_{p,rz})\sim\frac{c}{r}.
$$

For the regular expansion, the same derivative is finite:

$$
\frac{1}{r}\partial_r(r\sigma_{p,rz})=2S+4r^2S_3+\cdots.
$$

## 3. Collect the coefficients used in the jet model

The complete set needed here is

$$
\begin{aligned}
\sigma_{p,zz}&=\Sigma_{zz}+r^2\Sigma_{zz,2}+O(r^4),\\
\sigma_{p,rr}&=\Sigma_{rr}+r^2\Sigma_{rr,2}+O(r^4),\\
\sigma_{p,\theta\theta}&=\Sigma_{rr}+r^2\Theta_2+O(r^4),\\
\sigma_{p,rz}&=rS+r^3S_3+O(r^5).
\end{aligned}
$$

The Taylor coefficients depend on $z$ and $t$. Let $\varepsilon=\ell_r/L\ll1$, with $\ell_r$ and $L$ the radial and axial scales. Since $r$ is dimensional, the slenderness factors are already contained in the radial powers. Under the regular ordering, the $r^2$ terms in the normal stresses are relative $O(\varepsilon^2)$ corrections on the characteristic stress scale.

Substitution into the stress divergence gives

$$
(\nabla\cdot\boldsymbol\sigma_p)_z
=\Sigma_{zz}'+2S+r^2\left(\Sigma_{zz,2}'+4S_3\right)+O(r^4),
$$

$$
(\nabla\cdot\boldsymbol\sigma_p)_r
=r\left(3\Sigma_{rr,2}-\Theta_2+S'\right)+O(r^3).
$$

These are the polymer contributions to (M0), (M2) and (R) in [[slender-jets-VE-order-2|the second-order hierarchy]]. The radial and hoop stresses share their leading coefficient, but $\Sigma_{rr,2}$ and $\Theta_2$ remain distinct at the next order.

At leading order, eliminating $v_2$ with [[dynamic-BC-slender-jet|the tangential traction condition]] cancels the explicit shear contribution $2S$ from axial momentum. The remaining polymer force is

$$
\frac{(h^2\Delta\Sigma)'}{h^2},
\qquad
\Delta\Sigma\equiv\Sigma_{zz}-\Sigma_{rr}.
$$

This cancellation follows from the bulk and surface balances together. Regularity neither sets $S=0$ nor supplies a constitutive equation. At second order, shear and transverse-stress variation still enter the corrected tractions and must be evolved consistently with the polymer model.
