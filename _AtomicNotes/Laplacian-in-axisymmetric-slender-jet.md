---
modified: 2026-02-16T18:45:05+00:00
created: 2026-02-16T18:23:00+00:00
---
# Viscous stress in the Slender-Jet Axial Equation


> The origin of the $4v_2$ term used in [[slender-jets-VE-order-0|Slender jet viscous stress divergence]]

Use the long-wave expansion
$$
v_z(r,z,t)=v_0(z,t)+\varepsilon^2 r^2 v_2(z,t)+O(\varepsilon^4 r^4).
$$

In the nondimensional axial equation, the viscous operator is
$$
\frac{1}{\varepsilon^2}\left(\partial_{rr}v_z+\frac{1}{r}\partial_r v_z\right)+\partial_{zz}v_z.
$$

Given (see: [[continuity-slender-jet|Continuity equation in slender jet]])

$$
v_z(r,z,t)=v_0(z,t)+\varepsilon^2 r^2 v_2(z,t)+\cdots,  
$$
$$
v_r(r,z,t)= -\frac{1}{2}v_0'(z,t)\,r-\frac{1}{4}\varepsilon^2 v_2'(z,t)\,r^3+\cdots,  
$$

Compute radial derivatives of $v_z$:
$$
\partial_r v_z=2\varepsilon^2 r v_2+O(\varepsilon^4 r^3),
$$
$$
\partial_{rr}v_z=2\varepsilon^2 v_2+O(\varepsilon^4 r^2),
$$
$$
\frac{1}{r}\partial_r v_z=2\varepsilon^2 v_2+O(\varepsilon^4 r^2).
$$

Therefore
$$
\frac{1}{\varepsilon^2}\left(\partial_{rr}v_z+\frac{1}{r}\partial_r v_z\right)
=\frac{1}{\varepsilon^2}\left(2\varepsilon^2 v_2+2\varepsilon^2 v_2\right)+O(\varepsilon^2)
=4v_2+O(\varepsilon^2).
$$

Now compute the axial derivative:
$$
\partial_{zz}v_z=v_0''+\varepsilon^2 r^2 v_2''+O(\varepsilon^4 r^4)
=v_0''+O(\varepsilon^2).
$$

So the full viscous contribution at leading order is
$$
\frac{1}{\varepsilon^2}\left(\partial_{rr}v_z+\frac{1}{r}\partial_r v_z\right)+\partial_{zz}v_z
=4v_2+v_0''+O(\varepsilon^2).
$$

Hence the $O(1)$ axial momentum balance contains
$$
\partial_t v_0+v_0 v_0'=-p_0'+\left(4v_2+v_0''\right)+O(\varepsilon^2),
$$
or in dimensional form
$$
\rho\left(\partial_t v_0+v_0 v_0'\right)=-p_0'+\eta\left(4v_2+v_0''\right)+O(\varepsilon^2).
$$


> [!important] Essentially:
> $$ f(r)=f_0+f_2 r^2+O(r^4)
\quad\Longrightarrow\quad
\left(\partial_{rr}+\frac{1}{r}\partial_r\right)f=4f_2+O(r^2).
$$

