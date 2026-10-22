// Deploys never block on stale TeX PDFs; a local build:cloudflare does, so a
// renamed vault file or an edited note cannot quietly swap every lecture's TeX
// PDF for a browser copy. Kept outside scripts/tex/: those files are TeX
// fingerprint inputs, and editing them would make every PDF stale.

export function requireFreshTex(env) {
  return !env.WORKERS_CI && !env.CI && env.ALLOW_STALE_TEX_PDFS !== "1"
}

// Why a parsed manifest cannot be used at all, or null when it can.
export function manifestDefect(manifest) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest))
    return "not a JSON object"
  if (manifest.version !== 1) return `unsupported version ${JSON.stringify(manifest.version)}`
  const { pages } = manifest
  if (!pages || typeof pages !== "object" || Array.isArray(pages)) return "no page map"
  return null
}

// Pages that had a TeX PDF but now fall back to the browser, and entries whose
// note has moved or gone (a full build:tex-pdfs drops those). A page that never
// had one (new, or refused by the converter) is not a regression.
export function texRegressions(manifest, stale, files) {
  if (manifestDefect(manifest)) return []
  const present = new Set(files)
  return [
    ...stale.filter(({ source }) => Object.hasOwn(manifest.pages, source)),
    ...Object.keys(manifest.pages)
      .filter((source) => !present.has(source))
      .map((source) => ({ source, reason: "note moved or removed" })),
  ]
}
