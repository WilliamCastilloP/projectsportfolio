import "server-only";

import { cache } from "react";
import { getLocale } from "next-intl/server";
import { getPayloadClient } from "@/lib/payload";
import { mediaUrl } from "@/lib/media";
import type { Locale } from "@/i18n/routing";
import type { Media, Project as PayloadProject } from "@/types/payload-types";
import type { KeyPage, Project, ProjectCategory, ProjectImage } from "@/types/project";

export type { Project, ProjectCategory, KeyPage, ProjectImage };

function compareProjects(a: Project, b: Project) {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.order !== b.order) return a.order - b.order;
  if (a.year !== b.year) return b.year - a.year;
  return a.title.localeCompare(b.title);
}

function toPublic(doc: PayloadProject): Project | null {
  if (!doc.slug || !doc.title) return null;
  const cover = mediaUrl(doc.cover as number | Media);
  if (!cover) return null;

  const images: ProjectImage[] = [];
  for (const row of doc.images ?? []) {
    const src = mediaUrl(row.image as number | Media);
    if (!src) continue;
    images.push({ src, alt: row.alt || undefined, caption: row.caption || undefined });
  }

  const keyPages: KeyPage[] =
    doc.keyPages?.map((p) => ({
      title: p.title || "",
      body: p.body || undefined,
      image: mediaUrl(p.image as number | Media) || undefined,
    })) ?? [];

  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    year: doc.year,
    stack: doc.stack ?? [],
    cover,
    desktopImage: mediaUrl(doc.desktopImage as number | Media) || cover,
    mobileImage: mediaUrl(doc.mobileImage as number | Media) || undefined,
    images,
    categories: (doc.categories as ProjectCategory[] | undefined) ?? [],
    client: doc.client || undefined,
    industry: doc.industry || undefined,
    platform: doc.platform || undefined,
    servicesOffered: doc.servicesOffered?.filter(Boolean) ?? [],
    challenge: doc.challenge || undefined,
    solution: doc.solution || undefined,
    deliverables: doc.deliverables?.filter(Boolean) ?? [],
    keyPages,
    testimonial: doc.testimonial?.quote
      ? {
          quote: doc.testimonial.quote,
          author: doc.testimonial.author || "",
          role: doc.testimonial.role || undefined,
          avatar: mediaUrl(doc.testimonial.avatar as number | Media) || undefined,
        }
      : undefined,
    liveLabel: doc.liveLabel || undefined,
    liveUrl: doc.liveUrl || undefined,
    repoUrl: doc.repoUrl || undefined,
    featured: Boolean(doc.featured),
    order: doc.order ?? 100,
    aside: doc.aside || undefined,
    body: doc.body,
  };
}

async function currentLocale(): Promise<Locale> {
  try {
    const locale = await getLocale();
    if (locale === "en" || locale === "fr") return locale;
    return "es";
  } catch {
    return "es";
  }
}

export const getAllProjects = cache(async (explicit?: Locale): Promise<Project[]> => {
  try {
    const payload = await getPayloadClient();
    const locale = explicit ?? (await currentLocale());
    const result = await payload.find({
      collection: "projects",
      where: { status: { equals: "published" } },
      depth: 2,
      limit: 100,
      sort: "order",
      locale,
      fallbackLocale: "es",
    });

    return result.docs.map(toPublic).filter((doc): doc is Project => doc !== null).sort(compareProjects);
  } catch {
    return [];
  }
});

export const getProject = cache(async (slug: string, explicit?: Locale): Promise<Project | null> => {
  const projects = await getAllProjects(explicit);
  return projects.find((project) => project.slug === slug) ?? null;
});

export async function getProjectNeighbours(slug: string) {
  const projects = await getAllProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}

export async function getFeaturedProject(): Promise<Project | null> {
  const all = await getAllProjects();
  return all.find((p) => p.featured) ?? all[0] ?? null;
}
