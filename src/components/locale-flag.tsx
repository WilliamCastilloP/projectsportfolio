import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const sources: Record<Locale, string> = {
  es: "/brand/flags/es.svg",
  en: "/brand/flags/en.svg",
  fr: "/brand/flags/fr.svg",
};

export function LocaleFlag({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <Image
      src={sources[locale]}
      alt=""
      width={44}
      height={44}
      unoptimized
      className={cn("size-10", className)}
    />
  );
}
