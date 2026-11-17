"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/arrow-icon";
import type { HomeContent } from "@/types/content";

export function HomeHero({ content }: { content: HomeContent }) {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-10">
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="label text-faint">{content.eyebrow}</p>
        <h1 className="mt-5 serif-display text-display text-fg text-balance">
          {content.headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="italic">{content.headlineEmphasis}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">{content.intro}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row" data-nav-cta>
          <Link href="/start" className="btn-primary">
            {t("startProject")}
            <ArrowUpRight />
          </Link>
          <Link href="/work" className="btn-outline">
            {t("seeWork")}
          </Link>
        </div>
      </div>
      <p className="label mt-14 text-center text-faint">{t("scroll")}</p>
    </section>
  );
}
