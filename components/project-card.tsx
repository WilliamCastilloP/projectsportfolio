"use client";

import { useCallback, useRef, ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { cn, pad } from "@/lib/utils";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
};

/**
 * Spotlight follows the cursor through two CSS custom properties written
 * straight to the node — no state, no re-render per pointer move.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (shouldReduceMotion) return;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    },
    [shouldReduceMotion],
  );

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={cn(
        "group relative isolate flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface",
        "transition-colors duration-500 hover:border-fg/20",
      )}
      style={{ "--spot-x": "50%", "--spot-y": "0%" } as React.CSSProperties}
    >
      <div
        aria-hidden
        data-motion-spotlight
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--spot-x) var(--spot-y), color-mix(in oklab, var(--color-accent) 14%, transparent), transparent 70%)",
        }}
      />

      <Link
        href={`/work/${project.slug}`}
        className="flex h-full flex-col focus-visible:outline-offset-[-3px]"
      >
        <span className="sr-only">{`View case study: ${project.title}`}</span>

        <ViewTransition name={`project-cover-${project.slug}`} share="morph" default="none">
          <div
            className={cn(
              "relative overflow-hidden border-b border-line bg-elevated",
              project.featured ? "aspect-[16/9]" : "aspect-[16/10]",
            )}
          >
            <Image
              src={project.cover}
              alt=""
              fill
              sizes={project.featured ? "(min-width: 640px) 896px, 100vw" : "(min-width: 640px) 440px, 100vw"}
              className="object-cover object-top opacity-90 transition-[transform,opacity] duration-700 ease-out-expo group-hover:scale-[1.02] group-hover:opacity-100"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent"
            />
          </div>
        </ViewTransition>

        <div className="relative z-20 flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-xl font-medium tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
              <span aria-hidden className="label mr-3 align-middle text-faint">
                {pad(index)}
              </span>
              {project.title}
            </h3>
            <span className="label shrink-0 text-faint">{project.year}</span>
          </div>

          <p className="max-w-prose text-sm leading-relaxed text-muted text-pretty">
            {project.description}
          </p>

          <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-2 pt-1">
            {project.stack.map((item) => (
              <li
                key={item}
                className="label rounded-full border border-line px-2.5 py-1.5 text-faint"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  );
}
