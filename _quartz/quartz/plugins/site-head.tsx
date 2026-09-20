import fs from "node:fs/promises"
import path from "node:path"
import type { QuartzEmitterPlugin } from "./types"
import type { QuartzConfig } from "../cfg"
import {
  googleFontHref,
  processGoogleFonts,
  getFontSpecificationName,
  FONT_FETCH_HEADERS,
} from "../util/theme"

interface FontFace {
  family: string
  weight: string
  style: string
  latin: boolean
  href: string
}

function parseFontFaces(stylesheet: string): FontFace[] {
  const faces: FontFace[] = []
  for (const block of stylesheet.match(/@font-face\s*{[^}]*}/g) ?? []) {
    const pick = (prop: string) => block.match(new RegExp(`${prop}:\\s*([^;]+);`))?.[1]?.trim()
    const href = block.match(/url\(([^)]+)\)/)?.[1]
    const family = pick("font-family")?.replace(/^['"]|['"]$/g, "")
    if (!href || !family) continue
    const range = pick("unicode-range") ?? ""
    faces.push({
      family,
      weight: pick("font-weight") ?? "400",
      style: pick("font-style") ?? "normal",
      // Google's "latin" subset always starts at U+0000-00FF.
      latin: range === "" || /U\+0000-00FF/i.test(range),
      href,
    })
  }
  return faces
}

/**
 * Preload the two faces every page paints first: the body text at regular
 * weight and the heading face at its heaviest requested weight. Without the
 * preload the browser discovers the fonts only after parsing the stylesheet,
 * paints in the fallback and reflows when they arrive.
 */
export async function fontPreloads(config: QuartzConfig): Promise<string[]> {
  const theme = config.configuration.theme
  let stylesheet: string
  if (theme.fontOrigin === "local") {
    // The self-hosted brand pack; its URLs are relative to its own folder.
    try {
      stylesheet = await fs.readFile(path.join("quartz", "static", "fonts", "fonts.css"), "utf8")
    } catch {
      return []
    }
    stylesheet = stylesheet.replace(/url\(\.\//g, "url(/static/fonts/")
  } else if (theme.fontOrigin === "googleFonts" && !theme.cdnCaching) {
    const response = await fetch(googleFontHref(theme), { headers: FONT_FETCH_HEADERS })
    if (!response.ok) return []
    stylesheet = (await processGoogleFonts(await response.text(), "")).processedStylesheet
  } else {
    return []
  }
  const faces = parseFontFaces(stylesheet).filter((f) => f.latin && f.style === "normal")
  const body = getFontSpecificationName(theme.typography.body)
  const header = getFontSpecificationName(theme.typography.header)
  const byFamily = (family: string) => faces.filter((f) => f.family === family)
  const bodyFace = byFamily(body).find((f) => f.weight === "400") ?? byFamily(body)[0]
  const headerFaces = byFamily(header)
  const headerFace =
    headerFaces.find((f) => f.weight === "600") ??
    headerFaces.find((f) => f.weight === "700") ??
    headerFaces[0]
  // Article titles use Cormorant Garamond 600 when the pack provides it.
  const titleFace = byFamily("Cormorant Garamond").find((f) => f.weight === "600")
  const hrefs = [bodyFace, headerFace, titleFace]
    .filter((f): f is FontFace => !!f)
    .map((f) => f.href)
  return [...new Set(hrefs)]
}

/**
 * Head additions shared by every page: font preloads and the lab's favicon
 * set (the same files comphy-lab.org serves; Quartz's own favicon plugin
 * still writes /favicon.ico from static/icon.png).
 */
export const SiteHead: (fontHrefs: string[]) => QuartzEmitterPlugin = (fontHrefs) => () => ({
  name: "SiteHead",
  async *emit() {},
  externalResources() {
    return {
      additionalHead: [
        ...fontHrefs.map((href) => (
          <link
            rel="preload"
            href={href}
            as="font"
            type={href.endsWith(".woff2") ? "font/woff2" : "font/ttf"}
            crossOrigin="anonymous"
          />
        )),
        <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png" />,
      ],
    }
  },
})
