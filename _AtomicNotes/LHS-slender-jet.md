---
publish: true
---
# LHS of the Slender-Jet Axial Equation

The axial velocity of a slender jet is nearly uniform across each section. Radial advection is therefore small at leading order, but it contributes at the same order as the first correction to axial advection. We calculate both terms before truncating the acceleration.

Use dimensional $r$ and $z$, with primes denoting $\partial_z$. The expansions from [[continuity-slender-jet|continuity]] are

$$
v_z=v_0+r^2v_2+O(r^4),
\qquad
v_r=-\frac{r}{2}v_0'-\frac{r^3}{4}v_2'+O(r^5).
$$

Here, $O(r^n)$ denotes the omitted Taylor powers with their dimensional coefficients. Under the slender ordering $r/L=O(\varepsilon)$ and slow axial variation, $r^2v_2$ is a relative $O(\varepsilon^2)$ velocity correction.

## 1. Calculate the local acceleration

Differentiating at fixed position gives

$$
\partial_tv_z=\partial_tv_0+r^2\partial_tv_2+O(r^4).
$$

No steady-flow assumption has been made. Both time derivatives remain in their respective coefficient equations.

## 2. Calculate axial advection

Since

$$
\partial_zv_z=v_0'+r^2v_2'+O(r^4),
$$

the axial advective term is

$$
v_z\partial_zv_z
=v_0v_0'+r^2\left(v_0v_2'+v_2v_0'\right)+O(r^4).
$$

The second-order coefficient contains both the advection of $v_2$ by $v_0$ and the product $v_2v_0'$.

## 3. Calculate radial advection

The radial gradient of axial velocity is

$$
\partial_rv_z=2rv_2+O(r^3).
$$

Multiplying by the radial velocity gives

$$
v_r\partial_rv_z
=\left(-\frac{r}{2}v_0'+O(r^3)\right)
\left(2rv_2+O(r^3)\right)
=-r^2v_0'v_2+O(r^4).
$$

This cancels the $r^2v_2v_0'$ term from axial advection.

## 4. Collect the acceleration

Adding the three contributions gives

$$
\boxed{
\partial_tv_z+v_r\partial_rv_z+v_z\partial_zv_z
=\partial_tv_0+v_0v_0'
+r^2\left(\partial_tv_2+v_0v_2'\right)+O(r^4).
}
$$

Multiplying by the density $\rho$ gives the inertial terms in the momentum equation. The $r^0$ coefficient is $\rho(\partial_tv_0+v_0v_0')$, as used in [[slender-jets-VE-order-0|the leading-order model]]. The $r^2$ coefficient is $\rho(\partial_tv_2+v_0v_2')$, as used in (M2) of [[slender-jets-VE-order-2|the second-order hierarchy]]. Dropping radial advection before collecting this coefficient would leave a spurious $v_2v_0'$ term.
