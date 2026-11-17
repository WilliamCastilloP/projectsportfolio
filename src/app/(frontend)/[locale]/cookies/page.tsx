import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import { RichText } from "@/components/rich-text";
import { languageAlternates } from "@/i18n/path";
import { getLegalPage } from "@/lib/cms";
import { pageOpenGraph } from "@/lib/metadata";

export async function generateMetadata(
  _props: PageProps<"/[locale]/cookies">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [page, t] = await Promise.all([getLegalPage("cookies"), getTranslations("legal")]);
  const title = page?.title || t("cookies");
  return {
    title,
    alternates: { canonical: "/cookies", languages: languageAlternates("/cookies") },
    openGraph: await pageOpenGraph({ path: "/cookies", title, parent }),
  };
}

export default async function CookiesPage() {
  const [page, t] = await Promise.all([getLegalPage("cookies"), getTranslations("legal")]);
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="serif-display text-title">{page?.title || t("cookies")}</h1>
      <div className="rich-text mt-8">
        {page?.body ? <RichText data={page.body} /> : <p className="text-muted">{t("empty")}</p>}
      </div>
    </article>
  );
}
