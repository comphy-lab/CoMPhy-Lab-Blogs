# Browser security boundary

This note records the live browser-security boundary observed on 7 September
2026. It does not change production headers or close GitHub Issue
[#3](https://github.com/comphy-lab/comphy-lab-blogs/issues/3).

## Service and ownership

`https://blogs.comphy-lab.org/` is the canonical site and returns the Obsidian
Publish application. `https://blogs-comphy-lab.org/` redirects permanently to
the canonical hostname.

The boundary has three owners:

- This repository owns published Markdown, local media, `publish.css`, and any
  deliberately added root `publish.js`. Obsidian documents those two root files
  as the supported CSS and JavaScript customization points in its
  [Publish customization guide](https://obsidian.md/help/publish/customize).
- Obsidian Publish owns the generated HTML application, feature scripts and
  baseline Content Security Policy. Repository content changes do not directly
  rewrite that provider policy.
- Cloudflare owns the proxied custom-domain edge. It can add, replace or remove
  browser response headers through separately managed
  [Response Header Transform Rules](https://developers.cloudflare.com/rules/transform/response-header-modification/).
  A rule is effective only after live readback proves that it matches this
  hostname and returns the intended header.

## Observed response policy

The canonical homepage returned `200`. Its Content Security Policy was:

```text
default-src 'self' *.obsidian.md;
script-src 'self' 'unsafe-inline' 'unsafe-eval' *.obsidian.md blob: https://*:*;
frame-src 'self' https://*:* http://127.0.0.1:*;
child-src 'self' * blob:;
style-src 'self' 'unsafe-inline' https://*:* http://127.0.0.1:*;
font-src * https://*:* data: blob:;
img-src * data: blob:;
media-src * data: blob:;
connect-src 'self' 'unsafe-eval' ws://*:* http://*:*
```

This is a broad compatibility policy. In particular, it permits inline and
evaluated scripts and wide network, frame, image, media and font sources. The
snapshot does not establish that every allowed source is needed or safe.

The response also included:

- `Strict-Transport-Security: max-age=15552000; includeSubDomains`;
- `X-Content-Type-Options: nosniff`.

It did not include `X-Frame-Options`, `Referrer-Policy` or
`Permissions-Policy`. Framing protection also was not present as a
`frame-ancestors` directive in the observed CSP. The path
`/.well-known/security.txt` returned the Publish HTML application rather than
an [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116.html) security contact
document.

These are tracked limitations. They are not evidence of a demonstrated attack,
and no stricter production policy has yet passed compatibility testing.

## Required staged hardening work

Before changing the production CSP or adding a second policy at Cloudflare:

1. Map each Publish feature and repository customization to the script, style,
   connection, image, media and frame sources it actually uses. Record provider
   shell sources separately from repository-owned sources.
2. Capture a reproducible baseline for homepage and representative nested
   pages. Exercise search, mathematical rendering, internal and external links,
   local and remote images, supported embeds, downloads, navigation, theme and
   mobile layout.
3. Test one restriction at a time on a non-production or otherwise isolated
   surface. Inspect browser console violations and network failures across
   desktop and mobile engines. Do not infer safety from a page merely loading.
4. Remember that a second enforced CSP combines with the provider policy; it
   does not simply replace it. Re-run the complete baseline after each change.
5. Define rollback before deployment. Preserve the prior rule, deploy the
   smallest reviewed change, read the live headers back, and restore the prior
   rule if any required feature regresses.

The missing `Referrer-Policy`, framing control, `Permissions-Policy` and valid
`security.txt` each need an explicit owner and delivery route. Cloudflare may
be appropriate for response headers, but the final choice must account for
Obsidian's generated application and be verified at the canonical hostname.

Issue #3 remains incomplete until the feature-to-source map, staged browser
matrix, selected provider or edge configuration, rollback plan, live deployment
and post-deployment readback all exist.
