---
status: Working 🏗️
publish: false
---
# James G. Oldroyd: Life, Work, and Legacy in Rheology

![](../_Media/James%20G.%20Oldroyd-1741128879880.png)

> Portrait and bio sketch of James G. Oldroyd. Slide taken from John Hinch's talk on _Oldroyd B, and not A?_

### Early Life and Education

James Gardner Oldroyd (25 April 1921 – 22 November 1982) demonstrated exceptional mathematical aptitude in Bradford, England. He entered Bradford Grammar School at age 10, matriculating in nine subjects by age 14. Unable to advance immediately to university due to his youth, he dedicated four years in sixth form to developing mathematical expertise while acquiring fluency in German and French. In 1939, Oldroyd secured a state scholarship to Trinity College, Cambridge, where he established an exemplary academic record. He received the Rouse Ball Prize in 1941 and the Mayhew Prize in 1942 as Cambridge's outstanding student in applied mathematics, graduating with first-class honors. Oldroyd maintained strong academic affiliations with Trinity College post-graduation, returning as a research scholar (1945–46) and securing a junior fellowship (1947). During this period, he completed his PhD thesis titled *“A mathematical discussion of some rheological problems,”* with guidance and critiques from W. R. Dean (of *Dean flow* fame) and Alan H. Wilson. Dean and Wilson $-$ both Cambridge trained mathematicians significantly influenced Oldroyd's approach to fluid mechanics and solid mechanics. His doctoral work (PhD awarded 1949) established fundamental principles in non-Newtonian fluid mechanics, culminating in his Cambridge Sc.D. in 1958 for his substantial contributions to the field [^1].

### Wartime Work and the Path to Rheology 

World War II interrupted Oldroyd’s academic pursuits but also broadened his experience. From 1942 to 1945 he worked at the Ministry of Supply in Aberporth, Wales, conducting rocket research for Britain’s war effort. This foray into applied physics and engineering gave him practical insight into fluid and material behavior under extreme conditions. After the war, Oldroyd transitioned back to research in emerging areas of fluid mechanics. In 1945 he joined the Fundamental Research Laboratory of Courtaulds in Maidenhead, a major industrial lab focused on artificial fibers and polymers [^2]. Notably, his former Cambridge tutor, Alan H. Wilson, had also moved to Courtaulds, and likely helped recruit Oldroyd to this innovative environment [^1]. At Courtaulds, Oldroyd worked closely with experimental rheologists D. J. Strawbridge and B. A. Toms, who were investigating the unusual flow behavior of polymer solutions [^2]. These collaborations exposed Oldroyd to cutting-edge rheometry and puzzling phenomena – for example, B. A. Toms had just discovered the drag reduction effect (later called the *Toms effect*) where tiny polymer additives dramatically lower turbulent friction. Oldroyd became fascinated by such non-Newtonian effects and even suggested early on that *wall slip* at the pipe boundary might explain Toms’s observations [^3]. This period at Courtaulds was formative: it immersed Oldroyd in real-world rheological problems, from the processing of viscose fibers to the oddities of polymer solution flows, inspiring him to seek a deeper theoretical framework for these `elastic` liquids.

Oldroyd’s first publications in the late 1940s already show him tackling non-Newtonian fluid mechanics with a blend of mathematical rigor and practical insight. He initially focused on *viscoplasticity*, analyzing the flow of Bingham solids (materials that behave as a solid until a yield stress is exceeded when they flow). In 1947, while still in Cambridge, he published a series of papers on the *plastic flow of Bingham materials*, developing a `rational formulation` of their equations of flow and solving flow problems between moving cylinders. These early works, drawn from his dissertation, addressed how yield-stress fluids deform, essentially bridging solid plasticity and fluid flow. By 1949, Oldroyd had broadened his scope to other types of non-Newtonian fluids: he examined steady laminar flows in non-Newtonian liquids and noted anomalies like pressure gradients in pipe flow that couldn’t be explained by classical viscosity alone. He even proposed experimental methods to detect wall slip and other flow peculiarities at the first International Congress on Rheology in 1948 [^1]. These experiences convinced Oldroyd that a unifying theoretical description for *complex fluids* was needed – one that could encompass the behavior of elastic liquids (polymer solutions), viscous suspensions, and even solids with memory. This realization set the stage for his groundbreaking work in 1950.

### The 1950 Breakthrough: Formulating Rheological Equations of State  

In 1950, James G. Oldroyd published what is now considered “probably the most important single paper in theoretical rheology.”[^6] Titled *“On the Formulation of Rheological Equations of State,”*[^4]  this paper established the basic principles for mathematical models of complex fluids. Oldroyd addressed a fundamental issue: existing viscoelastic models at the time (such as the Jeffreys model) were not *frame-invariant* – their predictions could depend on the observer’s frame of reference, which is unphysical [^5]. Influenced by earlier work of Sir Harold Jeffreys and by a 1946 study of bitumen by H. Fröhlich and R. Sack, Oldroyd recognized that the way one computes the time-derivative of stress in a flowing material is crucial. In essence, he argued that when a material element moves, rotates, and deforms, the rate-of-change of stress must be evaluated in a *convected frame* moving with the material. To achieve this, Oldroyd introduced two new definitions of the stress derivative – the upper-convected and lower-convected time derivatives – which account for material rotation and stretching in different ways:

