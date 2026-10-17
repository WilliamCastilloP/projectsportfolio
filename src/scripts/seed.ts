import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPayload } from "payload";
import config from "@payload-config";

type LexicalNode = Record<string, unknown>;
type Locale = "es" | "en" | "fr";

function text(value: string): LexicalNode {
  return {
    type: "text",
    text: value,
    format: 0,
    detail: 0,
    mode: "normal",
    style: "",
    version: 1,
  };
}

function paragraph(value: string): LexicalNode {
  return {
    type: "paragraph",
    children: [text(value)],
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: 0,
    version: 1,
  };
}

function heading(value: string, tag: "h2" | "h3" = "h2"): LexicalNode {
  return {
    type: "heading",
    tag,
    children: [text(value)],
    direction: "ltr",
    format: "",
    indent: 0,
    version: 1,
  };
}

function bulletList(items: string[]): LexicalNode {
  return {
    type: "list",
    listType: "bullet",
    start: 1,
    tag: "ul",
    direction: "ltr",
    format: "",
    indent: 0,
    version: 1,
    children: items.map((item, index) => ({
      type: "listitem",
      value: index + 1,
      children: [paragraph(item)],
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    })),
  };
}

function body(nodes: LexicalNode[]) {
  return {
    root: {
      type: "root",
      children: nodes,
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

const captures = path.join(process.cwd(), "tmp", "captures");

async function uploadFile(
  payload: Awaited<ReturnType<typeof getPayload>>,
  filename: string,
  alt: string,
) {
  const filepath = path.join(captures, filename);
  if (!existsSync(filepath)) {
    throw new Error(`Missing screenshot: ${filepath}. Run npm run capture first.`);
  }

  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    return existing.docs[0].id;
  }

  const data = await readFile(filepath);
  const created = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data,
      mimetype: "image/png",
      name: filename,
      size: data.byteLength,
    },
    overrideAccess: true,
  });

  return created.id;
}

async function uploadOptional(
  payload: Awaited<ReturnType<typeof getPayload>>,
  filename: string,
  alt: string,
) {
  if (!existsSync(path.join(captures, filename))) return undefined;
  return uploadFile(payload, filename, alt);
}

async function upsertProject(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  shared: Record<string, unknown>,
  localized: Record<Locale, Record<string, unknown>>,
) {
  const existing = await payload.find({
    collection: "projects",
    where: { slug: { equals: slug } },
    limit: 1,
    locale: "es",
    overrideAccess: true,
  });

  const esData = { ...shared, ...localized.es, slug };
  let id: string | number;

  if (existing.docs[0]) {
    id = existing.docs[0].id;
    await payload.update({
      collection: "projects",
      id,
      data: esData,
      locale: "es",
      overrideAccess: true,
    } as never);
  } else {
    const created = await payload.create({
      collection: "projects",
      data: esData,
      locale: "es",
      overrideAccess: true,
    } as never);
    id = created.id;
  }

  for (const locale of ["en", "fr"] as const) {
    await payload.update({
      collection: "projects",
      id,
      data: localized[locale],
      locale,
      overrideAccess: true,
    } as never);
  }
}

type LegalSlug = "privacy" | "terms" | "cookies";

async function upsertLegalPage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: LegalSlug,
  localized: Record<Locale, { title: string; body: ReturnType<typeof body> }>,
) {
  const existing = await payload.find({
    collection: "pages",
    where: { slug: { equals: slug } },
    limit: 1,
    locale: "es",
    overrideAccess: true,
  });

  let id: string | number;

  if (existing.docs[0]) {
    id = existing.docs[0].id;
    await payload.update({
      collection: "pages",
      id,
      data: { slug, title: localized.es.title, body: localized.es.body },
      locale: "es",
      overrideAccess: true,
    } as never);
  } else {
    const created = await payload.create({
      collection: "pages",
      data: { slug, title: localized.es.title, body: localized.es.body },
      locale: "es",
      overrideAccess: true,
    } as never);
    id = created.id;
  }

  for (const locale of ["en", "fr"] as const) {
    await payload.update({
      collection: "pages",
      id,
      data: { title: localized[locale].title, body: localized[locale].body },
      locale,
      overrideAccess: true,
    } as never);
  }
}

const payload = await getPayload({ config });

// ——— Settings ———
await payload.updateGlobal({
  slug: "settings",
  locale: "es",
  overrideAccess: true,
  data: {
    voice: "company",
    name: "WC Digital",
    timeZone: "America/Caracas",
    email: "hello@wcdigital.studio",
    url: "https://wcdigital.studio",
    socials: [],
    role: "Estudio digital",
    location: "Américas",
    tagline:
      "Diseñamos y desarrollamos sitios web a medida para empresas que quieren crecer en línea.",
    stats: [
      { value: "50+", label: "Sitios lanzados" },
      { value: "100%", label: "Enfocados en tu negocio" },
      { value: "Rápido", label: "Entregas ágiles" },
      { value: "24/7", label: "Soporte post-lanzamiento" },
    ],
    hero: {
      headline: ["Sitios web que", "mueven el negocio."],
      intro:
        "WC Digital diseña y desarrolla plataformas web — vitrinas, e-commerce y el CMS detrás — como código que el cliente conserva.",
    },
    contact: {
      heading: "Contacto",
      body: "Lo más rápido es el correo. Leemos todo y respondemos con pasos claros.",
    },
  },
});

await payload.updateGlobal({
  slug: "settings",
  locale: "en",
  overrideAccess: true,
  data: {
    role: "Digital studio",
    location: "Americas",
    tagline: "We design and build custom websites for businesses that want to grow online.",
    stats: [
      { value: "50+", label: "Websites launched" },
      { value: "100%", label: "Focused on your business" },
      { value: "Fast", label: "Responsive builds" },
      { value: "24/7", label: "Support after launch" },
    ],
    hero: {
      headline: ["Websites that", "move the business."],
      intro:
        "WC Digital designs and ships web platforms — storefronts, e-commerce and the CMS behind them — as a codebase the client keeps.",
    },
    contact: {
      heading: "Contact",
      body: "Email is the fastest way to reach us. We read everything and reply with clear next steps.",
    },
  },
});

