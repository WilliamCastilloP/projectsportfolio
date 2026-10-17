import type { Metadata } from "next";
import { RichText } from "@/components/rich-text";
import { languageAlternates } from "@/i18n/path";
import { getLegalPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage("cookies");
  return {
    title: page?.title || "Cookies",
    alternates: { canonical: "/cookies", languages: languageAlternates("/cookies") },
  };
}

export default async function CookiesPage() {
  const page = await getLegalPage("cookies");
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="serif-display text-title">{page?.title || "Cookies"}</h1>
      <div className="rich-text mt-8">
        {page?.body ? <RichText data={page.body} /> : <p className="text-muted">Content coming soon.</p>}
      </div>
    </article>
  );
}
