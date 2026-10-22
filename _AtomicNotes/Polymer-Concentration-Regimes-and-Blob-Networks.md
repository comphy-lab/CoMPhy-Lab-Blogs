---
date: 2025-10-31
status: done ✅
publish: true
---
# Polymer Concentration Regimes and Blob Networks

## Executive Summary

$G = n k_B T$ is the ideal-network result, with $n$ the number of elastically active strands per unit volume; real networks differ from it by factors of order one. Writing $\xi$ for the spacing of the elastic strands gives its scaling form $G \sim k_B T / \xi^3$. In a **semi-dilute polymer solution**, $k_B T/\xi^3$ with $\xi$ the correlation length (blob size) sets the osmotic pressure. The plateau modulus of an *entangled* solution scales the same way with concentration but is about $(\xi/a)^2 \approx 10^{-2}$ of it, where $a \approx 10\,\xi$ is the tube diameter. Using the relation therefore requires distinguishing between concentration regimes and recognising $\xi$ as a correlation length, not the Kuhn length of individual chains.

Key points:
- **Dilute regime** ($c < c^*$): Isolated chains, no network, $G \sim k_B T / \xi^3$ does NOT apply
- **Semi-dilute regime** ($c^* < c < c^{**}$): Overlapping chains form a mesh of correlation blobs of size $\xi$. They entangle only above $c_e \approx 10\,c^*$ (good solvent): below $c_e$ the terminal modulus is $k_B T$ per chain, above it $k_B T$ per entanglement strand
- **Concentrated regime** ($c > c^{**}$): $\xi$ has shrunk to the thermal blob size and chains are ideal on all length scales
- The mesh size $\xi$ is the **correlation length** (spacing between chains), not the Kuhn segment length, and about ten times smaller than the entanglement spacing $a$
- Individual Kuhn chains do not form networks and do not obey this scaling

---

## 1. Polymer Concentration Regimes

### 1.1 The Overlap Concentration $c^*$

A fundamental transition in polymer solution physics occurs at the **overlap concentration** $c^*$, defined as the concentration at which polymer coils begin to interpenetrate.

For a polymer chain with $N$ Kuhn monomers of length $b$:
- Coil size (end-to-end distance): $R \sim b N^{\nu}$, where $\nu \approx 0.588$ (good solvent) or $\nu = 0.5$ (theta solvent)
- Volume occupied by one coil: $V_{\text{coil}} \sim R^3$
- Overlap concentration: $c^* \sim \frac{N m_{\text{mon}}}{R^3} \sim \frac{N}{b^3 N^{3\nu}} \sim N^{1-3\nu}$

In good solvents ($\nu = 3/5$):
$$c^* \sim N^{-4/5}$$

Physical interpretation: At $c < c^*$, chains are isolated; at $c > c^*$, chains overlap and begin to interact.

Defining $c^*$ with the radius of gyration $R_g$ instead of the end-to-end distance gives a value roughly ten times higher, close to the entanglement concentration $c_e$; the two are easily confused (Colby 2010).

### 1.2 Concentration Regimes

| Regime | Concentration Range | Chain Behaviour | Network | Modulus |
|--------|-------------------|----------------|-------------------|-------------|
| **Dilute** | $c \ll c^*$ | Isolated coils | None | No plateau |
| **Semi-dilute, unentangled** | $c^* < c < c_e$ | Overlapping, forming blobs | None | $G \approx c_n k_B T / N$ ($k_B T$ per chain) |
| **Semi-dilute, entangled** | $c_e < c < c^{**}$ | Random walk of blobs | Temporary entanglements, spacing $a \approx 10\,\xi$ | $G_e \approx k_B T / (a^2 \xi)$ |
| **Concentrated** | $c \gg c^{**}$ | Ideal on all length scales | Temporary entanglements | $G_e$ rises towards the melt value |

where $c_n$ is the number of monomers per unit volume, $c_e \approx 10\,c^*$ in good solvent (Colby 2010), and $c^{**}$ is the concentration at which $\xi$ has shrunk to the thermal blob size.

---

## 2. Blob Physics in the Semi-Dilute Regime

### 2.1 What is a Blob?

In the semi-dilute regime, overlapping polymer chains create a mesh with a characteristic **correlation length** $\xi$ called the **blob size**.

