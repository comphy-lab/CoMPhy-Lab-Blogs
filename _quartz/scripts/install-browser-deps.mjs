import { execFile } from "node:child_process"
import { createRequire } from "node:module"
import { platform, arch } from "node:process"
import { readFile, writeFile, copyFile, mkdir, readdir, stat } from "node:fs/promises"
import { resolve, join } from "node:path"
import { promisify } from "node:util"
import { fileURLToPath } from "node:url"

const exec = promisify(execFile)
const require = createRequire(import.meta.url)
const quartzRoot = resolve(fileURLToPath(new URL("..", import.meta.url)))
const playwrightVersion = "1.63.0"

// playwright-core 1.63.0, coreBundle.js: ubuntu24.04-x64 tools + chromium.
// Keep this checked list tied to the package version; APT resolves its closure.
const packages = [
  "xvfb", "fonts-noto-color-emoji", "fonts-unifont", "libfontconfig1", "libfreetype6",
  "xfonts-cyrillic", "xfonts-scalable", "fonts-liberation", "fonts-ipafont-gothic",
  "fonts-wqy-zenhei", "fonts-tlwg-loma-otf", "fonts-freefont-ttf",
  "libasound2t64", "libatk-bridge2.0-0t64", "libatk1.0-0t64", "libatspi2.0-0t64",
  "libcairo2", "libcups2t64", "libdbus-1-3", "libdrm2", "libgbm1",
  "libglib2.0-0t64", "libnspr4", "libnss3", "libpango-1.0-0", "libx11-6",
  "libxcb1", "libxcomposite1", "libxdamage1", "libxext6", "libxfixes3",
  "libxkbcommon0", "libxrandr2",
]

const aptQuote = (value) => `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`

export function aptConfig(cacheDir) {
  const apt = join(cacheDir, "apt")
  return [
    // Ignore system apt.conf.d hooks while retaining signed Ubuntu sources and trust.
    `Dir::Etc::main "/dev/null";`,
    `Dir::Etc::parts ${aptQuote(join(apt, "empty-etc"))};`,
    `Dir::Etc::sourcelist "/etc/apt/sources.list";`,
    `Dir::Etc::sourceparts "/etc/apt/sources.list.d";`,
    `Dir::Etc::trusted "/etc/apt/trusted.gpg";`,
    `Dir::Etc::trustedparts "/etc/apt/trusted.gpg.d";`,
    `Dir::Etc::preferences "/etc/apt/preferences";`,
    `Dir::Etc::preferencesparts "/etc/apt/preferences.d";`,
    `Dir::State::status ${aptQuote(join(apt, "status"))};`,
    `Dir::State::lists ${aptQuote(join(apt, "lists"))};`,
    `Dir::State::extended_states ${aptQuote(join(apt, "extended_states"))};`,
    `Dir::Cache::archives ${aptQuote(join(apt, "archives"))};`,
    `Dir::Cache::pkgcache ${aptQuote(join(apt, "pkgcache.bin"))};`,
    `Dir::Cache::srcpkgcache ${aptQuote(join(apt, "srcpkgcache.bin"))};`,
    `Dir::Log ${aptQuote(join(apt, "logs"))};`,
    `Debug::NoLocking "true";`,
    `APT::Get::Download-Only "true";`,
    `APT::Get::AllowUnauthenticated "false";`,
    `Acquire::AllowInsecureRepositories "false";`,
    `Acquire::AllowDowngradeToInsecureRepositories "false";`,
    `Acquire::Languages "none";`,
  ].join("\n") + "\n"
}

export function inspectAptPlan(output) {
  const installs = []
  for (const line of output.split("\n")) {
    if (line.startsWith("Remv ")) throw new Error(`APT planned a removal: ${line}`)
    const match = /^Inst ([^ ]+)(?: \[([^\]]+)\])? /.exec(line)
    if (!match) continue
    const name = match[1].replace(/:amd64$/, "")
    if (match[2] && /^(libc6|libc-bin|libstdc\+\+6|libgcc-s1|libc6-dev)$/.test(name)) {
      throw new Error(`APT planned a core runtime upgrade: ${name}`)
    }
    installs.push(name)
  }
  return installs
}

async function command(label, executable, args, env) {
  try {
    return (await exec(executable, args, {
      cwd: quartzRoot, env, encoding: "utf8", maxBuffer: 16 * 1024 * 1024,
      timeout: 240_000,
    })).stdout
  } catch (error) {
    const tail = `${error.stdout ?? ""}\n${error.stderr ?? ""}`.slice(-2500)
      .replace(/(https?:\/\/)[^/@\s]+@/g, "$1<redacted>@")
    throw new Error(`${label} failed: ${tail || error.message}`, { cause: error })
  }
}

