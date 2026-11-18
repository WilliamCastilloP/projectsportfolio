"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

const CYCLE = 6;

type CollaborationIllustrationProps = {
  label: string;
  className?: string;
};

export function CollaborationIllustration({ label, className }: CollaborationIllustrationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduced = useReducedMotion() ?? false;
  const live = inView && !reduced;

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-3xl bg-gradient-to-br from-teal-soft via-brand-soft to-apricot-soft",
        className,
      )}
    >
      <svg viewBox="0 0 400 340" role="img" aria-label={label} className="h-auto w-full">
        {/* Table */}
        <ellipse cx="200" cy="268" rx="128" ry="16" fill="var(--ink)" opacity="0.18" />
        <ellipse cx="200" cy="258" rx="118" ry="14" fill="var(--ink)" />
        <rect x="192" y="258" width="16" height="46" rx="4" fill="var(--ink)" />
        <rect x="108" y="268" width="8" height="36" rx="3" fill="var(--ink)" />
        <rect x="284" y="268" width="8" height="36" rx="3" fill="var(--ink)" />

        {/* Left person — Violet, ink hair */}
        <rect x="118" y="248" width="10" height="52" rx="5" fill="var(--ink)" />
        <rect x="138" y="248" width="10" height="52" rx="5" fill="var(--ink)" />
        <rect x="108" y="188" width="52" height="72" rx="24" fill="var(--brand)" />
        <circle cx="134" cy="168" r="22" fill="var(--surface)" />
        <path
          d="M114 166c0-16 9-28 20-28s20 12 20 28c0 4-2 8-5 10-2-10-8-16-15-16s-13 6-15 16c-3-2-5-6-5-10Z"
          fill="var(--ink)"
        />

        {/* Right person — Teal, apricot hair */}
        <rect x="252" y="248" width="10" height="52" rx="5" fill="var(--ink)" />
        <rect x="272" y="248" width="10" height="52" rx="5" fill="var(--ink)" />
        <rect x="240" y="188" width="52" height="72" rx="24" fill="var(--teal)" />
        <circle cx="266" cy="168" r="22" fill="var(--surface)" />
        <path
          d="M246 166c0-16 9-28 20-28s20 12 20 28c0 4-2 8-5 10-2-10-8-16-15-16s-13 6-15 16c-3-2-5-6-5-10Z"
          fill="var(--apricot)"
        />

        {/* Mug + notebook on the table */}
        <rect x="176" y="242" width="16" height="14" rx="4" fill="var(--apricot)" />
        <rect x="178" y="239" width="12" height="4" rx="2" fill="var(--apricot)" />
        <rect x="204" y="248" width="28" height="8" rx="2" fill="var(--dark-raised)" />

        {/* Speech bubbles — highlighted in turn */}
        <motion.g
          animate={live ? { opacity: [1, 0.38, 1] } : { opacity: 1 }}
          transition={live ? { duration: CYCLE, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
        >
          <path
            d="M72 64h96c10 0 18 8 18 18v32c0 10-8 18-18 18H98l-18 16v-16H72c-10 0-18-8-18-18V82c0-10 8-18 18-18Z"
            fill="var(--surface)"
          />
          <rect x="78" y="86" width="56" height="7" rx="3.5" fill="var(--ink)" opacity="0.28" />
          <rect x="78" y="100" width="40" height="7" rx="3.5" fill="var(--ink)" opacity="0.18" />
        </motion.g>
        <motion.g
          animate={live ? { opacity: [0.38, 1, 0.38] } : { opacity: 1 }}
          transition={live ? { duration: CYCLE, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
        >
          <path
            d="M232 48h96c10 0 18 8 18 18v32c0 10-8 18-18 18h-22v16l-18-16h-56c-10 0-18-8-18-18V66c0-10 8-18 18-18Z"
            fill="var(--apricot)"
          />
          <rect x="250" y="70" width="56" height="7" rx="3.5" fill="var(--ink)" opacity="0.35" />
          <rect x="250" y="84" width="40" height="7" rx="3.5" fill="var(--ink)" opacity="0.22" />
        </motion.g>
      </svg>
    </div>
  );
}
