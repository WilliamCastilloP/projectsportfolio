import type { MetadataRoute } from "next";
import { localizedPath } from "@/i18n/path";
import { routing, type Locale } from "@/i18n/routing";
import { getAllProjects } from "@/lib/projects";
import { getSettings } from "@/lib/site";

const paths = ["/", "/work", "/services", "/process", "/about", "/start", "/privacy", "/terms", "/cookies"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings("es");
  const origin = settings.url.replace(/\/$/, "");
  const lastModified = new Date();
  const projectSlugs = new Set<string>();

  for (const locale of routing.locales) {
    const projects = await getAllProjects(locale);
    for (const p of projects) projectSlugs.add(p.slug);
  }

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales as readonly Locale[]) {
    for (const path of paths) {
      entries.push({
        url: `${origin}${localizedPath(path, locale)}`,
        lastModified,
        changeFrequency: path === "/" || path === "/work" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.8,
      });
    }
    for (const slug of projectSlugs) {
      entries.push({
        url: `${origin}${localizedPath(`/work/${slug}`, locale)}`,
        lastModified,
        changeFrequency: "yearly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