> Lower convective Oldroyd derivative:
> $$ \stackrel{\triangle}{A} = \frac{DA}{Dt} + \mathbf{A} \cdot (\nabla \mathbf{u})^T + \nabla \mathbf{u} \cdot \mathbf{A}. $$ 

> Upper convective Oldroyd derivative:
> $$ \stackrel{\nabla}{A} = \frac{DA}{Dt} - \mathbf{A} \cdot (\nabla \mathbf{u})^T - \nabla \mathbf{u} \cdot \mathbf{A}. $$

Applying these ideas, Oldroyd showed that if one takes the classical *Jeffreys model* (a combination of an elastic spring and two viscous dashpots) and replaces the ordinary time derivatives with his convected derivatives, one obtains two consistent viscoelastic models [^5]. These he called “Model A” (using the lower-convected derivative) and “Model B” (using the upper-convected derivative) – known today as the Oldroyd-A and Oldroyd-B models [^5]. 

> Oldroyd-A (Lower convected derivative):  
> $$ \sigma + \tau_1 \stackrel{\triangle}{\sigma} = 2\mu^*(\mathbf{E} + \tau_2 \stackrel{\triangle}{\mathbf{E}}),$$

> Oldroyd-B (Upper convected derivative):  
> $$ \sigma + \tau_1 \stackrel{\nabla}{\sigma} = 2\mu^*(\mathbf{E} + \tau_2 \stackrel{\nabla}{\mathbf{E}})$$

Both models reduce to the same behavior in a stationary reference frame, but they differ in how they predict stresses in flows involving rotation or deformation of the fluid parcel. Oldroyd’s 1950 paper thus laid down a clear *frame-indifference* requirement for rheological equations, a cornerstone for modern continuum mechanics of non-Newtonian fluids. It was a bold theoretical leap that immediately gave researchers two possible constitutive equations for viscoelastic liquids. 

> [!danger] Note:
> Oldroyd, characteristically cautious, noted that choosing between Model A and B `depends on the physics` of the material, though he offered no immediate criteria for selection [^5]. 

Nonetheless, the mere formulation of these models has been instructive. It provided, for the first time, a concrete mathematical language to describe fluids with both viscous and elastic characteristics (*viscoelastic* fluids) in a way that is invariant under changes of frame. This achievement earned Oldroyd international recognition – including the Gold Medal of the British Society of Rheology and a special issue of the BSR Bulletin honoring his 60th birthday [^6] – and it set the stage for much of the theoretical rheology that followed.

### Oldroyd-A vs. Oldroyd-B: Weissenberg’s Rod-Climbing and the Preferred Model  
While Oldroyd initially presented Models A and B as two equally plausible formulations, subsequent insights and experiments soon favored one over the other. In the very same 1950 paper, at the end, Oldroyd himself included a telling calculation: the flow of an elastic liquid around a rotating rod. This was not an arbitrary choice – it related to a famous experiment by Karl Weissenberg a few years earlier. Weissenberg had observed that when a rod is rotated in a polymer solution, the fluid *climbs up* the rod against gravity (now known as the Weissenberg effect or rod-climbing effect) due to the elastic normal stresses generated in the fluid. Oldroyd wanted to see how his two model fluids would behave in this scenario. The result was striking: Oldroyd-B (upper-convected) predicted the fluid would climb the rod, matching Weissenberg’s observations, whereas Oldroyd-A (lower-convected) predicted the opposite – the fluid would be pushed downwards (a “rod-dropping” effect). The latter phenomenon had never been observed in polymer fluids. Thus, by comparing both models against empirical reality, Oldroyd-B emerged as the more physically relevant model for polymeric (viscoelastic) fluids. As Oldroyd and others noted, the *rod-climbing test* essentially singled out Model B as the correct choice for liquids like dilute polymer solutions. Oldroyd commented that Model B should *“be favoured”* in such cases, aligning with Weissenberg’s findings. (Indeed, the inverse “rod-dipping” behavior of Model A was only realized decades later in very different materials, such as dense suspensions of particles, confirming Oldroyd’s intuition that the choice depends on the material’s microphysics.)

 ![](../_Media/James%20G.%20Oldroyd-1741126421305.png)
