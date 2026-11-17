import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/arrow-icon";
import type { HomeContent } from "@/types/content";
import { HeroAvailabilityPulse } from "@/components/home/hero-availability-pulse";
import { HeroEmphasisUnderline } from "@/components/home/hero-emphasis-underline";
import { HeroScene } from "@/components/home/hero-scene";

export async function HomeHero({ content }: { content: HomeContent }) {
  const t = await getTranslations("home");
  const tHero = await getTranslations("home.hero");

  const availabilityText =
    content.availabilityLabel.trim() || tHero("availabilityDefault");

  return (
    <section className="relative isolate overflow-hidden max-md:max-h-[100svh]">
      <div className="aurora-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="grain-overlay" aria-hidden>
        <svg className="h-full w-full">
          <filter id="hero-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.82"
              numOctaves={3}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-grain)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-3xl px-5 pb-6 pt-8 text-center sm:px-8 sm:pb-10 sm:pt-10 md:max-w-4xl">
        {content.showAvailability ? (
          <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-lilac/30 bg-surface/90 px-4 py-1.5 text-sm text-muted backdrop-blur-sm">
            <HeroAvailabilityPulse />
            <span>{availabilityText}</span>
          </div>
        ) : null}

        <p className={`label text-faint ${content.showAvailability ? "mt-1" : ""}`}>{content.eyebrow}</p>

        <h1 className="mt-5 serif-display text-display text-fg text-balance">
          {content.headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="relative mt-1 inline-block italic">
            <span className="text-gradient-brand">{content.headlineEmphasis}</span>
            <HeroEmphasisUnderline />
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">{content.intro}</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row" data-nav-cta>
          <Link href="/start" className="btn-primary">
            {t("startProject")}
            <ArrowRight />
          </Link>
          <Link href="/work" className="btn-outline">
            {t("seeWork")}
          </Link>
        </div>

        <div className="relative mt-6 md:mt-10">
          <HeroScene />
        </div>

        <HeroScrollIndicator label={tHero("scrollIndicator")} />
      </div>
    </section>
  );
}

function HeroScrollIndicator({ label }: { label: string }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-2 pb-2 md:mt-8">
      <span
        className="h-8 w-px bg-gradient-to-b from-transparent via-lilac/50 to-lilac/30"
        aria-hidden
      />
      <span className="text-xs text-faint" aria-hidden>
        ↓
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}