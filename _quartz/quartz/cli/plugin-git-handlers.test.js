import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { test } from "node:test"
import { fileURLToPath, pathToFileURL } from "node:url"

function verifyRestoreRepair({ rootExport, prebuilt = false }) {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "quartz-plugin-restore-"))
  const pluginDir = path.join(workspace, ".quartz", "plugins", "fixture")

  try {
    fs.mkdirSync(pluginDir, { recursive: true })
    fs.writeFileSync(
      path.join(pluginDir, "package.json"),
      JSON.stringify({
        name: "@quartz-community/fixture",
        version: "1.0.0",
        exports: { ".": rootExport },
        scripts: { prepare: "node prepare.cjs", build: "node build.cjs" },
      }),
    )
    fs.writeFileSync(
      path.join(pluginDir, "prepare.cjs"),
      "require('node:fs').writeFileSync('prepared', 'yes')\n",
    )
    fs.writeFileSync(
      path.join(pluginDir, "build.cjs"),
      "const fs = require('node:fs'); fs.mkdirSync('dist', { recursive: true }); fs.writeFileSync('dist/index.js', 'export const fixture = true'); fs.writeFileSync('dist/index.d.ts', 'export declare const fixture: true'); fs.writeFileSync('dist/conditional.js', 'export const conditional = true')\n",
    )

    execFileSync(
      "npm",
      ["install", "--package-lock-only", "--ignore-scripts", "--no-audit", "--no-fund"],
      { cwd: pluginDir, stdio: "ignore" },
    )
    execFileSync("git", ["init", "-q"], { cwd: pluginDir })
    execFileSync("git", ["add", "."], { cwd: pluginDir })
    execFileSync(
      "git",
      [
        "-c",
        "user.name=Quartz Test",
        "-c",
        "user.email=quartz-test@example.invalid",
        "commit",
        "-qm",
        "Add fixture plugin",
      ],
      { cwd: pluginDir },
    )
    const commit = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: pluginDir,
      encoding: "utf8",
    }).trim()
    fs.writeFileSync(
      path.join(workspace, "quartz.lock.json"),
      JSON.stringify({
        version: "1.0.0",
        plugins: { fixture: { commit, resolved: "unused" } },
      }),
    )
    if (prebuilt) {
      fs.mkdirSync(path.join(pluginDir, "dist"))
      fs.writeFileSync(path.join(pluginDir, "dist", "index.js"), "export const fixture = true")
      fs.writeFileSync(
        path.join(pluginDir, "dist", "index.d.ts"),
        "export declare const fixture: true",
      )
    }

    const handlerPath = pathToFileURL(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "plugin-git-handlers.js"),
    ).href
    const output = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import { handlePluginRestore } from ${JSON.stringify(handlerPath)}; await handlePluginRestore()`,
      ],
      {
        cwd: workspace,
        env: { ...process.env, npm_config_ignore_scripts: "true" },
        encoding: "utf8",
      },
    )

    assert.match(output, /fixture: repairing incomplete build/)
    assert.equal(fs.readFileSync(path.join(pluginDir, "prepared"), "utf8"), "yes")
    assert.ok(fs.existsSync(path.join(pluginDir, "dist", "index.js")))
    assert.ok(fs.existsSync(path.join(pluginDir, "dist", "index.d.ts")))
    assert.ok(fs.existsSync(path.join(pluginDir, "dist", "conditional.js")))
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true })
  }
}

test("restore repairs a pinned plugin with missing build outputs", () => {
  verifyRestoreRepair({
    rootExport: { import: "./dist/index.js", types: "./dist/index.d.ts" },
  })
})

test("restore checks nested conditional export targets", () => {
  verifyRestoreRepair({
    rootExport: {
      import: "./dist/index.js",
      types: "./dist/index.d.ts",
      default: { node: "./dist/conditional.js" },
    },
    prebuilt: true,
  })
})

test("restore joins successful builds before reporting a sibling failure", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "quartz-plugin-failure-"))
  const pluginsDir = path.join(workspace, ".quartz", "plugins")

  function createPlugin(name, succeeds) {
    const pluginDir = path.join(pluginsDir, name)
    fs.mkdirSync(pluginDir, { recursive: true })
    fs.writeFileSync(
      path.join(pluginDir, "package.json"),
      JSON.stringify({
        name: `@quartz-community/${name}`,
        version: "1.0.0",
        exports: { ".": { import: "./dist/index.js", types: "./dist/index.d.ts" } },
        scripts: { prepare: "node build.cjs", build: "node build.cjs" },
      }),
    )
    fs.writeFileSync(
      path.join(pluginDir, "build.cjs"),
      succeeds
        ? "const fs = require('node:fs'); setTimeout(() => { fs.mkdirSync('dist', { recursive: true }); fs.writeFileSync('dist/index.js', 'export const Good = true'); fs.writeFileSync('dist/index.d.ts', 'declare const Good: true; export { Good }') }, 120)\n"
        : "process.exitCode = 1\n",
    )
    execFileSync(
      "npm",
      ["install", "--package-lock-only", "--ignore-scripts", "--no-audit", "--no-fund"],
      { cwd: pluginDir, stdio: "ignore" },
    )
    execFileSync("git", ["init", "-q"], { cwd: pluginDir })
    execFileSync("git", ["add", "."], { cwd: pluginDir })
    execFileSync(
      "git",
      ["-c", "user.name=Quartz Test", "-c", "user.email=quartz-test@example.invalid", "commit", "-qm", "Add fixture"],
      { cwd: pluginDir },
    )
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: pluginDir,
      encoding: "utf8",
    }).trim()
  }

  try {
    const goodCommit = createPlugin("good", true)
    const badCommit = createPlugin("bad", false)
    fs.writeFileSync(
      path.join(workspace, "quartz.lock.json"),
      JSON.stringify({
        version: "1.0.0",
        plugins: {
          good: { commit: goodCommit, resolved: "unused" },
          bad: { commit: badCommit, resolved: "unused" },
        },
      }),
    )
    const handlerPath = pathToFileURL(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "plugin-git-handlers.js"),
    ).href
    assert.throws(
      () =>
        execFileSync(
          process.execPath,
          ["--input-type=module", "-e", `import { handlePluginRestore } from ${JSON.stringify(handlerPath)}; await handlePluginRestore()`],
          {
            cwd: workspace,
            env: { ...process.env, QUARTZ_PLUGIN_BUILD_CONCURRENCY: "2" },
            encoding: "utf8",
            stdio: "pipe",
          },
        ),
      (error) => {
        assert.equal(error.status, 1)
        assert.match(error.stdout, /Restored 1 plugin\(s\), 1 failed/)
        return true
      },
    )
    assert.ok(fs.existsSync(path.join(pluginsDir, "good", "dist", "index.d.ts")))
    const barrel = fs.readFileSync(path.join(pluginsDir, "index.ts"), "utf8")
    assert.match(barrel, /from "\.\/good"/)
    assert.doesNotMatch(barrel, /from "\.\/bad"/)
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true })
  }
})
