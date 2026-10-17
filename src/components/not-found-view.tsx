import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/section-label";
import { Link } from "@/i18n/navigation";

export async function NotFoundView() {
  const t = await getTranslations("notFound");

  return (
    <section className="flex min-h-[70svh] flex-col justify-center py-24">
      <SectionLabel index="404">{t("label")}</SectionLabel>
      <h1 className="mt-6 text-title font-medium text-balance">{t("title")}</h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted">{t("body")}</p>
      <Link
        href="/"
        className="label mt-10 inline-flex w-fit items-center gap-2 border-b border-fg/25 pb-1.5 transition-colors hover:border-accent hover:text-accent"
      >
        {t("back")}
      </Link>
    </section>
  );
}
