// Build every design variant (or the ones named on the command line) into
// public-variants/<key>/ with same-origin absolute URLs for the review host.
import { spawnSync } from "node:child_process";
import path from "node:path";
import { VARIANTS, REVIEW_HOST } from "./variants.mjs";

const root = path.resolve(import.meta.dirname, "..");
const wanted = process.argv.slice(2);
const selected = wanted.length
  ? VARIANTS.filter((v) => wanted.includes(v.key))
  : VARIANTS;
if (wanted.length && selected.length !== wanted.length) {
  console.error(`Unknown variant among: ${wanted.join(", ")}`);
  process.exit(1);
}

spawnSync("node", ["variants/make-configs.mjs"], {
  cwd: root,
  stdio: "inherit",
});

for (const variant of selected) {
  console.log(`\n=== building ${variant.key} (${variant.name}) ===`);
  const result = spawnSync(
    "node",
    [
      "quartz/bootstrap-cli.mjs",
      "build",
      "-d",
      "..",
      "-o",
      `public-variants/${variant.key}`,
    ],
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
  );
  if (result.status !== 0) {
    console.error(`build failed for ${variant.key}`);
    process.exit(result.status ?? 1);
  }
}
