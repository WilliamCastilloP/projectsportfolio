"use client";

import type { RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ProcessMedia } from "@/components/process/process-media";
import { PROCESS_MOTION } from "@/components/process/constants";
import { cn } from "@/lib/cn";
import type { ProcessStep } from "@/types/content";

export function ProcessPanel({
  step,
  index,
  active,
  desktop,
  reduced,
  last,
  target,
}: {
  step: ProcessStep;
  index: number;
  active: boolean;
  desktop: boolean;
  reduced: boolean;
  last?: boolean;
  target: RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({ target, offset: [...PROCESS_MOTION.panelOffset] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [PROCESS_MOTION.inactiveOpacity, 1, 1, PROCESS_MOTION.inactiveOpacity]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [PROCESS_MOTION.scaleRest, 1, 1, PROCESS_MOTION.scaleRest]);
  const animate = desktop && !reduced && !last;

  return (
    <article
      ref={target}
      data-index={index}
      className={cn(
        "scroll-mt-28",
        last && "pb-6",
        last && active && desktop && "lg:sticky lg:top-[var(--process-last-top,7rem)] lg:z-10",
      )}
    >
      <div className="mb-4 lg:mb-0">
        <p className="label text-white/45 lg:sr-only">{step.number}</p>
        <h3 className="mt-1 text-2xl text-white lg:sr-only">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/70 lg:sr-only">{step.body}</p>
        {step.cta ? (
          <a href={step.cta.href} className="mt-3 inline-block text-sm text-white underline-offset-4 hover:underline lg:hidden">
            {step.cta.label}
          </a>
        ) : null}
      </div>
      <motion.div
        className="process-panel-bg relative aspect-[4/3] max-h-[min(60vh,32rem)] w-full overflow-hidden rounded-2xl border border-white/10 will-change-transform"
        style={{
          ...(animate ? { opacity, scale, y: 0 } : undefined),
        }}
        initial={reduced || desktop ? false : { opacity: 0, y: 16 }}
        animate={animate ? undefined : { opacity: 1, scale: 1, y: 0 }}
        whileInView={reduced || desktop ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="absolute inset-0">
          <ProcessMedia
            step={step}
            active={active}
            reduced={reduced}
            fallbackSrc={`/process/step-${(index % 5) + 1}.svg`}
            priority={index === 0}
          />
        </div>
      </motion.div>
    </article>
  );
}
