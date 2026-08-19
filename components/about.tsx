import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { aboutContent, site } from "@/content/site";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-20 sm:py-28">
      <Reveal>
        <div className="border-b border-line pb-6">
          <SectionLabel index="02">{site.mode === "company" ? "Studio" : "About"}</SectionLabel>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-12 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-7">
          <h2 className="text-title font-medium text-balance">{aboutContent.heading}</h2>
          <div className="mt-6 space-y-5">
            {aboutContent.body.map((paragraph) => (
              <p key={paragraph} className="max-w-prose leading-relaxed text-muted text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal className="md:col-span-4 md:col-start-9" delay={0.1}>
          <dl className="divide-y divide-line border-y border-line">
            {aboutContent.facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="label text-faint">{fact.label}</dt>
                <dd className="label text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
