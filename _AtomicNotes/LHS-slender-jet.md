---
modified: 2026-02-16T18:46:35+00:00
created: 2026-02-16T18:27:06+00:00
---
# LHS of the Slender-Jet Axial Equation


The full axial momentum inertia terms in axisymmetric cylindrical coordinates:
$$
\partial_t v_z+v_r\,\partial_r v_z+v_z\,\partial_z v_z.
$$

Use the long-wave expansions (see: [[continuity-slender-jet|Continuity equation in slender jet]])
$$
v_z(r,z,t)=v_0(z,t)+\varepsilon^2 r^2 v_2(z,t)+O(\varepsilon^4 r^4),
$$
$$
v_r(r,z,t)=-\frac{1}{2}v_0'(z,t)\,r+O(\varepsilon^2 r^3).
$$

Compute each inertia contribution.

Time derivative:
$$
\partial_t v_z=\partial_t v_0+\varepsilon^2 r^2\partial_t v_2+O(\varepsilon^4)
=\partial_t v_0+O(\varepsilon^2).
$$

Axial advection:
$$
\partial_z v_z=v_0'+\varepsilon^2 r^2 v_2'+O(\varepsilon^4),
$$
$$
v_z\,\partial_z v_z
=\left(v_0+\varepsilon^2 r^2 v_2+O(\varepsilon^4)\right)
\left(v_0'+\varepsilon^2 r^2 v_2'+O(\varepsilon^4)\right)
=v_0 v_0'+O(\varepsilon^2).
$$

Radial advection:
$$
\partial_r v_z=2\varepsilon^2 r v_2+O(\varepsilon^4 r^3),
$$
$$
v_r\,\partial_r v_z
=\left(-\frac{1}{2}v_0'\,r+O(\varepsilon^2 r^3)\right)
\left(2\varepsilon^2 r v_2+O(\varepsilon^4 r^3)\right)
=-\varepsilon^2 r^2 v_0'v_2+O(\varepsilon^4)
=O(\varepsilon^2).
$$

Therefore, at leading order,
$$
\partial_t v_z+v_r\,\partial_r v_z+v_z\,\partial_z v_z
=\partial_t v_0+v_0 v_0'+O(\varepsilon^2).
$$

So the $O(1)$ LHS in the slender-jet axial equation is
$$
\partial_t v_0+v_0 v_0'.
$$