Physical picture:
- Inside a blob (length scale $< \xi$): the chain behaves as in dilute solution (self-avoiding in good solvent)
- Beyond a blob (length scale $> \xi$): neighbouring chains screen excluded volume and hydrodynamic interactions, and each chain is a random walk of blobs
- The blob size $\xi$ decreases with increasing concentration

### 2.2 Blob Size Scaling

From de Gennes' scaling argument (Daoud et al. 1975), the correlation length equals the coil size at overlap and shrinks as the concentration rises:

$$\xi \sim R \left(\frac{c^*}{c}\right)^{\nu/(3\nu-1)} \sim b\,\phi^{-\nu/(3\nu-1)}$$

where $\phi$ is the polymer volume fraction.

For $\nu = 3/5$ (good solvent):
$$\xi \sim R \left(\frac{c^*}{c}\right)^{3/4} \sim c^{-3/4}$$

With $\nu = 0.588$ the exponent is $-0.76$, as measured by neutron scattering (Colby 2010, Fig. 5).

Key insight: As concentration increases above $c^*$, the mesh size $\xi$ decreases from $\xi \approx R$ at overlap.

### 2.3 Monomers and Blobs per Chain

Each blob holds

$$g \sim \left(\frac{\xi}{b}\right)^{1/\nu} \sim N \left(\frac{c}{c^*}\right)^{-1/(3\nu-1)}$$

monomers, so a chain is a string of $N/g$ blobs. Beyond $\xi$ this string is a random walk, so the chain size in semi-dilute solution is

$$R \approx \xi \left(\frac{N}{g}\right)^{1/2}$$

---

## 3. Elasticity of Semi-Dilute Solutions

### 3.1 What $k_B T / \xi^3$ Measures

Each correlation volume $\xi^3$ carries a free energy of order $k_B T$, so the osmotic pressure is

$$\Pi \approx \frac{k_B T}{\xi^3}$$

(Colby 2010, Eq. 5). This is also the stress relaxation modulus at the relaxation time of a single blob. The long-time elasticity depends on entanglement:

- **Unentangled** ($c^* < c < c_e$): the blobs of a chain relax by Rouse motion, and the terminal modulus is $k_B T$ per chain, $G \approx c_n k_B T / N$
- **Entangled** ($c > c_e$): the plateau modulus is $k_B T$ per entanglement strand. Each strand is a random walk of blobs spanning the tube diameter $a$, so it occupies a volume $a^2 \xi$ and

$$G_e \approx \frac{k_B T}{a^2 \xi} = \frac{k_B T}{\xi^3} \left(\frac{\xi}{a}\right)^2$$

(Colby 2010, Eq. 18). In good solvent $a \propto \xi$; for hydrogenated polybutadiene in alkanes $a \approx 10\,\xi$. The plateau modulus therefore follows $k_B T / \xi^3$ in its concentration dependence but is about a hundred times smaller.

With the scaling $\xi \sim c^{-3/4}$ (good solvent):
$$G_e \sim c^{9/4}$$

Measured plateau moduli follow $c^{2.3}$ (Colby 2010, Fig. 12).

### 3.2 Concentration Dependence

In good solvent, where $a \propto \xi$:

$$G_e \sim \frac{k_B T}{\xi^3} \sim k_B T \cdot c^{3\nu/(3\nu-1)}$$

For good solvents ($\nu = 3/5$):
$$\boxed{G_e \sim c^{9/4}}$$

For theta solvents the tube diameter scales as $a \sim c^{-2/3}$ while $\xi \sim c^{-1}$, so:
$$\boxed{G_e \sim c^{7/3}}$$

The $c^3$ law of $k_B T / \xi^3$ in theta solvent applies to the osmotic pressure, not the modulus. Measured plateau moduli in good and theta solvents both follow a slope close to 2.3 (Colby 2010, Eq. 19 and Fig. 12).

---

## 4. When Does $G \sim k_B T / \xi^3$ NOT Apply?

### 4.1 Dilute Solutions ($c < c^*$)

In dilute solutions:
- Chains do not overlap
- No network structure forms
- The solution is a viscoelastic liquid: each chain contributes $k_B T$ to the modulus at short times, and this relaxes through the chain's Zimm modes (Colby 2010, Eq. 9)
- Individual chains can be characterised by their own $R_g$, but there is no plateau modulus

