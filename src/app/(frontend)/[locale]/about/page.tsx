import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/cta-band";
import { ArrowUpRight } from "@/components/arrow-icon";
import { Link } from "@/i18n/navigation";
import { languageAlternates } from "@/i18n/path";
import { getAboutContent } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutContent();
  return {
    title: "About",
    description: about.hero.body,
    alternates: { canonical: "/about", languages: languageAlternates("/about") },
  };
}

export default async function AboutPage() {
  const [about, t] = await Promise.all([getAboutContent(), getTranslations("about")]);

  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 pt-8 sm:px-8 sm:pt-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="label text-faint">{about.eyebrow}</p>
          <h1 className="mt-4 serif-display text-title">
            {about.hero.headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="italic">{about.hero.emphasis}</span>
          </h1>
          <p className="mt-6 text-muted">{about.hero.body || t("fallbackIntro")}</p>
          <Link href="/start" className="btn-primary mt-8 inline-flex">
            {t("start")} <ArrowUpRight />
          </Link>
        </div>
        {about.hero.image ? (
          <div className="overflow-hidden rounded-3xl">
            <Image src={about.hero.image} alt="" width={800} height={600} unoptimized className="h-auto w-full object-cover" />
          </div>
        ) : (
          <div className="min-h-[320px] rounded-3xl bg-elevated" />
        )}
      </section>

      {about.founder.name ? (
        <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2">
          {about.founder.photo ? (
            <div className="overflow-hidden rounded-t-[999px] rounded-b-3xl">
              <Image src={about.founder.photo} alt={about.founder.name} width={600} height={700} unoptimized className="h-auto w-full object-cover" />
            </div>
          ) : null}
          <div>
            <p className="label text-faint">{about.founder.role}</p>
            <h2 className="mt-3 serif-display text-3xl">{t("founderTitle")}</h2>
            {about.founder.note ? <p className="mt-2 text-sm italic text-muted">{about.founder.note}</p> : null}
            <p className="mt-6 whitespace-pre-line text-muted">{about.founder.bio}</p>
            <p className="mt-6 font-medium">{about.founder.name}</p>
          </div>
        </section>
      ) : null}

      {about.mission.title ? (
        <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <p className="label text-faint">{about.mission.eyebrow}</p>
          <h2 className="mt-4 serif-display text-title">{about.mission.title}</h2>
          <p className="mt-4 text-muted">{about.mission.body}</p>
        </section>
      ) : null}

      {about.values.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="label text-center text-faint">{t("values")}</p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-line bg-elevated text-lg">
                  {v.icon || "◦"}
                </div>
                <h3 className="mt-4 font-medium">{v.title}</h3>
                <p className="mt-2 text-sm text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {about.numbers.length > 0 ? (
        <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2">
          {about.numbersImage ? (
            <Image src={about.numbersImage} alt="" width={800} height={500} unoptimized className="rounded-3xl object-cover" />
          ) : (
            <div className="min-h-[240px] rounded-3xl bg-elevated" />
          )}
          <div>
            <p className="label text-faint">{t("numbersEyebrow")}</p>
            <h2 className="mt-3 serif-display text-3xl">{t("numbersTitle")}</h2>
            <dl className="mt-8 grid grid-cols-2 gap-6">
              {about.numbers.map((n) => (
                <div key={n.label}>
                  <dt className="serif-display text-3xl">{n.value}</dt>
                  <dd className="mt-1 text-sm text-muted">{n.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      <CtaBand />
    </>
  );
}
