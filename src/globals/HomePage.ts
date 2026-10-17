import type { GlobalConfig } from "payload";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Página Home",
  admin: { group: "Sitio" },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "eyebrow", type: "text", label: "Eyebrow", localized: true },
    {
      name: "headline",
      type: "group",
      label: "Titular",
      fields: [
        { name: "lines", type: "text", hasMany: true, localized: true, label: "Líneas" },
        { name: "emphasis", type: "text", localized: true, label: "Palabra en itálica" },
      ],
    },
    { name: "intro", type: "textarea", localized: true, label: "Intro" },
    {
      name: "floatingNotes",
      type: "array",
      label: "Notas flotantes",
      localized: true,
      fields: [{ name: "text", type: "text", required: true }],
    },
    {
      name: "servicesTeaser",
      type: "group",
      label: "Teaser servicios",
      fields: [
        { name: "eyebrow", type: "text", localized: true },
        { name: "title", type: "text", localized: true },
        { name: "emphasis", type: "text", localized: true },
      ],
    },
    {
      name: "workTeaser",
      type: "group",
      label: "Teaser trabajo",
      fields: [
        { name: "eyebrow", type: "text", localized: true },
        { name: "title", type: "text", localized: true },
        { name: "emphasis", type: "text", localized: true },
      ],
    },
  ],
};