Result: The relation $G \sim k_B T / \xi^3$ is **not applicable**.

### 4.2 Individual Kuhn Chains

A **Kuhn segment** is the fundamental statistical unit of a polymer chain (contour length $l_K$, Kuhn length).

Why $G \sim k_B T / \xi^3$ doesn't work:
- A single Kuhn chain does not form a network
- The Kuhn length $l_K$ is a molecular parameter, not a mesh size
- Without crosslinks or entanglements, there is no plateau modulus
- Unconnected chains have no equilibrium modulus: the solution flows

The confusion arises because both $\xi$ (mesh/blob size) and $l_K$ (Kuhn length) are length scales in polymer physics, but they describe completely different physics:
- $l_K$: molecular property of a single chain
- $\xi$: emergent collective length scale in a network

### 4.3 Concentrated Solutions and Melts ($c > c^{**}$)

In concentrated solutions and melts:
- Chains are ideal on all length scales
- Entanglement physics dominates (reptation)
- The plateau modulus is $k_B T$ per entanglement strand, $G_N^0 \approx \rho R T / M_e$, where $\rho$ is the polymer mass density and $M_e$ the molar mass of an entanglement strand

The blob picture no longer applies, but the plateau modulus continues smoothly: for polybutadiene, $G_e \propto \phi^{2.3}$ holds from $\phi \approx 0.02$ up to the melt (Colby 2010).

---

## 5. Physical Distinction: $\xi$ vs $l_K$

| Quantity | Definition | Physical Meaning | Concentration Dependence |
|----------|------------|------------------|-------------------------|
| **Kuhn length** $l_K$ | Molecular parameter | Statistical segment length; twice the persistence length for a worm-like chain | Independent of $c$ (intrinsic property) |
| **Blob size** $\xi$ | Correlation length | Mesh size, spacing between chains | $\xi \sim c^{-3/4}$ (semi-dilute, good solvent) |
| **Tube diameter** $a$ | Entanglement spacing | Lateral confinement of a chain by its neighbours | $a \approx 10\,\xi$ (entangled, good solvent) |
| **Radius of gyration** $R_g$ | Root-mean-square distance of the monomers from the centre of mass | Size of isolated coil | $R_g \sim N^{\nu} l_K$ (dilute) |

Critical point: $\xi \approx R$ at $c^*$ and falls below the coil size as the concentration rises, but stays larger than $l_K$ throughout the semi-dilute regime. In a good solvent, $\xi \approx 2$–$11$ nm for volume fractions $\phi = 0.1$–$0.01$ (hydrogenated polybutadiene in alkanes; Colby 2010, Fig. 11), while $l_K \approx 1$–$2$ nm for flexible polymers.

---

## 6. Experimental Signatures

### 6.1 Rheological Measurements

Hydrodynamic interactions are screened beyond $\xi$: Zimm dynamics inside a blob, Rouse dynamics for the chain of blobs. Scaling predictions for good solvent ($\nu = 0.588$; Colby 2010, Tables 1 and 2):

| Quantity | Unentangled ($c^* < c < c_e$) | Entangled ($c > c_e$) |
|----------|-------------------------------|-----------------------|
| Longest relaxation time | $\tau_{\text{chain}} \sim N^2 c^{0.31}$ | $\tau_{\text{rep}} \sim N^3 c^{1.6}$ |
| Terminal modulus | $G \approx c_n k_B T / N \sim c$ | $G_e \sim c^{2.3}$ |
| Polymer contribution to viscosity | $\eta - \eta_s \sim N c^{1.3}$ | $\eta - \eta_s \sim N^3 c^{3.9}$ |

The measured correlation length and plateau modulus follow these predictions (Colby 2010, Figs. 5 and 12).

### 6.2 Scattering

Small-angle neutron and X-ray scattering measure the correlation length $\xi$ directly from the structure factor:
- In good solvent, $S(q) = S(0)/[1 + (q\xi)^{1/\nu}]$ with $1/\nu \approx 1.7$; for $\nu = 1/2$ (theta solvent) this is the Ornstein–Zernike form $S(0)/(1 + q^2 \xi^2)$ (Colby 2010, Eqs. 7 and 8)
- Extract $\xi$ from the $q$-dependence
- Verify $\xi \sim c^{-3/4}$ scaling (measured exponent $-0.76$)

