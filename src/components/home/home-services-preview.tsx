import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/arrow-icon";
import { ServiceIcon } from "@/components/service-icons";
import { cn } from "@/lib/cn";
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
  if (preview.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="label text-faint">{teaser.eyebrow}</p>
          <h2 className="mt-3 serif-display text-title text-fg">
            {teaser.title} <span className="italic text-brand">{teaser.emphasis}</span>
          </h2>
        </div>
        <div className="lg:text-right">
          {intro ? <p className="text-sm leading-relaxed text-muted">{intro}</p> : null}
          <Link href="/services" className="mt-4 inline-flex text-sm text-fg transition hover:text-brand">
            {t("exploreServices")} <ArrowRight className="ml-1" />
          </Link>
        </div>
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-2 lg:grid-rows-3">
        {preview.map((item, index) => {
          const isFeatured = index === 0;
          return (
            <Link
              key={item.slug}
              href={`/services#${item.slug}`}
              className={cn(
                "card-layered group flex flex-col p-6 sm:p-7",
                isFeatured && "lg:row-span-3 lg:justify-between lg:p-8",
              )}
            >
              <div>
                <ServiceIcon
                  slug={item.slug}
                  className="border-teal/20 bg-teal-soft text-teal"
                />
                <h3 className={cn("mt-4 font-medium text-fg", isFeatured && "text-xl")}>{item.title}</h3>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed text-muted",
                    isFeatured ? "line-clamp-4 sm:line-clamp-5" : "line-clamp-2",
                  )}
                >
                  {item.subtitle || item.body}
                </p>
              </div>
              <span className="mt-5 inline-flex text-sm text-fg group-hover:text-brand">
                {t("learnMore")} <ArrowRight className="ml-1 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}