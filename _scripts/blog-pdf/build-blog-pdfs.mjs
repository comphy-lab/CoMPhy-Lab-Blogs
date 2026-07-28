#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const VAULT_DIR = path.resolve(SCRIPT_DIR, "../..");
const BLOG_DIR = path.join(VAULT_DIR, "Blog");
const PDF_DIR = path.join(VAULT_DIR, "_Media", "PDF");
const CSS_PATH = path.join(VAULT_DIR, "publish.css");
const STATE_DIR =
  process.env.BLOG_PDF_STATE_DIR ??
  path.join(os.homedir(), "Library", "Application Support", "CoMPhyBlogPDF");
const MANIFEST_PATH = path.join(STATE_DIR, "manifest.json");
const SITE_ORIGIN = (
  process.env.BLOG_PDF_SITE_ORIGIN ?? "https://blogs.comphy-lab.org"
).replace(/\/+$/, "");
const CHROME_PATH =
  process.env.BLOG_PDF_CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const RENDERER_VERSION = "2";
const LINK_START = "<!-- BLOG-PDF-LINK-START -->";
const LINK_END = "<!-- BLOG-PDF-LINK-END -->";

function parseArgs(argv) {
  const options = {
    ensureLinksOnly: false,
    force: false,
    noWriteLinks: false,
    only: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--ensure-links-only") options.ensureLinksOnly = true;
    else if (argument === "--force") options.force = true;
    else if (argument === "--no-write-links") options.noWriteLinks = true;
    else if (argument === "--only") options.only = argv[++index];
    else if (argument === "--help") {
      console.log(`Usage: build-blog-pdfs.mjs [options]

Options:
  --ensure-links-only  Add/update PDF download callouts without rendering
  --no-write-links     Do not modify Markdown before rendering
  --only <slug>        Process one Blog filename without the .md suffix
  --force              Render even when the source fingerprint is unchanged
`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  if (options.only?.endsWith(".md")) {
    options.only = options.only.slice(0, -3);
  }
  return options;
}

function frontmatterIsPublished(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  return Boolean(match && /^publish:\s*true\s*$/m.test(match[1]));
}

function pdfCallout(slug) {
  return `${LINK_START}
<!-- PDF-EXPORT-IGNORE-START -->
> [!pdf] PDF version
> [[_Media/PDF/${slug}.pdf|Download this page as PDF]]
<!-- PDF-EXPORT-IGNORE-END -->
${LINK_END}`;
}

function upsertPdfCallout(source, slug) {
  const managedBlock = new RegExp(
    `${LINK_START.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${LINK_END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`,
    "g",
  );
  const withoutManagedBlock = source.replace(managedBlock, "");
  const heading = withoutManagedBlock.match(/^# .+$/m);
  if (!heading || heading.index === undefined) {
    throw new Error("Cannot add PDF callout: no level-one heading found");
  }

  const insertAt = heading.index + heading[0].length;
  return `${withoutManagedBlock.slice(0, insertAt)}\n\n${pdfCallout(slug)}\n\n${withoutManagedBlock
    .slice(insertAt)
    .replace(/^\s+/, "")}`;
}

async function publishedPosts(only) {
  const names = await fs.readdir(BLOG_DIR);
  const posts = [];

  for (const name of names.sort()) {
    if (!name.endsWith(".md")) continue;
    const slug = name.slice(0, -3);
    if (only && slug !== only) continue;
    const sourcePath = path.join(BLOG_DIR, name);
    const source = await fs.readFile(sourcePath, "utf8");
    if (!frontmatterIsPublished(source)) continue;
    posts.push({ slug, sourcePath, source });
  }

  if (only && posts.length === 0) {
    throw new Error(`No published Blog page matched: ${only}`);
  }
  return posts;
}

async function ensurePdfLinks(posts) {
  let changed = 0;
  for (const post of posts) {
    const current = await fs.readFile(post.sourcePath, "utf8");
    const updated = upsertPdfCallout(current, post.slug);
    if (updated !== current) {
      await fs.writeFile(post.sourcePath, updated, "utf8");
      changed += 1;
      console.log(`link: updated Blog/${post.slug}.md`);
    }
    post.source = updated;
  }
  return changed;
}

function localMediaTargets(source, sourcePath) {
  const targets = new Set();
  const wikiEmbed = /!\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g;
  const markdownImage = /!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;

  for (const match of source.matchAll(wikiEmbed)) targets.add(match[1]);
  for (const match of source.matchAll(markdownImage)) {
    if (!/^(?:https?:|data:)/i.test(match[1])) targets.add(decodeURI(match[1]));
  }

  return [...targets].map((target) => {
    if (target.startsWith("_Media/")) return path.join(VAULT_DIR, target);
    if (target.startsWith("/")) return path.join(VAULT_DIR, target.slice(1));
    if (target.startsWith("./") || target.startsWith("../")) {
      return path.resolve(path.dirname(sourcePath), target);
    }
    return path.join(VAULT_DIR, "_Media", target);
  });
}

async function fingerprint(post, css) {
  const hash = crypto.createHash("sha256");
  hash.update(`renderer:${RENDERER_VERSION}\0`);
  hash.update(post.source);
  hash.update("\0publish.css\0");
  hash.update(css);

  for (const mediaPath of localMediaTargets(post.source, post.sourcePath).sort()) {
    hash.update(`\0media:${path.relative(VAULT_DIR, mediaPath)}\0`);
    try {
      hash.update(await fs.readFile(mediaPath));
    } catch {
      hash.update("missing");
    }
  }
  return hash.digest("hex");
}

async function readManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return { version: 1, posts: {} };
    throw error;
  }
}

async function writeManifest(manifest) {
  await fs.mkdir(STATE_DIR, { recursive: true });
  const temporary = `${MANIFEST_PATH}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await fs.rename(temporary, MANIFEST_PATH);
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(
      `${command} failed (${result.status}): ${(result.stderr || result.stdout).trim()}`,
    );
  }
  return result.stdout;
}

function pageCount(pdfPath) {
  const info = run("/opt/homebrew/bin/pdfinfo", [pdfPath]);
  return Number(info.match(/^Pages:\s+(\d+)$/m)?.[1] ?? 0);
}

function lastNonBlankPage(pdfPath) {
  const pages = pageCount(pdfPath);
  for (let page = pages; page >= 1; page -= 1) {
    const text = run("/opt/homebrew/bin/pdftotext", [
      "-f",
      String(page),
      "-l",
      String(page),
      pdfPath,
      "-",
    ]);
    if (text.trim().length > 0) return { page, pages };
  }
  return { page: 0, pages };
}

function lastSectionHeading(source) {
  return [...source.matchAll(/^##\s+(.+)$/gm)].at(-1)?.[1]?.trim() ?? null;
}

async function validatePdf(pdfPath, expectedTitle, expectedLastHeading) {
  const signature = await fs.readFile(pdfPath);
  if (signature.length < 10_000 || signature.subarray(0, 5).toString() !== "%PDF-") {
    throw new Error("Renderer produced an empty or invalid PDF");
  }

  const info = run("/opt/homebrew/bin/pdfinfo", [pdfPath]);
  const pages = Number(info.match(/^Pages:\s+(\d+)$/m)?.[1] ?? 0);
  const tagged = info.match(/^Tagged:\s+(\S+)$/m)?.[1]?.toLowerCase();
  if (pages < 1) throw new Error("PDF has no pages");
  if (tagged !== "yes") throw new Error("PDF is not tagged");

  const text = run("/opt/homebrew/bin/pdftotext", [pdfPath, "-"]);
  const titleWords = expectedTitle
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 4);
  if (text.trim().length < 200) throw new Error("PDF text extraction is unexpectedly short");
  if (!titleWords.some((word) => text.toLowerCase().includes(word))) {
    throw new Error("Extracted PDF text does not contain the page title");
  }
  if (
    expectedLastHeading &&
    !text.toLowerCase().includes(expectedLastHeading.toLowerCase())
  ) {
    throw new Error(
      `Extracted PDF text does not contain the final section: ${expectedLastHeading}`,
    );
  }

  return { bytes: signature.length, pages, tagged: true };
}

function pageUrl(slug, fingerprintValue) {
  const encodedPath = slug
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${SITE_ORIGIN}/Blog/${encodedPath}?pdf-build=${fingerprintValue.slice(0, 12)}`;
}

async function renderPost(browser, post, fingerprintValue) {
  const context = await browser.newContext({ colorScheme: "light" });
  const page = await context.newPage();
  const url = pageUrl(post.slug, fingerprintValue);
  const outputPath = path.join(PDF_DIR, `${post.slug}.pdf`);
  const temporaryPath = path.join(PDF_DIR, `.${post.slug}.${process.pid}.tmp.pdf`);

  try {
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    if (!response?.ok()) {
      throw new Error(`Published page returned HTTP ${response?.status() ?? "unknown"}`);
    }

    await page.waitForSelector(
      ".markdown-preview-view h1, .markdown-rendered h1, article h1, h1",
      { timeout: 30_000 },
    );
    const downloadLinks = page
      .locator("a")
      .filter({ hasText: "Download this page as PDF" });
    if ((await downloadLinks.count()) < 1) {
      throw new Error("Published page does not contain the PDF download link");
    }
    const livePdfHref = await downloadLinks.first().getAttribute("href");
    const expectedPdfPath = `/_Media/PDF/${encodeURIComponent(post.slug)}.pdf`;
    if (!livePdfHref || new URL(livePdfHref, SITE_ORIGIN).pathname !== expectedPdfPath) {
      throw new Error(
        `Published PDF link is wrong: expected ${expectedPdfPath}, found ${livePdfHref}`,
      );
    }
    await page.evaluate(async () => {
      const pause = (milliseconds) =>
        new Promise((resolve) => setTimeout(resolve, milliseconds));
      let previousHeight = 0;
      for (let pass = 0; pass < 4; pass += 1) {
        const height = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
        );
        const step = Math.max(500, Math.floor(window.innerHeight * 0.75));
        for (let top = 0; top <= height; top += step) {
          window.scrollTo(0, top);
          await pause(60);
        }
        window.scrollTo(0, height);
        await pause(250);
        const newHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
        );
        if (newHeight === previousHeight) break;
        previousHeight = newHeight;
      }
    });
    await page.evaluate(async () => {
      await document.fonts?.ready;
      await Promise.all(
        [...document.images].map((image) =>
          image.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                image.addEventListener("load", resolve, { once: true });
                image.addEventListener("error", resolve, { once: true });
              }),
        ),
      );
    });
    await page.waitForTimeout(750);
    await page.emulateMedia({ media: "print" });

    const title =
      (await page
        .locator(".markdown-preview-view h1, .markdown-rendered h1, article h1, h1")
        .first()
        .textContent())?.trim() || post.slug;
    const finalHeading = lastSectionHeading(post.source);
    if (
      finalHeading &&
      !(await page.locator("body").innerText()).toLowerCase().includes(finalHeading.toLowerCase())
    ) {
      throw new Error(`Published page did not render the final section: ${finalHeading}`);
    }

    const pdfOptions = {
      format: "A4",
      printBackground: true,
      tagged: true,
      outline: true,
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    };
    await page.pdf({ ...pdfOptions, path: temporaryPath });

    const trailingPageCheck = lastNonBlankPage(temporaryPath);
    if (
      trailingPageCheck.page > 0 &&
      trailingPageCheck.page < trailingPageCheck.pages
    ) {
      await page.pdf({
        ...pdfOptions,
        path: temporaryPath,
        pageRanges: `1-${trailingPageCheck.page}`,
      });
      console.log(
        `pdf: removed ${trailingPageCheck.pages - trailingPageCheck.page} trailing blank page(s) from Blog/${post.slug}`,
      );
    }

    const validation = await validatePdf(temporaryPath, title, finalHeading);
    await fs.rename(temporaryPath, outputPath);
    return { ...validation, outputPath, title, url: url.split("?")[0] };
  } finally {
    await fs.rm(temporaryPath, { force: true });
    await context.close();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const posts = await publishedPosts(options.only);
  if (!options.noWriteLinks) {
    const changed = await ensurePdfLinks(posts);
    console.log(`links: ${changed} changed, ${posts.length - changed} current`);
  }
  if (options.ensureLinksOnly) return;

  await fs.mkdir(PDF_DIR, { recursive: true });
  const css = await fs.readFile(CSS_PATH, "utf8");
  const manifest = await readManifest();
  const work = [];

  for (const post of posts) {
    post.source = await fs.readFile(post.sourcePath, "utf8");
    const value = await fingerprint(post, css);
    const pdfPath = path.join(PDF_DIR, `${post.slug}.pdf`);
    let pdfExists = true;
    try {
      await fs.access(pdfPath);
    } catch {
      pdfExists = false;
    }
    if (
      !options.force &&
      pdfExists &&
      manifest.posts?.[post.slug]?.fingerprint === value
    ) {
      console.log(`pdf: unchanged Blog/${post.slug}`);
      continue;
    }
    work.push({ post, fingerprint: value });
  }

  if (work.length === 0) {
    console.log("pdf: no pages need rendering");
    return;
  }

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });
  const failures = [];
  try {
    for (const item of work) {
      try {
        const result = await renderPost(browser, item.post, item.fingerprint);
        const pdfHash = crypto
          .createHash("sha256")
          .update(await fs.readFile(result.outputPath))
          .digest("hex");
        manifest.posts ??= {};
        manifest.posts[item.post.slug] = {
          fingerprint: item.fingerprint,
          pdfHash,
          generatedAt: new Date().toISOString(),
          pages: result.pages,
          bytes: result.bytes,
          tagged: result.tagged,
          sourceUrl: result.url,
        };
        await writeManifest(manifest);
        console.log(
          `pdf: rendered Blog/${item.post.slug} (${result.pages} pages, ${result.bytes} bytes, tagged)`,
        );
      } catch (error) {
        failures.push(`${item.post.slug}: ${error.message}`);
        console.error(`pdf: failed Blog/${item.post.slug}: ${error.message}`);
      }
    }
  } finally {
    await browser.close();
  }

  if (failures.length > 0) {
    throw new Error(`${failures.length} PDF build(s) failed:\n${failures.join("\n")}`);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
