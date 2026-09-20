import path from "node:path"
import { buildPlugin } from "./plugin-git-handlers.js"
import { PLUGINS_DIR } from "./plugin-data.js"

const [pluginDir, name] = process.argv.slice(2)
if (
  !name ||
  !/^[a-z0-9][a-z0-9-]*$/.test(name) ||
  path.resolve(pluginDir ?? "") !== path.join(PLUGINS_DIR, name)
) {
  console.error("Invalid plugin build worker arguments")
  process.exitCode = 2
} else {
  process.exitCode = buildPlugin(pluginDir, name) ? 0 : 1
}
