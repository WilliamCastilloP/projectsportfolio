import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckMark } from "@/components/check-mark";
import { DeviceMockup } from "@/components/device-mockup";
import { RichText } from "@/components/rich-text";
import { ShareButton } from "@/components/share-button";
import { ArrowRight, ArrowUpRight } from "@/components/arrow-icon";
import { Link } from "@/i18n/navigation";
import { canonicalLocalizedUrl, languageAlternates } from "@/i18n/path";
import type { Locale } from "@/i18n/routing";
import { pageOpenGraph } from "@/lib/metadata";
import { getProject } from "@/lib/projects";
import { getSettings } from "@/lib/site";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  const path = `/work/${project.slug}`;
  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: path,
      languages: languageAlternates(path),
    },
    openGraph: await pageOpenGraph({
      path,
      title: project.title,
      description: project.description,
      type: "article",
    }),
  };
}

function DeliverableList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="space-y-2 text-sm text-muted">
      {items.map((d) => (
        <li key={d} className="flex gap-3">
          <CheckMark />
          <span>{d}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { slug, locale } = await params;
  const loc = locale as Locale;
  const [project, t, settings] = await Promise.all([
    getProject(slug),
    getTranslations("work"),
    getSettings(loc),
  ]);
  if (!project) notFound();

  const shareUrl = canonicalLocalizedUrl(settings.url, `/work/${project.slug}`, loc);

  const meta = [
    { label: t("client"), value: project.client },
    { label: t("industry"), value: project.industry },
    { label: t("platform"), value: project.platform },
    { label: t("year"), value: String(project.year) },
  ].filter((m) => m.value);

  return (
    <>
      <article className="mx-auto max-w-6xl px-5 pt-8 sm:px-8 sm:pt-10">
        <Link href="/work" className="text-sm text-muted hover:text-fg">
          ← {t("back")}
        </Link>
        {project.categories.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-2">
            {project.categories.map((c) => (
              <li key={c} className="rounded-full bg-apricot-soft px-3 py-1 text-sm font-medium text-ink">
                {t(`filter.${c}`)}
              </li>
            ))}
          </ul>
        ) : null}
        <h1 className={`${project.categories.length > 0 ? "mt-4" : "mt-8"} serif-display text-title`}>
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-muted">{project.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary inline-flex">
              {project.liveLabel || t("live")} <ArrowUpRight />
            </a>
          ) : null}
          <ShareButton
            kind="project"
            url={shareUrl}
            title={project.title}
            text={project.description || project.title}
          />
        </div>

        <div className="mt-12 rounded-[2rem] bg-brand-soft px-4 py-10 sm:px-10 sm:py-14">
          <DeviceMockup
            desktopSrc={project.desktopImage || project.cover}
            mobileSrc={project.mobileImage}
            alt={project.title}
          />
        </div>

        {meta.length > 0 ? (
          <dl className="mt-12 grid gap-4 border-y border-line py-8 sm:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="label text-faint">{m.label}</dt>
                <dd className="mt-1 text-sm">{m.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {project.servicesOffered.length > 0 ? (
          <div className="mt-8">
            <p className="label text-faint">{t("services")}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.servicesOffered.map((service) => (
                <li key={service} className="rounded-full bg-teal-soft px-3 py-1 text-sm font-medium text-ink">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* El body trae sus propios titulares; challenge y solution lo resumen y solo se pintan si no hay body. */}
        {project.body ? (
          <>
            <div className="mt-16 max-w-3xl">
              <RichText data={project.body} aside={project.aside} />
            </div>
            {project.deliverables.length > 0 ? (
              <section className="mt-16 grid gap-8 lg:grid-cols-2">
                <h2 className="serif-display text-3xl">{t("deliverables")}</h2>
                <DeliverableList items={project.deliverables} />
              </section>
            ) : null}
          </>
        ) : (
          <>
            {project.challenge ? (
              <section className="mt-16 grid gap-8 lg:grid-cols-2">
                <h2 className="serif-display text-3xl">{t("overview")}</h2>
                <p className="text-muted">{project.challenge}</p>
              </section>
            ) : null}

            {project.solution || project.deliverables.length > 0 ? (
              <section className="mt-16 grid gap-8 lg:grid-cols-2">
                <h2 className="serif-display text-3xl">{project.solution ? t("solution") : t("deliverables")}</h2>
                <div>
                  {project.solution ? <p className="mb-6 text-muted">{project.solution}</p> : null}
                  <DeliverableList items={project.deliverables} />
                </div>
              </section>
            ) : null}
          </>
        )}

        {project.keyPages.length > 0 ? (
          <section className="mt-20">
            <p className="label text-faint">{t("keyPages")}</p>
            <h2 className="mt-3 serif-display text-3xl">{t("keyPagesTitle")}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {project.keyPages.map((page) => (
                <figure key={page.title} className="card-layered p-4">
                  {page.image ? (
                    <Image src={page.image} alt="" width={400} height={300} unoptimized className="rounded-lg" />
                  ) : null}
                  <figcaption className="mt-3 font-medium">{page.title}</figcaption>
                  {page.body ? <p className="mt-1 text-sm text-muted">{page.body}</p> : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {project.testimonial ? (
          <blockquote className="mt-20 border-l-2 border-teal pl-6">
            <p className="serif-display text-2xl italic">&ldquo;{project.testimonial.quote}&rdquo;</p>
            <footer className="mt-4 text-sm text-muted">
              — {project.testimonial.author}
              {project.testimonial.role ? `, ${project.testimonial.role}` : ""}
            </footer>
          </blockquote>
        ) : null}
      </article>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-brand-soft px-8 py-8 sm:flex-row sm:items-center sm:px-10 sm:py-9">
          <div className="max-w-xl">
            <h2 className="serif-display text-3xl text-fg">{t("wantTitle")}</h2>
            <p className="mt-2 text-muted">{t("wantBody")}</p>
          </div>
          <Link
            href="/start"
            className="inline-flex shrink-0 items-center gap-1.5 font-medium text-brand underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand"
          >
            {t("wantLink")}
            <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
