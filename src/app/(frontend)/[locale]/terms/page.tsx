import type { Metadata } from "next";
import { RichText } from "@/components/rich-text";
import { languageAlternates } from "@/i18n/path";
import { getLegalPage } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage("terms");
  return {
    title: page?.title || "Terms",
    alternates: { canonical: "/terms", languages: languageAlternates("/terms") },
  };
}

export default async function TermsPage() {
  const page = await getLegalPage("terms");
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="serif-display text-title">{page?.title || "Terms"}</h1>
      <div className="rich-text mt-8">
        {page?.body ? <RichText data={page.body} /> : <p className="text-muted">Content coming soon.</p>}
      </div>
    </article>
  );
}
