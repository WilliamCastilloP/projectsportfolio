import type { GlobalConfig } from "payload";

export const ProcessPage: GlobalConfig = {
  slug: "process-page",
  label: "Página Process",
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
      name: "steps",
      type: "array",
      localized: true,
      labels: { singular: "Paso", plural: "Pasos" },
      fields: [
        { name: "number", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
        { name: "icon", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
