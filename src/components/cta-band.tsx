import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/arrow-icon";

export async function CtaBand() {
  const t = await getTranslations("cta");

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-lilac/30 bg-surface px-6 py-14 text-center sm:px-12 sm:py-16">
        <div className="cta-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-2xl">
          <p className="label text-faint">{t("eyebrow")}</p>
          <h2 className="mt-4 serif-display text-3xl text-balance text-fg sm:text-4xl">{t("title")}</h2>
          <p className="mt-3 text-muted">{t("body")}</p>
          <Link href="/start" className="btn-primary mt-8">
            {t("talk")}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
