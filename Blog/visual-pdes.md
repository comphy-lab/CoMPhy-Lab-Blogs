---
modified: 2025-10-01T16:14:37+01:00
created: 2025-10-01T12:14:38+01:00
---

modified: 2025-10-01T12:26:37+01:00
created: 2025-10-01T09:34:30+01:00

# Visual PDE: Where mathematics becomes art you can paint with your fingers

VisualPDE lets anyone—students, teachers, and researchers—simulate rich partial differential equation (PDE) models directly in the browser, in real time, no coding or installs. Under the hood it turns your device’s GPU into a math engine, so patterns bloom and waves ripple as fast as you can drag a slider or draw with your finger. It’s “Desmos for PDEs,” except the plots are alive.

> [!summary] TL;DR  
> Open visualpde.com, pick an example (or type your own equations), then **paint** initial conditions, adjust **sliders**, and **share** a link or **embed** the live sim. It runs on laptops, tablets, and phones, with **GPU‑accelerated timestepping** delivering **tens of thousands of steps per second** on typical demos.



## What is VisualPDE?

PDEs describe how things change across space and time: heat diffuses, waves propagate, chemicals react and spread, populations move. Historically, exploring them required code, licenses, and compute time. **VisualPDE removes those barriers**: open a link and you’re simulating on the spot—**no installation**, works on most devices, and the **entire site is open source** if you want to peek or fork.

> [!info] What to do?
> Think interactive PDEs you can **play** with—edit equations live, watch solutions evolve instantly, and share or embed your setup with one click.



## How it works?

### GPU + WebGL

VisualPDE **treats the simulation grid like an image**. Each pixel stores field values; **fragment shaders** update every pixel in parallel. Your browser’s **WebGL** pipeline does the heavy lifting, stepping the system **hundreds of times per frame** for smooth, responsive dynamics. Result: **real‑time PDEs in a tab**.

- WebGL + GLSL shaders = parallel updates
- Grid = floating‑point textures
- “Solve‑as‑you‑type” responsiveness

### Numerics that favor interactivity

Under the hood are familiar methods from a first course in scientific computing:

- **Space:** Finite difference method on a 1D/2D grid.
- **Time:** explicit schemes you can choose: **Forward Euler**, **Adams–Bashforth (2‑step)**, **Midpoint**, and **RK4**. VisualPDE also **detects instability** (NaNs/infinities) and nudges you to tweak the timestep or scheme.

> [!tip] Rules of thumb  
> If a sim “blows up,” **halve $\Delta t$** or switch from Forward Euler to **RK4**. For pattern‑forming systems, a small $\Delta t$ is usually fine thanks to modern GPUs.

### Precision & performance

To maximize compatibility—especially on mobile—VisualPDE currently uses **single‑precision floats**. In practice, that’s enough for teaching and rapid exploration; **double precision** is on the roadmap as browser support matures. Typical demos achieve **tens of thousands of timesteps per second** on modern hardware.



## Playful interface, serious models

- **Paintable initial conditions.** Pause and **draw** on the domain with a brush—seed a ring for a wave equation, scribble a hot patch for diffusion, or drop “prey” into a corner of a predator–prey model.
- **Parameter sliders.** Declare ranges (e.g., `a = 0.5 in [0,1]`) and explore transitions live.
- **Live math.** LaTeX rendering confirms your equations are interpreted as intended.
- **Flexible domains & boundaries.** Use standard rectangular setups, **custom masks**, and common boundary conditions (periodic, Dirichlet, Neumann, Robin).
- **Rich visualization.** Toggle **2D colormaps**, **contours**, **vector fields**, or a **3D surface** for 2D sims—instantly.
- **Share & embed.** Generate a **short link** that encodes your full setup, or copy an **iframe** to embed an interactive figure in docs, lectures, or posts.

> [!example] Minimal embed snippet
> 
> ```html
> <iframe
>   src="https://visualpde.com/sim/?preset=heatEquation"
>   width="640" height="480" loading="lazy"
>   title="VisualPDE simulation">
> </iframe>
> ```
> 
> You can also export embed code (tiny or customized), screenshots or short clips for slides and social posts — use the share button at the right hand side of each simulation.



## What you can build (and why it’s delightful)

### Pattern formation: spots, stripes, labyrinths

- **Gray–Scott model.** Two parameters steer a **zoo of behaviors**: stationary/moving spots, labyrinths, waves, and more. Exploring this interactively is eye‑opening.

