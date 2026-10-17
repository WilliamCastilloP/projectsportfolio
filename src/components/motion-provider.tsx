"use client";

import { MotionConfig } from "motion/react";

/**
 * `reducedMotion="user"` tells motion to skip transform-based animation for
 * anyone with the OS setting on. The CSS in globals.css covers the rest
 * (and the no-JS case).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}>
      {children}
    </MotionConfig>
  );
}
