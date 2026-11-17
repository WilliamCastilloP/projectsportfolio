import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import { RichText } from "@/components/rich-text";
import { languageAlternates } from "@/i18n/path";
import { getLegalPage } from "@/lib/cms";
import { pageOpenGraph } from "@/lib/metadata";

export async function generateMetadata(
  _props: PageProps<"/[locale]/privacy">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [page, t] = await Promise.all([getLegalPage("privacy"), getTranslations("legal")]);
  const title = page?.title || t("privacy");
  return {
    title,
    alternates: { canonical: "/privacy", languages: languageAlternates("/privacy") },
    openGraph: await pageOpenGraph({ path: "/privacy", title, parent }),
  };
}

export default async function PrivacyPage() {
  const [page, t] = await Promise.all([getLegalPage("privacy"), getTranslations("legal")]);
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="serif-display text-title">{page?.title || t("privacy")}</h1>
      <div className="rich-text mt-8">
        {page?.body ? <RichText data={page.body} /> : <p className="text-muted">{t("empty")}</p>}
      </div>
    </article>
  );
}
