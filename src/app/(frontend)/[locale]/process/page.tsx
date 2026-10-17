import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { ProcessSteps } from "@/components/process/process-steps";
import { languageAlternates } from "@/i18n/path";
import { getProcessContent } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getProcessContent();
  return {
    title: "Process",
    description: data.intro,
    alternates: { canonical: "/process", languages: languageAlternates("/process") },
  };
}

export default async function ProcessPage() {
  const data = await getProcessContent();

  return (
    <>
      <section className="mx-auto max-w-4xl px-5 pb-8 pt-8 text-center sm:px-8 sm:pt-10">
        <p className="label text-faint">{data.eyebrow}</p>
        <h1 className="mt-4 serif-display text-title text-fg">
          {data.title} <span className="italic">{data.emphasis}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-muted">{data.intro}</p>
      </section>
      <ProcessSteps steps={data.steps} />
      <CtaBand />
    </>
  );
}