---

## 7. Crosslinked vs Entangled Networks

### 7.1 Permanent Crosslinks (Chemical Gels)

For chemically crosslinked networks (rubbers):
- Crosslinks are permanent (covalent bonds)
- Network structure is frozen
- Still entropic elasticity: $G = n k_B T$, with $n$ the number of elastically active strands per unit volume (about two per tetrafunctional crosslink)
- Writing $\xi \equiv n^{-1/3}$ for the spacing of elastic strands gives $G = k_B T / \xi^3$ for networks crosslinked at any concentration; this $\xi$ is a strand spacing, not in general the correlation length

### 7.2 Temporary Entanglements (Entangled Solutions)

For entangled solutions ($c > c_e$):
- Entanglements are temporary (topological constraints)
- Network structure is dynamic (chains reptate out of their tubes)
- Entropic elasticity on timescales shorter than the reptation time
- The elastic strand spacing is the tube diameter $a \approx 10\,\xi$, not $\xi$
- $G_e \approx k_B T / (a^2 \xi)$, which scales like $k_B T / \xi^3$ in good solvent

Such solutions are viscoelastic liquids, not gels. A physical gel, such as gelatin, has reversible junctions (helices or crystallites, for example) and does not flow.

Key difference: Permanent vs temporary network structure affects long-time behaviour (elastic solid vs viscoelastic liquid), but in both cases the short-time elasticity is $k_B T$ per elastic strand.

---

## 8. Summary: When to Use $G \sim k_B T / \xi^3$

Use this relation:
1. For a **crosslinked network**, with $\xi \equiv n^{-1/3}$ the spacing of elastic strands
2. For the **osmotic pressure** of a semi-dilute solution ($c^* < c < c^{**}$), with $\xi$ the correlation length
3. For the **concentration dependence** of the plateau modulus of an entangled semi-dilute solution ($c > c_e \approx 10\,c^*$, good solvent), remembering that $G_e \approx (k_B T/\xi^3)(\xi/a)^2$ is about a hundred times smaller
4. When the elasticity is **entropic**: at fixed structure the modulus is proportional to $T$

Do NOT use this relation for:
1. **Dilute solutions** ($c < c^*$): no network structure
2. **Unentangled semi-dilute solutions** ($c^* < c < c_e$): the terminal modulus is $k_B T$ per chain
3. **Individual Kuhn chains**: no collective elasticity
4. **Concentrated solutions and melts** without the entanglement spacing: there $G_N^0 \approx \rho R T / M_e$
5. Systems where $\xi$ is neither the correlation length nor the strand spacing (e.g. using the Kuhn length incorrectly)

---

## 9. Worked Example: Polyacrylamide (PAM) in Water

Consider a polyacrylamide solution, treating water as a good solvent ($\nu = 3/5$):
- Molar mass: $M = 10^6$ g/mol; with the acrylamide monomer at 71 g/mol, $N_{\text{mon}} \approx 1.4 \times 10^4$
- Contour length: about $0.25$ nm per monomer, so $L \approx 3.5\,\mu\text{m}$
- Kuhn length: take $l_K \approx 2$ nm (an assumed value), giving $N_K = L/l_K \approx 1.8 \times 10^3$ Kuhn segments

Coil size and overlap concentration:
$$R \sim l_K N_K^{3/5} \approx 2\,\text{nm} \times 88 \approx 180\,\text{nm}$$
$$c^* \sim \frac{M}{N_A R^3} \approx \frac{10^6\,\text{g/mol}}{6.0 \times 10^{23}\,\text{mol}^{-1} \cdot (1.8 \times 10^{-5}\,\text{cm})^3} \approx 0.3\,\text{g/L}$$

At $c = 10\,c^* \approx 3$ g/L (semi-dilute):
$$\xi \sim R \left(\frac{c^*}{c}\right)^{3/4} \approx 180\,\text{nm} \times 0.18 \approx 32\,\text{nm}$$

Each blob then holds $g \sim N_K (c/c^*)^{-5/4} \approx 100$ Kuhn segments, so a chain is a string of about 18 blobs.

Note: $\xi \approx 32$ nm $\gg l_K = 2$ nm (blob size much larger than Kuhn segment).

