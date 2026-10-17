"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/arrow-icon";
import { DeviceMockup } from "@/components/device-mockup";
import type { Project, ProjectCategory } from "@/types/project";

const filters: Array<ProjectCategory | "all"> = ["all", "website", "ecommerce", "landing", "branding"];

export function WorkShowcase({ projects }: { projects: Project[] }) {
  const t = useTranslations("work");
  const [active, setActive] = useState<ProjectCategory | "all">("all");

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
            className={`rounded-full px-4 py-2 text-sm transition ${
              active === f ? "bg-fg text-surface" : "border border-line text-muted hover:border-fg/30"
            }`}
          >
            {t(`filter.${f}`)}
          </button>
        ))}
      </div>

      <div className="mt-16 space-y-24">
        {filtered.map((project, index) => (
          <article
            key={project.slug}
            className={`grid items-center gap-12 lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            <Link href={`/work/${project.slug}`} className="group block">
              <DeviceMockup
                desktopSrc={project.desktopImage || project.cover}
                mobileSrc={project.mobileImage}
                alt={project.title}
                className="transition duration-300 group-hover:-translate-y-1"
              />
            </Link>
            <div>
              <p className="label text-faint">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 serif-display text-3xl">{project.title}</h2>
              <p className="label mt-2 text-faint">
                {(project.categories.length ? project.categories : project.stack.slice(0, 3)).join(" · ")}
              </p>
              <p className="mt-4 text-muted">{project.description}</p>
              <Link href={`/work/${project.slug}`} className="mt-6 inline-flex text-sm font-medium">
                {t("viewProject")} <ArrowUpRight className="ml-1" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
