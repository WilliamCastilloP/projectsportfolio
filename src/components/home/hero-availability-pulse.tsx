"use client";

import { motion, useReducedMotion } from "motion/react";

export function HeroAvailabilityPulse() {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className="size-2 shrink-0 rounded-full bg-teal" aria-hidden />;
  }

  return (
    <motion.span
      className="size-2 shrink-0 rounded-full bg-teal"
      aria-hidden
      animate={{ scale: [1, 1.35, 1], opacity: [1, 0.65, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}