await payload.updateGlobal({
  slug: "settings",
  locale: "fr",
  overrideAccess: true,
  data: {
    role: "Studio digital",
    location: "Amériques",
    tagline:
      "Nous concevons et développons des sites sur mesure pour les entreprises qui veulent grandir en ligne.",
    stats: [
      { value: "50+", label: "Sites lancés" },
      { value: "100%", label: "Centrés sur votre activité" },
      { value: "Rapide", label: "Livraisons agiles" },
      { value: "24/7", label: "Support après lancement" },
    ],
    hero: {
      headline: ["Des sites web qui", "font avancer l'activité."],
      intro:
        "WC Digital conçoit et livre des plateformes web — vitrines, e-commerce et le CMS — comme un code que le client conserve.",
    },
    contact: {
      heading: "Contact",
      body: "Le courriel est le moyen le plus rapide. Nous lisons tout et répondons avec des étapes claires.",
    },
  },
});

// ——— Home page ———
const homeByLocale: Record<Locale, Record<string, unknown>> = {
  es: {
    eyebrow: "ESTUDIO DIGITAL",
    headline: {
      lines: ["Sitios web que ayudan", "a tu negocio"],
      emphasis: "crecer.",
    },
    intro:
      "WC Digital diseña y desarrolla sitios web a medida para empresas que quieren vender más y operar mejor en línea.",
    floatingNotes: [{ text: "Ideas" }, { text: "Diseño" }, { text: "Desarrollo" }, { text: "Lanzamiento" }],
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
    headline: {
      lines: ["Websites that help", "your business"],
      emphasis: "grow.",
    },
    intro:
      "WC Digital designs and builds custom websites for businesses that want to sell more and run better online.",
    floatingNotes: [{ text: "Ideas" }, { text: "Design" }, { text: "Develop" }, { text: "Launch" }],
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
    headline: {
      lines: ["Des sites web qui aident", "votre entreprise à"],
      emphasis: "grandir.",
    },
    intro:
      "WC Digital conçoit et développe des sites sur mesure pour les entreprises qui veulent vendre plus et mieux en ligne.",
    floatingNotes: [{ text: "Idées" }, { text: "Design" }, { text: "Développement" }, { text: "Lancement" }],
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

for (const locale of ["es", "en", "fr"] as const) {
  await payload.updateGlobal({
    slug: "home-page",
    locale,
    overrideAccess: true,
    data: homeByLocale[locale],
  });
}

// ——— Services page ———
const servicesByLocale: Record<Locale, Record<string, unknown>> = {
  es: {
    eyebrow: "SERVICIOS",
    title: "Todo lo que necesitas para",
    emphasis: "mostrarte online.",
    intro:
      "De la estrategia y el diseño al desarrollo y el lanzamiento — acompañamos todo el recorrido.",
    items: [
      {
        slug: "web-design",
        title: "Diseño web",
        subtitle: "Interfaces claras que convierten",
        body: "Diseñamos sitios que reflejan tu marca, guían al visitante y preparan el terreno para el desarrollo.",
        bullets: [
          "Wireframes y flujos de usuario",
          "UI responsive y accesible",
          "Sistemas visuales coherentes",
          "Prototipos listos para build",
        ],
        illustration: "web-design",
        order: 1,
      },
      {
        slug: "development",
        title: "Desarrollo",
        subtitle: "Código moderno, rendimiento real",
        body: "Implementamos en Next.js con un CMS que tu equipo puede editar sin depender de un desarrollador.",
        bullets: [
          "Next.js App Router y TypeScript",
          "Payload CMS integrado",
          "SEO técnico y Core Web Vitals",
          "Despliegue y CI listos",
        ],
        illustration: "development",
        order: 2,
      },
      {
        slug: "ecommerce",
        title: "E-commerce",
        subtitle: "Tiendas que el equipo opera solo",
        body: "Catálogo, checkout, inventario y pagos — con un admin en el idioma de tu operación.",
        bullets: [
          "Catálogo y variantes",
          "Checkout y cuentas de cliente",
          "Inventario y pedidos",
          "Integraciones de pago",
        ],
        illustration: "ecommerce",
        order: 3,
      },
      {
        slug: "digital-presence",
        title: "Presencia digital",
        subtitle: "Marca y contenido alineados",
        body: "Landing pages, SEO y contenido que refuerzan cómo te encuentran y cómo te perciben.",
        bullets: [
          "Landings de campaña",
          "Optimización on-page",
          "Analytics y conversiones",
          "Mantenimiento evolutivo",
        ],
        illustration: "digital-presence",
        order: 4,
      },
    ],
  },
  en: {
    eyebrow: "SERVICES",
    title: "Everything you need to show up",
    emphasis: "online.",
    intro: "From strategy and design to development and launch — we handle the full journey.",
    items: [
      {
        slug: "web-design",
        title: "Web design",
        subtitle: "Clear interfaces that convert",
        body: "We design sites that reflect your brand, guide visitors and set up development for success.",
        bullets: [
          "Wireframes and user flows",
          "Responsive, accessible UI",
          "Cohesive visual systems",
          "Build-ready prototypes",
        ],
        illustration: "web-design",
        order: 1,
      },
      {
        slug: "development",
        title: "Development",
        subtitle: "Modern code, real performance",
        body: "We ship on Next.js with a CMS your team can edit without a developer in the loop.",
        bullets: [
          "Next.js App Router and TypeScript",
          "Integrated Payload CMS",
          "Technical SEO and Core Web Vitals",
          "Deploy-ready CI",
        ],
        illustration: "development",
        order: 2,
      },
      {
        slug: "ecommerce",
        title: "E-commerce",
        subtitle: "Stores your team can run",
        body: "Catalogue, checkout, inventory and payments — with an admin in your team's language.",
        bullets: [
          "Catalogue and variants",
          "Checkout and customer accounts",
          "Inventory and orders",
          "Payment integrations",
        ],
        illustration: "ecommerce",
        order: 3,
      },
      {
        slug: "digital-presence",
        title: "Digital presence",
        subtitle: "Brand and content aligned",
        body: "Landing pages, SEO and content that reinforce how people find you and how they perceive you.",
        bullets: [
          "Campaign landings",
          "On-page optimization",
          "Analytics and conversions",
          "Evolutionary maintenance",
        ],
        illustration: "digital-presence",
        order: 4,
      },
    ],
  },
  fr: {
    eyebrow: "SERVICES",
    title: "Tout ce qu'il faut pour exister",
    emphasis: "en ligne.",
    intro:
      "De la stratégie au design, du développement au lancement — nous couvrons tout le parcours.",
    items: [
      {
        slug: "web-design",
        title: "Design web",
        subtitle: "Des interfaces claires qui convertissent",
        body: "Nous concevons des sites qui reflètent votre marque, guident le visiteur et préparent le développement.",
        bullets: [
          "Wireframes et parcours utilisateur",
          "UI responsive et accessible",
          "Systèmes visuels cohérents",
          "Prototypes prêts à développer",
        ],
        illustration: "web-design",
        order: 1,
      },
      {
        slug: "development",
        title: "Développement",
        subtitle: "Code moderne, performance réelle",
        body: "Nous livrons sur Next.js avec un CMS que votre équipe peut éditer sans développeur.",
        bullets: [
          "Next.js App Router et TypeScript",
          "Payload CMS intégré",
          "SEO technique et Core Web Vitals",
          "CI prête pour le déploiement",
        ],
        illustration: "development",
        order: 2,
      },
      {
        slug: "ecommerce",
        title: "E-commerce",
        subtitle: "Des boutiques que l'équipe gère seule",
        body: "Catalogue, checkout, inventaire et paiements — avec un admin dans la langue de votre équipe.",
        bullets: [
          "Catalogue et variantes",
          "Checkout et comptes clients",
          "Inventaire et commandes",
          "Intégrations de paiement",
        ],
        illustration: "ecommerce",
        order: 3,
      },
      {
        slug: "digital-presence",
        title: "Présence digitale",
        subtitle: "Marque et contenu alignés",
        body: "Landings, SEO et contenu qui renforcent comment on vous trouve et comment on vous perçoit.",
        bullets: [
          "Landings de campagne",
          "Optimisation on-page",
          "Analytics et conversions",
          "Maintenance évolutive",
        ],
        illustration: "digital-presence",
        order: 4,
      },
    ],
  },
};

for (const locale of ["es", "en", "fr"] as const) {
  await payload.updateGlobal({
    slug: "services-page",
    locale,
    overrideAccess: true,
    data: servicesByLocale[locale],
  });
}

// ——— Process page ———
const processByLocale: Record<Locale, Record<string, unknown>> = {
  es: {
    eyebrow: "PROCESO",
    title: "Cómo",
    emphasis: "trabajamos.",
    intro: "Un recorrido claro de la primera conversación al sitio en producción.",
    steps: [
      {
        number: "01",
        title: "Discover",
        body: "Entendemos el negocio, el público y qué debe lograr el sitio antes de diseñar un píxel.",
      },
      {
        number: "02",
        title: "Strategy",
        body: "Definimos alcance, mapa del sitio, contenido clave y criterios de éxito.",
      },
      {
        number: "03",
        title: "Design",
        body: "UI, tipografía y componentes que encajan con la marca y preparan el desarrollo.",
      },
      {
        number: "04",
        title: "Develop",
        body: "Implementación en Next.js, CMS, integraciones y pruebas en entornos reales.",
      },
      {
        number: "05",
        title: "Launch",
        body: "Despliegue, SEO inicial, handoff al equipo y soporte post-lanzamiento.",
      },
    ],
  },
  en: {
    eyebrow: "OUR PROCESS",
    title: "How we",
    emphasis: "work.",
    intro: "A clear path from the first conversation to a live site.",
    steps: [
      {
        number: "01",
        title: "Discover",
        body: "We learn the business, audience and what the site must achieve before designing a pixel.",
      },
      {
        number: "02",
        title: "Strategy",
        body: "We define scope, sitemap, key content and success criteria.",
      },
      {
        number: "03",
        title: "Design",
        body: "UI, typography and components that fit the brand and set up development.",
      },
      {
        number: "04",
        title: "Develop",
        body: "Next.js build, CMS, integrations and testing in real environments.",
      },
      {
        number: "05",
        title: "Launch",
        body: "Deploy, baseline SEO, team handoff and post-launch support.",
      },
    ],
  },
  fr: {
    eyebrow: "PROCESSUS",
    title: "Comment nous",
    emphasis: "travaillons.",
    intro: "Un parcours clair de la première conversation au site en production.",
    steps: [
      {
        number: "01",
        title: "Discover",
        body: "Nous comprenons l'activité, le public et ce que le site doit accomplir avant de designer.",
      },
      {
        number: "02",
        title: "Strategy",
        body: "Nous définissons le périmètre, le plan du site, le contenu clé et les critères de succès.",
      },
      {
        number: "03",
        title: "Design",
        body: "UI, typographie et composants alignés avec la marque et prêts pour le développement.",
      },
      {
        number: "04",
        title: "Develop",
        body: "Build Next.js, CMS, intégrations et tests en conditions réelles.",
      },
      {
        number: "05",
        title: "Launch",
        body: "Mise en ligne, SEO de base, passation à l'équipe et support après lancement.",
      },
    ],
  },
};

for (const locale of ["es", "en", "fr"] as const) {
  await payload.updateGlobal({
    slug: "process-page",
    locale,
    overrideAccess: true,
    data: processByLocale[locale],
  });
}

// ——— About page ———
const aboutByLocale: Record<Locale, Record<string, unknown>> = {
  es: {
    eyebrow: "NOSOTROS",
    hero: {
      headlineLines: ["Diseño, tecnología y", "estrategia en un solo"],
      emphasis: "equipo.",
      body: "WC Digital ayuda a empresas a mostrarse y operar mejor en línea con sitios hechos a medida.",
    },
    founder: {
      name: "William Castro",
      role: "Fundador",
      note: "Placeholder — actualiza nombre y bio en el admin.",
      bio: "Combina diseño de producto, desarrollo full-stack y dirección de proyectos para entregar sitios que el cliente puede conservar y extender.",
    },
    mission: {
      eyebrow: "MISIÓN",
      title: "Webs que impulsan el negocio",
      body: "Cada proyecto busca claridad para el visitante, control para el equipo y código que no encierra al cliente en una plataforma cerrada.",
    },
    values: [
      {
        title: "Calidad",
        body: "Detalle en diseño, rendimiento y accesibilidad — no solo en el lanzamiento.",
        icon: "quality",
      },
      {
        title: "Transparencia",
        body: "Alcance, plazos y decisiones técnicas compartidas desde el inicio.",
        icon: "transparency",
      },
      {
        title: "Colaboración",
        body: "Trabajamos contigo, no solo para ti, en cada fase del proyecto.",
        icon: "collaboration",
      },
      {
        title: "Resultados",
        body: "Medimos el éxito en conversiones, operación más simple y confianza de marca.",
        icon: "results",
      },
    ],
    numbers: [
      { value: "50+", label: "Proyectos entregados" },
      { value: "3", label: "Idiomas en producción" },
      { value: "100%", label: "Código del cliente" },
      { value: "5", label: "Pasos de proceso" },
    ],
  },
  en: {
    eyebrow: "ABOUT",
    hero: {
      headlineLines: ["Design, technology and", "strategy in one"],
      emphasis: "team.",
      body: "WC Digital helps businesses show up and run better online with custom-built websites.",
    },
    founder: {
      name: "William Castro",
      role: "Founder",
      note: "Placeholder — update name and bio in the admin.",
      bio: "Brings product design, full-stack development and project direction together so clients keep code they can extend.",
    },
    mission: {
      eyebrow: "MISSION",
      title: "Websites that move the business",
      body: "Every engagement aims for clarity for visitors, control for the team and code that does not lock the client into a closed platform.",
    },
    values: [
      {
        title: "Quality",
        body: "Care in design, performance and accessibility — not only on launch day.",
        icon: "quality",
      },
      {
        title: "Transparency",
        body: "Scope, timelines and technical choices shared from day one.",
        icon: "transparency",
      },
      {
        title: "Collaboration",
        body: "We work with you, not just for you, at every project stage.",
        icon: "collaboration",
      },
      {
        title: "Results",
        body: "Success means conversions, simpler operations and brand trust.",
        icon: "results",
      },
    ],
    numbers: [
      { value: "50+", label: "Projects delivered" },
      { value: "3", label: "Languages in production" },
      { value: "100%", label: "Client-owned code" },
      { value: "5", label: "Process steps" },
    ],
  },
  fr: {
    eyebrow: "À PROPOS",
    hero: {
      headlineLines: ["Design, technologie et", "stratégie dans une"],
      emphasis: "équipe.",
      body: "WC Digital aide les entreprises à exister et mieux opérer en ligne avec des sites sur mesure.",
    },
    founder: {
      name: "William Castro",
      role: "Fondateur",
      note: "Placeholder — mettez à jour le nom et la bio dans l'admin.",
      bio: "Réunit design produit, développement full-stack et direction de projet pour livrer un code que le client peut garder.",
    },
    mission: {
      eyebrow: "MISSION",
      title: "Des sites qui font avancer l'activité",
      body: "Chaque projet vise la clarté pour le visiteur, le contrôle pour l'équipe et un code sans plateforme fermée.",
    },
    values: [
      {
        title: "Qualité",
        body: "Soin du design, des performances et de l'accessibilité — pas seulement le jour J.",
        icon: "quality",
      },
      {
        title: "Transparence",
        body: "Périmètre, délais et choix techniques partagés dès le départ.",
        icon: "transparency",
      },
      {
        title: "Collaboration",
        body: "Nous travaillons avec vous, pas seulement pour vous, à chaque étape.",
        icon: "collaboration",
      },
      {
        title: "Résultats",
        body: "Le succès se mesure en conversions, opérations simplifiées et confiance de marque.",
        icon: "results",
      },
    ],
    numbers: [
      { value: "50+", label: "Projets livrés" },
      { value: "3", label: "Langues en production" },
      { value: "100%", label: "Code au client" },
      { value: "5", label: "Étapes du processus" },
    ],
  },
};

for (const locale of ["es", "en", "fr"] as const) {
  await payload.updateGlobal({
    slug: "about-page",
    locale,
    overrideAccess: true,
    data: aboutByLocale[locale],
  });
}

// ——— Project media ———
const archiesCover = await uploadFile(payload, "archies-home.png", "Archie's Pet Shop homepage");
const archiesProducts = await uploadFile(
  payload,
  "archies-products.png",
  "Archie's Pet Shop product catalogue",
);
const repatCover = await uploadFile(payload, "repat-home.png", "REPAT Global homepage");
const repatInventory = await uploadFile(payload, "repat-inventario.png", "REPAT Global live inventory");
const austinCover = await uploadFile(payload, "austin-home.png", "Austin TX Carne en Vara homepage");
const austinMenu = await uploadFile(payload, "austin-menu.png", "Austin TX Carne en Vara menu");
const archiesMobile = await uploadOptional(payload, "archies-home-mobile.png", "Archie's Pet Shop — mobile");
const repatMobile = await uploadOptional(payload, "repat-home-mobile.png", "REPAT Global — mobile");
const austinMobile = await uploadOptional(payload, "austin-home-mobile.png", "Austin TX Carne en Vara — mobile");

await upsertProject(
  payload,
  "archies-pet-shop",
  {
    year: 2026,
    stack: ["Next.js", "Payload CMS", "MongoDB", "Square", "Cloudinary"],
    cover: archiesCover,
    desktopImage: archiesCover,
    ...(archiesMobile ? { mobileImage: archiesMobile } : {}),
    liveUrl: "https://www.archiespetshop.com/",
    featured: true,
    order: 1,
    status: "published",
    categories: ["ecommerce", "website"],
  },
  {
    es: {
      title: "Archie's Pet Shop",
      description:
        "Tienda boutique en Caracas — catálogo, carrito, checkout y un admin en español que el equipo usa de verdad.",
      client: "Archie's Pet Shop",
      industry: "Retail / mascotas",
      platform: "Next.js + Payload CMS",
      servicesOffered: ["Diseño web", "Desarrollo", "E-commerce"],
      challenge:
        "Operar catálogo, stock y pedidos sin un desarrollador en el loop, con vitrina boutique en español y pagos locales.",
      solution:
        "E-commerce en Next.js con Payload: catálogo editable, checkout Square + Pago Móvil, envíos por transportistas venezolanos.",
      deliverables: [
        "Vitrina y checkout",
        "Admin de catálogo e inventario",
        "Integración Square y Pago Móvil",
        "Zonas de envío MRW, Tealca, Zoom",
      ],
      images: [
        {
          image: archiesCover,
          alt: "Hero de inicio y grilla de categorías",
          caption: "Vitrina en español, construida alrededor del catálogo.",
        },
        {
          image: archiesProducts,
          alt: "Listado de productos",
          caption: "Productos publicados, precios en Bs. y merchandising destacado.",
        },
      ],
      aside:
        "Los pagos mezclan tarjetas Square con Pago Móvil. El envío es por transportistas venezolanos, no una tabla genérica de tarifas.",
      body: body([
        heading("Contexto"),
        paragraph(
          "Archie's necesitaba una tienda que el equipo pudiera operar sin un desarrollador de por medio: productos, stock, pedidos y los textos de las páginas legales. El sitio público tenía que quedarse en español y verse boutique, no como un marketplace genérico.",
        ),
        heading("Qué construimos"),
        bulletList([
          "Catálogo en Payload — productos, categorías, inventario y reseñas — editado en /admin.",
          "Vitrina con carrito, cuenta, checkout e historial de pedidos en Next.js App Router.",
          "Pagos con tarjeta Square más los datos de Pago Móvil desde el global de ajustes.",
          "Zonas de envío para MRW, Tealca y Zoom, con tasas BCV actualizadas en un cron.",
          "Media en Cloudinary, correo con Resend y contacto por WhatsApp, cableados al mismo CMS.",
        ]),
        heading("Detalles"),
        paragraph(
          "Los editores publican en Payload; la vitrina lee Local API. Los roles separan admin, editor y cliente para que el piso de venta nunca vea la pantalla equivocada.",
        ),
      ]),
    },
    en: {
      title: "Archie's Pet Shop",
      description:
        "A Caracas boutique storefront — catalogue, cart, checkout and a Spanish admin the staff actually uses.",
      client: "Archie's Pet Shop",
      industry: "Retail / pet supplies",
      platform: "Next.js + Payload CMS",
      servicesOffered: ["Web design", "Development", "E-commerce"],
      challenge:
        "Run catalogue, stock and orders without a developer in the loop, with a boutique Spanish storefront and local payments.",
      solution:
        "Next.js e-commerce with Payload: editable catalogue, Square + Pago Móvil checkout, shipping via Venezuelan carriers.",
      deliverables: [
        "Storefront and checkout",
        "Catalogue and inventory admin",
        "Square and Pago Móvil integration",
        "MRW, Tealca, Zoom shipping zones",
      ],
      images: [
        {
          image: archiesCover,
          alt: "Homepage hero and category grid",
          caption: "Storefront in Spanish, built around the catalogue.",
        },
        {
          image: archiesProducts,
          alt: "Product listing",
          caption: "Published products, prices in Bs. and featured merchandising.",
        },
      ],
      aside:
        "Payments mix Square cards with local Pago Móvil. Shipping is Venezuelan carriers, not a generic rate table.",
      body: body([
        heading("Context"),
        paragraph(
          "Archie's needed a shop the team could run without a developer in the loop: products, stock, orders and the copy on legal pages. The public site had to stay in Spanish and match a boutique, not a generic marketplace.",
        ),
        heading("What we built"),
        bulletList([
          "Payload catalogue — products, categories, inventory sync and reviews — edited in /admin.",
          "Storefront with cart, account, checkout and order history on Next.js App Router.",
          "Square card payments plus Pago Móvil details from the settings global.",
          "Shipping zones for MRW, Tealca and Zoom, with BCV rates fetched on a schedule.",
          "Cloudinary media, Resend mail and WhatsApp contact, wired through the same CMS.",
        ]),
        heading("Notable details"),
        paragraph(
          "Editors publish in Payload; the storefront reads Local API. Roles split admin, editor and customer so the shop floor never sees the wrong screen.",
        ),
      ]),
    },
    fr: {
      title: "Archie's Pet Shop",
      description:
        "Boutique à Caracas — catalogue, panier, checkout et un admin en espagnol que l'équipe utilise au quotidien.",
      client: "Archie's Pet Shop",
      industry: "Retail / animaux",
      platform: "Next.js + Payload CMS",
      servicesOffered: ["Design web", "Développement", "E-commerce"],
      challenge:
        "Gérer catalogue, stock et commandes sans développeur, avec une vitrine boutique en espagnol et paiements locaux.",
      solution:
        "E-commerce Next.js avec Payload : catalogue éditable, checkout Square + Pago Móvil, livraison via transporteurs vénézuéliens.",
      deliverables: [
        "Vitrine et checkout",
        "Admin catalogue et inventaire",
        "Intégration Square et Pago Móvil",
        "Zones MRW, Tealca, Zoom",
      ],
      images: [
        {
          image: archiesCover,
          alt: "Hero d'accueil et grille de catégories",
          caption: "Vitrine en espagnol, centrée sur le catalogue.",
        },
        {
          image: archiesProducts,
          alt: "Liste de produits",
          caption: "Produits publiés, prix en Bs. et merchandising.",
        },
      ],
      aside:
        "Paiements Square et Pago Móvil local. Livraison via transporteurs vénézuéliens, pas un tableau générique.",
      body: body([
        heading("Contexte"),
        paragraph(
          "Archie's avait besoin d'une boutique gérable sans développeur : produits, stock, commandes et pages légales. La vitrine devait rester en espagnol et boutique, pas marketplace générique.",
        ),
        heading("Livraison"),
        bulletList([
          "Catalogue Payload — produits, catégories, inventaire, avis — dans /admin.",
          "Vitrine panier, compte, checkout et historique sur Next.js App Router.",
          "Paiements Square et Pago Móvil depuis les réglages.",
          "Zones MRW, Tealca, Zoom avec taux BCV planifiés.",
          "Cloudinary, Resend et WhatsApp via le même CMS.",
        ]),
        heading("Détails"),
        paragraph(
          "Publication dans Payload ; vitrine en Local API. Rôles admin, éditeur et client séparés.",
        ),
      ]),
    },
  },
);

await upsertProject(
  payload,
  "repat-global",
  {
    year: 2026,
    stack: ["Next.js", "Payload CMS", "MongoDB", "Square", "NextAuth"],
    cover: repatCover,
    desktopImage: repatCover,
    ...(repatMobile ? { mobileImage: repatMobile } : {}),
    liveUrl: "https://repatglobal.com/",
    featured: false,
    order: 2,
    status: "published",
    categories: ["website", "ecommerce"],
  },
  {
    es: {
      title: "REPAT Global",
      description:
        "Importación de vehículos a Venezuela — inventario en vivo, reservas y un depósito Square que la oficina puede conciliar.",
      client: "REPAT Global",
      industry: "Automotriz / importación",
      platform: "Next.js + Payload CMS",
      servicesOffered: ["Desarrollo", "E-commerce", "Presencia digital"],
      challenge:
        "Mostrar stock internacional con honestidad y permitir reservas con depósito sin vender el mismo vehículo dos veces.",
      solution:
        "Inventario en Payload, reservas con sesión, depósito Square y rutas dinámicas en checkout y perfil.",
      deliverables: [
        "Inventario público y filtros",
        "Flujo de reserva con depósito",
        "Integración Square OAuth",
        "Cotizaciones y herramientas VIN",
      ],
      images: [
        {
          image: repatCover,
          alt: "Inicio de REPAT",
          caption: "Narrativa de importación, marcas y stock destacado.",
        },
        {
          image: repatInventory,
          alt: "Grilla de inventario",
          caption: "Disponibilidad, precio y estado viven en Payload.",
        },
      ],
      aside:
        "Las reservas toman un depósito en USD por Square. El vehículo se bloquea cuando el pago se completa.",
      body: body([
        heading("Contexto"),
        paragraph(
          "REPAT vende autos que están en bodegas internacionales, en tránsito o ya en Venezuela. El sitio tenía que mostrar ese stock con honestidad y dejar que un comprador con sesión reserve un vehículo sin una llamada.",
        ),
        heading("Qué construimos"),
        bulletList([
          "Collection de vehículos con disponibilidad, VIN y galerías de fotos.",
          "Inventario público y flujo de reserva en la vitrina.",
          "Square Web Payments para el depósito; las credenciales OAuth viven en ajustes.",
          "NextAuth para compradores; auth de Payload para el equipo.",
          "Cotizaciones, páginas legales y herramientas de VIN en el mismo admin.",
        ]),
        heading("Detalles"),
        paragraph(
          "El inicio y el inventario cachean en una ventana ISR corta. Checkout, perfil y pagos se quedan dinámicos para que un auto reservado no se venda dos veces desde una página vieja.",
        ),
      ]),
    },
    en: {
      title: "REPAT Global",
      description:
        "Vehicle import for Venezuela — live inventory, reservations and a Square deposit the office can reconcile.",
      client: "REPAT Global",
      industry: "Automotive / import",
      platform: "Next.js + Payload CMS",
      servicesOffered: ["Development", "E-commerce", "Digital presence"],
      challenge:
        "Show international stock honestly and enable deposit reservations without selling the same vehicle twice.",
      solution:
        "Payload inventory, authenticated reservations, Square deposit and dynamic checkout and profile routes.",
      deliverables: [
        "Public inventory and filters",
        "Reservation flow with deposit",
        "Square OAuth integration",
        "Quotes and VIN tools",
      ],
      images: [
        {
          image: repatCover,
          alt: "REPAT homepage",
          caption: "Import narrative, brands and featured stock.",
        },
        {
          image: repatInventory,
          alt: "Inventory grid",
          caption: "Availability, price and status stay in Payload.",
        },
      ],
      aside: "Reservations take a USD deposit through Square. The vehicle locks when the payment completes.",
      body: body([
        heading("Context"),
        paragraph(
          "REPAT sells cars that are in international warehouses, in transit, or already in Venezuela. The site had to show that stock honestly and let a logged-in buyer reserve a vehicle without a phone call.",
        ),
        heading("What we built"),
        bulletList([
          "Vehicles collection with availability, VIN handling and photo galleries.",
          "Public inventory and reservation flow on the storefront.",
          "Square Web Payments for the deposit; OAuth credentials live in settings.",
          "NextAuth for buyers; Payload auth for staff.",
          "Quote requests, legal pages and VIN decode tools in the same admin.",
        ]),
        heading("Notable details"),
        paragraph(
          "The homepage and inventory cache on a short ISR window. Checkout, profile and payment routes stay dynamic so a reserved car cannot be sold twice from a stale page.",
        ),
      ]),
    },
    fr: {
      title: "REPAT Global",
      description:
        "Import de véhicules au Venezuela — inventaire en direct, réservations et acompte Square conciliable.",
      client: "REPAT Global",
      industry: "Automobile / import",
      platform: "Next.js + Payload CMS",
      servicesOffered: ["Développement", "E-commerce", "Présence digitale"],
      challenge:
        "Afficher le stock international honnêtement et permettre des réservations avec acompte sans double vente.",
      solution:
        "Inventaire Payload, réservations authentifiées, acompte Square et routes checkout/profil dynamiques.",
      deliverables: [
        "Inventaire public et filtres",
        "Parcours de réservation avec acompte",
        "Intégration Square OAuth",
        "Devis et outils VIN",
      ],
      images: [
        {
          image: repatCover,
          alt: "Page d'accueil REPAT",
          caption: "Récit d'import, marques et stock mis en avant.",
        },
        {
          image: repatInventory,
          alt: "Grille d'inventaire",
          caption: "Disponibilité, prix et statut dans Payload.",
        },
      ],
      aside: "Les réservations prennent un acompte USD via Square. Le véhicule se verrouille au paiement.",
      body: body([
        heading("Contexte"),
        paragraph(
          "REPAT vend des véhicules en entrepôt international, en transit ou au Venezuela. Le site devait montrer ce stock honnêtement et permettre la réservation connectée sans appel.",
        ),
        heading("Livraison"),
        bulletList([
          "Collection véhicules avec disponibilité, VIN et galeries.",
          "Inventaire public et réservation sur la vitrine.",
          "Square Web Payments pour l'acompte ; OAuth dans les réglages.",
          "NextAuth acheteurs ; auth Payload pour l'équipe.",
          "Devis, pages légales et outils VIN dans le même admin.",
        ]),
        heading("Détails"),
        paragraph(
          "Accueil et inventaire en ISR court. Checkout, profil et paiement restent dynamiques pour éviter la double vente.",
        ),
      ]),
    },
  },
);

await upsertProject(
  payload,
  "austin-tx-carne-en-vara",
  {
    year: 2026,
    stack: ["Next.js", "Payload CMS", "MongoDB", "next-intl", "Resend"],
    cover: austinCover,
    desktopImage: austinCover,
    ...(austinMobile ? { mobileImage: austinMobile } : {}),
    liveUrl: "https://www.austintxcarneenvara.com/en",
    featured: false,
    order: 3,
    status: "published",
    categories: ["website"],
  },
  {
    es: {
      title: "Austin TX Carne en Vara",
      description:
        "Sitio bilingüe de restaurante — menú, paquetes de catering y cotizaciones que la cocina lee en el CMS.",
      client: "Austin TX Carne en Vara",
      industry: "Restaurantes / food service",
      platform: "Next.js + Payload CMS",
      servicesOffered: ["Diseño web", "Desarrollo", "Presencia digital"],
      challenge:
        "Sitio en inglés y español con menú editable y un camino de catering que no pierda consultas en el inbox.",
      solution:
        "Locales en Payload y next-intl, platos como collections, cotizaciones vía Route Handler y Resend.",
      deliverables: [
        "Sitio bilingüe /en y /es",
        "Menú y catering en CMS",
        "Formulario de cotización",
        "Integración Resend",
      ],
      images: [
        {
          image: austinCover,
          alt: "Inicio del restaurante",
          caption: "Inglés y español comparten un modelo de locales en Payload.",
        },
        {
          image: austinMenu,
          alt: "Página de menú",
          caption: "Platos y precios salen de la collection de dishes.",
        },
      ],
      aside:
        "No hay checkout en línea. El camino comercial es una cotización: se guarda en Payload y se envía con Resend.",
      body: body([
        heading("Contexto"),
        paragraph(
          "Una cocina venezolana a fuego vivo en Austin necesitaba un sitio que funcione en inglés y español, con un menú que los dueños puedan editar y un camino de catering que no deje las consultas en un inbox vacío.",
        ),
        heading("Qué construimos"),
        bulletList([
          "Contenido localizado en Payload para inicio, menú, catering y about.",
          "Rutas con next-intl para que /en y /es se mantengan alineados con los locales del CMS.",
          "Platos y paquetes de catering como collections; la copia de página como globals.",
          "Formulario de cotización → Zod en el servidor → collection de quote-requests → Resend.",
          "Media en Cloudinary y un catálogo de respaldo si Mongo está vacío.",
        ]),
        heading("Detalles"),
        paragraph(
          "El sitio público nunca habla con Payload REST desde el navegador. Los Server Components llaman Local API; el formulario pega a un Route Handler que la cocina ya confía.",
        ),
      ]),
    },
    en: {
      title: "Austin TX Carne en Vara",
      description:
        "A bilingual restaurant site — menu, catering packages and quote requests the kitchen can read in the CMS.",
      client: "Austin TX Carne en Vara",
      industry: "Restaurants / food service",
      platform: "Next.js + Payload CMS",
      servicesOffered: ["Web design", "Development", "Digital presence"],
      challenge:
        "English and Spanish site with an editable menu and a catering path that does not lose enquiries in the inbox.",
      solution:
        "Payload locales and next-intl, dishes as collections, quotes via Route Handler and Resend.",
      deliverables: [
        "Bilingual site /en and /es",
        "Menu and catering in CMS",
        "Quote request form",
        "Resend integration",
      ],
      images: [
        {
          image: austinCover,
          alt: "Restaurant homepage",
          caption: "English and Spanish share one Payload locale model.",
        },
        {
          image: austinMenu,
          alt: "Menu page",
          caption: "Dishes and prices come from the dishes collection.",
        },
      ],
      aside: "There is no online checkout. The commercial path is a quote — saved in Payload and mailed with Resend.",
      body: body([
        heading("Context"),
        paragraph(
          "A live-fire Venezuelan kitchen in Austin needed a site that works in English and Spanish, with a menu the owners can edit and a catering path that does not dump enquiries into a blank inbox.",
        ),
        heading("What we built"),
        bulletList([
          "Localized Payload content for home, menu, catering and about.",
          "next-intl routing so /en and /es stay in sync with CMS locales.",
          "Dishes and catering packages as collections; page copy as globals.",
          "Quote form → Zod on the server → quote-requests collection → Resend.",
          "Cloudinary media and a fallback catalogue if Mongo is empty.",
        ]),
        heading("Notable details"),
        paragraph(
          "The public site never talks to Payload REST from the browser. Server Components call Local API; the form posts to a Route Handler the kitchen already trusts.",
        ),
      ]),
    },
    fr: {
      title: "Austin TX Carne en Vara",
      description:
        "Site de restaurant bilingue — menu, catering et devis que la cuisine consulte dans le CMS.",
      client: "Austin TX Carne en Vara",
      industry: "Restauration",
      platform: "Next.js + Payload CMS",
      servicesOffered: ["Design web", "Développement", "Présence digitale"],
      challenge:
        "Site anglais et espagnol avec menu éditable et parcours catering sans perdre les demandes.",
      solution:
        "Locales Payload et next-intl, plats en collections, devis via Route Handler et Resend.",
      deliverables: [
        "Site bilingue /en et /es",
        "Menu et catering dans le CMS",
        "Formulaire de devis",
        "Intégration Resend",
      ],
      images: [
        {
          image: austinCover,
          alt: "Accueil du restaurant",
          caption: "Anglais et espagnol partagent le modèle de locales Payload.",
        },
        {
          image: austinMenu,
          alt: "Page menu",
          caption: "Plats et prix depuis la collection dishes.",
        },
      ],
      aside:
        "Pas de checkout en ligne. Le parcours commercial est un devis — enregistré dans Payload et envoyé via Resend.",
      body: body([
        heading("Contexte"),
        paragraph(
          "Une cuisine vénézuélienne au feu de bois à Austin avait besoin d'un site EN/ES, menu éditable et parcours catering fiable.",
        ),
        heading("Livraison"),
        bulletList([
          "Contenu localisé Payload pour accueil, menu, catering et about.",
          "Routage next-intl aligné avec les locales CMS.",
          "Plats et packages catering en collections ; copy en globals.",
          "Formulaire devis → Zod → quote-requests → Resend.",
          "Media Cloudinary et catalogue de secours.",
        ]),
        heading("Détails"),
        paragraph(
          "Pas de REST Payload côté navigateur. Server Components en Local API ; formulaire vers Route Handler.",
        ),
      ]),
    },
  },
);

// ——— Legal pages ———
const legalIntro = (locale: Locale, kind: LegalSlug) => {
  const titles: Record<LegalSlug, Record<Locale, string>> = {
    privacy: {
      es: "Política de privacidad",
      en: "Privacy policy",
      fr: "Politique de confidentialité",
    },
    terms: {
      es: "Términos de uso",
      en: "Terms of use",
      fr: "Conditions d'utilisation",
    },
    cookies: {
      es: "Política de cookies",
      en: "Cookie policy",
      fr: "Politique de cookies",
    },
  };
  const blurbs: Record<LegalSlug, Record<Locale, string>> = {
    privacy: {
      es: "WC Digital respeta tu privacidad. Este texto es un placeholder legal — sustitúyelo por el copy revisado por tu asesor.",
      en: "WC Digital respects your privacy. This is placeholder legal copy — replace it with text reviewed by your counsel.",
      fr: "WC Digital respecte votre vie privée. Texte placeholder — remplacez-le par un contenu validé par votre conseil.",
    },
    terms: {
      es: "Al usar este sitio aceptas estos términos provisionales. Actualiza este documento antes de producción.",
      en: "By using this site you accept these provisional terms. Update this document before production.",
      fr: "En utilisant ce site vous acceptez ces conditions provisoires. Mettez à jour ce document avant la mise en production.",
    },
    cookies: {
      es: "Usamos cookies esenciales y, si las activas, analíticas. Detalla aquí categorías y opt-out según tu jurisdicción.",
      en: "We use essential cookies and, if enabled, analytics. Detail categories and opt-out for your jurisdiction here.",
      fr: "Nous utilisons des cookies essentiels et, si activés, analytiques. Détaillez catégories et opt-out ici.",
    },
  };
  return {
    title: titles[kind][locale],
    body: body([heading(titles[kind][locale]), paragraph(blurbs[kind][locale])]),
  };
};

for (const slug of ["privacy", "terms", "cookies"] as const) {
  await upsertLegalPage(payload, slug, {
    es: legalIntro("es", slug),
    en: legalIntro("en", slug),
    fr: legalIntro("fr", slug),
  });
}

console.log(
  "Seeded WC Digital: settings, home/services/process/about globals, 3 projects, legal pages (es + en + fr).",
);
process.exit(0);
