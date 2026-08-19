import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { loadOgFonts, OG_CONTENT_TYPE, OG_SIZE, OgFrame } from "@/lib/og";
import { getAllProjects, getProject } from "@/lib/projects";
import { site } from "@/content/site";

export const alt = "Project case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return new ImageResponse(
    (
      <OgFrame
        eyebrow={`${site.name} / Work`}
        title={project.title}
        description={project.description}
        footer={`${project.year} · ${project.stack.slice(0, 4).join(" · ")}`}
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
