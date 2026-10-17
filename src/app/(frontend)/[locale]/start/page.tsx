import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { StartProjectForm } from "@/components/start-project-form";
import { languageAlternates } from "@/i18n/path";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("start");
  return {
    title: t("metaTitle"),
    alternates: { canonical: "/start", languages: languageAlternates("/start") },
  };
}

export default async function StartPage() {
  const t = await getTranslations("start");

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
        <StartProjectForm />
      </Suspense>
    </section>
  );
}
