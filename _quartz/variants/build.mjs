// Build every design variant (or the ones named on the command line) into
// public-variants/<key>/ with same-origin absolute URLs for the review host.
import { spawnSync } from "node:child_process"
import path from "node:path"
import { VARIANTS, RETIRED, REVIEW_HOST } from "./variants.mjs"

const root = path.resolve(import.meta.dirname, "..")
const wanted = process.argv.slice(2)
// Retired round-1 variants can still be built by name; they are never built by default.
const all = [...VARIANTS, ...RETIRED.map((v, i) => ({ ...v, name: "retired", port: 8900 + i }))]
const selected = wanted.length ? all.filter((v) => wanted.includes(v.key)) : VARIANTS
if (wanted.length && selected.length !== wanted.length) {
  console.error(`Unknown variant among: ${wanted.join(", ")}`)
  process.exit(1)
}

const generation = spawnSync("node", ["variants/make-configs.mjs"], {
  cwd: root,
  stdio: "inherit",
})
if (generation.status !== 0) process.exit(generation.status ?? 1)

for (const variant of selected) {
  console.log(`\n=== building ${variant.key} (${variant.name}) ===`)
  const result = spawnSync(
    "node",
    ["quartz/bootstrap-cli.mjs", "build", "-d", "..", "-o", `public-variants/${variant.key}`],
    {
      cwd: root,
      stdio: "inherit",
      env: {
        ...process.env,
        QUARTZ_CONFIG: `variants/${variant.key}/quartz.config.yaml`,
        QUARTZ_THEME: variant.key,
        QUARTZ_BASE_URL: `${REVIEW_HOST}:${variant.port}`,
      },
    },
  )
  if (result.status !== 0) {
    console.error(`build failed for ${variant.key}`)
    process.exit(result.status ?? 1)
  }
}
