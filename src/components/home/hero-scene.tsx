"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Transition,
} from "motion/react";
import { useTranslations } from "next-intl";

const LOOP_DURATION = 7;
const SPRING_ENTRY = { type: "spring", stiffness: 180, damping: 22, mass: 0.85 } as const;
const FLOAT_TRANSITION: Transition = {
  duration: LOOP_DURATION,
  repeat: Infinity,
  ease: "easeInOut",
};

function useFinePointerHover() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return fine;
}

function useMobileViewport() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return mobile;
}

function BrowserChrome({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`card-layered overflow-hidden shadow-none hover:transform-none hover:border-lilac/30 hover:shadow-none ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-lilac/25 bg-elevated px-3 py-2.5">
        <span className="size-2 rounded-full bg-apricot" />
        <span className="size-2 rounded-full bg-teal" />
        <span className="size-2 rounded-full bg-brand" />
        <div className="ml-2 h-4 min-w-0 flex-1 rounded-full bg-faint" />
      </div>
      {children}
    </div>
  );
}

function LandingWindow({ live }: { live: boolean }) {
  const reduced = useReducedMotion();
  const staticState = !live || reduced;

  const lineTransition: Transition = staticState
    ? { duration: 0 }
    : {
        duration: LOOP_DURATION,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.12, 0.28, 0.45, 1],
      };

  const breathe: Transition = staticState
    ? { duration: 0 }
    : {
        duration: LOOP_DURATION,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.35, 0.5, 0.65, 1],
      };

  return (
    <BrowserChrome className="w-full">
      <div className="space-y-3 bg-surface p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="h-2 w-16 rounded-full bg-faint" />
          <div className="flex gap-1.5">
            <div className="h-2 w-8 rounded-full bg-faint" />
            <div className="h-2 w-8 rounded-full bg-faint" />
          </div>
        </div>
        <div className="space-y-2">
          {[
            { width: "w-[85%]", delay: 0 },
            { width: "w-[70%]", delay: 0.06 },
            { width: "w-[55%]", delay: 0.12 },
          ].map(({ width, delay }, i) => (
            <motion.div
              key={i}
              className={`h-3 ${width} rounded-full bg-ink/10`}
              style={{ transformOrigin: "left center" }}
              initial={{ scaleX: staticState ? 1 : 0 }}
              animate={
                staticState
                  ? { scaleX: 1 }
                  : { scaleX: [0, 1, 1, 0, 0], opacity: [0.4, 1, 1, 0.35, 0.35] }
              }
              transition={{ ...lineTransition, delay: staticState ? 0 : delay }}
            />
          ))}
        </div>
        <motion.div
          className="h-7 w-28 rounded-full bg-brand"
          animate={staticState ? { scale: 1 } : { scale: [1, 1.05, 1, 1, 1] }}
          transition={breathe}
          style={{ transformOrigin: "center" }}
        />
        <motion.div
          className="mt-2 h-24 w-full rounded-xl opacity-[0.85]"
          style={{
            transformOrigin: "center bottom",
            backgroundImage:
              "linear-gradient(135deg, var(--teal) 0%, var(--brand) 45%, var(--apricot) 100%)",
          }}
          animate={staticState ? { scaleY: 1, opacity: 0.85 } : { scaleY: [0.92, 1, 1, 0.95, 0.92], opacity: [0.7, 0.9, 0.9, 0.75, 0.7] }}
          transition={
            staticState
              ? { duration: 0 }
              : { duration: LOOP_DURATION, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </div>
    </BrowserChrome>
  );
}

function InventoryWindow({ live }: { live: boolean }) {
  const reduced = useReducedMotion();
  const staticState = !live || reduced;
  const barHeights = [14, 22, 12, 28, 18];

  return (
    <BrowserChrome className="w-full">
      <div className="flex min-h-[140px] bg-surface">
        <div className="w-[28%] shrink-0 bg-dark" />
        <div className="flex flex-1 flex-col gap-2 p-3">
          {[1, 2, 3].map((row, i) => (
            <motion.div
              key={row}
              className="flex items-center gap-2"
              initial={{ opacity: staticState ? 1 : 0, y: staticState ? 0 : 6 }}
              animate={
                staticState
                  ? { opacity: 1, y: 0 }
                  : {
                      opacity: [0.35, 1, 1, 0.4, 0.35],
                      y: [6, 0, 0, 4, 6],
                    }
              }
              transition={
                staticState
                  ? { duration: 0 }
                  : {
                      duration: LOOP_DURATION,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.08,
                    }
              }
            >
              <div className="h-2 flex-1 rounded-full bg-faint" />
              <span
                className={`h-4 w-10 shrink-0 rounded-full ${
                  row % 2 === 0 ? "bg-teal-soft" : "bg-brand-soft"
                }`}
              />
            </motion.div>
          ))}
          <div className="mt-auto flex h-10 items-end gap-1 pt-2">
            {barHeights.map((h, i) => (
              <motion.div
                key={i}
                className="w-2 rounded-sm bg-teal/50"
                style={{ height: `${h}px`, transformOrigin: "bottom center" }}
                animate={staticState ? { scaleY: 1 } : { scaleY: [0.35, 1, 0.85, 1, 0.35] }}
                transition={
                  staticState
                    ? { duration: 0 }
                    : {
                        duration: LOOP_DURATION,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.05,
                      }
                }
              />
            ))}
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}

function ShopWindow({ live }: { live: boolean }) {
  const reduced = useReducedMotion();
  const staticState = !live || reduced;
  const cardBgs = ["bg-apricot-soft", "bg-teal-soft", "bg-brand-soft", "bg-faint"] as const;

  return (
    <BrowserChrome className="w-full">
      <div className="grid grid-cols-2 gap-2 bg-surface p-3">
        {cardBgs.map((bg, i) => (
          <motion.div
            key={i}
            className="space-y-1.5 rounded-lg p-2"
            initial={{ opacity: staticState ? 1 : 0, scale: staticState ? 1 : 0.92 }}
            animate={
              staticState
                ? { opacity: 1, scale: 1 }
                : {
                    opacity: [0.25, 1, 1, 0.35, 0.25],
                    scale: [0.92, 1, 1, 0.96, 0.92],
                  }
            }
            transition={
              staticState
                ? { duration: 0 }
                : {
                    duration: LOOP_DURATION,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.12,
                  }
            }
          >
            <div className={`h-12 w-full rounded-md ${bg}`} />
            <div className="h-1.5 w-3/4 rounded-full bg-ink/10" />
            <div className="h-1.5 w-1/2 rounded-full bg-muted/40" />
          </motion.div>
        ))}
      </div>
    </BrowserChrome>
  );
}

const PALETTE_SWATCHES = ["bg-ink", "bg-brand", "bg-teal", "bg-apricot", "bg-lilac"] as const;

type WindowLayerProps = {
  children: React.ReactNode;
  className: string;
  enterIndex: number;
  baseRotate: number;
  scrollY: ReturnType<typeof useTransform<number, number>>;
  pointerX: ReturnType<typeof useTransform<number, number>>;
  reduced: boolean;
};

function WindowLayer({
  children,
  className,
  enterIndex,
  baseRotate,
  scrollY,
  pointerX,
  reduced,
}: WindowLayerProps) {
  const enterExtra = enterIndex === 0 ? -2 : enterIndex === 2 ? 2 : 0;

  return (
    <motion.div className={className} style={{ y: scrollY }}>
      <motion.div
        initial={
          reduced
            ? { opacity: 1, y: 0, rotate: baseRotate }
            : { opacity: 0, y: 32, rotate: baseRotate + enterExtra - 3 }
        }
        animate={{ opacity: 1, y: 0, rotate: baseRotate }}
        transition={
          reduced
            ? { duration: 0 }
            : { ...SPRING_ENTRY, delay: 0.08 + enterIndex * 0.14 }
        }
        style={{ x: pointerX, transformPerspective: 900 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HeroScene() {
  const t = useTranslations("home.hero");
  const reduced = useReducedMotion() ?? false;
  const finePointer = useFinePointerHover();
  const mobile = useMobileViewport();

  const rootRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(rootRef, { margin: "80px 0px", amount: 0.15 });
  const live = inView && !reduced;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 140, damping: 24, mass: 0.6 };
  const tiltX = useSpring(useTransform(mouseY, [-1, 1], [3, -3]), springConfig);
  const tiltY = useSpring(useTransform(mouseX, [-1, 1], [-3, 3]), springConfig);

  useEffect(() => {
    const section = rootRef.current?.closest("section");
    if (section instanceof HTMLElement) {
      sectionRef.current = section;
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const parallaxOn = !reduced && !mobile;

  const scrollInventory = useTransform(scrollYProgress, (p) => (parallaxOn ? p * -18 : 0));
  const scrollLanding = useTransform(scrollYProgress, (p) => (parallaxOn ? p * -36 : 0));
  const scrollShop = useTransform(scrollYProgress, (p) => (parallaxOn ? p * -22 : 0));
  const scrollCards = useTransform(scrollYProgress, (p) => (parallaxOn ? p * -12 : 0));

  const ptrInvX = useTransform(mouseX, (v) => (parallaxOn && finePointer ? v * 8 : 0));
  const ptrLandX = useTransform(mouseX, (v) => (parallaxOn && finePointer ? v * 12 : 0));
  const ptrShopX = useTransform(mouseX, (v) => (parallaxOn && finePointer ? v * 10 : 0));
  const ptrInvY = useTransform(mouseY, (v) => (parallaxOn && finePointer ? v * 6 : 0));
  const ptrLandY = useTransform(mouseY, (v) => (parallaxOn && finePointer ? v * 10 : 0));
  const ptrShopY = useTransform(mouseY, (v) => (parallaxOn && finePointer ? v * 8 : 0));

  const invY = useTransform([scrollInventory, ptrInvY], ([s, p]) => Number(s) + Number(p));
  const landY = useTransform([scrollLanding, ptrLandY], ([s, p]) => Number(s) + Number(p));
  const shopY = useTransform([scrollShop, ptrShopY], ([s, p]) => Number(s) + Number(p));

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!finePointer || reduced || mobile || !rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseX.set(nx);
    mouseY.set(ny);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const enableFloat = !mobile && !reduced;

  return (
    <motion.div
      ref={rootRef}
      aria-hidden
      className="relative mx-auto w-full max-w-4xl select-none max-md:pointer-events-none md:pointer-events-auto"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        finePointer && !reduced && !mobile
          ? { rotateX: tiltX, rotateY: tiltY, transformPerspective: 1000 }
          : undefined
      }
    >
      <div className="relative mx-auto h-[200px] max-md:max-h-[min(220px,32svh)] sm:h-[260px] md:h-[320px] lg:h-[360px]">
        <WindowLayer
          enterIndex={0}
          baseRotate={-4}
          reduced={reduced}
          scrollY={invY}
          pointerX={ptrInvX}
          className="absolute left-0 top-[18%] z-10 w-[44%] max-md:left-[-18%] max-md:top-[22%] max-md:w-[42%] max-md:opacity-90 md:left-[2%] md:w-[38%] lg:left-[4%]"
        >
          <InventoryWindow live={live} />
        </WindowLayer>

        <WindowLayer
          enterIndex={2}
          baseRotate={4}
          reduced={reduced}
          scrollY={shopY}
          pointerX={ptrShopX}
          className="absolute right-0 top-[20%] z-10 w-[44%] max-md:right-[-18%] max-md:top-[24%] max-md:w-[42%] max-md:opacity-90 md:right-[2%] md:w-[38%]"
        >
          <ShopWindow live={live} />
        </WindowLayer>

        <WindowLayer
          enterIndex={1}
          baseRotate={0}
          reduced={reduced}
          scrollY={landY}
          pointerX={ptrLandX}
          className="absolute left-1/2 top-0 z-20 w-[min(92%,420px)] -translate-x-1/2 md:w-[min(78%,440px)]"
        >
          <LandingWindow live={live} />
        </WindowLayer>

        <motion.div
          className="absolute bottom-[4%] left-[-2%] z-30 max-md:bottom-[2%] max-md:left-0 md:left-[6%]"
          style={{ y: scrollCards }}
        >
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            animate={
              enableFloat
                ? { opacity: 1, y: [0, -4, 0, 4, 0] }
                : { opacity: 1, y: 0 }
            }
            transition={
              reduced
                ? { duration: 0 }
                : enableFloat
                  ? { ...FLOAT_TRANSITION, delay: 0.55 }
                  : { ...SPRING_ENTRY, delay: 0.55 }
            }
          >
            <div className="card-layered flex flex-col gap-2 px-4 py-3 shadow-none hover:transform-none hover:border-lilac/30">
              <span className="label text-faint">{t("palette")}</span>
              <div className="flex items-center gap-2">
                {PALETTE_SWATCHES.map((swatch) => (
                  <span key={swatch} className={`size-3.5 rounded-full ${swatch} ring-1 ring-lilac/25`} />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-[18%] right-[2%] z-30 hidden md:block md:right-[8%]"
          style={{ y: scrollCards }}
        >
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            animate={
              enableFloat
                ? { opacity: 1, y: [0, 4, 0, -4, 0] }
                : { opacity: 1, y: 0 }
            }
            transition={
              reduced
                ? { duration: 0 }
                : enableFloat
                  ? { ...FLOAT_TRANSITION, delay: 0.65 }
                  : { ...SPRING_ENTRY, delay: 0.65 }
            }
          >
            <div className="card-layered px-4 py-3 shadow-none hover:transform-none hover:border-lilac/30">
              <span className="serif-display text-2xl leading-none text-ink">Aa</span>
              <span className="label mt-1 block text-faint">{t("typography")}</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-[32%] right-[-4%] z-30 [rotate:6deg] max-md:bottom-[28%] max-md:right-[-2%] md:right-[4%]"
          initial={reduced ? undefined : { opacity: 0, scale: 0.94, rotate: 4 }}
          animate={{ opacity: 1, scale: 1, rotate: 6 }}
          transition={reduced ? { duration: 0 } : { ...SPRING_ENTRY, delay: 0.75 }}
        >
          <div className="rounded-sm bg-apricot px-4 py-3 shadow-md shadow-ink/10">
            <p className="serif-display max-w-[7rem] text-sm italic leading-snug text-ink">{t("stickyNote")}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}