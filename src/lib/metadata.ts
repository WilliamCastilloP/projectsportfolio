import "server-only";

import type { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
import { localizedPath } from "@/i18n/path";
import type { Locale } from "@/i18n/routing";
import { getSettings } from "@/lib/site";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

const ogLocale: Record<Locale, string> = { es: "es_ES", en: "en_US", fr: "fr_FR" };

/** Solo el despliegue de producción de Vercel se indexa; previews y local no. */
export function isIndexable() {
  return process.env.VERCEL_ENV === "production";
}

/**
 * Next reemplaza `openGraph` entero en cada segmento (no lo fusiona con el del layout),
 * así que cada página tiene que devolver también `siteName`, `locale`, `type` y las
 * imágenes que hereda de `[locale]/opengraph-image` vía `parent`.
 */
export async function pageOpenGraph({
  path,
  title,
  description,
  type = "website",
  parent,
}: {
  path: string;
  title?: string;
  description?: string;
  type?: "website" | "article";
  parent?: ResolvingMetadata;
}): Promise<OpenGraph> {
  const raw = await getLocale();
  const locale: Locale = raw === "en" || raw === "fr" ? raw : "es";
  const [settings, inherited] = await Promise.all([getSettings(locale), parent]);
  return {
    type,
    locale: ogLocale[locale],
    url: localizedPath(path, locale),
    siteName: settings.name,
    title: title ? `${title} — ${settings.name}` : settings.name,
    description: description || settings.tagline || undefined,
    ...(inherited?.openGraph?.images ? { images: inherited.openGraph.images } : {}),
  };
}
