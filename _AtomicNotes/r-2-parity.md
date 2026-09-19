# Why $\sigma_{rr}-\sigma_{\theta\theta}=O(r^2)$

A smooth stress tensor has a unique value at the axis, even though the radial and azimuthal basis vectors depend on the direction of approach. Rotational symmetry therefore makes the radial and hoop stresses equal at $r=0$. Smoothness also determines how quickly their difference can grow away from the axis.

We assume a smooth, symmetric stress tensor whose Cartesian components admit a Taylor expansion near the axis. The field is axisymmetric: rotating the position about $z$ rotates its vector and tensor components accordingly. All powers of $r$ below are dimensional Taylor powers.

## 1. Establish parity on a line through the axis

Take the line $y=0$ and rotate it by $\pi$ about $z$. This maps $x$ to $-x$. A scalar and an axial vector component are unchanged by this rotation, whereas a transverse vector component changes sign. Thus, for an axisymmetric velocity and pressure,

$$
v_z=v_0+r^2v_2+\cdots,
\qquad
p=p_0+r^2p_2+\cdots,
\qquad
v_r=ru_1+r^3u_3+\cdots.
$$

Here, even and odd parity refer to smooth continuation along a signed transverse coordinate through the axis; the cylindrical radius itself is nonnegative. [[continuity-slender-jet|Continuity]] then relates the radial-velocity coefficients to axial derivatives, giving $u_1=-v_0'/2$ and $u_3=-v_2'/4$.

## 2. Use rotational symmetry at the axis

At $r=0$, a symmetric transverse stress tensor invariant under every rotation must be proportional to the identity. Hence

$$
\sigma_{xx}(0)=\sigma_{yy}(0),\qquad \sigma_{xy}(0)=0,
$$

or, in cylindrical components,

$$
\sigma_{rr}(0)=\sigma_{\theta\theta}(0).
$$

The mixed transverse-axial components also vanish at the axis because no nonzero transverse vector is invariant under all rotations.

## 3. Determine the first allowed difference

On the positive $x$-axis, $\sigma_{rr}=\sigma_{xx}$ and $\sigma_{\theta\theta}=\sigma_{yy}$. A rotation by $\pi$ changes the sign of each transverse basis vector, so the two signs cancel in a transverse rank-two tensor component. Both $\sigma_{xx}(x,0)$ and $\sigma_{yy}(x,0)$ are therefore even functions of $x$.

Their Taylor series have equal constant terms and no linear terms. We can write

$$
\sigma_{rr}=\Sigma_0+\Sigma_2r^2+\Sigma_4r^4+\cdots,
\qquad
\sigma_{\theta\theta}=\Sigma_0+\Theta_2r^2+\Theta_4r^4+\cdots.
$$

Subtracting gives

$$
\boxed{\sigma_{rr}-\sigma_{\theta\theta}=(\Sigma_2-\Theta_2)r^2+O(r^4).}
$$

The difference may vanish faster, but it cannot start at $O(1)$ or $O(r)$ under these smoothness assumptions. Continuity at the axis alone would not establish the quadratic ordering.

## 4. Check the Cartesian representation

For the meridionally reflection-symmetric stress used in the slender-jet model, $\sigma_{r\theta}=\sigma_{\theta z}=0$. Its transverse block is

$$
\boldsymbol\sigma_\perp
=\sigma_{rr}\boldsymbol e_r\otimes\boldsymbol e_r
+\sigma_{\theta\theta}\boldsymbol e_\theta\otimes\boldsymbol e_\theta,
$$

where $\boldsymbol e_r=(\cos\theta,\sin\theta)$ and $\boldsymbol e_\theta=(-\sin\theta,\cos\theta)$. Therefore,

$$
\sigma_{xy}
=(\sigma_{rr}-\sigma_{\theta\theta})\sin\theta\cos\theta
=(\sigma_{rr}-\sigma_{\theta\theta})\frac{xy}{r^2}.
$$

Substituting the quadratic difference gives

$$
\sigma_{xy}=(\Sigma_2-\Theta_2)xy+O(r^4),
$$

which is smooth at the origin. The directional factor $xy/r^2$ is thus cancelled by the radial dependence established in step 3.

The reflection assumption removes azimuthal shear away from the axis. Axisymmetry and a swirl-free velocity alone do not impose that condition on an arbitrary prescribed polymer stress. The regularity of the remaining polymer components, and their contribution to momentum, are developed in [[polymeric-stress-regularity-slender-jet|the polymer-stress note]].
