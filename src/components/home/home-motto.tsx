import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/arrow-icon";
import { CollaborationIllustration } from "@/components/collaboration-illustration";

function splitMotto(text: string) {
  const i = text.lastIndexOf(",");
  if (i === -1) return { lead: text, emphasis: "" };
  return {
    lead: text.slice(0, i + 1).trim(),
    emphasis: text.slice(i + 1).trim(),
  };
}

function monogram(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";
  if (first.length >= 2 && first.length <= 3 && first === first.toUpperCase()) {
    return first;
  }
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return first.slice(0, 2).toUpperCase();
}

export async function HomeMotto({
  motto,
  studioName,
}: {
  motto: string;
  studioName: string;
}) {
  const t = await getTranslations("home.motto");
  const fromCms = motto.trim();
  const { lead, emphasis } = fromCms
    ? splitMotto(fromCms)
    : { lead: t("lead"), emphasis: t("emphasis") };

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <CollaborationIllustration label={t("illustrationAlt")} />
        <div>
          <p className="label text-faint">{t("eyebrow")}</p>
          <h2 className="mt-3 serif-display text-title text-fg text-balance">
            {lead}
            {emphasis ? (
              <>
                {" "}
                <span className="italic text-brand">{emphasis}</span>
              </>
            ) : null}
          </h2>
          <div className="mt-6 flex items-center gap-3">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-medium tracking-wide text-bg"
              aria-hidden
            >
              {monogram(studioName)}
            </span>
            <p className="text-sm text-muted">{t("team", { name: studioName })}</p>
          </div>
          <Link
            href="/about"
            className="mt-8 inline-flex text-sm font-medium text-brand transition hover:text-brand-hover"
          >
            {t("cta")} <ArrowRight className="ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
