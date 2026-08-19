"use client";

import { motion, useReducedMotion } from "motion/react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait once the element enters the viewport. */
  delay?: number;
  /** Vertical travel in px. */
  distance?: number;
  /** Fraction of the element that must be visible before it fires. */
  amount?: number;
  /** Replay every time it re-enters the viewport. */
  repeat?: boolean;
};

/**
 * The one scroll-reveal primitive used across the site. Rendered in its
 * "before" state on the server so there is no flash of unstyled motion, and
 * neutralised by `[data-motion]` under prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 18,
  amount = 0.25,
  repeat = false,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      data-motion
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: !repeat, amount, margin: "0px 0px -8% 0px" }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
