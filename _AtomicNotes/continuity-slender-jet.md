# Continuity in the Slender-Jet Expansion

Consider an incompressible, axisymmetric jet with surface $r=h(z,t)$. Once the axial velocity is specified, continuity determines the radial velocity. Requiring regularity at the axis removes the integration constant, and the surface kinematics then give conservation of cross-sectional area.

We use dimensional coordinates, as in [[slender-jets-VE-order-0|the leading-order derivation]]. Primes denote $\partial_z$. If $\ell_r/L=\varepsilon\ll1$, the dimensional powers of $r$ carry the slender ordering; no additional powers of $\varepsilon$ multiply them.

## 1. Integrate continuity from the axis

Axisymmetric incompressibility requires

$$
\frac{1}{r}\partial_r(rv_r)+\partial_zv_z=0.
$$

Expand the axial velocity as

$$
v_z=v_0+r^2v_2+r^4v_4+\cdots,
$$

where the coefficients depend on $z$ and $t$. Substitution into continuity gives

$$
\partial_r(rv_r)=-rv_0'-r^3v_2'-r^5v_4'+\cdots.
$$

Integrating with respect to $r$,

$$
rv_r=-\frac{r^2}{2}v_0'-\frac{r^4}{4}v_2'-\frac{r^6}{6}v_4'+C(z,t).
$$

A nonzero $C$ would give a singular velocity $C/r$ at the axis. Regularity therefore requires $C=0$, giving

$$
\boxed{v_r=-\frac{r}{2}v_0'-\frac{r^3}{4}v_2'-\frac{r^5}{6}v_4'+\cdots.}
$$

The radial velocity is odd in $r$, as required by [[r-2-parity|axis regularity]]. In particular, a positive axial strain rate $v_0'$ produces an inward radial velocity.

## 2. Apply the surface kinematics

The surface moves with the liquid, so

$$
\partial_th+v_z(h,z,t)h'=v_r(h,z,t).
$$

At leading order this becomes

$$
\partial_th+v_0h'=-\frac{h}{2}v_0'.
$$

Multiplying by $2h$ and collecting the axial derivative gives

$$
\boxed{\partial_t(h^2)+\partial_z(h^2v_0)=0.}
$$

This is the leading continuity equation used in [[slender-jets-VE-order-0|the slender-jet model]].

## 3. Retain the first correction to the flux

Keeping the $r^2$ axial-velocity correction gives

$$
\partial_th+(v_0+h^2v_2)h'
=-\frac{h}{2}v_0'-\frac{h^3}{4}v_2'.
$$

Multiplication by $2h$ now yields

$$
\boxed{\partial_t(h^2)+\partial_z\left(h^2v_0+\frac{h^4}{2}v_2\right)=0.}
$$

We can check the coefficient by integrating the axial velocity over a section. The exact volume flux is

$$
Q=2\pi\int_0^h v_zr\,\mathrm dr,
$$

so its expansion is

$$
Q=\pi\left(h^2v_0+\frac{h^4}{2}v_2+\frac{h^6}{3}v_4+\cdots\right).
$$

The exact area balance is $\partial_t(\pi h^2)+\partial_zQ=0$. Truncating this flux after $v_2$ recovers the second-order equation above. Under the regular slender ordering, the $v_2$ contribution is a relative $O(\varepsilon^2)$ correction, while the $v_4$ contribution is relative $O(\varepsilon^4)$. Consequently, the centreline velocity $v_0$ and the mean velocity $Q/(\pi h^2)$ agree only at leading order.

The corresponding momentum and traction corrections are given in [[slender-jets-VE-order-2|the second-order derivation]].
