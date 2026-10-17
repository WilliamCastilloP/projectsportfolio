import type { CollectionSlug, Payload } from "payload";

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type UniqueSlugArgs = {
  payload: Payload;
  title: string;
  collection?: CollectionSlug;
  excludeId?: string | number;
};

const MAX_ATTEMPTS = 100;

export async function uniqueSlug({
  payload,
  title,
  collection = "projects",
  excludeId,
}: UniqueSlugArgs): Promise<string> {
  const base = slugify(title) || "proyecto";
  let slug = base;

  for (let n = 2; n <= MAX_ATTEMPTS; n += 1) {
    const existing = await payload.find({
      collection,
      where: {
        and: [
          { slug: { equals: slug } },
          ...(excludeId != null ? [{ id: { not_equals: excludeId } }] : []),
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    if (existing.docs.length === 0) {
      return slug;
    }

    slug = `${base}-${n}`;
  }

  throw new Error(`No se pudo generar un slug único para "${title}"`);
}
