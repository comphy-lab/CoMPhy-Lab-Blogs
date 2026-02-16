---
modified: 2026-02-16T20:29:41+00:00
created: 2026-02-16T19:07:08+00:00
---
# Leading-Order Dynamic BC in a Slender Jet

Leading-order free-surface stress balances (normal and tangential) used in [[polymeric-stress-regularity-slender-jet|Slender jet momentum equations]].

Use cylindrical coordinates $(r,z)$, axisymmetry, no swirl, interface $r=h(z,t)$.

Total liquid stress:
$$
\boldsymbol{\sigma}=-p\,\boldsymbol{I}+2\eta\,\boldsymbol{D}+\boldsymbol{\sigma}_p.
$$

With passive gas outside, $\boldsymbol{\sigma}^{\mathrm{out}}=-p_a\boldsymbol{I}$, and constant surface tension $\gamma$,
$$
(\boldsymbol{\sigma}-\boldsymbol{\sigma}^{\mathrm{out}})\cdot\boldsymbol{n}=-\gamma\kappa\,\boldsymbol{n}.
$$

#### Projections:
$$
\boldsymbol{n}\cdot\boldsymbol{\sigma}\cdot\boldsymbol{n}=-p_a-\gamma\kappa,
\qquad
\boldsymbol{t}\cdot\boldsymbol{\sigma}\cdot\boldsymbol{n}=0.
$$

#### Geometry:
$$
\boldsymbol{n}=\frac{\boldsymbol{e}_r-h_z\boldsymbol{e}_z}{\sqrt{1+h_z^2}},
\qquad
\boldsymbol{t}=\frac{h_z\boldsymbol{e}_r+\boldsymbol{e}_z}{\sqrt{1+h_z^2}},
\qquad
\kappa=\frac{1}{h}+O(\varepsilon^2),
\qquad
h_z=O(\varepsilon).
$$

#### Long-wave fields:

$$
v_z(r,z,t)=v_0(z,t)+\varepsilon^2 r^2 v_2(z,t)+\cdots,
$$
$$
v_r(r,z,t)=-\frac{1}{2}v_0'(z,t)\,r-\frac{1}{4}\varepsilon^2 v_2'(z,t)\,r^3+\cdots,
$$
See: [[continuity-slender-jet|Continuity equation in slender jet]]

$$
\sigma_{p,rr}=\Sigma_{rr}(z,t)+O(\varepsilon^2 r^2),
\quad
\sigma_{p,zz}=\Sigma_{zz}(z,t)+O(\varepsilon^2 r^2),
\quad
\sigma_{p,rz}=r\,S(z,t)+O(\varepsilon^2 r^3).
$$

See: [[polymeric-stress-regularity-slender-jet|Polymeric stress in slender jet]]

Needed derivatives at $r=h$:
$$
\partial_r v_r=-\frac{1}{2}v_0'+O(\varepsilon^2),
\qquad
\partial_z v_z=v_0'+O(\varepsilon^2),
$$
$$
\partial_r v_z+\partial_z v_r=-\frac{1}{2}h\,v_0''+2h\,v_2+O(\varepsilon^2).
$$

## 1) Leading-order normal stress balance

At small slope, $\boldsymbol{n}\approx\boldsymbol{e}_r$, so
$$
\boldsymbol{n}\cdot\boldsymbol{\sigma}\cdot\boldsymbol{n}
=-p+2\eta\,\partial_r v_r+\sigma_{p,rr}+O(\varepsilon^2).
$$

Using $\boldsymbol{n}\cdot\boldsymbol{\sigma}\cdot\boldsymbol{n}=-p_a-\gamma\kappa$:
$$
p=p_a+\gamma\kappa+2\eta\,\partial_r v_r+\sigma_{p,rr}+O(\varepsilon^2).
$$

Therefore
$$
p_0(z,t)=p_a+\frac{\gamma}{h}-\eta v_0'+\Sigma_{rr}+O(\varepsilon^2).
$$

If pressure is gauged by $p_a=0$:
$$
\boxed{p_0=\frac{\gamma}{h}-\eta v_0'+\Sigma_{rr}+O(\varepsilon^2).}
$$

## 2) Leading-order tangential stress balance

At small slope, expand $\boldsymbol{t}\cdot\boldsymbol{\sigma}\cdot\boldsymbol{n}=0$ to first nontrivial order:
$$
\eta\left[(\partial_r v_z+\partial_z v_r)+2h_z(\partial_r v_r-\partial_z v_z)\right]
+\boldsymbol{t}\cdot\boldsymbol{\sigma}_p\cdot\boldsymbol{n}
=O(\varepsilon^2).
$$

Newtonian contribution:
$$
\partial_r v_z+\partial_z v_r=-\frac{1}{2}h v_0''+2h v_2+O(\varepsilon^2),
$$

$$
2h_z(\partial_r v_r-\partial_z v_z)=-3v_0'h'+O(\varepsilon^2),
$$
so
$$
\eta\left(-3v_0'h'-\frac{1}{2}h v_0''+2h v_2\right)+\boldsymbol{t}\cdot\boldsymbol{\sigma}_p\cdot\boldsymbol{n}
=O(\varepsilon^2).
$$

Polymer projection at small slope:
$$
\boldsymbol{t}\cdot\boldsymbol{\sigma}_p\cdot\boldsymbol{n}
=\sigma_{p,rz}(h)+h'\big(\Sigma_{rr}-\Sigma_{zz}\big)+O(\varepsilon^2).
$$

Hence
$$
\eta\left(-3v_0'h'-\frac{1}{2}h v_0''+2h v_2\right)
+\sigma_{p,rz}(h)
+h'\big(\Sigma_{rr}-\Sigma_{zz}\big)
=O(\varepsilon^2).
$$

Define $\Delta\Sigma\equiv\Sigma_{zz}-\Sigma_{rr}$, then equivalently
$$
\eta\left(-3v_0'h'-\frac{1}{2}h v_0''+2h v_2\right)
+\sigma_{p,rz}(h)-\Delta\Sigma\,h'
=O(\varepsilon^2).
$$

