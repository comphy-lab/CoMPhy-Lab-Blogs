#!/usr/bin/env node

import { execFileSync, spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { writeFile } from "node:fs/promises"
import { createServer } from "node:net"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { setTimeout as sleep } from "node:timers/promises"

const quartzRoot = resolve(fileURLToPath(new URL("..", import.meta.url)))
const repoRoot = resolve(quartzRoot, "..")
const bin = (name) => resolve(quartzRoot, "node_modules", ".bin", name)
const npm = process.platform === "win32" ? "npm.cmd" : "npm"
const isUnix = process.platform !== "win32"
let activeChild
let preview
let previewError
let previewLog = []
let interrupted = false

function stopChild(child, signal = "SIGTERM") {
  if (!child?.pid || child.exitCode !== null || child.signalCode !== null) return
  try {
    process.kill(isUnix ? -child.pid : child.pid, signal)
  } catch (error) {
    if (error.code !== "ESRCH") throw error
  }
}

async function run(label, command, args, env = process.env) {
  if (interrupted) throw new Error("Build interrupted")
  console.log(`\n[build:cloudflare] ${label}`)
  const child = spawn(command, args, {
    cwd: quartzRoot,
    env,
    stdio: "inherit",
    detached: isUnix,
  })
  activeChild = child
  try {
    const code = await new Promise((done, reject) => {
      child.once("error", reject)
      child.once("exit", (status, signal) => {
        if (signal) reject(new Error(`${label} stopped by ${signal}`))
        else done(status)
      })
    })
    if (code !== 0) throw new Error(`${label} failed with exit code ${code}`)
  } finally {
    activeChild = undefined
  }
}

async function unusedPort() {
  const server = createServer()
  return new Promise((done, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", () => {
      const address = server.address()
      server.close((error) => (error ? reject(error) : done(address.port)))
    })
  })
}

async function waitForPreview(baseUrl) {
  const deadline = Date.now() + 90_000
  while (Date.now() < deadline) {
    if (interrupted) throw new Error("Build interrupted")
    if (previewError) throw previewError
    if (preview.exitCode !== null || preview.signalCode !== null)
      throw new Error("Wrangler preview exited before readiness")
    try {
      const response = await fetch(baseUrl, { signal: AbortSignal.timeout(2_000) })
      if (response.ok && response.headers.get("content-type")?.includes("text/html")) return
    } catch {
      // Wrangler may still be starting; retry until the deadline.
    }
    await sleep(1_000)
  }
  throw new Error("Wrangler preview did not serve HTML within 90 seconds")
}

async function closePreview() {
  if (!preview) return
  const child = preview
  preview = undefined
  stopChild(child)
  if (child.exitCode !== null || child.signalCode !== null) return
  await Promise.race([new Promise((done) => child.once("exit", done)), sleep(5_000)])
  if (child.exitCode === null) stopChild(child, "SIGKILL")
}

async function waitForPortRelease(port) {
  const deadline = Date.now() + 10_000
  while (Date.now() < deadline) {
    const server = createServer()
    try {
      await new Promise((done, reject) => {
        server.once("error", reject)
        server.listen(port, "127.0.0.1", done)
      })
      await new Promise((done) => server.close(done))
      return
    } catch (error) {
      if (server.listening) await new Promise((done) => server.close(done))
      if (error.code !== "EADDRINUSE") throw error
      await sleep(250)
    }
  }
  throw new Error(`Preview port ${port} remained occupied after Wrangler stopped`)
}

async function startPreview(port) {
  const baseUrl = `http://127.0.0.1:${port}`
  previewError = undefined
  previewLog = []
  console.log(`\n[build:cloudflare] starting Wrangler preview at ${baseUrl}`)
  preview = spawn(bin("wrangler"), ["dev", "--ip", "127.0.0.1", "--port", String(port)], {
    cwd: quartzRoot,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
    detached: isUnix,
  })
  preview.once("error", (error) => {
    previewError = error
  })
  for (const stream of [preview.stdout, preview.stderr]) {
    stream.on("data", (chunk) => {
      previewLog.push(String(chunk))
      if (previewLog.length > 100) previewLog.shift()
    })
  }
  await waitForPreview(baseUrl)
  return baseUrl
}

async function writeBuildInfo() {
  const commit = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim()
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error("Git HEAD is not a full commit SHA")
  const dirty = Boolean(
    execFileSync("git", ["status", "--porcelain"], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim(),
  )
  const receipt = { commit, generatedAt: new Date().toISOString(), dirty }
  await writeFile(resolve(quartzRoot, "public", "build-info.json"), `${JSON.stringify(receipt)}\n`)
}

const onSignal = () => {
  interrupted = true
  process.exitCode = 1
  stopChild(activeChild)
  stopChild(preview)
}
process.once("SIGINT", onSignal)
process.once("SIGTERM", onSignal)

try {
  if (process.cwd() !== quartzRoot) {
    throw new Error(`Run from ${quartzRoot}: npm run build:cloudflare`)
  }
  for (const tool of ["tsc", "tsx", "playwright", "wrangler"]) {
    if (!existsSync(bin(tool))) throw new Error(`Missing ${tool}; run npm ci in _quartz first`)
  }

  await run("install Playwright Chromium", bin("playwright"), [
    "install",
    ...(process.env.PLAYWRIGHT_INSTALL_SYSTEM_DEPS === "1" ? ["--with-deps"] : []),
    "chromium",
  ])
  await run("verify Chromium can launch before compiling plugins", process.execPath, [
    "--input-type=module",
    "-e",
    'import { chromium } from "playwright"; const browser = await chromium.launch({ headless: true }); await browser.close();',
  ])
  await run("restore locked Quartz plugins", npm, ["run", "plugins:restore"])
  await run("check TypeScript without incremental cache", bin("tsc"), [
    "--noEmit",
    "--incremental",
    "false",
  ])
  await run("run unit tests", npm, ["test"])
  await run("build Quartz site", npm, ["run", "build"])
  await writeBuildInfo()

  const port = await unusedPort()
  const baseUrl = `http://127.0.0.1:${port}`
  try {
    await startPreview(port)
    await run(
      "render published PDFs and link generated HTML",
      npm,
      ["run", "build:pdfs", "--", "--inject-links"],
      {
        ...process.env,
        E2E_BASE_URL: baseUrl,
      },
    )
    await closePreview()
    await waitForPortRelease(port)
    await startPreview(port)
    await run("verify every route and interaction", npm, ["run", "test:e2e"], {
      ...process.env,
      E2E_BASE_URL: baseUrl,
    })
  } catch (error) {
    console.error(previewLog.join(""))
    throw error
  }
  console.log("\n[build:cloudflare] verified site is ready for Workers Builds upload")
} catch (error) {
  console.error(`[build:cloudflare] ${error.message}`)
  process.exitCode = 1
} finally {
  await closePreview()
  process.removeListener("SIGINT", onSignal)
  process.removeListener("SIGTERM", onSignal)
}
