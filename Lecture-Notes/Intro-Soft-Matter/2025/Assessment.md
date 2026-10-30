---
title: Contact Line Assignment (2025)
publish: true
date: 2025-11-05
---

# Contact Line Assignment (2025)

This is the 2025 assignment. For the current assessment, see the [[Lecture-Notes/Intro-Soft-Matter/2026/0-README|2026 course page]].

## Take-Home Coding Assignment: Contact Line Singularity

> [!question] Coding Challenge – Contact Line Singularity ODE
> As a practical exercise, you will investigate a simplified model of the contact line singularity by solving a high-order ODE that captures the essential physics. In this assignment (detailed on the course GitHub), we consider the third-order ordinary differential equation:
>
> $$\frac{d^3h}{dx^3} \;=\; -0.01\,\Big(\frac{1}{h^2 + h}\Big),$$
>
> subject to boundary conditions:
> 1. $h(0) = 0$ (the fluid thickness goes to zero at the contact line position $x=0$),
> 2. $h'(0) = 1$ (a preset slope at the contact line, relating to the contact angle),
> 3. $h''(\infty) = 0$ (far from the contact line, the curvature vanishes).
>
> Here $h(x)$ might be thought of as the shape of a spreading thin film (with $x$ the distance from the contact line). The task is to numerically solve this ODE and visualize the solution: plot $h'(x)$ vs $x$ (which effectively shows how the contact angle $\theta = h'$ varies with distance) and $h''(x)$ vs $x$ (how the curvature varies). The equation is stiff – reflecting the multiscale nature of the contact line.
>
> **Objectives**: This assignment isn't just about solving the equation, but also about experiencing AI-assisted coding and iterative refinement: you'll prompt an LLM to generate an initial code, test and debug it, and improve the solution until it meets the specs. Along the way, think about how the boundary condition at infinity can be handled in a finite numerical domain (hint: you'll likely impose $h''$ approaches 0 at a large but finite $x$).
>
> **Instructions**: Use the class GitHub repository **Intro-Soft-Matter-2025** – fork it, add your code (we suggest Python or MATLAB for ODE solving), and submit a pull request as described in the README. The README's "Contact Line Singularity" section provides the exact steps and an example prompt to get you started. This mid-course assignment contributes **40% of the course grade**, and you will receive feedback before the final presentation. The assessment focuses on the physics solution, use of computational tools, and interpretation of the results.

[Course repository](https://github.com/comphy-lab/Intro-Soft-Matter-2025) · [[Lecture-Notes/Intro-Soft-Matter/2025/0-README|2025 course overview]]
