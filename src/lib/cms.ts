import "server-only";

import { cache } from "react";
import { getLocale } from "next-intl/server";
import { getPayloadClient } from "@/lib/payload";
import { mediaUrl } from "@/lib/media";
import type { Locale } from "@/i18n/routing";
import type { Media } from "@/types/payload-types";

async function localeOrDefault(explicit?: Locale): Promise<Locale> {
  if (explicit) return explicit;
  try {
    const l = await getLocale();
    if (l === "en" || l === "fr") return l;
    return "es";
  } catch {
    return "es";
  }
}

import type { HomeContent } from "@/types/content";

export type { HomeContent };

export type ServiceItem = {
  slug: string;
  title: string;
  subtitle: string;
  body: string;
  bullets: string[];
  illustration: string;
  order: number;
};

export type ServicesContent = {
  eyebrow: string;
  title: string;
  emphasis: string;
  intro: string;
  items: ServiceItem[];
};

import type { ProcessStep } from "@/types/content";

export type { ProcessStep };

export type ProcessContent = {
  eyebrow: string;
  title: string;
  emphasis: string;
  intro: string;
  steps: ProcessStep[];
};

export type AboutContent = {
  eyebrow: string;
  hero: {
    headlineLines: string[];
    emphasis: string;
    body: string;
    image?: string;
  };
  founder: {
    name: string;
    role: string;
    note: string;
    bio: string;
    photo?: string;
    signature?: string;
  };
  mission: { eyebrow: string; title: string; body: string };
  values: { title: string; body: string; icon?: string }[];
  numbers: { value: string; label: string }[];
  numbersImage?: string;
};

export type LegalPage = {
  slug: string;
  title: string;
  body: unknown;
};

const homeFallback: Record<Locale, HomeContent> = {
  es: {
    eyebrow: "ESTUDIO DIGITAL",
    headlineLines: ["Sitios web que ayudan", "a tu negocio"],
    headlineEmphasis: "crecer.",
    intro:
      "WC Digital diseña y desarrolla sitios web a medida para empresas que quieren vender más y operar mejor en línea.",
    floatingNotes: ["Ideas", "Diseño", "Desarrollo", "Lanzamiento"],
    servicesTeaser: {
      eyebrow: "SERVICIOS",
      title: "Todo lo que necesitas para",
      emphasis: "mostrarte online.",
    },
    workTeaser: {
      eyebrow: "TRABAJO DESTACADO",
      title: "Negocios reales.",
      emphasis: "Resultados reales.",
    },
  },
  en: {
    eyebrow: "DIGITAL STUDIO",
    headlineLines: ["Websites that help", "your business"],
    headlineEmphasis: "grow.",
    intro:
      "WC Digital designs and builds custom websites for businesses that want to sell more and run better online.",
    floatingNotes: ["Ideas", "Design", "Develop", "Launch"],
    servicesTeaser: {
      eyebrow: "SERVICES",
      title: "Everything you need to show up",
      emphasis: "online.",
    },
    workTeaser: {
      eyebrow: "FEATURED WORK",
      title: "Real businesses.",
      emphasis: "Real results.",
    },
  },
  fr: {
    eyebrow: "STUDIO DIGITAL",
    headlineLines: ["Des sites web qui aident", "votre entreprise à"],
    headlineEmphasis: "grandir.",
    intro:
      "WC Digital conçoit et développe des sites sur mesure pour les entreprises qui veulent vendre plus et mieux en ligne.",
    floatingNotes: ["Idées", "Design", "Développement", "Lancement"],
    servicesTeaser: {
      eyebrow: "SERVICES",
      title: "Tout ce qu'il faut pour exister",
      emphasis: "en ligne.",
    },
    workTeaser: {
      eyebrow: "PROJETS",
      title: "Des entreprises réelles.",
      emphasis: "Des résultats réels.",
    },
  },
};

export const getHomeContent = cache(async (explicit?: Locale): Promise<HomeContent> => {
  const locale = await localeOrDefault(explicit);
  const fb = homeFallback[locale];
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({
      slug: "home-page",
      locale,
      fallbackLocale: "es",
      depth: 0,
    });
    return {
      eyebrow: doc.eyebrow || fb.eyebrow,
      headlineLines: doc.headline?.lines?.filter(Boolean) ?? fb.headlineLines,
      headlineEmphasis: doc.headline?.emphasis || fb.headlineEmphasis,
      intro: doc.intro || fb.intro,
      floatingNotes: doc.floatingNotes?.map((n) => n.text).filter(Boolean) ?? fb.floatingNotes,
      servicesTeaser: {
        eyebrow: doc.servicesTeaser?.eyebrow || fb.servicesTeaser.eyebrow,
        title: doc.servicesTeaser?.title || fb.servicesTeaser.title,
        emphasis: doc.servicesTeaser?.emphasis || fb.servicesTeaser.emphasis,
      },
      workTeaser: {
        eyebrow: doc.workTeaser?.eyebrow || fb.workTeaser.eyebrow,
        title: doc.workTeaser?.title || fb.workTeaser.title,
        emphasis: doc.workTeaser?.emphasis || fb.workTeaser.emphasis,
      },
    };
  } catch {
    return fb;
  }
});

