import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const outDir = path.join(process.cwd(), "tmp", "captures");

const shots = [
  { name: "archies-home", url: "https://www.archiespetshop.com/" },
  { name: "archies-products", url: "https://www.archiespetshop.com/products" },
  { name: "repat-home", url: "https://repatglobal.com/" },
  { name: "repat-inventario", url: "https://repatglobal.com/inventario" },
  { name: "austin-home", url: "https://www.austintxcarneenvara.com/en" },
  { name: "austin-menu", url: "https://www.austintxcarneenvara.com/en/menu" },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

await mkdir(outDir, { recursive: true });

for (const shot of shots) {
  try {
    await page.goto(shot.url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForTimeout(2500);
    const file = path.join(outDir, `${shot.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log(`ok ${shot.name}`);
  } catch (error) {
    console.error(`fail ${shot.name}`, error instanceof Error ? error.message : error);
  }
}

await writeFile(path.join(outDir, "index.json"), JSON.stringify(shots, null, 2));
await browser.close();
