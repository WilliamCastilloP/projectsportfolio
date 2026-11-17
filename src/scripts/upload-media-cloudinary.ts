/**
 * Sube a Cloudinary los archivos de `media/` que todavía no tienen secure_url.
 * Idempotente: si el documento ya apunta a res.cloudinary.com, lo salta.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { getPayload } from "payload";
import config from "@payload-config";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("Faltan CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY o CLOUDINARY_API_SECRET");
  process.exit(1);
}

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });

const payload = await getPayload({ config });
const mediaDir = path.resolve(process.cwd(), "media");
const { docs } = await payload.find({ collection: "media", limit: 200, depth: 0, pagination: false });

let uploaded = 0;
let skipped = 0;
let missing = 0;

for (const doc of docs) {
  const existing = doc.cloudinary?.secure_url;
  if (typeof existing === "string" && existing.includes("res.cloudinary.com")) {
    skipped += 1;
    console.log("skip", doc.filename);
    continue;
  }

  const filename = doc.filename;
  if (!filename) {
    missing += 1;
    console.error("sin filename", doc.id);
    continue;
  }

  const filePath = path.join(mediaDir, filename);
  if (!existsSync(filePath)) {
    missing += 1;
    console.error("no está en disco", filePath);
    continue;
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder: "wc-digital",
    use_filename: true,
    unique_filename: true,
    resource_type: "image",
  });

  await payload.update({
    collection: "media",
    id: doc.id,
    overrideAccess: true,
    data: {
      cloudinary: {
        public_id: result.public_id,
        resource_type: result.resource_type,
        format: result.format,
        secure_url: result.secure_url,
        bytes: result.bytes,
        created_at: result.created_at,
        version: result.version != null ? String(result.version) : undefined,
        version_id: result.version_id,
        width: result.width,
        height: result.height,
      },
    },
  });

  uploaded += 1;
  console.log("uploaded", filename);
}

console.log({ uploaded, skipped, missing, total: docs.length });
process.exit(0);
