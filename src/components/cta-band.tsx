import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/arrow-icon";

export async function CtaBand() {
  const t = await getTranslations("cta");

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] bg-elevated px-8 py-10 sm:flex-row sm:items-center sm:px-12">
        <div>
          <p className="label text-faint">{t("eyebrow")}</p>
          <h2 className="mt-3 serif-display text-3xl text-fg">{t("title")}</h2>
          <p className="mt-2 text-muted">{t("body")}</p>
        </div>
        <Link href="/start" className="btn-primary shrink-0">
          {t("button")}
          <ArrowUpRight />
        </Link>
      </div>
    </section>
  );
}
