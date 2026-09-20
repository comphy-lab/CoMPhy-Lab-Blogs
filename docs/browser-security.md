# Browser security boundary

Quartz builds the HTML, JavaScript and CSS from this repository. Cloudflare
Workers serves the static output at `blogs.comphy-lab.org` after the domain
cutover. Obsidian remains an editor; its former Publish application and
Content Security Policy are no longer the site's security boundary. The old
`blogs-comphy-lab.org` hostname redirects to the canonical hostname.

The repository owns Markdown, media, Quartz components and any static response
header file deliberately placed in the Worker asset bundle. Cloudflare owns
the Worker, custom domain, and separately managed edge response-header rules.
An edge rule is effective only if its expression matches the blog hostname and
live readback returns the expected header. In the cutover audit, the observed
zone response-header transform applied to the main `comphy-lab.org` hostname,
not the blog, and no blog-specific override was found. That observation is not
a substitute for post-cutover readback.

## Historical baseline

The 7 September 2026 audit recorded a broad CSP and HSTS on the former
Obsidian Publish response. Those provider headers are historical evidence,
not the policy to copy to the Worker. In particular, a policy allowing
`'unsafe-eval'`, wide `https://*:*` sources and arbitrary frames should not
be adopted merely to make the migration pass.

## Header changes

Do not add or weaken a broad CSP or Cloudflare header transform as a shortcut
for the cutover. First identify the sources needed by Quartz search, MathJax,
same-origin graph libraries, popovers, images, PDFs and any supported embeds.
Then test one proposed restriction on an isolated Worker preview across
desktop and mobile, inspecting console violations and network failures. A
second enforced CSP combines with an existing one; it does not simply replace
it. Preserve the prior Worker version or rule for rollback, and read back the
headers at the canonical hostname after deployment.

The [publishing workflow](publishing.md) verifies generated pages, links,
assets and interactions. It does not certify a new security policy. Framing
control, referrer and permissions policies, a valid
[`security.txt`](https://www.rfc-editor.org/rfc/rfc9116.html), and a scoped CSP
remain separate hardening decisions tracked in GitHub Issue
[#3](https://github.com/comphy-lab/comphy-lab-blogs/issues/3).
