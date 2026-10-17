"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/arrow-icon";
import type { HomeContent } from "@/types/content";

export function HomeHero({ content }: { content: HomeContent }) {
  const t = useTranslations("home");
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-10">
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        <motion.div
          className="absolute left-[8%] top-[22%] flex size-24 items-center justify-center rounded-full border border-line bg-surface text-2xl text-faint shadow-sm"
          animate={reduced ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {"</>"}
        </motion.div>
        <motion.p
          className="absolute left-[7%] top-[44%] font-serif text-[0.8rem] italic leading-5 text-faint"
          animate={reduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          {content.floatingNotes.map((note) => (
            <span key={note} className="block">
              {note}
            </span>
          ))}
        </motion.p>
        <motion.div
          className="absolute bottom-[28%] left-[11%] flex size-16 items-center justify-center rounded-2xl border border-line bg-surface text-faint shadow-sm"
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M4 19V9l4 3 4-8 4 8 4-3v10" />
          </svg>
        </motion.div>
        <motion.div
          className="absolute right-[10%] top-[18%] flex size-24 items-center justify-center rounded-full border border-line bg-surface text-2xl text-faint shadow-sm"
          animate={reduced ? undefined : { y: [0, 10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          ↗
        </motion.div>
      </div>

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
