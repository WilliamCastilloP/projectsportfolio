"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/arrow-icon";
import { cn } from "@/lib/cn";

const navItems = [
  { key: "work", href: "/work" },
  { key: "services", href: "/services" },
  { key: "process", href: "/process" },
  { key: "about", href: "/about" },
] as const;

type CtaPhase = "off" | "pill";

export function SiteNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [phase, setPhase] = useState<CtaPhase>("off");
  const [fullWidth, setFullWidth] = useState(180);
  const [wide, setWide] = useState(false);
  const [radius, setRadius] = useState(27);
  const phaseRef = useRef<CtaPhase>("off");
  const measureRef = useRef<HTMLSpanElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [overFooter, setOverFooter] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const measure = () => setRadius(el.getBoundingClientRect().height / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const shell = document.querySelector(".site-shell");
    const header = headerRef.current;
    if (!shell || !header) return;

    let frame = 0;
    const update = () => {
      const shellBottom = shell.getBoundingClientRect().bottom;
      const headerBottom = header.getBoundingClientRect().bottom;
      const next = shellBottom < headerBottom + 12;
      setOverFooter(next);
      if (next) setOpen(false);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const heroCta = document.querySelector("[data-nav-cta]");
    if (!heroCta) {
      setShowCta(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setShowCta(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" },
    );
    io.observe(heroCta);
    setShowCta(heroCta.getBoundingClientRect().bottom < 72);
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const measure = () => setFullWidth(Math.max(1, Math.ceil(el.getBoundingClientRect().width)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [t]);

  useEffect(() => {
    const next: CtaPhase = showCta ? "pill" : "off";
    phaseRef.current = next;
    setPhase(next);
  }, [showCta]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tuck = Math.max(20, Math.round(radius));
  const visibleButton = !wide || open || phase === "off" ? 0 : fullWidth;
  const buttonWidth = visibleButton === 0 ? 0 : visibleButton + tuck;
  const motion = "420ms cubic-bezier(0.22, 1, 0.36, 1)";
  const glass = "backdrop-blur-[48px]";

  return (
    <header
      ref={headerRef}
      aria-hidden={overFooter}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-opacity duration-300 sm:px-4 sm:pt-4",
        overFooter ? "opacity-0" : "opacity-100",
      )}
    >
      <div
        ref={shellRef}
        className={cn(
          "pointer-events-auto relative mx-auto w-full max-w-4xl [--nav-pad:1rem] [container-type:inline-size] sm:[--nav-pad:1.25rem]",
          overFooter && "pointer-events-none",
        )}
        style={{ ["--nav-r" as string]: `${radius}px` }}
      >
        <span
          ref={measureRef}
          aria-hidden
          className="pointer-events-none absolute -left-[9999px] inline-flex h-9 items-center gap-2 whitespace-nowrap text-[13px] font-medium"
          style={{ paddingLeft: tuck + 28, paddingRight: 24 }}
        >
          {t("startProject")}
          <ArrowUpRight />
        </span>

        <div aria-hidden className="invisible hidden px-4 py-2 md:block sm:px-5 sm:py-2.5">
          <div className="h-7 sm:h-8" />
        </div>

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 shadow-[0_8px_40px_rgb(0_0_0/8%)]",
            open ? "rounded-[1.75rem]" : "rounded-full",
          )}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden overflow-hidden md:block"
          style={{
            width: visibleButton === 0 ? 0 : `calc(${visibleButton}px + var(--nav-r))`,
            transition: `width ${motion}`,
            maskImage:
              "radial-gradient(circle at 0 50%, transparent var(--nav-r), #000 calc(var(--nav-r) + 0.5px))",
            WebkitMaskImage:
              "radial-gradient(circle at 0 50%, transparent var(--nav-r), #000 calc(var(--nav-r) + 0.5px))",
          }}
        >
          <div className={cn("ml-[calc(100%-100cqi)] h-full w-[100cqi] rounded-full bg-[rgba(230,224,216,0.78)]", glass)} />
        </div>

        <div className="absolute inset-y-0 right-0 z-10 hidden md:block">
          <Link
            href="/start"
            tabIndex={phase === "off" ? -1 : 0}
            aria-hidden={phase === "off"}
            className="btn-primary absolute overflow-hidden whitespace-nowrap !justify-start !px-0 !py-0 text-[13px]"
            style={{
              top: 0,
              right: 0,
              bottom: 0,
              width: buttonWidth,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: radius,
              borderBottomRightRadius: radius,
              transitionProperty: "width",
              transitionDuration: "420ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <span
              className="inline-flex h-full items-center gap-2"
              style={{ paddingLeft: tuck + 28, paddingRight: 24 }}
            >
              {t("startProject")}
              <ArrowUpRight />
            </span>
          </Link>
        </div>

        <div
          className={cn(
            "relative z-20",
            glass,
            open
              ? "w-full rounded-[1.75rem] bg-[rgba(232,226,218,0.94)] p-4 sm:p-5"
              : "rounded-full bg-[rgba(230,224,216,0.78)] px-4 py-2 sm:px-5 sm:py-2.5 md:absolute md:inset-y-0 md:left-0",
          )}
          style={
            open
              ? undefined
              : {
                  width: visibleButton === 0 ? "100%" : `calc(100% - ${visibleButton}px)`,
                  transitionProperty: "width",
                  transitionDuration: "420ms",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }
          }
        >
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex h-7 shrink-0 items-center sm:h-8" aria-label={t("home")} onClick={() => setOpen(false)}>
              <Image
                src="/brand/wc-wordmark-tight.png"
                alt="WC Digital"
                width={841}
                height={452}
                className="h-full w-auto"
                style={{ height: "100%", width: "auto" }}
                priority
              />
            </Link>

            <nav aria-label={t("aria")} className="hidden items-center gap-6 pr-5 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "text-sm transition-colors duration-300",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "font-medium text-fg"
                      : "text-fg/70 hover:text-fg",
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-full text-fg md:hidden"
              aria-expanded={open}
              aria-label={open ? t("close") : t("menu")}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <span className="text-xl leading-none">×</span>
              ) : (
                <span className="flex flex-col gap-1.5">
                  <span className="block h-px w-4 bg-fg" />
                  <span className="block h-px w-4 bg-fg" />
                </span>
              )}
            </button>
          </div>

          {open ? (
            <nav aria-label={t("aria")} className="mt-6 flex flex-col gap-1 md:hidden">
              {navItems.map((item, index) => (
                <Link
                  key={item.key}
                  href={item.href}
                  style={{ animationDelay: `${index * 55}ms` }}
                  className="animate-[nav-reveal_0.45s_cubic-bezier(0.22,1,0.36,1)_both] rounded-xl px-3 py-2.5 text-lg text-fg transition-colors duration-200 hover:bg-black/5"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              ))}
              <Link
                href="/start"
                style={{ animationDelay: `${navItems.length * 55}ms` }}
                className="btn-primary animate-[nav-reveal_0.45s_cubic-bezier(0.22,1,0.36,1)_both] mt-4 w-full"
                onClick={() => setOpen(false)}
              >
                {t("startProject")}
                <ArrowUpRight />
              </Link>
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
