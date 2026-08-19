import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { getAllProjects } from "@/lib/projects";
import { cn } from "@/lib/utils";

export async function SelectedWork() {
  const projects = await getAllProjects();

  return (
    <section id="work" className="scroll-mt-24 py-20 sm:py-28">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
          <SectionLabel index="01">Selected work</SectionLabel>
          <p className="label text-faint">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
      </Reveal>

      {projects.length === 0 ? (
        <p className="mt-10 text-sm text-muted">
          No projects yet — add an <code className="font-mono text-fg">.mdx</code> file to{" "}
          <code className="font-mono text-fg">content/projects/</code>.
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:gap-6">
          {projects.map((project, index) => (
            <Reveal
              key={project.slug}
              className={cn("h-full", project.featured && "sm:col-span-2")}
              delay={index === 0 ? 0 : 0.05}
              amount={0.15}
            >
              <ProjectCard project={project} index={index + 1} priority={index === 0} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
