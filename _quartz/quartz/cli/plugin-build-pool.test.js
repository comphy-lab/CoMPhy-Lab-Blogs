import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { test } from "node:test"
import { buildPluginsInParallel, pluginBuildConcurrency } from "./plugin-build-pool.js"

test("plugin build concurrency accepts only one through four workers", () => {
  assert.equal(pluginBuildConcurrency(""), 3)
  assert.equal(pluginBuildConcurrency("1"), 1)
  assert.equal(pluginBuildConcurrency("4"), 4)
  for (const value of ["0", "5", "2.5", "many"]) {
    assert.throws(() => pluginBuildConcurrency(value), /integer from 1 to 4/)
  }
})

test("plugin builds overlap within the limit and retain failures by input order", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "quartz-plugin-pool-"))
  const trace = path.join(directory, "trace.log")
  const worker = path.join(directory, "worker.mjs")
  fs.writeFileSync(
    worker,
    `import fs from "node:fs"
const name = process.argv[3]
fs.appendFileSync(process.env.POOL_TRACE, "start " + name + "\\n")
await new Promise((done) => setTimeout(done, 150))
fs.appendFileSync(process.env.POOL_TRACE, "end " + name + "\\n")
if (name === "bad") process.exitCode = 1
else process.stdout.write("built " + name + "\\n")
`,
  )

  try {
    const names = ["one", "two", "bad", "four", "five"]
    const results = await buildPluginsInParallel(
      names.map((name) => ({ name, pluginDir: path.join(directory, name) })),
      { worker, concurrency: 3, env: { ...process.env, POOL_TRACE: trace } },
    )
    assert.deepEqual(results.map((result) => result.success), [true, true, false, true, true])
    assert.deepEqual(
      results.map((result) => result.stdout.trim()),
      ["built one", "built two", "", "built four", "built five"],
    )

    let active = 0
    let peak = 0
    const events = fs.readFileSync(trace, "utf8").trim().split("\n")
    for (const event of events) {
      active += event.startsWith("start ") ? 1 : -1
      peak = Math.max(peak, active)
      assert(active >= 0)
    }
    assert.equal(active, 0)
    assert.equal(events.length, names.length * 2)
    assert(peak >= 2, `expected overlapping workers, saw ${peak}`)
    assert(peak <= 3, `worker limit exceeded: ${peak}`)
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})
