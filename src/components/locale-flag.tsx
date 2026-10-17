import { useId } from "react";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LocaleFlag({ locale, className }: { locale: Locale; className?: string }) {
  const uid = useId();
  const clip = `flag-${uid.replace(/:/g, "")}`;

  if (locale === "en") {
    return (
      <svg viewBox="0 0 60 60" className={cn("size-10", className)} aria-hidden>
        <clipPath id={clip}>
          <circle cx="30" cy="30" r="30" />
        </clipPath>
        <g clipPath={`url(#${clip})`}>
          <rect width="60" height="60" fill="#012169" />
          <path d="M0 0 L60 60 M60 0 L0 60" stroke="#fff" strokeWidth="12" />
          <path d="M0 0 L60 60 M60 0 L0 60" stroke="#C8102E" strokeWidth="7" />
          <path d="M30 0 V60 M0 30 H60" stroke="#fff" strokeWidth="18" />
          <path d="M30 0 V60 M0 30 H60" stroke="#C8102E" strokeWidth="10" />
        </g>
      </svg>
    );
  }

  if (locale === "fr") {
    return (
      <svg viewBox="0 0 60 60" className={cn("size-10", className)} aria-hidden>
        <clipPath id={clip}>
          <circle cx="30" cy="30" r="30" />
        </clipPath>
        <g clipPath={`url(#${clip})`}>
          <rect width="20" height="60" fill="#002395" />
          <rect x="20" width="20" height="60" fill="#fff" />
          <rect x="40" width="20" height="60" fill="#ED2939" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 60 60" className={cn("size-10", className)} aria-hidden>
      <clipPath id={clip}>
        <circle cx="30" cy="30" r="30" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <rect width="60" height="60" fill="#C60B1E" />
        <rect y="15" width="60" height="30" fill="#FFC400" />
      </g>
    </svg>
  );
}
