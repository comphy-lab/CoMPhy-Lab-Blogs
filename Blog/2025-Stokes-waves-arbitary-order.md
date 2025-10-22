---
modified: 2025-10-07T06:05:52+01:00
created: 2024-12-24T18:10:43+01:00
tags:
  - stokeswaves
priority: good to have 🍀
status: Working 🏗️
publish: false
---
# Stokes waves of arbitrary order

Vatsal Sanjay ([https://comphy-lab.org](https://comphy-lab.org)),
CoMPhy Lab, Physics of Fluids, Univ. Twente

$$\eta(x)=a\sum_{n=1}^{N}\left[c_{n}\,\epsilon^{n}\,\cos\bigl(nkx\bigr)\right],$$
where the function $c_n$ is 

$$
c_{n} 
= \frac{(2n - 1)!!}{2^{n-1}\,n!}.$$

```c
/**
* @brief Calculates the Stokes coefficient for nth order wave
* @param n Order of the wave
* @return Coefficient value based on double factorial calculation
*/

double stokes_coefficient (int n) {

if (n == 1) return 1.0;
int k = 2*n - 1;

double double_factorial = 1.0;
for (int i = 1; i <= k; i += 2)
double_factorial *= i;

return double_factorial / (pow(2,(n-1)) * tgamma(n+1));

}

/**
* @brief Calculates the surface elevation for Stokes wave
* @param x Horizontal position
* @param a Wave amplitude
* @param k Wave number
* @param order Order of Stokes expansion
* @return Surface elevation at position x
*/

double eta_stokes (double x, double a, double k, int order) {

double eta = 0.0;
double epsilon = k*a;

for (int n = 1; n <= order; n++) {
double c = stokes_coefficient(n);
eta += c * pow(epsilon, n)*cos(n*k*x);
}

return eta * a;

}
```

## Executive Summary of Fenton's papers '90 and '99:

### Problem Statement
How to describe nonlinear waves? 
- With a particular emphasis on extending the accuracy and applicability of wave theories for ocean engineering. 
The primary focus is to address periodic standing waves and Stokes waves, which are critical for understanding wave interactions in shallow and deep water regimes. Central to this is determining coefficients and analytical solutions for arbitrary-order expansions.

### Methodology
- [[fentonNumericalMethodsNonlinear1999|Fenton (1999)]] emphasizes numerical solutions for nonlinear problems, including high-order Fourier methods for wave field expansions and their convergence properties. [@fentonNumericalMethodsNonlinear1999]
- [[fentonNonlinearWaveTheories1990|Fenton (1990)]] extends nonlinear wave theories with cnoidal and Stokes theories to fifth-order expansions, using Fourier techniques for enhanced computational accuracy. [@fentonNonlinearWaveTheories1990] 

![schematic-of-problem](_Media/Stokes%20waves_arbitary%20order-20241225034827809.png)

Both employ polynomial and trigonometric expansions for solving boundary conditions and streamline the application of nonlinear theories in various wave contexts.

### Key Findings
1. **Equation of Arbitrary Order Standing Waves**:
   The governing expressions for surface elevation and velocity components leverage Fourier series expansions or hyperbolic functions, depending on the wave height and wavelength regime:
   - Standing wave elevation, $\eta(x, t)$, approximates multiple harmonics where coefficients stem from iterative numerical techniques.
   - Stokes coefficients for arbitrary-order expansions use factorial-based formulas for precise amplitude corrections.

2. **Numerical Accuracy**:
   - Both methods demonstrate high accuracy when wave heights and wavelengths align with their regimes of validity, but overlap regions where neither theory performs optimally exist.
   - The fifth-order Stokes expansion offers excellent performance for waves with moderate wavelengths, while cnoidal approximations excel for shallow water waves.

### Implications
The work advances computational methods to extend the precision of nonlinear wave predictions, enabling:
- Safer and more cost-effective coastal structure designs.
- Improved models for wave propagation over complex seabeds.

### Recommendations
One option is to use **mixed-order Stokes-cnoidal** expansions for transitional regimes and refine computational methods for boundary conditions in breaking wave scenarios.

### Conclusion
Both approaches present robust solutions for their respective regimes but highlight the need for further refinement in transitional wavelength-depth conditions.

---

## Key Takeaways

- 🌊 **Stokes Theory Excellence**: Best for deep water waves where wavelength-depth ratios are small.
- 🌍 **Cnoidal Theory for Shallow Water**: Ideal for long waves with large wavelength-depth ratios.
- 🔗 **Overlap Regions**: Transitional wave conditions (e.g., intermediate wavelength-depth ratios) challenge accuracy for both theories.
- 🧮 **Numerical Methods' Power**: Fourier approximations enhance precision across nonlinear wave calculations.
- 📈 **Wave Breaking Limits**: Experiments suggest practical wave heights rarely approach theoretical maxima.
- 👨 **Streamline Accuracy**: Velocity and pressure fields computed with Stokes and cnoidal methods align closely with Fourier-derived benchmarks.

**One-line summary**: High-order Stokes and cnoidal theories provide accurate tools for nonlinear wave modeling, but computational refinements remain necessary for transitional regimes.

---

## Additional Details

### Arbitrary Order Standing Wave Equation
A general formula for Stokes coefficients of the \(n\)-th order wave, as described in the texts, resembles:

```c
double stokes_coefficient(int n) {
  if (n == 1) return 1.0;
  double double_factorial = 1.0;
  for (int i = 1; i <= 2*n - 1; i += 2)
    double_factorial *= i;
  return double_factorial / (pow(2, n - 1) * tgamma(n + 1));
}
```

And for the surface elevation of Stokes waves:

```c
double eta_stokes(double x, double a, double k, int order) {
  double eta = 0.0;
  double epsilon = k * a;
  for (int n = 1; n <= order; n++) {
    double c = stokes_coefficient(n);
    eta += c * pow(epsilon, n) * cos(n * k * x);
  }
  return eta * a;
}
```

These computations involve harmonic terms, with coefficients determined iteratively or analytically, ensuring convergence and numerical stability.

### For dispersion relation in higher order

For the 0th order: 
$$\omega_0 = \sqrt{gk},$$

Corrections for higher order gives

$$\frac{\omega}{\omega_0} = 1 + \tfrac12\epsilon^{2} + \tfrac38\epsilon^{4} + \tfrac{5}{16}\epsilon^{6} + \tfrac{35}{128}\epsilon^{8} +\dots$$

* This is order `8`.
- The trick here is how to calculate higher order coefficients. 
- Ref. 
	- Stokes (1847), for the original perturbation approach [@stokes1847theory]
	- Longuet-Higgins [@longuet-higginsNewIntegralRelations1984] and other related works. 
	- Lamb (1932): See Chapter 9 (especially art. 246–250). Although Lamb typically writes out the celerity expansions $(c = \omega / k)$, the frequency version is equivalent. [@Lamb1932]
	- **Most Importantly** 

$$c^2 = 1 + h^2 + \frac{4}{3}h^4 + \frac{17}{9}h^6 - \frac{22}{9}h^8 + \dots$$where $h = ak$ [[schwartzComputerExtensionAnalytic1974#^e59b15|page 11]] of [@schwartzComputerExtensionAnalytic1974]. 
High‐order expansions of the Stokes dispersion relation up to ($\epsilon^8$) have been verified numerically by Schwartz (1974). 

-> A good place for review is Annu. Rev. Fluid Mech. by L. W. Schwartz and J. D. Fenton [@schwartzStronglyNonlinearWaves1982]

-> The code at [@sanjayComphylabStandingnonlinearwavesStanding2024] implements the above formulation for calculating the dispersion relation as a function of $ak$. It also uses the initial condition mentioned at the top of this document as the initial condition for the direct numerical simulations. 

![[Stokes waves_arbitary order-20250125232439287.png]]

---
