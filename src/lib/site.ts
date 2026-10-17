import "server-only";

import { cache } from "react";
import { getLocale } from "next-intl/server";
import { site } from "@/content/site";
import { getPayloadClient } from "@/lib/payload";
import type { Locale } from "@/i18n/routing";

export type PublicSettings = {
  name: string;
  tagline: string;
  role: string;
  timeZone: string;
  location: string;
  email: string;
  url: string;
  stats: { value: string; label: string }[];
  socials: { label: string; href: string }[];
  hero: { headline: string[]; intro: string };
};

async function localeOrDefault(explicit?: Locale): Promise<Locale> {
  if (explicit) return explicit;
  try {
    const locale = await getLocale();
    if (locale === "en" || locale === "fr") return locale;
    return "es";
  } catch {
    return "es";
  }
}

const fallbackSettings = (): PublicSettings => ({
  name: "WC Digital",
  tagline: site.contact.body,
  role: site.role,
  timeZone: site.timeZone,
  location: site.location,
  email: site.email,
  url: site.url,
  stats: [
    { value: "50+", label: "Websites launched" },
    { value: "100%", label: "Focused on your business" },
    { value: "Fast", label: "Responsive builds" },
    { value: "24/7", label: "Support after launch" },
  ],
  socials: [...site.socials],
  hero: { headline: [...site.hero.headline], intro: site.hero.intro },
});

export const getSettings = cache(async (explicit?: Locale): Promise<PublicSettings> => {
  const fallback = fallbackSettings();
  const locale = await localeOrDefault(explicit);

  try {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({
      slug: "settings",
      depth: 0,
      locale,
      fallbackLocale: "es",
    });
    const headline = (doc.hero?.headline ?? []).filter((line): line is string => Boolean(line));
    const stats =
      doc.stats?.map((s) => ({ value: s.value || "", label: s.label || "" })).filter((s) => s.value) ??
      fallback.stats;

    return {
      name: doc.name || fallback.name,
      tagline: doc.tagline || fallback.tagline,
      role: doc.role || fallback.role,
      timeZone: doc.timeZone || fallback.timeZone,
      location: doc.location || fallback.location,
      email: doc.email || fallback.email,
      url: (doc.url || fallback.url).replace(/\/$/, ""),
      stats,
      socials:
        doc.socials
          ?.map((item) => ({ label: item.label, href: item.href }))
          .filter((item) => item.label && item.href) ?? fallback.socials,
      hero: {
        headline: headline.length > 0 ? headline : fallback.hero.headline,
        intro: doc.hero?.intro || fallback.hero.intro,
      },
    };
  } catch {
    return fallback;
  }
});
