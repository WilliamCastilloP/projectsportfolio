import type { Access, CollectionConfig } from "payload";

const isStaff: Access = ({ req: { user } }) =>
  ["admin", "editor"].includes(user?.role ?? "");

const isAdmin: Access = ({ req: { user } }) => user?.role === "admin";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Archivo", plural: "Media" },
  admin: {
    group: "Trabajo",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  upload: true,
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo",
    },
  ],
};
