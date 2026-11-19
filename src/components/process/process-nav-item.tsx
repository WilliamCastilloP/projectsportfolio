"use client";

import { useEffect, useState, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { PROCESS_MOTION } from "@/components/process/constants";
import { cn } from "@/lib/cn";
import type { ProcessStep } from "@/types/content";

export function ProcessNavItem({
  step,
  active,
  reduced,
  last,
  target,
}: {
  step: ProcessStep;
  active: boolean;
  reduced: boolean;
  last?: boolean;
  target: RefObject<HTMLElement | null>;
}) {
  const [lastEnd, setLastEnd] = useState(0.84);

  useEffect(() => {
    if (!last || !active) return;
    const sync = () => {
      const bar = document.querySelector<HTMLElement>("[data-process-progress]");
      if (!bar) return;
      setLastEnd(bar.getBoundingClientRect().bottom / window.innerHeight);
    };
    const id = requestAnimationFrame(sync);
    window.addEventListener("resize", sync);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", sync);
    };
  }, [last, active]);

  const offset = last
    ? ([PROCESS_MOTION.progressOffsetLastStart, `end ${lastEnd}`] as const)
    : PROCESS_MOTION.progressOffset;
  const { scrollYProgress } = useScroll({ target, offset: [...offset] });
  const clipPath = useTransform(scrollYProgress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);

  return (
    <li>
      <button
        type="button"
        aria-current={active ? "step" : undefined}
        onClick={() => target.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" })}
        className={cn(
          "w-full rounded-xl py-3 pl-3 text-left outline-none transition-colors",
          active && "border-l-2 border-brand bg-white/[0.04]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand",
        )}
      >
        <span className={cn("label", active ? "text-teal" : "text-white/50")}>{step.number}</span>
        <span className={cn("mt-1 block text-lg", active ? "text-white" : "text-white/55")}>{step.title}</span>
        <div
          className={cn(
            "grid",
            reduced ? "transition-none" : "transition-[grid-template-rows,opacity] duration-300 ease-out",
            active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70",
          )}
        >
          <div className="overflow-hidden">
            <p className="pt-2 text-sm leading-relaxed text-white/70">{step.body}</p>
            {step.cta ? (
              <a href={step.cta.href} className="mt-3 inline-block text-sm text-white underline-offset-4 hover:underline">
                {step.cta.label}
              </a>
            ) : null}
          </div>
        </div>
        {active && !reduced ? (
          <span
            data-process-progress
            className="relative mt-3 block h-0.5 overflow-hidden bg-white/10"
            aria-hidden
          >
            <motion.span className="absolute inset-0" style={{ clipPath, backgroundImage: PROCESS_MOTION.progress }} />
          </span>
        ) : null}
      </button>
    </li>
  );
}
