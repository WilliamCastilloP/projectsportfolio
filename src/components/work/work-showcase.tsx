"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/arrow-icon";
import { DeviceMockup } from "@/components/device-mockup";
import { cn } from "@/lib/cn";
import type { Project, ProjectCategory } from "@/types/project";

const categories: ProjectCategory[] = ["website", "ecommerce", "landing", "branding"];

export function WorkShowcase({ projects }: { projects: Project[] }) {
  const t = useTranslations("work");
  const [active, setActive] = useState<ProjectCategory | "all">("all");

  const filters = useMemo<Array<ProjectCategory | "all">>(
    () => ["all", ...categories.filter((c) => projects.some((p) => p.categories.includes(c)))],
    [projects],
  );

  const filtered = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((p) => p.categories.includes(active));
  }, [active, projects]);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            aria-pressed={active === f}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition-colors",
              active === f
                ? "bg-brand text-white"
                : "border border-lilac/50 text-ink hover:border-brand/40 hover:bg-brand-soft",
            )}
          >
            {t(`filter.${f}`)}
          </button>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-8">
        {filtered.map((project, index) => (
          <article
            key={project.slug}
            className={cn(
              "card-layered grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12",
              index % 2 === 1 && "lg:[&>*:first-child]:order-2",
            )}
          >
            <Link href={`/work/${project.slug}`} className="block">
              <DeviceMockup
                desktopSrc={project.desktopImage || project.cover}
                mobileSrc={project.mobileImage}
                alt={project.title}
              />
            </Link>
            <div>
              <p className="label text-faint">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 serif-display text-3xl">{project.title}</h2>
              <p className="mt-2 text-sm text-muted">
                {(project.categories.length
                  ? project.categories.map((c) => t(`filter.${c}`))
                  : project.stack.slice(0, 3)
                ).join(" · ")}
              </p>
              <p className="mt-4 text-muted">{project.description}</p>
              <Link
                href={`/work/${project.slug}`}
                className="mt-6 inline-flex items-center text-sm font-medium text-brand underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand"
              >
                {t("viewProject")} <ArrowUpRight className="ml-1" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
