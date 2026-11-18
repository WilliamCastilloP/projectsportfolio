import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DeviceMockup } from "@/components/device-mockup";
import { RichText } from "@/components/rich-text";
import { ArrowRight, ArrowUpRight } from "@/components/arrow-icon";
import { Link } from "@/i18n/navigation";
import { languageAlternates } from "@/i18n/path";
import { pageOpenGraph } from "@/lib/metadata";
import { getProject } from "@/lib/projects";

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
        <li key={d} className="flex gap-2">
          <span aria-hidden>✓</span> {d}
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const t = await getTranslations("work");

  const meta = [
    { label: t("client"), value: project.client },
    { label: t("industry"), value: project.industry },
    { label: t("services"), value: project.servicesOffered.join(", ") },
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
          <p className="label mt-8 text-faint">{project.categories.map((c) => t(`filter.${c}`)).join(" · ")}</p>
        ) : null}
        <h1 className={`${project.categories.length > 0 ? "mt-3" : "mt-8"} serif-display text-title`}>
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-muted">{project.description}</p>
        {project.liveUrl ? (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary mt-6 inline-flex">
            {project.liveLabel || t("live")} <ArrowUpRight />
          </a>
        ) : null}

        <div className="mt-12">
          <DeviceMockup
            desktopSrc={project.desktopImage || project.cover}
            mobileSrc={project.mobileImage}
            alt={project.title}
          />
        </div>

        {meta.length > 0 ? (
          <dl className="mt-12 grid gap-4 border-y border-line py-8 sm:grid-cols-5">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="label text-faint">{m.label}</dt>
                <dd className="mt-1 text-sm">{m.value}</dd>
              </div>
            ))}
          </dl>
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
                <figure key={page.title} className="rounded-2xl border border-line bg-elevated p-4">
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
          <blockquote className="mt-20 border-l-2 border-fg pl-6">
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
