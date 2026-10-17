#!/usr/bin/env node
/**
 * WC Digital visual QA validator
 * Usage: npm run qa:visual [-- --base=http://localhost:3000]
 *
 * Missing refs score 0 (fail). Structural checks can zero a target even if pixels look close.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const REF_DIR = path.join(ROOT, "scripts/qa-validator/refs");
const OUT_DIR = path.join(ROOT, "tmp/qa");
const PASS_THRESHOLD = 90;

const baseArg = process.argv.find((a) => a.startsWith("--base="));
const BASE = (baseArg ? baseArg.split("=")[1] : "http://localhost:3000").replace(/\/$/, "");

const targets = [
  {
    id: "locale-modal.desktop",
    path: "/?qaModal=1",
    viewport: { width: 1440, height: 900 },
    weight: 2,
    showModal: true,
    clipDialog: true,
  },
  { id: "home.desktop", path: "/", viewport: { width: 1440, height: 900 }, weight: 2 },
  { id: "home.mobile", path: "/", viewport: { width: 390, height: 844 }, weight: 2 },
  { id: "services.desktop", path: "/services", viewport: { width: 1440, height: 900 }, weight: 1 },
  { id: "work.desktop", path: "/work", viewport: { width: 1440, height: 900 }, weight: 1 },
  { id: "about.desktop", path: "/about", viewport: { width: 1440, height: 900 }, weight: 1 },
  { id: "process.desktop", path: "/process", viewport: { width: 1440, height: 900 }, weight: 1 },
  { id: "start.desktop", path: "/start", viewport: { width: 1440, height: 900 }, weight: 1 },
];

function loadPng(buffer) {
  return PNG.sync.read(buffer);
}

function applyMasks(png, masks) {
  if (!masks?.length) return;
  for (const mask of masks) {
    const x0 = Math.max(0, Math.floor(mask.x * png.width));
    const y0 = Math.max(0, Math.floor(mask.y * png.height));
    const x1 = Math.min(png.width, Math.ceil((mask.x + mask.w) * png.width));
    const y1 = Math.min(png.height, Math.ceil((mask.y + mask.h) * png.height));
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * png.width + x) * 4;
        png.data[i] = 240;
        png.data[i + 1] = 240;
        png.data[i + 2] = 240;
        png.data[i + 3] = 255;
      }
    }
  }
}

function resizeNearest(src, width, height) {
  const out = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    const sy = Math.min(src.height - 1, Math.floor((y / height) * src.height));
    for (let x = 0; x < width; x++) {
      const sx = Math.min(src.width - 1, Math.floor((x / width) * src.width));
      const si = (sy * src.width + sx) * 4;
      const di = (y * width + x) * 4;
      out.data[di] = src.data[si];
      out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2];
      out.data[di + 3] = src.data[si + 3];
    }
  }
  return out;
}

function ssimScore(a, b) {
  const w = a.width;
  const h = a.height;
  let sumA = 0;
  let sumB = 0;
  const n = w * h;
  const lumA = new Float64Array(n);
  const lumB = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const j = i * 4;
    lumA[i] = 0.299 * a.data[j] + 0.587 * a.data[j + 1] + 0.114 * a.data[j + 2];
    lumB[i] = 0.299 * b.data[j] + 0.587 * b.data[j + 1] + 0.114 * b.data[j + 2];
    sumA += lumA[i];
    sumB += lumB[i];
  }
  const meanA = sumA / n;
  const meanB = sumB / n;
  let varA = 0;
  let varB = 0;
  let cov = 0;
  for (let i = 0; i < n; i++) {
    const da = lumA[i] - meanA;
    const db = lumB[i] - meanB;
    varA += da * da;
    varB += db * db;
    cov += da * db;
  }
  varA /= n;
  varB /= n;
  cov /= n;
  const c1 = 6.5025;
  const c2 = 58.5225;
  const ssim = ((2 * meanA * meanB + c1) * (2 * cov + c2)) / ((meanA * meanA + meanB * meanB + c1) * (varA + varB + c2));
  return Math.max(0, Math.min(1, ssim));
}

function scorePair(actualBuf, refBuf, masks) {
  if (!refBuf) return { score: 0, note: "no-ref" };
  let a = loadPng(actualBuf);
  let r = loadPng(refBuf);
  const w = Math.min(1440, Math.max(a.width, r.width) > 0 ? Math.min(a.width, 1440) : a.width);
  const ratio = a.width / a.height;
  const h = Math.max(1, Math.round(w / ratio));
  a = resizeNearest(a, w, h);
  r = resizeNearest(r, w, h);
  applyMasks(a, masks);
  applyMasks(r, masks);

  const diff = new PNG({ width: w, height: h });
  const mismatched = pixelmatch(a.data, r.data, diff.data, w, h, {
    threshold: 0.12,
    includeAA: true,
  });
  const ratioMismatch = mismatched / (w * h);
  const pixel = Math.max(0, 1 - ratioMismatch);
  const ssim = ssimScore(a, r);
  const score = Math.max(0, Math.min(100, Math.round(100 * (0.6 * pixel + 0.4 * ssim))));
  return { score, diff: PNG.sync.write(diff), ratio: ratioMismatch, ssim };
}

async function structuralChecks(page, target) {
  const issues = [];
  const bodyText = await page.locator("body").innerText();

  if (target.id.startsWith("locale-modal")) {
    const dialog = page.getByRole("dialog");
    if ((await dialog.count()) === 0) issues.push("modal-missing");
    const gb = await dialog.getByText(/\bGB\b/).count();
    if (gb > 0) issues.push("flag-code-GB-instead-of-EN");
    const emojiFlag = await page.evaluate(() => document.body.innerText.includes("🇬🇧") || document.body.innerText.includes("🇪🇸"));
    if (emojiFlag) issues.push("emoji-flags");
    for (const code of ["en", "fr", "es"]) {
      if ((await page.locator(`[data-locale="${code}"]`).count()) === 0) issues.push(`missing-locale-${code}`);
    }
    if ((await dialog.locator("svg").count()) < 3) issues.push("missing-svg-flags");
    if (!/English/i.test(bodyText)) issues.push("missing-label-English");
  } else {
    if (await page.getByRole("dialog").isVisible().catch(() => false)) {
      issues.push("modal-still-open");
    }
    if (/\bGB\b/.test(bodyText) && /English/i.test(bodyText)) {
      issues.push("flag-code-GB-instead-of-EN");
    }
  }

  if (target.id.startsWith("home")) {
    if ((await page.locator("h1").count()) === 0) issues.push("missing-h1");
    const hidden = await page.locator("main .opacity-0").count();
    if (hidden > 2) issues.push(`hidden-sections-${hidden}`);
  }

  return issues;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  let masks = {};
  try {
    masks = JSON.parse(await readFile(path.join(import.meta.dirname, "masks.json"), "utf8"));
  } catch {
    masks = {};
  }

  const origin = new URL(BASE);
  const browser = await chromium.launch();
  const results = [];
  let weightedSum = 0;
  let weightTotal = 0;

  for (const target of targets) {
    const context = await browser.newContext({
      viewport: target.viewport,
      deviceScaleFactor: 1,
      locale: "es-VE",
    });
    if (!target.showModal) {
      await context.addCookies([
        { name: "wc-locale", value: "es", domain: origin.hostname, path: "/" },
        { name: "wc-locale-modal-dismissed", value: "1", domain: origin.hostname, path: "/" },
      ]);
    }

    const page = await context.newPage();
    await page.goto(`${BASE}${target.path}`, { waitUntil: "networkidle", timeout: 120_000 });
    if (target.showModal) {
      await page.getByRole("dialog").waitFor({ state: "visible", timeout: 15_000 });
      await page.waitForTimeout(2500);
    } else {
      await page.waitForTimeout(900);
    }

    const issues = await structuralChecks(page, target);

    let shot;
    if (target.clipDialog) {
      const dialog = page.getByRole("dialog");
      shot = (await dialog.count())
        ? await dialog.screenshot({ type: "png" })
        : await page.screenshot({ fullPage: false, type: "png" });
    } else {
      shot = await page.screenshot({ fullPage: true, type: "png" });
    }
    await context.close();

    const actualPath = path.join(OUT_DIR, `${target.id}.png`);
    await writeFile(actualPath, shot);

    const refPath = path.join(REF_DIR, `${target.id}.png`);
    let refBuf;
    try {
      refBuf = await readFile(refPath);
    } catch {
      refBuf = null;
    }

    const compared = scorePair(shot, refBuf, masks[target.id]);
    if (compared.diff) {
      await writeFile(path.join(OUT_DIR, `${target.id}.diff.png`), compared.diff);
    }

    let score = compared.score;
    let note = compared.note || null;
    if (issues.length) {
      score = 0;
      note = issues.join(",");
    }

    results.push({
      id: target.id,
      path: target.path,
      score,
      note,
      hasRef: Boolean(refBuf),
      ssim: compared.ssim ?? null,
      issues,
    });
    weightedSum += score * target.weight;
    weightTotal += target.weight;
  }

  await browser.close();

  const overall = weightTotal ? Math.round(weightedSum / weightTotal) : 0;
  const report = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    passThreshold: PASS_THRESHOLD,
    overall,
    pass: overall >= PASS_THRESHOLD,
    results,
  };

  await writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));

  const cards = results
    .map((r) => {
      const img = `${r.id}.png`;
      const diff = `${r.id}.diff.png`;
      return `<section><h2>${r.id} — ${r.score}${r.note ? ` (${r.note})` : ""}</h2><p><img src="${img}" width="420"> <img src="${diff}" width="420"></p></section>`;
    })
    .join("");
  const html = `<!doctype html><html><body style="font-family:sans-serif;padding:24px"><h1>QA Visual ${overall}/100 ${report.pass ? "PASS" : "FAIL"}</h1><pre>${JSON.stringify(report, null, 2)}</pre>${cards}</body></html>`;
  await writeFile(path.join(OUT_DIR, "report.html"), html);

  console.log(JSON.stringify(report, null, 2));
  if (overall < PASS_THRESHOLD) {
    console.error(`FAIL: score ${overall} < ${PASS_THRESHOLD}`);
    process.exit(1);
  }
  console.log(`PASS: score ${overall}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
