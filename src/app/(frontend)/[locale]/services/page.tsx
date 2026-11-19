import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/cta-band";
import { ArrowRight } from "@/components/arrow-icon";
import { CheckMark } from "@/components/check-mark";
import { ServiceIllustration } from "@/components/service-illustration";
import { Link } from "@/i18n/navigation";
import { languageAlternates } from "@/i18n/path";
import { getServicesContent } from "@/lib/cms";
import { pageOpenGraph } from "@/lib/metadata";

export async function generateMetadata(
  _props: PageProps<"/[locale]/services">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [data, t] = await Promise.all([getServicesContent(), getTranslations("services")]);
  const title = t("metaTitle");
  return {
    title,
    description: data.intro,
    alternates: { canonical: "/services", languages: languageAlternates("/services") },
    openGraph: await pageOpenGraph({ path: "/services", title, description: data.intro, parent }),
  };
}

export default async function ServicesPage() {
  const [data, t] = await Promise.all([getServicesContent(), getTranslations("services")]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-8 sm:px-8 sm:pt-10">
        <p className="label text-faint">{data.eyebrow}</p>
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-end">
          <h1 className="serif-display text-title text-fg">
            {data.title || t("fallbackTitle")}{" "}
            <span className="italic text-brand">{data.emphasis || t("fallbackEmphasis")}</span>
          </h1>
          <div>
            <p className="text-muted">{data.intro || t("fallbackIntro")}</p>
            <Link
              href="/start"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand"
            >
              {t("start")} <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {data.items.map((item, index) => (
        <section
          key={item.slug}
          id={item.slug}
          className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8"
        >
          <div
            className={`grid items-center gap-12 lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            <div>
              <p className="label text-faint">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 serif-display text-3xl">{item.title}</h2>
              <p className="mt-2 font-medium text-muted">{item.subtitle}</p>
              <p className="mt-4 text-muted">{item.body}</p>
              <ul className="mt-6 space-y-2 text-sm text-muted">
                {item.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <CheckMark />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/start?service=${item.slug}`}
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand"
              >
                {t("startWith", { service: item.title })} <ArrowRight />
              </Link>
            </div>
            <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-lilac/30 bg-surface p-6 sm:p-10">
              <ServiceIllustration name={item.illustration || item.slug} />
            </div>
          </div>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