Moduli:
$$\frac{k_B T}{\xi^3} \approx \frac{4.1 \times 10^{-21}\,\text{J}}{(3.2 \times 10^{-8}\,\text{m})^3} \approx 1 \times 10^{2}\,\text{Pa}$$

This sets the osmotic pressure. The concentration is close to $c_e \approx 10\,c^*$, so the solution is at most weakly entangled, and its terminal modulus is about $k_B T$ per chain:
$$G \approx \frac{c R T}{M} \approx \frac{3\,\text{kg/m}^3 \times 2.5 \times 10^3\,\text{J/mol}}{1\,\text{kg/mol}} \approx 7\,\text{Pa}$$

which is $k_B T / \xi^3$ divided by the number of blobs per chain.

---

## 10. Connection to Rubber Elasticity Theory

Classical rubber elasticity gives

$$G = \frac{\rho R T}{M_c}$$

where $M_c$ is the molar mass between crosslinks. This is $G = n k_B T$ with $n = \rho N_A / M_c$ elastic strands per unit volume. Writing $\xi \equiv n^{-1/3}$ for the strand spacing:

$$G = \frac{k_B T}{\xi^3}$$

Both frameworks count $k_B T$ per elastic strand, but:
- Rubber theory: permanent covalent crosslinks, strand spacing $n^{-1/3}$
- Entangled solution: temporary entanglements; each strand is a random walk of blobs spanning $a \gg \xi$, so $G_e \approx k_B T / (a^2 \xi)$

---

## 11. Further Reading

Key references:
1. **de Gennes, P. G.** (1979). *Scaling Concepts in Polymer Physics*. Cornell University Press. (The definitive blob physics treatment)
2. **Rubinstein, M. & Colby, R. H.** (2003). *Polymer Physics*. Oxford University Press. (Comprehensive modern textbook)
3. **Doi, M. & Edwards, S. F.** (1986). *The Theory of Polymer Dynamics*. Oxford University Press. (For concentrated/melt regime and reptation)
4. **Colby, R. H.** (2010). "Structure and linear viscoelasticity of flexible polymer solutions: comparison of polyelectrolyte and neutral polymer solutions." *Rheologica Acta* 49, 425–442. [doi:10.1007/s00397-009-0413-5](https://doi.org/10.1007/s00397-009-0413-5) (Concentration regimes, entanglement onset and scaling tables)

Classic papers and references:
- Ferry, J. D. (1980). *Viscoelastic Properties of Polymers*, 3rd ed. Wiley. (Classic rheology reference)
- Daoud, M. et al. (1975). "Solutions of flexible polymers. Neutron experiments and interpretation." *Macromolecules* 8, 804–818. [doi:10.1021/ma60048a024](https://doi.org/10.1021/ma60048a024) (Neutron scattering tests of the blob scaling)
- Daoud, M. & Jannink, G. (1976). "Temperature-concentration diagram of polymer solutions." *J. Phys. (Paris)* 37, 973–979. [doi:10.1051/jphys:01976003707-8097300](https://doi.org/10.1051/jphys:01976003707-8097300) (Scaling theory of the concentration regimes)

---

## 12. Key Takeaways

1. $G = n k_B T$ counts $k_B T$ per elastic strand; $G \sim k_B T / \xi^3$ is its scaling form, exact for a network when $\xi \equiv n^{-1/3}$
2. In a semi-dilute solution, $k_B T / \xi^3$ sets the osmotic pressure; the solution entangles only above $c_e \approx 10\,c^*$
3. $\xi$ is the **correlation length**, NOT the Kuhn length $l_K$, and is about ten times smaller than the entanglement spacing $a$
4. The plateau modulus of an entangled solution scales like $k_B T / \xi^3$ but is about $(\xi/a)^2 \approx 10^{-2}$ of it
5. Does NOT apply to:
   - Dilute solutions
   - Unentangled semi-dilute solutions ($k_B T$ per chain)
   - Individual chains (Kuhn or otherwise)
6. Measured in good solvent: $\xi \sim c^{-0.76}$ from scattering and $G_e \sim c^{2.3}$ from rheology (Colby 2010)

When teaching or using this relation, always specify the regime and clarify what $\xi$ represents physically.
