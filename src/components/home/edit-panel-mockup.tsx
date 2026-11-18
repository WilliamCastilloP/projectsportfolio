"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const TOAST_LOOP = 4.8;

export type EditPanelCopy = {
  navHome: string;
  navProjects: string;
  navServices: string;
  navMedia: string;
  fieldTitle: string;
  fieldTitleValue: string;
  fieldImage: string;
  fieldChange: string;
  published: string;
  save: string;
  saved: string;
};

export function EditPanelMockup({ copy }: { copy: EditPanelCopy }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion() ?? false;
  const live = inView && !reduced;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative overflow-hidden rounded-3xl border border-lilac/30 bg-surface shadow-[0_18px_48px_color-mix(in_oklab,var(--ink)_10%,transparent)]"
    >
      <div className="flex items-center gap-1.5 border-b border-lilac/20 bg-elevated px-4 py-3">
        <span className="size-2.5 rounded-full bg-lilac/45" />
        <span className="size-2.5 rounded-full bg-lilac/45" />
        <span className="size-2.5 rounded-full bg-lilac/45" />
      </div>
      <div className="grid min-h-[280px] grid-cols-[6.75rem_1fr] sm:grid-cols-[9rem_1fr]">
        <aside className="flex flex-col gap-1 bg-dark px-2.5 py-4 text-sm text-bg/65 sm:px-3">
          <span className="rounded-lg bg-brand px-3 py-2 font-medium text-white">{copy.navHome}</span>
          <span className="px-3 py-2">{copy.navProjects}</span>
          <span className="px-3 py-2">{copy.navServices}</span>
          <span className="px-3 py-2">{copy.navMedia}</span>
        </aside>
        <div className="relative p-4 sm:p-6">
          <p className="text-sm font-medium text-ink">{copy.fieldTitle}</p>
          <div className="mt-2 flex items-center rounded-xl border-2 border-brand/45 px-3 py-2.5 text-sm text-ink">
            <span>{copy.fieldTitleValue}</span>
            <motion.span
              className="ml-0.5 inline-block h-[1.05em] w-px bg-brand"
              animate={live ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
              transition={
                live
                  ? { duration: 1.05, repeat: Infinity, times: [0, 0.49, 0.5, 1], ease: "linear" }
                  : { duration: 0 }
              }
            />
          </div>

          <p className="mt-5 text-sm font-medium text-ink">{copy.fieldImage}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="size-14 rounded-lg bg-gradient-to-br from-teal via-brand to-apricot" />
            <span className="text-sm font-medium text-brand">{copy.fieldChange}</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-teal-soft px-3 py-1 text-sm font-medium text-ink">
              {copy.published}
            </span>
            <span className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white">
              {copy.save}
            </span>
          </div>

          <motion.div
            className="absolute right-3 bottom-4 flex items-center gap-2 rounded-xl border border-lilac/25 bg-surface px-3 py-2 text-sm font-medium text-ink shadow-[0_10px_28px_color-mix(in_oklab,var(--ink)_12%,transparent)] sm:right-5"
            animate={live ? { opacity: [0, 1, 1, 0], y: [10, 0, 0, 8] } : { opacity: 1, y: 0 }}
            transition={
              live
                ? { duration: TOAST_LOOP, repeat: Infinity, times: [0, 0.12, 0.72, 1], ease: "easeOut" }
                : { duration: 0 }
            }
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-teal text-white">
              <svg viewBox="0 0 12 12" className="size-3" fill="none">
                <path
                  d="M2.5 6.2 4.8 8.5 9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {copy.saved}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
