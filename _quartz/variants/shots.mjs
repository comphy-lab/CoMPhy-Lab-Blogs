// Screenshot the variants for a quick visual check: desktop light/dark on a
// figure-and-maths post, the blog index, the global graph opened from a
// post, and a mobile view. Usage: node variants/shots.mjs [key ...]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { VARIANTS, CURRENT_PORT } from "./variants.mjs";

const out = path.resolve(import.meta.dirname, "..", "output", "variant-shots");
fs.mkdirSync(out, { recursive: true });
const wanted = process.argv.slice(2);
const all = [{ key: "current", port: CURRENT_PORT }, ...VARIANTS];
const selected = wanted.length
  ? all.filter((v) => wanted.includes(v.key))
  : all;
const post = "/Blog/2025-JFM-viscous-drop-impact";

const browser = await chromium.launch({ channel: "chrome" });
for (const v of selected) {
  const base = `http://127.0.0.1:${v.port}`;
  const errors = [];
  const shoot = async (
    name,
    url,
    { width = 1600, height = 1000, dark = false, mobile = false, act } = {},
  ) => {
    const ctx = await browser.newContext({
      viewport: mobile ? { width: 390, height: 844 } : { width, height },
      deviceScaleFactor: 1,
      colorScheme: dark ? "dark" : "light",
      isMobile: mobile,
    });
    const page = await ctx.newPage();
    page.on(
      "console",
      (m) => m.type() === "error" && errors.push(`${name}: ${m.text()}`),
    );
    page.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
    await page.goto(base + url, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    if (act) await act(page);
    await page.screenshot({
      path: path.join(out, `${v.key}-${name}.png`),
      fullPage: false,
    });
    await ctx.close();
  };
  await shoot("post-light", post);
  await shoot("post-dark", post, { dark: true });
  await shoot("post-scrolled", post, {
    act: (p) => p.mouse.wheel(0, 1800).then(() => p.waitForTimeout(700)),
  });
  await shoot("blog-index", "/Blog/");
  await shoot("home", "/");
  await shoot("mobile", post, { mobile: true });
  await shoot("graph", post, {
    dark: true,
    act: async (p) => {
      const icon = p.locator(".global-graph-icon").first();
      if ((await icon.count()) && (await icon.isVisible())) {
        await icon.click();
        await p.waitForTimeout(3500);
      }
    },
  });
  console.log(`${v.key}: ${errors.length} console errors`);
  for (const e of errors.slice(0, 8)) console.log("   ", e);
}
await browser.close();
console.log(`shots in ${out}`);
