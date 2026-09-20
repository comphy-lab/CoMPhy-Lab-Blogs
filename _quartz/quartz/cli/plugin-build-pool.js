import { execFile } from "node:child_process"
import { fileURLToPath } from "node:url"

const defaultWorker = fileURLToPath(new URL("./plugin-build-worker.js", import.meta.url))

export function pluginBuildConcurrency(raw = process.env.QUARTZ_PLUGIN_BUILD_CONCURRENCY) {
  if (raw === undefined || raw === "") return 3
  const value = Number(raw)
  if (!Number.isInteger(value) || value < 1 || value > 4) {
    throw new Error("QUARTZ_PLUGIN_BUILD_CONCURRENCY must be an integer from 1 to 4")
  }
  return value
}

/** Build independent, already-cloned plugins without sharing mutable npm directories. */
export async function buildPluginsInParallel(
  plugins,
  {
    concurrency = pluginBuildConcurrency(),
    worker = defaultWorker,
    cwd = process.cwd(),
    env = process.env,
    onResult,
  } = {},
) {
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 4) {
    throw new Error("Plugin build concurrency must be an integer from 1 to 4")
  }

  const results = new Array(plugins.length)
  let next = 0

  async function run() {
    while (next < plugins.length) {
      const index = next++
      const { pluginDir, name } = plugins[index]
      const started = Date.now()
      results[index] = await new Promise((resolve) => {
        execFile(
          process.execPath,
          [worker, pluginDir, name],
          { cwd, env, maxBuffer: 1024 * 1024 },
          (error, stdout, stderr) => {
            resolve({
              success: error === null,
              stdout: stdout ?? "",
              stderr: stderr ?? "",
              durationMs: Date.now() - started,
            })
          },
        )
      })
      onResult?.(results[index], plugins[index])
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, plugins.length) }, () => run()))
  return results
}
