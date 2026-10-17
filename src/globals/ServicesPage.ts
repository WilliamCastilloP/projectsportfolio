import type { GlobalConfig } from "payload";

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  label: "Página Services",
  admin: { group: "Sitio" },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "eyebrow", type: "text", localized: true },
    { name: "title", type: "text", localized: true },
    { name: "emphasis", type: "text", localized: true },
    { name: "intro", type: "textarea", localized: true },
    {
      name: "items",
      type: "array",
      localized: true,
      labels: { singular: "Servicio", plural: "Servicios" },
      fields: [
        { name: "slug", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "subtitle", type: "text" },
        { name: "body", type: "textarea", required: true },
        { name: "bullets", type: "text", hasMany: true },
        { name: "illustration", type: "text", admin: { description: "Clave en /public/illustrations/services/" } },
        { name: "order", type: "number", defaultValue: 1 },
      ],
    },
  ],
};