<div style="max-width: 900px; margin: 30px auto; padding: 0 15px;">
  <iframe
    title="VisualPDE simulation"
    style="border: 0; width: 100%; height: 500px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
    src="https://visualpde.com/sim/?options=N4IgRghiBcIM4FsD2SAuALCATLIA04ATjCAEz7gBuJArBQMZgyqECuApgfSQGZIA2ASwgBzdhSwBVSSQCMEgGoK5EgOqqSABgmoYmgHSbNsguwDKABz36TIdgBVrpLjNgAlAIIA5ACINlsPIEANYkEAAEALzhpOGCAHbhANoGxnjhqSbhspoAugDcCFEZ+jQALJpxiSn6zpl4sgUKkTSa+RQIULAA7KUUVrAAwqxwqEgI-YRIYOwAYqzxJIsEFlMzADLs8SIYMADMmgSEriAA7gBU8QB6pAC0CJcUhAEgELen75c3ANQK56cAfQAHk8NLBtAQ4ItYIlThRqNAkqAIIQpqdBgIkKxiNAAGw0Gh7GgEFFonxbOCCVAAT2sxNeqKQp022wwAFkICDAhRSUyzPQIPxxLAIKwxjzGacABokdbAgD0sVu4RBJMlAE1ZQDqYrwsraSSxUgzOxUBj+FjCG4INthTxBXBOCABQh2IQIPZ0KaugcuBBXe6AAroQT7Q7O-1uiAALRQE2gBgAHFxMdjOgMQHwhKJxCmLdjIDiWBwU-Exti4DB7fxHaXy4RzZa9HXLQBRCyUi3Q+rOpBly1eVjx+n0EZjBBmbH2+h2h1O9gIMBIOCV6DV2t2RfLuAeReCLa6BOlUxblc+QQ8HgjYUGXEnpcr4Oh6CyUrdTTJzcPuBmEPxWkvuGC7fmYyBoOg8TsCuTj3tuljsKO-AotYtjAdunrejBmZCBYFjsFgjZphAAzrk6QiQaoghYOyrD8DAtidEChHPIKHAkL0dAEAgCTMQorHCiAqQUEglBukhAGkQQIliRA1LMc2IDSYQ4ntp2fbWEY9JKSpQKrCoUmicpsnrAk7CUdR6BsrR9ErBaqD2NSeEkBYSGQZM0wJCIVZzisaxzAsSzuRsWw7OgYa+dMDiOQJCSoOwIjunREUzDK4JBewmppZCU4QDO8zQoJFAYIQ7DsD4AAS7CCCI6CoPygo3vo3QEKJ9BjIQsz7vwuBrj5ZyYPZSCBnZgUEPEkYkLMAjCGIIAAL54MikryXiBJEmqZIUlSAEGPSvLMiF7KcvpDJovVQphEaEpoqlIBykCurKqqp1Mpld3ao94QGq8RommaqZWjas29TWToulGGGoD64bg0GIbhRGAYxnG1ifvQAPpiQpwQHFxB5pahbMGwYN9vWq6Sb2-bYitMOk22HaCF2Gm2OjVOEIOw5cGO4yToQ06zqDsHQdAxbzqeO57gedJC3A56Xve1h3l+25PvRb4fjLv4JABOSa2BGCQcLBjOMrK7wYhyFHqh4uQ10xsEDwOF4QRGPEd5gsgORZlUTRdEvlxnK8fxWj6HsewdDxAN8fwbHgoYwmGeJ7sbtpsk0wZMnUqpjPqUemkZ0ZWe6TiIBBIpifGaZ5m+zZIAuWgDlObALk2rmddrJ5ydOqskX5aN7eRSyoUIz3MyNzFZbxYl6W3RCA8zG9c9wDleUBVlIDFaVFVVTVdUChdR7NSArXtZ17DdV3BCnAN9hDSNsBwmNE2wKoONuvNuRXz1IDLGcGa-5SBA9gqQHxAAAaSQiMV0+5CDhGQFgc+80gA&logo_only"
    frameborder="0"
    loading="lazy">
  </iframe>
  <p style="text-align: center; margin-top: 10px; font-size: 0.9em; color: #666;">
    <a href="https://visualpde.com/nonlinear-physics/gray-scott.html" target="_blank" rel="noopener">Explore the Gray-Scott model on VisualPDE</a>
  </p>
</div>

- **Turing systems.** Try **Schnakenberg** or **Brusselator**; even **“Turing on Turing”**—use an image/webcam as spatial heterogeneity to watch your face turn into spots and stripes.
    

### Environment: landscapes come alive

