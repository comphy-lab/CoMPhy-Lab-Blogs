---
modified: 2026-02-18T07:11:23+00:00
created: 2026-02-12T22:58:58+00:00
---
# Viscoelastic Slender Jets

### Parity argument (axis regularity + axisymmetry): 

#### Velocity and pressure

Even powers for $v_z, p$ and odd for $v_r$. 

> [!important] Compact notation: 
> Primes are $\partial_z$:  

Expanding $v_z$ in powers of $r$:
$$
v_z(r,z,t)=v_0(z,t)+\varepsilon^2 r^2 v_2(z,t)+\cdots,  
$$
Using continuity, $v_r$ in the leading order is (see: [[continuity-slender-jet|Continuity equation in slender jet]])
$$
v_r(r,z,t)= -\frac{1}{2}v_0'(z,t)\,r-\frac{1}{4}\varepsilon^2 v_2'(z,t)\,r^3+\cdots,  
$$
$$
p(r,z,t)=p_0(z,t)+\varepsilon^2 r^2 p_2(z,t)+\cdots.  
$$

#### Stress

The Cauchy stress is  
$$
\boldsymbol{\sigma} = -p\boldsymbol{I} + 2\eta \boldsymbol{D} + \boldsymbol{\sigma}_p,  
$$

The momentum balance, free-surface traction balance, and shear-free condition use this $\boldsymbol{\sigma}$.

Expanding polymer stresses consistently with [[polymeric-stress-regularity-slender-jet|axisymmetry/regularity]]:
$$
\sigma_{p,zz}(r,z,t)=\Sigma_{zz}(z,t)+O(\varepsilon^2 r^2),\qquad  
\sigma_{p,rr}(r,z,t)=\Sigma_{rr}(z,t)+O(\varepsilon^2 r^2),  
$$

$$
\sigma_{p,rz}(r,z,t)= r\,S(z,t)+O(\varepsilon^2 r^3).  
$$

> [!note] Hoop stress 
> Regularity also implies $\Sigma_{rr}=\Sigma_{\theta\theta}$ at leading order.

### Governing equations
#### Axial momentum at $O(\varepsilon^0)$

Polymeric stress contribution:

$$
(\nabla\cdot\boldsymbol{\sigma}_p)_z=\partial_z \sigma_{p,zz}+\frac1r\partial_r(r\sigma_{p,rz}).  
$$
Using $\sigma_{p,zz}\approx \Sigma_{zz}(z,t)$ and $\sigma_{p,rz}\approx r S(z,t)$,  
$$
\frac1r\partial_r(r\sigma_{p,rz})=\frac1r\partial_r(r^2 S)=2S.  
$$
Thus the $r^0$ coefficient of the axial equation becomes (why factor 4? See: [[Laplacian-in-axisymmetric-slender-jet|Laplacian in axisymmetric slender jet]]. For full derivation of LHS, see [[LHS-slender-jet|LHS of slender jet momentum]]) 
$$
\rho\left(\partial_t v_0+v_0 v_0'\right)=-p_0'+\eta(4v_2+v_0'')+\Sigma_{zz}'+2S+O(\varepsilon^2).  
$$


#### Kinematic BC: 
See [[continuity-slender-jet|Continuity equation in slender jet]] for details
$$
\partial_t(h^2)+\partial_z(h^2 v_0)=0,  
$$

#### Leading-order stress BCs with polymer normal + shear stresses  

> [!info] See: [[dynamic-BC-slender-jet|Full free surface stress balance]] for details.

Normal traction (leading order, $n\approx e_r$):  
$$
p_0=\frac{\gamma}{h} - \eta v_0' + \Sigma_{rr}+O(\varepsilon^2).  
$$

Tangential traction (leading order, $t\approx e_z$, $n\approx e_r$):  
$$
\underbrace{\eta\Big(-3v_0'h'-\frac12 v_0'' h+2v_2 h\Big)}_{\text{Newtonian part}}  
+\underbrace{\sigma_{p,rz}(h)}_{\approx hS}  
+\underbrace{(\Sigma_{rr}-\Sigma_{zz})h'}_{=-\Delta\Sigma\,h'}  
=O(\varepsilon^2),  
$$
where polymeric “tensile” normal-stress difference is
$$
\Delta\Sigma \equiv \Sigma_{zz}-\Sigma_{rr}.  
$$

#### Combining

Using the tangential stress balance to solve for $v_2$ (substituting $O(\varepsilon^2) \to 0$):  
$$
2\eta v_2 h  
=3\eta v_0'h' +\frac{\eta}{2} v_0'' h -\sigma_{p,rz}(h)+\Delta\Sigma\,h'.  
$$

Next use the normal stress BC for $p_0$:  
$$
p_0'=(\gamma/h)'-\eta v_0''+\Sigma_{rr}'.  
$$

Now substitute into the axial momentum equation and using $\sigma_{p,rz}\approx r S(z,t)$:

$$
\rho\left(\partial_t v_0+v_0 v_0'\right)  
= -\Big(\frac{\gamma}{h}\Big)'  
+3\eta\frac{(h^2 v_0')'}{h^2}  
+\frac{(h^2\Delta\Sigma)'}{h^2}  
+O(\varepsilon^2),  
$$
with $\Delta\Sigma=\Sigma_{zz}-\Sigma_{rr}$. Here, 3 is the Trouton ratio. 

$\Sigma_{rr}=\Sigma_{\theta\theta}$ at leading order (so “hoop” is already accounted for). 

> [!important] 
> What happened to the shear stress $\sigma_{p,rz}$? It enters both (i) the axial momentum equation through $(\nabla\cdot\sigma_p)_z$, and (ii) the tangential traction condition $t\cdot\sigma\cdot n=0$. Those two appearances will cancel.

### Conservative form

Continuity (see: [[continuity-slender-jet|Continuity equation in slender jet]] for details):  
$$
\boxed{\partial_t h^2 + \partial_z(h^2 v_0)=0}
$$

Momentum equation:
$$
\rho(\partial_tv_0 + v_0 v_0')
= -\Big(\frac{\gamma}{h}\Big)' + 3\eta\frac{(h^2 v_0')'}{h^2} + \frac{(h^2\Delta\Sigma)'}{h^2}.  
$$

Multiply by $h^2$:  
$$
\rho h^2(\partial_tv_0 + v_0 v_0')
= -h^2\Big(\frac{\gamma}{h}\Big)' + 3\eta\left(h^2 v_0'\right)' + \left(h^2\Delta\Sigma\right)'.  
$$
Using $h^2(1/h)' = -h'$:  
$$
\rho h^2(\partial_tv_0 + v_0 v_0')
= \gamma\Big(h\Big)' + 3\eta\left(h^2 v_0'\right)' + \left(h^2\Delta\Sigma\right)'.  
$$

On the left hand side:  
$$
\partial_t(h^2 v_0) + (h^2 v_0^2)' = h^2(v_t + v v') \quad\text{if (by continuity equation)}\quad \partial_t(h^2)+(v_0h^2)'=0.  
$$
The conservative momentum equation is  
$$
\rho\left(\partial_t(h^2 v_0) + (h^2 v_0^2)'\right)
= \left(\gamma h + 3\eta h^2 v_0' + h^2\Delta\Sigma\right)'.  
$$
$$
\boxed{  
\rho\left(\partial_t(h^2 v_0) + \partial_z(h^2 v_0^2)\right)
= \partial_z\left[\gamma h + 3\eta h^2 \partial_zv_0 + h^2\left(\sigma_{p,zz}-\sigma_{p,rr}\right)\right].  
}
$$
