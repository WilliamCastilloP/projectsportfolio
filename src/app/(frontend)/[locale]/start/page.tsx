import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { StartProjectForm } from "@/components/start-project-form";
import { canonicalLocalizedUrl, languageAlternates } from "@/i18n/path";
import type { Locale } from "@/i18n/routing";
import { pageOpenGraph } from "@/lib/metadata";
import { getSettings } from "@/lib/site";

export async function generateMetadata(
  _props: PageProps<"/[locale]/start">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const t = await getTranslations("start");
  const title = t("metaTitle");
  return {
    title,
    alternates: { canonical: "/start", languages: languageAlternates("/start") },
    openGraph: await pageOpenGraph({ path: "/start", title, description: t("intro"), parent }),
  };
}

export default async function StartPage({ params }: PageProps<"/[locale]/start">) {
  const { locale } = await params;
  const loc = locale as Locale;
  const [t, share, settings] = await Promise.all([
    getTranslations("start"),
    getTranslations("share"),
    getSettings(loc),
  ]);
  const shareUrl = canonicalLocalizedUrl(settings.url, "/", loc);

  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-10 lg:grid-cols-2">
      <div>
        <p className="label text-faint">{t("eyebrow")}</p>
        <h1 className="mt-4 serif-display text-title">{t("title")}</h1>
        <p className="mt-4 text-muted">{t("intro")}</p>
        <ul className="mt-10 space-y-6 text-sm text-muted">
          {[1, 2, 3].map((n) => (
            <li key={n}>
              <p className="font-medium text-fg">{t(`benefit${n}Title`)}</p>
              <p className="mt-1">{t(`benefit${n}Body`)}</p>
            </li>
          ))}
        </ul>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-elevated" />}>
        <StartProjectForm
          shareUrl={shareUrl}
          shareTitle={settings.name}
          shareText={share("invite")}
        />
      </Suspense>
    </section>
  );
}
