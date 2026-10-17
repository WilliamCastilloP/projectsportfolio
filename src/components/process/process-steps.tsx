"use client";

import { useReducedMotion } from "motion/react";
import type { ProcessStep } from "@/types/content";

export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  const reduced = useReducedMotion();

  if (steps.length === 0) {
    return (
      <p className="mx-auto max-w-6xl px-5 py-12 text-center text-muted">
        Process steps will appear here once configured in the CMS.
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="grid gap-10 md:grid-cols-5 md:gap-4">
        {steps.map((step, index) => (
          <div key={step.number} className="text-center" data-motion={reduced ? undefined : "true"}>
            <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-elevated text-2xl">
              {step.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={step.icon} alt="" className="size-14 object-contain" />
              ) : (
                step.number
              )}
            </div>
            {index < steps.length - 1 ? (
              <span aria-hidden className="mt-4 hidden text-faint md:block">
                →
              </span>
            ) : null}
            <p className="label mt-4 text-faint">{step.number}</p>
            <h3 className="mt-2 font-medium">{step.title}</h3>
            <p className="mt-2 text-sm text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
