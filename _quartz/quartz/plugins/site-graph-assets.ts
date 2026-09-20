import fs from "node:fs/promises"
import path from "node:path"
import { createRequire } from "node:module"
import type { QuartzEmitterPlugin } from "./types"
import type { FilePath } from "../util/path"

const require = createRequire(import.meta.url)

// Bundle the lockfile's exact graph libraries with every build. Runtime graph
// behaviour must not change independently when a floating CDN URL updates.
export const GraphAssets: QuartzEmitterPlugin = () => ({
  name: "GraphAssets",
  async *emit(ctx) {
    const assets = [
      [path.resolve(path.dirname(require.resolve("d3")), "../dist/d3.min.js"), "d3.min.js"],
      [
        path.resolve(path.dirname(require.resolve("pixi.js")), "../dist/pixi.min.js"),
        "pixi.min.js",
      ],
      [path.resolve(path.dirname(require.resolve("d3")), "../LICENSE"), "d3.LICENSE.txt"],
      [path.resolve(path.dirname(require.resolve("pixi.js")), "../LICENSE"), "pixi.LICENSE.txt"],
    ]
    const directory = path.join(ctx.argv.output, "static/graph")
    await fs.mkdir(directory, { recursive: true })
    for (const [source, filename] of assets) {
      const destination = path.join(directory, filename)
      await fs.copyFile(source, destination)
      yield destination as FilePath
    }
  },
})
