// Design-variant definitions for review builds. Each variant derives its
// quartz.config.yaml from the production configuration and pairs it with a
// stylesheet in quartz/styles/themes/<key>.scss. Nothing here touches the
// production build, which reads quartz.config.yaml and custom.scss.

export const REVIEW_HOST = "comphy-mac.wisent-alhena.ts.net"
export const INDEX_PORT = 8800
export const CURRENT_PORT = 8790

const light = {
  light: "#f3efe8",
  lightgray: "#e3ddd2",
  gray: "#857867",
  darkgray: "#1f1a15",
  dark: "#0f0c08",
  secondary: "#254c4a",
  tertiary: "#0056b3",
  highlight: "rgba(37, 76, 74, 0.10)",
  textHighlight: "#ffcf5c88",
}
const dark = {
  light: "#12100d",
  lightgray: "#2a251f",
  gray: "#6e6455",
  darkgray: "#e6dfd0",
  dark: "#f8f4ec",
  secondary: "#6ac2bd",
  tertiary: "#8fb8ff",
  highlight: "rgba(106, 194, 189, 0.14)",
  textHighlight: "#ffcf5c55",
}

const paperFonts = {
  header: { name: "Fraunces", weights: [400, 600, 700] },
  body: "IBM Plex Sans",
  code: "IBM Plex Mono",
}

// Round 2 (2026-09-20, evening): Vatsal chose A · Paper & Ink. Three
// derivatives of it plus one deliberately different option.
export const VARIANTS = [
  {
    key: "paper",
    port: 8801,
    name: "A · Paper & Ink",
    summary:
      "The base. Full-width three columns: 300 px explorer, reading panel filling the viewport (prose capped at 92 characters, figures full width), 320 px rail for contents, graph and backlinks. Warm paper with the 32 px grid, teal accent, Fraunces headings, IBM Plex Sans body, 28 px panel.",
    fonts: paperFonts,
    frame: "default",
    positions: {},
    exclude: {},
    options: {},
  },
  {
    key: "paper-masthead",
    port: 8802,
    name: "A2 · Paper & Ink — Masthead",
    summary:
      "Same panel, tokens and type, but the site chrome (title, search, theme and reader toggles) moves to a sticky top bar. The left rail becomes pure navigation and starts at the top of the page; the right rail keeps contents, graph and backlinks.",
    fonts: paperFonts,
    frame: "topbar",
    positions: {},
    exclude: {},
    options: {},
  },
  {
    key: "paper-serif",
    port: 8803,
    name: "A3 · Paper & Ink — Serif",
    summary:
      "Paper & Ink with a Source Serif 4 reading face and no card: the article sits directly on the paper with hairline rules, Fraunces titles, a numbered contents outline and a wider 80-character measure. Graph and backlinks stay in the rail.",
    fonts: {
      header: { name: "Fraunces", weights: [400, 600, 700] },
      body: "Source Serif 4",
      code: "IBM Plex Mono",
    },
    frame: "default",
    positions: {},
    exclude: {},
    options: {},
  },
  {
    key: "paper-atlas",
    port: 8804,
    name: "A4 · Paper & Ink — Atlas",
    summary:
      "Paper & Ink that leads with the knowledge graph: a tall two-hop local graph at the top of the right rail, backlinks as cards, contents beneath; the explorer opens every folder so the whole vault is one glance away. Grid overlay off, panel kept.",
    fonts: paperFonts,
    frame: "default",
    positions: {},
    exclude: {},
    options: {
      graph: {
        localGraph: { depth: 2, linkDistance: 40, repelForce: 0.7, scale: 1 },
      },
      explorer: { folderDefaultState: "open" },
    },
  },
  {
    key: "aurora",
    port: 8805,
    name: "S · Aurora (the surprise)",
    summary:
      "Not a Paper & Ink derivative. A masthead band in the lab's four-stop gradient (coral → purple → violet → indigo, as on comphy-lab.org), glass panels for the article and both rails floating over soft gradient washes, Fraunces + Plex Sans, dark-first. Same rails, graph and contents fixes underneath.",
    fonts: paperFonts,
    frame: "topbar",
    positions: {},
    exclude: {},
    options: {},
  },
]

// Round 1 options (B–E), kept buildable but no longer served:
//   node variants/build.mjs editorial docs explainer minimal
export const RETIRED = [
  {
    key: "editorial",
    frame: "topbar",
    fonts: {
      header: "Fraunces",
      body: "Source Serif 4",
      code: "IBM Plex Mono",
    },
    positions: { graph: "afterBody", backlinks: "afterBody" },
    exclude: { content: ["explorer"] },
    options: {},
  },
  {
    key: "docs",
    frame: "topbar",
    fonts: {
      header: "IBM Plex Sans",
      body: "IBM Plex Sans",
      code: "IBM Plex Mono",
    },
    positions: { graph: "afterBody" },
    exclude: {},
    options: {},
  },
  {
    key: "explainer",
    frame: "topbar",
    fonts: {
      header: "IBM Plex Sans",
      body: "Source Serif 4",
      code: "IBM Plex Mono",
    },
    positions: {
      "table-of-contents": "left",
      graph: "afterBody",
      backlinks: "afterBody",
    },
    exclude: { content: ["explorer"] },
    options: {},
  },
  {
    key: "minimal",
    frame: "topbar",
    fonts: {
      header: "IBM Plex Sans",
      body: "IBM Plex Sans",
      code: "IBM Plex Mono",
    },
    positions: {
      "table-of-contents": "beforeBody",
      graph: "afterBody",
      backlinks: "afterBody",
    },
    exclude: { content: ["explorer"] },
    options: {},
  },
]

export function paletteFor(key) {
  return { lightMode: { ...light }, darkMode: { ...dark } }
}
