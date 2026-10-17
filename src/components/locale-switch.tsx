"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LocaleSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("locale");
  const [pending, startTransition] = useTransition();

  function select(code: Locale) {
    if (code === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: code });
    });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="relative isolate inline-grid h-8 grid-cols-2 items-center rounded-full border border-line p-0.5 text-faint"
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-fg transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          locale === "en" && "translate-x-full",
        )}
      />
      {routing.locales.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            disabled={pending}
            onClick={() => select(code as Locale)}
            aria-pressed={active}
            className={cn(
              "relative z-10 rounded-full px-2.5 leading-none transition-colors",
              active ? "text-bg" : "hover:text-fg",
            )}
          >
            {t(code)}
          </button>
        );
      })}
    </div>
  );
}
