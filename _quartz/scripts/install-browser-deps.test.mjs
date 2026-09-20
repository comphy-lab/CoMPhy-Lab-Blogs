import assert from "node:assert/strict"
import { test } from "node:test"
import { aptConfig, inspectAptPlan } from "./install-browser-deps.mjs"

test("APT config isolates writes and hooks while keeping system signed sources", () => {
  const config = aptConfig("/tmp/browser-runtime/run-1")
  assert.match(config, /Dir::Etc::main "\/dev\/null"/)
  assert.match(config, /Dir::Etc::parts "\/tmp\/browser-runtime\/run-1\/apt\/empty-etc"/)
  assert.match(config, /Dir::Etc::sourceparts "\/etc\/apt\/sources.list.d"/)
  assert.match(config, /Dir::Etc::trustedparts "\/etc\/apt\/trusted.gpg.d"/)
  assert.match(config, /Dir::State::status "\/tmp\/browser-runtime\/run-1\/apt\/status"/)
  assert.match(config, /Dir::State::lists "\/tmp\/browser-runtime\/run-1\/apt\/lists"/)
  assert.match(config, /Dir::Cache::archives "\/tmp\/browser-runtime\/run-1\/apt\/archives"/)
  assert.match(config, /APT::Get::Download-Only "true"/)
  assert.match(config, /APT::Get::AllowUnauthenticated "false"/)
  assert.match(config, /Acquire::AllowInsecureRepositories "false"/)
})

test("APT plan accepts missing packages and compatible private upgrades", () => {
  assert.deepEqual(inspectAptPlan("Inst libatk1.0-0t64 (2.52.0 Ubuntu:24.04)\nInst libnss3 [3.9] (3.10 Ubuntu:24.04)\nConf libatk1.0-0t64"), [
    "libatk1.0-0t64", "libnss3",
  ])
})

test("APT plan refuses removals and core loader upgrades", () => {
  assert.throws(() => inspectAptPlan("Remv libgbm1 [24.0]"), /planned a removal/)
  assert.throws(() => inspectAptPlan("Inst libc6:amd64 [2.39] (2.40 Ubuntu:24.04)"), /core runtime upgrade/)
  assert.throws(() => inspectAptPlan("Inst libstdc++6 [14.2] (14.3 Ubuntu:24.04)"), /core runtime upgrade/)
})
