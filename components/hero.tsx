"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { Glow } from "@/components/glow";
import { site } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.15, staggerChildren: 0.08 },
  },
};

/** Wipes upward: the bottom inset goes from fully clipped to slightly past 0. */
const wipe: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)", y: "0.16em" },
  visible: {
    clipPath: "inset(0% 0% -12% 0%)",
    y: 0,
    transition: { duration: 1, ease: EASE },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[92svh] flex-col justify-center pt-32 pb-20">
      <Glow />

      <motion.div variants={container} initial="hidden" animate="visible">
        <motion.p
          data-motion
          variants={fade}
          className="label flex items-center gap-2.5 text-muted"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          {site.role}
          <span aria-hidden className="text-line">
            /
          </span>
          {site.location}
        </motion.p>

        <h1 className="mt-8 text-display font-medium text-balance">
          {site.hero.headline.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span data-motion variants={wipe} className="block">
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          data-motion
          variants={fade}
          className="mt-8 max-w-xl text-base leading-relaxed text-muted text-pretty sm:text-lg"
        >
          {site.hero.intro}
        </motion.p>

        <motion.div
          data-motion
          variants={fade}
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <Link
            href="/#work"
            className="group label inline-flex items-center gap-2 border-b border-fg/25 pb-1.5 text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Selected work
            <span
              aria-hidden
              className="transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5"
            >
              ↓
            </span>
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="label text-faint transition-colors hover:text-fg"
          >
            {site.email}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
