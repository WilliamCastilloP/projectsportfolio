import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/arrow-icon";
import { ServiceIcon } from "@/components/service-icons";
import type { HomeContent } from "@/lib/cms";
import type { ServiceItem } from "@/lib/cms";

export async function HomeServicesPreview({
  teaser,
  intro,
  items,
}: {
  teaser: HomeContent["servicesTeaser"];
  intro?: string;
  items: ServiceItem[];
}) {
  const t = await getTranslations("home");
  const preview = items.slice(0, 4);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="label text-faint">{teaser.eyebrow}</p>
          <h2 className="mt-3 serif-display text-title text-fg">
            {teaser.title} <span className="italic">{teaser.emphasis}</span>
          </h2>
        </div>
        <div className="lg:text-right">
          {intro ? <p className="text-sm leading-relaxed text-muted">{intro}</p> : null}
          <Link href="/services" className="mt-4 inline-flex text-sm text-fg transition hover:text-muted">
            {t("exploreServices")} <ArrowRight className="ml-1" />
          </Link>
        </div>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {preview.map((item) => (
          <Link
            key={item.slug}
            href={`/services#${item.slug}`}
            className="group rounded-2xl border border-line bg-elevated p-6 transition hover:border-fg/20 hover:bg-surface"
          >
            <ServiceIcon slug={item.slug} />
            <h3 className="mt-4 font-medium text-fg">{item.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted">{item.subtitle || item.body}</p>
            <span className="mt-4 inline-flex text-sm text-fg">
              {t("learnMore")} <ArrowRight className="ml-1 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