export const getServicesContent = cache(async (explicit?: Locale): Promise<ServicesContent> => {
  const locale = await localeOrDefault(explicit);
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({
      slug: "services-page",
      locale,
      fallbackLocale: "es",
      depth: 0,
    });
    const items =
      doc.items
        ?.map((item) => ({
          slug: item.slug || "",
          title: item.title || "",
          subtitle: item.subtitle || "",
          body: item.body || "",
          bullets: item.bullets?.filter(Boolean) ?? [],
          illustration: item.illustration || item.slug || "",
          order: item.order ?? 100,
        }))
        .filter((i) => i.slug && i.title)
        .sort((a, b) => a.order - b.order) ?? [];
    return {
      eyebrow: doc.eyebrow || "SERVICES",
      title: doc.title || "",
      emphasis: doc.emphasis || "",
      intro: doc.intro || "",
      items,
    };
  } catch {
    return { eyebrow: "SERVICES", title: "", emphasis: "", intro: "", items: [] };
  }
});

export const getProcessContent = cache(async (explicit?: Locale): Promise<ProcessContent> => {
  const locale = await localeOrDefault(explicit);
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({
      slug: "process-page",
      locale,
      fallbackLocale: "es",
      depth: 1,
    });
    const steps =
      doc.steps
        ?.map((s) => ({
          number: s.number || "",
          title: s.title || "",
          body: s.body || "",
          icon: mediaUrl(s.icon as number | Media) || undefined,
        }))
        .filter((s) => s.title) ?? [];
    return {
      eyebrow: doc.eyebrow || "OUR PROCESS",
      title: doc.title || "",
      emphasis: doc.emphasis || "",
      intro: doc.intro || "",
      steps,
    };
  } catch {
    return { eyebrow: "OUR PROCESS", title: "", emphasis: "", intro: "", steps: [] };
  }
});

export const getAboutContent = cache(async (explicit?: Locale): Promise<AboutContent> => {
  const locale = await localeOrDefault(explicit);
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({
      slug: "about-page",
      locale,
      fallbackLocale: "es",
      depth: 1,
    });
    return {
      eyebrow: doc.eyebrow || "ABOUT",
      hero: {
        headlineLines: doc.hero?.headlineLines?.filter(Boolean) ?? [],
        emphasis: doc.hero?.emphasis || "",
        body: doc.hero?.body || "",
        image: mediaUrl(doc.hero?.image as number | Media) || undefined,
      },
      founder: {
        name: doc.founder?.name || "",
        role: doc.founder?.role || "",
        note: doc.founder?.note || "",
        bio: doc.founder?.bio || "",
        photo: mediaUrl(doc.founder?.photo as number | Media) || undefined,
        signature: mediaUrl(doc.founder?.signature as number | Media) || undefined,
      },
      mission: {
        eyebrow: doc.mission?.eyebrow || "",
        title: doc.mission?.title || "",
        body: doc.mission?.body || "",
      },
      values:
        doc.values?.map((v) => ({
          title: v.title || "",
          body: v.body || "",
          icon: v.icon || undefined,
        })) ?? [],
      numbers:
        doc.numbers?.map((n) => ({ value: n.value || "", label: n.label || "" })).filter((n) => n.value) ??
        [],
      numbersImage: mediaUrl(doc.numbersImage as number | Media) || undefined,
    };
  } catch {
    return {
      eyebrow: "ABOUT",
      hero: { headlineLines: [], emphasis: "", body: "" },
      founder: { name: "", role: "", note: "", bio: "" },
      mission: { eyebrow: "", title: "", body: "" },
      values: [],
      numbers: [],
    };
  }
});

export const getLegalPage = cache(async (slug: string, explicit?: Locale): Promise<LegalPage | null> => {
  const locale = await localeOrDefault(explicit);
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "pages",
      where: { slug: { equals: slug } },
      locale,
      fallbackLocale: "es",
      limit: 1,
    });
    const doc = result.docs[0];
    if (!doc) return null;
    return { slug, title: doc.title || slug, body: doc.body };
  } catch {
    return null;
  }
});
