import type { GlobalConfig } from "payload";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "Página About",
  admin: { group: "Sitio" },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "eyebrow", type: "text", localized: true, label: "Eyebrow" },
    {
      name: "hero",
      type: "group",
      label: "Hero",
      fields: [
        { name: "headlineLines", type: "text", hasMany: true, localized: true },
        { name: "emphasis", type: "text", localized: true },
        { name: "body", type: "textarea", localized: true },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "founder",
      type: "group",
      label: "Founder",
      fields: [
        { name: "name", type: "text", localized: true },
        { name: "role", type: "text", localized: true },
        { name: "note", type: "text", localized: true },
        { name: "bio", type: "textarea", localized: true },
        { name: "photo", type: "upload", relationTo: "media" },
        { name: "signature", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "mission",
      type: "group",
      label: "Mission",
      fields: [
        { name: "eyebrow", type: "text", localized: true },
        { name: "title", type: "text", localized: true },
        { name: "body", type: "textarea", localized: true },
      ],
    },
    {
      name: "values",
      type: "array",
      localized: true,
      label: "Values",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
        { name: "icon", type: "text" },
      ],
    },
    {
      name: "numbers",
      type: "array",
      localized: true,
      label: "Numbers",
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
      ],
    },
    {
      name: "numbersImage",
      type: "upload",
      relationTo: "media",
      label: "Imagen sección números",
    },
  ],
};
