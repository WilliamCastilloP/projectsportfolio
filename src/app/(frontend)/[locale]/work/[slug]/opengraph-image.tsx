import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { loadOgFonts, OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/lib/og";
import type { Locale } from "@/i18n/routing";
import { getAllProjects, getProject } from "@/lib/projects";
import { getSettings } from "@/lib/site";

export const alt = "Project case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  const projects = await getAllProjects("es");
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const lang: Locale = locale === "fr" ? "fr" : locale === "en" ? "en" : "es";
  const [project, settings] = await Promise.all([getProject(slug, lang), getSettings(lang)]);

  if (!project) notFound();

  return new ImageResponse(
    (
      <OgFrame
        eyebrow={`${settings.name} / ${lang === "es" ? "Trabajo" : "Work"}`}
        title={project.title}
        description={project.description}
        footer={`${project.year} · ${project.stack.slice(0, 4).join(" · ")}`}
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
