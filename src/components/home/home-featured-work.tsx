import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/arrow-icon";
import { DeviceMockup } from "@/components/device-mockup";
import type { HomeContent } from "@/lib/cms";
import type { Project } from "@/types/project";

export async function HomeFeaturedWork({
  teaser,
  project,
}: {
  teaser: HomeContent["workTeaser"];
  project: Project | null;
}) {
  const t = await getTranslations("home");
  if (!project) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-faint">{teaser.eyebrow}</p>
          <h2 className="mt-3 serif-display text-title text-fg">
            {teaser.title} <span className="italic">{teaser.emphasis}</span>
          </h2>
        </div>
        <Link href="/work" className="text-sm text-muted hover:text-fg">
          {t("viewAll")} <ArrowUpRight />
        </Link>
      </div>
      <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="label text-faint">{project.categories.join(" · ") || project.stack.slice(0, 3).join(" · ")}</p>
          <h3 className="mt-3 serif-display text-3xl">{project.title}</h3>
          <p className="mt-4 text-muted">{project.description}</p>
          <Link href={`/work/${project.slug}`} className="mt-6 inline-flex text-sm font-medium text-fg hover:text-muted">
            {t("viewCase")} <ArrowUpRight className="ml-1" />
          </Link>
        </div>
        <DeviceMockup
          desktopSrc={project.desktopImage || project.cover}
          mobileSrc={project.mobileImage}
          alt={project.title}
        />
      </div>
    </section>
  );
}
