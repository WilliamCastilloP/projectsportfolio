"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LocaleControl({ variant = "footer" }: { variant?: "footer" | "inline" }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("locale");
  const [pending, startTransition] = useTransition();

  function select(code: Locale) {
    if (code === locale) return;
    document.cookie = `wc-locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      router.replace(pathname, { locale: code });
    });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex gap-1 text-xs",
        variant === "footer" ? "text-white/50" : "text-faint",
      )}
    >
      {routing.locales.map((code, i) => (
        <span key={code} className="inline-flex items-center gap-1">
          {i > 0 ? <span aria-hidden>/</span> : null}
          <button
            type="button"
            disabled={pending}
            onClick={() => select(code as Locale)}
            className={cn(
              "transition hover:text-white",
              locale === code && (variant === "footer" ? "text-white" : "text-fg font-medium"),
            )}
          >
            {t(code)}
          </button>
        </span>
      ))}
    </div>
  );
}
