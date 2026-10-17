import type { Access, CollectionConfig } from "payload";

const isAdmin: Access = ({ req: { user } }) => user?.role === "admin";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Página legal", plural: "Páginas legales" },
  admin: {
    group: "Sitio",
    useAsTitle: "title",
    defaultColumns: ["title", "slug"],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "slug",
      type: "select",
      required: true,
      unique: true,
      options: [
        { label: "Privacy", value: "privacy" },
        { label: "Terms", value: "terms" },
        { label: "Cookies", value: "cookies" },
      ],
    },
    { name: "title", type: "text", required: true, localized: true },
    { name: "body", type: "richText", required: true, localized: true },
  ],
};
