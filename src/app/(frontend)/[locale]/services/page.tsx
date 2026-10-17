import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/cta-band";
import { ArrowUpRight } from "@/components/arrow-icon";
import { Link } from "@/i18n/navigation";
import { languageAlternates } from "@/i18n/path";
import { getServicesContent } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getServicesContent();
  return {
    title: "Services",
    description: data.intro,
    alternates: { canonical: "/services", languages: languageAlternates("/services") },
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
            {data.title || t("fallbackTitle")} <span className="italic">{data.emphasis || t("fallbackEmphasis")}</span>
          </h1>
          <div>
            <p className="text-muted">{data.intro || t("fallbackIntro")}</p>
            <Link href="/start" className="btn-primary mt-6 inline-flex">
              {t("start")} <ArrowUpRight />
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
                  <li key={b} className="flex gap-2">
                    <span aria-hidden>✓</span> {b}
                  </li>
                ))}
              </ul>
              <Link href={`/start?service=${item.slug}`} className="btn-outline mt-8 inline-flex text-sm">
                {t("learnMore")} <ArrowUpRight />
              </Link>
            </div>
            <div className="flex min-h-[240px] items-center justify-center rounded-3xl bg-elevated p-8 text-6xl text-faint">
              {item.illustration.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
