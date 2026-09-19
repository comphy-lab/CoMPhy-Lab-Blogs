# Leading-Order Dynamic BC in a Slender Jet

The free surface determines both the pressure and the first radial correction to axial velocity. Normal traction gives the pressure at leading order. Tangential traction determines $v_2$, including the effect of polymer shear and the projection of polymer normal stress onto a tilted interface.

Consider an axisymmetric, swirl-free liquid with surface $r=h(z,t)$. We use dimensional coordinates, with primes denoting $\partial_z$. The solvent viscosity $\eta$ and surface tension $\gamma$ are constant. The surrounding gas exerts a uniform pressure $p_a$ and negligible viscous stress. We use the meridional polymer-stress symmetry specified in [[polymeric-stress-regularity-slender-jet|the regularity note]].

## 1. Fix the stress and curvature signs

Write the absolute liquid pressure as $P$. The liquid and gas stresses are

$$
\boldsymbol\sigma=-P\boldsymbol I+2\eta\boldsymbol D+\boldsymbol\sigma_p,
\qquad
\boldsymbol\sigma^{\mathrm{out}}=-p_a\boldsymbol I,
$$

where $\boldsymbol D=[\nabla\boldsymbol v+(\nabla\boldsymbol v)^{\mathsf T}]/2$. With the unit normal pointing out of the liquid,

$$
(\boldsymbol\sigma-\boldsymbol\sigma^{\mathrm{out}})\cdot\boldsymbol n
=-\gamma\kappa\boldsymbol n.
$$

The normal and tangential projections are therefore

$$
\boldsymbol n\cdot\boldsymbol\sigma\cdot\boldsymbol n=-p_a-\gamma\kappa,
\qquad
\boldsymbol t\cdot\boldsymbol\sigma\cdot\boldsymbol n=0.
$$

For $r=h(z,t)$, the exact geometry is

$$
\boldsymbol n=\frac{\boldsymbol e_r-h'\boldsymbol e_z}{\sqrt{1+h'^2}},
\qquad
\boldsymbol t=\frac{h'\boldsymbol e_r+\boldsymbol e_z}{\sqrt{1+h'^2}},
$$

$$
\kappa=\frac{1}{h\sqrt{1+h'^2}}-\frac{h''}{(1+h'^2)^{3/2}}.
$$

A cylindrical surface has $\kappa=1/h$, and a sphere of radius $a$ has $\kappa=2/a$. These limits fix the curvature sign in the normal balance.

Let $\ell_r/L=\varepsilon\ll1$. With $h'=O(\varepsilon)$ and $Lh''=O(\varepsilon)$, the expansion is

$$
\kappa=\frac{1}{h}-h''-\frac{h'^2}{2h}+\cdots.
$$

The last two terms are relative $O(\varepsilon^2)$ corrections to $1/h$. We retain only the leading curvature in the calculation below.

## 2. Evaluate the velocity gradients at the surface

Use the dimensional radial expansion and its [[continuity-slender-jet|continuity constraint]],

$$
v_z=v_0+r^2v_2+\cdots,
\qquad
v_r=-\frac{r}{2}v_0'-\frac{r^3}{4}v_2'+\cdots.
$$

The required surface gradients are

$$
\left.\partial_rv_r\right|_h=-\frac{1}{2}v_0'-\frac{3h^2}{4}v_2'+\cdots,
\qquad
\left.\partial_zv_z\right|_h=v_0'+h^2v_2'+\cdots,
$$

$$
\left.(\partial_rv_z+\partial_zv_r)\right|_h
=2hv_2-\frac{h}{2}v_0''+\cdots.
$$

Derivatives are taken at fixed coordinates before evaluating at $r=h$. In the normal gradients, the displayed $h^2v_2'$ terms are second-order corrections. In the shear gradient, both displayed terms contribute at the first nonzero order. The polymer stresses at this accuracy are

$$
\sigma_{p,rr}(h)=\Sigma_{rr}+\cdots,
\qquad
\sigma_{p,zz}(h)=\Sigma_{zz}+\cdots,
\qquad
\sigma_{p,rz}(h)=hS+\cdots.
$$

## 3. Use normal traction to determine the pressure

The exact normal projection gives

$$
P=p_a+\gamma\kappa+2\eta\,\boldsymbol n\cdot\boldsymbol D\cdot\boldsymbol n
+\boldsymbol n\cdot\boldsymbol\sigma_p\cdot\boldsymbol n.
$$

At leading order, $\boldsymbol n\simeq\boldsymbol e_r$, $\kappa\simeq1/h$ and the pressure is uniform across the section. Thus,

$$
P_0=p_a+\frac{\gamma}{h}-\eta v_0'+\Sigma_{rr}.
$$

Defining the pressure relative to the gas as $p=P-p_a$, we obtain the convention used in the main notes:

$$
\boxed{p_0=\frac{\gamma}{h}-\eta v_0'+\Sigma_{rr}.}
$$

At second order, the surface and centreline pressures differ by $h^2p_2$, so this leading expression cannot be used unchanged at that accuracy.

## 4. Use tangential traction to determine $v_2$

The exact tangential projection is

$$
\boldsymbol t\cdot\boldsymbol\sigma\cdot\boldsymbol n
=\frac{h'(\sigma_{rr}-\sigma_{zz})+(1-h'^2)\sigma_{rz}}{1+h'^2}.
$$

Pressure cancels from $\sigma_{rr}-\sigma_{zz}$. At the first nonzero order, the solvent contribution is therefore

$$
\eta\left[(\partial_rv_z+\partial_zv_r)
+2h'(\partial_rv_r-\partial_zv_z)\right]_h.
$$

The first bracketed term supplies $2hv_2-hv_0''/2$. The second gives

$$
2h'\left(-\frac{1}{2}v_0'-v_0'\right)=-3h'v_0'.
$$

The polymer projection contributes

$$
\sigma_{p,rz}(h)+h'(\Sigma_{rr}-\Sigma_{zz})
=hS-\Delta\Sigma h',
\qquad
\Delta\Sigma=\Sigma_{zz}-\Sigma_{rr}.
$$

Combining these terms gives the leading tangential condition,

$$
\boxed{\eta\left(-3h'v_0'-\frac{h}{2}v_0''+2hv_2\right)
+hS-\Delta\Sigma h'=0.}
$$

For $\eta>0$, we can rearrange it as

$$
2\eta hv_2=3\eta h'v_0'+\frac{\eta h}{2}v_0''-hS+\Delta\Sigma h'.
$$

The tilted interface projects normal stress into the tangential direction. Consequently, $hS$ and $\Delta\Sigma h'$ must both be retained; a shear-free surface does not require the polymer shear stress itself to vanish.

## 5. Keep track of the accuracy

The leading normal condition neglects relative $O(\varepsilon^2)$ corrections. The first tangential balance is itself $O(\varepsilon)$ on the characteristic stress scale, and its next contribution is $O(\varepsilon^3)$ on that scale.

In the notation of [[slender-jets-VE-order-2|the second-order derivation]], the full retained tangential condition is $\mathcal T_0+\mathcal T_2=0$. Using only $\mathcal T_0=0$ is sufficient for [[slender-jets-VE-order-0|leading-order momentum]], but loses the correction $-2\mathcal T_2/h$ at the next order. Together with the normal-traction correction $\mathcal B$, the second-order axial equation therefore contains

$$
-\partial_z\mathcal B-\frac{2\mathcal T_2}{h}.
$$

The full expressions for these corrections, including the radial polymer-stress coefficients, are given in the main second-order note.
