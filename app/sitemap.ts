import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
import { site } from "@/content/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const lastModified = new Date();

  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `${site.url}/work/${project.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
