// Design-variant definitions for review builds. Each variant derives its
// quartz.config.yaml from the production configuration and pairs it with a
// stylesheet in quartz/styles/themes/<key>.scss. Nothing here touches the
// production build, which reads quartz.config.yaml and custom.scss.

export const REVIEW_HOST = "comphy-mac.wisent-alhena.ts.net";
export const INDEX_PORT = 8800;
export const CURRENT_PORT = 8790;

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
};
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
};

export const VARIANTS = [
  {
    key: "paper",
    port: 8801,
    name: "A · Paper & Ink",
    summary:
      "The CoMPhy design system on a full-width three-column layout: 300 px explorer, reading panel that fills the viewport (prose capped at 92 characters, figures full width), 320 px rail for contents, graph and backlinks. Warm paper with the 32 px grid, teal accent, Fraunces headings, IBM Plex Sans body, 28 px panel.",
    fonts: {
      header: { name: "Fraunces", weights: [400, 600, 700] },
      body: "IBM Plex Sans",
      code: "IBM Plex Mono",
    },
    frame: "default",
    positions: {},
    exclude: {},
  },
  {
    key: "editorial",
    port: 8802,
    name: "B · Editorial",
    summary:
      "Magazine reading page after Quanta and Works in Progress. Masthead across the top, one centred Source Serif column, large Fraunces titles, a slim contents rail at the right, figures allowed to bleed past the text on wide screens. Graph and backlinks move below the article; the explorer appears only on section pages.",
    fonts: {
      header: "Fraunces",
      body: "Source Serif 4",
      code: "IBM Plex Mono",
    },
    frame: "topbar",
    positions: { graph: "afterBody", backlinks: "afterBody" },
    exclude: { content: ["explorer"] },
  },
  {
    key: "docs",
    port: 8803,
    name: "C · Wide Docs",
    summary:
      "Developer-documentation chrome after developers.openai.com, Linear and Raycast. Sticky top bar with search, docs-style left navigation, a reading column that follows the viewport up to about 110 characters, an 'On this page' rail at the right. IBM Plex Sans throughout; graph as a related block under the text.",
    fonts: {
      header: "IBM Plex Sans",
      body: "IBM Plex Sans",
      code: "IBM Plex Mono",
    },
    frame: "topbar",
    positions: { graph: "afterBody" },
    exclude: {},
  },
  {
    key: "explainer",
    port: 8804,
    name: "D · Explainer",
    summary:
      "Distill-style article page. Hairline top bar, sans chrome with a Source Serif body, a numbered outline in the left margin, and a 42 rem text column that lets figures, tables, code and displayed equations run out to 64 rem. Graph and backlinks as end matter.",
    fonts: {
      header: "IBM Plex Sans",
      body: "Source Serif 4",
      code: "IBM Plex Mono",
    },
    frame: "topbar",
    positions: {
      "table-of-contents": "left",
      graph: "afterBody",
      backlinks: "afterBody",
    },
    exclude: { content: ["explorer"] },
  },
  {
    key: "minimal",
    port: 8805,
    name: "E · Minimal",
    summary:
      "Personal-blog page in the steipete.me manner. One centred sans column, a short header bar, contents folded at the top of the article, graph and backlinks as end matter, no side rails at all. The quietest option and the closest to the current site's inspiration.",
    fonts: {
      header: "IBM Plex Sans",
      body: "IBM Plex Sans",
      code: "IBM Plex Mono",
    },
    frame: "topbar",
    positions: {
      "table-of-contents": "beforeBody",
      graph: "afterBody",
      backlinks: "afterBody",
    },
    exclude: { content: ["explorer"] },
  },
];

export function paletteFor(key) {
  return { lightMode: { ...light }, darkMode: { ...dark } };
}
