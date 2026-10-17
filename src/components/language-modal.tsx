"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { LocaleFlag } from "@/components/locale-flag";
import { cn } from "@/lib/cn";

const COOKIE = "wc-locale";
const DISMISS = "wc-locale-modal-dismissed";
const PICK_ORDER: Locale[] = ["en", "fr", "es"];

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
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [suggested, setSuggested] = useState<Locale>("es");

  const greetings = routing.locales.map((locale) => ({
    text: t(`greeting.${locale}`),
    locale: locale as Locale,
  }));

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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const suggestedIndex = routing.locales.indexOf(suggested);
    if (reduced) {
      setGreetingIndex(suggestedIndex >= 0 ? suggestedIndex : 0);
      return;
    }
    const timers = [
      setTimeout(() => setGreetingIndex(1), 800),
      setTimeout(() => setGreetingIndex(2), 1600),
      setTimeout(() => setGreetingIndex(suggestedIndex >= 0 ? suggestedIndex : 0), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [visible, suggested]);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[6px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-modal-title"
        className="relative w-full max-w-[36rem] rounded-[1.75rem] bg-surface px-8 py-10 shadow-[0_40px_80px_rgb(0_0_0/28%)] sm:px-12 sm:py-12"
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
        <div className="mt-8 flex min-h-[3.5rem] items-end justify-center gap-5 sm:gap-8">
          {greetings.map((g, i) => {
            const active = greetingIndex === i;
            return (
              <span
                key={g.locale}
                className={cn(
                  "serif-display text-3xl transition-all duration-500 sm:text-[2.75rem]",
                  active ? "scale-100 text-fg opacity-100" : "scale-95 text-[#c8c2b8] opacity-70",
                )}
              >
                {g.text}
                {active ? (
                  <span className="mx-auto mt-2 block h-px w-10 bg-fg/40" aria-hidden />
                ) : null}
              </span>
            );
          })}
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
                    ? "bg-[#efe8dc] ring-1 ring-fg/10"
                    : "bg-[#f4efe6] hover:bg-[#efe8dc]",
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
