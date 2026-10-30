// This module also runs in Workers Builds: no TeX, Pandoc or TypeScript runtime.
import { createHash } from "node:crypto"
import { readFile, realpath } from "node:fs/promises"
import { posix, resolve, sep } from "node:path"
import { globby } from "globby"
import YAML from "yaml"
import { slugifyFilePath } from "@quartz-community/utils"

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
export const isTexPdfSource = (source) => /^(?:Lecture-Notes|Talks)\/.+\.md$/.test(source)

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

// Short links can change when another file with the same slug basename is
// added. Unrelated filenames cannot affect them. Include every candidate,
// including ambiguous and currently unresolved queries.
export function linkInventory(files, targets) {
  const names = new Set()
  for (const target of targets) {
    if (!target || /^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(target)) continue
    let pathname = target.split(/[?#]/)[0]
    if (!pathname) continue
    try {
      pathname = decodeURI(pathname)
    } catch (error) {
      if (!(error instanceof URIError)) throw error
    }
    names.add(posix.basename(slugifyFilePath(pathname)))
  }
  const candidates = new Map([...names].map((name) => [name, []]))
  for (const file of files) {
    const name = posix.basename(slugifyFilePath(file))
    candidates.get(name)?.push(file)
  }
  return [...candidates]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([name, paths]) => [name, paths.sort()])
}

export async function fingerprint(root, dependencies, files, lookups) {
  const inputs = {}
  for (const name of [...new Set([...pipelineInputs, ...dependencies])].sort()) {
    inputs[name] = sha256(await readInput(root, name))
  }
  if (lookups === undefined) {
    // Retain validation of older entries until they are regenerated.
    inputs["@vault-paths"] = sha256(JSON.stringify(files))
  } else {
    if (
      !Array.isArray(lookups.links) ||
      !Array.isArray(lookups.missingPaths) ||
      [...lookups.links, ...lookups.missingPaths].some((path) => typeof path !== "string")
    )
      throw new Error("Invalid PDF lookup record")
    inputs["@link-candidates"] = sha256(JSON.stringify(linkInventory(files, lookups.links)))
    const missing = [...new Set(lookups.missingPaths)].sort()
    for (const name of missing) {
      let present = false
      try {
        await readInput(root, name)
        present = true
      } catch (error) {
        if (error.code !== "ENOENT") throw error
      }
      if (present) throw new Error(`Previously absent input now exists: ${name}`)
    }
    inputs["@missing-paths"] = sha256(JSON.stringify(missing))
  }
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
    const current = await fingerprint(root, entry.dependencies, files, entry.lookups)
    if (current.sha256 !== entry.sha256) return { reason: "inputs changed" }
    const bytes = await readInput(root, `_quartz/tex-pdfs/${expected}`)
    if (!validPdf(bytes) || sha256(bytes) !== entry.pdfSha256)
      return { reason: "missing, damaged or changed PDF" }
    return { bytes, entry }
  } catch (error) {
    return { reason: `unavailable input or PDF (${error.message})` }
  }
}
