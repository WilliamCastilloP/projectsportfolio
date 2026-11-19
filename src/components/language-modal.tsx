"use client";

import { useEffect, useRef, useState, type TransitionEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { LocaleFlag } from "@/components/locale-flag";
import { cn } from "@/lib/cn";

const COOKIE = "wc-locale";
const DISMISS = "wc-locale-modal-dismissed";
const PICK_ORDER: Locale[] = ["en", "fr", "es"];
const GREETING_EASE = "cubic-bezier(0.34, 1.45, 0.64, 1)";

function suggestLocale(): Locale {
  if (typeof navigator === "undefined") return "es";
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("es")) return "es";
  if (lang.startsWith("fr")) return "fr";
  return "en";
}

export function LanguageModal({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const t = useTranslations("languageModal");
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(defaultOpen);
  const [suggested, setSuggested] = useState<Locale>("es");
  const [widths, setWidths] = useState<number[]>([]);
  const [step, setStep] = useState<number>(routing.locales.length);
  const [slide, setSlide] = useState(false);
  const measureRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const greetings = routing.locales.map((locale) => ({
    text: t(`greeting.${locale}`),
    locale: locale as Locale,
  }));
  const greetingCount = greetings.length;
  const track = Array.from({ length: greetingCount * 4 }, (_, index) => greetings[index % greetingCount]);
  const ready = viewportWidth > 0 && widths.length === greetingCount && widths.every((width) => width > 0);

  useEffect(() => {
    const force = new URLSearchParams(window.location.search).get("qaModal") === "1";
    const cookieList = document.cookie.split(";").map((c) => c.trim());
    const dismissed = cookieList.some((c) => c.startsWith(`${DISMISS}=`));
    const hasLocale = cookieList.some((c) => c.startsWith(`${COOKIE}=`));
    setSuggested(suggestLocale());
    if (force) setVisible(true);
    else if (dismissed || hasLocale) setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const measure = () => {
      const next = greetings.map((_, index) => measureRefs.current[index]?.getBoundingClientRect().width ?? 0);
      if (next.every((width) => width > 0)) setWidths(next);
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [visible, t]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!visible || !node) return;
    const measure = () => setViewportWidth(node.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible || !ready) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const timer = window.setInterval(() => {
      setSlide(true);
      setStep((current) => current + 1);
    }, 1600);
    return () => window.clearInterval(timer);
  }, [visible, ready]);

  const stride = viewportWidth / 2;
  const translate = ready ? (1 - step) * stride : 0;

  function onTrackEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.propertyName !== "transform" || step < greetingCount * 3) return;
    setSlide(false);
    setStep((current) => current - greetingCount);
  }

  function persist(code: Locale) {
    document.cookie = `${COOKIE}=${code}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `${DISMISS}=1; path=/; max-age=31536000; SameSite=Lax`;
    setVisible(false);
    router.replace(pathname, { locale: code });
  }

  function close() {
    persist(suggested);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/45 p-4 backdrop-blur-[6px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-modal-title"
        className="relative w-full max-w-[36rem] overflow-hidden rounded-[1.75rem] border border-lilac/30 bg-surface px-8 py-10 shadow-[0_40px_80px_color-mix(in_oklab,var(--ink)_28%,transparent)] sm:px-12 sm:py-12"
      >
        <button
          type="button"
          onClick={close}
          className="absolute right-5 top-5 text-xl leading-none text-faint hover:text-fg"
          aria-label={t("close")}
        >
          ×
        </button>
        <p id="lang-modal-title" className="label text-center text-faint">
          {t("title")}
        </p>
        <div
          ref={viewportRef}
          className="relative -mx-8 mt-8 h-[4.75rem] w-[calc(100%+4rem)] overflow-hidden sm:-mx-12 sm:w-[calc(100%+6rem)]"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, var(--mask-solid) 16%, var(--mask-solid) 84%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, var(--mask-solid) 16%, var(--mask-solid) 84%, transparent)",
          }}
        >
          <div className="pointer-events-none absolute -left-[9999px] top-0" aria-hidden>
            {greetings.map((greeting, index) => (
              <span
                key={greeting.locale}
                ref={(node) => {
                  measureRefs.current[index] = node;
                }}
                className="serif-display inline-block whitespace-nowrap text-3xl sm:text-[2.75rem]"
              >
                {greeting.text}
              </span>
            ))}
          </div>
          <div
            className={cn("relative h-full", !ready && "invisible")}
            style={{
              transform: `translate3d(${translate}px, 0, 0)`,
              transition: slide ? `transform 1100ms ${GREETING_EASE}` : "none",
            }}
            onTransitionEnd={onTrackEnd}
          >
            {track.map((greeting, index) => {
              const active = index === step;
              const width = widths[index % greetingCount] ?? 0;
              return (
                <span
                  key={`${greeting.locale}-${index}`}
                  className="absolute bottom-0 inline-flex flex-col items-center"
                  style={{ left: index * stride - width / 2 }}
                >
                  <span
                    className={cn(
                      "serif-display whitespace-nowrap text-3xl sm:text-[2.75rem]",
                      slide && "transition-colors duration-[1100ms]",
                      active ? "text-fg" : "text-faint",
                    )}
                  >
                    {greeting.text}
                  </span>
                  <span
                    className={cn("mt-2 h-px w-10", active ? "bg-brand" : "bg-transparent")}
                    aria-hidden
                  />
                </span>
              );
            })}
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-sm text-center text-sm leading-relaxed text-muted">{t("subtitle")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-8 sm:gap-10">
          {PICK_ORDER.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => persist(code)}
              className="group flex flex-col items-center gap-3"
              aria-label={`${code.toUpperCase()} — ${t(code)}`}
              data-locale={code}
            >
              <span
                className={cn(
                  "flex size-[5.25rem] items-center justify-center rounded-full transition",
                  suggested === code
                    ? "bg-brand-soft ring-1 ring-brand/40"
                    : "bg-elevated hover:bg-brand-soft",
                )}
              >
                <LocaleFlag locale={code} className="size-11" />
              </span>
              <span className="text-sm text-fg">{t(code)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
