import { test } from "node:test"
import assert from "node:assert/strict"
import { resolve } from "node:path"
import { runInNewContext } from "node:vm"
import esbuild from "esbuild"

const flush = () => new Promise((done) => setTimeout(done, 0))

test("an async graph init that loses an SPA navigation is destroyed", async () => {
  const pendingInits: Array<() => void> = []
  const apps: Array<{
    tickerStopped: boolean
    destroyed: boolean
    destroyOptions?: { removeView?: boolean; releaseGlobalResources?: boolean }
  }> = []
  class Application {
    tickerStopped = false
    destroyed = false
    destroyOptions?: { removeView?: boolean; releaseGlobalResources?: boolean }
    canvas = {}
    renderer: object | null = null
    stage: object | null = null
    ticker = { stop: () => (this.tickerStopped = true) }

    constructor() {
      apps.push(this)
    }

    init() {
      return new Promise<void>((done) =>
        pendingInits.push(() => {
          this.renderer = {}
          this.stage = {}
          done()
        }),
      )
    }

    destroy(options: { removeView?: boolean; releaseGlobalResources?: boolean }) {
      this.destroyOptions = options
      this.destroyed = true
    }
  }

  const listeners = new Map<string, Array<(event: unknown) => void>>()
  const windowListeners = new Map<string, Array<() => void>>()
  const graph = {
    isConnected: true,
    dataset: { cfg: "{}" } as Record<string, string>,
    offsetWidth: 300,
    offsetHeight: 250,
    contains: () => false,
  }
  const location = { pathname: "/first" }
  const browser = {
    location,
    devicePixelRatio: 1,
    d3: {},
    PIXI: { Application },
    addEventListener(name: string, listener: () => void) {
      windowListeners.set(name, [...(windowListeners.get(name) ?? []), listener])
    },
  }
  const document = {
    readyState: "complete",
    head: {
      appendChild(script: { onload: () => void }) {
        queueMicrotask(() => script.onload())
      },
    },
    createElement() {
      return { src: "", onload: () => {}, onerror: () => {} }
    },
    addEventListener(name: string, listener: (event: unknown) => void) {
      listeners.set(name, [...(listeners.get(name) ?? []), listener])
    },
    removeEventListener(name: string, listener: (event: unknown) => void) {
      listeners.set(
        name,
        (listeners.get(name) ?? []).filter((entry) => entry !== listener),
      )
    },
    querySelectorAll(selector: string) {
      if (selector === ".graph-container") return [graph]
      if (selector === ".global-graph-outer") return []
      if (selector === ".global-graph-icon") return []
      return []
    },
    documentElement: {},
  }
  const built = await esbuild.build({
    entryPoints: [resolve("quartz/plugins/site-graph.inline.ts")],
    bundle: true,
    platform: "browser",
    format: "iife",
    write: false,
  })
  runInNewContext(built.outputFiles[0].text, {
    window: browser,
    document,
    localStorage: { getItem: () => null, setItem: () => {} },
    fetch: async () => ({ json: async () => ({ first: { links: [] }, second: { links: [] } }) }),
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    console: { log: () => {}, error: () => {} },
    setTimeout,
    clearTimeout,
  })

  await flush()
  assert.equal(pendingInits.length, 1, "first page should start Pixi initialization")
  location.pathname = "/second"
  for (const listener of listeners.get("nav") ?? []) {
    listener({ type: "nav", detail: { url: "second" } })
  }
  await flush()
  assert.equal(pendingInits.length, 2, "second page should start its own graph")

  pendingInits[0]()
  await flush()
  assert.equal(apps[0].tickerStopped, true)
  assert.equal(apps[0].destroyed, true)
  assert.equal(apps[0].destroyOptions?.removeView, true)
  assert.equal(apps[0].destroyOptions?.releaseGlobalResources, false)
  assert.notEqual(graph.dataset.graphReady, "true")

  for (const listener of windowListeners.get("resize") ?? []) listener()
  await new Promise((done) => setTimeout(done, 170))
  assert.equal(pendingInits.length, 3, "resize should replace the graph at its new width")
  pendingInits[1]()
  await flush()
  assert.equal(apps[1].destroyed, true, "resize must dispose the superseded Pixi app")
  assert.equal(apps[1].destroyOptions?.releaseGlobalResources, false)
})
