import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/arrow-icon";
import { DeviceMockup } from "@/components/device-mockup";
import type { HomeContent } from "@/lib/cms";
import type { Project, ProjectCategory } from "@/types/project";

function categoryLabels(project: Project, label: (key: string) => string) {
  if (project.categories.length) {
    return project.categories.map((c) => label(`filter.${c as ProjectCategory}`));
  }
  return project.stack.slice(0, 2);
}

function CategoryBadges({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label) => (
        <span
          key={label}
          className="rounded-full bg-apricot-soft px-2.5 py-1 text-xs font-medium text-ink"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export async function HomeFeaturedWork({
  teaser,
  projects,
}: {
  teaser: HomeContent["workTeaser"];
  projects: Project[];
}) {
  const t = await getTranslations("home");
  const tWork = await getTranslations("work");
  if (projects.length === 0) return null;

  const [featured, ...rest] = projects;
  const featuredLabels = categoryLabels(featured, (key) => tWork(key));

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-faint">{teaser.eyebrow}</p>
          <h2 className="mt-3 serif-display text-title text-fg">
            {teaser.title} <span className="italic text-brand">{teaser.emphasis}</span>
          </h2>
        </div>
        <Link href="/work" className="inline-flex text-sm text-muted transition hover:text-brand">
          {t("viewAll")} <ArrowRight className="ml-1" />
        </Link>
      </div>

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <CategoryBadges labels={featuredLabels} />
          <h3 className="mt-4 serif-display text-3xl text-fg">{featured.title}</h3>
          <p className="mt-4 text-muted">{featured.description}</p>
          <Link
            href={`/work/${featured.slug}`}
            className="mt-6 inline-flex text-sm font-medium text-fg transition hover:text-brand"
          >
            {t("viewCase")} <ArrowRight className="ml-1" />
          </Link>
        </div>
        <DeviceMockup
          desktopSrc={featured.desktopImage || featured.cover}
          mobileSrc={featured.mobileImage}
          alt={featured.title}
        />
      </div>

      {rest.length > 0 ? (
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {rest.map((project) => {
            const labels = categoryLabels(project, (key) => tWork(key));
            return (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="card-layered group overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-elevated">
                  <Image
                    src={project.cover}
                    alt=""
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(min-width: 640px) 28vw, 90vw"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <CategoryBadges labels={labels} />
                  <p className="mt-3 font-medium text-fg group-hover:text-brand">{project.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{project.description}</p>
                  <span className="mt-4 inline-flex text-sm text-fg">
                    {t("viewCase")} <ArrowRight className="ml-1 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}

      <p className="mt-10 text-center text-sm text-muted sm:mt-12">
        <Link href="/start" className="inline-flex text-fg transition hover:text-brand">
          {t("wantSomethingLike")} <ArrowRight className="ml-1" />
        </Link>
      </p>
    </section>
  );
}