async function libraryDirs(root) {
  const found = []
  async function walk(dir) {
    for (const item of await readdir(dir, { withFileTypes: true })) {
      const child = join(dir, item.name)
      if (item.isDirectory()) await walk(child)
      else if (item.name.includes(".so") && !found.includes(dir)) found.push(dir)
    }
  }
  for (const base of [join(root, "lib"), join(root, "usr/lib")]) {
    try { await walk(base) } catch (error) { if (error.code !== "ENOENT") throw error }
  }
  return found
}

const xml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;")

export async function prepareBrowserRuntime({
  cacheDir = join(quartzRoot, ".quartz-cache/browser-runtime"),
} = {}) {
  if (platform !== "linux" || arch !== "x64") {
    throw new Error("Rootless browser runtime supports only Linux x64")
  }
  const release = await readFile("/etc/os-release", "utf8")
  if (!/^ID=ubuntu$/m.test(release) || !/^VERSION_ID="?24\.04"?$/m.test(release)) {
    throw new Error("Rootless browser runtime requires Ubuntu 24.04")
  }
  const version = JSON.parse(await readFile(require.resolve("playwright-core/package.json"), "utf8")).version
  if (version !== playwrightVersion) throw new Error(`Review Playwright dependency list for ${version}`)

  cacheDir = join(resolve(cacheDir), `run-${Date.now()}-${process.pid}`)
  const apt = join(cacheDir, "apt")
  const archives = join(apt, "archives")
  const root = join(cacheDir, "root")
  for (const dir of [cacheDir, apt, archives, join(archives, "partial"), join(apt, "lists"),
    join(apt, "lists/partial"), join(apt, "empty-etc"), join(apt, "logs"), root,
    join(cacheDir, "font-cache")]) await mkdir(dir, { recursive: true })
  const status = await readFile("/var/lib/dpkg/status")
  if (status.length < 100 || !status.includes(Buffer.from("Status: install ok installed"))) {
    throw new Error("Installed dpkg status is absent or empty; refusing a full-system download")
  }
  await writeFile(join(apt, "status"), status)
  const config = join(apt, "apt.conf")
  await writeFile(config, aptConfig(cacheDir), { mode: 0o600 })
  const env = { ...process.env, APT_CONFIG: config, LC_ALL: "C", DEBIAN_FRONTEND: "noninteractive" }

  await command("signed APT index update", "apt-get", ["update"], env)
  const plan = inspectAptPlan(await command("APT dependency resolution", "apt-get",
    ["-s", "--no-install-recommends", "install", ...packages], env))
  console.log(`[browser-deps] ${plan.length} missing/upgrade packages resolved`)
  if (plan.length === 0) return {}
  await command("APT download-only", "apt-get",
    ["-y", "--download-only", "--no-install-recommends", "install", ...packages], env)

  const debs = (await readdir(archives)).filter((name) => name.endsWith(".deb"))
  if (debs.length !== plan.length) throw new Error(`Expected ${plan.length} resolved packages, found ${debs.length} archives`)
  for (const name of debs) await command(`extract ${name}`, "dpkg-deb", ["-x", join(archives, name), root], env)

  const dirs = await libraryDirs(root)
  const fonts = join(root, "usr/share/fonts")
  const fontConfig = join(cacheDir, "fonts.conf")
  const hasFonts = await stat(fonts).then((value) => value.isDirectory(), () => false)
  if (hasFonts) {
    await writeFile(fontConfig, `<?xml version="1.0"?><fontconfig><include ignore_missing="yes">/etc/fonts/fonts.conf</include><dir>/usr/share/fonts</dir><dir>${xml(fonts)}</dir><cachedir>${xml(join(cacheDir, "font-cache"))}</cachedir></fontconfig>\n`)
  }
  if (dirs.length === 0 && !hasFonts) throw new Error("APT downloaded packages but extracted no browser libraries or fonts")
  console.log(`[browser-deps] extracted ${debs.length} signed packages; ${dirs.length} library directories`)
  return {
    ...(dirs.length ? { LD_LIBRARY_PATH: [...dirs, process.env.LD_LIBRARY_PATH].filter(Boolean).join(":") } : {}),
    ...(hasFonts ? { FONTCONFIG_FILE: fontConfig } : {}),
  }
}
