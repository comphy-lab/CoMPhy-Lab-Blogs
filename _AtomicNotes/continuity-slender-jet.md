---
modified: 2026-02-16T18:42:10+00:00
created: 2026-02-16T18:36:59+00:00
---
# Continuity in the Slender-Jet Expansion


Axisymmetric incompressibility:
$$
\frac{1}{r}\partial_r(r v_r)+\partial_z v_z=0.
$$

Use the long-wave expansion for axial velocity:
$$
v_z(r,z,t)=v_0(z,t)+\varepsilon^2 r^2 v_2(z,t)+O(\varepsilon^4 r^4).
$$

Differentiate in $z$:
$$
\partial_z v_z=v_0'(z,t)+\varepsilon^2 r^2 v_2'(z,t)+O(\varepsilon^4 r^4).
$$

Substitute into continuity:
$$
\partial_r(r v_r)
=-r\left[v_0'(z,t)+\varepsilon^2 r^2 v_2'(z,t)+O(\varepsilon^4 r^4)\right].
$$

Integrate in $r$:
$$
r v_r=-\frac{1}{2}v_0' r^2-\frac{1}{4}\varepsilon^2 v_2' r^4+C(z,t)+O(\varepsilon^4 r^6).
$$

Axis regularity requires $v_r(0,z,t)=0$, so $C(z,t)=0$. Divide by $r$:
$$
v_r(r,z,t)=-\frac{1}{2}v_0'(z,t)\,r-\frac{1}{4}\varepsilon^2 v_2'(z,t)\,r^3+O(\varepsilon^4 r^5).
$$

This is the odd-in-$r$ velocity expansion used in the slender-jet reduction.

Now apply the kinematic free-surface condition at $r=h(z,t)$:
$$
h_t+v_z(h,z,t)\,h_z=v_r(h,z,t).
$$

At leading order, $v_z(h,z,t)=v_0+O(\varepsilon^2)$ and
$$
v_r(h,z,t)=-\frac{1}{2}h\,v_0'+O(\varepsilon^2).
$$

Hence
$$
h_t+v_0 h_z=-\frac{1}{2}h v_0'+O(\varepsilon^2).
$$

Multiply by $2h$:
$$
\partial_t(h^2)+\partial_z(h^2 v_0)=O(\varepsilon^2).
$$

Leading-order 1D continuity equation:
$$
\partial_t(h^2)+\partial_z(h^2 v_0)=0.
$$

This is the continuity relation used in [[slender-jets-VE-order-0| VE order 0 slender jet]].
