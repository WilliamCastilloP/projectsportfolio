"use client";

import { motion, useReducedMotion } from "motion/react";

export function HeroEmphasisUnderline() {
  const reduced = useReducedMotion();

  return (
    <motion.svg
      className="pointer-events-none absolute left-0 bottom-0 h-[0.32em] w-full origin-left translate-y-[0.08em] text-apricot"
      viewBox="0 0 120 12"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
      initial={{ scaleX: reduced ? 1 : 0 }}
      animate={{ scaleX: 1 }}
      transition={
        reduced
          ? { duration: 0 }
          : { delay: 0.45, duration: 0.85, ease: [0.16, 1, 0.3, 1] }
      }
    >
      <path
        d="M2 8C18 4 36 10 58 6C78 2 98 9 118 5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}