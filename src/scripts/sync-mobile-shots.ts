import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { chromium, devices } from "playwright";
import { getPayload } from "payload";
import config from "@payload-config";

const captures = path.join(process.cwd(), "tmp", "captures");
const mediaDir = path.join(process.cwd(), "media");

const shots = [
  {
    slug: "archies-pet-shop",
    filename: "archies-home-mobile.png",
    alt: "Archie's Pet Shop — mobile",
    url: "https://www.archiespetshop.com/",
  },
  {
    slug: "repat-global",
    filename: "repat-home-mobile.png",
    alt: "REPAT Global — mobile",
    url: "https://repatglobal.com/",
  },
  {
    slug: "austin-tx-carne-en-vara",
    filename: "austin-home-mobile.png",
    alt: "Austin TX Carne en Vara — mobile",
    url: "https://www.austintxcarneenvara.com/en",
    pickEnglish: true,
  },
];

async function dismissOverlays(page: import("playwright").Page) {
  const candidates = [
    "button:has-text('Accept')",
    "button:has-text('Aceptar')",
    "button:has-text('I agree')",
    "button:has-text('Got it')",
    "button:has-text('Cerrar')",
    "button:has-text('Close')",
    "[aria-label='Close']",
    "[aria-label='Cerrar']",
  ];
  for (const sel of candidates) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click({ timeout: 1500 }).catch(() => undefined);
    }
  }
}

await mkdir(captures, { recursive: true });
await mkdir(mediaDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const iphone = devices["iPhone 14"];

for (const shot of shots) {
  const context = await browser.newContext({
    ...iphone,
    locale: "es-VE",
  });
  const page = await context.newPage();
  try {
    await page.goto(shot.url, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForTimeout(2800);
    await dismissOverlays(page);
    if (shot.pickEnglish) {
      const english = page.getByRole("button", { name: /english/i }).first();
      if (await english.isVisible().catch(() => false)) {
        await english.click();
        await page.waitForTimeout(1600);
      }
    }
    await page.waitForTimeout(800);
    const dest = path.join(captures, shot.filename);
    await page.screenshot({ path: dest, fullPage: false, type: "png" });
    await copyFile(dest, path.join(mediaDir, shot.filename));
    console.log("captured", shot.filename);
  } catch (error) {
    console.error("fail", shot.filename, error instanceof Error ? error.message : error);
  }
  await context.close();
}

await browser.close();

const payload = await getPayload({ config });

for (const shot of shots) {
  const filepath = path.join(captures, shot.filename);
  if (!existsSync(filepath)) {
    console.error("skip upload, missing", shot.filename);
    continue;
  }

  const existingMedia = await payload.find({
    collection: "media",
    where: { filename: { equals: shot.filename } },
    limit: 1,
    overrideAccess: true,
  });

  if (existingMedia.docs[0]) {
    await payload.delete({
      collection: "media",
      id: existingMedia.docs[0].id,
      overrideAccess: true,
    });
  }

  const data = await readFile(filepath);
  const created = await payload.create({
    collection: "media",
    data: { alt: shot.alt },
    file: {
      data,
      mimetype: "image/png",
      name: shot.filename,
      size: data.byteLength,
    },
    overrideAccess: true,
  });

  const project = await payload.find({
    collection: "projects",
    where: { slug: { equals: shot.slug } },
    limit: 1,
    overrideAccess: true,
  });

  if (!project.docs[0]) {
    console.error("project missing", shot.slug);
    continue;
  }

  await payload.update({
    collection: "projects",
    id: project.docs[0].id,
    data: { mobileImage: created.id },
    overrideAccess: true,
  });

  console.log("linked", shot.slug, "→", created.filename);
}

process.exit(0);
