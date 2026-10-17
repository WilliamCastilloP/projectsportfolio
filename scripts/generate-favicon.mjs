import sharp from "sharp";

const src = "public/brand/wc-monogram.png";
const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
let minX = info.width;
let minY = info.height;
let maxX = 0;
let maxY = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 3;
    if (data[i] < 40) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}

const padX = Math.round((maxX - minX) * 0.06);
const padY = Math.round((maxY - minY) * 0.08);
minX = Math.max(0, minX - padX);
minY = Math.max(0, minY - padY);
const bw = Math.min(info.width - minX, maxX - minX + 1 + padX);
const bh = Math.min(info.height - minY, maxY - minY + 1 + padY);

const mark = await sharp(src)
  .extract({ left: minX, top: minY, width: bw, height: bh })
  .ensureAlpha()
  .toBuffer();

async function icon(size, radius, out, fill = 0.74) {
  const inner = Math.round(size * fill);
  const resized = await sharp(mark)
    .resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .negate({ alpha: false })
    .png()
    .toBuffer();

  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#111111"/></svg>`,
  );

  await sharp(bg)
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toFile(out);
  console.log("wrote", out, `${size}x${size}`);
}

await icon(32, 7, "public/brand/favicon.png", 0.78);
await icon(192, 42, "public/brand/favicon-192.png", 0.74);
await icon(180, 40, "public/brand/apple-touch-icon.png", 0.72);
await icon(180, 40, "src/app/(frontend)/apple-icon.png", 0.72);
await icon(32, 7, "src/app/(frontend)/icon.png", 0.78);
