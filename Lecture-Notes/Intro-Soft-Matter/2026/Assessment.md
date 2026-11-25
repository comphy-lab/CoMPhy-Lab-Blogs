---
title: Singularity Coding Assessment (2026)
publish: true
date: 2026-11-18
---

# Singularity Coding Assessment (2026)

Each student chooses one of two singularities, computes it, submits the work as a pull request to the [course repository](https://github.com/comphy-lab/Intro-Soft-Matter-2026), and presents and defends it in the final session. The repository README is the authoritative brief; this page summarises it. For the teaching sequence, see the [[Lecture-Notes/Intro-Soft-Matter/2026/0-README|2026 course page]].

> [!slides] Slides
> [PDF](https://www.dropbox.com/scl/fi/2dj32vardrg2col6zlq2i/2026-11-18-Assessment.pdf?rlkey=ow1ip6u040eimxbrnvhuy77fj&dl=1 "One page per slide")&nbsp;*3 MB* · [PowerPoint](https://www.dropbox.com/scl/fi/44llao27xe3muhvva18s4/2026-11-18-Assessment.pptx?rlkey=kf9hx1o7arctzl8nxdg3ua8k0&dl=1 "Every click as in the lecture")&nbsp;*5 MB* · [Keynote](https://www.dropbox.com/scl/fi/o2hfy09me2nwpn558p7pm/2026-11-18-Assessment.key?rlkey=crxrg95n2w2omoxov7mqmjrjh&dl=1 "Every click as in the lecture")&nbsp;*3 MB*

| Part | Weight |
|---|---|
| Pull request (code, figures, README, AI log) | 40% |
| Presentation and defence in the final session | 60% |

## Dates (Wednesdays, 2026)

| Date | Step |
|---|---|
| 18 November | choose Option A or Option B |
| 2 December | open your pull request |
| 2–9 December | written feedback on your pull request |
| 9 December | present and defend your work in the final session |

## The questions

Every singularity in the course is examined with the same four questions (see [[Lecture-Notes/Intro-Soft-Matter/Singularities|Singularities]]):

1. **Singular?** Which quantity goes to zero, or diverges, and where or when?
2. **Self-similar?** Do rescaled profiles collapse onto one curve?
3. **Universal?** What does the local solution forget about the initial or far-field conditions?
4. **Regularised?** Which physics, absent from the equation, stops the divergence?

Each option asks a subset of them. Answer them with evidence from your own computations.

## Option A: a moving contact line

A liquid wedge moves steadily over a solid. In the frame of the contact line, the film thickness $h(x)$ at distance $x$ from the line obeys the lubrication equation

$$\frac{d^3h}{dx^3} = -\frac{0.01}{h^2},$$

with

- $h(0) = 0$ (the film ends at the contact line),
- $h'(0) = 1$ (unit slope at the contact line),
- $h''(\infty) = 0$ (the curvature dies out far away).

The constant $0.01$ measures the speed of the line relative to surface tension.

**Questions:** Is the problem singular? How is it regularised? Is the result universal?

## Option B: a rupturing film

A thin liquid film on a solid is thinned by van der Waals attraction. In dimensionless form, its thickness $h(x,t)$ obeys

$$h_t + \left(h^3 h_{xxx}\right)_x + \left(\frac{h_x}{h}\right)_x = 0,$$

on a periodic domain, starting from

$$h(x,0) = 1 + \varepsilon \cos kx.$$

**Questions:** Is the flat film unstable? Is the rupture singular? Is it self-similar? Is it universal?

## What to submit

Open a pull request to the [course repository](https://github.com/comphy-lab/Intro-Soft-Matter-2026) that adds your files directly in `submissions/`, each name starting with your exact GitHub username and an underscore:

- your code, in any language;
- the figures you discuss;
- `<github-user>_README.md`: the problem, your approach, your answers to the questions for your option, and how to run your code;
- `<github-user>_AI-log.md`: what you asked, what the AI returned, how you tested it, and what you changed.

> [!important] Public submission
> The repository is public. Read its [visibility and consent section](https://github.com/comphy-lab/Intro-Soft-Matter-2026#public-visibility-and-consent) **before you upload or push any file to your fork**. Your files, commit history, username and pull-request discussion will be publicly visible and may remain in the repository history. Never include student numbers, marks, private contact details, API keys, passwords or tokens. If you need a private route, contact the instructor before you start.

The repository README gives step-by-step instructions for the browser and the terminal.

## AI is encouraged

Use any AI tool for any part of the work, and keep the log as you go: what you asked, what came back, how you tested it, and what you changed. In the final session you must be able to explain every line of your code and every figure you show; the defence is about your understanding, whoever typed the code.

## The final session

Each presentation covers the problem, how you approached it (including the checks that make you trust your numbers), what you found for each question, and then a defence: any line of code or any figure can be questioned. Plan for about 5 minutes plus 3 minutes of questions; the exact timing depends on the size of the class.

## Reading

- J. Eggers & M. A. Fontelos, *Singularities: Formation, Structure, and Propagation*, Cambridge University Press (2015). Chapters 1–3 for the framework; §15.2 for contact lines.
- J. H. Snoeijer & B. Andreotti, Moving contact lines: scales, regimes, and dynamical transitions, *Annu. Rev. Fluid Mech.* **45**, 269–292 (2013).
- A. Oron, S. H. Davis & S. G. Bankoff, Long-scale evolution of thin liquid films, *Rev. Mod. Phys.* **69**, 931–980 (1997).
- V. Sanjay, Singularities in soft matter systems, *Contemporary Physics* (2026), [doi:10.1080/00107514.2026.2721118](https://doi.org/10.1080/00107514.2026.2721118); [arXiv:2608.11060](https://arxiv.org/abs/2608.11060).

Questions: open an issue in the [course repository](https://github.com/comphy-lab/Intro-Soft-Matter-2026) or ask in class.
