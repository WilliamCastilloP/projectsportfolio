/**
 * Generates a stand-in PNG for every `cover` / `images` path referenced by
 * content/projects/*.mdx that doesn't exist on disk yet, so a fresh clone
 * builds before you have real screenshots. Existing files are never touched.
 *
 *   node scripts/generate-placeholders.mjs          # fill in what's missing
 *   node scripts/generate-placeholders.mjs --force  # regenerate everything
 */

import { mkdir, readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";
import sharp from "sharp";

const ROOT = process.cwd();
const PROJECTS_DIR = path.join(ROOT, "content", "projects");
const PUBLIC_DIR = path.join(ROOT, "public");
const FORCE = process.argv.includes("--force");

const WIDTH = 1600;
const HEIGHT = 1000;
const BG = "#0f0f0f";
const LINE = "#1e1e1e";
const BLOCK = "#181818";
const BLOCK_ALT = "#202020";
const ACCENT = "#ff6a3d";

function hash(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministic 0..1 sequence so a given asset always renders identically. */
function seeded(seed) {
  let state = seed || 1;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function rect(x, y, w, h, fill, radius = 6, opacity = 1) {
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(
    1,
  )}" rx="${radius}" fill="${fill}" opacity="${opacity}" />`;
}

function buildSvg(key) {
  const random = seeded(hash(key));
  const accentColumn = random() > 0.5;
  const rows = 3 + Math.floor(random() * 2);
  const columns = 2 + Math.floor(random() * 2);

  const chromeHeight = 56;
  const sidebarWidth = accentColumn ? 260 : 0;
  const padding = 48;
  const contentX = sidebarWidth + padding;
  const contentWidth = WIDTH - contentX - padding;

  const parts = [];

  // Window chrome.
  parts.push(rect(0, 0, WIDTH, chromeHeight, "#141414", 0));
  parts.push(
    `<line x1="0" y1="${chromeHeight}" x2="${WIDTH}" y2="${chromeHeight}" stroke="${LINE}" stroke-width="1" />`,
  );
  [0, 1, 2].forEach((i) => {
    parts.push(
      `<circle cx="${36 + i * 26}" cy="${chromeHeight / 2}" r="6" fill="#2b2b2b" />`,
    );
  });
  parts.push(rect(WIDTH / 2 - 180, chromeHeight / 2 - 11, 360, 22, "#1b1b1b", 11));

  // Optional sidebar.
  if (sidebarWidth > 0) {
    parts.push(rect(0, chromeHeight, sidebarWidth, HEIGHT - chromeHeight, "#121212", 0));
    parts.push(
      `<line x1="${sidebarWidth}" y1="${chromeHeight}" x2="${sidebarWidth}" y2="${HEIGHT}" stroke="${LINE}" stroke-width="1" />`,
    );
    for (let i = 0; i < 7; i += 1) {
      const y = chromeHeight + 52 + i * 44;
      const w = 96 + random() * 96;
      parts.push(rect(32, y, w, 12, i === 1 ? ACCENT : BLOCK_ALT, 6, i === 1 ? 0.85 : 1));
    }
  }

  // Header block.
  let cursorY = chromeHeight + padding;
  parts.push(rect(contentX, cursorY, 120, 12, ACCENT, 6, 0.8));
  cursorY += 34;
  parts.push(rect(contentX, cursorY, contentWidth * 0.62, 34, BLOCK_ALT, 8));
  cursorY += 52;
  parts.push(rect(contentX, cursorY, contentWidth * 0.48, 12, BLOCK, 6));
  cursorY += 28;
  parts.push(rect(contentX, cursorY, contentWidth * 0.38, 12, BLOCK, 6));
  cursorY += 56;

  // Card grid.
  const gap = 28;
  const cardWidth = (contentWidth - gap * (columns - 1)) / columns;
  const available = HEIGHT - cursorY - padding;
  const cardHeight = (available - gap * (rows - 1)) / rows;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = contentX + column * (cardWidth + gap);
      const y = cursorY + row * (cardHeight + gap);
      const isAccent = row === 0 && column === 0 && !accentColumn;
      parts.push(rect(x, y, cardWidth, cardHeight, BLOCK, 10));
      parts.push(
        rect(x + 20, y + 20, cardWidth * (0.3 + random() * 0.4), 10, isAccent ? ACCENT : BLOCK_ALT, 5, 0.9),
      );
      parts.push(rect(x + 20, y + 46, cardWidth * (0.55 + random() * 0.3), 8, BLOCK_ALT, 4, 0.6));
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="bloom" cx="78%" cy="6%" r="62%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.16" />
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0 L0 0 0 64" fill="none" stroke="${LINE}" stroke-width="1" opacity="0.5" />
    </pattern>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)" />
  ${parts.join("\n  ")}
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bloom)" />
</svg>`;
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function collectAssetPaths() {
  const entries = await readdir(PROJECTS_DIR);
  const assets = new Set();

  for (const entry of entries) {
    if (!entry.endsWith(".mdx")) continue;
    const raw = await readFile(path.join(PROJECTS_DIR, entry), "utf8");
    const { data } = matter(raw);

    if (typeof data.cover === "string") assets.add(data.cover);
    for (const image of data.images ?? []) {
      const src = typeof image === "string" ? image : image?.src;
      if (typeof src === "string") assets.add(src);
    }
  }

  return [...assets];
}

async function main() {
  const assets = await collectAssetPaths();
  let created = 0;

  for (const asset of assets) {
    const target = path.join(PUBLIC_DIR, asset.replace(/^\//, ""));

    if (!FORCE && (await exists(target))) continue;

    await mkdir(path.dirname(target), { recursive: true });
    await sharp(Buffer.from(buildSvg(asset))).png({ compressionLevel: 9 }).toFile(target);
    created += 1;
    console.log(`generated public${asset}`);
  }

  console.log(
    created === 0
      ? `All ${assets.length} project image(s) already present.`
      : `Generated ${created} placeholder(s) of ${assets.length} referenced image(s).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
