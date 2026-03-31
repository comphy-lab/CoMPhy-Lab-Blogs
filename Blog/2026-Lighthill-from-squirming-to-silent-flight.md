---
status: Working 🏗️
publish: false
tags:
  - Fluid-dynamics
  - History
  - Biological-flows
  - Acoustics
  - Low-Reynolds-number
---

# From Squirming Spheres to Silent Owls: Why Lighthill Still Runs the Room

James Lighthill has the unfair habit of showing up everywhere.

You start with microscopic organisms swimming through syrup. Fine. Low Reynolds number, Stokes flow, classical mathematical biology. Then you go to aircraft noise, trailing-edge scattering, wind turbines, owls, and suddenly — somehow — you are still in Lighthill country.

That was the real message hidden inside Nigel Peake's BAMC lecture on owl flight. The owls were the hook. Lighthill was the spine.

> [!abstract] TL;DR
> - Lighthill's 1952 squirmer paper showed how a deforming body can self-propel at vanishing Reynolds number, but only through second-order effects and with miserable efficiency
> - The same style of thinking later underpinned modern aeroacoustics: reduce a messy physical problem to a clean asymptotic mechanism
> - In owl flight, the central question is not "why are owls magical?" but "which sound-generation mechanism have they managed to suppress?"
> - The likely answer is the usual trailing-edge scattering mechanism: turbulence convecting over a sharp edge is loud, and owl wings appear engineered to wreck that process
> - This is why Lighthill matters: not because every problem is the same, but because the mathematical instinct is the same

## The First Lighthill Problem: Can a Sphere Swim Without Inertia?

In his 1952 paper *On the squirming motion of nearly spherical deformable bodies through liquids at very small Reynolds numbers*, Lighthill asked a question that sounds innocent and is not.

If inertia is negligible, can a deforming body move through a liquid using shape change alone?

At high Reynolds number the answer is obviously yes. Fish do it every day. At low Reynolds number, things are crueler. Stokes flow has no memory. Push one way, then reverse the motion exactly, and the fluid gives you exactly nothing back. This is the world later summarized by Purcell's scallop theorem.

Lighthill showed that a nearly spherical body **can** self-propel — but only through second-order effects. First-order shape oscillations do not give net progress over a full cycle. You need the right phase-shifted combination of deformations so that the body exploits nonlinear geometry while the fluid itself remains governed by linear Stokes equations.

That is a deeply Lighthillian result. The mathematics is elegant. The physics is brutal. Yes, locomotion is possible. No, it is not efficient.

In fact, the paper shows that even the best of the simple squirming modes is energetically awful compared with towing a rigid sphere through the same fluid. Life at low Reynolds number is possible, but it is not generous.

## The Second Lighthill Problem: Where Does Sound Come From?

Jump forward and the physical problem changes completely. Now we are not talking about microorganisms but about turbulent flow, aircraft wings, turbine blades, and the sound they make.

Here Lighthill's famous move was the acoustic analogy: rearrange the fluid equations so that they look like a wave equation forced by an effective source term. This is one of those ideas that is so good it has become invisible. Modern aeroacoustics is full of descendants of that trick.

The important point is not the exact form of the equations. The important point is the style:

1. Start from the exact governing equations.
2. Rearrange them until the physical mechanism becomes legible.
3. Identify which source terms are actually dominant.
4. Scale the hell out of it.

That is the same intellectual move as the squirmer paper, even though the physics could hardly be more different.

## Why Owls Are Not Just a Cute Biology Story

Owls matter because they seem to suppress a very specific and usually unavoidable sound source.

A turbulent flow convecting over a sharp trailing edge is noisy. This is true for aircraft wings, turbine blades, and — inconveniently for owls — bird wings.

Most birds make that noise. Owls largely do not.

So the right question is not "how do owls make no sound at all?" That is too mystical and probably false. The right question is:

**Which ordinary aerodynamic noise mechanism have owls managed to sabotage?**

Nigel Peake's talk points toward the standard answer: owl wings alter the boundary layer and, especially, the trailing-edge scattering process. Their leading-edge and surface structure help organize the near-wall flow, while the trailing-edge fringe appears to blunt or disrupt the sharp-edge acoustics that normally amplify broadband noise.

That is a very satisfying answer because it is not a fairy tale. It is mechanism.

## The Hidden Thread Between Squirmers and Owls

A microswimmer in Stokes flow and an owl wing in turbulent air have almost nothing in common physically.

And yet the mathematical instinct behind both problems is the same:

- identify the dominant regime
- throw away everything that does not matter at leading order
- keep the geometry honest
- let scaling tell you what is possible and what is fantasy

Lighthill did not just solve particular problems. He taught a way of seeing them.

That is why he keeps turning up.

He turns up when you ask why a microscopic body can move without inertia.
He turns up when you ask why a jet is noisy.
He turns up when you ask why a wing is noisy.
And now he turns up when you ask why an owl is not.

## The Real Lesson

The best fluid mechanics does not merely describe phenomena. It strips them down until the mechanism becomes unavoidable.

Lighthill's squirming paper does that for locomotion.
His acoustic work does that for sound generation.
The owl problem is compelling precisely because it still fits inside that tradition: not myth, not biomimetic branding, just the hard question of what flow structure and what geometry remove a dominant source term.

That is why an old paper about squirming spheres still belongs in a conversation about silent flight.

Because Lighthill was never really writing about spheres.
He was writing about how to think.

---

## Further reading

- M. J. Lighthill, *On the squirming motion of nearly spherical deformable bodies through liquids at very small Reynolds numbers* (1952)
- J. E. Ffowcs Williams and D. L. Hawkings, the classic extension of Lighthill's acoustic analogy to moving surfaces
- Nigel Peake's work on trailing-edge noise, owl-inspired acoustics, and aeroacoustic scattering
