import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { loadOgFonts, OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/lib/og";
import type { Locale } from "@/i18n/routing";
import { getAllProjects, getProject } from "@/lib/projects";
import { getSettings } from "@/lib/site";

type Params = { locale: string; slug: string };

function toLocale(locale: string): Locale {
  return locale === "fr" ? "fr" : locale === "en" ? "en" : "es";
}

export async function generateStaticParams() {
  const projects = await getAllProjects("es");
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateImageMetadata({ params }: { params: Params | Promise<Params> }) {
  const { locale, slug } = await params;
  const lang = toLocale(locale);
  const [project, t] = await Promise.all([
    getProject(slug, lang),
    getTranslations({ locale: lang, namespace: "work" }),
  ]);
  return [
    {
      id: "default",
      alt: project ? t("ogImageAlt", { title: project.title }) : "",
      size: OG_SIZE,
      contentType: OG_CONTENT_TYPE,
    },
  ];
}

export default async function ProjectOpengraphImage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const lang = toLocale(locale);
  const [project, settings, t] = await Promise.all([
    getProject(slug, lang),
    getSettings(lang),
    getTranslations({ locale: lang, namespace: "work" }),
  ]);

  if (!project) notFound();

  return new ImageResponse(
    (
      <OgFrame
        eyebrow={`${settings.name} / ${t("all")}`}
        title={project.title}
        description={project.description}
        footer={`${project.year} · ${project.stack.slice(0, 4).join(" · ")}`}
      />
    ),
    { ...OG_SIZE, fonts: await loadOgFonts() },
  );
}
