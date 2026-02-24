# Why $\sigma_{rr}-\sigma_{\theta\theta}=O(r^2)$

Goal: show the tensor-parity refinement used in [[polymeric-stress-regularity-slender-jet|slender-jet regularity arguments]].

## 1) Scalar/velocity parity reminder

For smooth axisymmetric fields near the axis (also see [[continuity-slender-jet|Continuity equation in slender jet]]),
$$
v_z(r,z,t),\;p(r,z,t)\;\text{are even in }r,
\qquad
v_r(r,z,t)\;\text{is odd in }r.
$$
So
$$
v_z=v_0+v_2 r^2+\cdots,
\qquad
p=p_0+p_2 r^2+\cdots,
\qquad
v_r=u_1 r+u_3 r^3+\cdots.
$$

## 2) Axis regularity for transverse stress

At $r=0$, there is no preferred direction in the $(x,y)$ plane. For a smooth rank-2 tensor this implies transverse isotropy at the axis:
$$
\sigma_{xx}(0)=\sigma_{yy}(0),
\qquad
\sigma_{xy}(0)=0.
$$
In cylindrical components,
$$
\sigma_{rr}(0)=\sigma_{\theta\theta}(0).
$$

## 3) Cartesian-cylindrical relation that enforces $r^2$

For axisymmetric stress with no $r\theta$ component in the local $(\mathbf e_r,\mathbf e_\theta)$ basis,
$$
\boldsymbol\sigma
=\sigma_{rr}\,\mathbf e_r\otimes\mathbf e_r
+\sigma_{\theta\theta}\,\mathbf e_\theta\otimes\mathbf e_\theta.
$$

Using
$$
\mathbf e_r=(\cos\theta,\sin\theta),
\qquad
\mathbf e_\theta=(-\sin\theta,\cos\theta),
$$
one gets
$$
\sigma_{xy}
=(\sigma_{rr}-\sigma_{\theta\theta})\sin\theta\cos\theta
=(\sigma_{rr}-\sigma_{\theta\theta})\frac{xy}{x^2+y^2}.
$$

Now require $\sigma_{xy}(x,y)$ to be smooth at $(0,0)$. Since
$$
\frac{xy}{x^2+y^2}=O(1)
$$
but depends on direction, smoothness at the origin forces the prefactor to vanish at least as $x^2+y^2=r^2$:
$$
\sigma_{rr}-\sigma_{\theta\theta}=O(r^2).
$$

So the difference cannot start at $O(1)$ or $O(r)$; it starts at even order $r^2$.

## 4) Equivalent expansion form

Write
$$
\sigma_{rr}=\Sigma_0+\Sigma_2 r^2+\Sigma_4 r^4+\cdots,
\qquad
\sigma_{\theta\theta}=\Sigma_0+\Theta_2 r^2+\Theta_4 r^4+\cdots,
$$
then
$$
\sigma_{rr}-\sigma_{\theta\theta}=(\Sigma_2-\Theta_2)r^2+O(r^4)=O(r^2).
$$