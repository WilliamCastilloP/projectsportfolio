"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "motion/react";
import { PROCESS_LAYOUT, PROCESS_MOTION } from "@/components/process/constants";
import { cn } from "@/lib/cn";
import { ProcessNavItem } from "@/components/process/process-nav-item";
import { ProcessPanel } from "@/components/process/process-panel";
import type { ProcessContent } from "@/lib/cms";

function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return desktop;
}

export function ProcessScrollytelling({ content }: { content: ProcessContent }) {
  const reduced = useReducedMotion() ?? false;
  const desktop = useDesktop();
  const steps = content.steps;
  const targets = useRef<Array<RefObject<HTMLElement | null>>>([]);
  if (targets.current.length !== steps.length) {
    targets.current = Array.from({ length: steps.length }, (_, index) => targets.current[index] ?? { current: null });
  }
  const [active, setActive] = useState(0);
  const [lastTop, setLastTop] = useState<string>(PROCESS_MOTION.stickyTop);
  const lastIndex = steps.length - 1;

  useEffect(() => {
    const nodes = targets.current.map((target) => target.current).filter((node): node is HTMLElement => !!node);
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        const index = Number((hit.target as HTMLElement).dataset.index);
        if (!Number.isNaN(index)) setActive(index);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0.15, 0.4, 0.6, 0.9] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [steps.length, desktop]);

  useEffect(() => {
    if (!desktop || active !== lastIndex) return;
    const sync = () => {
      const bar = document.querySelector<HTMLElement>("[data-process-progress]");
      const panel = targets.current[lastIndex]?.current;
      const card = panel?.querySelector<HTMLElement>(".rounded-2xl");
      if (!bar || !card) return;
      const top = Math.max(16, Math.round(bar.getBoundingClientRect().bottom - card.getBoundingClientRect().height));
      setLastTop(`${top}px`);
    };
    const id = requestAnimationFrame(sync);
    const delay = window.setTimeout(sync, 320);
    window.addEventListener("resize", sync);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(delay);
      window.removeEventListener("resize", sync);
    };
  }, [active, lastIndex, desktop]);

  return (
    <section
      id="process"
      className="scroll-mt-28 relative isolate mx-4 my-6 rounded-[2rem] bg-dark py-16 text-white sm:mx-6 lg:mx-8 lg:py-[var(--process-pad)]"
      style={{
        ["--process-sticky" as string]: PROCESS_MOTION.stickyTop,
        ["--process-pad" as string]: PROCESS_MOTION.sectionPad,
        ["--process-last-top" as string]: lastTop,
      }}
    >
      {/* Decoración recortada aparte: overflow-hidden aquí rompe sticky en hijos */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]" aria-hidden>
        <div
          className="absolute -right-1/4 -top-1/4 h-[min(70vw,32rem)] w-[min(70vw,32rem)] rounded-full opacity-[0.14]"
          style={{
            background: `radial-gradient(circle, color-mix(in oklab, var(--brand) 55%, transparent), transparent 70%)`,
          }}
        />
        <div className="grain-overlay">
          <svg className="h-full w-full">
            <filter id="process-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves={3} stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#process-grain)" />
          </svg>
        </div>
      </div>
      <div
        className={cn(
          "relative mx-auto grid max-w-6xl gap-10 px-6 lg:gap-12 lg:px-8",
          PROCESS_LAYOUT.columnSplit === "equal" ? "lg:grid-cols-2" : "lg:grid-cols-[5fr_7fr]",
        )}
      >
        <aside className="hidden self-start lg:sticky lg:top-[var(--process-sticky)] lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <p className="label text-white/50">{content.eyebrow}</p>
          <h2 className="mt-3 serif-display text-title text-balance">
            {content.title} {content.emphasis ? <span className="italic">{content.emphasis}</span> : null}
          </h2>
          {content.intro ? <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">{content.intro}</p> : null}
          <ol className="mt-8 space-y-1">
            {steps.map((step, index) => (
              <ProcessNavItem
                key={`${step.number}-${step.title}`}
                step={step}
                active={active === index}
                reduced={reduced}
                last={index === steps.length - 1}
                target={targets.current[index]}
              />
            ))}
          </ol>
        </aside>
        <div className="flex flex-col gap-6">
          <div className="mb-2 lg:hidden">
            <p className="label text-white/50">{content.eyebrow}</p>
            <h2 className="mt-3 serif-display text-3xl text-balance">
              {content.title} {content.emphasis ? <span className="italic">{content.emphasis}</span> : null}
            </h2>
            {content.intro ? <p className="mt-4 text-sm leading-relaxed text-white/70">{content.intro}</p> : null}
          </div>
          {steps.map((step, index) => (
            <ProcessPanel
              key={`${step.number}-${step.title}`}
              step={step}
              index={index}
              active={active === index}
              desktop={desktop}
              reduced={reduced}
              last={index === lastIndex}
              target={targets.current[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
