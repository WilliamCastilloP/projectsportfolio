#!/usr/bin/env node
/**
 * Crop mockup PNGs into QA refs (page area only, no extra device chrome when possible).
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "../..");
const MOCK = path.join(ROOT, "mockups");
const REF = path.join(ROOT, "scripts/qa-validator/refs");

const jobs = [
  {
    id: "locale-modal.desktop",
    file: "NOVA - Language Selection Modal.png",
    extract: { left: 459, top: 270, width: 618, height: 525 },
  },
  {
    id: "home.desktop",
    file: "NOVA Digital Studio Website Mockup - home.png",
    extract: { left: 56, top: 24, width: 820, height: 1120 },
  },
  {
    id: "home.mobile",
    file: "NOVA Digital Studio Website Mockup - home.png",
    extract: { left: 1008, top: 58, width: 236, height: 512 },
  },
  {
    id: "services.desktop",
    file: "NOVA Digital Studio  - Services.png",
  },
  {
    id: "work.desktop",
    file: "NOVA Digital Studio Portfolio -  Showcase.png",
  },
  {
    id: "about.desktop",
    file: "NOVA  - About Page.png",
  },
  {
    id: "process.desktop",
    file: "A Simple Collaborative Web -  Process section.png",
  },
  {
    id: "start.desktop",
    file: "start a project.png",
  },
  {
    id: "project.desktop",
    file: "Maison Lune E-Commerce - proyect details page.png",
  },
];

await mkdir(REF, { recursive: true });

for (const job of jobs) {
  const src = path.join(MOCK, job.file);
  let img = sharp(src);
  if (job.extract) {
    img = img.extract(job.extract);
  }
  const dest = path.join(REF, `${job.id}.png`);
  await img.png().toFile(dest);
  const meta = await sharp(dest).metadata();
  console.log(job.id, `${meta.width}x${meta.height}`);
}
