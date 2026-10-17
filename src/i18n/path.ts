import { routing, type Locale } from "@/i18n/routing";

export function localizedPath(pathname: string, locale: Locale) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function languageAlternates(pathname = "/") {
  return {
    es: localizedPath(pathname, "es"),
    en: localizedPath(pathname, "en"),
    fr: localizedPath(pathname, "fr"),
    "x-default": localizedPath(pathname, "es"),
  };
}
