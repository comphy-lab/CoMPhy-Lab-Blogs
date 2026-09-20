#!/usr/bin/env node

import { execFileSync, spawn } from "node:child_process"
import { readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

const quartzRoot = resolve(fileURLToPath(new URL("..", import.meta.url)))
const repoRoot = resolve(quartzRoot, "..")
const fullSha = /^[0-9a-f]{40}$/

export function validateDeployment({ receipt, head, dirty, remoteMain }) {
  if (!receipt || !fullSha.test(receipt.commit) || receipt.dirty !== false) {
    throw new Error("Build receipt is missing, invalid, or marked dirty")
  }
  if (!fullSha.test(head) || receipt.commit !== head) {
    throw new Error("Build receipt does not match local HEAD")
  }
  if (dirty) throw new Error("Local Git worktree is dirty")
  if (!fullSha.test(remoteMain) || remoteMain !== head) {
    throw new Error("Local HEAD is no longer origin/main")
  }
}

function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: repoRoot,
      encoding: "utf8",
      timeout: 30_000,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    }).trim()
  } catch {
    // Git errors can include credential-bearing remote URLs; do not print them.
    throw new Error("Could not verify Git publication state")
  }
}

async function deploy() {
  if (process.cwd() !== quartzRoot) throw new Error("Run npm run deploy from _quartz")
  let receipt
  try {
    receipt = JSON.parse(await readFile(resolve(quartzRoot, "public", "build-info.json"), "utf8"))
  } catch {
    throw new Error("Missing or invalid public/build-info.json")
  }
  const head = git(["rev-parse", "HEAD"])
  const dirty = git(["status", "--porcelain"]).length > 0
  const remoteLine = git(["ls-remote", "--exit-code", "origin", "refs/heads/main"])
  const remoteMain = /^([0-9a-f]{40})\trefs\/heads\/main$/.exec(remoteLine)?.[1]
  validateDeployment({ receipt, head, dirty, remoteMain })

  const wrangler = resolve(quartzRoot, "node_modules", ".bin", "wrangler")
  if (!existsSync(wrangler)) throw new Error("Pinned Wrangler is not installed")
  console.log(`[deploy] verified clean ${head} at origin/main; starting Wrangler deploy`)
  const child = spawn(wrangler, ["deploy"], {
    cwd: quartzRoot,
    env: process.env,
    stdio: ["ignore", "inherit", "inherit"],
  })
  const interrupt = () => child.kill("SIGTERM")
  process.once("SIGINT", interrupt)
  process.once("SIGTERM", interrupt)
  try {
    const status = await new Promise((done, reject) => {
      child.once("error", () => reject(new Error("Wrangler deploy could not start")))
      child.once("exit", (code, signal) => {
        if (signal || code !== 0) reject(new Error("Wrangler deploy failed"))
        else done(code)
      })
    })
    if (status === 0) console.log(`[deploy] Wrangler completed for ${head}`)
  } finally {
    process.removeListener("SIGINT", interrupt)
    process.removeListener("SIGTERM", interrupt)
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  deploy().catch((error) => {
    console.error(`[deploy] ${error.message}`)
    process.exitCode = 1
  })
}
