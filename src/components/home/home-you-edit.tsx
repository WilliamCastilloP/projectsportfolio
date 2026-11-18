import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/arrow-icon";
import { EditPanelMockup } from "@/components/home/edit-panel-mockup";

export async function HomeYouEdit() {
  const t = await getTranslations("home.youEdit");

  return (
    <section className="bg-surface">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="label text-faint">{t("eyebrow")}</p>
          <h2 className="mt-3 serif-display text-title text-fg text-balance">
            {t("title")} <span className="italic text-brand">{t("emphasis")}</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">{t("body")}</p>
          <Link
            href="/services#development"
            className="mt-6 inline-flex text-sm font-medium text-brand transition hover:text-brand-hover"
          >
            {t("cta")} <ArrowRight className="ml-1" />
          </Link>
        </div>
        <EditPanelMockup
          copy={{
            navHome: t("navHome"),
            navProjects: t("navProjects"),
            navServices: t("navServices"),
            navMedia: t("navMedia"),
            fieldTitle: t("fieldTitle"),
            fieldTitleValue: t("fieldTitleValue"),
            fieldImage: t("fieldImage"),
            fieldChange: t("fieldChange"),
            published: t("published"),
            save: t("save"),
            saved: t("saved"),
          }}
        />
      </div>
    </section>
  );
}
