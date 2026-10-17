/**
 * Fallback identity when Payload settings are empty.
 * Default copy is Spanish — the live source of truth is Payload + messages/*.json.
 */

export type SiteMode = "person" | "company";

export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export const site = {
  mode: "company" as SiteMode,
  name: "WC Digital",
  role: "Estudio de producto",
  timeZone: "America/Caracas",
  location: "Américas",
  email: "hello@wcdigital.studio",
  url: "https://wcdigital.studio",

  hero: {
    headline: ["Software que", "mueve el negocio."],
    intro:
      "WCTech es un estudio de producto. Diseñamos y entregamos plataformas web — tiendas, inventarios y el CMS detrás — como un código que el cliente se queda.",
  },

  about: {
    person: {
      heading: "Nosotros",
      body: [
        "Diseño y desarrollo de productos web de punta a punta — del modelo de datos a la última curva.",
      ],
      facts: [
        { label: "Enfoque", value: "Ingeniería de producto" },
        { label: "Stack", value: "Next.js · Payload" },
        { label: "Disponibilidad", value: "Abierto a trabajo nuevo" },
      ],
    },
    company: {
      heading: "El estudio",
      body: [
        "Tomamos pocos encargos a la vez para que quienes definen el trabajo sean quienes lo construyen.",
        "Descubrimiento, interfaz e implementación salen juntos: un producto en marcha y un código que tu equipo puede conservar.",
      ],
      facts: [
        { label: "Práctica", value: "Diseño e ingeniería" },
        { label: "Stack", value: "Next.js · Payload CMS" },
        { label: "Disponibilidad", value: "Tomamos proyectos nuevos" },
      ],
    },
  },

  contact: {
    heading: "Contacto",
    body: "Lo más rápido es el correo. Leemos todo y respondemos a un brief con un pedido claro.",
  },

  nav: [
    { label: "Trabajo", href: "/#work" },
    { label: "Estudio", href: "/about" },
    { label: "Contacto", href: "/#contact" },
  ] satisfies NavLink[],

  socials: [] as SocialLink[],
} as const;

export const isCompany = site.mode === "company";
export const aboutContent = site.about[site.mode];