> A classic demonstration of the Weissenberg rod-climbing effect. A rotating rod in a viscoelastic polymer solution causes the fluid to climb up along the rod, due to positive normal stress differences. Oldroyd’s upper-convected Model B correctly captures this effect, whereas Model A would predict a downward dip, which is not observed in polymer fluids. Figure credits: [Henry Ng and Rob Poole, University of Liverpool](https://fluids.ac.uk/gallery/zoomify/665).

Beyond qualitative rod-climbing, more detailed microstructural studies in subsequent years reinforced the supremacy of Oldroyd-B for polymeric liquids. In the 1960s, rheologists developed molecular models of polymer solutions – envisioning long polymer molecules as tiny spring–dashpot elements or “dumbbells” dispersed in a solvent. When John Hinch and others revisited Oldroyd’s models in light of these developments, they found a remarkable connection: the simplest molecular model of a polymer chain in flow (the elastic dumbbell model) leads mathematically directly to the Oldroyd-B constitutive equation [^5]. 
In other words, if one treats a polymer molecule as two beads connected by a spring dragged through a viscous solvent, the macroscopic stress evolution follows Oldroyd’s upper-convected form (with the polymer’s finite relaxation time corresponding to Oldroyd-B’s parameters). This result explained why Oldroyd-B captured many polymer solution behaviors so well – it was essentially *derived from first principles* of polymer micro-dynamics. Oldroyd-A, in contrast, did not emerge from any analogous physical picture for flexible polymers. By the late 20th century, therefore, Oldroyd-B had become the standard viscoelastic fluid model for dilute polymer solutions in rheology and computational fluid dynamics, whereas Oldroyd-A largely faded from use. As John Hinch humorously noted, a survey of literature reveals thousands of papers employing “Oldroyd-B” in their title or keywords, but only a handful mentioning “Oldroyd-A”. 

![](../_Media/James%20G.%20Oldroyd-1741126749363.jpeg)

The reason is clear: Oldroyd-B not only passes key experimental tests but also has a firm basis in polymer molecular theory, making it the preferred tool for scientists and engineers modeling viscoelastic flows. The legacy of Oldroyd’s 1950 insight is thus encapsulated in the ubiquity of the Oldroyd-B model – a tribute to his ability to capture the essential physics of elastic fluids in a simple equation.

### Later Contributions and Evolving Work  
After 1950, Oldroyd continued to build on his framework and ventured into new problems, further cementing his status as a pioneer in rheology. In 1953, he published a notable paper on *“The elastic and viscous properties of emulsions and suspensions.”* [^7] Here, Oldroyd extended his constitutive modeling to multiphase systems, showing how a mixture of a liquid with dispersed droplets or particles could exhibit viscoelastic behavior. He demonstrated (for a dilute emulsion of liquid droplets) that the interfacial tension of the droplets provides a restoring force against deformation, effectively giving the emulsion an elastic component [^3]. 
This work was an early example of micro-rheology – linking microscopic structure to macroscopic rheological properties – and it illustrated Oldroyd’s knack for generalizing his models to diverse materials. He also investigated the effect of surfactant films on droplet interfaces in emulsions, recognizing that a stabilizing film could alter the combined fluid’s elasticity. These studies by Oldroyd in the 1950s are considered pioneering, as they connected continuum rheology with micro-scale mechanisms in suspensions and emulsions.

Oldroyd’s theoretical explorations in the mid-1950s also produced insights into what we now call “second-order fluids.” In a 1958 paper, he analyzed normal stress effects (differences in normal stresses) in steady flows of idealized viscoelastic liquids, using a general invariant formulation that included up to quadratic terms in stresses [^8]. Notably, he examined the conditions for the Weissenberg effect (rod-climbing) to occur “in a positive or negative sense,” essentially exploring the parameter space where a fluid would climb or dip around a rod. This comprehensive study brought clarity to how non-Newtonian normal stresses arise in shear and rotational flows, and it introduced what became known as the Oldroyd 8-constant model (a generalized linear viscoelastic model with eight material constants). 
Such work laid the groundwork for later researchers like Coleman, Noll, and Rivlin, who in the same era were developing the modern continuum mechanics of fluids. Oldroyd’s approach was always characterized by careful attention to invariant formulation (he cited the earlier convected-coordinate ideas of F. Hencky and others [^3]) and by a desire to keep models as simple as possible while capturing the essential physics. 
In 1961, he published a survey in *Rheologica Acta* on *“the hydrodynamics of materials whose rheological properties are complicated,”* [^9] reflecting on how to extend classical hydrodynamics to fluids with memory and elasticity. He even ventured into esoteric territory by exploring constitutive equations in a general relativistic context (a 1970 paper on equations of state in general relativity [^10]), showing the breadth of his mathematical curiosity.

Throughout the 1960s and 1970s, Oldroyd remained an active, though not prolific, author. He was selective in his publications, preferring depth over quantity – in nearly 40 years he published fewer than 30 papers [^1], mostly as a single author. Yet those papers are dense with ideas that continued to influence rheology. 
He developed a theory of viscoplastic boundary layers. 
He also revisited thermodynamics and continuum mechanics, searching for rheological models consistent with the laws of thermodynamics (as seen in his 1976 reflections). 
Even in his final years, Oldroyd continued to synthesize his lifetime of insights: his last paper, published posthumously in 1984, was titled *“An approach to non-Newtonian fluid mechanics,”*[^11] offering a grand overview of the field - a treat to read for our generation.

### Influence on the Rheology Community and Honors  
Oldroyd’s influence extended beyond his written work; he was also a guiding figure and mentor in the rheology community. In 1953, the same year he took up a professorship, he served as Treasurer of the 2nd International Congress of Rheology held in Cambridge [^2] – a gathering of the world’s top rheologists. 
He later became President of the British Society of Rheology (BSR) from 1955 to 1957, helping to shape the direction of rheological research in the UK [^12]. Oldroyd had moved to academia in 1953 as Professor of Mathematics at the University of Wales, Swansea, where he also headed the Applied Mathematics Department from 1957. In 1965, he was appointed Professor at Liverpool University, eventually becoming Head of the Department of Applied Mathematics and Theoretical Physics there [^2]. In these roles, Oldroyd supervised a small number of doctoral students – notably Kenneth Walters, who completed his PhD under Oldroyd at Swansea. 
Walters would go on to become a prominent rheologist himself (co-founding the *Journal of Non-Newtonian Fluid Mechanics* in 1976) and later reminisced that although Oldroyd guided only *“half a dozen”* PhD students, his impact on them – and on the field – was profound [^13]. Oldroyd’s students and colleagues admired his deep physical intuition and his knack for reducing complex problems to their core elements. Amusingly, Walters recalled that Oldroyd was *“no sportsman,”* yet somehow many of his research students were star cricket players – a coincidence that Oldroyd, with his gentle humor, tolerated even if he didn’t share their sporting enthusiasm [^13].

In recognition of his scientific contributions, Oldroyd received numerous honors. Cambridge University awarded him the Adams Prize in 1964, one of its highest accolades in mathematics, for his work on the mechanics of non-Newtonian fluids. The British Society of Rheology bestowed upon him its Gold Medal in 1984 (the year after what would have been Oldroyd’s retirement), celebrating a lifetime of achievement in rheology  [^2]. Tributes poured in as he reached his 60th birthday in 1981 – the BSR dedicated a special issue of its bulletin to him, and luminaries like professor R. B. Bird lauded Oldroyd’s contributions.[^6] 
In fact, at the 1988 International Congress on Rheology in Sydney, Bob Bird gave an opening lecture entitled *“The Two JG’s”* in honor of J. G. Oldroyd and J. G. Kirkwood – comparing Oldroyd, the continuum mechanician, and Kirkwood, the molecular theorist, as two giants who bridged the gap between macroscopic and microscopic understandings of fluid behavior [^1]. 
This was a testament to how Oldroyd’s work, particularly the Oldroyd-B model, had become a cornerstone that linked molecular theory with continuum modeling.

Unfortunately, James G. Oldroyd’s life was cut short in 1982 – he died suddenly of an apparent heart attack while on his way to the university in Liverpool [^2] – but his legacy endures vibrantly. His name is forever attached to the Oldroyd-B model, a staple in rheology textbooks and simulations, and his ideas on convected derivatives underpin all modern viscoelastic fluid theories. In computational fluid dynamics and engineering today, Oldroyd’s models are routinely used to simulate polymer processing, biological fluid flows, and complex material behavior, enabling predictions of how materials will respond under flow with both viscous and elastic forces at play. 

In hindsight, John Hinch and other colleagues note that Oldroyd’s genius was in formulating simple yet physically sound models – *“the first twelve pages”* of his 1950 paper, as Bob Bird once remarked, *contained the seeds of an entire field*. By following a historical narrative from classical mechanics to modern rheology, Oldroyd essentially wrote the chapter that connects Isaac Newton’s fluid (ideal viscous) to James Clerk Maxwell’s elastic solid, and in doing so, he helped create the science of rheology as we know it. His work evolved from early studies of idealized plastic solids to the elegant Oldroyd-B equation, reflecting a consistent vision: to understand and predict the behavior of materials that are not purely solid nor liquid, but something in between. This vision, shaped by great mentors, wartime experiences, industrial collaboration, and personal insight, makes James G. Oldroyd a towering figure in the history of rheology and fluid mechanics – one whose influence is still climbing upward, much like the fluid on Weissenberg’s spinning rod. 


[^1]: I. A. Frigaard, G. H. McKinley, R. J. Poole & K. Walters, Editorial for special issue on "Oldroyd at 100: Celebrating the impact of JG Oldroyd on non-Newtonian fluid mechanics", J. Non-Newtonian Fluid Mech., 301, 104749 (2022), [Link](https://nnf.mit.edu/sites/default/files/publications/files/Oldroyd_SI_Editorial_FINAL.pdf).

[^2]: James G. Oldroyd – Wikipedia: [German](https://de.wikipedia.org/wiki/James_G._Oldroyd) and [English](https://en.wikipedia.org/wiki/James_G._Oldroyd).

[^3]: R. I. Tanner & K. Walters, Rheology: An Historical Perspective, Elsevier (1998). [Link](https://bit.ly/4bohW0t).

[^4]: J. G. Oldroyd, On the formulation of rheological equations of state, Proc. R. Soc. Lond. A, 200:1063, 523-541 (1950)

[^5]: J. Hinch & O. Harlen, Oldroyd B, and not A?, J. Non-Newtonian Fluid Mech., 298, 104668 (2021) [link](http://www.damtp.cam.ac.uk/user/hinch/publications/Oldroyd12b.pdf#:~:text=Sack%20%281946%29%20,would%20climb%20the%20rod%2C%20as).

[^6]: #TODO needs citation and wikipedia is not it

[^7]: J. G. Oldroyd, The elastic and viscous properties of emulsions and suspensions, Proc. R. Soc. Lond. A, 218:1132, 122-132 (1953)

[^8]: J. G. Oldroyd, Non-Newtonian effects in steady motion of some idealized elastico-viscous liquids, Proc. R. Soc. Lond. A, 245:1241, 278-297 (1958).

[^9]: J. G. Oldroyd, The hydrodynamics of materials whose rheological properties are complicated, Rheol. Acta, 1:4, 337-344 (1961)

[^10]: J. G. Oldroyd, Equations of state of continuous matter in general relativity, Proc. R. Soc. Lond. A, 316:1524, 1-28 (1970)

[^11]: J. G. Oldroyd, An approach to non-Newtonian fluid mechanics, J. Non-Newtonian Fluid Mech., 14, 9-46 (1984)

[^12]: [Former BSR Presidents - British Society of Rheology](https://www.bsr.org.uk/pages/former-bsr-presidents#:~:text=Image%3A%20Photo%20of%20Oldroyd)

[^13]: [Oral History Interviews, Kenneth Walters - American Institute of Physics](https://www.aip.org/history-programs/niels-bohr-library/oral-histories/47534#:~:text=match%20at%20L1785%20The%20amazing,Fluid%20Mechanics%2C%E2%80%99%E2%80%99%20Journal%20of%20Non)


# James G. Oldroyd: Life, Work, and Legacy in Rheology

![Portrait of James G. Oldroyd|1066x24](_Media/James%20G.%20Oldroyd-1741128879880.png)

> Portrait and bio sketch of James G. Oldroyd. Slide taken from John Hinch's talk on _Oldroyd B, and not A?_

## Early Life and Education

James Gardner Oldroyd (25 April 1921 – 22 November 1982) demonstrated exceptional mathematical aptitude in Bradford, England. He entered Bradford Grammar School at age 10, matriculating in nine subjects by age 14. Unable to advance immediately to university due to his youth, he dedicated four years in sixth form to developing mathematical expertise while acquiring fluency in German and French.

In 1939, Oldroyd secured a state scholarship to Trinity College, Cambridge, where he established an exemplary academic record. He received the Rouse Ball Prize in 1941 and the Mayhew Prize in 1942 as Cambridge's outstanding student in applied mathematics, graduating with first-class honors. Oldroyd maintained strong academic affiliations with Trinity College post-graduation, returning as a research scholar (1945–46) and securing a junior fellowship (1947).

During this period, he completed his PhD thesis titled _"A mathematical discussion of some rheological problems,"_ with guidance and critiques from W. R. Dean (of _Dean flow_ fame) and Alan H. Wilson. Dean and Wilson—both Cambridge-trained mathematicians—significantly influenced Oldroyd's approach to fluid mechanics and solid mechanics. His doctoral work (PhD awarded 1949) established fundamental principles in non-Newtonian fluid mechanics, culminating in his Cambridge Sc.D. in 1958 for his substantial contributions to the field [^1].

## Wartime Work and the Path to Rheology

World War II interrupted Oldroyd's academic pursuits but also broadened his experience. From 1942 to 1945 he worked at the Ministry of Supply in Aberporth, Wales, conducting rocket research for Britain's war effort. This foray into applied physics and engineering gave him practical insight into fluid and material behavior under extreme conditions.

After the war, Oldroyd transitioned back to research in emerging areas of fluid mechanics. In 1945 he joined the Fundamental Research Laboratory of Courtaulds in Maidenhead, a major industrial lab focused on artificial fibers and polymers [^2]. Notably, his former Cambridge tutor, Alan H. Wilson, had also moved to Courtaulds, and likely helped recruit Oldroyd to this innovative environment [^1].

At Courtaulds, Oldroyd worked closely with experimental rheologists D. J. Strawbridge and B. A. Toms, who were investigating the unusual flow behavior of polymer solutions [^2]. These collaborations exposed Oldroyd to cutting-edge rheometry and puzzling phenomena – for example, B. A. Toms had just discovered the drag reduction effect (later called the _Toms effect_) where tiny polymer additives dramatically lower turbulent friction. Oldroyd became fascinated by such non-Newtonian effects and even suggested early on that _wall slip_ at the pipe boundary might explain Toms's observations [^3]. This period at Courtaulds was formative: it immersed Oldroyd in real-world rheological problems, from the processing of viscose fibers to the oddities of polymer solution flows, inspiring him to seek a deeper theoretical framework for these `elastic` liquids.

Oldroyd's first publications in the late 1940s already show him tackling non-Newtonian fluid mechanics with a blend of mathematical rigor and practical insight. He initially focused on _viscoplasticity_, analyzing the flow of Bingham solids (materials that behave as a solid until a yield stress is exceeded when they flow). In 1947, while still in Cambridge, he published a series of papers on the _plastic flow of Bingham materials_, developing a `rational formulation` of their equations of flow and solving flow problems between moving cylinders.

These early works, drawn from his dissertation, addressed how yield-stress fluids deform, essentially bridging solid plasticity and fluid flow. By 1949, Oldroyd had broadened his scope to other types of non-Newtonian fluids: he examined steady laminar flows in non-Newtonian liquids and noted anomalies like pressure gradients in pipe flow that couldn't be explained by classical viscosity alone. He even proposed experimental methods to detect wall slip and other flow peculiarities at the first International Congress on Rheology in 1948 [^1]. These experiences convinced Oldroyd that a unifying theoretical description for _complex fluids_ was needed – one that could encompass the behavior of elastic liquids (polymer solutions), viscous suspensions, and even solids with memory. This realization set the stage for his groundbreaking work in 1950.

## The 1950 Breakthrough: Formulating Rheological Equations of State

In 1950, James G. Oldroyd published what is now considered "probably the most important single paper in theoretical rheology."[^6] Titled _"On the Formulation of Rheological Equations of State,"_[^4] this paper established the basic principles for mathematical models of complex fluids.

Oldroyd addressed a fundamental issue: existing viscoelastic models at the time (such as the Jeffreys model) were not _frame-invariant_ – their predictions could depend on the observer's frame of reference, which is unphysical [^5]. Influenced by earlier work of Sir Harold Jeffreys and by a 1946 study of bitumen by H. Fröhlich and R. Sack, Oldroyd recognized that the way one computes the time-derivative of stress in a flowing material is crucial.

In essence, he argued that when a material element moves, rotates, and deforms, the rate-of-change of stress must be evaluated in a _convected frame_ moving with the material. To achieve this, Oldroyd introduced two new definitions of the stress derivative – the upper-convected and lower-convected time derivatives – which account for material rotation and stretching in different ways:

> Lower convective Oldroyd derivative: $$ \stackrel{\triangle}{A} = \frac{DA}{Dt} + \mathbf{A} \cdot (\nabla \mathbf{u})^T + \nabla \mathbf{u} \cdot \mathbf{A}. $$

> Upper convective Oldroyd derivative: $$ \stackrel{\nabla}{A} = \frac{DA}{Dt} - \mathbf{A} \cdot (\nabla \mathbf{u})^T - \nabla \mathbf{u} \cdot \mathbf{A}. $$

Applying these ideas, Oldroyd showed that if one takes the classical _Jeffreys model_ (a combination of an elastic spring and two viscous dashpots) and replaces the ordinary time derivatives with his convected derivatives, one obtains two consistent viscoelastic models [^5]. These he called "Model A" (using the lower-convected derivative) and "Model B" (using the upper-convected derivative) – known today as the Oldroyd-A and Oldroyd-B models [^5].

> Oldroyd-A (Lower convected derivative):  
> $$ \sigma + \tau_1 \stackrel{\triangle}{\sigma} = 2\mu^*(\mathbf{E} + \tau_2 \stackrel{\triangle}{\mathbf{E}}),$$

> Oldroyd-B (Upper convected derivative):  
> $$ \sigma + \tau_1 \stackrel{\nabla}{\sigma} = 2\mu^*(\mathbf{E} + \tau_2 \stackrel{\nabla}{\mathbf{E}})$$

Both models reduce to the same behavior in a stationary reference frame, but they differ in how they predict stresses in flows involving rotation or deformation of the fluid parcel. Oldroyd's 1950 paper thus laid down a clear _frame-indifference_ requirement for rheological equations, a cornerstone for modern continuum mechanics of non-Newtonian fluids. It was a bold theoretical leap that immediately gave researchers two possible constitutive equations for viscoelastic liquids.

> [!danger] Note: Oldroyd, characteristically cautious, noted that choosing between Model A and B `depends on the physics` of the material, though he offered no immediate criteria for selection [^5].

Nonetheless, the mere formulation of these models has been instructive. It provided, for the first time, a concrete mathematical language to describe fluids with both viscous and elastic characteristics (_viscoelastic_ fluids) in a way that is invariant under changes of frame. This achievement earned Oldroyd international recognition – including the Gold Medal of the British Society of Rheology and a special issue of the BSR Bulletin honoring his 60th birthday [^6] – and it set the stage for much of the theoretical rheology that followed.

## Oldroyd-A vs. Oldroyd-B: Weissenberg's Rod-Climbing and the Preferred Model

While Oldroyd initially presented Models A and B as two equally plausible formulations, subsequent insights and experiments soon favored one over the other. In the very same 1950 paper, at the end, Oldroyd himself included a telling calculation: the flow of an elastic liquid around a rotating rod. This was not an arbitrary choice – it related to a famous experiment by Karl Weissenberg a few years earlier.

Weissenberg had observed that when a rod is rotated in a polymer solution, the fluid _climbs up_ the rod against gravity (now known as the Weissenberg effect or rod-climbing effect) due to the elastic normal stresses generated in the fluid. Oldroyd wanted to see how his two model fluids would behave in this scenario. The result was striking: Oldroyd-B (upper-convected) predicted the fluid would climb the rod, matching Weissenberg's observations, whereas Oldroyd-A (lower-convected) predicted the opposite – the fluid would be pushed downwards (a "rod-dropping" effect). The latter phenomenon had never been observed in polymer fluids.

Thus, by comparing both models against empirical reality, Oldroyd-B emerged as the more physically relevant model for polymeric (viscoelastic) fluids. As Oldroyd and others noted, the _rod-climbing test_ essentially singled out Model B as the correct choice for liquids like dilute polymer solutions. Oldroyd commented that Model B should _"be favoured"_ in such cases, aligning with Weissenberg's findings. (Indeed, the inverse "rod-dipping" behavior of Model A was only realized decades later in very different materials, such as dense suspensions of particles, confirming Oldroyd's intuition that the choice depends on the material's microphysics.)

![Weissenberg rod-climbing effect](_Media/James%20G.%20Oldroyd-1741126421305.png)

> A classic demonstration of the Weissenberg rod-climbing effect. A rotating rod in a viscoelastic polymer solution causes the fluid to climb up along the rod, due to positive normal stress differences. Oldroyd's upper-convected Model B correctly captures this effect, whereas Model A would predict a downward dip, which is not observed in polymer fluids. Figure credits: [Henry Ng and Rob Poole, University of Liverpool](https://fluids.ac.uk/gallery/zoomify/665).

Beyond qualitative rod-climbing, more detailed microstructural studies in subsequent years reinforced the supremacy of Oldroyd-B for polymeric liquids. In the 1960s, rheologists developed molecular models of polymer solutions – envisioning long polymer molecules as tiny spring–dashpot elements or "dumbbells" dispersed in a solvent. When John Hinch and others revisited Oldroyd's models in light of these developments, they found a remarkable connection: the simplest molecular model of a polymer chain in flow (the elastic dumbbell model) leads mathematically directly to the Oldroyd-B constitutive equation [^5].

In other words, if one treats a polymer molecule as two beads connected by a spring dragged through a viscous solvent, the macroscopic stress evolution follows Oldroyd's upper-convected form (with the polymer's finite relaxation time corresponding to Oldroyd-B's parameters). This result explained why Oldroyd-B captured many polymer solution behaviors so well – it was essentially _derived from first principles_ of polymer micro-dynamics. Oldroyd-A, in contrast, did not emerge from any analogous physical picture for flexible polymers.

By the late 20th century, therefore, Oldroyd-B had become the standard viscoelastic fluid model for dilute polymer solutions in rheology and computational fluid dynamics, whereas Oldroyd-A largely faded from use. As John Hinch humorously noted, a survey of literature reveals thousands of papers employing "Oldroyd-B" in their title or keywords, but only a handful mentioning "Oldroyd-A".

![Polymer solution model](https://claude.ai/chat/_Media/James%20G.%20Oldroyd-1741126749363.jpeg)

The reason is clear: Oldroyd-B not only passes key experimental tests but also has a firm basis in polymer molecular theory, making it the preferred tool for scientists and engineers modeling viscoelastic flows. The legacy of Oldroyd's 1950 insight is thus encapsulated in the ubiquity of the Oldroyd-B model – a tribute to his ability to capture the essential physics of elastic fluids in a simple equation.

## Later Contributions and Evolving Work

After 1950, Oldroyd continued to build on his framework and ventured into new problems, further cementing his status as a pioneer in rheology. In 1953, he published a notable paper on _"The elastic and viscous properties of emulsions and suspensions."_ [^7] Here, Oldroyd extended his constitutive modeling to multiphase systems, showing how a mixture of a liquid with dispersed droplets or particles could exhibit viscoelastic behavior.

He demonstrated (for a dilute emulsion of liquid droplets) that the interfacial tension of the droplets provides a restoring force against deformation, effectively giving the emulsion an elastic component [^3]. This work was an early example of micro-rheology – linking microscopic structure to macroscopic rheological properties – and it illustrated Oldroyd's knack for generalizing his models to diverse materials. He also investigated the effect of surfactant films on droplet interfaces in emulsions, recognizing that a stabilizing film could alter the combined fluid's elasticity. These studies by Oldroyd in the 1950s are considered pioneering, as they connected continuum rheology with micro-scale mechanisms in suspensions and emulsions.

Oldroyd's theoretical explorations in the mid-1950s also produced insights into what we now call "second-order fluids." In a 1958 paper, he analyzed normal stress effects (differences in normal stresses) in steady flows of idealized viscoelastic liquids, using a general invariant formulation that included up to quadratic terms in stresses [^8]. Notably, he examined the conditions for the Weissenberg effect (rod-climbing) to occur "in a positive or negative sense," essentially exploring the parameter space where a fluid would climb or dip around a rod.

This comprehensive study brought clarity to how non-Newtonian normal stresses arise in shear and rotational flows, and it introduced what became known as the Oldroyd 8-constant model (a generalized linear viscoelastic model with eight material constants). Such work laid the groundwork for later researchers like Coleman, Noll, and Rivlin, who in the same era were developing the modern continuum mechanics of fluids. Oldroyd's approach was always characterized by careful attention to invariant formulation (he cited the earlier convected-coordinate ideas of F. Hencky and others [^3]) and by a desire to keep models as simple as possible while capturing the essential physics.

In 1961, he published a survey in _Rheologica Acta_ on _"the hydrodynamics of materials whose rheological properties are complicated,"_ [^9] reflecting on how to extend classical hydrodynamics to fluids with memory and elasticity. He even ventured into esoteric territory by exploring constitutive equations in a general relativistic context (a 1970 paper on equations of state in general relativity [^10]), showing the breadth of his mathematical curiosity.

Throughout the 1960s and 1970s, Oldroyd remained an active, though not prolific, author. He was selective in his publications, preferring depth over quantity – in nearly 40 years he published fewer than 30 papers [^1], mostly as a single author. Yet those papers are dense with ideas that continued to influence rheology. He developed a theory of viscoplastic boundary layers. He also revisited thermodynamics and continuum mechanics, searching for rheological models consistent with the laws of thermodynamics (as seen in his 1976 reflections). Even in his final years, Oldroyd continued to synthesize his lifetime of insights: his last paper, published posthumously in 1984, was titled _"An approach to non-Newtonian fluid mechanics,"_[^11] offering a grand overview of the field - a treat to read for our generation.

## Influence on the Rheology Community and Honors

Oldroyd's influence extended beyond his written work; he was also a guiding figure and mentor in the rheology community. In 1953, the same year he took up a professorship, he served as Treasurer of the 2nd International Congress of Rheology held in Cambridge [^2] – a gathering of the world's top rheologists. He later became President of the British Society of Rheology (BSR) from 1955 to 1957, helping to shape the direction of rheological research in the UK [^12].

Oldroyd had moved to academia in 1953 as Professor of Mathematics at the University of Wales, Swansea, where he also headed the Applied Mathematics Department from 1957. In 1965, he was appointed Professor at Liverpool University, eventually becoming Head of the Department of Applied Mathematics and Theoretical Physics there [^2]. In these roles, Oldroyd supervised a small number of doctoral students – notably Kenneth Walters, who completed his PhD under Oldroyd at Swansea.

Walters would go on to become a prominent rheologist himself (co-founding the _Journal of Non-Newtonian Fluid Mechanics_ in 1976) and later reminisced that although Oldroyd guided only _"half a dozen"_ PhD students, his impact on them – and on the field – was profound [^13]. Oldroyd's students and colleagues admired his deep physical intuition and his knack for reducing complex problems to their core elements. Amusingly, Walters recalled that Oldroyd was _"no sportsman,"_ yet somehow many of his research students were star cricket players – a coincidence that Oldroyd, with his gentle humor, tolerated even if he didn't share their sporting enthusiasm [^13].

In recognition of his scientific contributions, Oldroyd received numerous honors. Cambridge University awarded him the Adams Prize in 1964, one of its highest accolades in mathematics, for his work on the mechanics of non-Newtonian fluids. The British Society of Rheology bestowed upon him its Gold Medal in 1984 (the year after what would have been Oldroyd's retirement), celebrating a lifetime of achievement in rheology [^2].

Tributes poured in as he reached his 60th birthday in 1981 – the BSR dedicated a special issue of its bulletin to him, and luminaries like professor R. B. Bird lauded Oldroyd's contributions [^6]. In fact, at the 1988 International Congress on Rheology in Sydney, Bob Bird gave an opening lecture entitled _"The Two JG's"_ in honor of J. G. Oldroyd and J. G. Kirkwood – comparing Oldroyd, the continuum mechanician, and Kirkwood, the molecular theorist, as two giants who bridged the gap between macroscopic and microscopic understandings of fluid behavior [^1]. This was a testament to how Oldroyd's work, particularly the Oldroyd-B model, had become a cornerstone that linked molecular theory with continuum modeling.

Unfortunately, James G. Oldroyd's life was cut short in 1982 – he died suddenly of an apparent heart attack while on his way to the university in Liverpool [^2] – but his legacy endures vibrantly. His name is forever attached to the Oldroyd-B model, a staple in rheology textbooks and simulations, and his ideas on convected derivatives underpin all modern viscoelastic fluid theories. In computational fluid dynamics and engineering today, Oldroyd's models are routinely used to simulate polymer processing, biological fluid flows, and complex material behavior, enabling predictions of how materials will respond under flow with both viscous and elastic forces at play.

In hindsight, John Hinch and other colleagues note that Oldroyd's genius was in formulating simple yet physically sound models – _"the first twelve pages"_ of his 1950 paper, as Bob Bird once remarked, _contained the seeds of an entire field_. By following a historical narrative from classical mechanics to modern rheology, Oldroyd essentially wrote the chapter that connects Isaac Newton's fluid (ideal viscous) to James Clerk Maxwell's elastic solid, and in doing so, he helped create the science of rheology as we know it.

His work evolved from early studies of idealized plastic solids to the elegant Oldroyd-B equation, reflecting a consistent vision: to understand and predict the behavior of materials that are not purely solid nor liquid, but something in between. This vision, shaped by great mentors, wartime experiences, industrial collaboration, and personal insight, makes James G. Oldroyd a towering figure in the history of rheology and fluid mechanics – one whose influence is still climbing upward, much like the fluid on Weissenberg's spinning rod.

[^1]: I. A. Frigaard, G. H. McKinley, R. J. Poole & K. Walters, Editorial for special issue on "Oldroyd at 100: Celebrating the impact of JG Oldroyd on non-Newtonian fluid mechanics", J. Non-Newtonian Fluid Mech., 301, 104749 (2022), [Link](https://nnf.mit.edu/sites/default/files/publications/files/Oldroyd_SI_Editorial_FINAL.pdf).

[^2]: James G. Oldroyd – Wikipedia: [German](https://de.wikipedia.org/wiki/James_G._Oldroyd) and [English](https://en.wikipedia.org/wiki/James_G._Oldroyd).

[^3]: R. I. Tanner & K. Walters, Rheology: An Historical Perspective, Elsevier (1998). [Link](https://bit.ly/4bohW0t).

[^4]: J. G. Oldroyd, On the formulation of rheological equations of state, Proc. R. Soc. Lond. A, 200:1063, 523-541 (1950)

[^5]: J. Hinch & O. Harlen, Oldroyd B, and not A?, J. Non-Newtonian Fluid Mech., 298, 104668 (2021) [link](http://www.damtp.cam.ac.uk/user/hinch/publications/Oldroyd12b.pdf#:~:text=Sack%20%281946%29%20,would%20climb%20the%20rod%2C%20as).

[^6]: #TODO needs citation and wikipedia is not it

[^7]: J. G. Oldroyd, The elastic and viscous properties of emulsions and suspensions, Proc. R. Soc. Lond. A, 218:1132, 122-132 (1953)

[^8]: J. G. Oldroyd, Non-Newtonian effects in steady motion of some idealized elastico-viscous liquids, Proc. R. Soc. Lond. A, 245:1241, 278-297 (1958).

[^9]: J. G. Oldroyd, The hydrodynamics of materials whose rheological properties are complicated, Rheol. Acta, 1:4, 337-344 (1961)

[^10]: J. G. Oldroyd, Equations of state of continuous matter in general relativity, Proc. R. Soc. Lond. A, 316:1524, 1-28 (1970)

[^11]: J. G. Oldroyd, An approach to non-Newtonian fluid mechanics, J. Non-Newtonian Fluid Mech., 14, 9-46 (1984)

[^12]: [Former BSR Presidents - British Society of Rheology](https://www.bsr.org.uk/pages/former-bsr-presidents#:~:text=Image%3A%20Photo%20of%20Oldroyd)

[^13]: [Oral History Interviews, Kenneth Walters - American Institute of Physics](https://www.aip.org/history-programs/niels-bohr-library/oral-histories/47534#:~:text=match%20at%20L1785%20The%20amazing,Fluid%20Mechanics%2C%E2%80%99%E2%80%99%20Journal%20of%20Non)