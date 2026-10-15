// This module also runs in Workers Builds: no TeX, Pandoc or TypeScript runtime.
import { createHash } from "node:crypto"
import { readFile, realpath } from "node:fs/promises"
import { resolve, sep } from "node:path"
import { globby } from "globby"
import YAML from "yaml"

export const pipelineInputs = [
  "_quartz/scripts/build-tex-pdfs.ts",
  "_quartz/scripts/tex/prepare.ts",
  "_quartz/scripts/tex/safety.ts",
  "_quartz/scripts/tex/images.ts",
  "_quartz/scripts/tex/manifest.mjs",
  "_quartz/scripts/tex/lecture.tex",
  "_quartz/scripts/tex/lecture.lua",
  "_quartz/quartz/plugins/site-math.ts",
  "_quartz/quartz/plugins/site-links.ts",
  "_quartz/quartz/plugins/site-media.ts",
  "_quartz/package-lock.json",
  "_quartz/quartz.config.yaml",
]
export const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex")
export const pdfPathFor = (source) => `${source.startsWith("Blog/") ? source.slice(5) : source}.pdf`

export function safePath(root, name) {
  const path = resolve(root, name)
  if (!path.startsWith(resolve(root) + sep)) throw new Error(`Unsafe input path: ${name}`)
  return path
}

export async function readInput(root, name) {
  const path = safePath(root, name)
  const actual = await realpath(path)
  if (!actual.startsWith(resolve(root) + sep)) throw new Error(`Input outside vault: ${name}`)
  return readFile(path)
}

// Names affect shortest-link resolution, even when a newly added page/image
// was not a dependency of the previous conversion. Do not follow symlinks.
export async function vaultFiles(root) {
  const config = YAML.parse((await readInput(root, "_quartz/quartz.config.yaml")).toString())
  return (
    await globby("**/*", {
      cwd: root,
      ignore: config.configuration.ignorePatterns,
      onlyFiles: true,
      followSymbolicLinks: false,
    })
  ).sort()
}

export async function fingerprint(root, dependencies, files) {
  const inputs = {}
  for (const name of [...new Set([...pipelineInputs, ...dependencies])].sort()) {
    inputs[name] = sha256(await readInput(root, name))
  }
  inputs["@vault-paths"] = sha256(JSON.stringify(files))
  return { inputs, sha256: sha256(JSON.stringify(inputs)) }
}

export function validPdf(bytes) {
  return (
    bytes.length >= 1024 &&
    bytes.subarray(0, 5).toString() === "%PDF-" &&
    bytes.subarray(-1024).toString().includes("%%EOF")
  )
}

export async function freshTexPdf(root, source, manifest, files) {
  try {
    if (manifest?.version !== 1) return { reason: "missing or unsupported manifest" }
    const entry = manifest.pages?.[source]
    if (!entry) return { reason: "no manifest entry" }
    const expected = pdfPathFor(source.slice(0, -3))
    if (entry.pdf !== expected || !entry.dependencies?.includes(source))
      return { reason: "invalid manifest entry" }
    const current = await fingerprint(root, entry.dependencies, files)
    if (current.sha256 !== entry.sha256) return { reason: "inputs changed" }
    const bytes = await readInput(root, `_quartz/tex-pdfs/${expected}`)
    if (!validPdf(bytes) || sha256(bytes) !== entry.pdfSha256)
      return { reason: "missing, damaged or changed PDF" }
    return { bytes, entry }
  } catch (error) {
    return { reason: `unavailable input or PDF (${error.message})` }
  }
}