- [Dryland vegetation (Klausmeier):](https://visualpde.com/mathematical-biology/vegetation-patterns.html) Add a rainfall gradient on a slope and watch **tiger‑bush stripes** emerge, rotate, or break up.
- [Urban flooding (Oxford):](https://visualpde.com/visual-stories/flooding) A LiDAR‑based elevation map lets you “pour” water, adjust river inflow, and even “dig” diversion channels—an intuitive sandbox for flood intuition.

### Health: waves of life and risk

- **FitzHugh–Nagumo model.** Visualize **spiral waves** and their competition with homogeneous oscillations—an accessible window into arrhythmia‑like dynamics.

<div style="max-width: 900px; margin: 30px auto; padding: 0 15px;">
  <iframe
    title="VisualPDE simulation"
    style="border: 0; width: 100%; height: 500px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
    src="https://visualpde.com/sim/?options=N4IgRgTiBcIIwBYQBpwDcYgAwpAEwFUDM5c8A1czAJh1TwHUHM78BnGgDlbwBcYsAOixY4qAMbFYWAFQAlAIIA5ACK4A1pgCmAfTQBeIQFYA3AEM9+uOZ0AvfQFoh13AFsAlpgelUAB0wAwgCubLwA9q64vhBhYFoAYkEAdphBUTFxADJaSQDmvAAWMADMWKgQUiBBDkEAesUOGOVUsLpoMgAU1RbtaA4WtgCUuBDM0rhsWrwAylpaeDC8EEFaqGz+sHCCSGsAjovLqyAY0ADaoGYQMQDuAWEANmFBUNAAbEZGxUaolzcqOWx3LwAJ4CQTfEC-MLXbJ5QoAWTMAA8SLgoddpuIzPctJgzEFwmirtCABqYTI6JEAemoAAIHLSUT9idcAJrknTAmn02mgn4EsKzXh3R7PORmPK46AAM2xkwkZlcWggZgAKgUpmYSmUQFilSqAAoFTzQUoK-VmABaYQiYM4EgeTwgrjMGxAvGeYDCuHEjs9lxgsvu8t1YSS4WeHBlcqOvvDTpFToEDvjzwAor5AY8UtAhKIUxGIEogpFoBDxCFwq5ps9ZeIpUGQ1pXF62FHG0dm622AoW+4cvxc+DUF2wm2VO5pdKQlKhK8Ry2x2wjSatkYAOxYe0gUdt6bGpKg6BwHW7tjTVw2wpJLRtsHUBfd6a+LQV+4BocPneLtvqzVg9dOCMBBUGle53F8F88ETZ4XQ2DtUHAm8GHcPgCnhIJ7hgMQQBdJEYIgchsRWEhhDcdwkgIoj7hI2BvFwMI0GVd8jwQkBGOYsxgQI5N2KYiAWIzLMwzBEQIQ4gSuLTJFolRVAJJYzIKK0FC0IwrDjz8R5eFVYEX0wXx3xvdJYgo3JAxjPwMgSZJUhMrIcnyIpTR1aJYi0XT9NgCjeC0XIVSwqz3LJcYgridlQpANhazMetEhzbBcEKCA5hUAAJLR3FyAoZixHEANQJjxHCCB4n7e4FmjYMjmuAozB0sIDW0uzUCSRUpXgEAAF8AF1UGuSqqlwa43TSNZ3FcVUgXy2Ayt4Ww0qCbLAGQCJQzFyEtvS6oA&logo_only"
    frameborder="0"
    loading="lazy">
  </iframe>
  <p style="text-align: center; margin-top: 10px; font-size: 0.9em; color: #666;">
    <a href="https://visualpde.com/mathematical-biology/fitzhugh-nagumo.html" target="_blank" rel="noopener">FitzHugh–Nagumo model</a>
  </p>
</div>

- [Airborne virus story:](https://visualpde.com/visual-stories/airborne-infections) Toggle ventilation to see how airflow reshapes indoor concentration patterns; an interactive Plus Magazine feature showcased this beautifully.

### Physics & beyond

- **Kuramoto–Sivashinsky.** A classic spatiotemporal chaos demo in a few lines.
<div style="max-width: 900px; margin: 30px auto; padding: 0 15px;">
  <iframe
    title="VisualPDE simulation"
    style="border: 0; width: 100%; height: 500px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
    src="https://visualpde.com/sim/?options=N4IghiBcAuBOCuBTANCARrKIBMJVoDcsBaAFlLxAGMARKOJVAEwFUWSBGY+S1gNU68+7SCA5CBogAy8A6rKwzmIkGQCsvAM5YOapSCbQoUgHRSpHVFRXrKAayxgABAF4npqQGYA3JQC2EKLEHKaeAOxhehykABwRnhwAnJ4UqH4AlpyhEVGx8UkplAB2gZYgAA5YAMLwmtAA9n6U5bD1aIgAYvBFWDyoLW2IADKIRQDm0AAWUJ5SqLAq8ABUBMRgS30gsJIg+rAK0pREkADaoGCwrQDuVfUANvXwmJAAbGpqnmqoF9c0o5rpaAAT2MJi+4Eu9SuI3GUwAsmAAB46Sg-KEAZSoYDuiEc8AaqMhVwAGlghgB9REAemwTmITmR3yJAE0yeSgTS6U4Qd98fV0YhoLcHk8AEpgca4mAIFDUMB+RCwMAAFUmgsCsys8sVYAACpNMpBNXKFUqAFr1RqgmJWe6PWABSqiaBPND1ShUO2ui5QABm2M0ss9RQaT20kH9d0DtpD9uF9uMMdDsAAouUAQ8epAPGVg8mAHLwJqQcFUWoNPzop7+qhSyPRkCIPxuzTh+uypstzQAQWb6VGRmzYNQnfqrZo6V9vtqUtMLxHzbHmn1ho4YLCUhtjcXrfRBqKIMgIQXXfRfktUyKiFboOwJ6X6PKiDLdx9Q7v267qvVoLCMTUpCoL6dzpOUT5MPGTyOn6AayiBV6yOkhiTHC8B3FAZQBIikHbNiSBZCY4SRBYeRhAkySpCAGRFDhfB4VKqghIROQkXEZEFJR9QEIqr6Hu2qBcTxYBAjhiYgIJsC8WmGb1FmHhSOCElSYiLQogJ3GScJQzpAhSHwmhGH9A80DKkCT5YOUr5Xs0rRoDpYwwVGsoDO0XRZiAmwucMowTNMRpzBUtmIKZ5miDp0CIGMSrof0QWkocsWDKyCUgJo1ZgLWbmKJQUywIgiA0AAEog6RjJM0CYtis4mGEqDcVQDSwB0-Z3EwjkNlckxgCZ9S6sZvTFNqKIAL4ALqoFcbWiJsVxOh5lAAn4yqAjiWAANJPPK9QNIAyAToukBBgJo+6aHYILDUAA&logo_only"
    frameborder="0"
    loading="lazy">
  </iframe>
  <p style="text-align: center; margin-top: 10px; font-size: 0.9em; color: #666;">
    <a href="https://visualpde.com/nonlinear-physics/kuramoto-sivashinsky.html" target="_blank" rel="noopener">Kuramoto–Sivashinsky equation</a>
  </p>
</div>

- **Cahn–Hilliard.** Phase separation that coarsens over time.  

<div style="max-width: 900px; margin: 30px auto; padding: 0 15px;">
  <iframe
    title="VisualPDE simulation"
    style="border: 0; width: 100%; height: 500px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
    src="https://visualpde.com/sim/?options=N4IgxgIiBcAuBOBXApgGhAEwKpZieAVBAQBQDMBiAegEwC0AjAJQjrYBqehdUb7u0fEQIBDVpnadBABnEYA6vLyy2sGNIB007QFZ0YASFgiAdgAty00gCUAggDkIdTTqYt0Aay4BeTdIYABACWJgEA2tKoAX4MUQwAugDcIt4MiRCpieIAtkF4jOImYtCxIAAOeADCiADOsAD22eJl8PUARsgAYogmeIjNrR0AMsgmAOawZjAMeviGhIikDHTUNO74UiAq+Eoy4jXIsADKyMgYMAgo6DUAjhdIaCA1-XAP6ABuMGGgIvCtAO6VeoAG3qiHgMAAbDodGRZr8ARBRjUgrAAJ7qDTwv71f4jcaTACyIgAHngGOIEbijmARMDkHgRIgGpScf8ABp4IYAfRJAHoaAE6AEyegqf8AJpc7logVCgIYsXM+onWBA0Hg6ymMYM6AAMzpB30ImyyHgIgAKmZDsUyJFwCazSIAApmPLQO3G03mgBa9UamIAHPoQWD4NkRBVBLBwW16uIwKHY78YAbgUbwPUTA1wTVU4bHons2H1WH1CHi+CAKJlFGg3rQGIVnPweyIJrQWZgWoNbJHcEGsC6tMZ5DZOM1PP6gvoMcTmq2cdBUZqRtY2fj+qTiBBPV62q6zSQjfz13uhhYgDs0mDIDnW5qRzdJgxJXt98nR2y-smJmQk8xGgTwfI4ymQbtgRTNcgLvTdJytG1MUvQMdAAFnQPVgSCMowIwUtwQjKMR0eLC-3kIIMCJRBgWmdAIxJfD4HYOkUHJLQchCRjmOBVjBAKdB6neM1INfYiBKE+ARMY8sQEE4SRDRGs6yzTFdHE+TFJJFpyXEOTJIUoYQmQcjKLMQlqNo8pQVgC00TAvAykgv8BnaEIxnzdNHhadouh6PoXOGUYJimEpZm8jpbPswQQlgZAxnNGj0HC5BOT2JLBmQKU0qeAcRCHboGy2cRJngU4IAACWQIIxjMY5aXpJCPnAhp4E6ZdgXOadPPQf4zBEGz6mdaz-PQIpTR0gBfeIes6kB+h6qM5v2IJsgtVEGsESoRDMExAGQCcqgmBLDfnOCagA&story"
    frameborder="0"
    loading="lazy">
  </iframe>
  <p style="text-align: center; margin-top: 10px; font-size: 0.9em; color: #666;">
    <a href="https://visualpde.com/nonlinear-physics/cahn-hilliard.html" target="_blank" rel="noopener">Cahn–Hilliard equation</a>
  </p>
</div>

_(All available as ready‑to‑run examples.)_

> [!note] Why this matters for learning  
> Immediate, visual feedback **builds intuition** for symmetry breaking, instability, and nonlinearity—concepts that are hard to “see” in static notes. In classrooms and outreach, embedded sims consistently boost engagement.



## Where VisualPDE fits in the tool landscape

- **COMSOL-type codes:** good for engineering detail and complex 3D geometries, but closed sourced which is often a deal breaker for reproducibility. 
- **MATLAB / Mathematica:** great for coding bespoke solvers and symbolic work; less immediate for **shareable, interactive** experiments, also closed sourced.
- **Open source codes** like [[Basilisk101/0-README|Basilisk C]], [OpenFOAM](https://www.openfoam.com/), [Pyoomph](https://pyoomph.github.io/)**: Open source, high precision, but heavy weight — not ideal for easily sharing. 

**VisualPDE fills the gap:** frictionless, **free**, shareable, and powerful enough for **research prototyping** and **teaching**—in a browser.



## Community, credibility, and what’s next

- The site and solver details are openly documented; the **codebase** is on [GitHub](https://github.com/Pecnut/visual-pde). 
- VisualPDE has featured in [Chalkdust](https://chalkdustmagazine.com/regulars/on-the-cover/visual-pde/) and in [Plus magazine](https://plus.maths.org/content/playing-visualpde) (with interactive articles/podcasts), and a [peer‑reviewed BMB paper](https://doi.org/10.1007/s11538-023-01218-4) provides technical and pedagogical context.
- **Roadmap:** continued performance and usability improvements, and work toward a **Julia‑based** companion for larger or more complex studies—all while keeping interactivity at the core.



## Get started

1. **Visit** [visualpde.com](https://visualpde.com) → **Explore** an example that catches your eye (waves, epidemics, ecology).
2. **Play:**
    - Press **pause** and **paint** an initial condition.
    - Add a **slider** for a parameter (`a in [0,1]`) and watch the behavior shift.
    - Flip the **time‑stepping** scheme (try RK4) and compare stability.
3. **Share or embed** what you made (short link or iframe), or record a short clip for your slides.

## The big picture

VisualPDE **democratizes** a language used across science—**PDEs**—by making them **visible, tactile, and shareable**. You can **draw** a hypothesis, **nudge** a parameter, and **see** the consequences in seconds. That shift—from static math to **interactive exploration**—is why this tool resonates in classrooms, labs, and public science alike. Open your browser; the canvas is already waiting.



_Acknowledgements & sources:_ this post integrates and cites the VisualPDE paper[^1], documentation[^2], and example library (open source, with extensive user‑guide material and "Visual Stories"). Also see: [https://visualpde.com/about/](https://visualpde.com/about/).




> [!significance]- Metadata
> Author:: [Vatsal Sanjay](https://comphy-lab.org/VatsalSy)<br>
> Date published:: Oct 1, 2025

> [!meta] Back to main website
> [Home](https://comphy-lab.org/), [Team](https://comphy-lab.org/team), [Research](https://comphy-lab.org/research), [Github](https://github.com/comphy-lab), [Blogs](https://blogs.comphy-lab.org)

[^1]: Walker, B. J., Townsend, A. K., Chudasama, A. K., & Krause, A. L. (2023). VisualPDE: rapid interactive simulations of partial differential equations. Bull. Math. Biol., 85(11), 113.

[^2]: https://visualpde.com/user-guide
