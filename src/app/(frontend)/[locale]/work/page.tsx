import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/cta-band";
import { WorkShowcase } from "@/components/work/work-showcase";
import { languageAlternates } from "@/i18n/path";
import { pageOpenGraph } from "@/lib/metadata";
import { getAllProjects } from "@/lib/projects";

export async function generateMetadata(
  _props: PageProps<"/[locale]/work">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const t = await getTranslations("work");
  const title = t("all");
  return {
    title,
    alternates: { canonical: "/work", languages: languageAlternates("/work") },
    openGraph: await pageOpenGraph({ path: "/work", title, description: t("intro"), parent }),
  };
}

export default async function WorkPage() {
  const [projects, t] = await Promise.all([getAllProjects(), getTranslations("work")]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-8 sm:px-8 sm:pt-10">
        <p className="label text-faint">{t("eyebrow")}</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-end">
          <h1 className="serif-display text-title">
            {t("headline")} <span className="italic text-brand">{t("headlineEmphasis")}</span>
          </h1>
          <p className="text-muted">{t("intro")}</p>
        </div>
        {projects.length === 0 ? (
          <p className="mt-12 text-muted">{t("empty")}</p>
        ) : (
          <WorkShowcase projects={projects} />
        )}
      </section>
      <CtaBand />
    </>
  );
}
