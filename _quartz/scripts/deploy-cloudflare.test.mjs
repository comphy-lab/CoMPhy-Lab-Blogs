import { test } from "node:test"
import assert from "node:assert/strict"
import { validateDeployment } from "./deploy-cloudflare.mjs"

const head = "a".repeat(40)
const remoteMain = head
const receipt = { commit: head, generatedAt: "2026-09-20T12:00:00.000Z", dirty: false }

test("deploy guard accepts only a clean receipt for current origin/main", () => {
  assert.doesNotThrow(() => validateDeployment({ receipt, head, dirty: false, remoteMain }))
  assert.throws(
    () =>
      validateDeployment({ receipt: { ...receipt, dirty: true }, head, dirty: false, remoteMain }),
    /marked dirty/,
  )
  assert.throws(
    () => validateDeployment({ receipt, head, dirty: true, remoteMain }),
    /worktree is dirty/,
  )
  assert.throws(
    () => validateDeployment({ receipt, head, dirty: false, remoteMain: "b".repeat(40) }),
    /no longer origin\/main/,
  )
  assert.throws(
    () =>
      validateDeployment({
        receipt: { ...receipt, commit: "c".repeat(40) },
        head,
        dirty: false,
        remoteMain,
      }),
    /does not match local HEAD/,
  )
})
